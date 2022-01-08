import db from './dbConnector'

import authMiddleware from './authMiddleware';

import prisma from './db/prisma';

const express = require('express');

const expressSession = require('express-session')

const { PrismaSessionStore } = require('@quixo3/prisma-session-store')



const userMetaData = (req) => ({
    createdBy: req.session.auth.user.name,
    updatedBy: req.session.auth.user.name,
    createdById: req.session.auth.user.id,
    updatedById: req.session.auth.user.id,
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        },
        secret: 'liturgyplanner',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
)

// AUTH - can be accessed by everyone

app.get('/auth/status', (req, res) => {
    res.status(200).json(req.session)
})

app.post('/auth/register', async(req, res) => {
    if (req.body.method === 'aad') {

        const user = await db.User.registerFromAAD(req.body.accessToken)

        req.session.auth = {
            signedIn: true,
            user,
        }
    }
    res.sendStatus(200)
})

// RESTRICTED - user need to be authorized

app.use(authMiddleware)

app.get('/users', async(_, res) => {
    res.status(200).json(await db.User.getAll());
})

app.get('/users/:id/assignments/future', async(req, res) => {
    res.status(200).json(await db.User.getAssignments(req.params.id));
})

// events

app.get('/events/future', async(_, res) => {
    res.status(200).json(
        await db.Event.getAll('future')
    )
})
app.get('/events/past', async(_, res) => {
    res.status(200).json(
        await db.Event.getAll('past')
    )
})

app.get('/events/:id', async(req, res) => {
    res.status(200).json(await db.Event.getById(req.params.id))
})
app.get('/occasions/:id/schedule', async(req, res) => {
    res.status(200).json(await db.Schedule.getForOccasion(req.params.id))
})

app.get('/services', async(_, res) => {
    res.status(200).json(await db.Service.getAll())
})

// EDITOR

// schedule

app.post('/schedule', async(req, res) => {
    await db.Schedule.create({...req.body, ...userMetaData(req) })
    res.sendStatus(200)
})
app.put('/schedule/:id', async(req, res) => {
    await db.Schedule.update(req.params.id, {...req.body, ...userMetaData(req) })
    res.sendStatus(200)
})
app.delete('/schedule/:id', async(req, res) => {
    await db.Schedule.del(req.params.id);
    res.sendStatus(200)
})

// ADMIN

// occasions 
app.post('/occasions', async(req, res) => {
    try {
        const { occasions, eventSchemes } = req.body;
        await db.Occasion.createBatch(occasions.map(occasion => ({
            ...occasion,
            ...userMetaData(req),
        })), eventSchemes)
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json(err)
    }
})

// asignments

app.post('/assignments', async(req, res) => {
    try {
        const assignment = await db.Assignment.create({...req.body, ...userMetaData(req) })
        res.status(200).json(assignment)
    } catch (err) {
        res.status(500).json(err)
    }
})

app.delete('/assignments', async(req, res) => {
    try {
        await db.Assignment.deleteEl(req.body)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).json(err)
    }
})

// users

app.get('/users/AAD', async(_, res) => {
    const users = await db.User.getAllFromAAD();
    res.status(200).json(users.filter((user) => user.givenName && user.surname))
})

app.post('/users', async(req, res) => {
    try {
        await db.User.create(req.body);
        res.status(200).json(user)
    } catch {
        res.sendStatus(500)
    }
})

module.exports = app
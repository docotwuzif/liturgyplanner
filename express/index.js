import { PrismaClient, AuthProvider } from '@prisma/client'
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

const axios = require('axios').default;
const express = require('express');

const prisma = new PrismaClient()

const authMiddleware = require('./authMiddleware');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: 'liturgyplanner',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            prisma, {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);


// AUTH - can be accessed by everyone

app.get('/auth/status', (req, res) => {
    res.status(200).json(req.session);
});

app.post('/auth/register', async(req, res) => {
    if (req.body.method === 'aad') {
        const userdata = await axios.get("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: `Bearer ${req.body.accessToken}`
            }
        });


        let user = await prisma.user.findUnique({
            where: {
                uid: userdata.data.id
            }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    authProvider: AuthProvider.AAD,
                    email: userdata.data.mail,
                    uid: userdata.data.id,
                    name: userdata.data.displayName
                }
            })
        }

        req.session.auth = {
            signedIn: true,
            user
        };
    }
    res.sendStatus(200);
});

// RESTRICTED - user need to be authorized

app.use(authMiddleware);

app.get('/events', async(_, res) => {
    res.status(200).json(await prisma.event.findMany());
})
app.get('/user/:id/assignments/future', async(req, res) => {
    const assignments = await prisma.assignment.findMany({
        where: {
            userId: Number.parseInt(req.params.id),
            event: {
                date: {
                    gte: new Date(),
                }
            }
        },
        select: {
            event: true,
            service: true
        }
    });
    res.status(200).json(assignments);
})
app.get('/events/:id', async(req, res) => {
    res.status(200).json(await prisma.event.findUnique({
        where: {
            id: Number.parseInt(req.params.id)
        },
        select: {
            name: true,
            date: true,
            occasion: {
                select: {
                    id: true,
                    name: true
                }
            },
            assignments: {
                select: {
                    service: true,
                    user: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            },

        }
    }));
})
app.get('/occasions/:id/schedule', async(req, res) => {
    res.status(200).json(await prisma.scheduleElement.findMany({
        where: {
            occasionId: Number.parseInt(req.params.id)
        },
        orderBy: {
            order: 'asc'
        }
    }));
})

app.get('/services', async(_, res) => {
    res.status(200).json(await prisma.service.findMany());
})










module.exports = app;
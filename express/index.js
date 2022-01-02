import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const express = require('express');
const app = express();



app.get('/events', async(_, res) => {
    res.status(200).json(await prisma.event.findMany());
})

module.exports = app;
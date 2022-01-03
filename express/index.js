import { PrismaClient, AuthProvider } from '@prisma/client'
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

const axios = require('axios').default;
const express = require('express');

let prisma

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }

    prisma = global.prisma
}

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

app.get('/events/future', async(_, res) => {
    res.status(200).json(await prisma.event.findMany({
        where: {
            date: {
                gte: new Date(),
            }
        },
        select: {
            id: true,
            name: true,
            date: true,
            occasion: true
        },
        orderBy: {
            date: 'asc'
        }
    }));
})
app.get('/events/past', async(_, res) => {
    res.status(200).json(await prisma.event.findMany({
        where: {
            date: {
                lte: new Date(),
            }
        },
        select: {
            id: true,
            name: true,
            date: true,
            occasion: true
        },
        orderBy: {
            date: 'desc'
        }
    }));
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
        orderBy: {
            event: {
                date: 'asc',
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
            id: true,
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
        },
        select: {
            id: true,
            source: true,
            sourceRef: true,
            position: true,
            title: true,
            remarks: true,
            type: true,
            attachmentUrls: true,
            events: true
        }
    }));
})
app.post('/schedule', async(req, res) => {
    const { position, source, sourceRef, title, remarks, order, occasionId, type } = req.body;
    await prisma.scheduleElement.create({
        data: {
            position,
            source,
            sourceRef,
            title,
            remarks,
            order,
            occasion: {
                connect: {
                    id: occasionId
                }
            },
            type,
            createdBy: req.session.auth.user.name,
            updatedBy: req.session.auth.user.name,
            createdById: req.session.auth.user.id,
            updatedById: req.session.auth.user.id,
        }
    });
    res.sendStatus(200);
})
app.put('/schedule/:id', async(req, res) => {
    const { position, source, sourceRef, title, remarks, order } = req.body;
    await prisma.scheduleElement.update({
        where: {
            id: Number.parseInt(req.body.id)
        },
        data: {
            position,
            source,
            sourceRef,
            title,
            remarks,
            order,
            updatedBy: req.session.auth.user.name,
            updatedById: req.session.auth.user.id,
        }
    });
    res.sendStatus(200);
})
app.delete('/schedule/:id', async(req, res) => {
    await prisma.scheduleElement.delete({
        where: {
            id: Number.parseInt(req.params.id)
        }
    });
    res.sendStatus(200);
});

app.get('/services', async(_, res) => {
    res.status(200).json(await prisma.service.findMany());
})










module.exports = app;
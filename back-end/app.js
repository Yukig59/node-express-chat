require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sMessage = require('./models/message');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) .then(() => console.log('Database connected successfully'))
    .catch(() => console.log('DB failed'));
// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.json());


    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });

    app.get('/test', (req, res, next) => {
        res.status(200).json({ hello: 'world' })
    })
    app.post('/message', (req, res, next) => {
        const message = new sMessage({...req.body });
        message.save().then(() => {
            res.status(201).json({ message: 'Message saved successfully' });
        }).catch((error) => {
            res.status(400).json({ error });
        })
    })
    app.get('/messages', (req, res, next) => {
        sMessage.find().then((messages) => {
            res.status(200).json(messages);
        }).catch((error) => {
            res.status(400).json({ error });
        })
    })
}
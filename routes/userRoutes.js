const express = require('express')
const { showUsers } = require('../controllers/userControllers')
const Router = express.Router();

// const users = require('../data.json')

Router.get('/', async (req, res) => {
    res.send('Welcome to GoWheels');
})

Router.get('/users', showUsers)

module.exports = Router;
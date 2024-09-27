const express = require('express')
const { showUsers,getUser } = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers)
Router.get('/users/:email', getUser);

module.exports = Router;
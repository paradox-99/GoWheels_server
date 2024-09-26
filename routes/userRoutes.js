const express = require('express')
const { showUsers } = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers)

module.exports = Router;
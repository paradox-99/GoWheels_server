const express = require('express')
const { showUsers,getUser, ownerInfo } = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers)
Router.get('/users/:email', getUser);
Router.post('/ownerInfo' , ownerInfo)

module.exports = Router;
const express = require('express')
const { showUsers,getUser, insertUser, updateOne, addOne, replaceData, ownerInfo} = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers);
Router.post('/user', insertUser);
Router.get('/users/:email', getUser);
Router.post('/ownerInfo' , ownerInfo)
Router.patch('/users/:email', updateOne);
Router.patch('/user/:email', addOne);
Router.put('/user/:email', replaceData);

module.exports = Router;
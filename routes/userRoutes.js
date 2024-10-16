const express = require('express')
const { showUsers,getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, checkUser, updateStatus} = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers);
Router.post('/user', insertUser);
Router.get('/users/:email', getUser);
Router.get('/check-user', checkUser);
Router.post('/ownerInfo' , ownerInfo);
Router.patch('/users/:email', updateOne);
Router.patch('/userStatus/:email', updateStatus);
Router.patch('/user/:email', addOne);
Router.put('/user/:email', replaceData);
Router.patch('/users/role/:id', updateRole)

module.exports = Router;
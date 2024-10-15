const express = require('express')
const { showUsers,getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, deleteUser, getModerators} = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers);
Router.post('/user', insertUser);
Router.get('/moderators', getModerators);
Router.get('/users/:email', getUser);
Router.post('/ownerInfo' , ownerInfo)
Router.patch('/users/:email', updateOne);
Router.patch('/user/:email', addOne);
Router.put('/user/:email', replaceData);
Router.patch('/users/role/:id', updateRole)
Router.delete('/deleteUser/:id', deleteUser)

module.exports = Router;
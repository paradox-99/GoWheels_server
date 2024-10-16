const express = require('express')
const { showUsers,getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, deleteUser, getModerators, driverInfo, checkUser} = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers);
Router.post('/user', insertUser);
Router.get('/moderators', getModerators);
Router.get('/check-user', checkUser);
Router.get('/users/:email', getUser);
Router.post('/ownerInfo' , ownerInfo)
Router.post('/driverInfo' , driverInfo)
Router.patch('/users/:email', updateOne);
Router.patch('/user/:email', addOne);
Router.put('/user/:email', replaceData);
Router.patch('/users/role/:id', updateRole)
Router.delete('/deleteUser/:id', deleteUser)

module.exports = Router;
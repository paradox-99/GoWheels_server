const express = require('express')
const { showUsers,getUser, insertUser, updateOne, addOne, replaceData, ownerInfo, updateRole, deleteUser, getModerators, driverInfo, checkUser, updateStatus, updateStatusEmailVerified, driverList} = require('../controllers/userControllers')
const Router = express.Router();

Router.get('/users', showUsers);
Router.get('/users/:email', getUser);
Router.post('/ownerInfo' , ownerInfo)
Router.post('/driverInfo' , driverInfo)
Router.post('/user', insertUser);
Router.get('/check-user', checkUser);
Router.patch('/users/:email', updateOne);
Router.patch('/userStatus/:email', updateStatus);
Router.patch('/emailVerified/:email', updateStatusEmailVerified);
Router.patch('/user/:email', addOne);
Router.put('/user/:email', replaceData);
Router.patch('/users/role/:id', updateRole)
Router.get('/driver', driverList)
Router.get('/moderators', getModerators);
Router.delete('/deleteUser/:id', deleteUser) 

module.exports = Router;
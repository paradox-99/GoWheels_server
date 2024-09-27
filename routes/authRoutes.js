const express = require('express');
const {generateToken} = require('../config/jwt')
const Router = express.Router();

Router.post('/jwt', async(req, res) => {
    const info = req.body;
    
    if(info){
        const token = generateToken(info);
        
        res.json({token});
    }
})

module.exports = Router;
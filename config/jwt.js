const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.ACCESS_TOKEN_SECRET

const generateToken = (email) => {
    const accessToken = jwt.sign(email, secretKey, { expiresIn: '1h' })
    return ({ accessToken });
}

const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    });
}

module.exports = { generateToken, verifyToken }
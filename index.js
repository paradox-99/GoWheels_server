const http = require('http');
const app = require('./app.js');
const dotenv = require('dotenv')

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer(app)

app.get('/', (req, res) => {
    res.send("server is running");
})

server.listen(port, () => {
    console.log("running on port: ", port);
})
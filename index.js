const http = require('http');
const { app } = require('./app.js');  // Adjust the import to destructure properly
const dotenv = require('dotenv');
const socketIO = require('socket.io');

dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: [
            '*',
            "http://localhost:5176",
            'http://localhost:5172',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://gowheels-99.web.app',
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send("server is running");
});

// Listen on the same server created in app.js
server.listen(port, () => {
    console.log("running on port: ", port);
});

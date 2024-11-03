const { app, server } = require('./app.js');  // Adjust the import to destructure properly
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("server is running");
});

// Listen on the same server created in app.js
server.listen(port, () => {
    console.log("running on port: ", port);
});

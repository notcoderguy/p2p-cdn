const express = require('express');
require('dotenv').config();
const mongooose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT;
const db = process.env.DATABASE_URL;
const userRouter = require('./routes/user');
const swarmRouter = require('./routes/swarm');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.use(express.json());

// Allow cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongooose.connect(db)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Route to provide information about the P2P-CDN project
app.get('/', (req, res) => {
    // JSON content describing the project and its contributors
    json_content = {
        "name": "P2P-CDN",
        "version": "1.0.0",
        "description": "P2P CDN is a distributed content delivery system where multiple users or devices share and deliver content, reducing scalability, cost, and single point of failure issues. Our solution spreads the load and storage across multiple users/devices, improving scalability, reliability, and reducing costs. It reduces bandwidth and content storage costs, and the load on the origin server. Our solution serves content as fast as any edge server and is designed for optimal performance.",
        "contributors": [
            {
                "name": "Vasu Grover",
                "regid": "RA1911003030248"
            },
            {
                "name": "Pranjal Tyagi",
                "regid": "RA1911003030249"
            },
            {
                "name": "Naman Kumar",
                "regid": "RA1911003030256"
            },
            {
                "name": "Aniket Sharma",
                "regid": "RA1911003030436"
            }
        ],
        "github": "https://github.com/notcoderguy/p2p-cdn",
    }
    res.json(json_content);
});

// Route for handling user-related operations
app.use('/users', userRouter);

// Route for handling swarm-related operations
app.use('/swarm', swarmRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });

    return;
});

// Listen for incoming socket connections
io.on('connection', (socket) => {
    let uuid;
    let swarmId;

    // Handle join messages
    socket.on('welcome', (data, swarm_data) => {
        // Handle join message from the sender
        // Forward the join message to the intended recipient
        uuid = data;
        swarmId = swarm_data;
        console.log(`User ${data} connected.`);
    });

    // Join swarm handler
    socket.on('joinSwarm', (data) => {
        // Handle join swarm message from the sender
        // Forward the join swarm message to the intended recipient
        socket.broadcast.emit('joinSwarm', data);
    });

    // Send data handler
    socket.on('sendData', (data) => {
        // Handle send data message from the sender
        // Forward the send data message to the intended recipient
        socket.broadcast.emit('sendData', data);
    });

    // ICE candidate handler
    socket.on('iceCandidate', (data) => {
        // Handle ICE candidate message from the sender
        // Forward the ICE candidate to the intended recipient
        socket.broadcast.emit('iceCandidate', data);
    });

    // Disconnect handler
    socket.on('disconnect', async () => {
        console.log(`User disconnected`);
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Signaling & API server running on http://localhost:${port}`);
});
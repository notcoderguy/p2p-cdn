const express = require("express");
require("dotenv").config();
const mongooose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT;
const db = process.env.DATABASE_URL;
const userRouter = require("./routes/user");
const swarmRouter = require("./routes/swarm");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const Redis = require("ioredis");
const redis = new Redis();

app.use(express.json());

// Allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongooose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Route to provide information about the P2P-CDN project
app.get("/", (req, res) => {
  // JSON content describing the project and its contributors
  json_content = {
    name: "P2P-CDN",
    version: "1.0.0",
    description:
      "P2P CDN is a distributed content delivery system where multiple users or devices share and deliver content, reducing scalability, cost, and single point of failure issues. Our solution spreads the load and storage across multiple users/devices, improving scalability, reliability, and reducing costs. It reduces bandwidth and content storage costs, and the load on the origin server. Our solution serves content as fast as any edge server and is designed for optimal performance.",
    contributors: [
      {
        name: "Vasu Grover",
        regid: "RA1911003030248",
      },
      {
        name: "Pranjal Tyagi",
        regid: "RA1911003030249",
      },
      {
        name: "Naman Kumar",
        regid: "RA1911003030256",
      },
      {
        name: "Aniket Sharma",
        regid: "RA1911003030436",
      },
    ],
    github: "https://github.com/notcoderguy/p2p-cdn",
  };
  res.json(json_content);
});

// Route for handling user-related operations
app.use("/users", userRouter);

// Route for handling swarm-related operations
app.use("/swarm", swarmRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

// Listen for incoming socket connections
io.on("connection", (socket) => {
  let uuid;
  let swarmId;
  // Handle join messages
  socket.on("welcome", (uuid_data, swarm_data) => {
    // Handle join message from the sender
    // Forward the join message to the intended recipient
    console.log(`User ${uuid_data} joined swarm ${swarm_data}`);
    uuid = uuid_data;
    swarmId = swarm_data;
    if (redis.exists(swarmId)) {
      redis.sadd(swarmId, uuid);
    } else {
      redis.sadd(swarmId, uuid);
      redis.expire(swarmId, 86400);
    }
    console.log(`User ${uuid} joined swarm ${swarmId}`);
    socket.emit("connectionConfirmation", uuid, swarmId);
  });

  socket.on("requestData", (swarmId, uuid, whichData) => {
    console.log(`User ${uuid} requested ${whichData} from swarm ${swarmId}`);
    redis.smembers(swarmId, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length > 1) {
          socket.broadcast.emit("hasData", swarmId, uuid, whichData);
        } else {
          console.log("No peers found in swarm. Instructing user to get data from origin server."); 
          socket.emit("noData", true);
        }
      }
    }); 
  });

  socket.on("sendData", (swarmId, uuid, data, status) => {
    if (status) {
      console.log(`User ${uuid} sent data to swarm ${swarmId}`);
      io.to(uuid).emit("receiveData", data);
    } else {
      console.log(`User ${uuid} failed to send data to swarm ${swarmId}`);
    }
  });

  // Disconnect handler
  socket.on("disconnect", async () => {
    // Handle disconnect message from the sender
    // Forward the disconnect message to the intended recipient
    if (uuid && swarmId) {
      redis.srem(swarmId, uuid);
      console.log(`User ${uuid} left swarm ${swarmId}`);
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Signaling & API server running on http://localhost:${port}`);
});

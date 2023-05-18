import io from "socket.io-client";

// Connect to the server-side socket.io server
const socket = io("http://localhost:8000");

// Function to establish a connection with the server
const connect = (uuid, swarmid) => {
  socket.emit("welcome", uuid, swarmid);
  
  socket.on("connectionConfirmation", (uuid, swarmid) => {
    console.log(`User ${uuid} joined swarm ${swarmid}`);
  });
};

// Function to request data from the server
const getData = (swarmid, uuid, whichData) => {
  let status = false;
  console.log(`Requesting ${whichData} from swarm ${swarmid}`);
  socket.emit("requestData",swarmid, uuid, whichData);

  socket.on("noData", (message) => {
    let status = false;
    if (message) {
      console.log("No peers found in swarm. Instructing user to get data from origin server.");
    }

    return status;
  });

  return status;
};

export { connect, getData };
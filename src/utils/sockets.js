import io from "socket.io-client";

const socket = io("http://localhost:8000");

const connect = (uuid) => {
  socket.emit("welcome", uuid);
};

const getData = (uuid, whichData) => {
  socket.emit("requestData", uuid, whichData);
};

export { connect, getData };

import io from "socket.io-client";

const socket = io();

socket.on("connect", () => {
  console.log("Connected!");
});

export default socket;

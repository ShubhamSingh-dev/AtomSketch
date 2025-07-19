import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import parser from "socket.io-msgpack-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({ origin: CLIENT_URL }));

const server = createServer(app);

const io = new Server(server, {
  parser,
  cors: {
    origin: CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
  });

  socket.on("getElements", ({ elements, room }) => {
    socket.to(room).emit("setElements", elements);
  });
});

app.get("/", (req, res) => {
  res.send(
    `<marquee>To try the app visite : <a href="${CLIENT_URL}">${CLIENT_URL}</a></marquee>`
  );
});

server.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);

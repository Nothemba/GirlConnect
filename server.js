var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const path = require("path");
const formatMessages = require("./public/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./public/utils/users");

app.use(express.static(path.join(__dirname, "public")));
const chat = "Girl connect";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessages(chat, "Welcome to girl connect"));
    socket.to(user.room)
      .emit("message", formatMessages(chat, `${user.username} has joined`)
      
      );

      io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
      });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", formatMessages(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessages(chat, `${user.username} left the chat`)
      );
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});

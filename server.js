const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let rooms = [];

function addRoom(name, password, size) {
  let room = {
      name: name,
      password: password,
      size: size,
      online: 0
  };
  rooms.push(room);
}
function findRoomByName(name) {
  return rooms.find(room => room.name === name);
}
function removeRoom(name) {
  rooms = rooms.filter(room => room.name !== name);
}

function updateOnlineCount(roomName, s) {
  let room = rooms.find(r => r.name === roomName);
  if (room) {
      if ( s === "+"){
        room.online += 1;
      }else{
        room.online -= 1;
      }
      
      console.log(`Updated ${roomName}:`, room);
  } else {
      console.log(`Room with name ${roomName} not found.`);
  }
}

io.on('connection', (socket) => {
  console.log('A user connected');
  console.log("with id "+socket.id)

  socket.on('checkRoomExists', (roomName, callback) => {
    const roomExists = rooms.some(room => room.name === roomName);
    callback(roomExists);
  });
  
  socket.on("checkRoom", (roomName, callback) => {
    const room = findRoomByName(roomName);
    if (room) {
        const isFull = room.online >= Number(room.size);
        callback(isFull);
    } else {
        callback(true);
    }
  });

  socket.on("checkpass", (roomName,pass, callback) => {
    const room = findRoomByName(roomName);
    if (room) {
        const correct = room.password == pass;
        callback(correct);
    } else {
        callback(false);
    }
  });


  socket.on("createRoom", (roomName, pass, size) => {
    addRoom(roomName, pass, size)
    console.log(rooms)
  })

  socket.on("join room", data =>{
    socket.join(data.roomname)
    socket.name = data.name
    updateOnlineCount(data.roomname, "+")
    console.log(socket.name + " joined room " + data.roomname)

    const room = io.sockets.adapter.rooms.get(data.roomname);
    if (room) {
        const users = [];
        room.forEach((socketId) => {
            const userSocket = io.sockets.sockets.get(socketId);
            if (userSocket) {
                users.push(userSocket.name);
            }
        });
        io.to(data.roomname).emit("room users", users);
      }
    if(findRoomByName(data.roomname).online == findRoomByName(data.roomname).size){
      io.to(data.roomname).emit("start game")

    }
  })

  socket.on("add score", (roomname, username) => {
    socket.broadcast.to(roomname).emit("add score", username)
  })
  

  socket.on("I used cards", (roomname, lst, last) =>{
    socket.broadcast.to(roomname).emit("remove cards", lst, last)
  })
  socket.on("show rooms", () => {
    console.log(rooms)
  })

  socket.on("add card on table", (roomname, i) => {
    socket.broadcast.to(roomname).emit("ad card", i)
  })
  socket.on("throw card on table", (roomname, cardData) => {
    socket.broadcast.to(roomname).emit("throw card", cardData)
  })
  socket.on('disconnecting', () => {

    for ( const room of socket.rooms){
      updateOnlineCount(room, "-")
      if (findRoomByName(room) != undefined){
        
        const roomin = io.sockets.adapter.rooms.get(room);
        if (roomin) {
          const users = [];
          roomin.forEach((socketId) => {
              const userSocket = io.sockets.sockets.get(socketId);
              if (userSocket) {
                  if(userSocket.name != socket.name){
                    users.push(userSocket.name);
                  }
                  
              }
          });

      
          io.to(room).emit("room users", users);
          
        }
        
        if (findRoomByName(room).online == 0){
          removeRoom(room)
          console.log("room "+room + " removed")
        }
      }
    }
    
  });

  socket.on("drawn done", (turn, room) => {
    socket.broadcast.to(room).emit("you draw now", turn)
  })
  socket.on("remove card from table" , (roomn, list) => {
    socket.broadcast.to(roomn).emit("hide from table", list)
  })


  socket.on("my turn done", (rname , usersarr, turn) => { 
    let newindex = usersarr.indexOf(turn);
    if(newindex+1 < usersarr.length){
      io.to(rname).emit("update turn", newindex+1)
    }else{
      io.to(rname).emit("update turn", 0)
    }
  })
    
  socket.on("start jarya", (roomname) => {
    io.to(roomname).emit("abda jarya" )
  })

  socket.on("round finished", (roomname) => {
    io.to(roomname).emit("count score")
  })

  socket.on("last eaten", (roomname, username) => {
    io.to(roomname).emit("updated lasteaten", username)
  })


  socket.on("here is my score" , (roomname, usernmae, score) =>{
    socket.broadcast.to(roomname).emit("update score", usernmae, score)
  })

  socket.on("new round", (roomname) => {
    io.to(roomname).emit("start game")
  })


  socket.on("show winner", (roomname, winnername) => {
    io.to(roomname).emit("winner winner" , winnername)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});


//user left

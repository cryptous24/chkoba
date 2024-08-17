const socket = io()


function show(){
    document.getElementById("3asba").style.display = "flex"
}
function hide(){
    document.getElementById("3asba").style.display = "none"

}

function show1(){
    document.getElementById("create3asba").style.display = "flex"
}
function hide1(){
    document.getElementById("create3asba").style.display = "none"

}

function create(){
    roomName = document.getElementById("newroomname").value
    pass = document.getElementById("pass").value
    size = document.getElementById("size").value
    socket.emit('checkRoomExists', roomName, (exists) => {
        if (exists) {
            alert("A room with this name already exists!");
        } else {
            socket.emit('createRoom', roomName, pass, size );
            document.getElementById("form").submit()
            }
    });
}

function join(){
    roomName = document.getElementById("roomname").value

    socket.emit('checkRoomExists', roomName, (exists) => {
        if (exists) {
            socket.emit("checkRoom", roomName, (isFull) => {
                if (isFull == false) {
                    pass = document.getElementById("joinpass").value
                    socket.emit("checkpass", roomName,pass, (correct) => {
                        if (correct == true) {
                            document.getElementById("joinform").submit()
                        } else {
                            alert("wrong pass")
                        }
                    }); 
                } else {
                    alert("room full")
                }
            });            
        } else {
            alert("room not found")
        }
    });
}

function show_rooms(){
    socket.emit("show rooms")
}
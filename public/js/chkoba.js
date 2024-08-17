const socket = io()
const QS = window.Qs;

const data = QS.parse(location.search, {
    ignoreQueryPrefix: true
});


if(data.name == "" || data.roomname == ""){
    window.location.href = "index.html"
}

socket.emit("join room", data)

document.getElementById("myname").textContent = data.name
document.getElementById("myresultname").textContent = data.name

function show_rooms(){
    socket.emit("show rooms")
}

  

function display_users(lst){
    mekla = []

    //let scors = document.getElementsByClassName("score")
    //Array.from(scors).forEach((element, i) => {
        //element.id = "score" + (i + 1);
    //});
    


    i = 1

    //document.getElementById("player1").style.opacity = "0"

    //document.getElementById("player2").style.opacity = "0"

    //document.getElementById("player3").style.opacity = "0"

    lst.forEach(user => {
        if(user != data.name){
            scoreid = "score"+String(i)
            id = "playername"+String(i)
            pid = "player"+String(i)
            document.getElementById(pid).style.opacity = "1"
            document.getElementById(id).textContent = user
            document.getElementById(scoreid).id = "score"+user
            i += 1
        }
        
    });
}



lasteaten = ""
round = 0
roomusers = []
players_score = []
turn = ""
socket.on("room users" , users => {
    roomusers = users
    display_users(roomusers)
    turn = roomusers[round]
    for (let i = 0; i < roomusers.length-1; i++) {
        players_score.push(0)
    }
    console.log(roomusers)
    console.log(players_score)

})


original_deck = ["c1" ,"c2" ,"c3" ,"c4" ,"c5" ,"c6" ,"c7" ,"c8" ,"c9" ,"c10" ,
    "d1" ,"d2" ,"d3" ,"d4" ,"d5" ,"d6" ,"d7" ,"d8" ,"d9" ,"d10" ,
    "h1" ,"h2" ,"h3" ,"h4" ,"h5" ,"h6" ,"h7" ,"h8" ,"h9" ,"h10" ,
    "s1" ,"s2" ,"s3" ,"s4" ,"s5" ,"s6" ,"s7" ,"s8" ,"s9" ,"s10" ,]

deck = ["c1" ,"c2" ,"c3" ,"c4" ,"c5" ,"c6" ,"c7" ,"c8" ,"c9" ,"c10" ,
        "d1" ,"d2" ,"d3" ,"d4" ,"d5" ,"d6" ,"d7" ,"d8" ,"d9" ,"d10" ,
        "h1" ,"h2" ,"h3" ,"h4" ,"h5" ,"h6" ,"h7" ,"h8" ,"h9" ,"h10" ,
        "s1" ,"s2" ,"s3" ,"s4" ,"s5" ,"s6" ,"s7" ,"s8" ,"s9" ,"s10" ,]


function calcscore(){
    score = 0
    sevens = 0
    ds = 0
    if(mekla.length >= 20){
        console.log("point for karta")
        score += 1
    }
    for (let i = 0; i < mekla.length; i++) {
        if(mekla[i] == "chkoba"){
            console.log("point for chkoba")
            score += 1
        }
        if(mekla[i] == "d7"){
            console.log("point for 7aya")
            score += 1
        }
        if(mekla[i].slice(1, mekla[i].length) === "7"){
            sevens += 1
        }
        if(mekla[i].slice(0, 1) === "d"){
            ds += 1
        }
    }

    if(sevens > 2){
        score += 1
        console.log("point for 7")
    }
    if(ds >= 5){
        console.log("point for dinery")
        score += 1
    }
    console.log(mekla)
    return score
}

function draw(deck, n){

    index = []
    let randomIndex = 0
    
    for (let i = 0; i < n; i++) {
        randomIndex = Math.floor(Math.random() * deck.length);
        while (index.indexOf(deck[randomIndex]) != -1) {
            randomIndex = Math.floor(Math.random() * deck.length);
        }
            index.push(deck[randomIndex])
            let img = document.createElement("img")
            img.className = "mycard"
            img.src = "cards/"+deck[randomIndex]+".png"
            img.id = deck[randomIndex]
            img.value = parseInt(deck[randomIndex].slice(1), 10);
            img.onclick = function() {
                select_my_card(img.id);
            };
            document.getElementById("card-container").appendChild(img)
        }
        console.log(index)
    return index
}

function deletefromdeck(lst){
    deck = deck.filter(item => !lst.includes(item));
    console.log(deck.length)
}

function put_card_on_table(deck, n){
    index = []
    let randomIndex = 0
    for (let i = 0; i < n; i++) {
        while (index.indexOf(deck[randomIndex]) != -1) {
            randomIndex = Math.floor(Math.random() * deck.length);
        }
        randomIndex = Math.floor(Math.random() * deck.length);
        index.push(deck[randomIndex])
        let img = document.createElement("img")
        img.className = "card"
        img.src = "cards/"+deck[randomIndex]+".png"
        img.value = parseInt(deck[randomIndex].slice(1), 10);
        img.id = deck[randomIndex]
        img.onclick = function() {
            select_card_onTable(img.id);
            console.log(mekla)
        };
        document.getElementById("tapiz").appendChild(img)
        socket.emit("add card on table",data.roomname, randomIndex)
    }
    console.log(index)
    return index
}

socket.on("ad card", index => {
    let img = document.createElement("img")
    img.className = "card"
    img.src = "cards/"+deck[index]+".png"
    img.value = parseInt(deck[index].slice(1), 10);
    img.id = deck[index]
    img.onclick = function() {
        console.log("table image clicked")
        select_card_onTable(img.id);
        console.log(mekla)

    };
    document.getElementById("tapiz").appendChild(img)
})
plays = 0

taken_it_id = ""
function koss(){
    zebi = []
    randomIndex = Math.floor(Math.random() * deck.length);
    let img = document.createElement("img")
        img.src = "cards/"+deck[randomIndex]+".png"
        img.value = parseInt(deck[randomIndex].slice(1), 10);
        img.id = "desictionimg"
        taken_it_id = deck[randomIndex]
        img.onclick = function() {
            select_card_onTable(img.id);
            console.log(mekla)
        };
    document.getElementById("ttop").appendChild(img)
    document.getElementById("takeorleave").style.display = "flex"
    zebi.push(deck[randomIndex])
    
    socket.emit("I used cards", data.roomname, zebi, data.name)
    deletefromdeck(zebi)
    
}
function take_it(){
    let takencard = document.getElementById("desictionimg")
    let img = document.createElement("img")
        img.className = "mycard"
        img.src = takencard.src
        img.id = taken_it_id
        img.value = parseInt(img.id.slice(1), 10);
        img.onclick = function() {
            select_my_card(img.id);
        };
    document.getElementById("card-container").appendChild(img)
    document.getElementById("takeorleave").style.display = "none"
    


    dturn += 1
    cardused = draw(deck, 2)
    deletefromdeck(cardused)
    socket.emit("I used cards", data.roomname, cardused, data.name)
    /////////////////////////////////////////////////////////////////////////////////////
    pulled = put_card_on_table(deck, 4)
    deletefromdeck(pulled)
    socket.emit("I used cards", data.roomname, pulled , data.name)
    socket.emit("drawn done", dturn, data.roomname)

    document.getElementById("desictionimg").remove()
    return true
}

function leave_it(){
    let takencard = document.getElementById("desictionimg")
    let img = document.createElement("img")
        img.className = "card"
        img.src = takencard.src
        img.id = taken_it_id
        img.value = parseInt(img.id.slice(1), 10);
        img.onclick = function() {
            select_card_onTable(img.id);
        };
    document.getElementById("tapiz").appendChild(img)
    document.getElementById("takeorleave").style.display = "none"


    dturn += 1
    cardused = draw(deck, 3)
    deletefromdeck(cardused)
    socket.emit("I used cards", data.roomname, cardused, data.name)
    /////////////////////////////////////////////////////////////////////////////////////
    cardData = {
        src: img.src,
        value: img.value,
        id: img.id
    }
    socket.emit("throw card on table",data.roomname, cardData)
    pulled = put_card_on_table(deck, 3)
    
    deletefromdeck(pulled)
    socket.emit("I used cards", data.roomname, pulled, data.name)
    socket.emit("drawn done", dturn, data.roomname)

    document.getElementById("desictionimg").remove()
    return true
}



myturn = roomusers.indexOf(data.name)
dturn = 0 
socket.on("start game", () => {
    mekla = []
    document.getElementById("generalscore").style.display = "none"
    document.getElementById("turnwait").textContent = turn + " turn"
    document.getElementById("winner").style.display = "none"
    if(data.name == roomusers[0]){
        koss()
        //dturn += 1
        //cardused = draw(deck, 3)
        //deletefromdeck(cardused)
        //socket.emit("I used cards", data.roomname, cardused)
        /////////////////////////////////////////////////////////////////////////////////////
        //pulled = put_card_on_table(deck, 4)
        //deletefromdeck(pulled)
        //socket.emit("I used cards", data.roomname, pulled)
        //socket.emit("drawn done", dturn, data.roomname)
    }
})

socket.on("remove cards", (removethese, eat) => {
    deletefromdeck(removethese)
})


socket.on("you draw now", (tt) => {
    
 
        if (data.name == roomusers[tt]){
            cardused = draw(deck, 3)
            deletefromdeck(cardused)
            socket.emit("I used cards", data.roomname, cardused, data.name)
            if (tt != roomusers.length){
                dturn = tt + 1
                socket.emit("drawn done", dturn, data.roomname)
            }
        }
    
    
})


myselectedcard = 0
myselectedcardid = ""
selected_cards = []
selected_cardsid = []
mekla = []

function cardsOnTable(){
    let tapiz = document.getElementById("tapiz");
    let children = tapiz.children;
    let card_on_table = []
    for (let i = 0; i < children.length; i++) {
        card_on_table.push(children[i].value);
    }
    return card_on_table
}

function bestsum(lst, tar){
    let res = Array(tar + 1).fill(null);
    res[0] = [];
    for (let num of lst) {
        for (let i = tar; i >= num; i--) {
            if (res[i - num] !== null) {
                let idk = [...res[i - num], num];
                if (res[i] === null || idk.length < res[i].length) {
                    res[i] = idk;
                }
            }
        }
    }
    return res[tar] !== null ? res[tar] : [];
}



function cardFromHandToTable(){
    let minenecard = document.getElementById(myselectedcardid)
    let img = document.createElement("img")
    img.className = "card"
    img.src = minenecard.src
    img.value = minenecard.value
    img.id = minenecard.id
    img.onclick = function() {
        console.log("table image clicked")
        select_card_onTable(img.id);
        console.log(mekla)

    };
    cardData = {
        src: minenecard.src,
        value: minenecard.value,
        id: minenecard.id
    }
    minenecard.remove()
    document.getElementById("tapiz").appendChild(img)
    socket.emit("throw card on table",data.roomname, cardData)
    
    if(data.name == roomusers[roomusers.length - 1]){
        plays += 1
        if (plays == 3){
            if(deck.length == 0){
                socket.emit("round finished", data.roomname)
            }else{
                socket.emit("drawn done", 0, data.roomname)
                plays = 0
            }
        }
    }

    socket.emit("last eaten", data.roomname, data.name)
}
socket.on("throw card", (cardData) => {
    let img = document.createElement("img")
    img.className = "card"
    img.src = cardData.src
    img.value = cardData.value
    img.id = cardData.id
    img.onclick = function() {
        console.log("table image clicked")
        select_card_onTable(img.id);
        console.log(mekla)
    };
    document.getElementById("tapiz").appendChild(img)
})


document.getElementById("tapiz").onclick = function() {
    console.log("tapiz clicked")
    if(myselectedcard != 0){
        if(bestsum(cardsOnTable(), myselectedcard).length == 0){
            cardFromHandToTable()
            socket.emit("my turn done", data.roomname, roomusers ,turn)
        }
    }
};


bestsumm =  0
function select_my_card(id){
    if(turn != data.name){
        alert("not my turn")
        return false
    }
    myselectedcard = document.getElementById(id).value
    myselectedcardid = id
    selected_cards = []
    selected_cardsid = []
    bestsumm = bestsum(cardsOnTable(), myselectedcard)
    
}

function select_card_onTable(id){
    if(turn != data.name){
        alert("not my turn")
        return false
    }
    

    selected_cards.push(document.getElementById(id).value)
    
    if(document.getElementById(id).value > myselectedcard){
        selected_cards = []
        selected_cardsid = []
        return false
    }
    //selected_cards.length == bestsumm.length
    selected_cardsid.push(document.getElementById(id).id)
    console.log(myselectedcard)
    let sum = selected_cards.reduce((acc, curr) => acc + curr, 0);
    if(sum == myselectedcard && selected_cards.length == bestsumm.length){
        
        mekla.push(myselectedcardid)
        selected_cardsid.forEach(cardid => {
            mekla.push(cardid)
            
        });
        socket.emit("remove card from table", data.roomname, selected_cardsid)
        selected_cardsid.forEach(element => {
            document.getElementById(element).remove()
        });
        socket.emit("last eaten", data.roomname, data.name)
        socket.emit("my turn done", data.roomname, roomusers ,turn)
    
        

        document.getElementById(myselectedcardid).remove()
        selected_cards = []
        selected_cardsid = []
        myselectedcard = 0
        myselectedcardid = ""


        if(data.name == roomusers[roomusers.length - 1]){
            plays += 1
            if (plays == 3){
                
                if(deck.length == 0){
                    socket.emit("round finished", data.roomname)
                    
                }else{
                    socket.emit("drawn done", 0, data.roomname)
                    plays = 0
                }
            }
        }

    }
    if(sum > myselectedcard){
        selected_cards = []
        selected_cardsid = []
        
    }
    if(cardsOnTable().length == 0){
        mekla.push("chkoba")
        socket.emit("my turn done", data.roomname, roomusers ,turn)
    
        alert("chkoba")
    }
    console.log(selected_cards)
    
}

socket.on("hide from table", lst =>{
    lst.forEach(element => {
        document.getElementById(element).remove()
    });
})

socket.on("update turn", turnindex =>{
    turn = roomusers[turnindex]
    document.getElementById("turnwait").textContent = turn + " turn"
    console.log(turn)
})

socket.on("abda jarya", () => {
    socket.emit("drawn done", 0, data.roomname)
})


socket.on("count score", () => {
    let tapiz = document.getElementById("tapiz");
    let children = tapiz.children;
    let crdottbl = []
    for (let i = 0; i < children.length; i++) {
        crdottbl.push(children[i].id);
    }
    crdottbl.forEach(element => {
        document.getElementById(element).remove()
    });

    if(lasteaten == data.name){
        console.log(crdottbl)
        crdottbl.forEach(element => {
            mekla.push(element);
        });
    }

    score = calcscore()
    
    score += Number(document.getElementById("myscore").textContent)

    socket.emit("here is my score", data.roomname, data.name, score)
    document.getElementById("myscore").textContent = score
    document.getElementById("myresscore").textContent = score

    if(score >= 6){
        socket.emit("show winner", data.roomname, data.name)
    }

    deck = original_deck
    roomusers.push(roomusers.shift());

})

socket.on("updated lasteaten", (usnmae) => {
    lasteaten = usnmae
})

socket.on("update score", (usname, scoree) => {

    if(document.getElementById('resdiv')){
        document.getElementById('resdiv').remove()
    }
    
    scoreid = "score"+usname
    document.getElementById(scoreid).textContent = scoree

    let resdiv = document.createElement("div")
    resdiv.className = "aplyerrres"
    resdiv.id = "resdiv"

    let playerResName = document.createElement("h2")
    playerResName.className = "redscore"
    playerResName.textContent = usname

    let playerResS = document.createElement("h2")
    playerResS.className = "pname"
    playerResS.textContent = scoree

    resdiv.appendChild(playerResS)
    resdiv.appendChild(playerResName)

    document.getElementById("myresult").appendChild(resdiv)
    document.getElementById("generalscore").style.display = "flex"
})

function newg(){
    if(roomusers[0] != data.name){
        return false
    }
    socket.emit("new round", data.roomname)
    document.getElementById("winner").style.display = "none"
    dturn = 0
    turn = roomusers[0]
    document.getElementById("myscore").textContent = 0
    document.getElementById("myresscore").textContent = 0

    roomusers.forEach(element => {
        if(element != data.name){
            scid = "score"+element
            document.getElementById(scid).textContent = 0
        }
        
    });
}
function next(){
    if(roomusers[0] != data.name){
        return false
    }
    socket.emit("new round", data.roomname)
    document.getElementById("generalscore").style.display = "none"
    dturn = 0
    turn = roomusers[0]
    
}
socket.on("winner winner", (winnername) => {
    document.getElementById("winnername").textContent = winnername
    document.getElementById("winner").style.display = "flex"
    document.getElementById("generalscore").style.display = "none"
})
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const util = require('util');
const port = 3500;
const clients = [];	//track connected clients
const fetch = require('node-fetch');
var loopLimit = 0;
////

//Server Web Client
var child = require('child_process').execFile;
var executablePath = "AtlantisServer.exe";
//var parameters = ["PVPMap?Id=1","-server","-port=3000","-log"];

//let url = "http://vartola.net/football/get_server.php";
let url = "http://localhost/football/get_server.php";

let settings = { method: "Get" };
var port_fx;
var parameters;
var matchId =0;

//var kill = require('tree-kill');
///////////////
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/index.html');
});

//app.use(express.static(__dirname));
//make one reference to event name so it can be easily renamed
const chatEvent = "chatMessage";

//When a client connects, bind each desired event to the client socket
io.on('connection', socket =>{
	//track connected clients via log
	clients.push(socket.id);
	const clientConnectedMsg = 'User connected ' + util.inspect(socket.id) + ', total: ' + clients.length;
	io.emit(chatEvent, clientConnectedMsg);

	console.log(clientConnectedMsg);

	//track disconnected clients via log
	socket.on('disconnect', ()=>{
		clients.pop(socket.id);
		const clientDisconnectedMsg = 'User disconnected ' + util.inspect(socket.id) + ', total: ' + clients.length;
		io.emit(chatEvent, clientDisconnectedMsg);
		console.log(clientDisconnectedMsg);
      if (addedUser) {
        --numUsers;
        killGame(socket);

        // echo globally that this client has left

        io.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
	})
  //
///add user//
 var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
   io.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', username =>{

		//buildGame(socket);
		// we store the username in the socket session for this client
		  if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username =  username;
    ++numUsers;
    addedUser = true;
	io.emit('login', {
      numUsers: numUsers
    });
    io.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
 console.log(socket.username)

	});

  
  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

	//multicast received message from client
	socket.on(chatEvent, msg =>{
		const combinedMsg = socket.id.substring(0,4) + ': ' + msg;
		io.emit(chatEvent, combinedMsg);
		console.log('multicast: ' + combinedMsg);
     // io.emit("add user", "test");
		//buildGame(socket);
	});

  socket.on('Cheakteam', function () {

      for(var i = 0; i < gameCollection.totalGameCount; i++) {
          var gameId = gameCollection.gameList[i]['gameObject']['id'];
          var plyr1Tmp = gameCollection.gameList[i]['gameObject']['playerOne'];
          var plyr2Tmp = gameCollection.gameList[i]['gameObject']['playerTwo'];
          /*  var plyr3Tmp = gameCollection.gameList[i]['gameObject']['playerThree'];
            var plyr4Tmp = gameCollection.gameList[i]['gameObject']['playerFour'];

           */
          //  if (plyr1Tmp == socket.username || plyr2Tmp == socket.username || plyr3Tmp == socket.username || plyr4Tmp == socket.username)

          if (plyr1Tmp == socket.username || plyr2Tmp == socket.username) {
              alreadyInGame = true;
              console.log(socket.username + " already has a Game!");
              // io.emit('alreadyJoined',gameCollection.gameList);
              io.emit('alreadyJoined', {
                  gameId: gameCollection.gameList[i]['gameObject']['id'],
                  pl_1: gameCollection.gameList[i]['gameObject']['playerOne'],
                  pl_2: gameCollection.gameList[i]['gameObject']['playerTwo'],
                  /* pl_3:gameCollection.gameList[i]['gameObject']['playerThree'],
                   pl_4:gameCollection.gameList[i]['gameObject']['playerFour'],*/
                  Userowner: socket.username,

              });

          }
      }
  });
    socket.on('joinSuccessfx', function (){
        console.log("test");
        for(var i = 0; i < gameCollection.totalGameCount; i++) {
            if(i==1)
            {
              

                if(gameCollection.gameList[1]['gameObject']['playerTwo']!=null){
                    console.log("user ready tostart match "+gameCollection.gameList[1]['gameObject']['playerTwo']);
                    getServer({ team_id_1: gameCollection.gameList[0]['gameObject']['id'],
                        team_1_pl_1:gameCollection.gameList[0]['gameObject']['playerOne'],
                        team_1_pl_2:gameCollection.gameList[0]['gameObject']['playerTwo'],
                        team_id_2: gameCollection.gameList[1]['gameObject']['id'],
                        team_2_pl_1:gameCollection.gameList[1]['gameObject']['playerOne'],
                        team_2_pl_2:gameCollection.gameList[1]['gameObject']['playerTwo'],URL_server:""});
                }

            }
        }
    });
  socket.on('joinGame', function (){
    console.log(socket.username + " wants to join a game");

    var alreadyInGame = false;

    for(var i = 0; i < gameCollection.totalGameCount; i++){
      var gameId = gameCollection.gameList[i]['gameObject']['id'];
      var plyr1Tmp = gameCollection.gameList[i]['gameObject']['playerOne'];
      var plyr2Tmp = gameCollection.gameList[i]['gameObject']['playerTwo'];
    /*  var plyr3Tmp = gameCollection.gameList[i]['gameObject']['playerThree'];
      var plyr4Tmp = gameCollection.gameList[i]['gameObject']['playerFour'];

     */
    //  if (plyr1Tmp == socket.username || plyr2Tmp == socket.username || plyr3Tmp == socket.username || plyr4Tmp == socket.username)

      if (plyr1Tmp == socket.username || plyr2Tmp == socket.username )
      {
        alreadyInGame = true;
        console.log(socket.username + " already has a Game!");
         // io.emit('alreadyJoined',gameCollection.gameList);

     io.emit('alreadyJoined', {
          gameId: gameCollection.gameList[i]['gameObject']['id'],
         pl_1:gameCollection.gameList[i]['gameObject']['playerOne'],
         pl_2:gameCollection.gameList[i]['gameObject']['playerTwo'],
        /* pl_3:gameCollection.gameList[i]['gameObject']['playerThree'],
         pl_4:gameCollection.gameList[i]['gameObject']['playerFour'],*/
         Userowner:socket.username,

        });

      }
        //console.log(i);


    }
    if (alreadyInGame == false){


      gameSeeker(socket);

    }
    /*if(gameCollection.gameList[1]['gameObject']['playerTwo']){

    }*/


 //   io.emit('alreadyJoined',gameCollection.gameList);
    //io.emit('alreadyJoined',gameCollection.gameList);

  });


  socket.on('leaveGame', function() {


    if (gameCollection.totalGameCount == 0){
      socket.emit('notInGame');

    }

    else {
      killGame(socket);
    }

  });

});

//Start the Server
http.listen(port, () => {
  console.log('listening on *:' + port);
});

var gameCollection =  new function() {

  this.totalGameCount = 0,
  this.gameList = []

};

function buildGame(socket) {


 var gameObject = {};
 gameObject.id = (Math.random()+1).toString(36).slice(2, 18);
 gameObject.playerOne = socket.username;
 gameObject.playerTwo = null;
 /*gameObject.playerThree = null;
 gameObject.playerFour = null;*/
 gameCollection.totalGameCount ++;
 gameCollection.path="";
 gameCollection.gameid=0;
 gameCollection.gameList.push({gameObject});


 console.log("Game Created by "+ socket.username + " w/ " + gameObject.id);
 io.emit('gameCreated', {
  username: socket.username,
  gameId: gameObject.id
});


}

function killGame(socket) {

  var notInGame = true;
  for(var i = 0; i < gameCollection.totalGameCount; i++){

    var gameId = gameCollection.gameList[i]['gameObject']['id']
    var plyr1Tmp = gameCollection.gameList[i]['gameObject']['playerOne'];
    var plyr2Tmp = gameCollection.gameList[i]['gameObject']['playerTwo'];
 /* var plyr3Tmp = gameCollection.gameList[i]['gameObject']['playerThree'];
  var plyr4Tmp = gameCollection.gameList[i]['gameObject']['playerFour'];

  */
//cc
    if (plyr1Tmp == socket.username){
      --gameCollection.totalGameCount;
      console.log("Destroy Game "+ gameId + "!");
      gameCollection.gameList.splice(i, 1);
      console.log(gameCollection.gameList);
      socket.emit('leftGame', { gameId: gameId });
      io.emit('gameDestroyed', {gameId: gameId, gameOwner: socket.username });
      notInGame = false;
    }
    else if (plyr2Tmp == socket.username) {
      gameCollection.gameList[i]['gameObject']['playerTwo'] = null;
      console.log(socket.username + " has left " + gameId);
      socket.emit('leftGame', { gameId: gameId });
      console.log(gameCollection.gameList[i]['gameObject']);
      notInGame = false;

    }
	/* else if (plyr3Tmp == socket.username) {
      gameCollection.gameList[i]['gameObject']['playerThree'] = null;
      console.log(socket.username + " has left " + gameId);
      socket.emit('leftGame', { gameId: gameId });
      console.log(gameCollection.gameList[i]['gameObject']);
      notInGame = false;

    }
	 else if (plyr4Tmp == socket.username) {
      gameCollection.gameList[i]['gameObject']['playerFour'] = null;
      console.log(socket.username + " has left " + gameId);
      socket.emit('leftGame', { gameId: gameId });
      console.log(gameCollection.gameList[i]['gameObject']);
      notInGame = false;

    }
*/
  }

  if (notInGame == true){
    socket.emit('notInGame');
  }


}

function gameSeeker (socket) {
    io.emit('joinSuccessfx','ff');
  ++loopLimit;
  if (( gameCollection.totalGameCount == 0) || (loopLimit >= 20))
  {
    buildGame(socket);
    loopLimit = 0;
  }
  else {
    var rndPick = Math.floor(Math.random() * gameCollection.totalGameCount);
    if (gameCollection.gameList[rndPick]['gameObject']['playerTwo'] == null)
    {
      gameCollection.gameList[rndPick]['gameObject']['playerTwo'] = socket.username;
        io.emit('joinSuccess', {
        gameId: gameCollection.gameList[rndPick]['gameObject']['id'] });

      console.log( socket.username + " has been added to: " + gameCollection.gameList[rndPick]['gameObject']['id']);

    }
/*	else if (gameCollection.gameList[rndPick]['gameObject']['playerThree'] == null)
    {
      gameCollection.gameList[rndPick]['gameObject']['playerThree'] = socket.username;
      socket.emit('joinSuccess', {
        gameId: gameCollection.gameList[rndPick]['gameObject']['id'] });

      console.log( socket.username + " has been added to: " + gameCollection.gameList[rndPick]['gameObject']['id']);

    }
	else if (gameCollection.gameList[rndPick]['gameObject']['playerFour'] == null)
    {
      gameCollection.gameList[rndPick]['gameObject']['playerFour'] = socket.username;
      socket.emit('joinSuccess', {
        gameId: gameCollection.gameList[rndPick]['gameObject']['id'] });

      console.log( socket.username + " has been added to: " + gameCollection.gameList[rndPick]['gameObject']['id']);

    }*/
	else {

      gameSeeker(socket);
    }
  }
}


// Chatroom
var mypath;
var numUsers = 0;

function getServer(sockethh){


    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            if(json.id==0){
                console.log("do nothing")
            }
            else {
                port_fx = json.path.split(":", 2)[1];
               // var parameters = ["PVPMap?Id="+json.id,"-server","-port="+port_fx,"-log"];
			   if(json.isTeamBase==0)
			   {
				  parameters = ["Stylized_Egypt_Demo?Id="+json.id,"-server","-port="+port_fx];
			   }
			   else
			   {
				    parameters = ["PharaonicArena_Level_01?Id="+json.id,"-server","-port="+port_fx];
			   }
                matchId++;

                gameCollection.path=json.path;
                sockethh.URL_server=json.path;
                io.emit('JoinServer', sockethh);
              console.log( sockethh) ;
                // Open Game Instains server
       /*
                child(executablePath, parameters, function (err, data) {
                    console.log(err)
                    console.log(data.toString());
                });*/
            }
        });


}


/*io.emit('JoinServer', {
    URL_server:"path",

});
*/

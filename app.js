//require을 이용해 모듈을 불를수 있음.

const express = require('express'); // express 모듈 불러오기

const socket = require('socket.io'); // socket.io 모듈 불러오기 

const http = require('http'); // 내장모듈 불러오기

const fs = require('fs'); 

const app = express(); // express 객체 생성

const server = http.createServer(app); // express http 서버 생성

const io = socket(server); // socket.io에 바인딩

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

app.get('/', function(request, response){ // 서버의 / 경로를 Get 방식으로 접속하면 호출됨. request:클라이언트에서 전달된 데이타 response 클라이언트에게 응답을 위한 정보
 fs.readFile('./static/index.html', function(err, data){
    if(err) {
        response.send('에러'); // 클라이언으로 서버가 데이터를 보냄
    }else{
        response.writeHead(200, {'Content-type':'text/html'});
        response.write(data);
        response.end();
    }
 })
})

io.sockets.on('connection', function(socket){

    socket.on('newUser', function(name){
        console.log(name + '님이 접속하였습니다');

        socket.name = name;

        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'});
    })

    socket.on('message', function(data){
        
        data.name = socket.name;

        console.log(data);

        socket.broadcast.emit('update', data);
    })

    socket.on('disconnect', function(){
        console.log(socket.name + '님이 나가셨습니다.');

        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
    })
})

server.listen(8080, function(){ // 서버를 8080 포트로 리스너 호출
    console.log('서버 실행중..');
})


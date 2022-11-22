import Player from "./player.js"
import Ball from "./ball.js"

const socket = io.connect("http://192.168.0.3:3000")
const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")
canvas.width = 600
canvas.height = 600
const width = canvas.width
const height = canvas.height
let que ="none"
let player1 
let player2
let ball = new Ball()
let score 
let opponent
socket.on("que",(data)=>{
que = data
if(que == "first"){
    player1 = new Player(50)
    player2 = new Player(canvas.height - 75)  
    player1.color = "blue"  
    player1.input()
}
else if(que == "second"){
    player1 = new Player(canvas.height - 75)
    player2 = new Player(50)
    player1.input()    
player1.color = "blue"
}
})

socket.on("wait",data=>{
    document.getElementById("score").innerHTML = "Waiting for opponent"
})




socket.on("coords",data=>{
   
    player2.px = data
})

socket.on("ball",(x,y)=>{
    ball.px = x
    ball.py = y
})

socket.on("dis",data=>{
    if(opponent < 10 && score < 10){
    document.getElementById("score").innerHTML = "<h3> Opponent Disconnected. You Win !!!</h3>"
    }

})



socket.on("score",(s1,s2)=>{
    if(que == "first"){
        score = s1
        opponent = s2
    }
    if (que == "second"){
        score = s2
        opponent = s1
    }
    if(score < 10 && opponent <10){
    document.getElementById("score").innerHTML = `You : ${score}   Opponent : ${opponent}`
    }
    else {
        if(score > opponent){
            document.getElementById("score").innerHTML= "YOU WIN"

        }
        else{
            document.getElementById("score").innerHTML = "YOU LOSE"
        }
    }
})

function loop(){
    requestAnimationFrame(loop)
    c.clearRect(0,0,width,height)
    try{
    player1.move(width)
    player1.draw(c)
    player2.draw(c)
ball.draw(c)    
}
    catch{
    }
    if(que != "none"){
    socket.emit("data",player1.px)
}
}
loop()


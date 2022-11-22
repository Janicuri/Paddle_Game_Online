const express = require("express")
const app = express()
const port = 3000
app.use(express.static("View"))
const server = app.listen(port,()=>{console.log("running on 192.168.0.3:3000")})
const io = require("socket.io")(server)
let cond = true
const Client = require("./Client")


class Ball {
    constructor(){
        this.px = 0
        this.py = 0
        this.r = 15
        this.xspeed= 4
        this.yspeed = 3
    }
    draw(cnx){
        cnx.beginPath()
        cnx.fillStyle = this.color
        cnx.fillRect(this.px,this.py,this.r,this.r)
        cnx.closePath()
    }
    move(){
        this.px += this.xspeed
        this.py += this.yspeed
    }
    condition(w,h,n){
        if (this.px < 0){
            this.xspeed = 4
        }
        if (this.px + this.r > w){
            this.xspeed = -4
        }
        if(this.py <0){

            this.py = h/2
            this.yspeed = 3
            clients[n].client2.score++
        }
        if(this.py+ this.r >h){
            clients[n].client1.score++
            this.py = h/2
            this.yspeed = -3
        }
    }
    cond2(x1,x2){
        if(this.px> x1 && this.px < x1+75 && this.py < 75 && this.py > 50){
            this.yspeed = Math.round(Math.random()*7)
        }
        if(this.px > x2 && this.px < x2+75 && this.py+this.r > 525 && this.py+this.r < 575){
            this.yspeed = -(Math.round(Math.random()*7))
        }
    }
    
}



class Capsule {
    constructor(){
        this.Number=0
        this.client1 = new Client("",0)
        this.client2 =  new Client("",0)
        this.baller = new Ball()
    }
    
}


let clients = [new Capsule()]


io.on("connection",socket=>{
    ///////////////////////////////////
    console.log("new Client")
    socket.emit("wait","")
    if (clients.length == 0){
        clients.push(new Capsule())
    }

        if(clients[clients.length-1].Number == 2)
        {
            clients.push(new Capsule())
        }
        if(clients[clients.length-1].Number == 1){
            clients[clients.length-1].client2.id = socket.id
            clients[clients.length-1].Number = 2
        }
        if(clients[clients.length-1].Number == 0){
            clients[clients.length-1].client1.id = socket.id
            clients[clients.length-1].Number++
        }
    

    
    if (clients[clients.length-1].Number == 2){
        let number  = clients.length-1
        let interval = setInterval(()=>{
            try{
            clients[number].baller.move()
            clients[number].baller.condition(600,600,number) 
            io.to(clients[number].client1.id).emit("ball",clients[number].baller.px,clients[number].baller.py)
            io.to(clients[number].client2.id).emit("ball",clients[number].baller.px,clients[number].baller.py)
            io.to(clients[number].client1.id).emit("score",clients[number].client1.score,clients[number].client2.score)
            io.to(clients[number].client2.id).emit("score",clients[number].client1.score,clients[number].client2.score)
            clients[number].baller.cond2(clients[number].client1.x,clients[number].client2.x)
        }
        catch{
            clearInterval(interval);
        }
        },10)
    }

/////////Up to this point ive made possible to reorganize all the clients that connect to the server

    if(cond){
    socket.emit("que","first")
    cond = false
    }
    else{
    cond = true
    socket.emit("que","second")
    }
//////// Here ive given both clients a position depending on who joined first and second




    socket.on("data",data=>{
       // console.log("hi")
        for (let i = 0; i < clients.length; i++) {
           if(clients[i].client1.id == socket.id){
            clients[i].client1.x = data
            io.to(clients[i].client2.id).emit("coords",data)
            
        }
        else if (clients[i].client2.id == socket.id){
            clients[i].client2.x = data
            io.to(clients[i].client1.id).emit("coords",data)
        }
    }
   
    }
    )
///////// In this section ive reorganized the incoming data 



    socket.on("disconnect",()=>{
        for(let i =0;i<clients.length;i++){
            if (clients[i].client1.id == socket.id){
                io.to(clients[i].client2.id).emit("dis","")
                clients.splice(i,1)
               
            }
            else if(clients[i].client2.id == socket.id){
                io.to(clients[i].client1.id).emit("dis","")
                clients.splice(i,1)
                
            }
        }
    })



/////////// At last ive hanled every possible disconnection.
//console.log(clients[clients.length-1])
//console.log(clients.length)
})


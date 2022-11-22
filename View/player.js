export default class Player{
    constructor(py){
        this.px = 100
        this.py = py
        this.width = 75
        this.height = 25
        this.color = "red"
        this.speed = 10
        this.dir = "none"
    }

    draw(cnx){
        cnx.beginPath()
        cnx.fillStyle = this.color
        cnx.strokeStyle = "black"
        cnx.fillRect(this.px,this.py,this.width,this.height)
        cnx.stroke()
        cnx.closePath()
    }

    input(){
        document.addEventListener("keydown",(e)=>{
            if (e.keyCode === 39 ){
                this.dir = "right"
            }
            if(e.keyCode === 37){
                this.dir = "left"
            }
            if (e.keyCode === 40){
                this.dir = "none"
            }
        })
        document.addEventListener('touchmove', (event) => {
            this.px = event.touches[0].clientX-200
        });
    }
    move(gameWidth){
        if(this.px +this.width <gameWidth && this.dir == "right"){
            this.px += this.speed
        }
        if(this.px > 0 && this.dir == "left"){
            this.px -= this.speed
        }
        else{
            this.px +=0
        }
    }
} 
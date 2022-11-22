class Ball {
    constructor(){
        this.px = 0
        this.py = 0
        this.r = 15
        this.xspeed= 5
        this.yspeed = 5
        this.color ="green"
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
    condition(w,h){
        if (this.px < 0){
            this.xspeed = -1 * this.xspeed
        }
        if (this.px + this.r > w){
            this.xspeed = -1 * this.xspeed
        }
        if(this.py <0){
            this.yspeed = -1 * this.yspeed
        }
        if(this.py+ this.r >h){
            this.yspeed = -1 * this.yspeed
        }
    }
    
}

export default Ball
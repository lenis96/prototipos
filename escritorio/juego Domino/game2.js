var gameArea=document.getElementById("gameArea");
gameArea.width=500;
gameArea.height=500;
gameArea.addEventListener("click",function(event){
    game.updateGame();
    console.log(event.offsetX+" "+event.offsetY);
});

var Game=function(message){
    this.drawGrid=function(){
        var x=10;
        var y=10;
        var dx=20;
        var dy=20;
        var iniX=10,iniY=10;
        var endX=450,endY=350;
        while(x<=endX){
            ctx.beginPath();
            ctx.moveTo(x,iniY);
            ctx.lineTo(x,endY);
            ctx.stroke();
            x+=dx;
        }
        while(y<=endY){
            ctx.beginPath();
            ctx.moveTo(iniX,y);
            ctx.lineTo(endX,y);
            ctx.stroke();
            y+=dy;
        }
    }
    this.draw=function(){
        this.drawGrid();
        ctx.fillStyle = "#ccc";
        ctx.fillRect(30, 400,340, 100);
    }
    
    this.isSelectedToken=false;
    this.selectedToken=null;
    this.tokens=[];
    this.canvas=document.getElementById("gameArea");
    var ctx=this.canvas.getContext("2d");
    this.tokens.push(new Token(50,410,"images/token1.png",ctx));
    this.tokens.push(new Token(100,410,"images/token1.png",ctx));
    var obj=this;
    this.draw();
    this.updateGame=function(){
        var ctx=obj.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        for(var i=0;i<obj.tokens.length;i++){
            obj.tokens[i].update();
        }
    }
    this.mouseDown=function(){
        var i=0;
        while(i<this.tokens.length && !this.selectedToken){
            if(this.tokens[i].clicked()){
                this.isSelectedToken=true;
                this.selectedToken=this.tokens[i];
            }
            i++;
        }
    }
    this.mouseUp=function(){
        if(this.isSelectedToken){
            this.isSelectedToken=false;
            for(var i=0;i<this.tokens.length;i++){
                console.log(this.selectedToken.collide(this.tokens[i]));
                if(this.tokens[i]!==this.selectedToken && this.selectedToken.collide(this.tokens[i])){
                    this.selectedToken.setNotSelected(true);
                    i=this.tokens.length;
                }
            }
            this.selectedToken.setNotSelected(false);

            this.selectedToken=null;
        }
    }
}
var game=new Game();

gameArea.addEventListener("mousedown",function(event){mousePos={x:event.offsetX,y:event.offsetY};game.mouseDown()});

gameArea.addEventListener("mouseup",function(){game.mouseUp()});

gameArea.addEventListener("mousemove",function(){mousePos={x:event.offsetX,y:event.offsetY};game.updateGame()});
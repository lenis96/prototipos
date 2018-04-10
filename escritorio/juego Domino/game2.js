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
    this.turn=0;
    this.canvas=document.getElementById("gameArea");
    var ctx=this.canvas.getContext("2d");
    this.tokensPlayer1=[];
    this.tokensPlayer2=[];
    this.tokensPlayer1.push(new Token(-100,-100,["images/token1-0.png",null,"images/token1-2.png",null],ctx,"lobo","gato"));
    this.tokensPlayer1.push(new Token(-100,-100,["images/token1-0.png",null,"images/token1-2.png",null],ctx));
    this.tokensPlayer2.push(new Token(-100,-100,["images/token1-0.png",null,"images/token1-2.png",null],ctx,"lobo","gato"));
    this.tokensPlayer2.push(new Token(-100,-100,["images/token1-0.png",null,"images/token1-2.png",null],ctx));
    for(var i=0;i<this.tokensPlayer1.length;i++){
        this.tokensPlayer1[i].x=(50*i)+50;
        this.tokensPlayer1[i].y=410;
    }
    for(var i=0;i<this.tokensPlayer2.length;i++){
        this.tokensPlayer2[i].x=-100;
        this.tokensPlayer2[i].y=-100;
    }
    var obj=this;
    this.draw();
    this.updateGame=function(){
        var ctx=obj.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        for(var i=0;i<obj.tokens.length;i++){
            obj.tokens[i].update();
        }
        for(var i=0;i<obj.tokensPlayer1.length;i++){
            obj.tokensPlayer1[i].update();
        }
        for(var i=0;i<obj.tokensPlayer2.length;i++){
            obj.tokensPlayer2[i].update();
        }
    }
    this.mouseDown=function(){
        var i=0;
        if(this.turn==0){
            while(i<this.tokensPlayer1.length && !this.selectedToken){
                if(this.tokensPlayer1[i].clicked()){
                    this.isSelectedToken=true;
                    this.positionToken=i;
                    this.selectedToken=this.tokensPlayer1[i];
                }
                i++;
            }    
        }
        else{
            while(i<this.tokensPlayer2.length && !this.selectedToken){
                if(this.tokensPlayer2[i].clicked()){
                    this.isSelectedToken=true;
                    this.positionToken=i;
                    this.selectedToken=this.tokensPlayer2[i];
                }
                i++;
            }
        }
    }
    this.mouseUp=function(){
        if(this.isSelectedToken){
            this.isSelectedToken=false;
            if(this.selectedToken.isIn()){
                if(this.turn==0){
                    this.tokens.push(this.tokensPlayer1[this.positionToken]);
                    this.tokensPlayer1.splice(this.positionToken,1);
                }
                else{
                    this.tokens.push(this.tokensPlayer2[this.positionToken]);
                    this.tokensPlayer2.splice(this.positionToken,1);
                }
                this.changeTurn();
            }
            for(var i=0;i<this.tokens.length;i++){
                console.log(this.selectedToken.collide(this.tokens[i]));
                if(this.tokens[i]!==this.selectedToken && this.selectedToken.collide(this.tokens[i])){
                    if(this.selectedToken.matchedFigures(this.tokens[i])){
                        this.selectedToken.posToToken(this.tokens[i]);
                        console.log("lel");
                        i=this.tokens.length;
                    }
                    // this.selectedToken.setNotSelected(true);
                }
            }
            this.selectedToken.setNotSelected(false);

            this.selectedToken=null;
        }
        console.log(this.turn);
    }
    this.changeTurn=function(){
        if(this.turn==1){
            for(var i=0;i<this.tokensPlayer1.length;i++){
                this.tokensPlayer1[i].x=(50*i)+50;
                this.tokensPlayer1[i].y=410;
            }
            for(var i=0;i<this.tokensPlayer2.length;i++){
                this.tokensPlayer2[i].x=-100;
                this.tokensPlayer2[i].y=-100;
            }
            this.turn=1-this.turn;
        }
        else{
            for(var i=0;i<this.tokensPlayer2.length;i++){
                this.tokensPlayer2[i].x=(50*i)+50;
                this.tokensPlayer2[i].y=410;
            }
            for(var i=0;i<this.tokensPlayer1.length;i++){
                this.tokensPlayer1[i].x=-100;
                this.tokensPlayer1[i].y=-100;
            }
            this.turn=1-this.turn;
        }
        this.updateGame();
        
    }
}
var game=new Game();

gameArea.addEventListener("mousedown",function(event){mousePos={x:event.offsetX,y:event.offsetY};game.mouseDown()});

gameArea.addEventListener("mouseup",function(){game.mouseUp()});

gameArea.addEventListener("mousemove",function(){mousePos={x:event.offsetX,y:event.offsetY};game.updateGame()});

console.log("termino");
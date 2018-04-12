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
    this.putTokens=[];
    this.turn=0;
    this.canvas=document.getElementById("gameArea");
    var ctx=this.canvas.getContext("2d");
    this.tokensPlayer1=[];
    this.tokensPlayer2=[];
    this.tokensPlayer1.push(new Token(-100,-100,["images/token1-0.png","images/token1-1.png","images/token1-2.png","images/token1-3.png"],ctx,"lobo","gato"));
    this.tokensPlayer1.push(new Token(-100,-100,["images/token1-0.png","images/token1-1.png","images/token1-2.png","images/token1-3.png"],ctx));
    this.tokensPlayer2.push(new Token(-100,-100,["images/token1-0.png","images/token1-1.png","images/token1-2.png","images/token1-3.png"],ctx,"lobo","gato"));
    this.tokensPlayer2.push(new Token(-100,-100,["images/token1-0.png","images/token1-1.png","images/token1-2.png","images/token1-3.png"],ctx));
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
        for(var i=0;i<obj.putTokens.length;i++){
            obj.putTokens[i].update();
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
        var putToken=false;
        if(this.isSelectedToken){
            this.isSelectedToken=false;
            // console.log(this.tokens)
            if(this.tokens.length>0){
                var res=this.selectedToken.isMatched(this.tokens);
                console.log(res)
                if(res.res){
                    if(this.turn==0){
                        this.putTokens.push(this.tokensPlayer1[this.positionToken]);
                        this.tokensPlayer1.splice(this.positionToken,1);
                    }
                    else if(this.turn==1){
                        this.putTokens.push(this.tokensPlayer2[this.positionToken]);
                        this.tokensPlayer2.splice(this.positionToken,1);
                    }
                    this.changeTurn();
                    if(res.token==0){
                        if(res.fig==1){
                            this.tokens[0]={fig:this.selectedToken.fig1,x:this.selectedToken.fig1X,y:this.selectedToken.fig1Y};
                            putToken=true;
                            
                        }
                        else if(res.fig==2){
                            this.tokens[0]={fig:this.selectedToken.fig2,x:this.selectedToken.fig2X,y:this.selectedToken.fig2Y};
                            putToken=true;
                        }
                    }
                    else if(res.token==1){
                        if(res.fig==1){
                            this.tokens[1]={fig:this.selectedToken.fig1,x:this.selectedToken.fig1X,y:this.selectedToken.fig1Y};
                            putToken=true;
                        }
                        else if(res.fig==2){
                            this.tokens[1]={fig:this.selectedToken.fig2,x:this.selectedToken.fig2X,y:this.selectedToken.fig2Y};
                            putToken=true;
                        }
                    }
                }
            }
            else{
                this.tokens[0]={fig:this.selectedToken.fig1,x:this.selectedToken.fig1X,y:this.selectedToken.fig1Y};
                this.tokens[1]={fig:this.selectedToken.fig2,x:this.selectedToken.fig2X,y:this.selectedToken.fig2Y};
                this.putTokens.push(this.tokensPlayer1[this.positionToken]);
                this.tokensPlayer1.splice(this.positionToken,1);
                putToken=true;
                this.changeTurn();
            }
            if(!putToken){
                console.log(this.tokensPlayer2)
                this.selectedToken.setNotSelected(true);
            }
            // if(this.selectedToken.isIn()){
            //     if(this.turn==0){
            //         this.tokens.push(this.tokensPlayer1[this.positionToken]);
            //         this.tokensPlayer1.splice(this.positionToken,1);
            //     }
            //     else{
            //         this.tokens.push(this.tokensPlayer2[this.positionToken]);
            //         this.tokensPlayer2.splice(this.positionToken,1);
            //     }
            //     this.changeTurn();
            // }
            // for(var i=0;i<this.tokens.length;i++){
            //     console.log(this.selectedToken.collide(this.tokens[i]));
            //     if(this.tokens[i]!==this.selectedToken && this.selectedToken.collide(this.tokens[i])){
            //         if(this.selectedToken.matchedFigures(this.tokens[i])){
            //             this.tokens[i].posToToken(this.selectedToken);
            //             console.log("lel");
            //             i=this.tokens.length;
            //         }
            //         // this.selectedToken.setNotSelected(true);
            //     }
            // }
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
                this.tokensPlayer1[i].setOldPos();
            }
            for(var i=0;i<this.tokensPlayer2.length;i++){
                this.tokensPlayer2[i].x=-100;
                this.tokensPlayer2[i].y=-100;
                this.tokensPlayer2[i].setOldPos();
            }
            this.turn=1-this.turn;
        }
        else{
            for(var i=0;i<this.tokensPlayer2.length;i++){
                this.tokensPlayer2[i].x=(50*i)+50;
                this.tokensPlayer2[i].y=410;
                this.tokensPlayer2[i].setOldPos();
            }
            for(var i=0;i<this.tokensPlayer1.length;i++){
                this.tokensPlayer1[i].x=-100;
                this.tokensPlayer1[i].y=-100;
                this.tokensPlayer1[i].setOldPos();
            }
            this.turn=1-this.turn;
        }
        this.updateGame();
        
    }
    document.onkeydown = checkKey;

    function checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
        }
        else if (e.keyCode == '40') {
            // down arrow
        }
        else if (e.keyCode == '37') {
            console.log(obj.selectedToken);
            if(obj.selectedToken!=null){
                obj.selectedToken.leftRotate();
            }
            obj.updateGame();
        console.log("L")
        }
        else if (e.keyCode == '39') {
            console.log(obj.selectedToken);
            if(obj.selectedToken!=null){
                obj.selectedToken.rightRotate();
            }
            obj.updateGame();  
        console.log("R")
        }

    }
}
var game=new Game();

gameArea.addEventListener("mousedown",function(event){mousePos={x:event.offsetX,y:event.offsetY};game.mouseDown()});

gameArea.addEventListener("mouseup",function(){game.mouseUp()});

gameArea.addEventListener("mousemove",function(){mousePos={x:event.offsetX,y:event.offsetY};game.updateGame()});


console.log("termino");
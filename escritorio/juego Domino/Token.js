var Token=function(x,y,imagePath,ctx,fig1="",fig2=""){
    this.x=x;
    this.y=y;
    this.imagePath=imagePath;
    this.hold=false;
    this.image=[];
    for(var i=0;i<4;i++){
        this.image[i]=new Image();
        this.image[i].src=this.imagePath[i];
        this.image[i].onload=function(){
            obj.update();
            obj.width=40;
            obj.height=80;
        }
    }
    this.ctx=ctx;
    var obj=this;
    this.offsetX=0;
    this.offsetY=0;
    this.oldPos={x:this.x,y:this.y};
    this.orientation=0;
    this.fig1=fig1;
    this.fig2=fig2;
    

    this.update=function(){
        if(this.hold){
            this.x=mousePos.x-this.offsetX;
            this.y=mousePos.y-this.offsetY;
        }
        if(this.orientation==0){
        }  
        else if(this.orientation==2){
        }
        this.ctx.drawImage(this.image[this.orientation],this.x,this.y,this.width,this.height);

    }
    this.clicked=function(){
        if(mousePos.x>=this.x && mousePos.y>=this.y){
            if(mousePos.x<=this.x+this.width && mousePos.y<=this.y+this.height){
                res=true;
                this.hold=true;
                this.offsetX=mousePos.x-this.x;
                this.offsetY=mousePos.y-this.y;
            }
            else{
                res=false;
            }
        }
        else{
            res=false;
        }
        return res;
    }
    this.setNotSelected=function(moveToOld){
        this.hold=false;
        if(moveToOld){
            this.x=this.oldPos.x;
            this.y=this.oldPos.y;
        }
        
    }
    this.isIn=function(){
        if(this.x<350 && this.x>=10 && this.y<=450 && this.y>=10){
            return true;
        }
        else{
            return false;
        }
    }
    this.toGrid=function(){
        this.x=this.x-(this.x%20);
        this.y=this.y-(this.y%20);
        this.oldPos.x=this.x;
        this.oldPos.y=this.y;
    }
    this.collide=function(token){
        var width=40;height=80;
        console.log(Math.abs(token.x-this.x));
        console.log(Math.abs(token.y-this.y));
        if(Math.abs(token.x-this.x)<width){
            if(Math.abs(token.y-this.y)<height){
                res=true;
            }
            else{
                res=false;
            }
        }
        else{
            res=false;
        }
        return res;
    }
    this.posToToken=function(token){
        // if(this.y<token.y){
        //     this.y=token.y-80;
        //     this.x=token.x;
        // }
        // else{
        //     this.y=token.y+80;
        //     this.x=token.x;
        // }
        if(this.fig1==token.fig1){
            this.fig1=token.fig1=null;
            if(this.orientation=0);
            console.log("aqui");
                token.orientation=2;
                token.y=this.y-80;
                token.x=this.x;
        }
    }
    this.matchedFigures=function(token){
        var res=false;
        if(this.fig1==token.fig1 && this.fig1!=null){res=true;}
        else if(this.fig1==token.fig2 && this.fig1!=null){res=true;}
        else if(this.fig2==token.fig1 && this.fig2!=null){res=true;}
        else if(this.fig2==token.fig2 && this.fig2!=null){res=true;}
        return res;
    }
}
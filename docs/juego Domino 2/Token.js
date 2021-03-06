var Token=function(x,y,imagePath,ctx,fig1="",fig2=""){
    this.x=x;
    this.y=y;
    this.imagePath=imagePath;
    this.hold=false;
    this.image=[];
    this.size=80;
    this.width=this.size;
    this.height=this.size*2;
    // this.width=[40,80,40,80];
    // this.height=[80,40,80,40];
    for(var i=0;i<4;i+=2){
        this.image[i]=new Image();
        this.image[i].src=this.imagePath[i];
        this.image[i].onload=function(){
            obj.update();
            obj.width=160;
            obj.height=80;
        }
    }
    for(var i=1;i<4;i+=2){
        this.image[i]=new Image();
        this.image[i].src=this.imagePath[i];
        this.image[i].onload=function(){
            obj.update();
            obj.width=80;
            obj.height=160;
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
        if(this.orientation==0 || this.orientation==2){
            var width=this.size;
            var height=this.size*2;
        }  
        else if(this.orientation==1 || this.orientation==3){
            var width=this.size*2;
            var height=this.size;
        }
        if(this.orientation==0){
            this.fig1X=this.fig2X=this.x+(this.size/2);
            this.fig1Y=this.y+(this.size/2);
            this.fig2Y=this.y+this.size+(this.size/2);
        }
        if(this.orientation==1){
            this.fig1Y=this.fig2Y=this.y+(this.size/2);
            this.fig1X=this.x+this.size+(this.size/2);
            this.fig2X=this.x+(this.size/2);
        }
        else if(this.orientation==2){
            this.fig1X=this.fig2X=this.x+(this.size/2);
            this.fig2Y=this.y+(this.size/2);
            this.fig1Y=this.y+this.size+(this.size/2);
        }
        if(this.orientation==3){
            this.fig1Y=this.fig2Y=this.y+(this.size/2);
            this.fig1X=this.x+(this.size/2);
            this.fig2X=this.x+this.size+(this.size/2);
        }
        this.ctx.drawImage(this.image[this.orientation],this.x,this.y,width,height);

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
    this.setOldPos=function(){
        this.oldPos.x=this.x;
        this.oldPos.y=this.y;
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
    // this.posToToken=function(token){
    //     // if(this.y<token.y){
    //     //     this.y=token.y-80;
    //     //     this.x=token.x;
    //     // }
    //     // else{
    //     //     this.y=token.y+80;
    //     //     this.x=token.x;
    //     // }
    //     if(this.fig1==token.fig1){
    //         this.fig1=token.fig1=null;
    //         if(this.orientation==0){
    //             if(token.x<this.x-20){
    //                 if(token.y<this.y+20){
    //                     token.orientation=3;
    //                     token.y=this.y-40;
    //                     token.x=this.x-40;
    //                 }
    //                 else{
    //                     token.orientation=3;
    //                     token.y=this.y;
    //                     token.x=this.x-80
    //                 }
    //             }
    //             else if(token.x>this.x+20){
    //                 if(token.y<this.y+20){
    //                     token.orientation=1;
    //                     token.y=this.y-40;
    //                     token.x=this.x;
    //                 }
    //                 else{
    //                     token.orientation=1;
    //                     token.y=this.y;
    //                     token.x=this.x+40;
    //                 }
    //             }
    //             else{
    //                 token.orientation=2;
    //                 token.y=this.y-80;
    //                 token.x=this.x;
    //             }
    //             // console.log("y: "+this.y);
    //             // if(this.y>=80){
    //             //     if(this.x>=80){

    //             //     }
    //             //     else if(this.x>=40){

    //             //     }
    //             //     else{
    //             //         if(this.x>=0){
                            
    //             //         }
    //             //     }
    //             //     token.orientation=2;
    //             //     token.y=this.y-80;
    //             //     token.x=this.x;
    //             // }
    //             // else if(this.y>=40){
    //             //     if(this.x<widthCanvas-this.width){
    //             //         console.log(">>>>>>>>>>>>>>>>>>");
    //             //         token.orientation=1;
    //             //         token.y=this.y-40;
    //             //         token.x=this.x;
    //             //     }
    //             //     else if(this.x>80){
    //             //         console.log("<<<<<<<<<<<<<<<<<<<<");
    //             //         token.orientation=3;
    //             //         token.y=this.y-40;
    //             //         token.x=this.x;
    //             //     }
    //             //     else{
    //             //         console.log("++++++++++");
    //             //     }
    //             // }
    //             // else{
    //             //     console.log("_-------------------------");
    //             // }
    //         }
            
    //     }
    // }
    this.matchedFigures=function(token){
        var res=false;
        if(this.fig1==token.fig1 && this.fig1!=null){res=true;}
        else if(this.fig1==token.fig2 && this.fig1!=null){res=true;}
        else if(this.fig2==token.fig1 && this.fig2!=null){res=true;}
        else if(this.fig2==token.fig2 && this.fig2!=null){res=true;}
        return res;
    }
    this.isMatched=function(tokens){
        console.log(tokens[0].fig)
        console.log(this.fig1)
        if(tokens[0].fig==this.fig1 && this.isNear(1,tokens[0])){
            return {res:true,token:0,fig:1};
        }
        else if(tokens[0].fig==this.fig2 && this.isNear(2,tokens[0])){
            return {res:true,token:0,fig:2};
        }
        else if(tokens[1].fig==this.fig1 && this.isNear(1,tokens[1])){
            return {res:true,token:1,fig:1};
        }
        else if(tokens[1].fig==this.fig2 && this.isNear(2,tokens[1])){
            return {res:true,token:1,fig:2};
        }
        else{
            return {res:false};
        }
    }
    this.isNear=function(fig,token){
        if(fig==1){
            if((this.fig1X-token.x)**2+(this.fig1Y-token.y)**2<=90**2){
                return true;
            }
            else{
                return false;
            }
        }
        else if(fig=2){
            if((this.fig2X-token.x)**2+(this.fig2Y-token.y)**2<=90**2){
                return true;
            }
            else{
                return false;
            }
        }
    }
    this.rightRotate=function(){
        this.orientation++;
        this.orientation=this.orientation%4;
    }
    this.leftRotate=function(){
        this.orientation--;
        this.orientation=this.orientation%4;
        if(this.orientation<0){
            this.orientation=3;
        }
    }
}
var Token=function(x,y,imagePath,ctx){
    this.x=x;
    this.y=y;
    this.imagePath=imagePath;
    this.hold=false;
    this.image=new Image();
    this.image.src=this.imagePath;
    this.ctx=ctx;
    var obj=this;
    this.offsetX=0;
    this.offsetY=0;
    this.oldPos={x:this.x,y:this.y};
    
    this.image.onload=function(){
        obj.update();
        obj.width=40;
        obj.height=80;
    }

    this.update=function(){
        if(this.hold){
            this.x=mousePos.x-this.offsetX;
            this.y=mousePos.y-this.offsetY;
        }  
        this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height);

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
    this.setNotSelected=function(){
        this.hold=false;
        if(true){
            this.x=this.oldPos.x;
            this.y=this.oldPos.y;
        }
        else{

        }
    }
}
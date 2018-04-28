var myGamePiece;
var myUpBtn;
var myDownBtn;
var myLeftBtn;
var myRightBtn;

function startGame() {
    myGamePiece = new Token(30, 30, "red", 10, 120);
    myUpBtn = new Token(30, 30, "blue", 50, 10);    
    myDownBtn = new Token(30, 30, "blue", 50, 70);    
    myLeftBtn = new Token(30, 30, "blue", 20, 40);    
    myRightBtn = new Token(30, 30, "blue", 80, 40);                
    myGameArea.start();
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        downMouse=false;
        selectedToken=false;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function (e) {
            if(downMouse){
                myGameArea.x = e.pageX;
                myGameArea.y = e.pageY;
            }
        })
        window.addEventListener('mousedown', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
            downMouse=true;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
            downMouse=false;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function Token(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y; 
    this.hold=false;   
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        console.log(this.hold);
        if(this.hold){
            this.x=myGameArea.x;
            this.y=myGameArea.y;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
            clicked = false;
        }
        else{
            if(!selectedToken){
                this.hold=true;
                selectedToken=true;
            }
        }
        return clicked;
    }
    this.SetNotHold=function(){
        this.hold=false;
        selectedToken=false;
    }
}

function updateGameArea() {
    myGameArea.clear();
    if (myGameArea.x && myGameArea.y) {
        if (myUpBtn.clicked()) {
            myGamePiece.y -= 1;
        }
        if (myDownBtn.clicked()) {
            myGamePiece.y += 1;
        }
        if (myLeftBtn.clicked()) {
            myGamePiece.x += -1;
        }
        if (myRightBtn.clicked()) {
            myGamePiece.x += 1;
        }
    }
    else{
        myUpBtn.SetNotHold();
        myDownBtn.SetNotHold();
        myLeftBtn.SetNotHold();
        myRightBtn.SetNotHold();
    }
    myUpBtn.update();        
    myDownBtn.update();        
    myLeftBtn.update();        
    myRightBtn.update();                                
    myGamePiece.update();
}
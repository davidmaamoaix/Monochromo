var clockInt;
var board;
var time;
var ctx;

var RAND=40;
var DIM=[11,14]; //[ROW,COLUMN]

function mousePos(evt){
  var rect=canvas.getBoundingClientRect();
  return [evt.clientX-rect.left,evt.clientY-rect.top];
}

function clockUpdate(){
  time++;
  var format=[Math.floor(time/6000),Math.floor(time/100)%60,time%100];
  for(var i=0;i<3;i++){
    if(format[i]<10)format[i]='0'+format[i];
  }
  clock.innerHTML=format[0]+':'+format[1]+'.'+format[2];
}

function check(){
  for(var i=0;i<DIM[0];i++){
    for(var j=0;j<DIM[1];j++){
      if(board[i][j]){return;}
    }
  }
  var format=[Math.floor(time/6000),Math.floor(time/100)%60,time%100];
  alert('You Won!!! Time Taken: '+format[0]+' minutes, '+format[1]+'.'+format[2]+' seconds.');
  clearInterval(clockInt);
  var oldCanvas=document.getElementById('game');;
  var newCanvas=oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(newCanvas,oldCanvas);
  start();
}

function interact(row,column,click){
  if(row==-1||row==DIM[0]||column==-1||column==DIM[1]){return;}
  var affected=[];
  var offset=[[-1,0],[0,1],[1,0],[0,-1]]; //UP,RIGHT,DOWN,LEFT
  for(i=0;i<DIM[0];i++){
    for(j=0;j<DIM[1];j++){
      ctx.fillStyle=(board[i][j])?'#FFF':'#000';
      ctx.fillRect(j*50,i*50,50,50);
    }
  }
  affected.push([row,column]);
  for(var i=0;i<4;i++){
    var cell=[row+offset[i][0],column+offset[i][1]];
    if(cell[0]!=-1&&cell[0]!=DIM[0]&&cell[1]!=-1&&cell[1]!=DIM[1]){ //NOT OUT OF BOUND
      affected.push(cell);
    }
  }
  for(var i=0;i<affected.length;i++){
    var curr=board[affected[i][0]][affected[i][1]];
    if(click){
      ctx.fillStyle=(curr)?'#000':'#FFF';
      ctx.fillRect(affected[i][1]*50,affected[i][0]*50,50,50);
      board[affected[i][0]][affected[i][1]]=!curr;
    }else{
      ctx.fillStyle=(curr)?'#CCC':'#333';
      ctx.fillRect(affected[i][1]*50,affected[i][0]*50,50,50);
    }
  }
  if(click){check();}
}

function init(rand){
  for(var i=0;i<rand;i++){
    interact(Math.floor(Math.random()*DIM[0]),Math.floor(Math.random()*DIM[1]),true);
  }
}

function det(evt,click){
  var mouse=mousePos(evt);
  mouse[0]=Math.min(Math.max(mouse[0],0),700);
  mouse[1]=Math.min(Math.max(mouse[1],0),550);
  interact(Math.floor(mouse[1]/50),Math.floor(mouse[0]/50),click);
}

function start(){
  canvas=document.getElementById('game');
  clock=document.getElementById('clock');
  board=[];
  time=0;
  ctx=canvas.getContext('2d');
  canvas.width=700;
  canvas.height=550;
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,700,550);
  for(i=0;i<DIM[0];i++){
    var row=[];
    for(j=0;j<DIM[1];j++){
      row.push(false);
    }
    board.push(row);
  }
  init(RAND);
  canvas.addEventListener('mousemove',function(evt){
    det(evt,false);
  });
  canvas.addEventListener('click',function(evt){
    det(evt,true);
  });
  clockInt=setInterval(clockUpdate,10);
}

document.onload=start();

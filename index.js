alert("Enjoy the Game !\nMade by Abhishek");
$(document).ready(function() {
   var canv = $("#canv")[0];
   var width = 300;
   var height = 340;
   canv.width = width;
   canv.height = height;
   var c = canv.getContext("2d");
   var w = 10;
   var h = 20;
   var s = 17;
   var offsetX = 3;
   var offsetY = 3;
   var x = 4;
   var y = 0;
   var score = 000000;
   var animate;
   var level = 1;        
   var T =  [ 
       [1,1,1],
       [0,1,0],
       [0,0,0]
    ]
              
   var Z = [
      [0,0,0],
      [2,2,0],
      [0,2,2]
   ]
   var S = [
      [0,0,0],
      [0,3,3],
      [3,3,0]
   ]
   var O = [
      [4,4],
      [4,4]
   ]
   var L = [
      [0,5,0],
      [0,5,0],
      [0,5,5]
   ]
   var J = [
      [0,6,0],
      [0,6,0],
      [6,6,0]
   ]
   var I = [
      [0,7,0,0],
      [0,7,0,0],
      [0,7,0,0],
      [0,7,0,0]
   ]
   var colors = ["gray","violet","red","lime","yellow","orange","blue","cyan"];                    
   var tetromino = [O,Z,S,T,L,J,I];
        
   var newBlock;
   var next;
   var rand;
   function randomize() {
      rand = Math.round(Math.random()*6);
   }
   function randomPiece() {
      randomize();
      newBlock = tetromino[rand];
   }
   function nextBlock() {
       randomize();
       next = tetromino[rand];;
   }
   nextBlock();
   randomPiece();
   function clear() {
     c.fillStyle = "black";
     c.fillRect(0,0,width,height);
   }

   function drawBlock(matrix) {
      $.each(matrix, function(index,value) {
            var i = index;
            var v = value;
         $.each(v, function(index,value) {
            var i2 = index;
            var v2 = value;
            if(v2 !== 0) {
               c.beginPath();
               c.rect((i2 + x)*s, (i + y)*s,s,s);
               c.fillStyle = colors[v2];
               c.strokeStyle = "black";
               c.fill();
               c.stroke();
            }                          
         })       
      })
   }
   function drawField() {
     for(var i=0; i<field.length; i++) {
       for(var j=0; j<field[i].length; j++) {
          var x = field[i][j]
          if( x !== 0) {
           c.beginPath();
           c.rect(j*s,i*s,s,s);
           c.fillStyle = colors[x];
           c.strokeStyle = "#333";
           c.fill();
           c.stroke();
          
          }
       }
     
     }
   
   
   }
   function drawNextPiece() {
     c.beginPath();
     c.rect(190,200,90,90);
     c.fillStyle = "#ddd";
     c.strokeStyle = "#333";
     c.fill();
     c.stroke();

     c.fillStyle = "#777";
     c.font = "900 15px sans-serif";
     c.fillText("NEXT:",210,185);
               
     for(var i=0; i<next.length; i++) {
       for(var j=0; j<next[i].length; j++) {
          var x = next[i][j]
          if( x !== 0) {
           c.beginPath();
           c.rect(j*s+210,i*s+220,s,s);
           c.fillStyle = colors[x];
           c.strokeStyle = "#333";
           c.fill();
           c.stroke();
          
          }
       }
     
     }
   
   }
   
   function playArea() {
      var arr = [];
      var temp = [];
      for(var i=0; i<h; i++) {
        for(var j=0; j<w; j++) {
           temp.push(0);
        }
        arr.push(temp);
        temp = [];
      }
      return arr;
   }
   
    
   var field = playArea();
   
   function collision() {
     for(var i=0; i<newBlock.length; i++) {
       for(var j=0; j<newBlock[i].length; j++) {
          if( newBlock[i][j] !== 0 ) {
            if( (y + i) >=  h  ) {
              return true;  
            }
            if(field[i+y][j+x] !== 0 ) {
              return true;           
            }          
          }    
       }
     }
     return false;
   }
   
   function merge(nb,f) {
    
     for(var i=0; i<nb.length; i++) {
       for(var j=0; j<nb[i].length; j++) {       
          if( nb[i][j] !== 0) {
             
          
               f[i+y-1][j+x] = nb[i][j];
                     
          }
       }
     }
   
   }
   function backToTop() {
      x=4;
      y=0;
      score++;
      newBlock = next;
      nextBlock();
      if(collision() == true) {
        gameOver();
      }
   }
   function boundary() {
     for(var i=0; i<newBlock.length; i++) {
       for(var j=0; j<newBlock[i].length; j++){
         if(newBlock[i][j] !== 0) {
          if(x + j  >= w) {
            x--;
          }
          if(x + j  < 0) {
            x++;
          }
         }
       }
     }
   
   }
   
   function restartGame() {
     clear();
     x=4;
     y=0;
     field = playArea();
     score = 0;
     level = 1;
     interval = 100;
     levelUp = 50;
     $("#alert").css("display","none");
     MainAnimation();
   }
   
   function gameOver() {
     clearInterval(animate);
     $("#alert").css("display","block");
   }
   
   function rotate() {
     if(newBlock.length > 2) {
       if(newBlock.length === 3) {
         var temp = [[],[],[]];
       }
       if(newBlock.length === 4) {
         var temp = [[],[],[],[]];
       }
      for(var i=0; i<newBlock.length; i++) {
        for(var j=0; j<newBlock[i].length; j++) {           
              temp[j].push(newBlock[i][j]);
        }
      }
      for(var h=0; h<temp.length; h++) {
        temp[h].reverse();
      }
      newBlock = temp;
      boundary();
     }
   }
   function clearRow() {
    for(var i=0; i<field.length; i++) {
      var str = field[i].join("");
      var temp = [];
    
      if(/0/g.test(str) == false) {
        field.splice(i,1);
        for(var j=0; j<w; j++) {
          temp.push(0);
        }
        field.unshift(temp);
          score += 10;
      }
    }
   }
   function scoreUpdate() {
     
      c.beginPath();
      c.rect(190,80,90,60);
      c.strokeStyle = "black";
      c.fillStyle = "#aad";
      c.stroke();
      c.fill();
      c.fillStyle = "black";
      c.font = "900 15px sans-serif";
      c.fillText("SCORE:",210,95);
      c.fillText(score,210,120);
   }
   function drawLevel() {
      c.fillStyle = "#aac";
      c.fillText("Level " + level,210,40);
   }
   function grid(w,h,s,width,height) {
     
     for(var i=0; i<=w; i++) {
        c.beginPath();
        c.moveTo(i*s,0);
        c.lineTo(i*s,height);
        c.strokeStyle = "lightgray";
        c.stroke();
     }
     
     for(var i=0; i<h; i++) {
        c.beginPath();
        c.moveTo(0,i*s);
        c.lineTo(w*s,i*s);
        c.strokeStyle = "lightgray";
        c.stroke();
     }
     c.strokeStyle = "blue";
     c.strokeRect(0,0,w*s,h*s);
   }
   
   function update() {
      y++;
   }
   
function MainAnimation() {
    var timer = 0;
    var interval = 70;
    var levelUp = 50;
    animate = setInterval( function() {
       clear();
       grid(w,h,s,width,height);
       drawBlock(newBlock);
       if(score >= levelUp) {
         level++;
         levelUp += 50;
         interval -= 10;
         if(interval < 1) {
             interval = 1;
         }
       }
       if(timer == interval) {
         update();
         timer = 0;
       }

       if(collision() == true) {
         merge(newBlock,field);
         backToTop();
         clearRow();
       }
       scoreUpdate();
       drawLevel();
       drawNextPiece();
       drawField();
      timer++;
     },1)
}  
     $("#left").on("click", function(e) {
          x--; 
          boundary(); 
          e.preventDefault();
     })
     $("#right").on("click", function(e) {
          x++;
          boundary();  
          e.preventDefault(); 
     })
     $("#down").on("click", function(e) {
          timer = 0;
          y += 2;
          if(collision()) {
            y--;
          }
         e.preventDefault();
     })
     $("#rotate").on("click", function(e) {
          rotate();
          e.preventDefault();
     })
     $("#reset").on("click", function(e) {
         restartGame();
        
     })
     $(document).keydown(function(e) {
        switch(e.which) {
        case 37:
          x--;
           boundary();   
        break;
     
        case 38: 
          rotate();
          boundary();           
        break;
     
        case 39:
         x++;
          boundary();            
        break;
     
        case 40: 
          timer = 0;
          y += 2;
          if(collision()) {
            y--;
          }
        break;
      }
      e.preventDefault();
     })
      

     
    
     
     MainAnimation();
})
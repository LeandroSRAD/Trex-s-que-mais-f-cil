//criando variáveis

var trex,trexRunning,trexCollide;
var edges;
var ground,groundImage,invisibleGround;
var cloud,cloudImage,cloudGroup;
var cactos,cactoGroup,cactoImage1,cactoImge2,cactoImage3,cactoImage4,cactoImage5,cactoImage6
var score = 0;
var record = 0;
var play = 1;
var end = 0;
var gameState = play;
var gameOver,gameOverImage;
var restart,restartImage;
var soundJump,soundCheckpoint,soundDie;
// carrega as mídias para dentro do jogo (preload)
function preload(){
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage  = loadImage("cloud.png");
  cactoImage1 = loadImage("obstacle1.png");
  cactoImage2 = loadImage("obstacle2.png");
  cactoImage3 = loadImage("obstacle3.png");
  cactoImage4 = loadImage("obstacle4.png");
  cactoImage5 = loadImage("obstacle5.png");
  cactoImage6 = loadImage("obstacle6.png");
  trexCollide = loadAnimation("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  soundJump = loadSound("jump.mp3");
  soundCheckpoint = loadSound("checkpoint.mp3");
  soundDie = loadSound("die.mp3");
}
//A função de setup faz as configurações
function setup(){
  createCanvas(windowWidth,windowHeight);
  edges = createEdgeSprites();
  ground = createSprite(width/2,height-30,width,2);
  ground.addImage("ground",groundImage);
  //criando o trex
  trex = createSprite (50,height-40,20,50);
  trex.addAnimation("running",trexRunning);
  trex.addAnimation("collide",trexCollide);
  //trex.debug = true;
  trex.setCollider("circle",0,0,30);
  //trex.setCollider("rectangle",0,0,50,50,100);
  trex.scale = 0.5;
  gameOver = createSprite(width/2,height-120,10,10);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5
  gameOver.visible = false;
  restart = createSprite(width/2,height-80,10,10);
  restart.addImage(restartImage);
  restart.scale = 0.5
  restart.visible = false;

  invisibleGround = createSprite(width/2,height-10,width,2);
  invisibleGround.visible = false;
  cloudGroup = new Group();
  cactoGroup = new Group();
}

//movimento do jogo (draw)
function draw(){
  //definir a cor do plano de fundo 
  background("white");
   
  if(trex.isTouching(cactoGroup)){
    gameState = end;
    //soundDie.play();
  }

  if(gameState == play){
    score += Math.round(getFrameRate()/60);
    if (score%100 == 0 && score > 0) {
    soundCheckpoint.play();  
    }
    
    if(touches.lenght>0||keyDown("space") && trex.y > height-36){
      trex.velocityY = -12;
      soundJump.play();
      touches = []; 
    }
    ground.velocityX = -(12+score/100)          
    if(ground.x<300){
      ground.x = ground.width/2;
    }
    createClouds(); 
    createCactos();
  }
  
  if(gameState == end){
    trex.changeAnimation("collide",trexCollide);
    ground.velocityX = 0;
    cactoGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    cloudGroup.setLifetimeEach(-1);
    cactoGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    if (record < score) {
      record = score
      
    }
    if (mousePressedOver(restart)) {
      gameState = play;
      gameOver.visible = false;
      restart.visible = false;
      cactoGroup.destroyEach();
      cloudGroup.destroyEach();
      trex.changeAnimation("running",trexRunning);
      score = 0;
    }
  }
  //registrando a posição y do trex
  
  
  fill("black");
  stroke("black");
  textSize(18);
 
  text("Score:"+score,width-150,height-164);
  text("Record:"+record,width-150,height-144);
  //pular quando tecla de espaço for pressionada
  
  
  gravity(); 
  //text ("X: "+mouseX+"/ Y: "+mouseY,mouseX,mouseY);
 //impedir que o trex caia
  trex.collide(invisibleGround);
  drawSprites();
}
function gravity(){
 trex.velocityY+=0.5;
}
function createClouds(){
  if(frameCount%60 == 0){
  cloud = createSprite(width,random(height-180,height-140),50,20);
  cloud.velocityX = -(12+score/100) ;
  cloud.addImage(cloudImage);     
  cloud.scale = random(0.5,1.4);
  cloud.depth = trex.depth-1;
  cloud.lifetime = width/cloud.velocityX;
  cloudGroup.add(cloud);
}
}
function createCactos(){
 if (frameCount%35 == 0) {
   cactos = createSprite(width,height-20,20,20);
   cactos.velocityX = -(17+score/100);
   cactos.scale = 0.5;
   cactos.lifetime = width/cactos.velocityX;
   cactoGroup.add(cactos);
   cactos.depth = trex.depht;
   var sorteioCactos = Math.round(random(1,6));
   switch (sorteioCactos) {
     case 1:cactos.addImage(cactoImage1);
      break;
     case 2:cactos.addImage(cactoImage2);
      break;
     case 3:cactos.addImage(cactoImage3);
      break;
     case 4:cactos.addImage(cactoImage4);
      break;
     case 5:cactos.addImage(cactoImage5);
      break;
     case 6:cactos.addImage(cactoImage6);
   }
  }
}

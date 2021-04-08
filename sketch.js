var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed,foodObj,addFood,feed;
var gameState,readState;
var bd,wr,garden;

function preload(){
   dogImg=loadImage("Dog1.png");
   dogImg1=loadImage("dog2.png");
   bd=loadImage("Bedroom.png");
   wr=loadImage("WashRoom.png");
   garden=loadImage("Garden.png")
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);

  foodObj = new Food();

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.3;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed Dog");
  feed.position(700,95)
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95)
  aadFood.mousePressed(addFoods)

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
}

// function to display UI
function draw() {
  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg1);
  }
  

  
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dogImg);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
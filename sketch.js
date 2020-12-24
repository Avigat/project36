var dog, dogImg, dogImg2, database, foodS, foodStock, foodObj, lastFed;

function preload()
{
  dogImg = loadImage("images/dogImg.png")
  dogImg2 = loadImage("images/dogImg1.png")
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);
  dog = createSprite(800,200,10,10);
  dog.addImage(dogImg);
  dog.scale=0.15;
  
  foodStock=database.ref('Food');
  foodStock.on("value", readStock)

  feed=createButton("Feed the dog");
  feed.position(850,70);
  feed.mousePressed(feedDog);

  addFood=createButton("Add food");
  addFood.position(950,70);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
}

function draw() {  
  background("green");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last feed: "+lastFed%12 + "PM", 350, 35);
  }
  else if(lastFed==0){
    text("Last feed: 12 AM", 350, 35);
  }
  else{
    text("Last fed: "+lastFed + "AM", 350, 35);
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg2);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}
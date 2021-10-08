var bg, bgImg;
var player, defaultPAnim, playerAnim, shooter_shooting;
var bulletsSpr, bulletImg, bulletsGroup;
var lives, lives_1, lives_2, lives_3;
var zombie, zombieAnim, ry;
var shootSd, loseSd, hitSd;
var tEdge, bEdge;
var lives__ = 3,
  kills = 0,
  end = 0,
  // for removing message 'Good job' after some seconds
  time = 0;

function preload() {
  // Images
  lives_1 = loadImage("assets/heart_1.png");
  lives_2 = loadImage("assets/heart_2.png");
  lives_3 = loadImage("assets/heart_3.png");
  bgImg = loadImage("assets/bg.jpeg");
  bulletImg = loadImage("assets/bulletsImg.png");

  // Animations
  shooter_shooting = loadAnimation("assets/shooter_3.png");
  defaultPAnim = loadAnimation("assets/shooter_2.png");
  playerAnim = loadAnimation("assets/shooter_1.png", "assets/shooter_2.png");
  zombieAnim = loadAnimation("assets/zombie_1.png", "assets/zombie_2.png");

  // Sounds
  shootSd = loadSound("assets/shoot.mp3");
  loseSd = loadSound("assets/lose.wav");
  hitSd = loadSound("assets/hit.wav");
}

function setup() {
  bulletsGroup = new Group();
  createCanvas(windowWidth, windowHeight);

  lives = createSprite(120, 50, 50, 50);
  lives.addImage(lives_3);
  lives.scale = 0.25;
  Zombie();

  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addAnimation("PAnim", defaultPAnim);
  player.scale = 0.3;
  player.setCollider("rectangle", 0, 0, 300, 300);

  // Creating top and bottom edge
  tEdge = createSprite(displayWidth - 1150, -20, 100, 20);
  bEdge = createSprite(displayWidth - 1150, height + 20, 100, 20);
  tEdge.setCollider("rectangle", 0, 0, 100, 80);
  bEdge.setCollider("rectangle", 0, 0, 100, 80);
}

function draw() {
  background(bgImg);
  player.collide(tEdge);
  player.collide(bEdge);

  textSize(27);
  fill("aliceblue");
  if (end == 0) {
    text("Kills " + kills, width - 140, 50);
  }
  if (frameCount > 20 && frameCount < 100) {
    textSize(34);
    text("Game Started!", width / 2 - 100, 50);
  }
  if (frameCount > 120 && frameCount < 300 && kills != 1) {
    textSize(27);
    text(
      "Press 'Up and Down' Arrow key to move the player And 's' key to shoot.",
      width / 2 - 390,
      50
    );
  }
  if (kills == 1 && end == 0 && time < 100) {
    time++;
    textSize(34);
    text("Good job!", width / 2 - 90, 70);
  }
  // Adding all the functionality to the zombie
  if (zombie.isTouching(player)) {
    zombie.destroy();
    Zombie();
    hitSd.play();
    if (lives__ == 3) {
      lives.addImage(lives_2);
      lives__ = 2;
    } else if (lives__ == 2) {
      lives.addImage(lives_1);
      lives__ = 1;
    } else if (lives__ == 1) {
      lives.destroy();
      lives__ = 0;
    }
  }
  if (zombie.x < 0) {
    zombie.destroy();
    Zombie();
  }
  // destroying zombies if it touches to bullets
  if (bulletsGroup && bulletsGroup.isTouching(zombie)) {
    zombie.destroy();
    bulletsGroup.destroyEach();
    Zombie();
    kills++;
  }

  if (lives__ == 0) {
    player.destroy();
    zombie.destroy();
    fill("orangered");
    textSize(70);
    stroke("orangered");
    strokeWeight(3);
    text("GAME OVER!!", width / 2 - 230, height / 2 - 30);
    if (end == 0) {
      loseSd.play();
    }
    end = 1;
    fill("white");
    textSize(28);
    if (kills == 0) {
      stroke("red");
      text("You Kill " + kills + " zombie", width / 2 - 100, height / 2 + 30);
    }
    if (kills == 1) {
      stroke("blue");
      text("You Kill " + kills + " zombie", width / 2 - 100, height / 2 + 30);
    }
    if (kills > 1 && kills < 5) {
      stroke("blue");
      text(
        "Nice! You Kill " + kills + " zombies",
        width / 2 - 144,
        height / 2 + 30
      );
    }
    if (kills >= 5) {
      stroke("green");
      text(
        "Well done! You Kill " + kills + " zombies",
        width / 2 - 185,
        height / 2 + 30
      );
    }
    // explosionSd.play();
  }

  //moving the player up and down and making the game mobile compatible using touches
  if (keyDown("UP_ARROW") || touches.length > 0) {
    player.y += -30;
    player.addAnimation("PAnim", playerAnim);
  } else if (keyWentUp("UP_ARROW") || touches.length > 0) {
    player.y += -30;
    player.addAnimation("PAnim", defaultPAnim);
  }
  if (keyDown("DOWN_ARROW") || touches.length > 0) {
    player.y += +30;
    player.addAnimation("PAnim", playerAnim);
  } else if (keyWentUp("DOWN_ARROW") || touches.length > 0) {
    player.y += +30;
    player.addAnimation("PAnim", defaultPAnim);
  }
  //release bullets and change the image of shooter to shooting position when the s key is pressed
  if (keyDown("s")) {
    player.addAnimation("PAnim", shooter_shooting);
    bullets();
  }
  //player goes back to original standing image once we stop pressing the space bar
  else if (keyWentUp("s")) {
    player.addAnimation("PAnim", defaultPAnim);
  }

  drawSprites();
}

function Zombie() {
  // creating zombie sprite
  ry = random([320, 160, 460]);
  zombie = createSprite(width + 30, ry, 50, 50);
  zombie.velocityX = -(3 + kills);
  zombie.addAnimation("zAnim", zombieAnim);
  zombie.scale = 0.14;
  zombie.setCollider("rectangle", 0, 0, 360, 900);
}

function bullets() {
  if (frameCount % 10 == 0) {
    bulletsSpr = createSprite(265, player.y - 24, 20, 20);
    bulletsSpr.addImage(bulletImg);
    bulletsSpr.scale = 0.07;
    bulletsSpr.velocityX = 6;
    bulletsSpr.lifetime = 220;
    shootSd.play();
    bulletsGroup.add(bulletsSpr);
    // console.log(bulletsSpr);
  }
}

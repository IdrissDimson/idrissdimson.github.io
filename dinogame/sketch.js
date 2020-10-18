let asteroid,
  dino,
  platform,
  plusTime,
  minusTime,
  hourglass,
  ellipseWidth,
  myFont,
  birds,
  good_hourglass,
  bad_hourglass,
  asteroidImg,
  birdImg;
let timer = 50;
let explodeAsteroid = false;
let stage = 0;
const GRAVITY = 1;

function preload() {
  // create the font (from: https://www.dafont.com/8bit-wonder.font)
  myFont = loadFont('data/8-BITWONDER.ttf');
  // create the sprites (8 bit social media: https://www.daddydesign.com/wordpress/8-bit-vector-social-icon-pack/)
  good_hourglass = loadImage('data/increase_time.png');
  bad_hourglass = loadImage('data/decrease_time.png');
  asteroidImg = loadImage('data/asteroid.png');
  birdImg = [
    loadImage('data/8bitfbook.png'),
    loadImage('data/8bitgram.png'),
    loadImage('data/8bittwitter.png'),
    loadImage('data/8bitutube.png'),
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // starting width of the crash circle
  ellipseWidth = 50;

  // sprite groups for the game obstacles.
  hourglass = new Group();
  increaseHourglass = new Group();
  birds = new Group();

  // dino
  dino = new Dino(width / 2, 0, 100, 100);
  dino.draw();

  //platform
  platform = createSprite(width / 2, height / 2 + 60, width, 5);
  platform.setCollider('rectangle');
  platform.shapeColor = color(0, 0, 0);

  // flying social medias
  for (let i = 0; i < 40; i++) {
    let bird = createSprite(-200 + i * -width * 1.3, height / 2 - 60, 30, 30);
    // each "bird" is different
    bird.addImage(random(birdImg));
    bird.scale = 0.5;
    birds.add(bird);
  }

  // asteroid
  asteroid = createSprite(width - 100, -80, 100, 100);
  asteroid.addImage(asteroidImg);
  asteroid.scale = 0.25;
  // time increasers
  for (let i = 0; i < 100; i++) {
    // create a 100 time increasers
    let newHourglass = createSprite(0 + i * -width, height / 2 + 35);
    newHourglass.addImage(bad_hourglass);
    hourglass.add(newHourglass);
  }
  // time decreasers
  for (let i = 0; i < 100; i++) {
    // create a 100 time decreasers
    let newSecondHourglass = createSprite(
      -width / 2 + i * -width,
      height / 2 + 40
    );
    newSecondHourglass.addImage(good_hourglass);
    increaseHourglass.add(newSecondHourglass);
  }
}

// Text function to make it easier to create text
function textRef(size, content, x, y, color) {
  textFont(myFont);
  textAlign(CENTER);
  textSize(size);
  fill(color);
  text(content, x, y);
}
// delete sprites after they are out of view
function deleted(collected) {
  collected.remove();
}
function draw() {
  background(250);
  switch (stage) {
    case 0:
      textRef(32, 'Click to start', width / 2, 40, 0);
      //intro screen dino
      push();
      translate(width / 2, height / 2);
      scale(-1, 1);
      dino.animation();
      drawSprites(dino.sprite);
      pop();

      // intro screen platform
      rect(0, height / 2 + 60, width, 5);
      // When mouse is pressed go to the next page
      if (mouseIsPressed) {
        stage++;
      }
      break;
    case 1:
      if (frameCount % 60 === 0 && timer > 0) {
        // if the frameCount is divisible by 60, then a second has passed.
        timer--;
      }
      if (timer <= 0) {
        // if the timer reaches 0, go to the next stage.
        stage++;
      }
      // timer text
      textRef(32, timer, width / 2, 40, 0);
      // running dino
      dino.animation();

      // flying social media positions
      for (var i = 0; i < birds.length; i++) {
        birds[i].position.x += 3;
        // if birds goes out of the screen, delete them
        if (birds[i].position.x > width) {
          deleted(birds[i]);
        }
      }

      for (var i = 0; i < hourglass.length; i++) {
        hourglass[i].position.x += 5;
        // if time goes out of the screen, delete them
        if (hourglass[i].position.x > width) {
          deleted(hourglass[i]);
        }
      }
      for (var i = 0; i < increaseHourglass.length; i++) {
        increaseHourglass[i].position.x += 5;
        // if time go out of the screen, delete them
        if (increaseHourglass[i].position.x > width) {
          deleted(increaseHourglass[i]);
        }
      }
      dino.sprite.overlap(hourglass, (collector, collected) => {
        //reduce the timer
        timer -= 3;
        //collected is the sprite in the group collectibles that triggered
        //the event
        deleted(collected);
      });
      dino.sprite.overlap(increaseHourglass, (collector, collected) => {
        //increase the timer
        timer += 2;
        //collected is the sprite in the group collectibles that triggered
        //the event
        deleted(collected);
      });
      dino.sprite.overlap(birds, (collector, collected) => {
        //reduce the timer
        timer -= 5;
        //collected is the sprite in the group collectibles that triggered
        //the event
        deleted(collected);
      });

      // Debug code code
      // dino.sprite.debug = mouseIsPressed;
      // platform.debug = mouseIsPressed;

      // draw the sprites
      drawSprites();
      break;
    case 2:
      background(245);
      dino.animation();
      // change the animation to the death sequence
      dino.sprite.changeAnimation('dying');
      dino.sprite.position.x = width / 2;
      dino.sprite.position.y = height / 2;

      //remove these sprites from the screen
      hourglass.removeSprites();
      increaseHourglass.removeSprites();
      birds.removeSprites();

      // asteroid's velocity changes
      asteroid.velocity.x -= 0.15;
      asteroid.velocity.y += 0.1;

      dino.sprite.overlap(asteroid, (collector, collected) => {
        //show the animation
        explodeAsteroid = true;
        //collected is the sprite in the group collectibles that triggered
        //the event
        collected.remove();
      });
      drawSprites();
      // once the dino is hit, expand the circle of doom
      if (explodeAsteroid === true) {
        ellipseWidth += 5;
        fill(50);
        ellipse(width / 2, height / 2, ellipseWidth, ellipseWidth);
      }
      // once the animation is over go to the next stage
      if (ellipseWidth > width) {
        stage++;
      }
      break;
    default:
      background(50);
      // Game over screen
      textRef(32, 'The internet is back on', width / 2, 90, 255);
      textRef(32, 'Click to play again', width / 2, 140, 255);

      // When mouse is pressed, the program restarts
      if (mouseIsPressed) {
        window.location.reload(false);
      }
      break;
  }
}

function keyPressed() {
  // jump animation when the game is running
  if (keyCode === 32 && dino.isRunning && stage === 1) {
    dino.sprite.changeAnimation('jumping');
    dino.sprite.velocity.y = -18;
    dino.isRunning = false;
  }
  // don't let space move the scrollbar up and down
  return false;
}

/*
  Dino class
*/

class Dino {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isRunning = true;
    this.sprite = createSprite(x, y, w, h);
  }
  draw() {
    // add the animations
    this.sprite.addAnimation(
      'running',
      'data/dinorun0000.png',
      'data/dinorun0001.png'
    );
    this.sprite.addAnimation('jumping', 'data/dinoJump0000.png');
    this.sprite.addAnimation(
      'ducking',
      'data/dinoduck0000.png',
      'data/dinoduck0001.png'
    );
    this.sprite.addAnimation('dying', 'data/dinorun0000.png');
  }
  animation() {
    // flip the dino around
    this.sprite.mirrorX(-1);
    // once the sprite collides with the platform, continue running
    this.sprite.collide(platform, () => {
      this.sprite.changeAnimation('running');
      this.isRunning = true;
    });
    // always have gravity act on the dino so it doesn't fly
    this.sprite.velocity.y += GRAVITY;
    // ducking animation
    if (keyDown(83) && stage === 1) this.sprite.changeAnimation('ducking');
  }
}

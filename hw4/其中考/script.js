let users = []; // To store users (In a real app, this would be a database)
let currentUser = null;
let gameCanvas = null;
let ctx = null;
let restartButton = null;
let stopButton = null;

function showSignUp() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
}

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
}

function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Check if username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    alert("Username already exists. Please choose another.");
    return;
  }

  // Add user to the list
  users.push({ username, password });
  alert("Sign up successful! You can now log in.");
  showLogin();
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Check if the username and password match
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    currentUser = user;
    alert(`Welcome, ${username}!`);

    // Hide the login and signup forms
    document.getElementById("auth-container").style.display = "none";

    // Show the game container
    document.getElementById("game-container").style.display = "block";

    // Start the game
    startGame();
  } else {
    alert("Incorrect username or password.");
  }
}

function startGame() {
  alert("Starting the Flappy Bird Game!");

  // Create canvas if it doesn't exist
  if (!gameCanvas) {
    gameCanvas = document.createElement("canvas");
    gameCanvas.width = 400;
    gameCanvas.height = 600;
    document.getElementById("game-container").appendChild(gameCanvas);
  }

  ctx = gameCanvas.getContext("2d");

  const bird = {
    x: 50,
    y: 200,
    width: 15,
    height: 15,
    velocity: 0,
    gravity: 0.6,
    lift: -10,
  }; // lift dikurangi
  const pipes = [];
  let score = 0;
  let gameOver = false;

  // Function to draw the bird
  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }

  // Function to draw pipes
  function drawPipes() {
    pipes.forEach((pipe) => {
      ctx.fillStyle = "green";
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      ctx.fillRect(
        pipe.x,
        pipe.topHeight + pipe.gap,
        pipe.width,
        gameCanvas.height
      );
    });
  }

  // Function to move the bird
  function moveBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y > gameCanvas.height - bird.height) {
      gameOver = true;
    }

    if (bird.y < 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    drawBird();
  }

  // Function to create and move pipes
  function movePipes() {
    if (Math.random() < 0.02) {
      // Menentukan tinggi acak untuk pipa atas
      const pipeHeight = Math.floor(Math.random() * 200) + 120;

      // Menentukan jarak minimal antar pipa atas dan bawah
      const minGap = 200; // Jarak minimal antar pipa atas dan bawah
      const gap = Math.max(
        minGap,
        Math.floor(Math.random() * (gameCanvas.height - minGap))
      ); // Gap minimum

      pipes.push({
        x: gameCanvas.width,
        topHeight: pipeHeight,
        gap: gap,
        width: 30,
      }); // Pastikan lebar tiang selalu 30
    }

    pipes.forEach((pipe) => {
      pipe.x -= 2; // Kecepatan gerakan tiang
    });

    pipes.filter((pipe) => pipe.x + pipe.width > 0); // Hapus tiang yang sudah keluar dari layar
    drawPipes();
  }

  // Function to check collisions
  function checkCollisions() {
    pipes.forEach((pipe) => {
      if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
        if (
          bird.y < pipe.topHeight ||
          bird.y + bird.height > pipe.topHeight + pipe.gap
        ) {
          gameOver = true;
        }
      }
    });

    if (gameOver) {
      alert(`Game Over! Your score is ${score}`);

      // Show the restart and stop buttons
      if (!restartButton) {
        restartButton = document.createElement("button");
        restartButton.innerText = "Restart";
        restartButton.style.padding = "10px";
        restartButton.style.marginTop = "20px";
        restartButton.onclick = restartGame;
        document.body.appendChild(restartButton);
      }

      if (!stopButton) {
        stopButton = document.createElement("button");
        stopButton.innerText = "Stop";
        stopButton.style.padding = "10px";
        stopButton.style.marginTop = "20px";
        stopButton.onclick = stopGame;
        document.body.appendChild(stopButton);
      }
    }
  }

  // Event listener to make the bird flap
  window.addEventListener("keydown", () => {
    bird.velocity = bird.lift;
  });

  // Update the game every frame
  function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    moveBird();
    movePipes();
    checkCollisions();
    score++;

    requestAnimationFrame(update);
  }

  update();
}

function restartGame() {
  // Reset all variables
  gameCanvas.width = 400;
  gameCanvas.height = 600;
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Hide the restart and stop buttons
  if (restartButton) {
    restartButton.remove();
    restartButton = null;
  }
  if (stopButton) {
    stopButton.remove();
    stopButton = null;
  }

  // Start the game again
  startGame();
}

function stopGame() {
  // Stop the game and return to login page
  alert("Stopping the game and going back to login.");

  // Hide the game container
  document.getElementById("game-container").style.display = "none";

  // Show the login form again
  document.getElementById("auth-container").style.display = "block";

  // Reset the user session if necessary
  currentUser = null;
}

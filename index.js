let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;
let isPaused = false;

// Create animated stars background
function createStars() {
  const starsContainer = document.getElementById("stars");
  const starCount = 100;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    starsContainer.appendChild(star);
  }
}

// Create floating particles
function createParticle(x, y) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = x + "px";
  particle.style.top = y + "px";
  particle.style.background = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"][
    Math.floor(Math.random() * 4)
  ];
  document.body.appendChild(particle);

  setTimeout(() => {
    document.body.removeChild(particle);
  }, 3000);
}

function calculateTime() {
  const difficulty = document.getElementById("difficulty").value;
  const acceptanceRate = parseFloat(
    document.getElementById("acceptanceRate").value
  );

  // Validation with pixel-style alerts
  if (!difficulty) {
    showPixelAlert("⚠️ SELECT QUEST DIFFICULTY!");
    return;
  }

  if (isNaN(acceptanceRate) || acceptanceRate < 0 || acceptanceRate > 100) {
    showPixelAlert("⚠️ INVALID SUCCESS RATE! (0-100)");
    return;
  }

  // Create particles effect
  createParticle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight
  );

  // Base time calculation
  const baseTime = {
    easy: 30,
    medium: 40,
    hard: 50,
  };

  const baseMinutes = baseTime[difficulty.toLowerCase()];
  let multiplier;

  // Calculate multiplier based on acceptance rate
  if (acceptanceRate >= 60) {
    multiplier = 1.25; // +25%
  } else if (acceptanceRate >= 40) {
    multiplier = 1.4; // +40%
  } else if (acceptanceRate >= 20) {
    multiplier = 1.75; // +75%
  } else {
    multiplier = 2.0; // +100%
  }

  const totalMinutes = baseMinutes * multiplier;
  totalSeconds = Math.round(totalMinutes * 60);
  remainingSeconds = totalSeconds;

  // Display result with gaming terminology
  const difficultyNames = {
    easy: "NOOB MODE",
    medium: "WARRIOR MODE",
    hard: "LEGEND MODE",
  };

  document.getElementById("estimatedTime").innerHTML =
    `🎯 QUEST: ${difficultyNames[difficulty]}<br>` +
    `⏱️ TIME LIMIT: ${totalMinutes.toFixed(2)} minutes<br>` +
    `📈 SUCCESS RATE: ${acceptanceRate}%`;

  updateTimerDisplay();
  document.getElementById("result").classList.add("show");

  // Reset timer state
  resetTimer();
}

function showPixelAlert(message) {
  // Create custom pixel-style alert
  const alert = document.createElement("div");
  alert.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a3a;
                border: 4px solid #ff6b6b;
                padding: 20px;
                color: #fff;
                font-family: 'Press Start 2P', cursive;
                font-size: 12px;
                z-index: 1000;
                text-align: center;
                animation: pixelFadeIn 0.3s ease;
            `;
  alert.textContent = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    document.body.removeChild(alert);
  }, 2000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  document.getElementById("timerDisplay").textContent = timeString;
  document.getElementById("mainHeader").textContent = `${timeString}`;

  // Update progress bar
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;
}

function startTimer() {
  if (totalSeconds === 0) {
    showPixelAlert("⚠️ CALCULATE QUEST TIME FIRST!");
    return;
  }

  isRunning = true;
  isPaused = false;

  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("status").textContent = "🎮 QUEST IN PROGRESS...";
  document.getElementById("status").className = "status-display running";

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      finishTimer();
    }
  }, 1000);
}

function pauseTimer() {
  if (isRunning && !isPaused) {
    clearInterval(timerInterval);
    isPaused = true;
    document.getElementById("startBtn").disabled = false;
    document.getElementById("pauseBtn").disabled = true;
    document.getElementById("status").textContent = "⏸️ QUEST PAUSED";
    document.getElementById("status").className = "status-display paused";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;
  remainingSeconds = totalSeconds;

  document.getElementById("startBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("status").textContent = "";
  document.getElementById("status").className = "status-display";

  document.getElementById("mainHeader").textContent =
    "🎮 PIXEL CODING QUEST 🎮";

  updateTimerDisplay();
}

function finishTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPaused = false;

  document.getElementById("startBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("status").textContent = "🏆 QUEST COMPLETED!";
  document.getElementById("status").className = "status-display finished";

  // Create celebration particles
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 100);
  }

  // Browser notification
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("🎮 Pixel Coding Quest", {
          body: "🏆 Quest completed! Time to submit your code!",
          icon: "🎮",
        });
      }
    });
  }

  showPixelAlert("🏆 QUEST COMPLETED!\n⏰ TIME TO SUBMIT!");
}

// Initialize stars on page load
createStars();

// Request notification permission on page load
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

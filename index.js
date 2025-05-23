let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isRunning = false;
let isPaused = false;

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

  if (!difficulty) {
    showPixelAlert("⚠️ SELECT QUEST DIFFICULTY!");
    return;
  }

  if (isNaN(acceptanceRate) || acceptanceRate < 0 || acceptanceRate > 100) {
    showPixelAlert("⚠️ INVALID SUCCESS RATE! (0-100)");
    return;
  }

  createParticle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight
  );

  const baseTime = {
    easy: 30,
    medium: 40,
    hard: 50,
  };

  const baseMinutes = baseTime[difficulty.toLowerCase()];
  let multiplier;

  if (acceptanceRate >= 60) {
    multiplier = 1;
  } else if (acceptanceRate >= 40) {
    multiplier = 1.2;
  } else if (acceptanceRate >= 20) {
    multiplier = 1.4;
  } else {
    multiplier = 1.6;
  }

  const totalMinutes = baseMinutes * multiplier;
  totalSeconds = Math.round(totalMinutes * 60);
  remainingSeconds = totalSeconds;

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

  resetTimer();
}

function showPixelAlert(message) {
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

  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    }, i * 100);
  }

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

createStars();

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggleBtn = document.getElementById("musicToggleBtn");
let isMusicOn = false;

backgroundMusic.volume = 0.3;

function toggleMusic() {
  isMusicOn = !isMusicOn;

  if (isMusicOn) {
    backgroundMusic.play().catch((error) => {
      console.warn("Musik dicegah bermain otomatis:", error);
      isMusicOn = false;
    });

    if (isMusicOn) {
      musicToggleBtn.textContent = "🎵 Musik: Nyala";
      musicToggleBtn.classList.remove("off");
    } else {
      musicToggleBtn.textContent = "🎵 Musik: Mati";
      musicToggleBtn.classList.add("off");
    }
  } else {
    backgroundMusic.pause();
    musicToggleBtn.textContent = "🎵 Musik: Mati";
    musicToggleBtn.classList.add("off");
  }
}

musicToggleBtn.addEventListener("click", toggleMusic);

musicToggleBtn.classList.add("off");

const originalStartTimer = startTimer;
const originalPauseTimer = pauseTimer;
const originalResetTimer = resetTimer;

window.startTimer = function () {
  originalStartTimer();
  if (isMusicOn) {
    backgroundMusic.play();
  }
};

window.pauseTimer = function () {
  originalPauseTimer();
  if (isMusicOn) {
    backgroundMusic.pause();
  }
};

window.resetTimer = function () {
  originalResetTimer();
  if (isMusicOn) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }
};

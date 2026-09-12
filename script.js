const startScreen = document.querySelector("#startScreen");
const testScreen = document.querySelector("#testScreen");
const resultScreen = document.querySelector("#resultScreen");

const startBtn = document.querySelector("#startBtn");
const actionBtn = document.querySelector("#actionBtn");
const againBtn = document.querySelector("#againBtn");
const shareBtn = document.querySelector("#shareBtn");
const themeBtn = document.querySelector("#themeBtn");

const instruction = document.querySelector("#instruction");
const subInstruction = document.querySelector("#subInstruction");
const statusMessage = document.querySelector("#statusMessage");
const stageLabel = document.querySelector("#stageLabel");
const playArea = document.querySelector("#playArea");

const scoreText = document.querySelector("#scoreText");
const timeText = document.querySelector("#timeText");
const levelText = document.querySelector("#levelText");
const clickText = document.querySelector("#clickText");
const mistakeText = document.querySelector("#mistakeText");
const bestText = document.querySelector("#bestText");
const progressBar = document.querySelector("#progressBar");

const resultEmoji = document.querySelector("#resultEmoji");
const resultTitle = document.querySelector("#resultTitle");
const resultDescription = document.querySelector("#resultDescription");
const finalScore = document.querySelector("#finalScore");
const finalTime = document.querySelector("#finalTime");
const finalClicks = document.querySelector("#finalClicks");
const finalMistakes = document.querySelector("#finalMistakes");
const finalRoast = document.querySelector("#finalRoast");
const scoreRing = document.querySelector(".score-ring");

let score = 100;
let clicks = 0;
let mistakes = 0;
let stage = 1;
let seconds = 0;
let gameRunning = false;
let timerId = null;
let stageTimerId = null;
let lastClickTime = 0;

const messages = [
  "Everything is normal. For now.",
  "Good. Nobody panic.",
  "You are doing suspiciously well.",
  "Are you sure you want to do that?",
  "Please continue pretending this is normal.",
  "Your patience has been noticed and rejected.",
  "The machine is actively judging you.",
  "That was unnecessary. I respect it.",
  "Stay calm. Seriously.",
  "Redirecting to standard safety procedures..."
];

const externalUrls = [
  "https://www.google.com",
  "https://www.wikipedia.org",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.bing.com",
  "https://s3.amazonaws.com/update-complete.html"
];

const stages = [
  {
    title: "Click the button.",
    sub: "This should be easy. Or is it?",
    button: "CLICK ME"
  },
  {
    title: "DO NOT CLICK!",
    sub: "Seriously, do nothing. Wait 3 seconds.",
    button: "DO NOT CLICK"
  },
  {
    title: "Wait for it...",
    sub: "Do NOT click until the button changes.",
    button: "WAIT..."
  },
  {
    title: "Catch the button.",
    sub: "It has developed severe trust issues.",
    button: "CATCH ME"
  },
  {
    title: "Final test: Click the RED button.",
    sub: "Choose carefully.",
    button: "I AM BLUE"
  }
];

function showScreen(screen) {
  [startScreen, testScreen, resultScreen].forEach((item) => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
}

function updateHUD() {
  score = Math.max(0, Math.min(100, Math.round(score)));

  scoreText.textContent = `${score}%`;
  timeText.textContent = `${seconds}s`;
  levelText.textContent = `${stage} / ${stages.length}`;
  clickText.textContent = clicks;
  mistakeText.textContent = mistakes;

  const progress = ((stage - 1) / stages.length) * 100;
  progressBar.style.width = `${Math.min(progress, 100)}%`;

  const best = localStorage.getItem("patienceBest");
  bestText.textContent = best ? `${best}%` : "—";
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function startTimer() {
  clearInterval(timerId);

  timerId = setInterval(() => {
    if (!gameRunning) return;

    seconds++;
    score = Math.max(0, score - 0.5);

    if (seconds % 4 === 0) {
      statusMessage.textContent = randomItem([
        "Still here?",
        "Your patience is wearing thin.",
        "This is taking way longer than expected.",
        "You could close the tab. But your pride won't let you.",
        "System stability critical."
      ]);
    }

    updateHUD();
  }, 1000);
}

function startGame() {
  clearInterval(timerId);
  clearTimeout(stageTimerId);

  score = 100;
  clicks = 0;
  mistakes = 0;
  stage = 1;
  seconds = 0;
  gameRunning = true;
  lastClickTime = Date.now();

  document.body.style.transform = "";
  actionBtn.classList.remove("running");
  actionBtn.style.left = "";
  actionBtn.style.top = "";

  showScreen(testScreen);
  loadStage();
  startTimer();
  updateHUD();
}

function loadStage() {
  const current = stages[stage - 1];

  stageLabel.textContent = `STAGE ${stage}`;
  instruction.textContent = current.title;
  subInstruction.textContent = current.sub;
  actionBtn.textContent = current.button;
  statusMessage.textContent = randomItem(messages);

  actionBtn.classList.remove("running");
  actionBtn.style.left = "";
  actionBtn.style.top = "";
  actionBtn.style.backgroundColor = "";
  document.body.style.transform = "";

  // STAGE 2: Reverse psychology (Wait 3s or penalize)
  if (stage === 2) {
    actionBtn.disabled = false;
    stageTimerId = setTimeout(() => {
      if (stage === 2 && gameRunning) {
        statusMessage.textContent = "Good discipline! Moving on...";
        completeStage();
      }
    }, 3500);
  }

  // STAGE 3: Force wait with fake-out buttons
  if (stage === 3) {
    actionBtn.disabled = true;

    const waitTime = 2500 + Math.floor(Math.random() * 2000);

    stageTimerId = setTimeout(() => {
      actionBtn.disabled = false;
      actionBtn.textContent = "NOW CLICK!";
      statusMessage.textContent = "QUICK!";
      actionBtn.classList.add("flash");
      setTimeout(() => actionBtn.classList.remove("flash"), 500);
    }, waitTime);
  } else if (stage !== 2) {
    actionBtn.disabled = false;
  }

  // STAGE 4: Evasive maneuver
  if (stage === 4) {
    actionBtn.classList.add("running");
  }

  // STAGE 5: Screen Flip & Color Swap trick
  if (stage === 5) {
    actionBtn.style.backgroundColor = "#ff6b6b"; 
    actionBtn.textContent = "CLICK ME";
    // 50% chance to flip the entire screen upside down
    if (Math.random() < 0.5) {
      document.body.style.transform = "rotate(180deg)";
      document.body.style.transition = "transform 0.5s";
    }
  }

  updateHUD();
}

function randomizeButtonPosition() {
  const area = playArea.getBoundingClientRect();
  const button = actionBtn.getBoundingClientRect();

  const maxX = Math.max(5, area.width - button.width - 10);
  const maxY = Math.max(5, area.height - button.height - 10);

  const x = 5 + Math.random() * maxX;
  const y = 5 + Math.random() * maxY;

  actionBtn.style.left = `${x}px`;
  actionBtn.style.top = `${y}px`;
}

function triggerFakeRedirect() {
  statusMessage.textContent = "CRITICAL ERROR: Redirecting to safe zone...";
  setTimeout(() => {
    if (confirm("Fatal Error: Your patience has overflowed. Leave page?")) {
      window.location.href = randomItem(externalUrls);
    } else {
      punishWrongMove();
      statusMessage.textContent = "Redirect cancelled. Penalty applied.";
    }
  }, 300);
}

function punishWrongMove() {
  mistakes++;
  score -= 12;

  statusMessage.textContent = randomItem([
    "Wrong move! Why did you do that?",
    "That was explicitly NOT the instruction.",
    "Did you even read the prompt?",
    "Minus 12 stability points. Tragic.",
    "The system is displeased."
  ]);

  document.body.classList.remove("chaos");
  void document.body.offsetWidth;
  document.body.classList.add("chaos");

  updateHUD();
}

function completeStage() {
  clearTimeout(stageTimerId);
  document.body.style.transform = "";

  if (stage >= stages.length) {
    finishGame();
    return;
  }

  stage++;
  loadStage();
}

actionBtn.addEventListener("click", () => {
  if (!gameRunning || actionBtn.disabled) return;

  const now = Date.now();
  const gap = now - lastClickTime;
  lastClickTime = now;

  clicks++;

  // Stage 2 Trap: Clicking during "DO NOT CLICK"
  if (stage === 2) {
    clearTimeout(stageTimerId);
    punishWrongMove();
    statusMessage.textContent = "I literally said DO NOT CLICK!";
    loadStage(); // Reset stage timer
    return;
  }

  // 15% Random Chance: External Fake Redirect Trap
  if (Math.random() < 0.15 && stage !== 1) {
    triggerFakeRedirect();
    return;
  }

  // Rapid clicking penalty
  if (gap < 200) {
    score -= 6;
    statusMessage.textContent = "STOP SPAMMING! 😭";
  } else {
    score += 1;
    statusMessage.textContent = randomItem(messages);
  }

  // Stage 4 movement
  if (stage === 4) {
    randomizeButtonPosition();
  }

  updateHUD();

  if (stage === 1 && clicks >= 3) {
    completeStage();
  } else if (stage === 3) {
    completeStage();
  } else if (stage === 4 && clicks >= 8) {
    completeStage();
  } else if (stage === 5) {
    completeStage();
  }
});

// Stage 4 & General evasion mechanics
playArea.addEventListener("pointermove", (event) => {
  if (!gameRunning || actionBtn.disabled) return;

  // Stage 4 Teleportation
  if (stage === 4) {
    const btnRect = actionBtn.getBoundingClientRect();
    const dist = Math.hypot(
      event.clientX - (btnRect.left + btnRect.width / 2),
      event.clientY - (btnRect.top + btnRect.height / 2)
    );

    // If mouse gets closer than 70px, teleport away
    if (dist < 70) {
      randomizeButtonPosition();
      statusMessage.textContent = "Too slow!";
      score -= 0.5;
      updateHUD();
    }
  }
});

function finishGame() {
  gameRunning = false;
  clearInterval(timerId);
  clearTimeout(stageTimerId);
  document.body.style.transform = "";

  progressBar.style.width = "100%";

  const final = Math.max(0, Math.min(100, Math.round(score)));
  const oldBest = Number(localStorage.getItem("patienceBest") || 0);

  if (final > oldBest) {
    localStorage.setItem("patienceBest", final);
  }

  let result;

  if (final >= 90) {
    result = {
      emoji: "🤖",
      title: "NOT HUMAN",
      description: "You survived without breaking a sweat.",
      roast: "Are you a bot? No real human has this level of patience."
    };
  } else if (final >= 75) {
    result = {
      emoji: "🧘",
      title: "ZEN MASTER",
      description: "You handled the absolute nonsense surprisingly well.",
      roast: "Respect. Your patience survived our traps."
    };
  } else if (final >= 45) {
    result = {
      emoji: "😤",
      title: "EXTREMELY RATTLED",
      description: "You made it, but your blood pressure did not.",
      roast: "You were one fake redirect away from throwing your mouse."
    };
  } else {
    result = {
      emoji: "💥",
      title: "TOTAL BREAKDOWN",
      description: "Your stability reached absolute zero.",
      roast: "The test completely broke you. Go take a walk outside."
    };
  }

  resultEmoji.textContent = result.emoji;
  resultTitle.textContent = result.title;
  resultDescription.textContent = result.description;
  finalScore.textContent = `${final}%`;
  finalTime.textContent = `${seconds}s`;
  finalClicks.textContent = clicks;
  finalMistakes.textContent = mistakes;
  finalRoast.textContent = result.roast;

  scoreRing.style.setProperty("--score", `${final}%`);

  showScreen(resultScreen);
}

startBtn.addEventListener("click", startGame);
againBtn.addEventListener("click", startGame);

shareBtn.addEventListener("click", async () => {
  const text = `I got ${finalScore.textContent} stability on the Human Stability Test. Result: ${resultTitle.textContent} 🧪`;

  try {
    await navigator.clipboard.writeText(text);
    shareBtn.textContent = "COPIED ✓";

    setTimeout(() => {
      shareBtn.textContent = "COPY RESULT";
    }, 1500);
  } catch {
    shareBtn.textContent = "COPY FAILED";
    setTimeout(() => {
      shareBtn.textContent = "COPY RESULT";
    }, 1500);
  }
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("patienceTheme", isDark ? "dark" : "light");
});

const savedTheme = localStorage.getItem("patienceTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

updateHUD();
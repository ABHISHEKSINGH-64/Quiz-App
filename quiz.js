const QUESTIONS = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Transfer Markup Language",
      "Home Tool Markup Language",
      "Hyperlink Text Management Language"
    ],
    answer: 0
  },
  {
    question: "Which language runs in the browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: 3
  },
  {
    question: "What does CSS control?",
    options: ["Page styling", "Database queries", "Server routing", "File compression"],
    answer: 0
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Mars", "Earth"],
    answer: 1
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: 3
  },
  {
    question: "What is the chemical formula for water?",
    options: ["CO2", "NaCl", "H2O", "O2"],
    answer: 2
  },
  {
    question: "What is the capital of France?",
    options: ["Lyon", "Marseille", "Paris", "Nice"],
    answer: 2
  },
  {
    question: "What is the value of 2 + 2 × 2?",
    options: ["6", "8", "4", "2"],
    answer: 0
  },
  {
    question: "Which HTTP status means Not Found?",
    options: ["200", "301", "404", "500"],
    answer: 2
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answer: 2
  }
];

const SECONDS_PER_QUESTION = 60;
const ADVANCE_DELAY_MS = 1200;

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionTotalEl = document.getElementById("question-total");
const questionText = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const finalScoreEl = document.getElementById("final-score");
const correctCountEl = document.getElementById("correct-count");
const incorrectCountEl = document.getElementById("incorrect-count");
const unansweredCountEl = document.getElementById("unanswered-count");
const reviewList = document.getElementById("review-list");

const screens = [welcomeScreen, quizScreen, resultsScreen];

let currentIndex = 0;
let score = 0;
let correctCount = 0;
let incorrectCount = 0;
let unansweredCount = 0;
let hasAnswered = false;
let leaving = false;
let secondsLeft = SECONDS_PER_QUESTION;
let timerId = null;
let responses = [];

const showScreen = (screen) => {
  screens.forEach((item) => {
    item.classList.add("hidden");
  });
  screen.classList.remove("hidden");
};

const applyScore = (delta) => {
  score = Math.max(0, score + delta);
  scoreEl.textContent = `Score ${score}`;
};

const updateProgress = () => {
  const current = currentIndex + 1;
  const total = QUESTIONS.length;
  progressLabel.textContent = `Question ${current} of ${total}`;
  progressBar.style.width = `${(current / total) * 100}%`;
};

const paintTimer = () => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
  if (secondsLeft <= 10) {
    timerEl.classList.add("warning");
  } else {
    timerEl.classList.remove("warning");
  }
};

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
};

const goNext = () => {
  if (leaving) {
    return;
  }
  leaving = true;
  stopTimer();
  if (currentIndex < QUESTIONS.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
};

const handleTimeout = () => {
  if (hasAnswered) {
    return;
  }
  hasAnswered = true;
  stopTimer();
  unansweredCount += 1;
  applyScore(-1);
  responses[currentIndex] = { selected: null, outcome: "unanswered" };

  const item = QUESTIONS[currentIndex];
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach((button, optionIndex) => {
    button.disabled = true;
    if (optionIndex === item.answer) {
      button.classList.add("correct");
    }
  });

  feedbackEl.textContent = "Time is up. The correct answer is highlighted.";
  feedbackEl.className = "feedback unanswered";
  nextBtn.disabled = false;
  setTimeout(goNext, ADVANCE_DELAY_MS);
};

const tick = () => {
  secondsLeft -= 1;
  paintTimer();
  if (secondsLeft <= 0) {
    handleTimeout();
  }
};

const startTimer = () => {
  stopTimer();
  secondsLeft = SECONDS_PER_QUESTION;
  paintTimer();
  timerId = setInterval(tick, 1000);
};

const selectAnswer = (optionIndex) => {
  if (hasAnswered) {
    return;
  }
  hasAnswered = true;
  stopTimer();

  const item = QUESTIONS[currentIndex];
  const buttons = optionsEl.querySelectorAll("button");
  const isCorrect = optionIndex === item.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) {
      button.classList.add("correct");
    } else if (index === optionIndex) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    applyScore(1);
    correctCount += 1;
    feedbackEl.textContent = "Correct.";
    feedbackEl.className = "feedback correct";
    responses[currentIndex] = { selected: optionIndex, outcome: "correct" };
  } else {
    applyScore(-1);
    incorrectCount += 1;
    feedbackEl.textContent = "Incorrect. The correct answer is highlighted.";
    feedbackEl.className = "feedback wrong";
    responses[currentIndex] = { selected: optionIndex, outcome: "incorrect" };
  }

  nextBtn.disabled = false;
};

const renderQuestion = () => {
  const item = QUESTIONS[currentIndex];
  leaving = false;
  hasAnswered = false;
  questionText.textContent = item.question;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  optionsEl.replaceChildren();
  applyScore(0);
  updateProgress();

  item.options.forEach((label, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = label;
    button.addEventListener("click", () => {
      selectAnswer(optionIndex);
    });
    optionsEl.append(button);
  });

  if (currentIndex === QUESTIONS.length - 1) {
    nextBtn.textContent = "See results";
  } else {
    nextBtn.textContent = "Next Question";
  }
  nextBtn.disabled = true;
  startTimer();
};

const showResults = () => {
  stopTimer();
  finalScoreEl.textContent = `Score ${score}`;
  correctCountEl.textContent = String(correctCount);
  incorrectCountEl.textContent = String(incorrectCount);
  unansweredCountEl.textContent = String(unansweredCount);
  reviewList.replaceChildren();

  QUESTIONS.forEach((item, index) => {
    const response = responses[index];
    const li = document.createElement("li");
    const prompt = document.createElement("strong");
    const detail = document.createElement("p");
    const outcome = response ? response.outcome : "unanswered";
    const selectedText = response && response.selected !== null
      ? item.options[response.selected]
      : "Not answered";

    prompt.textContent = item.question;
    detail.innerHTML = `<span class="tag ${outcome}">${outcome}</span> · Your answer: ${selectedText} · Correct: ${item.options[item.answer]}`;
    li.append(prompt, detail);
    reviewList.append(li);
  });

  showScreen(resultsScreen);
};

const resetState = () => {
  stopTimer();
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  incorrectCount = 0;
  unansweredCount = 0;
  hasAnswered = false;
  leaving = false;
  responses = [];
};

const startQuiz = () => {
  resetState();
  showScreen(quizScreen);
  renderQuestion();
};

const restartQuiz = () => {
  resetState();
  showScreen(welcomeScreen);
};

questionTotalEl.textContent = String(QUESTIONS.length);
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goNext);
restartBtn.addEventListener("click", restartQuiz);

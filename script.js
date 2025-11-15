let imageList = [];
let currentImage = "";
let startTime;
let timerInterval;
let totalQuestions = 0;
let totalSeconds = 0;

const imageEl = document.getElementById("captchaImage");
const inputEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const timerEl = document.getElementById("timer");
const statsEl = document.getElementById("stats");
const startBtn = document.getElementById("startBtn");

// 載入題目
fetch("images/list.json")
  .then((res) => res.json())
  .then((data) => {
    imageList = data;
    startBtn.disabled = false;
  })
  .catch((err) => {
    feedbackEl.style.display = "block";
    feedbackEl.textContent =
      "⚠️ 無法載入 images/list.json，請確認 list.json 是否存在。";
    console.error(err);
  });

// === 點擊「開始訓練」按鈕 ===
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";

  // 顯示訓練介面
  imageEl.style.display = "block";
  inputEl.style.display = "inline-block";
  feedbackEl.style.display = "block";
  timerEl.style.display = "block";
  statsEl.style.display = "block";

  showNextQuestion();
});

// === 顯示新題目 ===
function showNextQuestion() {
  currentImage = imageList[Math.floor(Math.random() * imageList.length)];
  imageEl.src = `images/${currentImage}`;
  inputEl.value = "";
  feedbackEl.textContent = "";
  inputEl.focus();
  resetTimer();
}

// === 檢查答案 ===
function checkAnswer() {
  const userAnswer = inputEl.value.trim().toUpperCase();
  const correctAnswer = currentImage.split(".")[0].toUpperCase();

  if (userAnswer === correctAnswer) {
    const usedSeconds = Math.floor((Date.now() - startTime) / 1000);
    feedbackEl.textContent = `✅ 正確！你用了 ${usedSeconds} 秒。`;

    totalQuestions++;
    totalSeconds += usedSeconds;
    updateStats();

    clearInterval(timerInterval);
    setTimeout(showNextQuestion, 1000); // 1秒後下一題
  } else {
    feedbackEl.textContent = "❌ 錯誤，請再試一次！";
  }
}

// === Enter 鍵確認答案 ===
inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// ====== 計時控制 ======
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = `⏱ 時間：${seconds} 秒`;
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerEl.textContent = "⏱ 時間：0 秒";
  startTimer();
}

// ====== 統計 ======
function updateStats() {
  const avg = (totalSeconds / totalQuestions).toFixed(1);
  statsEl.textContent = `答題數：${totalQuestions}｜平均時間：${avg} 秒`;
}

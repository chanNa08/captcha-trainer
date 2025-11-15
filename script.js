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

fetch("images/list.json")
  .then((res) => res.json())
  .then((data) => {
    imageList = data;
    showNextQuestion();
  })
  .catch((err) => {
    feedbackEl.textContent =
      "⚠️ 無法載入 images/list.json，請確認 list.json 是否存在。";
    console.error(err);
  });

// 顯示下一題
function showNextQuestion() {
  currentImage = imageList[Math.floor(Math.random() * imageList.length)];
  imageEl.src = `images/${currentImage}`;
  inputEl.value = "";
  feedbackEl.textContent = "";
  inputEl.focus();
  resetTimer();
}

// 檢查答案
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

// 鍵盤事件
inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// ====== 計時功能 ======
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

// ====== 統計顯示 ======
function updateStats() {
  const avg = (totalSeconds / totalQuestions).toFixed(1);
  statsEl.textContent = `答題數：${totalQuestions}｜平均時間：${avg} 秒`;
}

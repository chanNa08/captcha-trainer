// 讀取 images/list.json，自動建立題庫
async function loadCaptchas() {
  const response = await fetch("images/list.json");
  if (!response.ok) throw new Error("無法讀取 list.json");
  const files = await response.json();

  return files.map(file => ({
    img: `images/${file}`,
    answer: file.replace(/\.[^.]+$/, "").toUpperCase()
  }));
}

let captchas = [];
let currentCaptcha = null;
const captchaImage = document.getElementById("captchaImage");
const userInput = document.getElementById("userInput");
const feedback = document.getElementById("feedback");

async function init() {
  try {
    captchas = await loadCaptchas();
    if (captchas.length === 0) {
      feedback.textContent = "⚠️ images 資料夾中沒有找到圖片。";
      return;
    }
    showCaptcha();
  } catch (error) {
    feedback.textContent = "❌ 無法載入 images/list.json";
    console.error(error);
  }
}

function getRandomCaptcha() {
  const index = Math.floor(Math.random() * captchas.length);
  return captchas[index];
}

function showCaptcha() {
  currentCaptcha = getRandomCaptcha();
  captchaImage.src = currentCaptcha.img;
  userInput.value = "";
  feedback.textContent = "";
  userInput.focus();
}

function checkAnswer() {
  const userAnswer = userInput.value.trim();
  if (userAnswer.toUpperCase() === currentCaptcha.answer.toUpperCase()) {
    feedback.textContent = "✅ 正確！";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "❌ 錯誤";
    feedback.className = "feedback wrong";
  }
  setTimeout(showCaptcha, 1000);
}

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});

init();
let currentQuestionIndex = 0;
let score = 0;
let questions = []; // 選択された難易度の問題を格納

const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const scoreElement = document.getElementById("score");
const resultContainer = document.getElementById("result-container");
const restartButton = document.getElementById("restart-button");
import { easyQuestions, mediumQuestions, hardQuestions } from './question.js';

/*const easyQuestions = [
    { text: "37は素数か？", options: ["素数", "素数でない"], correct: 0 },
    { text: "343を正しく素因数分解した選択肢を選べ", options: ["３×７×１７", "７×７×７","１７×１９","素数"], correct: 1 },
    { text: "1001を正しく素因数分解した選択肢を選べ", options: ["素数", "７×７×２３","３１×４１","７×１１×１３"], correct: 3 },
];
const mediumQuestions = [
    { text: "91を素因数分解してみよう!", options: ["素数", "11×13", "3×7×7", "7×13"], correct: 3 },
];
const hardQuestions = [
    { text: "247を素因数分解してみよう", options: ["素数", "7×37", "13×19", "17×17"], correct: 2 },
]; いったん消す*/

// 難易度選択ボタンの作成
const difficultyContainer = document.createElement("div");
difficultyContainer.id = "difficulty-container";

["easy", "medium", "hard"].forEach(difficulty => {
    const button = document.createElement("button");
    button.textContent = difficulty === "easy" ? "簡単" : difficulty === "medium" ? "普通" : "難しい";
    button.addEventListener("click", () => selectDifficulty(difficulty));
    difficultyContainer.appendChild(button);
});

document.body.insertBefore(difficultyContainer, quizContainer);

function selectDifficulty(difficulty) {
    if (difficulty === "easy") {
        questions = easyQuestions;
    } else if (difficulty === "medium") {
        questions = mediumQuestions;
    } else if (difficulty === "hard") {
        questions = hardQuestions;
    }
    shuffleArray(questions); // ランダムにシャッフル
    difficultyContainer.style.display = "none";
    quizContainer.style.display = "block"; // クイズ画面を表示
    showQuestion();
}

function showQuestion() {
    stopTimer(); // 前のタイマーをリセット
    startTimer(); // 新しいタイマーを開始

    const question = questions[currentQuestionIndex];
    if (!question) return;

    questionElement.textContent = question.text; // 問題文を表示
    optionsContainer.innerHTML = ""; // 選択肢エリアをリセット
    feedbackElement.textContent = ""; // フィードバックをリセット

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => handleAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(selectedIndex) {
    const buttons = document.querySelectorAll("#options button");
    buttons.forEach(button => button.disabled = true);

    const question = questions[currentQuestionIndex];
    if (selectedIndex === question.correct) {
        feedbackElement.textContent = "正解！";
        feedbackElement.style.color = "green";
        score++;
        scoreElement.textContent = `スコア: ${score}`;
    } else {
        feedbackElement.textContent = `不正解... 正解は「${question.options[question.correct]}」です。`;
        feedbackElement.style.color = "red";
    }
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
        nextButton.style.display = "none";
    } else {
        showResult();
    }
});

function showResult() {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const finalScoreElement = document.getElementById("final-score");
    const commentElement = document.getElementById("comment");

    let message = "";
    if (score === questions.length) {
        message = "素晴らしい！全問正解です！";
    } else if (score > questions.length / 2) {
        message = "良いですね！もう少しで満点！";
    } else {
        message = "まだまだこれから！がんばりましょう！";
    }

    finalScoreElement.textContent = `あなたのスコア: ${score}`;
    commentElement.textContent = message;
}

restartButton.addEventListener("click", () => {
    resultContainer.style.display = "none";
    difficultyContainer.style.display = "block";
    score = 0;
    currentQuestionIndex = 0;
    scoreElement.textContent = `スコア: ${score}`;
});

let timer;
const timeLimit = 10;
let remainingTime = timeLimit;

const timerElement = document.createElement("p");
timerElement.id = "timer";
quizContainer.appendChild(timerElement);

function startTimer() {
    remainingTime = timeLimit;
    timerElement.textContent = `残り時間: ${remainingTime}秒`;
    timer = setInterval(() => {
        remainingTime--;
        timerElement.textContent = `残り時間: ${remainingTime}秒`;
        if (remainingTime <= 0) {
            clearInterval(timer);
            feedbackElement.textContent = "時間切れ！";
            feedbackElement.style.color = "red";
            nextButton.style.display = "block";
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

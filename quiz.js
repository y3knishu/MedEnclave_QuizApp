let subject = new URLSearchParams(window.location.search).get('subject');
document.getElementById('subject-title').innerText = subject.replace('_', ' ');

let currentQuestion = 0;
let questions = [];
let answers = {};
let reviewMarked = {};

fetch('questions/' + subject + '.json')
.then(response => response.json())
.then(data => {
    questions = data.questions;
    renderPalette();
    renderQuestion(currentQuestion);
});

function renderQuestion(index) {
    const q = questions[index];
    const box = document.getElementById('question-box');
    let optionsHtml = q.options.map((opt, i) => {
        let selected = answers[index] == i ? 'checked' : '';
        return `<label><input type="radio" name="q${index}" value="${i}" ${selected}> ${opt}</label><br>`;
    }).join('');
    box.innerHTML = `<p><b>Q${index+1}. ${q.question}</b></p>` + optionsHtml;
}

function renderPalette() {
    const palette = document.getElementById('question-palette');
    palette.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        let btn = document.createElement('button');
        btn.innerText = i+1;
        btn.className = 'palette-btn';
        updateButtonColor(btn, i);
        btn.onclick = () => {
            currentQuestion = i;
            renderQuestion(i);
        };
        palette.appendChild(btn);
    }
}

function updateButtonColor(btn, index) {
    if (reviewMarked[index]) {
        btn.classList.add('review');
    } else if (answers[index] !== undefined) {
        btn.classList.add('answered');
    } else {
        btn.classList.add('not-answered');
    }
}

function saveAndNext() {
    const selected = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
    if (selected) {
        answers[currentQuestion] = parseInt(selected.value);
    }
    reviewMarked[currentQuestion] = false;
    if (currentQuestion < questions.length - 1) currentQuestion++;
    renderQuestion(currentQuestion);
    renderPalette();
}

function markForReview() {
    reviewMarked[currentQuestion] = true;
    const selected = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
    if (selected) {
        answers[currentQuestion] = parseInt(selected.value);
    }
    if (currentQuestion < questions.length - 1) currentQuestion++;
    renderQuestion(currentQuestion);
    renderPalette();
}

function prevQuestion() {
    if (currentQuestion > 0) currentQuestion--;
    renderQuestion(currentQuestion);
}

function submitQuiz() {
    let correct = 0;
    let resultBox = document.getElementById('result-box');
    resultBox.innerHTML = "<h3>Result:</h3>";
    questions.forEach((q, i) => {
        let userAns = answers[i];
        let correctAns = q.answer;
        let result = userAns === correctAns ? "✅" : "❌";
        if (userAns === correctAns) correct++;
        resultBox.innerHTML += `<p><b>Q${i+1}.</b> ${q.question}<br>
        Your answer: ${userAns !== undefined ? q.options[userAns] : "Not Answered"}<br>
        Correct answer: <b>${q.options[correctAns]}</b> ${result}</p>`;
    });
    resultBox.innerHTML = `<h3>Total Correct: ${correct}/${questions.length}</h3>` + resultBox.innerHTML;
}

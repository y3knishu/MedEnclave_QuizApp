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
    box.innerHTML = `<p><b>Q${index+1}. ${q.question}</b></p>` +
        q.options.map((opt, i) => 
        `<label><input type="radio" name="q${index}" value="${i}" ${answers[index] == i ? 'checked' : ''}> ${opt}</label><br>`).join('');
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
    questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
    });
    document.getElementById('result-box').innerHTML = 
        `<p><b>Total Questions:</b> ${questions.length}</p>
         <p><b>Correct:</b> ${correct}</p>
         <p><b>Incorrect:</b> ${questions.length - correct}</p>`;
}

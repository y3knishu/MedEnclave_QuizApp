let questions = [];
let current = 0;
let answers = {};
let reviewMarked = {};

function getSubject() {
  const url = new URLSearchParams(window.location.search);
  return url.get("subject");
}

document.addEventListener("DOMContentLoaded", () => {
  const subject = getSubject();
  fetch(`https://89349997-93dd-43a4-a52c-ef5091bd1e4e-00-1vhawurtdnpio.sisko.replit.dev/data/${subject}.json`)
    .then(res => res.json())
    .then(data => {
      questions = data.questions;
      renderPalette();
      showQuestion(current);
    })
    .catch(() => {
      document.getElementById("quiz-container").innerHTML = "<h3>Error loading questions. Please check the subject or try again later.</h3>";
    });
});

function renderPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const btn = document.createElement("button");
    btn.id = "qbtn" + i;
    btn.className = "unanswered";
    btn.innerText = i + 1;
    btn.onclick = () => {
      current = i;
      showQuestion(i);
    };
    palette.appendChild(btn);
  }
}

function showQuestion(index) {
  const q = questions[index];
  document.getElementById("question-number").innerText = "Question " + (index + 1);
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.disabled = answers[index] !== undefined;
    if (answers[index] !== undefined) {
      if (i === q.answer) btn.classList.add("correct");
      if (i === answers[index] && i !== q.answer) btn.classList.add("incorrect");
    }
    btn.onclick = () => {
      answers[index] = i;
      reviewMarked[index] = false;
      updatePalette(index);
      highlightAnswer(i, q.answer);
    };
    optionsDiv.appendChild(btn);
  });
}

function highlightAnswer(selected, correct) {
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("incorrect");
  });
}

function updatePalette(i) {
  const btn = document.getElementById("qbtn" + i);
  if (reviewMarked[i]) {
    btn.className = "review";
  } else if (answers[i] !== undefined) {
    btn.className = "answered";
  } else {
    btn.className = "unanswered";
  }
}

function saveAndNext() {
  if (current < questions.length - 1) {
    current++;
    showQuestion(current);
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    showQuestion(current);
  }
}

function markForReview() {
  reviewMarked[current] = true;
  updatePalette(current);
  saveAndNext();
}

function submitQuiz() {
  let correct = 0;
  let subject = getSubject();

  questions.forEach((q, i) => {
    if (answers[i] === q.answer) correct++;
  });

  localStorage.setItem(`score_${subject}`, JSON.stringify({
    correct,
    total: questions.length,
    timestamp: new Date().toISOString()
  }));

  let reviewHTML = `
    <div style="padding:2rem">
      <h2>Quiz Complete</h2>
      <p><strong>Correct:</strong> ${correct}</p>
      <p><strong>Incorrect:</strong> ${questions.length - correct}</p>
      <h3>Review:</h3>
      <ol>
  `;

  questions.forEach((q, i) => {
    const userAnsIndex = answers[i];
    const userAns = userAnsIndex !== undefined ? q.options[userAnsIndex] : "<i>Not Answered</i>";
    const correctAns = q.options[q.answer];
    const isCorrect = userAnsIndex === q.answer;
    reviewHTML += `
      <li style="margin-bottom:10px">
        <strong>Q${i + 1}:</strong> ${q.question}<br>
        <span>Your Answer: <b style="color:${isCorrect ? 'green' : 'red'}">${userAns}</b></span><br>
        <span>Correct Answer: <b style="color:green">${correctAns}</b></span>
      </li>
    `;
  });

  reviewHTML += `</ol>
    <br><button onclick="window.location.href='quiz.html?subject=${subject}'">Retake Quiz</button>
    <br><br><a href="index.html">Back to Subjects</a></div>`;
  document.body.innerHTML = reviewHTML;
}

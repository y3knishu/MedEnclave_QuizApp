<script>
let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;

function loadQuestions(subject) {
  fetch(`data/${subject}.json`)
    .then(res => res.json())
    .then(data => {
      questions = data.questions || [];
      if (questions.length === 0) {
        alert("No questions found for this subject.");
        return;
      }
      currentQuestion = 0;
      correctAnswers = 0;
      showQuestion();
    })
    .catch(err => {
      alert("Error loading questions: " + err.message);
    });
}

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-number").innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => handleAnswer(index);
    optionsDiv.appendChild(btn);
  });
}

function handleAnswer(selected) {
  if (selected === questions[currentQuestion].answer) {
    correctAnswers++;
  }
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-container").innerHTML = `
    <h2>Quiz Complete</h2>
    <p>Correct: ${correctAnswers}</p>
    <p>Incorrect: ${questions.length - correctAnswers}</p>
  `;
}
</script>

let currentSubject  = "";
let subjectQs       = [];
let currentIdx      = 0;
let answers         = [];
let questionState   = [];
let timerInterval   = null;
let secondsLeft     = 30 * 60;
let quizStartTime   = 0;

document.addEventListener("DOMContentLoaded", async function () {
  if (!checkAuth()) return;

  const saved = sessionStorage.getItem("selectedSubject");
  if (!saved) { redirectTo("index.html"); return; }

  const validSubjects = ["DSA", "DBMS", "OS", "CN", "OOPS"];
  if (!validSubjects.includes(saved)) { redirectTo("index.html"); return; }

  // All subjects are AI-generated
  const loadingEl = document.createElement("div");
  loadingEl.id = "ai-loading";
  loadingEl.style.cssText = "position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);z-index:999;gap:12px;font-size:15px;color:var(--text-secondary);";
  loadingEl.innerHTML = '<div style="font-size:28px">✦</div><div>Generating your ' + saved + ' quiz…</div>';
  document.body.appendChild(loadingEl);

  try {
    // ✅ New — uses api.js like everything else
    const data = await api.generateQuiz(saved);
    if (!data.success) throw new Error(data.message);
    subjectQs = data.questions;
  } catch (err) {
    alert("Failed to generate AI quiz: " + err.message);
    redirectTo("index.html");
    return;
  } finally {
    loadingEl.remove();
  }

  currentSubject = saved;
  answers        = new Array(subjectQs.length).fill(null);
  questionState  = new Array(subjectQs.length).fill("not-visited");
  questionState[0] = "seen";
  quizStartTime  = Date.now();

  setText("subject-badge", currentSubject);
  buildSidebarGrid();
  renderQuestion();
  startTimer();

  getEl("next-btn").addEventListener("click", handleNext);
  getEl("prev-btn").addEventListener("click", handlePrev);
  getEl("review-btn").addEventListener("click", handleMarkReview);
  getEl("submit-btn").addEventListener("click", openModal);
  getEl("leave-btn").addEventListener("click", function () {
    if (confirm("Leave the test? Your progress will be lost.")) {
      clearInterval(timerInterval);
      redirectTo("index.html");
    }
  });

  getEl("modal-cancel").addEventListener("click", closeModal);
  getEl("modal-confirm").addEventListener("click", submitQuiz);

  getEl("modal-overlay").addEventListener("click", function (e) {
    if (e.target === getEl("modal-overlay")) closeModal();
  });
});

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(function () {
    secondsLeft--;
    updateTimerDisplay();
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const display = getEl("timer-display");
  display.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  removeClass(display, "warning");
  removeClass(display, "danger");
  if (secondsLeft <= 300) addClass(display, "danger");
  else if (secondsLeft <= 600) addClass(display, "warning");
}

function renderQuestion() {
  const q = subjectQs[currentIdx];
  const total = subjectQs.length;

  const pct = (currentIdx / total) * 100;
  getEl("progress-fill").style.width = pct + "%";

  setText("question-counter", "Question " + (currentIdx + 1) + " of " + total);
  setText("question-text", q.question);

  const labels = ["A", "B", "C", "D"];
  const container = getEl("options-container");
  container.innerHTML = "";

  q.options.forEach(function (text, idx) {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (answers[currentIdx] === idx ? " selected" : "");
    btn.innerHTML =
      '<span class="option-label">' + labels[idx] + '</span>' +
      '<span>' + text + '</span>';
    btn.addEventListener("click", function () { selectOption(idx); });
    container.appendChild(btn);
  });

  const reviewBtn = getEl("review-btn");
  if (questionState[currentIdx] === "review") {
    addClass(reviewBtn, "active");
    reviewBtn.textContent = "Unmark Review";
  } else {
    removeClass(reviewBtn, "active");
    reviewBtn.textContent = "Mark for Review";
  }

  getEl("prev-btn").style.visibility = currentIdx === 0 ? "hidden" : "visible";
  getEl("next-btn").textContent = currentIdx === total - 1 ? "Save & Submit" : "Save & Next";

  setText("warning-msg", "");
  updateSidebar();
}

function selectOption(idx) {
  answers[currentIdx] = idx;
  if (questionState[currentIdx] !== "review") {
    questionState[currentIdx] = "answered";
  }

  const btns = document.querySelectorAll(".option-btn");
  btns.forEach(function (btn, i) {
    btn.classList.toggle("selected", i === idx);
  });

  updateSidebar();
}

function handleNext() {
  if (answers[currentIdx] === null && questionState[currentIdx] !== "review") {
    setText("warning-msg", "Please select an answer or mark for review before continuing.");
    return;
  }

  if (currentIdx === subjectQs.length - 1) {
    openModal();
    return;
  }

  currentIdx++;
  if (questionState[currentIdx] === "not-visited") {
    questionState[currentIdx] = "seen";
  }
  renderQuestion();
}

function handlePrev() {
  if (currentIdx === 0) return;
  currentIdx--;
  renderQuestion();
}

function handleMarkReview() {
  if (questionState[currentIdx] === "review") {
    questionState[currentIdx] = answers[currentIdx] !== null ? "answered" : "seen";
  } else {
    questionState[currentIdx] = "review";
  }
  renderQuestion();
}

function buildSidebarGrid() {
  const grid = getEl("sidebar-grid");
  grid.innerHTML = "";
  subjectQs.forEach(function (_, i) {
    const sq = document.createElement("div");
    sq.className = "q-square";
    sq.id = "sq-" + i;
    sq.textContent = i + 1;
    sq.addEventListener("click", function () { jumpTo(i); });
    grid.appendChild(sq);
  });
}

function jumpTo(idx) {
  currentIdx = idx;
  if (questionState[currentIdx] === "not-visited") {
    questionState[currentIdx] = "seen";
  }
  renderQuestion();
}

function updateSidebar() {
  let answered = 0, seen = 0, review = 0;

  subjectQs.forEach(function (_, i) {
    const sq = getEl("sq-" + i);
    if (!sq) return;

    sq.className = "q-square";
    if (i === currentIdx) addClass(sq, "current");

    const st = questionState[i];
    if (st === "answered")    { addClass(sq, "answered");  answered++; }
    else if (st === "review") { addClass(sq, "review");    review++; }
    else if (st === "seen")   { addClass(sq, "seen");      seen++; }
  });

  setText("stat-answered", answered);
  setText("stat-seen", seen);
  setText("stat-review", review);
  setText("stat-left", Math.max(0, subjectQs.length - answered));
}

function openModal() {
  const answered = questionState.filter(s => s === "answered").length;
  const unanswered = subjectQs.length - answered;
  const review = questionState.filter(s => s === "review").length;

  setText("modal-answered", answered);
  setText("modal-unanswered", unanswered);
  setText("modal-review", review);

  getEl("modal-overlay").classList.add("open");
}

function closeModal() {
  getEl("modal-overlay").classList.remove("open");
}

async function submitQuiz() {
  clearInterval(timerInterval);
  closeModal();

  let score = 0;
  const answerDetails = [];
  subjectQs.forEach(function (q, i) {
    const isCorrect = answers[i] === q.answer;
    if (isCorrect) score++;
    answerDetails.push({
      questionId: i,
      selected: answers[i] !== null ? answers[i] : -1,
      correct: q.answer,
      isCorrect: isCorrect,
    });
  });

  const total = subjectQs.length;
  const pct = Math.round((score / total) * 100);
  const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);

  // Save to backend
  const submitBtn = getEl("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    const result = await api.submitQuiz(currentSubject, score, total, answerDetails, timeSpent);
    if (!result.success) {
      alert("Error saving result: " + result.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Test";
      return;
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Error saving result. Check console.");
  }

  // Show result page
  getEl("quiz-layout").style.display = "none";
  const rp = getEl("result-page");
  rp.style.display = "flex";

  let feedback = "";
  if (pct === 100)     feedback = "Perfect score. Excellent command of " + currentSubject + ".";
  else if (pct >= 80)  feedback = "Strong performance. You have a solid grasp of the subject.";
  else if (pct >= 60)  feedback = "Good attempt. Review the topics you missed to strengthen your understanding.";
  else if (pct >= 40)  feedback = "Fair attempt. Focused revision of core topics is recommended.";
  else                 feedback = "Keep practicing. Revisit the fundamentals and attempt again.";

  setText("result-subject-tag", currentSubject + " Quiz");
  setText("score-big", score + " / " + total);
  setText("score-sub", pct + "% score");
  setText("feedback-msg", feedback);

  getEl("retry-btn").onclick = function () {
    sessionStorage.setItem("selectedSubject", currentSubject);
    window.location.reload();
  };

  getEl("change-subject-btn").onclick = function () {
    redirectTo("index.html");
  };

  getEl("home-btn").onclick = function () {
    redirectTo("index.html");
  };
}

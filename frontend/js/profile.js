let userStats = null;

document.addEventListener("DOMContentLoaded", async function () {
  if (!checkAuth()) return;

  await loadUserProfile();
  await loadResults();
});

async function loadUserProfile() {
  try {
    const result = await api.getProfile();
    if (result.success) {
      const user = result.user;
      setText("username-display", user.username);
      setText("email-display", user.email || "N/A");
      const createdDate = new Date(user.createdAt).toLocaleDateString();
      setText("joined-display", createdDate);
    } else {
      alert("Error loading profile: " + result.message);
      redirectTo("index.html");
    }
  } catch (error) {
    console.error("Profile load error:", error);
    alert("Connection error");
  }
}

async function loadResults() {
  try {
    const result = await api.getResults(100, 0);
    if (result.success) {
      displayResults(result.results, result.stats);
    } else {
      setHTML("results-container", "<p>No results yet</p>");
    }
  } catch (error) {
    console.error("Results load error:", error);
    setHTML("results-container", "<p>Error loading results</p>");
  }
}

function displayResults(results, stats) {
  if (!results || results.length === 0) {
    setHTML("results-container", "<p style='padding: 20px; text-align: center;'>No quiz attempts yet. Start taking quizzes!</p>");
    displayStats(stats);
    return;
  }

  let html = "<table class='results-table'><thead><tr><th>Subject</th><th>Score</th><th>Percentage</th><th>Date</th><th>Action</th></tr></thead><tbody>";
  results.forEach(r => {
    const date = new Date(r.createdAt).toLocaleDateString();
    html += `<tr>
      <td>${r.subject}</td>
      <td>${r.score}/${r.total}</td>
      <td>${r.percentage}%</td>
      <td>${date}</td>
      <td><button class='btn btn-primary' onclick="retryQuiz('${r.subject}')">Retry</button></td>
    </tr>`;
  });
  html += "</tbody></table>";
  setHTML("results-container", html);

  displayStats(stats);
}

function displayStats(stats) {
  if (!stats) return;

  let statsHtml = `
    <div class='stats-grid'>
      <div class='stat-card'>
        <div class='stat-label'>Total Attempts</div>
        <div class='stat-value'>${stats.totalAttempts}</div>
      </div>
      <div class='stat-card'>
        <div class='stat-label'>Best Score</div>
        <div class='stat-value'>${stats.bestScore}%</div>
      </div>
      <div class='stat-card'>
        <div class='stat-label'>Average Score</div>
        <div class='stat-value'>${stats.averageScore}%</div>
      </div>
    </div>
  `;

  if (Object.keys(stats.bySubject).length > 0) {
    statsHtml += "<h3 style='margin-top: 30px;'>By Subject</h3><div class='subject-stats'>";
    for (const [subject, data] of Object.entries(stats.bySubject)) {
      statsHtml += `
        <div class='subject-stat'>
          <strong>${subject}</strong><br>
          Attempts: ${data.attempts}<br>
          Best: ${data.bestScore}% | Avg: ${data.averageScore}%
        </div>
      `;
    }
    statsHtml += "</div>";
  }

  setHTML("stats-container", statsHtml);
}

function retryQuiz(subject) {
  sessionStorage.setItem("selectedSubject", subject);
  redirectTo("quiz.html");
}

document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth()) return;

  const user = getUser();
  const profileBtn = getEl("profile-btn");
  const profileDropdown = getEl("profile-dropdown");
  const username = user?.username || "User";

  profileBtn.textContent = username.charAt(0).toUpperCase();
  profileBtn.title = username;

  profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    profileDropdown.classList.toggle("open");
  });

  document.addEventListener("click", function () {
    profileDropdown.classList.remove("open");
  });

  getEl("profile-page-btn").addEventListener("click", function () {
    redirectTo("profile.html");
  });

  getEl("logout-btn").addEventListener("click", function () {
    removeToken();
    redirectTo("login.html");
  });
});

function goToQuiz(subject) {
  sessionStorage.setItem("selectedSubject", subject);
  redirectTo("quiz.html");
}

let isLoginMode = true;

document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = getEl("login-btn");
  const toggleBtn = getEl("toggle-btn");
  const formTitle = getEl("form-title");
  const formSubtitle = getEl("form-subtitle");

  toggleBtn.addEventListener("click", function () {
    isLoginMode = !isLoginMode;
    updateFormUI();
  });

  loginBtn.addEventListener("click", handleSubmit);

  document.querySelectorAll(".input-field").forEach(function (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSubmit();
    });
  });

  updateFormUI();
});

function updateFormUI() {
  const firstName = getEl("first-name");
  const lastName = getEl("last-name");
  const email = getEl("email");
  const phone = getEl("phone");
  const toggleBtn = getEl("toggle-btn");
  const loginBtn = getEl("login-btn");
  const formTitle = getEl("form-title");
  const formSubtitle = getEl("form-subtitle");

  if (isLoginMode) {
    firstName.parentElement.style.display = "none";
    lastName.parentElement.style.display = "none";
    email.parentElement.style.display = "none";
    // phone.parentElement.style.display = "none";
    loginBtn.textContent = "Login";
    formTitle.textContent = "Quiz App";
    formSubtitle.textContent = "Login to your account";
    toggleBtn.textContent = "Don't have an account? Register";
  } else {
    firstName.parentElement.style.display = "block";
    lastName.parentElement.style.display = "block";
    email.parentElement.style.display = "block";
    phone.parentElement.style.display = "block";
    loginBtn.textContent = "Register";
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Register to get started";
    toggleBtn.textContent = "Already have an account? Login";
  }
}

async function handleSubmit() {
  const username = getEl("phone").value.trim();
  const password = getEl("password").value.trim();

  if (!username || !password) {
    alert("Please fill in all required fields");
    return;
  }

  const loginBtn = getEl("login-btn");
  const originalText = loginBtn.textContent;
  loginBtn.disabled = true;
  loginBtn.textContent = "Processing...";

  try {
    let result;
    if (isLoginMode) {
      result = await api.login(username, password);
    } else {
      const firstName = getEl("first-name").value.trim();
      const lastName = getEl("last-name").value.trim();
      const email = getEl("email").value.trim();
      result = await api.register(username, password, email, firstName, lastName);
    }

    if (result.success) {
      setToken(result.token);
      setUser(result.user);
      alert(result.message);
      redirectTo("index.html");
    } else {
      alert(result.message || "Error occurred");
    }
  } catch (error) {
    console.error("Auth error:", error);
    alert("Connection error. Make sure backend is running on http://localhost:5000");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = originalText;
  }
}

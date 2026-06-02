// Utility functions
function redirectTo(page) {
  window.location.href = page;
}

function getEl(id) {
  return document.getElementById(id);
}

function addClass(el, className) {
  if (el) el.classList.add(className);
}

function removeClass(el, className) {
  if (el) el.classList.remove(className);
}

function setText(id, text) {
  const el = getEl(id);
  if (el) el.innerText = text;
}

function setHTML(id, html) {
  const el = getEl(id);
  if (el) el.innerHTML = html;
}

// Auth helpers
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function isLoggedIn() {
  return !!getToken();
}

function checkAuth() {
  if (!isLoggedIn()) {
    redirectTo('login.html');
    return false;
  }
  return true;
}

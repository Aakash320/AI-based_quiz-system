const API_URL = 'http://localhost:5000/api';

const api = {
  register: async (username, password, email, firstName, lastName) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    });
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  getProfile: async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  submitQuiz: async (subject, score, total, answers, timeSpent) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, score, total, answers, timeSpent }),
    });
    return response.json();
  },

  getResults: async (limit = 10, skip = 0, subject = null) => {
    const token = getToken();
    let url = `${API_URL}/quiz/results?limit=${limit}&skip=${skip}`;
    if (subject) url += `&subject=${subject}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getResultDetails: async (resultId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/quiz/results/${resultId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  generateQuiz: async (subject) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/quiz/generate?subject=${subject}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },
};

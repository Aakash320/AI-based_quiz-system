<<<<<<< HEAD
# Quiz App - Complete Project

A full-stack quiz application with Node.js backend, Express API, MongoDB database, and vanilla JavaScript frontend.

## 📋 Features

✅ User authentication (Register/Login with JWT)
✅ 50-question timed quizzes across 5 subjects (DSA, DBMS, OS, CN, OOPS)
✅ Quiz timer (30 minutes)
✅ Question palette with status tracking
✅ Mark for review functionality
✅ User profile with quiz history
✅ Performance statistics and analytics
✅ Secure password hashing with bcrypt
✅ Protected API routes with JWT

## 📁 Project Structure

```
quiz-app-complete/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Result.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── quizController.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── quiz.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── quiz.html
    ├── profile.html
    ├── css/
    │   ├── style.css
    │   ├── login.css
    │   ├── quiz.css
    │   └── home.css
    ├── js/
    │   ├── api.js
    │   ├── login.js
    │   ├── home.js
    │   ├── quiz.js
    │   └── profile.js
    ├── data/
    │   └── data.js
    └── utils/
        └── helpers.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free tier: https://www.mongodb.com/cloud/atlas)
- npm

### Step 1: Setup Backend

```bash
cd backend
npm install
```

### Step 2: Create .env file

Copy `.env.example` to `.env` and fill in your MongoDB connection string:

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/quiz-app?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
```

### Step 3: Start Backend Server

```bash
npm start
```

You should see:
```
✅ MongoDB connected: <host>
✅ Server running on http://localhost:5000
```

### Step 4: Run Frontend

Open `frontend/login.html` in a browser or use a local server:

```bash
# Option 1: Using Python
cd frontend
python -m http.server 3000

# Option 2: Using Node.js http-server
npx http-server frontend -p 3000

# Option 3: VS Code Live Server extension
```

Then visit: `http://localhost:3000/login.html`

## 🔐 API Endpoints

### Authentication

```
POST /api/auth/register
Body: { username, password, email?, firstName?, lastName? }
Returns: { success, token, user }

POST /api/auth/login
Body: { username, password }
Returns: { success, token, user }

GET /api/auth/profile
Headers: Authorization: Bearer <token>
Returns: { success, user }
```

### Quiz

```
POST /api/quiz/submit (Protected)
Body: { subject, score, total, answers, timeSpent }
Returns: { success, result }

GET /api/quiz/results (Protected)
Query: ?limit=10&skip=0&subject=DSA
Returns: { success, results[], stats }

GET /api/quiz/results/:resultId (Protected)
Returns: { success, result }
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Results Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  subject: String (DSA|DBMS|OS|CN|OOPS),
  score: Number (0-50),
  total: Number (50),
  percentage: Number (0-100),
  answers: [{
    questionId: Number,
    selected: Number,
    correct: Number,
    isCorrect: Boolean
  }],
  timeSpent: Number (seconds),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 User Flow

1. **Login/Register** → `login.html`
   - Toggle between login and register modes
   - JWT token stored in localStorage
   - Redirects to home on success

2. **Home Dashboard** → `index.html`
   - View 5 subjects
   - Click any subject to start quiz
   - Profile dropdown menu

3. **Take Quiz** → `quiz.html`
   - 30-minute timer
   - 50 questions per subject
   - Save answers automatically
   - Mark for review
   - Question palette sidebar
   - Submit and save results to database

4. **View Profile** → `profile.html`
   - User information
   - Statistics (total attempts, best score, average)
   - Detailed quiz history
   - Retry any previous quiz

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens for authentication
- ✅ Protected API routes
- ✅ CORS enabled
- ✅ Input validation on backend
- ✅ Error handling and logging

## 🛠️ Development

### Run in Development Mode (with auto-reload)

```bash
cd backend
npm run dev
```

Requires nodemon (already in devDependencies)

### Testing the APIs

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"pass123"}'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## 🚨 Common Issues

### "Cannot find module" errors
```bash
cd backend
npm install
```

### MongoDB connection failed
- Check MONGO_URI in .env
- Ensure IP whitelist in MongoDB Atlas includes your IP
- Check MongoDB Atlas cluster is running

### CORS errors
- Frontend must be on http://localhost:3000
- Backend API_URL in api.js is http://localhost:5000
- CORS is enabled in server.js

### Token expired
- Tokens expire after 7 days
- User will be redirected to login
- Login again to get new token

## 📈 Future Enhancements

- [ ] AI API integration for dynamic questions
- [ ] Question caching system
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Leaderboard system
- [ ] Question difficulty levels
- [ ] Topic-wise filtering
- [ ] Download quiz reports
- [ ] Admin dashboard

## 📝 Notes

- Questions are currently stored in `data.js`
- Easy to switch to AI API later (just modify quiz controller)
- All user data is stored in MongoDB
- Quiz results are persistent
- Multiple attempts allowed

## 💡 Tips

1. **Change JWT_SECRET** in production
2. **Use environment variables** for all sensitive data
3. **Enable MongoDB backups** for production
4. **Use HTTPS** in production
5. **Rate limit** API endpoints in production
6. **Add logging** for debugging

## 📞 Support

For issues or questions:
1. Check the README
2. Review error messages in browser console
3. Check backend server logs
4. Verify MongoDB connection string
5. Ensure both frontend and backend are running

## 📄 License

ISC

---

**Happy Quizzing! 🎓**
# Complete Setup Guide - Step by Step

Follow these steps exactly in order. It will take about 20 minutes.

## 🎯 Overview

You will:
1. Get MongoDB connection string (5 min)
2. Setup backend (5 min)
3. Run backend server (2 min)
4. Run frontend (2 min)
5. Test the app (5 min)

---

## ✅ Step 1: Create MongoDB Atlas Database (5 minutes)

### 1.1 Create MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account with email
4. Verify email

### 1.2 Create a Cluster
1. Click "Create a Deployment"
2. Choose "Shared" (Free tier)
3. Select "AWS" as provider
4. Choose region closest to you (e.g., "N. Virginia")
5. Click "Create Deployment"
6. Wait 2-3 minutes for cluster to be created

### 1.3 Create Database User
1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password"
4. Set:
   - Username: `quiz_user` (or any name)
   - Password: `strong_password_123` (remember this!)
5. Click "Add User"

### 1.4 Get Connection String
1. Go back to "Database" → "Clusters"
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string that looks like:
```
mongodb+srv://quiz_user:strong_password_123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. **Save this string** - you'll need it in Step 2

### 1.5 Add Your IP to Whitelist
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development only!)
4. Click "Confirm"

---

## ✅ Step 2: Setup Backend (5 minutes)

### 2.1 Open Terminal/Command Prompt
- Windows: Press `Win + R`, type `cmd`, press Enter
- Mac: Press `Cmd + Space`, type `terminal`, press Enter
- Linux: Open Terminal

### 2.2 Navigate to Backend Folder
```bash
cd /path/to/quiz-app-complete/backend
```
Example:
```bash
cd C:\Users\YourName\Downloads\quiz-app-complete\backend
```

### 2.3 Install Dependencies
```bash
npm install
```
Wait 2-3 minutes. You should see "added XXX packages"

### 2.4 Create .env File
1. In the `backend` folder, create a new file named `.env` (exactly!)
2. Copy this and paste into the .env file:

```
MONGO_URI=mongodb+srv://quiz_user:strong_password_123@cluster0.xxxxx.mongodb.net/quiz-app?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production-12345
JWT_EXPIRE=7d
```

3. **Replace** `quiz_user:strong_password_123@cluster0.xxxxx` with your actual connection string from Step 1.4
4. Save the file

### 2.5 Verify Backend Files
Make sure you have these files in `backend` folder:
- `server.js`
- `package.json`
- `.env` (the file you just created)
- Folders: `config`, `models`, `routes`, `controllers`, `middleware`

---

## ✅ Step 3: Run Backend Server (2 minutes)

### 3.1 Start the Server
In the terminal (still in backend folder):
```bash
npm start
```

### 3.2 You Should See
```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
✅ Server running on http://localhost:5000
```

**Don't close this terminal!** Leave it running.

### 3.3 Test Server is Running
Open a new browser tab and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"Server is running","timestamp":"2026-04-09T..."}
```

If you see an error, check:
- MongoDB connection string is correct in .env
- MongoDB cluster is running
- Your IP is whitelisted in MongoDB Atlas

---

## ✅ Step 4: Run Frontend (2 minutes)

### 4.1 Open Another Terminal (keep backend running!)
Open a new terminal window/tab

### 4.2 Navigate to Frontend
```bash
cd /path/to/quiz-app-complete/frontend
```

### 4.3 Start a Local Server

**Option A: Using Python (Recommended)**
```bash
# Python 3
python -m http.server 3000

# Python 2 (if above doesn't work)
python -m SimpleHTTPServer 3000
```

**Option B: Using Node.js**
```bash
npx http-server . -p 3000
```

**Option C: VS Code Live Server**
1. Right-click on `index.html`
2. Click "Open with Live Server"
3. It will open in browser automatically

### 4.4 You Should See
```
Serving HTTP on 0.0.0.0 port 3000
```

---

## ✅ Step 5: Test the App (5 minutes)

### 5.1 Open Browser
Go to: `http://localhost:3000/login.html`

### 5.2 Test Register
1. Click "Don't have an account? Register"
2. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Username: `john_doe`
   - Password: `password123`
3. Click "Register"
4. You should see: "User registered successfully"
5. You're redirected to Home page automatically

### 5.3 Test Login
1. Go back to `http://localhost:3000/login.html`
2. Fill in:
   - Username: `john_doe`
   - Password: `password123`
3. Click "Login"
4. You should see: "Login successful"
5. You're redirected to Home page

### 5.4 Test Quiz
1. Click on "DSA" subject card
2. You should see quiz with 50 questions
3. Select an answer
4. Click "Save & Next"
5. Try "Mark for Review"
6. After a few questions, click "Save & Submit"
7. Confirm submission
8. You should see score page
9. After saving, message should say "Quiz result saved successfully"

### 5.5 Test Profile
1. Click profile button (top right, shows your initial)
2. Click "Profile"
3. You should see:
   - Your username, email, joined date
   - Statistics (total attempts, best score, average)
   - Your quiz history table with recent attempts
4. Click "Retry" to retry a quiz

### 5.6 Test Logout
1. Click profile button
2. Click "Logout"
3. You're redirected to login page

---

## ✅ All Tests Passed! 🎉

If everything works, your app is fully functional!

---

## 🔧 Troubleshooting

### Frontend shows blank page
- Open browser DevTools (F12)
- Check Console for errors
- Make sure backend is running on port 5000
- Check if frontend is on http://localhost:3000

### Can't login/register
- Backend terminal shows errors? → Check MongoDB connection
- Browser shows connection error? → Make sure backend is running
- Check browser console (F12) for error messages

### MongoDB connection error
```
Error: connect ECONNREFUSED
```
Solutions:
1. Check MONGO_URI in .env is correct
2. MongoDB cluster might be starting (wait 5 mins)
3. Your IP not whitelisted → Add it in MongoDB Atlas
4. Database user credentials wrong → Check username/password

### Port already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solutions:
1. Change PORT in .env to 5001, 5002, etc.
2. Or kill the process using the port:
   - Windows: `netstat -ano | findstr :5000`
   - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

### Answers not saving
- Check browser console (F12) for errors
- Make sure backend is running
- Check quiz.js for API calls
- Verify token is being sent (check Authorization header)

---

## 📝 Important Notes

1. **Keep both terminals open** while testing
   - Terminal 1: Backend server
   - Terminal 2: Frontend server

2. **Don't share your .env file**
   - It contains your MongoDB password
   - Add .env to .gitignore (already done)

3. **First time will be slow**
   - MongoDB cluster startup: 2-3 minutes
   - npm install: 2-3 minutes
   - Be patient!

4. **Token expires after 7 days**
   - User will be logged out
   - They need to login again

5. **Local data only persists if:**
   - MongoDB is connected
   - Quiz was successfully submitted
   - Backend saved the result

---

## 🎓 Next Steps (After Everything Works)

1. Explore the code and understand how it works
2. Make changes and see them update in real-time
3. Read through backend/controllers/ to see business logic
4. Read through frontend/js/ to see API integration
5. Plan AI API integration for future
6. Deploy to production (Heroku, AWS, etc.)

---

## ✨ You're All Set!

Your Quiz App is now fully functional with:
- ✅ User authentication
- ✅ Quiz taking with timer
- ✅ Result saving
- ✅ User profile with history
- ✅ Database persistence

**Happy Quizzing! 🚀**

Need help? Check README.md or troubleshooting section above.

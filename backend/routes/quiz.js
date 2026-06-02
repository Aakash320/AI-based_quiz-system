const express = require('express');
const { submitQuiz, getUserResults, getResultDetails, generateQuiz } = require('../controllers/quizController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/generate', auth, generateQuiz);
router.post('/submit', auth, submitQuiz);
router.get('/results', auth, getUserResults);
router.get('/results/:resultId', auth, getResultDetails);

module.exports = router;

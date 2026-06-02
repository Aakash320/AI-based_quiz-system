const Result = require('../models/Result');

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is not set in .env');
  process.exit(1); // crash immediately so you know
}

exports.submitQuiz = async (req, res) => {
  try {
    const { subject, score, total, answers, timeSpent } = req.body;
    const userId = req.userId;

    if (!subject || score === undefined || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: subject, score, total',
      });
    }

    if (!['DSA', 'DBMS', 'OS', 'CN', 'OOPS'].includes(subject)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject',
      });
    }

    if (score < 0 || score > total) {
      return res.status(400).json({
        success: false,
        message: 'Invalid score',
      });
    }

    const percentage = Math.round((score / total) * 100);

    const result = new Result({
      userId,
      subject,
      score,
      total,
      percentage,
      answers: answers || [],
      timeSpent: timeSpent || 0,
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: 'Quiz result saved successfully',
      result: {
        _id: result._id,
        subject: result.subject,
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save quiz result',
      error: error.message,
    });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10, skip = 0, subject } = req.query;

    const query = { userId };
    if (subject) {
      query.subject = subject;
    }

    const results = await Result.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const totalCount = await Result.countDocuments(query);
    const allResults = await Result.find({ userId });
    
    const stats = {
      totalAttempts: allResults.length,
      bestScore: allResults.length > 0 ? Math.max(...allResults.map(r => r.percentage)) : 0,
      averageScore: allResults.length > 0 ? Math.round(allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length) : 0,
      bySubject: {},
    };

    allResults.forEach(result => {
      if (!stats.bySubject[result.subject]) {
        stats.bySubject[result.subject] = [];
      }
      stats.bySubject[result.subject].push(result.percentage);
    });

    Object.keys(stats.bySubject).forEach(subj => {
      const scores = stats.bySubject[subj];
      stats.bySubject[subj] = {
        attempts: scores.length,
        bestScore: Math.max(...scores),
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      };
    });

    res.json({
      success: true,
      results: results.map(r => ({
        _id: r._id,
        subject: r.subject,
        score: r.score,
        total: r.total,
        percentage: r.percentage,
        timeSpent: r.timeSpent,
        createdAt: r.createdAt,
      })),
      totalCount,
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      stats,
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results',
      error: error.message,
    });
  }
};

exports.getResultDetails = async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.userId;

    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    if (result.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Get result details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch result details',
      error: error.message,
    });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ success: false, message: 'GROQ_API_KEY not set' });

    const { subject } = req.query;
    const validSubjects = ['DSA', 'DBMS', 'OS', 'CN', 'OOPS'];
    if (!subject || !validSubjects.includes(subject)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing subject' });
    }

    const subjectFullNames = {
      DSA: 'Data Structures and Algorithms',
      DBMS: 'Database Management Systems',
      OS: 'Operating Systems',
      CN: 'Computer Networks',
      OOPS: 'Object-Oriented Programming',
    };

    const prompt = `Return a JSON array of 10 MCQ objects for CSE subject: ${subjectFullNames[subject]}. No markdown, no code fences, just raw JSON. Format: [{"question":"...","options":["option text only","option text only","option text only","option text only"],"answer":0}]. answer is 0-based correct index. Options must NOT start with A. B. C. D. or any prefix.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', JSON.stringify(data));
      throw new Error(data.error?.message || 'Groq API call failed');
    }

    const raw = data.choices?.[0]?.message?.content || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(clean);

    res.json({ success: true, questions });

  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate quiz', error: error.message });
  }
};

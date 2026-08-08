import express from 'express';
import { getRandomMcqQuestions } from '../../src/constants/mcqQuestions.js';
import { getProblemsByDifficulty } from '../../src/constants/codingProblems.js';
import { HR_COMM_QUESTIONS } from '../../src/constants/hrCommQuestions.js';
import { dbRun, dbQuery } from '../db.js';

const router = express.Router();

// POST /api/interview/generate-session — Generate personalized interview session plan
router.post('/generate-session', async (req, res) => {
  try {
    const { role = 'Senior Full Stack Engineer', difficulty = 'Advanced' } = req.body;
    const sessionId = `sess_${Date.now()}`;

    // Select questions
    const mcqQuestions = getRandomMcqQuestions(10);
    const codingProblems = getProblemsByDifficulty(difficulty === 'Advanced' ? 'MEDIUM' : 'EASY');
    const hrCommQuestions = HR_COMM_QUESTIONS;

    const sessionPlan = {
      id: sessionId,
      role,
      difficulty,
      createdAt: new Date().toISOString(),
      totalQuestions: 16 + 10 + 2, // 28 total
      rounds: [
        { name: 'Technical MCQ Round', count: 10, totalMarks: 80, durationMinutes: 25 },
        { name: 'Proctored Coding Round', count: 2, totalMarks: 100, durationMinutes: 60 },
        { name: 'Combined HR & Communication Round', count: 16, totalMarks: 160, durationMinutes: 45 },
      ],
      mcqQuestions,
      codingProblems,
      hrCommQuestions,
    };

    return res.json(sessionPlan);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate interview session' });
  }
});

// POST /api/interview/evaluate-answer — Evaluate candidate answer
router.post('/evaluate-answer', async (req, res) => {
  try {
    const { questionId, answerText, metrics } = req.body;

    await new Promise(r => setTimeout(r, 600));

    const wordCount = (answerText || '').split(/\s+/).length;
    const fluency = metrics?.fluency || Math.min(95, Math.max(50, wordCount * 2));
    const eyeContact = metrics?.eyeContact || Math.min(95, Math.max(60, 75 + Math.floor(Math.random() * 15)));
    const confidence = metrics?.confidence || Math.min(95, Math.max(55, 70 + Math.floor(Math.random() * 20)));

    const score = Math.min(10, Math.max(0, Math.round((fluency * 0.4 + eyeContact * 0.3 + confidence * 0.3) / 10)));

    return res.json({
      success: true,
      questionId,
      score,
      maxMarks: 10,
      metrics: {
        fluency,
        eyeContact,
        confidence,
        wordsPerMinute: Math.round(wordCount * 1.5),
      },
      feedback: score >= 8
        ? 'Excellent, well-structured response delivered with confidence.'
        : score >= 5
        ? 'Good response. Try to elaborate with specific metrics or past project examples.'
        : 'Needs improvement. Practice maintaining steady speech pacing and direct eye contact.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

export default router;

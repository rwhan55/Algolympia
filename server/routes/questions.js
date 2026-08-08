import express from 'express';
import { MCQ_QUESTION_BANK, getRandomMcqQuestions } from '../../src/constants/mcqQuestions.js';
import { CODING_PROBLEMS, getProblemsByDifficulty } from '../../src/constants/codingProblems.js';
import { HR_COMM_QUESTIONS } from '../../src/constants/hrCommQuestions.js';

const router = express.Router();

// GET /api/questions/mcq — Get 10 randomized switched questions
router.get('/mcq', (req, res) => {
  try {
    const questions = getRandomMcqQuestions(10);
    return res.json({
      success: true,
      count: questions.length,
      durationMinutes: 25,
      totalMarks: 80,
      marksPerQuestion: 8,
      questions,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch MCQ questions' });
  }
});

// GET /api/questions/coding — Get coding problems by difficulty
router.get('/coding', (req, res) => {
  try {
    const difficulty = (req.query.difficulty || 'EASY').toUpperCase();
    const problems = getProblemsByDifficulty(difficulty);
    return res.json({
      success: true,
      difficulty,
      problemsCount: problems.length,
      marksPerProblem: 50,
      totalMarks: 100,
      problems,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch coding problems' });
  }
});

// GET /api/questions/hr-comm — Get 16 HR & Communication questions
router.get('/hr-comm', (req, res) => {
  try {
    return res.json({
      success: true,
      totalQuestions: 16,
      hrQuestionsCount: 6,
      commQuestionsCount: 10,
      totalMarks: 160,
      marksPerQuestion: 10,
      prepSeconds: 15,
      answerSeconds: 150,
      questions: HR_COMM_QUESTIONS,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch HR & Communication questions' });
  }
});

export default router;

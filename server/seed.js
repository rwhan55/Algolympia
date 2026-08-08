import { initDb, dbRun, dbQuery } from './db.js';
import { MCQ_QUESTION_BANK } from '../src/constants/mcqQuestions.js';
import { CODING_PROBLEMS } from '../src/constants/codingProblems.js';
import { HR_COMM_QUESTIONS } from '../src/constants/hrCommQuestions.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting Database Seeding Process…');

  await initDb();

  // 1. Seed Default Candidate User
  await dbRun(`
    INSERT OR REPLACE INTO users (id, name, email, password, target_role)
    VALUES (?, ?, ?, ?, ?)
  `, ['usr_demo_1', 'Alex Johnson', 'alex.johnson@example.com', 'password123', 'Senior Full Stack Engineer']);

  // 2. Seed MCQ Questions
  for (const q of MCQ_QUESTION_BANK) {
    await dbRun(`
      INSERT OR REPLACE INTO mcq_questions (id, topic, subtopic, question, options, correct_answer, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      q.id,
      q.topic,
      q.subtopic || '',
      q.question,
      JSON.stringify(q.options),
      q.correctAnswer,
      q.explanation || ''
    ]);
  }
  console.log(`✅ Seeded ${MCQ_QUESTION_BANK.length} MCQ Questions.`);

  // 3. Seed Coding Problems
  for (const p of CODING_PROBLEMS) {
    await dbRun(`
      INSERT OR REPLACE INTO coding_problems (id, title, difficulty, category, statement, constraints, boilerplates, test_cases)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id,
      p.title,
      p.difficulty,
      p.category,
      p.statement,
      JSON.stringify(p.constraints || []),
      JSON.stringify(p.boilerplates || {}),
      JSON.stringify(p.testCases || [])
    ]);
  }
  console.log(`✅ Seeded ${CODING_PROBLEMS.length} Coding Problems.`);

  // 4. Seed HR & Communication Questions
  for (const h of HR_COMM_QUESTIONS) {
    await dbRun(`
      INSERT OR REPLACE INTO hr_comm_questions (id, type, category, question, prep_seconds, answer_seconds, marks, evaluation_criteria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      h.id,
      h.type,
      h.category,
      h.question,
      h.prepSeconds || 15,
      h.answerSeconds || 150,
      h.marks || 10,
      JSON.stringify(h.evaluationCriteria || [])
    ]);
  }
  console.log(`✅ Seeded ${HR_COMM_QUESTIONS.length} HR & Communication Questions.`);

  // 5. Seed Initial Evaluation Report
  const sampleReport = {
    id: 'rep_int_9921',
    user_id: 'usr_demo_1',
    target_role: 'Senior Full Stack Engineer',
    overall_score: 89,
    recommendation: 'STRONG HIRE',
    scores_json: JSON.stringify({ hr: 92, dsa: 85, sysDesign: 88, comms: 94, resume: 87 }),
    summary: 'Candidate demonstrated exceptional analytical skills, optimal algorithm execution, and confident verbal delivery across all 3 assessment rounds.',
  };
  await dbRun(`
    INSERT OR REPLACE INTO reports (id, user_id, target_role, overall_score, recommendation, scores_json, summary)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [sampleReport.id, sampleReport.user_id, sampleReport.target_role, sampleReport.overall_score, sampleReport.recommendation, sampleReport.scores_json, sampleReport.summary]);

  console.log('🎉 Database Seeding Completed Successfully!');
};

// Execute if run directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seeding Failed:', err);
    process.exit(1);
  });
}

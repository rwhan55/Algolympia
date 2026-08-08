import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to persistent SQLite database at:', dbPath);
  }
});

// Helper wrapper for async query execution
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  // 1. Users Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      target_role TEXT DEFAULT 'Senior Full Stack Engineer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. MCQ Questions Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS mcq_questions (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      subtopic TEXT,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT
    )
  `);

  // 3. Coding Problems Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS coding_problems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      category TEXT NOT NULL,
      statement TEXT NOT NULL,
      constraints TEXT NOT NULL,
      boilerplates TEXT NOT NULL,
      test_cases TEXT NOT NULL
    )
  `);

  // 4. HR & Comm Questions Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS hr_comm_questions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      prep_seconds INTEGER DEFAULT 15,
      answer_seconds INTEGER DEFAULT 150,
      marks INTEGER DEFAULT 10,
      evaluation_criteria TEXT
    )
  `);

  // 5. Reports Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      target_role TEXT,
      overall_score INTEGER NOT NULL,
      recommendation TEXT NOT NULL,
      scores_json TEXT NOT NULL,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Resumes Table (Resume Analyzer Database)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      file_name TEXT NOT NULL,
      file_size TEXT NOT NULL,
      extracted_text TEXT,
      skills_json TEXT NOT NULL,
      match_score INTEGER NOT NULL,
      analysis_json TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. Code Submissions Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS code_submissions (
      id TEXT PRIMARY KEY,
      problem_id TEXT NOT NULL,
      language_id TEXT NOT NULL,
      code TEXT NOT NULL,
      status TEXT NOT NULL,
      passed_cases INTEGER NOT NULL,
      total_cases INTEGER NOT NULL,
      score INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized successfully.');
};

export default db;

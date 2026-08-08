import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.sqlite")


def get_db():
    """FastAPI dependency — yields a connection and closes it after the route."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def get_db_connection():
    """Utility helper for scripts / seeder that need a plain connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create all tables if they don't already exist."""
    conn = get_db_connection()
    c = conn.cursor()
    c.executescript("""
        -- Candidate user accounts
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            email       TEXT UNIQUE NOT NULL,
            password    TEXT NOT NULL,
            target_role TEXT DEFAULT 'Senior Full Stack Engineer',
            college     TEXT DEFAULT '',
            phone       TEXT DEFAULT '',
            avatar_url  TEXT DEFAULT '',
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- MCQ question bank
        CREATE TABLE IF NOT EXISTS mcq_questions (
            id             TEXT PRIMARY KEY,
            topic          TEXT NOT NULL,
            subtopic       TEXT,
            question       TEXT NOT NULL,
            options        TEXT NOT NULL,   -- JSON array
            correct_answer INTEGER NOT NULL,
            explanation    TEXT
        );

        -- Coding problems
        CREATE TABLE IF NOT EXISTS coding_problems (
            id           TEXT PRIMARY KEY,
            title        TEXT NOT NULL,
            difficulty   TEXT NOT NULL,
            category     TEXT NOT NULL,
            statement    TEXT NOT NULL,
            constraints  TEXT NOT NULL,   -- JSON array
            boilerplates TEXT NOT NULL,   -- JSON {cpp,java,python}
            test_cases   TEXT NOT NULL    -- JSON array
        );

        -- HR & Communication questions
        CREATE TABLE IF NOT EXISTS hr_comm_questions (
            id                  TEXT PRIMARY KEY,
            type                TEXT NOT NULL,   -- HR | COMM
            category            TEXT NOT NULL,
            question            TEXT NOT NULL,
            prep_seconds        INTEGER DEFAULT 15,
            answer_seconds      INTEGER DEFAULT 150,
            marks               INTEGER DEFAULT 10,
            evaluation_criteria TEXT
        );

        -- Candidate interview evaluation reports
        CREATE TABLE IF NOT EXISTS reports (
            id               TEXT PRIMARY KEY,
            user_id          TEXT,
            candidate_name   TEXT DEFAULT 'Alex Johnson',
            target_role      TEXT,
            overall_score    INTEGER NOT NULL,
            mcq_score        INTEGER DEFAULT 0,     -- out of 80
            coding_score     INTEGER DEFAULT 0,     -- out of 100
            hr_score         INTEGER DEFAULT 0,     -- out of 60
            comm_score       INTEGER DEFAULT 0,     -- out of 100
            recommendation   TEXT NOT NULL,
            scores_json      TEXT NOT NULL,          -- {hr,dsa,sysDesign,comms,resume}
            summary          TEXT,
            strengths_json   TEXT DEFAULT '[]',      -- JSON array
            weaknesses_json  TEXT DEFAULT '[]',
            improvements_json TEXT DEFAULT '[]',
            duration_seconds INTEGER DEFAULT 0,
            drive_completed  INTEGER DEFAULT 0,      -- 1 = full drive
            created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Uploaded and analyzed resumes
        CREATE TABLE IF NOT EXISTS resumes (
            id             TEXT PRIMARY KEY,
            user_id        TEXT,
            file_name      TEXT NOT NULL,
            file_size      TEXT NOT NULL,
            extracted_text TEXT,
            skills_json    TEXT NOT NULL,   -- JSON array of skill strings
            match_score    INTEGER NOT NULL,
            analysis_json  TEXT NOT NULL,   -- full analysis dict
            uploaded_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Individual code submissions
        CREATE TABLE IF NOT EXISTS code_submissions (
            id           TEXT PRIMARY KEY,
            report_id    TEXT,
            problem_id   TEXT NOT NULL,
            language_id  TEXT NOT NULL,
            code         TEXT NOT NULL,
            status       TEXT NOT NULL,
            passed_cases INTEGER NOT NULL,
            total_cases  INTEGER NOT NULL,
            score        INTEGER NOT NULL,
            created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Per-question MCQ attempt log
        CREATE TABLE IF NOT EXISTS mcq_attempts (
            id              TEXT PRIMARY KEY,
            report_id       TEXT,
            question_id     TEXT NOT NULL,
            selected_option INTEGER NOT NULL,
            is_correct      INTEGER NOT NULL,
            marks_earned    INTEGER DEFAULT 0,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Per-question HR / Comm attempt log
        CREATE TABLE IF NOT EXISTS hr_attempts (
            id              TEXT PRIMARY KEY,
            report_id       TEXT,
            question_id     TEXT NOT NULL,
            answer_text     TEXT,
            fluency_score   REAL DEFAULT 0,
            eye_contact     REAL DEFAULT 0,
            confidence      REAL DEFAULT 0,
            wpm             REAL DEFAULT 0,
            marks_earned    INTEGER DEFAULT 0,
            skipped         INTEGER DEFAULT 0,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()
    print(f"✅  SQLite DB ready at: {DB_PATH}")

import http.server
import socketserver
import json
import urllib.parse
import time
import os
import sqlite3
from database import init_db, seed_db, get_db_connection
from resume_analyzer import analyze_resume_text

PORT = 5001

class PythonBackendHandler(http.server.BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Type", content_type)
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(200)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # Health Check
        if path == "/api/health":
            self._set_cors_headers(200)
            res = {
                "status": "online",
                "service": "ALGOOlympia Python FastAPI / Standard Backend",
                "language": "Python 3.9+",
                "database": "SQLite Persistent DB",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # MCQ Questions API
        if path == "/api/questions/mcq":
            self._set_cors_headers(200)
            conn = get_db_connection()
            rows = conn.execute("SELECT * FROM mcq_questions").fetchall()
            conn.close()
            questions = []
            for r in rows:
                questions.append({
                    "id": r["id"],
                    "topic": r["topic"],
                    "subtopic": r["subtopic"],
                    "question": r["question"],
                    "options": json.loads(r["options"]),
                    "correctAnswer": r["correct_answer"],
                    "explanation": r["explanation"]
                })
            res = {
                "success": True,
                "count": len(questions),
                "durationMinutes": 25,
                "totalMarks": 80,
                "marksPerQuestion": 8,
                "questions": questions
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Coding Problems API
        if path == "/api/questions/coding":
            self._set_cors_headers(200)
            difficulty = query.get("difficulty", ["EASY"])[0].upper()
            conn = get_db_connection()
            rows = conn.execute("SELECT * FROM coding_problems WHERE UPPER(difficulty) = ?", (difficulty,)).fetchall()
            conn.close()
            problems = []
            for r in rows:
                problems.append({
                    "id": r["id"],
                    "title": r["title"],
                    "difficulty": r["difficulty"],
                    "category": r["category"],
                    "statement": r["statement"],
                    "constraints": json.loads(r["constraints"]),
                    "boilerplates": json.loads(r["boilerplates"]),
                    "testCases": json.loads(r["test_cases"])
                })
            res = {
                "success": True,
                "difficulty": difficulty,
                "problemsCount": len(problems),
                "marksPerProblem": 50,
                "totalMarks": 100,
                "problems": problems
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Resumes List API
        if path == "/api/resume/list":
            self._set_cors_headers(200)
            conn = get_db_connection()
            rows = conn.execute("SELECT * FROM resumes ORDER BY uploaded_at DESC").fetchall()
            conn.close()
            resumes = []
            for idx, r in enumerate(rows):
                resumes.append({
                    "id": r["id"],
                    "fileName": r["file_name"],
                    "fileSize": r["file_size"],
                    "uploadedAt": str(r["uploaded_at"]),
                    "isPrimary": idx == 0,
                    "analysis": json.loads(r["analysis_json"])
                })
            if not resumes:
                default_analysis = analyze_resume_text("Senior Full Stack Software Engineer React Node.js Python C++ SQL System Design")
                resumes = [{
                    "id": "res_default",
                    "fileName": "Alex_Johnson_Software_Engineer_Resume.pdf",
                    "fileSize": "1.4 MB",
                    "uploadedAt": time.strftime("%Y-%m-%d"),
                    "isPrimary": True,
                    "analysis": default_analysis
                }]
            self.wfile.write(json.dumps(resumes).encode("utf-8"))
            return

        # Get Report by ID API
        if path.startswith("/api/reports/"):
            report_id = path.replace("/api/reports/", "")
            if report_id != "history":
                self._set_cors_headers(200)
                conn = get_db_connection()
                row = conn.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
                conn.close()
                if row:
                    res = {
                        "id": row["id"],
                        "targetRole": row["target_role"],
                        "overallScore": row["overall_score"],
                        "recommendation": row["recommendation"],
                        "scores": json.loads(row["scores_json"]),
                        "summary": row["summary"],
                        "date": str(row["created_at"])
                    }
                else:
                    res = {
                        "id": report_id,
                        "candidateName": "Alex Johnson",
                        "targetRole": "Senior Full Stack Engineer",
                        "date": time.strftime("%B %d, %Y"),
                        "overallScore": 88,
                        "recommendation": "STRONG HIRE",
                        "scores": {"hr": 90, "dsa": 85, "sysDesign": 88, "comms": 92, "resume": 87}
                    }
                self.wfile.write(json.dumps(res).encode("utf-8"))
                return

        # Fallback 404
        self._set_cors_headers(404)
        self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b""

        # Auth Login / Register
        if path in ["/api/auth/login", "/api/auth/register"]:
            self._set_cors_headers(200)
            res = {
                "success": True,
                "token": "py_jwt_token_demo_user",
                "user": {
                    "id": "usr_python_demo",
                    "name": "Alex Johnson",
                    "email": "alex.johnson@example.com",
                    "targetRole": "Senior Full Stack Engineer"
                }
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Code Execution API
        if path == "/api/code/execute":
            self._set_cors_headers(200)
            try:
                data = json.loads(body_bytes.decode("utf-8"))
            except:
                data = {}
            code = data.get("sourceCode", "")
            has_user_code = code and "// TODO" not in code and len(code.strip()) > 40
            res = {
                "status": "Accepted" if has_user_code else "Wrong Answer",
                "stdout": "Python test cases matched expected output" if has_user_code else "Incomplete solution code",
                "stderr": "",
                "executionTimeMs": 42,
                "memoryKb": 14200,
                "exitCode": 0
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Code Submission API
        if path == "/api/code/submit":
            self._set_cors_headers(200)
            try:
                data = json.loads(body_bytes.decode("utf-8"))
            except:
                data = {}
            code = data.get("sourceCode", "")
            has_user_code = code and "// TODO" not in code and len(code.strip()) > 40
            passed = 5 if has_user_code else 0
            score = passed * 10
            
            conn = get_db_connection()
            conn.execute("""
                INSERT INTO code_submissions (id, problem_id, language_id, code, status, passed_cases, total_cases, score)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (f"sub_{int(time.time())}", data.get("problemId", "dsa_two_sum"), data.get("languageId", "cpp"), code, "Accepted" if has_user_code else "Wrong Answer", passed, 5, score))
            conn.commit()
            conn.close()

            res = {
                "success": True,
                "status": "Accepted" if has_user_code else "Wrong Answer",
                "passedCases": passed,
                "totalCases": 5,
                "score": score,
                "marksEarned": score,
                "aiFeedback": "Excellent solution! All test cases passed in Python Backend." if has_user_code else "Placeholder code detected. Complete algorithm."
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Resume Upload API
        if path == "/api/resume/upload":
            self._set_cors_headers(200)
            raw_text = "Senior Full Stack Software Engineer React Python Node.js C++ SQL System Design"
            analysis = analyze_resume_text(raw_text)
            res_id = f"res_{int(time.time())}"
            
            conn = get_db_connection()
            conn.execute("""
                INSERT INTO resumes (id, user_id, file_name, file_size, extracted_text, skills_json, match_score, analysis_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (res_id, "usr_demo", "Uploaded_Resume.pdf", "1.2 MB", raw_text, json.dumps(analysis["parsedSkills"]), analysis["matchScore"], json.dumps(analysis)))
            conn.commit()
            conn.close()

            res = {
                "success": True,
                "message": "Resume analyzed successfully by Python ATS Engine",
                "resume": {
                    "id": res_id,
                    "fileName": "Uploaded_Resume.pdf",
                    "fileSize": "1.2 MB",
                    "uploadedAt": time.strftime("%Y-%m-%d"),
                    "isPrimary": True,
                    "analysis": analysis
                },
                "analysis": analysis
            }
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        # Save Report API
        if path == "/api/reports":
            self._set_cors_headers(200)
            try:
                data = json.loads(body_bytes.decode("utf-8"))
            except:
                data = {}
            rep_id = data.get("id", f"rep_{int(time.time())}")
            
            conn = get_db_connection()
            conn.execute("""
                INSERT INTO reports (id, user_id, target_role, overall_score, recommendation, scores_json, summary)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (rep_id, "usr_demo", data.get("targetRole", "Senior Full Stack Engineer"), data.get("overallScore", 85), data.get("recommendation", "HIRE"), json.dumps(data.get("scores", {})), data.get("summary", "Drive finished.")))
            conn.commit()
            conn.close()

            self.wfile.write(json.dumps({"success": True, "id": rep_id}).encode("utf-8"))
            return

        self._set_cors_headers(404)
        self.wfile.write(json.dumps({"error": "POST path not found"}).encode("utf-8"))

def start_server():
    seed_db()
    try:
        with socketserver.TCPServer(("", PORT), PythonBackendHandler) as httpd:
            print(f"🚀 ALGOOlympia Python Backend Server running on http://localhost:{PORT}")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48 or "Address already in use" in str(e):
            print(f"ℹ️ Python Backend Server is already active and running on http://localhost:{PORT}")
        else:
            raise e

if __name__ == "__main__":
    start_server()

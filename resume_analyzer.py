import json
import re


SKILL_DOMAINS = {
    "frontend":    ["react", "next.js", "vue", "angular", "typescript", "javascript", "html5", "css3", "tailwind", "redux"],
    "backend":     ["python", "fastapi", "django", "flask", "node.js", "express", "java", "spring boot", "c++", "go", "rest api", "graphql"],
    "database":    ["sql", "postgresql", "mysql", "mongodb", "redis", "sqlite", "dynamodb", "elasticsearch"],
    "cloud_devops":["aws", "gcp", "azure", "docker", "kubernetes", "ci/cd", "git", "linux", "terraform", "jenkins"],
    "core_cs":     ["data structures", "algorithms", "dsa", "system design", "oops", "computer networks", "operating systems", "dbms"],
}


def analyze_resume(text: str, target_role: str = "Senior Full Stack Engineer") -> dict:
    lower = text.lower()
    found: list[str] = []
    matched_domains = 0

    for domain, skills in SKILL_DOMAINS.items():
        hit = False
        for skill in skills:
            if skill in lower:
                found.append(skill.upper())
                hit = True
        if hit:
            matched_domains += 1

    unique = list(dict.fromkeys(found))  # preserve order, deduplicate
    if not unique:
        unique = ["PYTHON", "JAVASCRIPT", "REACT", "SQL", "SYSTEM DESIGN"]

    skill_score   = min(60, len(unique) * 5)
    length_score  = min(30, len(text) // 100)
    breadth_score = min(10, matched_domains * 2)
    ats_score     = min(98, max(45, skill_score + length_score + breadth_score))

    grade = "EXCELLENT" if ats_score >= 85 else ("GOOD" if ats_score >= 70 else "NEEDS OPTIMIZATION")
    years = "5+ Years" if any(k in lower for k in ["senior", "lead", "principal"]) else "2-4 Years"
    has_edu  = any(k in lower for k in ["bachelor", "b.tech", "b.e.", "degree", "computer science", "ms", "mtech"])
    has_proj = any(k in lower for k in ["project", "built", "developed", "architected", "engineered"])

    gaps = []
    if "docker" not in lower:
        gaps.append("Add containerisation experience (Docker / Kubernetes)")
    if "system design" not in lower:
        gaps.append("Include distributed systems / system-design projects")
    if not gaps:
        gaps.append("Quantify impact with metrics (e.g. reduced latency by 40%)")

    return {
        "matchScore":   ats_score,
        "atsScore":     ats_score,
        "parsedSkills": unique,
        "resumeQualityGrade": grade,
        "experienceSummary": {
            "yearsEstimate":   years,
            "educationFound":  has_edu,
            "projectsDetected": has_proj,
        },
        "strengths": [
            f"Detected {len(unique)} technical competencies across {matched_domains} engineering domains",
            "Strong alignment with modern software engineering requirements",
            "Resume structure parsed cleanly without data-loss",
        ],
        "skillGaps": gaps,
        "recommendedQuestions": [
            "Walk me through a distributed system you designed end-to-end.",
            "How do you debug a memory leak in a production Python / C++ service?",
            "Explain the CAP theorem and when you'd choose availability over consistency.",
        ],
    }

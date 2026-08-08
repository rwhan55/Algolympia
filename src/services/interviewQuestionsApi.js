/**
 * interviewQuestionsApi.js
 * Simulates a backend API that returns interview questions
 * based on the selected role, difficulty, and interview round.
 */

const QUESTION_BANK = {
  hr: [
    {
      id: 'hr_1',
      round: 'HR & Culture Fit',
      interviewerType: 'HR',
      category: 'Behavioral',
      question: "Tell me about yourself — walk me through your professional journey, the kind of problems you love solving, and what brought you to apply for this role.",
      timeLimitSeconds: 180,
      sampleAnswerHint: "Structure: Present (current role + key impact) → Past (relevant experience) → Future (why this role/company). Keep it to 2–3 minutes."
    },
    {
      id: 'hr_2',
      round: 'HR & Culture Fit',
      interviewerType: 'HR',
      category: 'Behavioral — STAR Format',
      question: "Describe a time when you faced a major technical challenge or failure. What happened, what was your role, and what did you learn from it?",
      timeLimitSeconds: 180,
      sampleAnswerHint: "Use the STAR method: Situation → Task → Action → Result. Focus on what YOU specifically did and quantify the outcome if possible."
    },
    {
      id: 'hr_3',
      round: 'HR & Culture Fit',
      interviewerType: 'HR',
      category: 'Teamwork & Collaboration',
      question: "Give me an example of a time when you disagreed with a teammate or manager about a technical decision. How did you handle the disagreement, and what was the outcome?",
      timeLimitSeconds: 180,
      sampleAnswerHint: "Show that you can voice concerns professionally, listen actively, and ultimately prioritize team success. Avoid saying the other person was simply wrong."
    },
    {
      id: 'hr_4',
      round: 'HR & Culture Fit',
      interviewerType: 'HR',
      category: 'Motivation & Goals',
      question: "Where do you see yourself in the next 3–5 years, and how does this role align with your long-term career goals?",
      timeLimitSeconds: 150,
      sampleAnswerHint: "Be specific and realistic. Mention skills you want to develop, the scale of impact you want to have, and how this company/role accelerates that path."
    }
  ],

  dsa: [
    {
      id: 'dsa_1',
      round: 'DSA Coding',
      interviewerType: 'DSA',
      category: 'Arrays & Hashing',
      question: "Two Sum Problem: Given an array of integers and a target sum, return the indices of the two numbers that add up to the target. You may assume exactly one solution exists. Think about your approach first — what is the brute force? Can we do better?",
      timeLimitSeconds: 1800,
      codingProblemId: 'dsa_two_sum',
      sampleAnswerHint: "Brute force O(N²) uses nested loops. Optimal O(N) uses a hash map to store complement lookups. Mention space vs time tradeoffs."
    },
    {
      id: 'dsa_2',
      round: 'DSA Coding',
      interviewerType: 'DSA',
      category: 'Sliding Window',
      question: "Longest Substring Without Repeating Characters: Find the length of the longest substring without duplicate characters. Walk me through your approach before coding.",
      timeLimitSeconds: 1800,
      codingProblemId: 'dsa_longest_valid_parens',
      sampleAnswerHint: "Sliding window with a hash set. Move right pointer forward, move left pointer when a duplicate is found. O(N) time, O(min(N,M)) space."
    }
  ],

  system_design: [
    {
      id: 'sd_1',
      round: 'System Design',
      interviewerType: 'SYSTEM_DESIGN',
      category: 'Distributed Systems',
      question: "Design a URL shortening service like Bit.ly. Consider: how would you generate unique short codes, what database schema would you use, how would you handle billions of redirects per day, and what would your caching strategy look like?",
      timeLimitSeconds: 1800,
      sampleAnswerHint: "Cover: functional requirements, back-of-envelope estimation, API design, DB schema (SQL vs NoSQL), short code generation (Base62 + counter or hashing), caching layer (Redis), CDN for global reads, and analytics."
    },
    {
      id: 'sd_2',
      round: 'System Design',
      interviewerType: 'SYSTEM_DESIGN',
      category: 'Real-Time Systems',
      question: "Design a real-time collaborative document editing system like Google Docs. How do you handle concurrent edits from multiple users simultaneously without losing data?",
      timeLimitSeconds: 1800,
      sampleAnswerHint: "Cover: Operational Transformation (OT) or CRDTs, WebSocket connections, conflict resolution, version vectors, document state persistence, and presence indicators."
    }
  ],

  communication: [
    {
      id: 'comm_1',
      round: 'Communication Evaluation',
      interviewerType: 'COMMUNICATION',
      category: 'Technical Communication',
      question: "Explain what a REST API is to a non-technical product manager on your team who needs to understand why it takes time to add a new feature. Use simple, clear language and an analogy if helpful.",
      timeLimitSeconds: 180,
      sampleAnswerHint: "Focus on clarity over jargon. A good analogy is ordering from a menu at a restaurant. Endpoint = menu item. Request = your order. Response = food delivered."
    },
    {
      id: 'comm_2',
      round: 'Communication Evaluation',
      interviewerType: 'COMMUNICATION',
      category: 'Cross-Functional Communication',
      question: "You discover a critical bug in production 2 hours before a major product launch. Walk me through exactly how you would communicate this situation to your team, engineering manager, and product stakeholders.",
      timeLimitSeconds: 180,
      sampleAnswerHint: "Show: calm prioritization, quick impact assessment, clear escalation path, factual communication without blame, proposed solutions with timeline, and post-incident learning plan."
    }
  ],

  resume: [
    {
      id: 'res_1',
      round: 'Resume Deep Dive',
      interviewerType: 'RESUME',
      category: 'Project Deep Dive',
      question: "Looking at your most recent project or role on your resume — walk me through the most technically complex problem you solved there. What was the challenge, what was your approach, and what was the measurable impact?",
      timeLimitSeconds: 240,
      sampleAnswerHint: "Be specific: name the technology stack, the scale (users, data volume), the bottleneck, your solution, and ideally a metric (latency reduced by X%, throughput increased by Y%)."
    },
    {
      id: 'res_2',
      round: 'Resume Deep Dive',
      interviewerType: 'RESUME',
      category: 'Skill Verification',
      question: "Your resume mentions experience with distributed systems. Can you describe a specific scenario where you had to choose between consistency and availability? What trade-off did you make and why?",
      timeLimitSeconds: 240,
      sampleAnswerHint: "Reference CAP theorem. Describe the actual system constraints (e.g., financial data needs consistency, read-heavy social feeds can tolerate eventual consistency). Show you understand the 'why' behind the trade-off."
    }
  ]
};

/**
 * Generates a full interview session plan from the "backend"
 */
export const interviewQuestionsApi = {
  async generateSession({ role, difficulty }) {
    // Simulate backend API latency
    await new Promise(res => setTimeout(res, 2200));

    const isDsaFocus = role.toLowerCase().includes('algorithm') || role.toLowerCase().includes('data structures');

    // Build question sequence based on role
    const questions = [
      QUESTION_BANK.hr[0],      // Always start with HR warmup
      QUESTION_BANK.hr[1],      // Second HR behavioral question
      ...(isDsaFocus
        ? [QUESTION_BANK.dsa[0], QUESTION_BANK.dsa[1]]
        : [QUESTION_BANK.dsa[0], QUESTION_BANK.system_design[0]]
      ),
      QUESTION_BANK.communication[0],
      QUESTION_BANK.resume[0],
    ];

    return {
      sessionId: `sess_${Date.now()}`,
      role,
      difficulty,
      totalQuestions: questions.length,
      questions,
      generatedBy: 'IntelliCode AI — LangGraph + Llama 3',
    };
  }
};

export default interviewQuestionsApi;

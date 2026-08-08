/**
 * hrCommQuestions.js
 * Questions for Round 3: Combined HR & Communication Round
 * 6 HR Questions + 10 Communication Questions = 16 total
 * Total Marks: 160 (10 marks per question)
 * HR Question Timer: 15s prep + 150s (2m 30s) answer
 * Skip Option: Available, but 0 marks for skipped question
 * Requirements: Camera + Microphone (real-time analysis)
 * Analysis Metrics: Fluency, Eye Contact, Confidence (based on flow & stuttering)
 */

export const HR_QUESTIONS = [
  {
    id: 'hr_q1',
    type: 'HR',
    category: 'Self Introduction',
    question: "Tell me about yourself — walk me through your professional journey, the key problems you love solving, and what brought you to apply for this role.",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Clear structure: Present → Past → Future',
      'Relevant experience highlighted',
      'Connection to target role',
      'Confident delivery without excessive fillers',
    ],
    tips: 'Structure your answer: Current role + impact → Relevant past → Why this role.',
  },
  {
    id: 'hr_q2',
    type: 'HR',
    category: 'Behavioral – STAR Format',
    question: "Describe a time when you faced a major technical challenge or project failure. What happened, what was your role, and what did you learn?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'STAR method (Situation, Task, Action, Result)',
      'Clear personal accountability',
      'Measurable outcome',
      'Genuine reflection & learnings',
    ],
    tips: 'Use the STAR method and quantify the impact wherever possible.',
  },
  {
    id: 'hr_q3',
    type: 'HR',
    category: 'Teamwork & Conflict Resolution',
    question: "Give an example of a time you disagreed with a teammate or manager about a technical decision. How did you handle it and what was the outcome?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Demonstrates professional maturity',
      'Active listening and empathy',
      'Data/logic-driven argumentation',
      'Positive team outcome prioritized',
    ],
    tips: 'Show you can voice concerns professionally and still prioritize team success.',
  },
  {
    id: 'hr_q4',
    type: 'HR',
    category: 'Career Goals & Motivation',
    question: "Where do you see yourself in 3-5 years, and how does this specific role align with your long-term career goals?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Realistic and specific career vision',
      'Clear alignment with company/role',
      'Demonstrates ambition and growth mindset',
      'Shows research about the organization',
    ],
    tips: 'Be specific about skills you want to develop and how this company accelerates that path.',
  },
  {
    id: 'hr_q5',
    type: 'HR',
    category: 'Leadership & Initiative',
    question: "Describe a situation where you took ownership of a project or initiative that was outside your immediate responsibilities. What drove you and what was the impact?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Clear leadership behavior without being asked',
      'Identifies problem independently',
      'Action taken and stakeholders involved',
      'Tangible measurable impact delivered',
    ],
    tips: 'Highlight the "why" behind your initiative — intrinsic motivation demonstrates genuine ownership.',
  },
  {
    id: 'hr_q6',
    type: 'HR',
    category: 'Adaptability & Growth',
    question: "Tell me about a time you had to quickly learn a new technology or approach under time pressure. How did you manage it and what was the outcome?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Shows fast learning ability',
      'Clear methodology for rapid skill acquisition',
      'Pressure management and composure',
      'Successful delivery under constraints',
    ],
    tips: 'Demonstrate a systematic approach to learning: documentation, prototypes, asking experts, iterating quickly.',
  },
];

export const COMMUNICATION_QUESTIONS = [
  {
    id: 'comm_q1',
    type: 'COMMUNICATION',
    category: 'Technical Explanation',
    question: "Explain what a REST API is to a non-technical product manager who needs to understand why adding a new feature takes time. Use simple language and an analogy.",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Clarity and simplicity of language',
      'Effective use of analogy',
      'Avoidance of unnecessary jargon',
      'Listener-centric framing',
    ],
    tips: 'A great analogy: Endpoint = menu item, Request = order, Response = food delivered.',
  },
  {
    id: 'comm_q2',
    type: 'COMMUNICATION',
    category: 'Crisis Communication',
    question: "You discover a critical bug in production 2 hours before a major product launch. Walk me through exactly how you would communicate this to your team, engineering manager, and product stakeholders.",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Calm and structured escalation path',
      'Factual impact assessment communicated',
      'Proposed solutions with timeline',
      'Ownership without blame',
    ],
    tips: 'Show: calm prioritization, quick impact assessment, clear escalation, factual communication, post-incident plan.',
  },
  {
    id: 'comm_q3',
    type: 'COMMUNICATION',
    category: 'Summarization & Brevity',
    question: "In under 90 seconds, explain the concept of 'microservices architecture' and when you would choose it over a monolith to a CTO who is evaluating your technical judgment.",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Concise and complete explanation',
      'Trade-off awareness (pros/cons)',
      'Appropriate audience calibration',
      'Confident delivery with good pace',
    ],
    tips: 'Cover: independent deployability, team autonomy, latency trade-offs, and when scale justifies the complexity.',
  },
  {
    id: 'comm_q4',
    type: 'COMMUNICATION',
    category: 'Active Listening & Feedback',
    question: "How would you approach giving constructive feedback to a junior developer whose code quality is consistently below team standards? Walk me through your actual conversation.",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Empathetic and respectful framing',
      'Specific, behavior-focused feedback',
      'Clear actionable guidance provided',
      'Two-way dialogue encouraged',
    ],
    tips: 'Use SBI model: Situation, Behavior, Impact. End with a growth path, not just criticism.',
  },
  {
    id: 'comm_q5',
    type: 'COMMUNICATION',
    category: 'Persuasion & Influence',
    question: "Your team wants to refactor a legacy codebase, but management is concerned about the time investment. How would you make the business case to get their buy-in?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Business value articulation (not just technical)',
      'Risk vs reward framing',
      'Data and metrics cited',
      'Clear call to action',
    ],
    tips: 'Translate tech debt into business language: developer velocity, bug rates, deployment frequency, on-call incidents.',
  },
  {
    id: 'comm_q6',
    type: 'COMMUNICATION',
    category: 'Presentation & Clarity',
    question: "Explain how the Internet works when you type 'google.com' into a browser and press Enter — from DNS resolution to the page loading. Speak as if explaining to a tech-savvy intern.",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Logical sequential explanation',
      'Key concepts covered (DNS, TCP, HTTP)',
      'Appropriate technical depth for audience',
      'Clear and confident pacing',
    ],
    tips: 'Cover DNS lookup → TCP handshake → HTTPS → Server renders response → Browser paints DOM.',
  },
  {
    id: 'comm_q7',
    type: 'COMMUNICATION',
    category: 'Handling Ambiguity',
    question: "A client says: 'The application is slow.' How would you ask follow-up questions to scope and clarify the problem, and what's your prioritization framework for debugging it?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Systematic clarifying questions',
      'Structured debugging mental model',
      'Avoidance of assumptions',
      'Clear communication of next steps',
    ],
    tips: 'Ask: Which feature? When did it start? Specific action? All users or subset? After deployment?',
  },
  {
    id: 'comm_q8',
    type: 'COMMUNICATION',
    category: 'Cross-functional Communication',
    question: "You are presenting a major system design decision to a mixed audience of engineers, designers, and business stakeholders. How do you tailor your communication for each group in the same meeting?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Audience segmentation awareness',
      'Multi-layer explanation strategy',
      'Inclusive meeting facilitation',
      'Summary that aligns all parties',
    ],
    tips: 'Lead with the "why" (business), then the "what" (system), then the "how" (technical). Use visuals.',
  },
  {
    id: 'comm_q9',
    type: 'COMMUNICATION',
    category: 'Negotiation & Trade-offs',
    question: "Your product manager wants a feature shipped in 2 weeks, but you estimate 6 weeks for a complete, robust solution. How do you negotiate and communicate trade-offs?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Trade-off clarity without confrontation',
      'MVP scoping communicated',
      'Risk transparency to stakeholders',
      'Collaborative problem solving',
    ],
    tips: 'Propose a phased approach: MVP in 2 weeks (core functionality), full solution in 6 weeks with documented limitations.',
  },
  {
    id: 'comm_q10',
    type: 'COMMUNICATION',
    category: 'Post-Incident Review',
    question: "After a major production outage that impacted users for 3 hours, how would you write and present the incident post-mortem? What should be included and what tone should you use?",
    prepSeconds: 15,
    answerSeconds: 150,
    marks: 10,
    evaluationCriteria: [
      'Blame-free, fact-based communication',
      'Clear timeline and impact articulation',
      'Root cause + contributing factors',
      'Actionable preventive measures',
    ],
    tips: 'Include: timeline, impact, root cause, contributing factors, action items with owners. Tone: blameless and forward-looking.',
  },
];

export const getRandomHrCommQuestions = () => {
  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());
  const hrPicked = shuffle(HR_QUESTIONS).slice(0, 6);
  const commPicked = shuffle(COMMUNICATION_QUESTIONS).slice(0, 10);
  return [...hrPicked, ...commPicked];
};

export const HR_COMM_QUESTIONS = getRandomHrCommQuestions();

export const ROUND3_CONFIG = {
  totalQuestions: 16,
  hrQuestionsCount: 6,
  commQuestionsCount: 10,
  marksPerQuestion: 10,
  totalMarks: 160,
  skipDeduction: 10, // full 10 marks deducted for skip
  micRequired: true,
  cameraRequired: true,
  analysisMetrics: ['fluency', 'eyeContact', 'confidence'],
};

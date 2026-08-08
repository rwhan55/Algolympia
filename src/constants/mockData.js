import { INTERVIEWER_TYPES } from './interviewers';

export const MOCK_USER = {
  id: 'usr_789423',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: 'Stanford University',
  branch: 'Computer Science & Engineering',
  gradYear: '2025',
  targetRole: 'Senior Full Stack Engineer',
  stats: {
    interviewsCompleted: 14,
    averageScore: 86,
    highestScore: 94,
    resumeMatchScore: 92,
    totalPracticeTimeHours: 18.5
  }
};

export const MOCK_RESUMES = [
  {
    id: 'res_101',
    fileName: 'Alex_Johnson_Fullstack_Resume.pdf',
    fileSize: '1.4 MB',
    uploadedAt: '2026-08-01',
    isPrimary: true,
    analysis: {
      candidateName: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 019-2834',
      suggestedDifficulty: 'Advanced',
      matchScore: 92,
      skills: ['React.js', 'TypeScript', 'Node.js', 'Python', 'System Architecture', 'GraphQL', 'Docker', 'PostgreSQL', 'Redis', 'AWS'],
      experience: [
        {
          role: 'Full Stack Developer Intern',
          company: 'TechCorp Solutions',
          duration: 'Jun 2025 - Present',
          highlights: ['Built responsive micro-frontend dashboards serving 50k+ daily users.', 'Optimized PostgreSQL queries reducing latency by 40%.']
        },
        {
          role: 'Frontend Developer',
          company: 'Innovate AI Labs',
          duration: 'Jan 2025 - May 2025',
          highlights: ['Developed real-time WebSocket state management for AI live chat streams.']
        }
      ],
      projects: [
        {
          name: 'Distributed Log Indexer',
          tech: ['Golang', 'Raft Consensus', 'Docker'],
          description: 'Implemented a fault-tolerant log search service handling 10k ops/sec.'
        },
        {
          name: 'AI Code Companion',
          tech: ['React', 'Python', 'Llama 3', 'FastAPI'],
          description: 'Built an interactive pair programming assistant with context embeddings.'
        }
      ],
      education: [
        {
          degree: 'B.S. Computer Science',
          institution: 'Stanford University',
          year: '2021 - 2025',
          gpa: '3.9 / 4.0'
        }
      ],
      certifications: ['AWS Certified Solutions Architect', 'Meta Professional Frontend Certificate']
    }
  }
];

export const MOCK_INTERVIEW_QUESTIONS = [
  {
    id: 'q1',
    interviewerType: INTERVIEWER_TYPES.HR,
    category: 'Behavioral & Leadership',
    question: 'Tell me about a challenging technical conflict you experienced with a peer on a architectural decision, and how you navigated it to achieve consensus.',
    timeLimitSeconds: 180,
    sampleAnswerHint: 'Focus on listening, evaluating trade-offs objectively, creating a proof-of-concept, and prioritizing team outcomes.'
  },
  {
    id: 'q2',
    interviewerType: INTERVIEWER_TYPES.DSA,
    category: 'Algorithms & Data Structures',
    question: 'Given an array of strings representing code execution tokens, describe how you would design an O(N) algorithm to find the longest valid matching parenthesis subarray and evaluate its space complexity.',
    timeLimitSeconds: 240,
    sampleAnswerHint: 'Explain stack-based index tracking or two-pointer directional scanning.'
  },
  {
    id: 'q3',
    interviewerType: INTERVIEWER_TYPES.SYS_DESIGN,
    category: 'System Design & Scalability',
    question: 'How would you design a real-time collaborative code editor supporting 10,000 concurrent active typers with under 50ms latency?',
    timeLimitSeconds: 300,
    sampleAnswerHint: 'Discuss Operational Transformation (OT) vs CRDTs, WebSocket connection management, Redis Pub/Sub, and state persistence.'
  },
  {
    id: 'q4',
    interviewerType: INTERVIEWER_TYPES.COMMS,
    category: 'Technical Communication',
    question: 'Explain the concept of WebSockets versus HTTP Long Polling to a non-technical project stakeholder who wants to understand why live notifications are necessary.',
    timeLimitSeconds: 180,
    sampleAnswerHint: 'Use an analogy like a phone call (WebSocket) vs repeatedly calling a office reception (Polling).'
  },
  {
    id: 'q5',
    interviewerType: INTERVIEWER_TYPES.RESUME,
    category: 'Resume & Stack Deep-Dive',
    question: 'In your resume project "Distributed Log Indexer", what strategy did you use to handle partition tolerance when nodes lose network connection?',
    timeLimitSeconds: 210,
    sampleAnswerHint: 'Explain leader election, quorum consensus, and heartbeats.'
  }
];

export const MOCK_INTERVIEW_HISTORY = [
  {
    id: 'int_9921',
    date: '2026-08-05',
    role: 'Senior Full Stack Engineer',
    overallScore: 89,
    duration: '28 mins',
    difficulty: 'Advanced',
    resumeUsed: 'Alex_Johnson_Fullstack_Resume.pdf',
    breakdown: {
      [INTERVIEWER_TYPES.HR]: 92,
      [INTERVIEWER_TYPES.DSA]: 85,
      [INTERVIEWER_TYPES.SYS_DESIGN]: 88,
      [INTERVIEWER_TYPES.COMMS]: 94,
      [INTERVIEWER_TYPES.RESUME]: 87
    },
    status: 'Completed'
  },
  {
    id: 'int_8842',
    date: '2026-07-28',
    role: 'System Architect',
    overallScore: 78,
    duration: '32 mins',
    difficulty: 'Expert',
    resumeUsed: 'Alex_Johnson_Fullstack_Resume.pdf',
    breakdown: {
      [INTERVIEWER_TYPES.HR]: 80,
      [INTERVIEWER_TYPES.DSA]: 72,
      [INTERVIEWER_TYPES.SYS_DESIGN]: 82,
      [INTERVIEWER_TYPES.COMMS]: 85,
      [INTERVIEWER_TYPES.RESUME]: 74
    },
    status: 'Completed'
  },
  {
    id: 'int_7731',
    date: '2026-07-15',
    role: 'Frontend Lead',
    overallScore: 94,
    duration: '24 mins',
    difficulty: 'Intermediate',
    resumeUsed: 'Alex_Johnson_Fullstack_Resume.pdf',
    breakdown: {
      [INTERVIEWER_TYPES.HR]: 95,
      [INTERVIEWER_TYPES.DSA]: 92,
      [INTERVIEWER_TYPES.SYS_DESIGN]: 90,
      [INTERVIEWER_TYPES.COMMS]: 98,
      [INTERVIEWER_TYPES.RESUME]: 95
    },
    status: 'Completed'
  }
];

export const MOCK_REPORT_DETAILS = {
  id: 'rep_int_9921',
  interviewId: 'int_9921',
  candidateName: 'Alex Johnson',
  role: 'Senior Full Stack Engineer',
  date: 'August 5, 2026',
  duration: '28 minutes',
  difficulty: 'Advanced',
  overallScore: 89,
  recommendation: 'Strong Hire',
  scores: {
    hr: 92,
    dsa: 85,
    sysDesign: 88,
    comms: 94,
    resume: 87
  },
  strengths: [
    'Outstanding verbal articulation and structured explanation of complex trade-offs.',
    'Solid grasp of distributed systems, operational transformation, and real-time state synchronization.',
    'Demonstrated empathetic leadership and structured conflict resolution methodology.',
    'Deep familiarity with React, TypeScript, and modern frontend architecture patterns.'
  ],
  weaknesses: [
    'Could refine edge-case analysis in strict algorithmic space complexity estimations.',
    'Consider discussing failure recovery modes earlier when detailing distributed database design.'
  ],
  improvements: [
    'Practice dry-running O(1) auxiliary space optimizations for sliding window algorithms.',
    'Structure system design answers using the clear FRAME methodology (Functional, Requirements, Architecture, Metrics, Edge cases).'
  ],
  questionFeedback: [
    {
      questionNum: 1,
      category: 'Behavioral & Leadership',
      interviewer: 'Sarah Jenkins (HR)',
      question: 'Tell me about a challenging technical conflict you experienced with a peer on a architectural decision...',
      userAnswerTranscript: 'In my previous project, a senior engineer and I disagreed on whether to use GraphQL or REST with gRPC. I scheduled a 30-minute sync, defined objective criteria (latency, bandwidth, client flexibility), created a quick benchmark demo, and presented data which helped us reach consensus smoothly.',
      score: 92,
      aiFeedback: 'Excellent framework for handling conflict with empirical data and objective criteria. Clear and professional communication.'
    },
    {
      questionNum: 2,
      category: 'Algorithms & Data Structures',
      interviewer: 'Alex Rivera (DSA)',
      question: 'Given an array of strings representing code execution tokens, describe how you would design an O(N) algorithm...',
      userAnswerTranscript: 'I would use a stack to store the indices of open parentheses. When encountered, push index. For close parentheses, pop the top. If stack is empty, update the dynamic start marker to current index + 1...',
      score: 85,
      aiFeedback: 'Correct algorithm logic and optimal O(N) time complexity. For extra points, mention space optimization via directional two-pointer passes.'
    },
    {
      questionNum: 3,
      category: 'System Design & Scalability',
      interviewer: 'Dr. Marcus Vance (System Design)',
      question: 'How would you design a real-time collaborative code editor supporting 10,000 concurrent active typers...',
      userAnswerTranscript: 'We would utilize WebSockets connected to a cluster of Node.js gateway nodes behind an Application Load Balancer. For state consensus across operational typers, CRDTs (Conflict-free Replicated Data Types) like Yjs would handle local merging, synced via Redis Pub/Sub backplane.',
      score: 88,
      aiFeedback: 'Very strong choice of CRDTs (Yjs) and Redis Pub/Sub. High clarity on horizontal scaling for socket connections.'
    }
  ]
};

export const INTERVIEWER_TYPES = {
  HR: 'HR',
  DSA: 'DSA',
  SYS_DESIGN: 'SYS_DESIGN',
  COMMS: 'COMMS',
  RESUME: 'RESUME',
  FINAL: 'FINAL'
};

export const INTERVIEWERS = {
  [INTERVIEWER_TYPES.HR]: {
    id: 'hr-evaluator',
    name: 'Sarah Jenkins',
    role: 'Senior HR & Culture Evaluator',
    panelType: INTERVIEWER_TYPES.HR,
    avatar: '👩‍💼',
    badge: 'Culture & Behavioral',
    color: '#F59E0B', // Amber
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
    lightTextColor: 'text-amber-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    accentClass: 'panel-hr',
    description: 'Assesses cultural fit, problem-solving mindset, leadership skills, and soft skills alignment.'
  },
  [INTERVIEWER_TYPES.DSA]: {
    id: 'dsa-evaluator',
    name: 'Alex Rivera',
    role: 'Lead Algorithmic Engineer',
    panelType: INTERVIEWER_TYPES.DSA,
    avatar: '👨‍💻',
    badge: 'DSA & Coding',
    color: '#06B6D4', // Cyan
    bgGradient: 'from-cyan-500/20 to-blue-600/10',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    lightTextColor: 'text-cyan-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    accentClass: 'panel-dsa',
    description: 'Evaluates time complexity, data structures, algorithms, edge cases, and code optimization.'
  },
  [INTERVIEWER_TYPES.SYS_DESIGN]: {
    id: 'sysdesign-evaluator',
    name: 'Dr. Marcus Vance',
    role: 'Principal Systems Architect',
    panelType: INTERVIEWER_TYPES.SYS_DESIGN,
    avatar: '🧠',
    badge: 'System Architecture',
    color: '#8B5CF6', // Purple
    bgGradient: 'from-purple-500/20 to-indigo-600/10',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400',
    lightTextColor: 'text-purple-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    accentClass: 'panel-sysdesign',
    description: 'Tests scalable architecture, distributed systems, caching, microservices, and database trade-offs.'
  },
  [INTERVIEWER_TYPES.COMMS]: {
    id: 'comms-evaluator',
    name: 'Elena Rostova',
    role: 'Communication & Clarity Coach',
    panelType: INTERVIEWER_TYPES.COMMS,
    avatar: '🗣️',
    badge: 'Verbal & Presentation',
    color: '#10B981', // Emerald
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
    lightTextColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accentClass: 'panel-comms',
    description: 'Evaluates articulate reasoning, conciseness, confidence, and technical explanation structure.'
  },
  [INTERVIEWER_TYPES.RESUME]: {
    id: 'resume-evaluator',
    name: 'David Chen',
    role: 'Technical Hiring Manager',
    panelType: INTERVIEWER_TYPES.RESUME,
    avatar: '📑',
    badge: 'Experience Verification',
    color: '#EC4899', // Rose/Pink
    bgGradient: 'from-pink-500/20 to-rose-600/10',
    borderColor: 'border-pink-500/50',
    textColor: 'text-pink-400',
    lightTextColor: 'text-pink-600',
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    accentClass: 'panel-resume',
    description: 'Probes experience mentioned in your resume, tech stack choices, and past project impact.'
  },
  [INTERVIEWER_TYPES.FINAL]: {
    id: 'final-synth',
    name: 'AI Synthesis Engine',
    role: 'Chief Evaluation Panel',
    panelType: INTERVIEWER_TYPES.FINAL,
    avatar: '🏆',
    badge: 'Final Synthesis',
    color: '#EAB308', // Gold
    bgGradient: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    lightTextColor: 'text-yellow-600',
    badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    accentClass: 'panel-report',
    description: 'Synthesizes all interviewer feedback into an overall score and comprehensive feedback matrix.'
  }
};

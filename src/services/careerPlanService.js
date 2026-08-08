/**
 * careerPlanService.js
 * Service for managing Career Plan records, status persistence, reflection notes,
 * learning search & topic filtering, progress analytics, and CSV export.
 */

const STORAGE_KEY = 'algoolympia_career_plans';

export const INITIAL_DEMO_CAREER_PLANS = [
  {
    id: 'cp_101',
    title: 'Master Graph Shortest Path & Topological Sort',
    topic: 'Data Structures & Algorithms',
    difficulty: 'Hard',
    goal: 'Senior Full Stack Engineer',
    deadline: '2026-08-12',
    status: 'In Progress',
    note: 'Revised Dijkstra and Bellman-Ford implementations. Working on Kahn algorithm for topological sorting in DAGs.',
    updatedAt: '2026-08-07T14:30:00Z',
    estimatedHours: 8,
    priority: 'High',
  },
  {
    id: 'cp_102',
    title: 'Design Microservices Rate Limiter & Circuit Breaker',
    topic: 'System Design',
    difficulty: 'Hard',
    goal: 'Senior Full Stack Engineer',
    deadline: '2026-08-14',
    status: 'Not Started',
    note: 'Need to research Token Bucket vs Leaky Bucket algorithms and Resilience4j pattern implementation.',
    updatedAt: '2026-08-06T10:15:00Z',
    estimatedHours: 12,
    priority: 'High',
  },
  {
    id: 'cp_103',
    title: 'React Concurrent Mode & Custom Hook Architecture',
    topic: 'Frontend Architecture',
    difficulty: 'Medium',
    goal: 'Senior Full Stack Engineer',
    deadline: '2026-08-05',
    status: 'Completed',
    note: 'Completed demo project using useTransition and useDeferredValue. Optimized bundle size by 18%.',
    updatedAt: '2026-08-05T18:45:00Z',
    estimatedHours: 6,
    priority: 'Medium',
  },
  {
    id: 'cp_104',
    title: 'Database Indexing B-Trees & Query Optimization',
    topic: 'Database & Storage',
    difficulty: 'Medium',
    goal: 'Backend Specialist',
    deadline: '2026-08-10',
    status: 'In Progress',
    note: 'Analyzed EXPLAIN ANALYZE execution plans in SQLite and PostgreSQL. Compound indexes reduced query latency by 4x.',
    updatedAt: '2026-08-07T09:20:00Z',
    estimatedHours: 5,
    priority: 'High',
  },
  {
    id: 'cp_105',
    title: 'Behavioral STAR Format & System Incident Post-Mortem',
    topic: 'Behavioral & Leadership',
    difficulty: 'Easy',
    goal: 'Engineering Lead',
    deadline: '2026-08-08',
    status: 'Completed',
    note: 'Practiced 5 STAR format stories covering outage resolution, technical conflict, and team mentorship.',
    updatedAt: '2026-08-04T16:00:00Z',
    estimatedHours: 4,
    priority: 'Medium',
  },
  {
    id: 'cp_106',
    title: 'TCP/IP Handshake, TLS Encryption & WebSockets',
    topic: 'Computer Networks & Security',
    difficulty: 'Medium',
    goal: 'Backend Specialist',
    deadline: '2026-08-18',
    status: 'Not Started',
    note: 'Planned review of Wireshark packet captures and HTTP/2 multiplexing vs HTTP/3 QUIC protocol.',
    updatedAt: '2026-08-06T11:00:00Z',
    estimatedHours: 7,
    priority: 'Medium',
  },
  {
    id: 'cp_107',
    title: 'Distributed Caching Strategies with Redis & Memcached',
    topic: 'System Design',
    difficulty: 'Hard',
    goal: 'System Architect',
    deadline: '2026-08-20',
    status: 'Not Started',
    note: 'Study Cache-Aside, Write-Through, and Write-Behind eviction policies under high concurrency load.',
    updatedAt: '2026-08-07T11:30:00Z',
    estimatedHours: 10,
    priority: 'High',
  },
  {
    id: 'cp_108',
    title: 'Dynamic Programming Patterns: Knapsack & Subsequences',
    topic: 'Data Structures & Algorithms',
    difficulty: 'Hard',
    goal: 'Senior Full Stack Engineer',
    deadline: '2026-08-03',
    status: 'Completed',
    note: 'Solved 12 DP problems covering 0/1 Knapsack, Unbounded Knapsack, and Longest Common Subsequence.',
    updatedAt: '2026-08-03T19:10:00Z',
    estimatedHours: 14,
    priority: 'High',
  },
];

export const TOPIC_OPTIONS = [
  'All Topics',
  'Data Structures & Algorithms',
  'System Design',
  'Frontend Architecture',
  'Database & Storage',
  'Computer Networks & Security',
  'Behavioral & Leadership',
];

export const DIFFICULTY_OPTIONS = ['All Difficulties', 'Easy', 'Medium', 'Hard'];

export const STATUS_OPTIONS = ['All Statuses', 'Not Started', 'In Progress', 'Completed'];

export const GOAL_OPTIONS = [
  'All Goals',
  'Senior Full Stack Engineer',
  'System Architect',
  'Backend Specialist',
  'Engineering Lead',
];

// Helper: Get stored records or seed initial demo records
export const getCareerPlanRecords = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CAREER_PLANS));
      return INITIAL_DEMO_CAREER_PLANS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_CAREER_PLANS;
  }
};

// Save records to localStorage
export const saveCareerPlanRecords = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save career plan records:', err);
  }
};

// Update record status
export const updateRecordStatus = (id, newStatus) => {
  const records = getCareerPlanRecords();
  const updated = records.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  saveCareerPlanRecords(updated);
  return updated;
};

// Update record reflection note
export const updateRecordNote = (id, newNote) => {
  const records = getCareerPlanRecords();
  const updated = records.map(item => {
    if (item.id === id) {
      return {
        ...item,
        note: newNote,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });
  saveCareerPlanRecords(updated);
  return updated;
};

// Add new career plan record
export const addCareerPlanRecord = (newRecord) => {
  const records = getCareerPlanRecords();
  const item = {
    id: `cp_${Date.now()}`,
    title: newRecord.title || 'Untitled Learning Module',
    topic: newRecord.topic || 'Data Structures & Algorithms',
    difficulty: newRecord.difficulty || 'Medium',
    goal: newRecord.goal || 'Senior Full Stack Engineer',
    deadline: newRecord.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: newRecord.status || 'Not Started',
    note: newRecord.note || '',
    updatedAt: new Date().toISOString(),
    estimatedHours: Number(newRecord.estimatedHours) || 4,
    priority: newRecord.priority || 'Medium',
  };
  const updated = [item, ...records];
  saveCareerPlanRecords(updated);
  return updated;
};

// Delete record
export const deleteCareerPlanRecord = (id) => {
  const records = getCareerPlanRecords();
  const updated = records.filter(item => item.id !== id);
  saveCareerPlanRecords(updated);
  return updated;
};

// Reset to initial demo data
export const resetToDemoData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CAREER_PLANS));
  return INITIAL_DEMO_CAREER_PLANS;
};

// Calculate summary statistics, weak areas, and next recommended action
export const calculateCareerPlanStats = (records = []) => {
  const total = records.length;
  const completed = records.filter(r => r.status === 'Completed').length;
  const inProgress = records.filter(r => r.status === 'In Progress').length;
  const notStarted = records.filter(r => r.status === 'Not Started').length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by Topic
  const byTopic = {};
  records.forEach(r => {
    if (!byTopic[r.topic]) {
      byTopic[r.topic] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
    }
    byTopic[r.topic].total += 1;
    if (r.status === 'Completed') byTopic[r.topic].completed += 1;
    if (r.status === 'In Progress') byTopic[r.topic].inProgress += 1;
    if (r.status === 'Not Started') byTopic[r.topic].notStarted += 1;
  });

  // Identify Weak Areas: Topics with lowest completion percentage or high pending items
  const weakAreas = Object.entries(byTopic)
    .map(([topic, data]) => {
      const pending = data.notStarted + data.inProgress;
      const pct = Math.round((data.completed / data.total) * 100);
      return { topic, pending, completed: data.completed, total: data.total, pct };
    })
    .filter(item => item.pending > 0)
    .sort((a, b) => b.pending - a.pending || a.pct - b.pct);

  // Next Recommended Action: Pick highest priority pending item with earliest deadline
  const pendingItems = records
    .filter(r => r.status !== 'Completed')
    .sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (b.priority === 'High' && a.priority !== 'High') return 1;
      return new Date(a.deadline) - new Date(b.deadline);
    });

  const nextRecommendation = pendingItems.length > 0 ? {
    item: pendingItems[0],
    reason: pendingItems[0].status === 'In Progress'
      ? 'In progress module requiring final completion & reflection.'
      : 'High priority learning module scheduled for immediate focus.',
  } : null;

  // Activity Log (items with notes or recent updates)
  const recentActivity = [...records]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return {
    totalCount: total,
    completedCount: completed,
    inProgressCount: inProgress,
    notStartedCount: notStarted,
    completionPercentage,
    byTopic,
    weakAreas,
    nextRecommendation,
    recentActivity,
  };
};

// Export records as CSV File
export const exportCareerPlanCSV = (records = []) => {
  const headers = ['ID', 'Title', 'Topic', 'Difficulty', 'Goal', 'Deadline', 'Status', 'Priority', 'Est Hours', 'Reflection Note', 'Last Updated'];
  const rows = records.map(r => [
    `"${r.id}"`,
    `"${(r.title || '').replace(/"/g, '""')}"`,
    `"${(r.topic || '').replace(/"/g, '""')}"`,
    `"${r.difficulty}"`,
    `"${(r.goal || '').replace(/"/g, '""')}"`,
    `"${r.deadline}"`,
    `"${r.status}"`,
    `"${r.priority}"`,
    `"${r.estimatedHours || 0}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
    `"${r.updatedAt}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ALGOOlympia_Career_Plan_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

import express from 'express';
import { dbRun, dbQuery, dbGet } from '../db.js';

const router = express.Router();

// GET /api/reports/:id — Fetch specific candidate report from SQLite Database
router.get('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    const row = await dbGet(`SELECT * FROM reports WHERE id = ?`, [reportId]);

    if (!row) {
      // Fallback response
      return res.json({
        id: reportId,
        candidateName: 'Alex Johnson',
        targetRole: 'Senior Full Stack Engineer',
        date: new Date().toLocaleDateString(),
        overallScore: 88,
        recommendation: 'STRONG HIRE',
        scores: { hr: 90, dsa: 85, sysDesign: 88, comms: 92, resume: 87 },
      });
    }

    return res.json({
      id: row.id,
      targetRole: row.target_role,
      overallScore: row.overall_score,
      recommendation: row.recommendation,
      scores: JSON.parse(row.scores_json),
      summary: row.summary,
      date: new Date(row.created_at).toLocaleDateString(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/reports — Save candidate interview evaluation report in Database
router.post('/', async (req, res) => {
  try {
    const report = req.body;
    const reportId = report.id || `rep_${Date.now()}`;

    await dbRun(
      `INSERT INTO reports (id, user_id, target_role, overall_score, recommendation, scores_json, summary)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reportId,
        report.userId || 'user_default',
        report.targetRole || 'Senior Full Stack Engineer',
        report.overallScore || 0,
        report.recommendation || 'HIRE',
        JSON.stringify(report.scores || {}),
        report.summary || 'Interview completed',
      ]
    );

    return res.json({ success: true, id: reportId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/history — Fetch candidate interview history
router.get('/history', async (req, res) => {
  try {
    const rows = await dbQuery(`SELECT * FROM reports ORDER BY created_at DESC`);
    const history = rows.map(r => ({
      id: r.id,
      role: r.target_role,
      date: new Date(r.created_at).toLocaleDateString(),
      overallScore: r.overall_score,
      recommendation: r.recommendation,
      duration: '25 mins',
      difficulty: 'Advanced',
    }));
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

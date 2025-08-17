import express from 'express';
import messageController from '../controllers/messageController.js';
import alertController from '../controllers/alertController.js';
import sseService from '../services/sseService.js';

const router = express.Router();

// Message routes
router.post('/broadcast', messageController.sendBroadcast);
router.post('/direct', messageController.sendDirectMessage);
router.get('/', messageController.getMessages);
router.patch('/:id/read', messageController.markMessageRead);
router.get('/unread-count', messageController.getUnreadCount);
router.delete('/:id', messageController.deleteMessage);

// Alert routes
router.get('/alerts', alertController.getAlerts);
router.get('/alerts/summary', alertController.getAlertSummary);
router.post('/alerts', alertController.createAlert);
router.patch('/alerts/:id/acknowledge', alertController.acknowledgeAlert);

// Alert rules
router.get('/alert-rules', alertController.getAlertRules);
router.post('/alert-rules', alertController.upsertAlertRule);
router.post('/alert-rules/run-checks', alertController.runAlertChecks);

// Server-Sent Events endpoint for real-time updates
router.get('/stream', (req, res) => {
  const userId = req.query.userId || req.user?.id || `guest_${Date.now()}`;
  sseService.addClient(userId, res);
});

export default router;
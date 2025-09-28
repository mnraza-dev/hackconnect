import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get messages for a team
router.get('/team/:teamId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await Message.find({ team: req.params.teamId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get team messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get direct messages between users
router.get('/direct/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await Message.find({
      $or: [
        { sender: req.user!._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user!._id }
      ]
    })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message to team
router.post('/team/:teamId', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message content is required and must be less than 1000 characters'),
  body('type').optional().isIn(['text', 'image', 'file']).withMessage('Invalid message type')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type = 'text' } = req.body;

    const message = new Message({
      sender: req.user!._id,
      content,
      type,
      team: req.params.teamId
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    console.error('Send team message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send direct message
router.post('/direct/:userId', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message content is required and must be less than 1000 characters'),
  body('type').optional().isIn(['text', 'image', 'file']).withMessage('Invalid message type')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type = 'text' } = req.body;

    const message = new Message({
      sender: req.user!._id,
      content,
      type,
      recipient: req.params.userId
    });

    await message.save();
    await message.populate('sender', 'name avatar');
    await message.populate('recipient', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    console.error('Send direct message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/read', authenticateToken, [
  body('messageIds').isArray().withMessage('Message IDs must be an array')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { messageIds } = req.body;

    await Message.updateMany(
      { _id: { $in: messageIds }, recipient: req.user!._id },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

import express from 'express';
import { body, validationResult } from 'express-validator';
import Team from '../models/Team';
import TeamRequest from '../models/TeamRequest';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get teams for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const teams = await Team.find({ event: req.params.eventId })
      .populate('leader', 'name email avatar skills')
      .populate('members', 'name email avatar skills')
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email avatar skills bio')
      .populate('members', 'name email avatar skills bio')
      .populate('event', 'title date location mode');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create team
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 3 }).withMessage('Team name must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('event').isMongoId().withMessage('Please provide a valid event ID'),
  body('maxMembers').optional().isInt({ min: 2, max: 10 }),
  body('skillsNeeded').optional().isArray()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, event, maxMembers, skillsNeeded } = req.body;

    const team = new Team({
      name,
      description,
      event,
      leader: req.user!._id,
      maxMembers: maxMembers || 5,
      skillsNeeded: skillsNeeded || []
    });

    await team.save();
    await team.populate('leader', 'name email avatar skills');
    await team.populate('event', 'title date location mode');

    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join team request
router.post('/:id/join', authenticateToken, [
  body('message').optional().trim().isLength({ max: 500 })
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const teamId = req.params.id;

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is already a member
    if (team.members.includes(req.user!._id) || team.leader.toString() === req.user!._id.toString()) {
      return res.status(400).json({ message: 'You are already a member of this team' });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: 'Team is full' });
    }

    // Check if user already has a pending request
    const existingRequest = await TeamRequest.findOne({
      team: teamId,
      user: req.user!._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this team' });
    }

    const teamRequest = new TeamRequest({
      team: teamId,
      user: req.user!._id,
      message
    });

    await teamRequest.save();
    await teamRequest.populate('user', 'name email avatar skills');

    res.status(201).json(teamRequest);
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team requests for a team (team leader only)
router.get('/:id/requests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leader.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view team requests' });
    }

    const requests = await TeamRequest.find({ team: req.params.id, status: 'pending' })
      .populate('user', 'name email avatar skills bio');

    res.json(requests);
  } catch (error) {
    console.error('Get team requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept/Reject team request
router.put('/:id/requests/:requestId', authenticateToken, [
  body('action').isIn(['accept', 'reject']).withMessage('Action must be accept or reject')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { action } = req.body;
    const { id: teamId, requestId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leader.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage team requests' });
    }

    const teamRequest = await TeamRequest.findById(requestId);
    if (!teamRequest) {
      return res.status(404).json({ message: 'Team request not found' });
    }

    if (action === 'accept') {
      // Add user to team
      team.members.push(teamRequest.user);
      await team.save();

      // Update request status
      teamRequest.status = 'accepted';
      await teamRequest.save();

      res.json({ message: 'User added to team successfully' });
    } else {
      // Reject request
      teamRequest.status = 'rejected';
      await teamRequest.save();

      res.json({ message: 'Team request rejected' });
    }
  } catch (error) {
    console.error('Handle team request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

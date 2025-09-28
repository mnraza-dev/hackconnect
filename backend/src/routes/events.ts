import express from 'express';
import { body, validationResult } from 'express-validator';
import Event from '../models/Event';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const mode = req.query.mode as string;
    const skills = req.query.skills as string;
    const location = req.query.location as string;

    const query: any = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (mode) {
      query.mode = mode;
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skillsRequired = { $in: skillsArray };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar bio skills');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('mode').isIn(['online', 'offline']).withMessage('Mode must be online or offline'),
  body('location').optional().trim(),
  body('maxParticipants').optional().isInt({ min: 1 }),
  body('skillsRequired').optional().isArray(),
  body('tags').optional().isArray()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      date,
      endDate,
      mode,
      location,
      coordinates,
      maxParticipants,
      skillsRequired,
      tags,
      registrationDeadline
    } = req.body;

    const event = new Event({
      title,
      description,
      date,
      endDate,
      mode,
      location,
      coordinates,
      organizer: req.user!._id,
      maxParticipants,
      skillsRequired: skillsRequired || [],
      tags: tags || []
    });

    if (registrationDeadline) {
      event.registrationDeadline = new Date(registrationDeadline);
    }

    await event.save();
    await event.populate('organizer', 'name email avatar');

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updateData = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email avatar');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

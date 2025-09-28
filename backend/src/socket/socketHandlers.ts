import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message from '../models/Message';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected`);

    // Join team room
    socket.on('join-team', (teamId: string) => {
      socket.join(`team-${teamId}`);
      console.log(`User ${socket.userId} joined team ${teamId}`);
    });

    // Leave team room
    socket.on('leave-team', (teamId: string) => {
      socket.leave(`team-${teamId}`);
      console.log(`User ${socket.userId} left team ${teamId}`);
    });

    // Handle team messages
    socket.on('team-message', async (data: { teamId: string; content: string; type?: string }) => {
      try {
        const message = new Message({
          sender: socket.userId,
          content: data.content,
          type: data.type || 'text',
          team: data.teamId
        });

        await message.save();
        await message.populate('sender', 'name avatar');

        // Broadcast to all users in the team room
        io.to(`team-${data.teamId}`).emit('team-message', message);
      } catch (error) {
        console.error('Error handling team message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle direct messages
    socket.on('direct-message', async (data: { recipientId: string; content: string; type?: string }) => {
      try {
        const message = new Message({
          sender: socket.userId,
          content: data.content,
          type: data.type || 'text',
          recipient: data.recipientId
        });

        await message.save();
        await message.populate('sender', 'name avatar');

        // Send to recipient if they're online
        const recipientSocket = Array.from(io.sockets.sockets.values())
          .find(s => (s as AuthenticatedSocket).userId === data.recipientId);

        if (recipientSocket) {
          recipientSocket.emit('direct-message', message);
        }

        // Send back to sender for confirmation
        socket.emit('direct-message', message);
      } catch (error) {
        console.error('Error handling direct message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data: { teamId?: string; recipientId?: string }) => {
      if (data.teamId) {
        socket.to(`team-${data.teamId}`).emit('user-typing', {
          userId: socket.userId,
          isTyping: true
        });
      }
    });

    socket.on('typing-stop', (data: { teamId?: string; recipientId?: string }) => {
      if (data.teamId) {
        socket.to(`team-${data.teamId}`).emit('user-typing', {
          userId: socket.userId,
          isTyping: false
        });
      }
    });

    // Handle user status updates
    socket.on('user-status', (status: string) => {
      socket.broadcast.emit('user-status-update', {
        userId: socket.userId,
        status
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

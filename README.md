# HackConnect - Hackathon & Event Collaboration Platform

A comprehensive platform for hackathon participants and organizers to discover events, form teams, and collaborate on projects.

## 🚀 Features

### Core Features
- **User Authentication** - Secure registration and login with JWT
- **Event Discovery** - Browse and search hackathons and events
- **Team Formation** - Create teams, find teammates, and manage team requests
- **Real-time Chat** - WebSocket-based messaging for teams and direct messages
- **User Profiles** - Showcase skills, bio, and social links
- **Event Management** - Create and manage hackathons and events

### Advanced Features
- **Skill-based Matching** - Find teammates with complementary skills
- **Location-based Discovery** - Find local events and teams
- **Real-time Notifications** - Stay updated with team activities
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form management
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Passport.js** - Authentication strategies

## 📁 Project Structure

```
hackconnect/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── events/        # Event management
│   │   └── teams/          # Team management
│   ├── components/          # Reusable UI components
│   └── lib/                # Utility functions
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── socket/         # Socket.io handlers
│   └── env.example         # Environment variables template
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackconnect
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   pnpm dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hackconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📱 Usage

### For Participants
1. **Register/Login** - Create an account or sign in
2. **Browse Events** - Discover hackathons and events
3. **Join Teams** - Find or create teams for events
4. **Collaborate** - Use real-time chat and team tools
5. **Build Projects** - Work together on amazing projects

### For Organizers
1. **Create Events** - Set up hackathons and events
2. **Manage Participants** - Track registrations and teams
3. **Monitor Activity** - See team formations and progress
4. **Engage Community** - Foster collaboration and networking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Teams
- `GET /api/teams/event/:eventId` - Get teams for event
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team
- `POST /api/teams/:id/join` - Join team request
- `GET /api/teams/:id/requests` - Get team requests
- `PUT /api/teams/:id/requests/:requestId` - Handle team request

### Messages
- `GET /api/messages/team/:teamId` - Get team messages
- `GET /api/messages/direct/:userId` - Get direct messages
- `POST /api/messages/team/:teamId` - Send team message
- `POST /api/messages/direct/:userId` - Send direct message

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Create a new project on Railway or Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy automatically

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS
- MongoDB for the flexible database
- Socket.io for real-time communication
- All contributors and the open-source community

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Happy Hacking! 🚀**
# Installation & Setup Guide

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**
- **Google Gemini API Key** (Free tier available)

## Project Structure

```
Student_Skill_Gap_Analyzer/
├── frontend/          # React.js application
├── backend/           # Node.js/Express API
├── database/          # PostgreSQL schemas
└── README.md
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Database Configuration

Create a PostgreSQL database:
```bash
createdb skill_gap_analyzer
```

Or using PostgreSQL GUI/CLI:
```sql
CREATE DATABASE skill_gap_analyzer;
```

### 3. Run Database Migrations
```bash
psql -U postgres -d skill_gap_analyzer -f ../database/schema.sql
```

### 4. Environment Variables
Create `.env` file in the backend directory:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skill_gap_analyzer
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 5. Start Backend Server
```bash
npm start          # Production mode
# or
npm run dev        # Development mode with hot reload
```

Backend API will be available at `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## Getting Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key and add it to your backend `.env` file

## Quick Start (All-in-one)

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Walkthrough

### 1. User Registration & Login
- Create account with email and password
- JWT-based secure authentication
- Profile management

### 2. Resume Upload
- Upload PDF resumes
- Automatic skill extraction from resume text
- Support for multiple resume versions

### 3. Skill Gap Analysis
- Select target job role
- View matched vs. missing skills
- Match percentage with visual indicators
- Skill categorization

### 4. Learning Roadmap
- Auto-generated personalized learning path
- Step-by-step timeline with recommended courses
- Progress tracking
- Mark steps as completed

### 5. AI Career Assistant
- Powered by Google Gemini API
- Multiple contexts: Resume feedback, Interview prep, Project ideas, Career planning
- Chat history
- Context-aware responses

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get specific resume

### Analysis
- `POST /api/analysis/gap` - Perform skill gap analysis
- `GET /api/analysis/history` - Get analysis history

### Job Roles
- `GET /api/job-roles` - Get all job roles
- `GET /api/job-roles/:id` - Get specific job role

### Chat
- `POST /api/chat/message` - Send message to AI assistant
- `GET /api/chat/history` - Get chat history

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/category/:category` - Get skills by category

### Learning Roadmap
- `POST /api/roadmap` - Create learning roadmap
- `GET /api/roadmap` - Get user's roadmaps
- `GET /api/roadmap/:id` - Get roadmap details
- `PUT /api/roadmap/step/:stepId/complete` - Mark step as completed

## Database Schema Highlights

### Key Tables
- **users** - User accounts with authentication
- **user_profiles** - Extended user information
- **resumes** - Uploaded resumes and extracted skills
- **skills** - Skill database
- **user_skills** - User's skill proficiency levels
- **job_roles** - Available job positions
- **skill_gap_analysis** - Analysis results
- **learning_roadmaps** - Personalized learning paths
- **roadmap_steps** - Timeline milestones
- **courses** - Available learning resources
- **chat_history** - AI assistant conversations

## Design System

### Color Palette
- **Primary**: #1976D2 (Professional Blue)
- **Secondary**: #DC004E (Accent Red)
- **Success**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Background**: #F5F7FA (Light Gray)

### Typography
- **Font Family**: Segoe UI, Roboto
- **Body Text**: 1rem (16px)
- **Headings**: Weights 600-700

### Component Library
- Material-UI (MUI) v5 for UI components
- Responsive design with mobile-first approach
- Smooth animations and transitions

## Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway)
```bash
cd backend
npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DB credentials in `.env`
- Ensure database exists: `psql -l`

### API Connection Issues
- Verify backend is running on `http://localhost:5000`
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

### PDF Upload Issues
- Ensure file is valid PDF
- File size under 10MB
- Check backend upload directory permissions

## Performance Tips

1. **Image Optimization**: Use optimized course images
2. **Database Indexing**: Indexes already configured in schema
3. **Caching**: Implement caching for job roles and skills
4. **Code Splitting**: React components are lazy-loadable

## Security Considerations

1. ✅ JWT token validation
2. ✅ Password hashing with bcrypt
3. ✅ SQL injection prevention with parameterized queries
4. ✅ CORS enabled for cross-origin requests
5. ✅ File upload validation
6. ⚠️ **To Do**: Add rate limiting
7. ⚠️ **To Do**: Implement HTTPS in production
8. ⚠️ **To Do**: Add input sanitization

## Future Enhancements

- [ ] Real-time notifications
- [ ] Video tutorials integration
- [ ] Project showcase platform
- [ ] Job board integration
- [ ] Mentor matching system
- [ ] Mock interview practice
- [ ] Skill certification tracking
- [ ] Community forum
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is provided as a prototype for educational purposes.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Happy Learning! 🚀**

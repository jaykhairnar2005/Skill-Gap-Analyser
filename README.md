# AI-Powered Student Skill Gap Analyzer

A modern, full-stack web application prototype designed to help engineering students and fresh graduates identify skill gaps, receive personalized learning recommendations, and prepare for their careers with AI-powered assistance.

## 🎯 Features

- **Secure Authentication**: JWT-based login and registration system
- **Resume Upload & Processing**: PDF resume upload with automatic skill extraction
- **Job-Role Selection**: Database-populated dropdown for various job roles
- **Skill Gap Analysis**: Visual analysis showing matched vs. missing skills with percentage indicators
- **Personalized Learning Roadmap**: Step-by-step timeline with course recommendations
- **AI Career Assistant**: Integrated Gemini-powered chat for resume feedback, interview prep, and career guidance
- **Responsive Design**: Material-Design inspired UI with clean card layouts
- **Real-time Updates**: Instant skill extraction and analysis feedback

## 📋 Tech Stack

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React PDF** - PDF handling
- **Chart.js/React Circular Progressbar** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Google Generative AI** - Gemini API for AI features
- **pdfjs-dist** - PDF text extraction

### AI Integration
- **Google Gemini Free API** - AI-powered assistance

## 📁 Project Structure

```
Student_Skill_Gap_Analyzer/
├── frontend/              # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.js
│   └── package.json
├── backend/               # Node.js/Express API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   └── server.js
├── database/              # Database schemas
│   └── schema.sql
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skill_gap_analyzer
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run migrations:
```bash
npm run migrate
```

Start backend:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application runs at `http://localhost:3000`

## 📊 Database Schema

Key tables:
- **users** - User accounts with auth info
- **profiles** - User profile data
- **resumes** - Uploaded resumes and extracted skills
- **job_roles** - Available job positions
- **courses** - Learning resources
- **learning_roadmaps** - Personalized learning paths
- **chat_history** - AI assistant conversations

## 🔑 Key API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes/:id` - Get resume details
- `POST /api/analysis/gap` - Get skill gap analysis
- `GET /api/job-roles` - Get available job roles
- `GET /api/roadmap/:userId` - Get learning roadmap
- `POST /api/chat` - Send message to AI assistant

## 🎨 Design Features

- Material-Design inspired with professional color palette
- Card-based layouts for organized content
- Responsive breakpoints for mobile/tablet/desktop
- Progress bars for skill match percentage
- Circular indicators for visual engagement
- Timeline component for learning roadmap
- Clean typography and spacing

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- File upload validation
- SQL injection prevention
- CORS enabled

## 📝 Environment Variables

See `.env.example` in both frontend and backend directories for complete configuration options.

## 🔗 Integration with Google Gemini

The application uses Google Gemini Free API for:
- Resume analysis and feedback
- Interview question generation
- Project recommendation suggestions
- Career path guidance
- Skill improvement tips

## 📱 Responsive Breakpoints

- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

## 🛠️ Development

```bash
# Backend development server with hot reload
cd backend && npm run dev

# Frontend development server
cd frontend && npm start
```

## 📦 Production Build

```bash
# Frontend build
cd frontend && npm run build

# Backend ready for deployment
cd backend && npm run build
```

## 📄 License

This project is provided as a prototype for educational purposes.

## 📧 Support

For issues, questions, or contributions, please refer to the project documentation.

---

**Note**: This is a prototype designed for educational purposes. Ensure proper security practices before deploying to production.

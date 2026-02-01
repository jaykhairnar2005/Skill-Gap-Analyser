# AI Student Skill Gap Analyzer - Developer Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React.js)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Pages: Login, Register, Dashboard, Profile          │  │
│  │  Components: Upload, Analysis, Roadmap, Assistant    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Axios)
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express.js)                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Routes: Auth, Resumes, Analysis, Chat, Roadmap      │  │
│  │  Controllers: Business logic & API endpoints         │  │
│  │  Middleware: Auth, Error handling                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (pg)
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL Database                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Users, Profiles, Resumes, Skills, Roadmaps, etc     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── Dashboard.js
│   │   └── ProfilePage.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── ResumeUpload.js
│   │   ├── SkillExtraction.js
│   │   ├── SkillGapAnalysis.js
│   │   ├── LearningRoadmap.js
│   │   └── AIAssistant.js
│   ├── services/
│   │   └── api.js (Axios instance)
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
└── package.json
```

## Backend Structure

```
backend/
├── routes/
│   ├── auth.js
│   ├── resumes.js
│   ├── analysis.js
│   ├── jobRoles.js
│   ├── chat.js
│   ├── skills.js
│   └── roadmap.js
├── middleware/
│   └── auth.js
├── uploads/
│   └── (resume files stored here)
├── server.js
├── package.json
└── .env.example
```

## Key Features Implementation

### 1. Secure Authentication
- **JWT Tokens**: Generate and validate tokens
- **Password Hashing**: bcryptjs for secure storage
- **Protected Routes**: Middleware-based route protection

### 2. PDF Resume Processing
- **Multer**: File upload handling
- **PDF Parser**: Extract text from PDF files
- **Skill Extraction**: Regex and keyword matching

### 3. Skill Gap Analysis
- **Comparison Engine**: Match user skills with job requirements
- **Progress Calculation**: Percentage matching algorithm
- **Database Caching**: Store analysis results for history

### 4. Learning Roadmap Generation
- **Auto-generation**: Create steps based on missing skills
- **Timeline Calculation**: Estimate completion dates
- **Course Mapping**: Link skills to recommended courses

### 5. AI Assistant Integration
- **Google Gemini API**: AI-powered responses
- **Context Switching**: Different prompts for different contexts
- **Chat History**: Store conversations for user reference

## Technology Decisions

### Why React.js?
- Component-based architecture
- Large ecosystem and community
- Material-UI integration
- Strong TypeScript support

### Why Node.js/Express?
- JavaScript fullstack
- Lightweight and fast
- Excellent middleware support
- Easy to deploy

### Why PostgreSQL?
- ACID compliance
- Complex queries support
- Excellent indexing
- Array data type for skills

### Why Material-UI?
- Professional design system
- Responsive components
- Consistent theming
- Accessibility features

## Data Flow Examples

### Resume Upload Flow
```
User selects PDF
    ↓
React FormData
    ↓
Multer stores file
    ↓
PDF Parser extracts text
    ↓
Skill extractor (regex/keywords)
    ↓
Save to database (resumes table)
    ↓
Add skills to user_skills table
    ↓
Display extracted skills to user
```

### Skill Gap Analysis Flow
```
User selects job role
    ↓
Fetch job role required skills
    ↓
Fetch user's current skills
    ↓
Compare: matched vs missing
    ↓
Calculate percentage
    ↓
Save analysis result
    ↓
Display with visualizations
```

### Learning Roadmap Flow
```
User initiates roadmap creation
    ↓
Get job role required skills
    ↓
For each missing skill:
    - Create roadmap step
    - Find recommended course
    - Set timeline
    ↓
Save to database
    ↓
Display as timeline
```

## Common Patterns

### Error Handling
```javascript
try {
    // API call
} catch (error) {
    // Handle error
    res.status(500).json({ error: 'Detailed message' });
}
```

### Authentication
```javascript
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };
```

### Component State Management
```javascript
const [state, setState] = useState(initialValue);
useEffect(() => { fetchData(); }, []);
```

## Database Relationships

```
users (1) ─→ (many) user_profiles
users (1) ─→ (many) resumes
users (1) ─→ (many) user_skills
users (1) ─→ (many) skill_gap_analysis
users (1) ─→ (many) learning_roadmaps
users (1) ─→ (many) chat_history

skills (1) ─→ (many) user_skills
skills (1) ─→ (many) courses
skills (1) ─→ (many) roadmap_steps

job_roles (1) ─→ (many) skill_gap_analysis
job_roles (1) ─→ (many) learning_roadmaps

learning_roadmaps (1) ─→ (many) roadmap_steps

courses (1) ─→ (many) roadmap_steps
```

## Testing Checklist

### Frontend
- [ ] Login/Registration flow
- [ ] Resume upload functionality
- [ ] Skill extraction display
- [ ] Skill gap analysis
- [ ] Learning roadmap navigation
- [ ] AI chat functionality
- [ ] Profile management
- [ ] Responsive design on mobile

### Backend
- [ ] Auth endpoints
- [ ] Resume upload & processing
- [ ] Database queries
- [ ] Error handling
- [ ] AI API integration
- [ ] CORS headers

### Database
- [ ] All tables created
- [ ] Indexes working
- [ ] Sample data inserted
- [ ] Foreign keys enforced

## Performance Optimization Tips

1. **Database Queries**: Use indexes, avoid N+1 queries
2. **Frontend Rendering**: Memoize components, lazy load
3. **API Calls**: Cache results, pagination
4. **File Uploads**: Compress before upload, validate size

## Security Checklist

- [ ] JWT secrets stored in .env
- [ ] Password hashing implemented
- [ ] SQL injection prevention
- [ ] CORS properly configured
- [ ] File upload validation
- [ ] Input sanitization
- [ ] HTTPS in production

---

**Last Updated**: January 2025

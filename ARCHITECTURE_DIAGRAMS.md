# System Architecture & Workflow Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT SIDE (Browser)                      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              React.js Frontend Application                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │  │
│  │  │  Login/Reg  │  │  Dashboard   │  │  Components         │ │  │
│  │  │             │→ │  (Tab Based) │→ │  - Resume Upload    │ │  │
│  │  │ JWT Token   │  │              │  │  - Skill Analysis   │ │  │
│  │  │ Storage     │  │              │  │  - Learning Path    │ │  │
│  │  │             │  │              │  │  - AI Chat          │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────────┘ │  │
│  │                                                               │  │
│  │                   Material-UI Components                      │  │
│  │               Responsive Design (Mobile/Tablet/Desktop)      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                  ↓                                  │
│                          Axios HTTP Client                          │
│                                  ↓                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
          ┌─────────────────────────────────────────────┐
          │         HTTP/REST API (Port 5000)           │
          │                                             │
          │  Bearer Token in Authorization Header       │
          │  JSON Request/Response Bodies               │
          └─────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVER SIDE (Backend)                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           Express.js API Server (Node.js)                    │  │
│  │                                                               │  │
│  │  Route Handlers:                                              │  │
│  │  ├─ POST /auth/register, /auth/login (JWT Generation)       │  │
│  │  ├─ POST /resumes/upload (Multer + PDF Processing)          │  │
│  │  ├─ POST /analysis/gap (Skill Comparison Engine)            │  │
│  │  ├─ GET /job-roles (Database Query)                         │  │
│  │  ├─ POST /chat/message (Gemini API Call)                    │  │
│  │  ├─ GET /skills (Skill Catalog)                             │  │
│  │  └─ POST /roadmap (Auto-generation Engine)                  │  │
│  │                                                               │  │
│  │  Middleware:                                                  │  │
│  │  ├─ JWT Verification                                         │  │
│  │  ├─ Error Handling                                           │  │
│  │  └─ CORS Management                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                          ↓         ↓                                │
│  ┌────────────────────────┐   ┌──────────────────────────────────┐ │
│  │    PostgreSQL DB       │   │  External APIs                   │ │
│  │  (SQL Queries)         │   │  ├─ Google Gemini API           │ │
│  │  13 Tables + Indexes   │   │  └─ PDF Processing Service      │ │
│  │  Data Persistence      │   └──────────────────────────────────┘ │
│  └────────────────────────┘                                        │
│                                                                     │
│  File Storage:                                                      │
│  └─ /uploads directory (Resume PDFs)                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Data Flow: Resume Upload & Skill Extraction

```
User selects PDF file
         ↓
[ResumeUpload Component]
    ↓
File validation (PDF, size < 10MB)
    ↓
FormData with file
    ↓
POST /api/resumes/upload
    ↓
[Multer Middleware]
    ├─ Store file in /uploads
    └─ Get file path
    ↓
[PDF Parsing]
    ├─ Extract text from PDF (pdfjs-dist)
    └─ Get resume content
    ↓
[Skill Extraction Engine]
    ├─ Regex pattern matching
    ├─ Keyword matching
    └─ Get skills array
    ↓
[Database Operations]
    ├─ INSERT into resumes table
    └─ INSERT/UPDATE into user_skills table
    ↓
API Response with extracted skills
    ↓
[Frontend Display]
    ├─ Show skills as chips
    ├─ Categorize skills
    └─ Enable analysis
```

## 3. Data Flow: Skill Gap Analysis

```
User selects job role
         ↓
[SkillGapAnalysis Component]
    ↓
Click "Analyze Gap"
    ↓
POST /api/analysis/gap
    ↓
[Backend Processing]
    ├─ Fetch job role required skills
    ├─ Fetch user's current skills
    └─ Fetch user's skill proficiency levels
    ↓
[Comparison Engine]
    ├─ For each required skill:
    │  ├─ Check if user has it
    │  ├─ If yes → matchedSkills array
    │  └─ If no → missingSkills array
    ├─ Calculate: (matched / total) * 100
    └─ Result: Match percentage
    ↓
[Database]
    └─ INSERT into skill_gap_analysis table
    ↓
API Response with:
    ├─ Matched skills (green chips)
    ├─ Missing skills (red chips)
    ├─ Match percentage (progress bar)
    └─ Statistics
    ↓
[Frontend Visualization]
    ├─ Display progress bar
    ├─ Show skill categories
    └─ Enable roadmap creation
```

## 4. Data Flow: Learning Roadmap Generation

```
User clicks "Create Roadmap"
         ↓
[LearningRoadmap Component]
    ↓
POST /api/roadmap
    ↓
[Roadmap Generation Engine]
    ├─ Get job role details
    ├─ Get required skills
    ├─ Get user's current skills
    ├─ Identify missing skills
    └─ Sort by priority
    ↓
For each missing skill:
    ├─ Create roadmap_step
    ├─ Find best course (sorted by rating)
    ├─ Calculate duration (skill difficulty × learning time)
    ├─ Set estimated completion date
    └─ INSERT into database
    ↓
Timeline Calculation:
    ├─ Total weeks = user preference (default 12)
    ├─ Distribute weeks across skills
    ├─ Calculate milestones
    └─ Set deadlines
    ↓
[Database]
    ├─ INSERT learning_roadmap
    └─ INSERT multiple roadmap_steps
    ↓
API Response with:
    ├─ Roadmap ID
    ├─ Timeline weeks
    ├─ Estimated completion date
    └─ Step count
    ↓
[Frontend Stepper Component]
    ├─ Display timeline
    ├─ Show course links
    ├─ Enable progress tracking
    └─ Allow marking steps complete
```

## 5. Data Flow: AI Chat (Gemini Integration)

```
User types message
         ↓
[AIAssistant Component]
    ├─ Select context (resume_feedback, interview_prep, etc.)
    ├─ Attach resume content (optional)
    └─ Build request payload
    ↓
POST /api/chat/message
    ↓
[Chat Route Handler]
    ├─ Build context-aware prompt
    ├─ Add system instructions based on context
    ├─ Prepare message with resume content
    └─ Create request for Gemini API
    ↓
[Google Generative AI (Gemini)]
    ├─ Receive prompt
    ├─ Generate response
    └─ Return text
    ↓
[Backend Processing]
    ├─ Receive AI response
    ├─ INSERT into chat_history table
    └─ Prepare response
    ↓
API Response with:
    ├─ User message
    ├─ AI response
    ├─ Context type
    └─ Timestamp
    ↓
[Frontend Chat Display]
    ├─ Add message to chat history
    ├─ Display with appropriate styling
    ├─ Scroll to bottom
    └─ Enable new messages
```

## 6. Authentication Flow

```
User Registration
    ├─ POST /auth/register with email/password/name
    ├─ Hash password with bcryptjs
    ├─ INSERT into users table
    ├─ CREATE user_profile & preferences
    ├─ Generate JWT token
    └─ Return token + user data
        ↓
User Login
    ├─ POST /auth/login with email/password
    ├─ Query users table
    ├─ Compare password with hash (bcryptjs)
    ├─ If valid: Generate JWT token
    └─ Return token + user data
        ↓
Protected Requests
    ├─ Store token in localStorage (frontend)
    ├─ Include in Authorization header
    ├─ Backend JWT middleware verifies
    ├─ If valid: Continue request
    └─ If invalid: Return 401 Unauthorized
        ↓
Token Expiry
    ├─ Token expires in 7 days
    ├─ User must re-login
    ├─ New token issued
    └─ Token refreshed in localStorage
```

## 7. Database Entity Relationships

```
┌─────────────────┐
│     users       │ (Primary)
│                 │
│ id (PK)         │
│ email           │
│ password_hash   │
│ first_name      │
│ last_name       │
│ created_at      │
└────┬────────────┘
     │ 1:1
     ├──→ user_profiles (phone, bio, role, university)
     │ 1:many
     ├──→ resumes (file_name, extracted_skills)
     │ 1:many
     ├──→ user_skills (skill_id, proficiency_level)
     │ 1:many
     ├──→ skill_gap_analysis (matched_skills, missing_skills)
     │ 1:many
     ├──→ learning_roadmaps (job_role_id, timeline)
     │ 1:many
     ├──→ chat_history (user_message, ai_response)
     │ 1:1
     └──→ user_preferences (theme, notifications)

┌─────────────────┐
│     skills      │
│                 │
│ id (PK)         │
│ name            │
│ category        │
└────┬────────────┘
     │ 1:many
     ├──→ user_skills (many users)
     │ 1:many
     ├──→ courses (learning resources)
     │ 1:many
     └──→ roadmap_steps (milestones)

┌─────────────────┐
│    job_roles    │
│                 │
│ id (PK)         │
│ title           │
│ required_skills │
└────┬────────────┘
     │ 1:many
     ├──→ skill_gap_analysis
     │ 1:many
     └──→ learning_roadmaps
```

## 8. API Request/Response Cycle

```
Client                     Server                    Database

POST /auth/login
  ├─ email
  └─ password
    ↓
                   Route Handler
                   ├─ Query users table
                   ├─ Hash comparison
                   ├─ Generate JWT
                   └─ Prepare response
                    ↓
                   Database Query
                   ├─ SELECT * FROM users WHERE email = ?
                   └─ Return user record
    ↓
  Response
  ├─ token (JWT)
  ├─ user data
  └─ 200 OK
    ↓
Store token
    ↓
Include in next request
  ├─ Authorization: Bearer <token>
  └─ Other headers & body
    ↓
                   JWT Middleware
                   ├─ Verify token
                   ├─ Decode user ID
                   └─ Attach to request
    ↓
                   Route Handler
                   ├─ Access req.user.userId
                   ├─ Query/Insert/Update
                   └─ Prepare response
                    ↓
                   Database Operation
                   ├─ SELECT/INSERT/UPDATE
                   └─ Return result
    ↓
  Response
  ├─ Data
  └─ 200/201/400/500
```

## 9. Component Communication Flow

```
┌─────────────────┐
│   LoginPage     │ ← User enters credentials
└────────┬────────┘
         │
         ├─→ Call onLogin(token, user)
         │
         ↓
    ┌─────────────┐
    │   App.js    │ ← Stores auth state
    └────────┬────┘
             │
             ├─→ Set isAuthenticated = true
             ├─→ Store token in localStorage
             └─→ Navigate to /dashboard
                 │
                 ↓
        ┌──────────────────┐
        │   Dashboard      │ ← Main hub
        └────────┬─────────┘
                 │
        ┌────────┴────────┬────────────┬──────────────┐
        │                 │            │              │
        ↓                 ↓            ↓              ↓
    ResumeUpload    SkillExtraction  SkillGap     LearningRoadmap
        │                 │            │              │
        └─────────────────┼────────────┼──────────────┘
                          │
                          ↓
                    AIAssistant
                          │
                          ↓
                   ProfilePage
                   (via Navbar)
```

## 10. Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Production Environment                 │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │           Frontend Deployment                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Vercel/Netlify CDN                          │  │  │
│  │  │  - Static files (JS, CSS, HTML)              │  │  │
│  │  │  - Automatic HTTPS                           │  │  │
│  │  │  - Global edge servers                       │  │  │
│  │  │  - Automatic deployments from Git            │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                          ↓ HTTPS                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │           Backend Deployment                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Heroku/Railway/Digital Ocean               │  │  │
│  │  │  - Node.js runtime                           │  │  │
│  │  │  - Environment variables from .env           │  │  │
│  │  │  - Automatic scaling                         │  │  │
│  │  │  - SSL certificates                          │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                          ↓ TCP Port 5432                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │           Database Deployment                     │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Managed PostgreSQL                         │  │  │
│  │  │  - Cloud provider (AWS RDS, Heroku, etc.)   │  │  │
│  │  │  - Automated backups                        │  │  │
│  │  │  - SSL connections                          │  │  │
│  │  │  - High availability                        │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

**Note**: These diagrams are conceptual representations of the system flow and architecture. Actual implementation may have additional complexity and optimization layers.

**Last Updated**: January 21, 2025

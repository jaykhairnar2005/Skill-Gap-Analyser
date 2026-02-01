# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
    "email": "student@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
}
```

**Response (201):**
```json
{
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "email": "student@example.com",
        "firstName": "John"
    }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
    "email": "student@example.com",
    "password": "securePassword123"
}
```

**Response (200):**
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "email": "student@example.com",
        "firstName": "John"
    }
}
```

---

### Get User Profile
**GET** `/auth/profile`

Retrieve current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "id": 1,
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "bio": "Computer Science student",
    "experience_level": "intermediate",
    "target_role": "Full Stack Developer",
    "profile_picture_url": "..."
}
```

---

### Update User Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Computer Science student",
    "experienceLevel": "intermediate",
    "targetRole": "Full Stack Developer"
}
```

**Response (200):**
```json
{
    "message": "Profile updated successfully"
}
```

---

## Resume Endpoints

### Upload Resume
**POST** `/resumes/upload`

Upload a PDF resume and extract skills.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `resume`: PDF file (max 10MB)

**Response (201):**
```json
{
    "message": "Resume uploaded successfully",
    "resume": {
        "id": 1,
        "fileName": "resume.pdf",
        "extractedSkills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
        "uploadDate": "2025-01-21T10:30:00Z"
    }
}
```

---

### Get All Resumes
**GET** `/resumes`

Retrieve all user's uploaded resumes.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "id": 1,
        "file_name": "resume.pdf",
        "extracted_skills": ["JavaScript", "React", "Node.js"],
        "upload_date": "2025-01-21T10:30:00Z"
    }
]
```

---

### Get Specific Resume
**GET** `/resumes/:resumeId`

Retrieve details of a specific resume.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "id": 1,
    "file_name": "resume.pdf",
    "extracted_skills": ["JavaScript", "React"],
    "extracted_text": "Full text of resume...",
    "upload_date": "2025-01-21T10:30:00Z"
}
```

---

## Analysis Endpoints

### Perform Skill Gap Analysis
**POST** `/analysis/gap`

Analyze skill gap for a specific job role.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "jobRoleId": 1
}
```

**Response (200):**
```json
{
    "jobRole": {
        "id": 1,
        "title": "Full Stack Developer"
    },
    "analysis": {
        "matchedSkills": ["JavaScript", "React", "PostgreSQL"],
        "missingSkills": ["Docker", "AWS", "Kubernetes"],
        "matchPercentage": 65,
        "totalSkillsRequired": 6,
        "skillsMatched": 3
    }
}
```

---

### Get Analysis History
**GET** `/analysis/history`

Retrieve past skill gap analyses.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "id": 1,
        "job_role_title": "Full Stack Developer",
        "matched_skills": ["JavaScript", "React"],
        "missing_skills": ["Docker"],
        "match_percentage": 70,
        "analysis_date": "2025-01-21T10:30:00Z"
    }
]
```

---

## Job Role Endpoints

### Get All Job Roles
**GET** `/job-roles`

Retrieve all available job roles.

**Response (200):**
```json
[
    {
        "id": 1,
        "title": "Full Stack Developer",
        "description": "Build end-to-end web applications",
        "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
        "experience_level": "intermediate",
        "salary_range": "60000-100000"
    }
]
```

---

### Get Specific Job Role
**GET** `/job-roles/:id`

Retrieve details of a specific job role.

**Response (200):**
```json
{
    "id": 1,
    "title": "Full Stack Developer",
    "description": "Build end-to-end web applications",
    "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
    "experience_level": "intermediate",
    "salary_range": "60000-100000"
}
```

---

## Chat Endpoints

### Send Message to AI Assistant
**POST** `/chat/message`

Send a message to the AI career assistant powered by Gemini.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "message": "How can I improve my resume?",
    "context": "resume_feedback",
    "resumeContent": "Optional: Full resume text"
}
```

**Context Types:**
- `general`: General career questions
- `resume_feedback`: Resume improvement advice
- `interview_prep`: Interview preparation
- `project_ideas`: Project recommendation
- `career_planning`: Career path guidance

**Response (200):**
```json
{
    "userMessage": "How can I improve my resume?",
    "aiResponse": "Your resume can be improved by...",
    "context": "resume_feedback",
    "timestamp": "2025-01-21T10:30:00Z"
}
```

---

### Get Chat History
**GET** `/chat/history`

Retrieve past conversations with AI assistant.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "user_message": "How can I improve my resume?",
        "ai_response": "Your resume can be improved by...",
        "context": "resume_feedback",
        "created_at": "2025-01-21T10:30:00Z"
    }
]
```

---

## Skills Endpoints

### Get All Skills
**GET** `/skills`

Retrieve all available skills from the database.

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "JavaScript",
        "category": "programming"
    },
    {
        "id": 2,
        "name": "React",
        "category": "frontend"
    }
]
```

---

### Get Skills by Category
**GET** `/skills/category/:category`

Retrieve skills filtered by category.

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "JavaScript",
        "category": "programming"
    }
]
```

---

## Learning Roadmap Endpoints

### Create Learning Roadmap
**POST** `/roadmap`

Create a personalized learning roadmap for a job role.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "jobRoleId": 1,
    "timelineWeeks": 12
}
```

**Response (201):**
```json
{
    "message": "Learning roadmap created successfully",
    "roadmap": {
        "id": 1,
        "title": "Roadmap to Full Stack Developer",
        "timelineWeeks": 12,
        "estimatedCompletionDate": "2025-04-21",
        "progressPercentage": 0
    }
}
```

---

### Get User's Roadmaps
**GET** `/roadmap`

Retrieve all active learning roadmaps.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
    {
        "id": 1,
        "title": "Roadmap to Full Stack Developer",
        "timeline_weeks": 12,
        "estimated_completion_date": "2025-04-21",
        "progress_percentage": 25,
        "status": "active",
        "created_at": "2025-01-21T10:30:00Z"
    }
]
```

---

### Get Roadmap Details
**GET** `/roadmap/:roadmapId`

Retrieve detailed roadmap with all steps.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "id": 1,
    "title": "Roadmap to Full Stack Developer",
    "timeline_weeks": 12,
    "estimated_completion_date": "2025-04-21",
    "progress_percentage": 25,
    "status": "active",
    "steps": [
        {
            "id": 1,
            "step_number": 1,
            "title": "Master JavaScript",
            "description": "Learn and practice JavaScript",
            "duration_days": 21,
            "completed": false,
            "skill_name": "JavaScript",
            "course_title": "Complete JavaScript Course",
            "course_url": "https://..."
        }
    ]
}
```

---

### Mark Step as Completed
**PUT** `/roadmap/step/:stepId/complete`

Mark a roadmap step as completed.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
    "message": "Step marked as completed",
    "step": {
        "id": 1,
        "completed": true
    }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
    "error": "Invalid token"
}
```

### 404 Not Found
```json
{
    "error": "Resource not found"
}
```

### 409 Conflict
```json
{
    "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
    "error": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS Headers

Allowed origins in development:
- `http://localhost:3000`
- `http://localhost:5000`

---

## Health Check

**GET** `/health`

Check if API is running.

**Response (200):**
```json
{
    "status": "API is running"
}
```

---

**Last Updated**: January 2025

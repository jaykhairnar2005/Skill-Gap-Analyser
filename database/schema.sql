-- PostgreSQL Database Schema for Student Skill Gap Analyzer

-- Create Database
CREATE DATABASE skill_gap_analyzer;

\c skill_gap_analyzer

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    bio TEXT,
    experience_level VARCHAR(50), -- beginner, intermediate, advanced
    target_role VARCHAR(100),
    graduation_year INTEGER,
    university VARCHAR(255),
    profile_picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Roles
CREATE TABLE job_roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills TEXT[], -- Array of skill names
    experience_level VARCHAR(50),
    salary_range VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    extracted_skills TEXT[], -- Array of extracted skills
    extracted_text TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Database
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- programming, databases, soft-skills, tools, etc.
    proficiency_levels TEXT[], -- beginner, intermediate, advanced
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Skills
CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50), -- beginner, intermediate, advanced
    years_of_experience DECIMAL(3,1),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- Skill Gap Analysis
CREATE TABLE skill_gap_analysis (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_role_id INTEGER NOT NULL REFERENCES job_roles(id),
    matched_skills TEXT[], -- Array of matched skills
    missing_skills TEXT[], -- Array of missing skills
    match_percentage DECIMAL(5,2),
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_analysis UNIQUE(user_id, job_role_id, analysis_date)
);

-- Courses
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skill_id INTEGER REFERENCES skills(id),
    provider VARCHAR(100), -- Coursera, Udemy, etc.
    url VARCHAR(500),
    duration_hours INTEGER,
    difficulty_level VARCHAR(50),
    rating DECIMAL(3,2),
    cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Roadmaps
CREATE TABLE learning_roadmaps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_role_id INTEGER NOT NULL REFERENCES job_roles(id),
    title VARCHAR(255),
    description TEXT,
    timeline_weeks INTEGER,
    estimated_completion_date DATE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, paused
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roadmap Steps/Milestones
CREATE TABLE roadmap_steps (
    id SERIAL PRIMARY KEY,
    roadmap_id INTEGER NOT NULL REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    skill_id INTEGER REFERENCES skills(id),
    course_id INTEGER REFERENCES courses(id),
    duration_days INTEGER,
    order_sequence INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    completed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat History
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id VARCHAR(100),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context VARCHAR(50), -- resume_feedback, interview_prep, project_ideas, career_planning
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light', -- light, dark
    language VARCHAR(20) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_skill_gap_user_id ON skill_gap_analysis(user_id);
CREATE INDEX idx_learning_roadmaps_user_id ON learning_roadmaps(user_id);
CREATE INDEX idx_roadmap_steps_roadmap_id ON roadmap_steps(roadmap_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);

-- Insert sample job roles
INSERT INTO job_roles (title, description, required_skills, experience_level, salary_range) VALUES
('Full Stack Developer', 'Build end-to-end web applications', '{"JavaScript", "React", "Node.js", "PostgreSQL", "HTML", "CSS"}', 'intermediate', '60000-100000'),
('Data Science Engineer', 'Analyze data and build ML models', '{"Python", "Machine Learning", "SQL", "Pandas", "Scikit-learn", "Statistics"}', 'intermediate', '70000-120000'),
('Cloud Infrastructure Engineer', 'Design and manage cloud systems', '{"AWS", "Docker", "Kubernetes", "Linux", "DevOps", "CI/CD"}', 'intermediate', '75000-130000'),
('Mobile App Developer', 'Develop iOS and Android applications', '{"React Native", "Swift", "Kotlin", "Mobile UI", "API Integration"}', 'intermediate', '65000-110000'),
('Machine Learning Engineer', 'Develop AI and ML solutions', '{"Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Computer Vision"}', 'advanced', '80000-150000');

-- Insert sample skills
INSERT INTO skills (name, category, proficiency_levels) VALUES
('JavaScript', 'programming', '{"beginner", "intermediate", "advanced"}'),
('Python', 'programming', '{"beginner", "intermediate", "advanced"}'),
('React', 'frontend', '{"beginner", "intermediate", "advanced"}'),
('Node.js', 'backend', '{"beginner", "intermediate", "advanced"}'),
('PostgreSQL', 'databases', '{"beginner", "intermediate", "advanced"}'),
('SQL', 'databases', '{"beginner", "intermediate", "advanced"}'),
('AWS', 'cloud', '{"beginner", "intermediate", "advanced"}'),
('Docker', 'devops', '{"beginner", "intermediate", "advanced"}'),
('Git', 'tools', '{"beginner", "intermediate", "advanced"}'),
('REST APIs', 'backend', '{"beginner", "intermediate", "advanced"}'),
('HTML', 'frontend', '{"beginner", "intermediate", "advanced"}'),
('CSS', 'frontend', '{"beginner", "intermediate", "advanced"}'),
('Machine Learning', 'ai', '{"beginner", "intermediate", "advanced"}'),
('TensorFlow', 'ai', '{"beginner", "intermediate", "advanced"}'),
('Communication', 'soft-skills', '{"beginner", "intermediate", "advanced"}'),
('Problem Solving', 'soft-skills', '{"beginner", "intermediate", "advanced"}'),
('Team Collaboration', 'soft-skills', '{"beginner", "intermediate", "advanced"}');

-- Insert sample courses
INSERT INTO courses (title, description, skill_id, provider, url, duration_hours, difficulty_level, rating, cost) VALUES
('React - The Complete Guide', 'Master React with projects and hooks', 3, 'Udemy', 'https://udemy.com/react', 40, 'intermediate', 4.8, 99.99),
('Python for Data Science', 'Learn data analysis with Python', 2, 'Coursera', 'https://coursera.org/python', 30, 'intermediate', 4.7, 49.99),
('AWS Certified Solutions Architect', 'AWS cloud certification prep', 7, 'A Cloud Guru', 'https://acloud.guru/aws', 50, 'advanced', 4.9, 199.99),
('Docker & Kubernetes Masterclass', 'Container orchestration guide', 8, 'Udemy', 'https://udemy.com/docker', 35, 'intermediate', 4.8, 89.99),
('SQL Fundamentals', 'Master SQL database queries', 6, 'DataCamp', 'https://datacamp.com/sql', 20, 'beginner', 4.6, 29.99);

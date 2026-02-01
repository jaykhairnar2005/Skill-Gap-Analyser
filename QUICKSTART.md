# Quick Start Guide (5 Minutes)

## 1️⃣ Prerequisites Check

Make sure you have installed:
- ✅ Node.js v14+ (`node --version`)
- ✅ PostgreSQL v12+ (`psql --version`)
- ✅ npm/yarn
- ✅ Google Gemini API Key

## 2️⃣ Database Setup (2 minutes)

### Open PostgreSQL
```bash
# On Windows
psql -U postgres

# On Mac/Linux
sudo -u postgres psql
```

### Create Database
```sql
CREATE DATABASE skill_gap_analyzer;
\c skill_gap_analyzer
```

### Run Schema
```bash
# Exit psql first (\q)
psql -U postgres -d skill_gap_analyzer -f database/schema.sql
```

## 3️⃣ Backend Setup (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Copy from .env.example and fill in:
# - DB credentials
# - JWT_SECRET (any random string)
# - GEMINI_API_KEY (from Google)

# Start server
npm start
# Server runs at http://localhost:5000
```

## 4️⃣ Frontend Setup (1 minute)

### New Terminal
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# App opens at http://localhost:3000
```

## 5️⃣ Test the Application

1. **Register** - Create a new account
2. **Upload Resume** - Click "Resume Upload" and upload a PDF
3. **View Skills** - See extracted skills from resume
4. **Analyze Gap** - Select a job role and click "Analyze Gap"
5. **Create Roadmap** - Generate learning path
6. **Chat with AI** - Try different contexts in AI Assistant

## 🎯 Default Test Credentials

After database setup, you can use:
- **Email**: test@example.com
- **Password**: password123

(Create account via registration form)

## 📊 Sample Job Roles Available

1. Full Stack Developer
2. Data Science Engineer
3. Cloud Infrastructure Engineer
4. Mobile App Developer
5. Machine Learning Engineer

## 🔑 API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
    "status": "API is running"
}
```

## 🐛 Troubleshooting

### Port 5000 already in use?
```bash
# Find process on port 5000
lsof -i :5000

# Kill it (macOS/Linux)
kill -9 <PID>
```

### Port 3000 already in use?
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Database connection error?
- Verify PostgreSQL is running
- Check `.env` credentials match your setup
- Verify database was created: `psql -l`

### API not responding?
- Ensure backend is running: `npm start` in `/backend`
- Check terminal for error messages
- Verify environment variables in `.env`

### AI chat not working?
- Check if GEMINI_API_KEY is set correctly
- Verify API key is valid and not revoked
- Check internet connection

## 📱 UI Navigation

### Dashboard Tabs
1. **Resume Upload** - Upload and view skills
2. **Skill Analysis** - Check skill gaps
3. **Learning Roadmap** - View learning path
4. **AI Career Assistant** - Chat with AI

### Profile Menu
- Click your avatar in top-right
- Update profile information
- View login status
- Logout

## 💡 Example Workflow

```
1. Register/Login
   ↓
2. Upload your resume (PDF)
   ↓
3. View automatically extracted skills
   ↓
4. Select a target job role (e.g., "Full Stack Developer")
   ↓
5. Click "Analyze Gap" to see matched vs. missing skills
   ↓
6. View personalized learning roadmap with course recommendations
   ↓
7. Chat with AI for resume feedback and career advice
   ↓
8. Mark roadmap steps as you complete courses
```

## 🚀 Next Steps

### For Development
- [ ] Review SETUP.md for detailed configuration
- [ ] Read API_DOCUMENTATION.md for API details
- [ ] Check DEVELOPER_GUIDE.md for architecture
- [ ] Review UI_COMPONENTS.md for design system

### For Deployment
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Heroku/Railway
- [ ] Set production environment variables
- [ ] Configure custom domain
- [ ] Enable HTTPS

### For Enhancement
- [ ] Add real-time notifications
- [ ] Implement project showcase
- [ ] Integrate job board
- [ ] Add mentor matching
- [ ] Create mobile app version

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm start` | Start application |
| `npm run dev` | Development mode with hot reload |
| `npm run build` | Build for production |
| `psql -U postgres` | Access PostgreSQL |
| `curl http://localhost:5000/api/health` | Test API |

## ✅ Checklist Before Using

- [ ] PostgreSQL installed and running
- [ ] Database `skill_gap_analyzer` created
- [ ] Schema imported via `schema.sql`
- [ ] Backend `.env` file configured
- [ ] Frontend `.env` file configured
- [ ] Google Gemini API key obtained
- [ ] npm dependencies installed (both frontend & backend)
- [ ] Both services started and running

## 🎉 You're Ready!

Once both servers are running:
1. Open browser to http://localhost:3000
2. Register a new account
3. Upload your resume
4. Explore the application!

---

**Questions?** Check the documentation files or the error messages in terminal logs.

**Happy coding!** 🚀

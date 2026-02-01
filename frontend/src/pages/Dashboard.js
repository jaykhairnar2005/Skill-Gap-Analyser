import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

import ResumeUpload from '../components/ResumeUpload';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import LearningRoadmap from '../components/LearningRoadmap';
import AIAssistant from '../components/AIAssistant';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function TabPanel({ children, value, index }) {
  return (
    <div style={{ display: value === index ? 'block' : 'none' }}>
      <Box sx={{ py: 3 }}>{children}</Box>
    </div>
  );
}

export default function Dashboard({ user }) {
  const [tabValue, setTabValue] = useState(0);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn('⚠️ No token found, skipping resume fetch');
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.length > 0) {
        setCurrentResume(res.data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (resume) => {
    setCurrentResume(resume);
    setAnalysisResult(null);
    setSelectedJobRole('');
  };

  const setActiveTab = (tabName) => {
    if (tabName === "roadmap") setTabValue(2);
    if (tabName === "analysis") setTabValue(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, animation: 'fadeInUp 0.8s ease-out' }}>
        <Typography variant="h3" sx={{
          fontWeight: 800,
          display: 'inline-block',
          background: 'linear-gradient(to right, #64ffda 20%, #bd93f9 40%, #64ffda 60%, #bd93f9 80%)',
          backgroundSize: '200% auto',
          color: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          animation: 'shimmer 5s linear infinite',
        }}>
          Here we go, {user?.firstName || 'User'}!
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: '2.5rem',
            display: 'inline-block',
            ml: 2,
            animation: 'wave 2.5s infinite',
            transformOrigin: '70% 70%'
          }}
        >
          👋
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary', fontWeight: 500 }}>
          Your personal AI-powered career launchpad is ready.
        </Typography>
      </Box>

      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Resume Upload" />
          <Tab label="Skill Analysis" />
          <Tab label="Learning Roadmap" />
        </Tabs>

        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                <ResumeUpload onUpload={handleResumeUpload} />
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <SkillGapAnalysis
                  resume={currentResume}
                  selectedJobRole={selectedJobRole}
                  setSelectedJobRole={setSelectedJobRole}
                  analysisResult={analysisResult}
                  setAnalysisResult={setAnalysisResult}
                  setActiveTab={setActiveTab}
                />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <LearningRoadmap selectedJobRole={selectedJobRole} analysisResult={analysisResult} />
              </TabPanel>
            </>
          )}
        </CardContent>
      </Card>

      {/* Floating AI Assistant - Always Present */}
      <AIAssistant
        selectedJobRole={selectedJobRole}
        analysisResult={analysisResult}
        resume={currentResume}
      />
    </Container>
  );
}

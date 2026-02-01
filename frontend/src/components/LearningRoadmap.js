import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip
} from "@mui/material";

const API = "http://localhost:5000/api";

export default function LearningRoadmap({ selectedJobRole, analysisResult }) {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedSkills, setCompletedSkills] = useState([]);

  // Fetch initial progress
  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/analysis/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const completed = res.data.map(item => item.skill_name.toLowerCase());
      setCompletedSkills(completed);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  const handleToggleSkill = async (skillName) => {
    try {
      const token = localStorage.getItem("token");
      const isCompleted = completedSkills.includes(skillName.toLowerCase());
      const newStatus = isCompleted ? 'todo' : 'completed';

      // Optimistic Update
      if (newStatus === 'completed') {
        setCompletedSkills([...completedSkills, skillName.toLowerCase()]);
      } else {
        setCompletedSkills(completedSkills.filter(s => s !== skillName.toLowerCase()));
      }

      await axios.post(
        `${API}/analysis/progress`,
        { skillName, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Re-fetch roadmap to adapt
      if (analysisResult?.missingSkills) {
        fetchRoadmap(analysisResult.missingSkills);
      }

    } catch (err) {
      console.error("Failed to update progress", err);
      fetchProgress(); // Revert on error
    }
  };

  useEffect(() => {
    if (analysisResult?.missingSkills?.length > 0) {
      fetchRoadmap(analysisResult.missingSkills);
    } else {
      setRoadmap([]);
    }
  }, [analysisResult]);

  const fetchRoadmap = async (missingSkills) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Default duration to 4 weeks for now
      const res = await axios.post(
        `${API}/analysis/roadmap`,
        { missingSkills, durationWeeks: 4 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.roadmap) {
        setRoadmap(res.data.roadmap);
      }
    } catch (err) {
      console.error("Failed to load roadmap", err);
    } finally {
      setLoading(false);
    }
  };

  if (!analysisResult) {
    return (
      <Card sx={{ borderRadius: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            Run a Skill Gap Analysis first to generate your roadmap.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (roadmap.length === 0) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">
            🎉 You're all set!
          </Typography>
          <Typography color="text.secondary">
            No missing skills found for this role. You are ready to apply!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Personalized Learning Roadmap for {selectedJobRole}
        </Typography>

        {roadmap.map((step, index) => (
          <Box
            key={index}
            sx={{
              mb: 3,
              p: 3,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.03)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.3)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                Week {step.week}
              </Typography>
              <Box>
                {step.skills.map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{ mr: 1, bgcolor: 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </Box>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {step.title}
            </Typography>

            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              {step.objective}
            </Typography>

            {/* Topics with Checkboxes */}
            {step.topics && step.topics.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#bd93f9' }}>
                  Key Topics & Skills (Mark as Done):
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {step.skills.map((skill, k) => {
                    const isDone = completedSkills.includes(skill.toLowerCase());
                    return (
                      <Box
                        key={k}
                        onClick={() => handleToggleSkill(skill)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          p: 1,
                          borderRadius: 1,
                          border: isDone ? '1px solid #4caf50' : '1px solid rgba(255,255,255,0.2)',
                          bgcolor: isDone ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                          opacity: isDone ? 0.6 : 1
                        }}
                      >
                        <div style={{
                          width: 20, height: 20,
                          borderRadius: '50%',
                          border: '2px solid',
                          borderColor: isDone ? '#4caf50' : '#888',
                          marginRight: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: isDone ? '#4caf50' : 'transparent'
                        }}>
                          {isDone && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
                        </div>
                        <Typography variant="body2" sx={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                          {skill}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: '#b0b0b0' }}>
                    {step.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </Box>
              </Box>
            )}

            {/* Resources */}
            {step.resources && step.resources.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#64ffda' }}>
                  Recommended Resources:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {step.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        color: '#64ffda',
                        fontSize: '0.85rem',
                        border: '1px solid #64ffda',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {res.name} ↗
                    </a>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

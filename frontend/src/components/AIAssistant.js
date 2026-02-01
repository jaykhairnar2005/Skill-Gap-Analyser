import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Divider,
    Fab,
    IconButton,
    Slide,
} from '@mui/material';
import { Send, SmartToy, Person, Close, Chat } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AIAssistant({ resume, selectedJobRole, analysisResult }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Please login to use the AI Assistant.' }]);
                setLoading(false);
                return;
            }

            // ✅ CORRECT ENDPOINT
            const response = await axios.post(
                `${API_URL}/chat`,
                {
                    message: userMessage,
                    context: {
                        jobRole: selectedJobRole,
                        resumeSkills: resume?.skills || [], // Assuming resume object has skills, or we can get from analysisResult
                        missingSkills: analysisResult?.missingSkills || [],
                        roadmap: analysisResult?.roadmap || [] // If available
                    }
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // ✅ CORRECT RESPONSE FIELD
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: response.data.reply }
            ]);

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <Fab
                    color="primary"
                    aria-label="chat"
                    onClick={() => setIsOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(100, 255, 218, 0.7)' },
                            '70%': { transform: 'scale(1.1)', boxShadow: '0 0 0 15px rgba(100, 255, 218, 0)' },
                            '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(100, 255, 218, 0)' },
                        },
                    }}
                >
                    <SmartToy />
                </Fab>
            )}

            {/* Chat Window */}
            <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
                <Card sx={{
                    position: 'fixed',
                    bottom: 90,
                    right: 24,
                    width: 350,
                    height: 500,
                    borderRadius: 4,
                    zIndex: 1000,
                    boxShadow: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SmartToy fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="bold">AI Assistant</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'inherit' }}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Box>

                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflow: 'hidden' }}>
                        <Box sx={{
                            flex: 1,
                            overflowY: 'auto',
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                        }}>
                            {messages.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4, opacity: 0.7 }}>
                                    <SmartToy sx={{ fontSize: 40, color: 'primary.main', mb: 1, opacity: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        Hi! 👋 Ask me about your career path or skills.
                                    </Typography>
                                </Box>
                            ) : (
                                messages.map((msg, idx) => (
                                    <Paper
                                        key={idx}
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            backgroundColor: msg.role === 'user' ? 'primary.light' : 'action.hover',
                                            color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                            borderRadius: 2,
                                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                            maxWidth: '85%',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                            {msg.content}
                                        </Typography>
                                    </Paper>
                                ))
                            )}

                            {loading && (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pl: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="caption" color="text.secondary">AI is typing...</Typography>
                                </Box>
                            )}

                            <div ref={messagesEndRef} />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                fullWidth
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={loading}
                                size="small"
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!input.trim() || loading}
                                size="small"
                            >
                                <Send fontSize="small" />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            </Slide>
        </>
    );
}

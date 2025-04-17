import React, { useState, useRef, useEffect } from 'react';
import { 
  Fab, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, 
  TextField, IconButton, CircularProgress, Typography, useMediaQuery,
  Box, Avatar, LinearProgress
} from '@mui/material';
import { HelpOutline, Send, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { processMessage } from '../services/apiCalls';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 599.95px)');

  const handleOpen = () => {
    setOpen(true);
    if (conversationHistory.length === 0) {
      setConversationHistory([{ 
        role: 'bot', 
        content: 'Hello! I’m your RescueChain Assistant. How can I help you today?' 
      }]);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setConversationHistory([]);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    const userMessage = { role: 'user', content: input };
    setConversationHistory(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const botResponse = await processMessage(input, conversationHistory);
      setConversationHistory(prev => [...prev, botResponse.data]);
    } catch (error) {
      setConversationHistory(prev => [...prev, { 
        role: 'bot', 
        content: 'Error connecting to the server. Please try again.' 
      }]);
    }
    
    setLoading(false);
  };

  // Function to format the raw bot response
  const formatBotResponse = (rawContent) => {
    const lines = rawContent.split('\n\n').filter(line => line.trim() !== '');
    const intro = lines[0];
    const steps = lines.slice(1).map(line => {
      const [title, ...description] = line.split(': ');
      const stepNumber = title.match(/^\d+\./)?.[0] || '';
      const stepTitle = title.replace(stepNumber, '').trim();
      return { number: stepNumber, title: stepTitle, description: description.join(': ') };
    });

    return { intro, steps };
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <Fab
        color="primary"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#1976d2',
          '&:hover': { bgcolor: '#1565c0', transform: 'scale(1.1)' },
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
        }}
      >
        <HelpOutline sx={{ fontSize: 28 }} />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: isMobile ? 0 : '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1976d2',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="/rescuechain-logo.png" sx={{ mr: 2, width: 32, height: 32 }} />
            RescueChain Assistant
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {loading && <LinearProgress />}
          <List
            ref={listRef}
            sx={{
              height: isMobile ? 'calc(100vh - 140px)' : 450,
              overflowY: 'auto',
              bgcolor: 'rgba(245, 245, 245, 0.5)',
              p: 2
            }}
          >
            <AnimatePresence>
              {conversationHistory.map((msg, index) => {
                const isBot = msg.role === 'bot' && typeof msg.content === 'string' && msg.content.includes('\n\n');
                const formattedContent = isBot ? formatBotResponse(msg.content) : null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      sx={{ 
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        mb: 1.5,
                        px: 0 // Remove horizontal padding to allow full-width alignment
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                          maxWidth: '75%', // Limit width for readability
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: msg.role === 'user' ? '#1976d2' : '#f7cc00',
                            mr: msg.role === 'user' ? 1 : 1,
                            ml: msg.role === 'user' ? 0 : 0,
                            width: 36,
                            height: 36
                          }}
                        >
                          {msg.role === 'user' ? 'U' : 'A'}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: msg.role === 'user' ? '#1976d2' : '#666',
                                fontWeight: 500,
                                textAlign: msg.role === 'user' ? 'right' : 'left',
                                display: 'block',
                                mb: 0.5,
                                margin: "8px",
                              }}
                            >
                              {msg.role === 'user' ? 'You' : 'Assistant'}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                bgcolor: msg.role === 'user' ? '#e3f2fd' : '#fff3e0',
                                p: 1.5,
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                display: 'inline-block',
                                maxWidth: '100%',
                                textAlign: msg.role === 'user' ? 'right' : 'left'
                              }}
                            >
                              {isBot && formattedContent ? (
                                <>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ mb: 1, fontStyle: 'italic', color: '#444' }}
                                  >
                                    {formattedContent.intro}
                                  </Typography>
                                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                    {formattedContent.steps.map((step, idx) => (
                                      <Box component="li" key={idx} sx={{ mb: 1 }}>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ fontWeight: 'bold', color: '#1976d2' }}
                                        >
                                          {step.number} {step.title}
                                        </Typography>
                                        <Typography 
                                          variant="body2" 
                                          sx={{ color: '#555' }}
                                        >
                                          {step.description}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                </>
                              ) : (
                                <Typography variant="body2">
                                  {msg.content}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </Box>
                    </ListItem>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </List>

          <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              placeholder="Ask me anything..."
              fullWidth
              inputRef={inputRef}
              InputProps={{
                sx: { 
                  borderRadius: '25px',
                  bgcolor: '#f5f5f5',
                  pr: 1,
                  '&:hover': { bgcolor: '#eee' }
                },
                endAdornment: (
                  <IconButton 
                    onClick={handleSend} 
                    disabled={loading}
                    sx={{ 
                      bgcolor: '#1976d2',
                      color: 'white',
                      '&:hover': { bgcolor: '#1565c0' }
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;
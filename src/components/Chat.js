import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send'; // Icon for send button
import { useUser } from '../contexts/UserContext'; // Import useUser hook

function Chat({ isOpen, onClose, isMobile }) {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [inputMessage, setInputMessage] = useState(''); // Stores current input message
  const [loading, setLoading] = useState(false); // Loading state for AI response
  const [conversationId, setConversationId] = useState(null); // Stores current conversation ID
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom of chat
  const REACT_APP_CHAT_URL = process.env.REACT_APP_CHAT_URL;
  const { userId, user } = useUser(); // Get userId and user object from context
  const userName = user ? user.name : 'User'; // Get user's name, default to 'User'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { sender: 'user', text: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setLoading(true);
    try {
      const response = await fetch(`${REACT_APP_CHAT_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage, userId, userName, conversationId }), // Send userId, userName, and conversationId
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch AI response');
      }

      const data = await response.json();
      setMessages(data.contents.map(msg => ({ sender: msg.role, text: msg.text }))); // Update with full conversation history
      setConversationId(data.conversationId); // Set conversation ID for subsequent messages
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationId(null); // Clear conversation ID when clearing chat
  };

  if (!isOpen) return null; // Don't render anything if not open

  return (
    <Box sx={{
      height: isMobile ? '90vh' : '100vh', // 80% viewport height on mobile, 100% for desktop sidebar
      width: isMobile ? '100vw' : '350px', // 90% width on mobile, 100% of parent Box on desktop
      position: 'fixed',
      right:'0%',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#f3e5f5', // Light purple background from image
      borderRadius: 2,
      boxShadow: 3,
      // Positioning for mobile overlay
      ...(isMobile && {
        position: 'fixed',
        bottom: '1%',
        right: '0%',
        left: '0%',
        zIndex: 1200,
      }),
    }}>
      {/* Title Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          AI Assitant
        </Typography>
        <Box>
          {isMobile && <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>}
        </Box>
      </Box>
      {/* Chat Content Area */}
      <Paper elevation={0} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', mb: 1, bgcolor: 'white' }}>
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Start a conversation with the AI assistant!
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  bgcolor: msg.sender === 'user' ? '#e0f7fa' : '#f3e5f5', // Light blue for user, light purple for AI
                  borderRadius: '10px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
            </Box>
          ))
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSendMessage();
            }
          }}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={loading || inputMessage.trim() === ''}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearChat}
          disabled={loading}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;

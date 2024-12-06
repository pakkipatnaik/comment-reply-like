import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconButton, TextField, Button, Typography, Box } from '@mui/material';
import { ThumbUp, Reply } from '@mui/icons-material';

axios.defaults.baseURL = 'http://localhost:5001';

const Comment = ({ comment, onLike, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 1, marginBottom: 2 }}>
      <Typography variant="body1">{comment.text}</Typography>
      <Box display="flex" alignItems="center" mt={1}>
        <IconButton color="primary" onClick={() => onLike(comment._id)}>
          <ThumbUp />
        </IconButton>
        <Typography variant="caption" sx={{ marginRight: 2 }}>
          {comment.likes}
        </Typography>
        <IconButton color="primary" onClick={() => setShowReplyBox(!showReplyBox)}>
          <Reply />
        </IconButton>
      </Box>
      {showReplyBox && (
        <Box mt={2}>
          <TextField
            size="small"
            variant="outlined"
            fullWidth
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={handleReplySubmit}>
            Reply
          </Button>
        </Box>
      )}
      {comment.replies && comment.replies.map((reply) => (
        <Comment key={reply._id} comment={reply} onLike={onLike} onReply={onReply} />
      ))}
    </Box>
  );
};

const App = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('/api/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post('/api/comments', { text: newComment });
        setComments(response.data);
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment:', error.message);
      }
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await axios.post(`/api/comments/${id}/like`);
      setComments(response.data);
    } catch (error) {
      console.error('Error liking comment:', error.message);
    }
  };

  const handleReply = async (id, text) => {
    try {
      const response = await axios.post(`/api/comments/${id}/reply`, { text });
      setComments(response.data);
    } catch (error) {
      console.error('Error posting reply:', error.message);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" mb={4}>Commenting System</Typography>
      <Box mb={4}>
        <TextField
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          variant="outlined"
        />
        <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Box>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onLike={handleLike} onReply={handleReply} />
      ))}
    </Box>
  );
};

export default App;

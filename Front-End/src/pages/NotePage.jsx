import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CreateNote from '../components/CreateNote';

export default function NotePage() {
  const { name } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [updating, setUpdating] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [name]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/getNote', {
        params: { name }
      });

      if (response.data.status === 200) {
        setNote(response.data.data);
        setContent(response.data.data.content);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch note';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    try {
      setUpdating(true);
      const response = await axios.post('/api/updateNote', {
        name: name,
        newName: name,
        content: content
      });

      if (response.data.status === 200) {
        toast.success('Note updated successfully!');
        fetchNote();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update note');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateComment = async () => {
    if (!commentContent.trim()) {
      toast.warning('Comment content cannot be empty');
      return;
    }

    try {
      setPosting(true);
      const response = await axios.post('/api/createComment', {
        name: name,
        content: commentContent
      });

      if (response.data.status === 201) {
        toast.success('Comment posted!');
        setCommentContent('');
        fetchNote();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create comment');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="notepage-container">
        <CreateNote />
        <div className="notepage-loading">Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notepage-container">
        <CreateNote />
        <div className="notepage-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="notepage-container">
      <CreateNote />

      <div className="notepage-content">
        <div className="notepage-header">
          <div className="notepage-header-top">
            <h1 className="notepage-title">{note.name}</h1>
            <button
              className="notepage-copy-link-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
            >
              📋 Copy Note Link
            </button>
          </div>
          <div className="notepage-meta">
            <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="notepage-editor">
          <label className="notepage-label">Note Content</label>
          <textarea
            className="notepage-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows={10}
          />
          <button
            className="notepage-update-btn"
            onClick={handleUpdateNote}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Note'}
          </button>
        </div>

        <div className="notepage-comments-section">
          <h2 className="notepage-comments-title">Comments ({note.comments?.length || 0})</h2>
          
          <div className="notepage-comment-form">
            <textarea
              className="notepage-comment-input"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <button
              className="notepage-post-btn"
              onClick={handleCreateComment}
              disabled={posting}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>

          <div className="notepage-comments-list">
            {note.comments && note.comments.length > 0 ? (
              note.comments.map((comment) => (
                <div key={comment.id} className="notepage-comment">
                  <p className="notepage-comment-content">{comment.content}</p>
                  <span className="notepage-comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="notepage-no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
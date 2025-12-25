import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CreateNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.warning('Note name is required');
      return;
    }

    try {
      setCreating(true);
      const response = await axios.post('/api/createNote', {
        name: name.trim(),
        content: ''
      });

      if (response.data.status === 201) {
        toast.success('Note created successfully!');
        setName('');
        setIsOpen(false);
        navigate(`/${name.trim()}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create note');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="createnote-container">
      {!isOpen ? (
        <button
          className="createnote-open-btn"
          onClick={() => setIsOpen(true)}
        >
          + Create New Note
        </button>
      ) : (
        <div className="createnote-form">
          <div className="createnote-header">
            <h3 className="createnote-form-title">Create New Note</h3>
            <button
              className="createnote-close-btn"
              onClick={() => {
                setIsOpen(false);
                setName('');
              }}
            >
              ✕
            </button>
          </div>
          
          <input
            type="text"
            className="createnote-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter note name..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreate();
              }
            }}
          />
          
          <button
            className="createnote-create-btn"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      )}
    </div>
  );
}
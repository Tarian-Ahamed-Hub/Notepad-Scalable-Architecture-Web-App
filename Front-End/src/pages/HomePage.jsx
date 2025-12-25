import { useState } from 'react';
import CreateNote from '../components/CreateNote';

export default function HomePage() {
  return (
    <div className="homepage-container">
      <div className="homepage-welcome">
        <h1 className="homepage-title">Welcome to NotePad</h1>
        <p className="homepage-subtitle">Create and manage your notes with ease</p>
        
        <div className="homepage-features">
          <div className="homepage-feature-card">
            <span className="homepage-feature-icon">📝</span>
            <h3>Create Notes</h3>
            <p>Quickly create and organize your thoughts</p>
          </div>
          <div className="homepage-feature-card">
            <span className="homepage-feature-icon">💬</span>
            <h3>Add Comments</h3>
            <p>Collaborate and discuss with comments</p>
          </div>
          <div className="homepage-feature-card">
            <span className="homepage-feature-icon">🔄</span>
            <h3>Real-time Updates</h3>
            <p>Edit and update notes instantly</p>
          </div>
        </div>
      </div>

      <CreateNote />
    </div>
  );
}
// src/App.jsx
import React from 'react';
import AudioPlayer from './components/AudioPlayer';  // ✅ Changed from 'Audio' to 'AudioPlayer'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9edf2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <AudioPlayer />
    </div>
  );
}

export default App;
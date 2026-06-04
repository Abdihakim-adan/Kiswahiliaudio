// src/components/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getAudioUrl, getPageInfo } from '../api/audio';

const TOTAL_PAGES = 604;

const AudioPlayer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const audioRef = useRef(null);
  const hasAutoPlayedRef = useRef(false);

  // Initialize audio on first user interaction
  const initializeAudio = async () => {
    if (audioInitialized) return true;
    
    try {
      // Create AudioContext for browsers that need it
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();
      setAudioContext(context);
      
      // Resume context
      await context.resume();
      
      // Test play a silent buffer to enable audio
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start();
      
      setAudioInitialized(true);
      return true;
    } catch (err) {
      console.error('Audio initialization failed:', err);
      return false;
    }
  };

  // Handle first click anywhere on the page
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!audioInitialized) {
        const success = await initializeAudio();
        if (success && !hasAutoPlayedRef.current) {
          // Start playing after initialization
          setIsPlaying(true);
          hasAutoPlayedRef.current = true;
        }
      }
    };

    // Add event listeners for first interaction
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [audioInitialized]);

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioInitialized) return;

    const url = getAudioUrl(currentPage);
    if (audio.src !== url) {
      audio.src = url;
      audio.load();
      setError(null);
      setIsLoading(true);
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Playback failed:', err);
          if (err.name === 'NotAllowedError') {
            setError('Click anywhere on the page to enable audio');
          } else {
            setError('Unable to play audio. File may be missing.');
          }
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentPage, isPlaying, audioInitialized]);

  // Listen for audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setError(`Failed to load page ${currentPage}. Check if the file exists.`);
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (autoPlayEnabled && currentPage < TOTAL_PAGES) {
        setCurrentPage(p => p + 1);
        setIsPlaying(true);
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentPage, autoPlayEnabled]);

  const togglePlayPause = async () => {
    if (!audioInitialized) {
      await initializeAudio();
    }
    setIsPlaying(prev => !prev);
  };

  const goToPage = async (page) => {
    if (page < 1 || page > TOTAL_PAGES) return;
    setCurrentPage(page);
    if (!audioInitialized) {
      await initializeAudio();
    }
    setIsPlaying(true);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    title: {
      textAlign: 'center',
      color: 'white',
      marginTop: 0,
      marginBottom: '1rem',
      fontSize: '1.8rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    pageInfo: {
      textAlign: 'center',
      fontSize: '1.6rem',
      margin: '1rem 0',
      color: 'white',
      fontWeight: 'bold',
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      margin: '1.5rem 0',
    },
    button: {
      padding: '0.7rem 1.5rem',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '50px',
      background: 'white',
      color: '#667eea',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    buttonDisabled: {
      background: '#ccc',
      color: '#666',
      cursor: 'not-allowed',
    },
    playButton: {
      padding: '0.7rem 2rem',
      fontSize: '1.2rem',
      background: '#ff6b6b',
      color: 'white',
    },
    autoPlayContainer: {
      margin: '1rem 0',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: 'white',
    },
    sliderContainer: {
      margin: '1.5rem 0',
    },
    range: {
      width: '100%',
      margin: '0.5rem 0',
      height: '6px',
      borderRadius: '3px',
      background: 'white',
      WebkitAppearance: 'none',
    },
    sliderLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: 'white',
    },
    jumpContainer: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '1rem',
    },
    pageInput: {
      width: '80px',
      padding: '0.5rem',
      fontSize: '1rem',
      textAlign: 'center',
      border: 'none',
      borderRadius: '8px',
      background: 'white',
      color: '#333',
    },
    goButton: {
      padding: '0.5rem 1rem',
      background: 'white',
      color: '#667eea',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#ffeaa7',
      marginTop: '0.5rem',
    },
    errorText: {
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#ff7675',
      marginTop: '0.5rem',
      background: 'rgba(0,0,0,0.3)',
      padding: '0.5rem',
      borderRadius: '8px',
    },
    enablePrompt: {
      textAlign: 'center',
      fontSize: '1rem',
      color: '#ffeaa7',
      marginTop: '1rem',
      padding: '1rem',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '12px',
      cursor: 'pointer',
      animation: 'pulse 2s infinite',
    },
  };

  // Show enable prompt if audio not initialized
  if (!audioInitialized) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>🎧 Kiswahili Audio Player</h2>
        <div style={styles.enablePrompt}>
          🎵 Click anywhere on this page to enable auto-play 🎵
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Then audio will play automatically for all pages
          </div>
        </div>
      </div>
    );
  }

  // Main player view
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
      
      <h2 style={styles.title}>🎧 Kiswahili Audio Player</h2>

      <audio ref={audioRef} preload="auto" />

      <div style={styles.pageInfo}>
        📖 Page <strong>{currentPage}</strong> of {TOTAL_PAGES}
      </div>

      <div style={styles.controls}>
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          style={{
            ...styles.button,
            ...(currentPage <= 1 ? styles.buttonDisabled : {}),
          }}
        >
          ⏮ Prev
        </button>

        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          style={{
            ...styles.button,
            ...styles.playButton,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
        >
          {isLoading ? '⏳ Loading...' : isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage >= TOTAL_PAGES}
          style={{
            ...styles.button,
            ...(currentPage >= TOTAL_PAGES ? styles.buttonDisabled : {}),
          }}
        >
          Next ⏭
        </button>
      </div>

      <div style={styles.autoPlayContainer}>
        <label>
          <input
            type="checkbox"
            checked={autoPlayEnabled}
            onChange={(e) => setAutoPlayEnabled(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          🔄 Auto‑play next page
        </label>
      </div>

      <div style={styles.sliderContainer}>
        <input
          type="range"
          min={1}
          max={TOTAL_PAGES}
          value={currentPage}
          onChange={(e) => goToPage(parseInt(e.target.value, 10))}
          style={styles.range}
        />
        <div style={styles.sliderLabels}>
          <span>Page 1</span>
          <span>Page {TOTAL_PAGES}</span>
        </div>
      </div>

      <div style={styles.jumpContainer}>
        <input
          type="number"
          min={1}
          max={TOTAL_PAGES}
          value={currentPage}
          onChange={(e) => goToPage(parseInt(e.target.value, 10) || 1)}
          style={styles.pageInput}
        />
        <button onClick={() => goToPage(currentPage)} style={styles.goButton}>
          Go to Page
        </button>
      </div>

      {isLoading && <div style={styles.loadingText}>🎵 Loading audio...</div>}
      {error && <div style={styles.errorText}>⚠️ {error}</div>}
    </div>
  );
};

export default AudioPlayer;
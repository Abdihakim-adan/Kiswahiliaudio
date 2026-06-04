// src/components/Audio.jsx
import React, { useState, useRef, useEffect } from 'react';

// Adjust TOTAL_PAGES to match the number of MP3 files you have
const TOTAL_PAGES = 604;

// Helper: format page number to 3 digits (e.g., 1 -> "001")
const formatPageNumber = (page) => String(page).padStart(3, '0');

// Build audio URL based on page number.
// Files must be placed in public/audio/ folder
const getAudioUrl = (page) => `/audio/page${formatPageNumber(page)}.mp3`;

const AudioPlayer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [error, setError] = useState(null);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const audioRef = useRef(null);

  // Auto-play on initial load (with browser policy handling)
  useEffect(() => {
    if (!hasAutoPlayed && !isLoading && !error && !needsUserInteraction) {
      // Small delay to ensure audio is ready
      const timer = setTimeout(async () => {
        try {
          const audio = audioRef.current;
          if (audio && audio.src) {
            await audio.play();
            setIsPlaying(true);
            setHasAutoPlayed(true);
          }
        } catch (err) {
          console.log('Auto-play blocked by browser:', err);
          setNeedsUserInteraction(true);
          setError('Click play to start listening');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasAutoPlayed, isLoading, error, needsUserInteraction]);

  // Handle play/pause and loading state when currentPage changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const url = getAudioUrl(currentPage);
    if (audio.src !== url) {
      audio.src = url;
      audio.load();
      setError(null);
      setIsLoading(true);
      setNeedsUserInteraction(false);
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Playback failed:', err);
          if (err.name === 'NotAllowedError') {
            setNeedsUserInteraction(true);
            setError('Click play to start listening (browser auto-play policy)');
          } else {
            setError('Unable to play audio. File may be missing or format unsupported.');
          }
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentPage, isPlaying]);

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
      if (autoPlay && currentPage < TOTAL_PAGES) {
        goToPage(currentPage + 1);
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
  }, [currentPage, autoPlay]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (error) setError(null);
    if (!getAudioUrl(currentPage)) {
      setError(`Audio for page ${currentPage} not found.`);
      return;
    }
    setNeedsUserInteraction(false);
    setIsPlaying((prev) => !prev);
  };

  // Change page
  const goToPage = (page) => {
    if (page < 1 || page > TOTAL_PAGES) return;
    setCurrentPage(page);
    setIsPlaying(true);
    setHasAutoPlayed(true);
    setNeedsUserInteraction(false);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Inline styles
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
      transition: 'transform 0.2s, box-shadow 0.2s',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
    buttonDisabled: {
      background: '#ccc',
      color: '#666',
      cursor: 'not-allowed',
      transform: 'none',
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
    rangeWebkit: {
      WebkitAppearance: 'none',
      height: '6px',
      borderRadius: '3px',
      background: 'white',
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
    interactionPrompt: {
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#ffeaa7',
      marginTop: '0.5rem',
      padding: '0.5rem',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
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
          onMouseEnter={(e) => {
            if (currentPage > 1) e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
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
          onMouseEnter={(e) => {
            if (!isLoading) e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
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
          onMouseEnter={(e) => {
            if (currentPage < TOTAL_PAGES) e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          Next ⏭
        </button>
      </div>

      <div style={styles.autoPlayContainer}>
        <label>
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
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
          style={{
            ...styles.range,
            ...styles.rangeWebkit,
          }}
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
      {error && (
        <div style={styles.errorText}>
          ⚠️ {error}
          {needsUserInteraction && (
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              👆 Click the play button above to start listening
            </div>
          )}
        </div>
      )}
      {needsUserInteraction && !error && (
        <div style={styles.interactionPrompt} onClick={togglePlayPause}>
          🎵 Click here or press play to start listening
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
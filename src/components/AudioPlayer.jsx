// src/components/Audio.jsx
import React, { useState, useRef, useEffect } from 'react';

// Adjust TOTAL_PAGES to match the number of MP3 files you have
const TOTAL_PAGES = 604;

// Helper: format page number to 3 digits (e.g., 1 -> "001")
const formatPageNumber = (page) => String(page).padStart(3, '0');

// Build audio URL based on page number.
// Files must be placed in public/audio/ or src/assets/audio/ depending on bundler.
// This example uses the **public** folder approach for simplicity and reliability in both Vite and CRA.
// If you prefer to keep files in src/assets/audio/, you would need to import them dynamically.
// To avoid complex bundler‑specific code, we serve them from the public folder.
//
// === INSTRUCTIONS ===
// 1. Create a folder named "audio" inside the "public" folder of your React project.
// 2. Place your MP3 files there as page001.mp3, page002.mp3, ...
// 3. Then the URL will be `/audio/page001.mp3`.
//
// If you must use src/assets/audio/, replace the function below with the dynamic import logic.
// For simplicity and cross‑tool compatibility, the public folder method is recommended.
const getAudioUrl = (page) => `/audio/page${formatPageNumber(page)}.mp3`;

const AudioPlayer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

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
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Playback failed:', err);
          setError('Unable to play audio. File may be missing or format unsupported.');
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentPage, isPlaying]);

  // Listen for loadstart, canplay, and error events
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
        setCurrentPage((p) => p + 1);
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
    setIsPlaying((prev) => !prev);
  };

  // Change page
  const goToPage = (page) => {
    if (page < 1 || page > TOTAL_PAGES) return;
    setCurrentPage(page);
    // When manually changing page, auto‑play the new page (unless you prefer to pause)
    setIsPlaying(true);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Inline styles
  const styles = {
    container: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '1.5rem',
      background: '#f9f9f9',
      borderRadius: '24px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },
    title: {
      textAlign: 'center',
      color: '#1e3a5f',
      marginTop: 0,
      marginBottom: '1rem',
      fontSize: '1.8rem',
    },
    pageInfo: {
      textAlign: 'center',
      fontSize: '1.4rem',
      margin: '1rem 0',
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      margin: '1.5rem 0',
    },
    button: {
      padding: '0.6rem 1.2rem',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '40px',
      background: '#2c3e66',
      color: 'white',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    buttonDisabled: {
      background: '#aaa',
      cursor: 'not-allowed',
    },
    playButton: {
      padding: '0.6rem 1.5rem',
      fontSize: '1.1rem',
    },
    autoPlayContainer: {
      margin: '1rem 0',
      textAlign: 'center',
      fontSize: '0.9rem',
    },
    sliderContainer: {
      margin: '1.5rem 0',
    },
    range: {
      width: '100%',
      margin: '0.5rem 0',
    },
    sliderLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: '#555',
    },
    jumpContainer: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '1rem',
    },
    pageInput: {
      width: '80px',
      padding: '0.4rem',
      fontSize: '1rem',
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '8px',
    },
    goButton: {
      padding: '0.4rem 1rem',
      background: '#2c3e66',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#d97706',
      marginTop: '0.5rem',
    },
    errorText: {
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#dc2626',
      marginTop: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📖 Audio Player</h2>

      <audio ref={audioRef} preload="auto" />

      <div style={styles.pageInfo}>
        Page <strong>{currentPage}</strong> of {TOTAL_PAGES}
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
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
          />
          {' '}Auto‑play next page
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
          <span>1</span>
          <span>{TOTAL_PAGES}</span>
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
          Go
        </button>
      </div>

      {isLoading && <div style={styles.loadingText}>Loading audio…</div>}
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
};

export default AudioPlayer;
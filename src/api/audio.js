// src/api/audio.js
// This simulates an API endpoint for audio files

const TOTAL_PAGES = 604;

// Format page number to 3 digits
const formatPageNumber = (page) => String(page).padStart(3, '0');

// API function to get audio URL for a page
export const getAudioUrl = (page) => {
  return `/audio/page${formatPageNumber(page)}.mp3`;
};

// API function to check if audio file exists
export const checkAudioExists = async (page) => {
  const url = getAudioUrl(page);
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking audio:', error);
    return false;
  }
};

// API function to get page info
export const getPageInfo = (page) => {
  return {
    pageNumber: page,
    audioUrl: getAudioUrl(page),
    nextPage: page < TOTAL_PAGES ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
  };
};
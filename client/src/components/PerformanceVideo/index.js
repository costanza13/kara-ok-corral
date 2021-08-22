import React from 'react';
import './PerformanceVideo.css';

const PerformanceVideo = (song) => {

  return (
    <div class="video-wrap">
      <div class="video-container">
        <iframe src="https://www.youtube.com/embed/fKJW7R_Nzco" title={`${song.title} (${song.artist})`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  );
};

export default PerformanceVideo;
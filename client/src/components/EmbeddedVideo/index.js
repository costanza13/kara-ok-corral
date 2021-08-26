import React from 'react';
import './EmbeddedVideo.css';

const EmbeddedVideo = ({ title, artist, url }) => {

  // youtube embed links look like youtube video links but with `/embed/` instead of `/watch?v=`
  let embedUrl;
  if (url && url.indexOf('www.youtube.com/watch') > -1) {
    embedUrl = url.replace('/watch?v=', '/embed/');
  } else {
    embedUrl = url;
  }

  return (
    <div className="video-wrap">
      <div className="video-container">
        <iframe src={embedUrl} title={`${title} - ${artist}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default EmbeddedVideo;
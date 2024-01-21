import React, { useState, useEffect } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import "./TrailerBtn.css";
const TrailerButton = ({ movieTitle }) => {
  const [trailerVideoId, setTrailerVideoId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Function to fetch trailer information from YouTube Data API
    async function fetchTrailerInfo() {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              q: `${movieTitle} trailer`,
              key: "AIzaSyCWFPtzPZZ_llDmBZ6ceKFt2HfS1lg4hwM", // Replace with your actual YouTube API key
              type: "video",
              part: "id",
              maxResults: 1,
            },
          }
        );

        if (response.data.items && response.data.items.length > 0) {
          setTrailerVideoId(response.data.items[0].id.videoId);
        } else {
          // Handle case when no trailer is found
          console.warn("No trailer found for the movie");
        }
      } catch (error) {
        console.error("Error fetching trailer information:", error);
      }
    }

    // Fetch trailer information when the component mounts
    fetchTrailerInfo();
  }, [movieTitle]);

  const handlePlayTrailer = () => {
    if (trailerVideoId) {
      // Set the state to show the trailer
      setShowTrailer(true);
    }
  };

  const handleCloseTrailer = () => {
    // Set the state to hide the trailer
    setShowTrailer(false);
  };

  return (
    <div className="trailer-container">
      {showTrailer ? (
        <div>
          <YouTube
            videoId={trailerVideoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1,
              },
            }}
          />
          <button className="close-button" onClick={handleCloseTrailer}>
            Close Trailer
          </button>
        </div>
      ) : (
        <button className="play-button" onClick={handlePlayTrailer}>
          Play Trailer
        </button>
      )}
    </div>
  );
};

export default TrailerButton;

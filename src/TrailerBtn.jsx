import React, { useState, useEffect } from "react";
import axios from "axios";

const TrailerButton = ({ movieTitle }) => {
  const [trailerVideoId, setTrailerVideoId] = useState(null);

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
      // Open a modal or navigate to a new page with an embedded YouTube player
      window.open(
        `https://www.youtube.com/watch?v=${trailerVideoId}`,
        "_blank"
      );
    }
  };

  return <button onClick={handlePlayTrailer}>Play Trailer</button>;
};

export default TrailerButton;

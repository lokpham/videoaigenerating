import { useState } from "react";
import MessageWelcome from "@/components/MessageWelcome";
import VideoMaker from "@/components/VideoMaker";

const data = {
  user_content: "",
  duration: "20",
  size: {
    width: 1280,
    height: 720,
  },
  script:
    "as the clock ticks down to apocalypse day the skies darken and the earth begins to crumble the once blue oceans are now a deep burnt orange and the landscape stretches out before us as a barren wasteland the winds howl with a mournful cry and the very fabric of reality seems to be unraveling as the seven seals are opened and the four horsemen gallop forth their hooves pounding out a rhythmic dirge of doom the world as we know it is coming to a close and nothing can be done to stop it the end is near.",
  prompts: [],
  state: false,
  audio: null,
  image: [
    "https://cdn.mos.cms.futurecdn.net/Bp2M5emh8kRY3kBWRYKAYD-1100-80.jpg",
    "https://images.unsplash.com/photo-1739993655680-4b7050ed2896?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1667806393680-725881a3c625?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1667287476215-6fcc503c0a73?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1664348504675-a5e72e98259e?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1706856377447-98891f04ff0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
};

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file)); // Create an object URL
    } else {
      alert("Please upload a valid MP3 file.");
    }
  };

  return (
    <div>
      <MessageWelcome />

      <div>
        <input type="file" accept="audio/mp3" onChange={handleFileChange} />
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      </div>

      {audioUrl && (
        <audio controls className="mt-4">
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
      )}
      {selectedFile && (
        <VideoMaker audioFile={selectedFile} imageUrls={data.image} />
      )}
    </div>
  );
};

export default Home;

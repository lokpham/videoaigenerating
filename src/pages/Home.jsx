import { useEffect, useState } from "react";
import MessageWelcome from "@/components/MessageWelcome";
import VideoMaker from "@/components/VideoMaker";
import { FFmpeg } from "@ffmpeg/ffmpeg";

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
    "http://localhost:5173/anh1.jpg",
    "http://localhost:5173/anh2.jpg",
    "http://localhost:5173/anh3.jpg",
    "http://localhost:5173/anh4.jpg",
    "http://localhost:5173/anh5.jpg",
    "http://localhost:5173/anh6.jpg",
  ],
};

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const ffmpeg = new FFmpeg();

  const checkLibassSupport = async () => {
    try {
      // Load ffmpeg nếu chưa load
      if (!ffmpeg.loaded) {
        await ffmpeg.load({ log: true });
      }
      // Lấy thông tin version của ffmpeg
      const { stdout } = await ffmpeg.run("-version");
      // Kiểm tra xem dòng cấu hình có chứa "--enable-libass" không
      if (stdout.includes("--enable-libass")) {
        console.log("co libass");
      } else {
      }
    } catch (error) {
      console.error("Error checking libass support:", error);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file)); // Create an object URL
    } else {
      alert("Please upload a valid MP3 file.");
    }
  };
  useEffect(() => {
    checkLibassSupport();
  });
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
        <VideoMaker
          audioFile={selectedFile}
          imageUrls={data.image}
          script={data.script}
        />
      )}
    </div>
  );
};

export default Home;

import { Button } from "antd";
import React, { useState } from "react";
import VideoMaker from "./VideoMaker";

const AudioPlayer = () => {
  const [audioSrc, setAudioSrc] = useState(null);
  const [videoMakerStatus, setVideoMakerStatus] = useState(false);
  const [file, setFile] = useState(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setFile(file);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 className="font-bold">Upload MP3</h2>
        <input
          type="file"
          accept="audio/mp3"
          onChange={handleFileUpload}
          style={{ marginBottom: "20px" }}
        />
        {audioSrc && (
          <audio className="mx-auto" controls>
            <source src={audioSrc} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <div>
        {file && (
          <div
            className="w-fit mt-2 hover:opacity-65 cursor-pointer rounded-md shadow-sm p-3 bg-green-500 font-bold text-[2rem] mx-auto"
            onClick={() => setVideoMakerStatus(true)}
          >
            Create Video
          </div>
        )}
      </div>
    </>
  );
};

export default AudioPlayer;

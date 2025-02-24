import React, { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const ffmpeg = new FFmpeg();

const VideoMaker = ({ imageUrls, audioFile }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createVideo = async () => {
    // Check if we have images and an audio file
    if (!imageUrls.length || !audioFile) {
      alert("Both images and audio file are required.");
      return;
    }

    setIsProcessing(true);

    try {
      // Load the FFmpeg instance with logging enabled for debugging
      await ffmpeg.load({ log: true });

      // Write the uploaded audio file to FFmpeg's virtual file system
      const audioFilename = "audio.mp3";
      await ffmpeg.writeFile(audioFilename, await fetchFile(audioFile));

      // Calculate the duration for each image (total video length is 25 seconds)
      let duration = 25 / imageUrls.length;

      // Process each image URL: fetch, convert to arrayBuffer, and write to FFmpeg FS
      const inputText = await Promise.all(
        imageUrls.map(async (url, index) => {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const filename = `image${index}.png`;
          await ffmpeg.writeFile(filename, new Uint8Array(arrayBuffer));

          // Return the formatted text line for FFmpeg's concat demuxer
          return `file '${filename}'\nduration ${duration}`;
        })
      );
      console.log("FFmpeg input lines:", inputText);

      console.log("Processing images and audio...");

      // Append the last image to ensure the video ends cleanly
      const lastImage = `image${imageUrls.length - 1}.png`;
      const inputWithLastImage = `${inputText.join("\n")}\nfile '${lastImage}'\n`;

      // Write the concat file list (input.txt) to FFmpeg FS
      await ffmpeg.writeFile(
        "input.txt",
        new TextEncoder().encode(inputWithLastImage)
      );

      // Execute FFmpeg to create the video using the concat demuxer
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "input.txt",
        "-i",
        audioFilename,
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "output.mp4",
      ]);

      // Read the resulting video file and create a blob URL
      const data = await ffmpeg.readFile("output.mp4");
      const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (error) {
      console.error("Error creating video:", error);
      alert("An error occurred while creating the video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 className="font-bold">We are ready for your video. Let's get started!</h2>
      <button
        className="py-2 px-5 text-center rounded-sm hover:opacity-70 shadow-sm mt-2 text-white bg-gray-500"
        onClick={createVideo}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Start"}
      </button>
      {videoUrl && (
        <div>
          <h3>Generated Video:</h3>
          <video controls width="600">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoMaker;

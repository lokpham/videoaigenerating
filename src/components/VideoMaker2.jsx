import React, { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const ffmpeg = new FFmpeg();

const VideoMaker2 = ({ imageUrls, audioFile, subtitles, totalDuration }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createVideo = async () => {
    if (!imageUrls.length || !audioFile || !subtitles || !totalDuration) {
      alert("Images, audio, subtitles, and total duration are required.");
      return;
    }

    setIsProcessing(true);

    try {
      await ffmpeg.load({ log: true });

      // Ghi file âm thanh vào bộ nhớ ảo của FFmpeg
      const audioFilename = "audio.mp3";
      await ffmpeg.writeFile(audioFilename, await fetchFile(audioFile));

      // Tính toán thời gian hiển thị mỗi ảnh
      const durationPerImage = totalDuration / imageUrls.length;
      console.log(`Each image duration: ${durationPerImage}s`);

      // Ghi các hình ảnh và tạo `input.txt` cho FFmpeg
      const inputText = await Promise.all(
        imageUrls.map(async (url, index) => {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const filename = `image${index}.png`;
          await ffmpeg.writeFile(filename, new Uint8Array(arrayBuffer));
          return `file '${filename}'\nduration ${durationPerImage}`;
        })
      );

      // Đảm bảo ảnh cuối cùng hiển thị đến hết video
      const lastImage = `image${imageUrls.length - 1}.png`;
      const inputWithLastImage = `${inputText.join(
        "\n"
      )}\nfile '${lastImage}'\n`;

      // Ghi file danh sách ảnh vào bộ nhớ FFmpeg
      await ffmpeg.writeFile(
        "input.txt",
        new TextEncoder().encode(inputWithLastImage)
      );

      // **Tạo file phụ đề `.srt`**
      const srtContent = subtitles
        .map((text, index) => {
          const startTime = new Date(index * durationPerImage * 1000)
            .toISOString()
            .substr(11, 12)
            .replace(".", ",");
          const endTime = new Date((index + 1) * durationPerImage * 1000)
            .toISOString()
            .substr(11, 12)
            .replace(".", ",");
          return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n`;
        })
        .join("\n");

      await ffmpeg.writeFile(
        "subtitles.srt",
        new TextEncoder().encode(srtContent)
      );

      // **Chạy FFmpeg để tạo video có phụ đề**
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "input.txt",
        "-i",
        audioFilename,
        "-vf",
        "subtitles=subtitles.srt:force_style='Fontsize=24,PrimaryColour=&HFFFFFF'",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "output.mp4",
      ]);

      // Đọc kết quả và tạo URL cho video
      const data = await ffmpeg.readFile("output.mp4");
      const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
    } catch (error) {
      console.error("Error creating video:", error);
      alert("An error occurred while creating the video.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 className="font-bold">We are ready for your video let started</h2>
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

export default VideoMaker2;

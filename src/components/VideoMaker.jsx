import React, { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
const ffmpeg = new FFmpeg();

const VideoMaker = ({ imageUrls, audioFile, script }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createVideo = async () => {
    if (!imageUrls.length || !audioFile) {
      alert("Both images and audio file are required.");
      return;
    }

    setIsProcessing(true);

    // Hàm lấy thời lượng của audio
    const getAudioDuration = (audioFile) =>
      new Promise((resolve, reject) => {
        const url = URL.createObjectURL(audioFile);
        const audio = new Audio(url);
        audio.addEventListener("loadedmetadata", () => {
          const duration = audio.duration;
          URL.revokeObjectURL(url);
          resolve(duration);
        });
        audio.addEventListener("error", (err) => {
          URL.revokeObjectURL(url);
          reject(err);
        });
      });

    // Hàm định dạng thời gian cho file SRT (hh:mm:ss,ms)
    const formatTime = (seconds) => {
      const date = new Date(0);
      date.setSeconds(seconds);
      // ISO string trả về dạng "HH:MM:SS.sssZ", ta lấy phần HH:MM:SS,ms
      return date.toISOString().substr(11, 12).replace(".", ",");
    };

    // Hàm tạo file phụ đề SRT dựa trên script và thời lượng audio
    const createSubtitles = async (script, durationAudio) => {
      const words = script.split(" ");
      // Giả sử ta chia script thành các đoạn 2 giây
      const segmentDuration = 2;
      let currentTime = 0;
      let subtitleContent = "";
      let index = 1;
      // Tính số từ cần dùng cho mỗi đoạn
      const wordsPerSegment = Math.floor(
        words.length / (durationAudio / segmentDuration)
      );
      for (let i = 0; i < words.length; i += wordsPerSegment) {
        let start = currentTime;
        let end = Math.min(currentTime + segmentDuration, durationAudio);
        let text = words.slice(i, i + wordsPerSegment).join(" ");
        subtitleContent += `${index}\n`;
        subtitleContent += `${formatTime(start)} --> ${formatTime(end)}\n`;
        subtitleContent += `${text}\n\n`;
        currentTime = end;
        index++;
        if (currentTime >= durationAudio) break;
      }
      await ffmpeg.writeFile(
        "subtitles.srt",
        new TextEncoder().encode(subtitleContent)
      );
    };

    try {
      const durationAudio = await getAudioDuration(audioFile);

      // Load FFmpeg với logging bật để debug nếu cần
      await ffmpeg.load({ log: true });

      // Ghi file audio vào hệ thống file ảo của FFmpeg
      const audioFilename = "audio.mp3";
      await ffmpeg.writeFile(audioFilename, await fetchFile(audioFile));

      // Tạo file phụ đề dựa trên script
      await createSubtitles(script, durationAudio);

      // Tính thời lượng cho mỗi ảnh
      const imageDuration = durationAudio / imageUrls.length;

      // Xử lý từng ảnh: fetch, chuyển về arrayBuffer, và ghi vào hệ thống file của FFmpeg
      const inputText = await Promise.all(
        imageUrls.map(async (url, index) => {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const filename = `image${index}.png`;
          await ffmpeg.writeFile(filename, new Uint8Array(arrayBuffer));
          // Trả về dòng text cho concat demuxer
          return `file '${filename}'\nduration ${imageDuration}`;
        })
      );

      // Thêm ảnh cuối để đảm bảo video kết thúc đúng thời gian
      const lastImage = `image${imageUrls.length - 1}.png`;
      const inputWithLastImage = `${inputText.join(
        "\n"
      )}\nfile '${lastImage}'\n`;

      // Ghi file danh sách ảnh (input.txt) vào hệ thống file của FFmpeg
      await ffmpeg.writeFile(
        "input.txt",
        new TextEncoder().encode(inputWithLastImage)
      );

      // Thực thi FFmpeg: sử dụng concat demuxer, kết hợp audio và nhúng phụ đề
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
        "subtitles=subtitles.srt",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "output.mp4",
      ]);

      // Đọc file video kết quả và tạo URL blob để hiển thị
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
      <h2 className="font-bold">
        We are ready for your video. Let's get started!
      </h2>
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

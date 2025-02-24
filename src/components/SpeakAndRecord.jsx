import { useState, useRef } from "react";

const SpeakAndRecord = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const speakAndRecord = (text) => {
    if (!text) {
      alert("Vui lòng nhập văn bản!");
      return;
    }

    setRecording(true);
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();

    // Kiểm tra hỗ trợ MIME
    let mimeType = "audio/webm; codecs=opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "audio/mp4";
    }

    const mediaRecorder = new MediaRecorder(destination.stream, { mimeType });
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      console.log("Dữ liệu ghi âm:", event.data);
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Chờ xử lý dữ liệu
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

      if (audioBlob.size === 0) {
        alert("Lỗi: File audio bị trống! Hãy thử lại.");
        return;
      }

      setAudioBlob(audioBlob);
      setRecording(false);
    };

    mediaRecorder.start();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    utterance.pitch = 1.0;

    const speaker = audioContext.createMediaStreamSource(destination.stream);
    speaker.connect(audioContext.destination);

    utterance.onend = () => {
      mediaRecorder.stop();
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        id="textInput"
        placeholder="Nhập văn bản..."
        className="p-2 border rounded w-full"
      />
      <button
        onClick={() =>
          speakAndRecord(document.getElementById("textInput").value)
        }
        className={`p-2 mt-2 rounded-md text-white ${
          recording ? "bg-gray-500" : "bg-blue-500"
        }`}
        disabled={recording}
      >
        {recording ? "Đang ghi âm..." : "Bắt đầu nói và ghi âm"}
      </button>

      {audioBlob && (
        <div className="mt-4">
          <audio controls src={URL.createObjectURL(audioBlob)}></audio>
          <a
            href={URL.createObjectURL(audioBlob)}
            download="speech.webm"
            className="block mt-2 text-blue-600 underline"
          >
            Tải xuống WebM
          </a>
        </div>
      )}
    </div>
  );
};

export default SpeakAndRecord;

import React, { useState } from "react";
import axios from "axios";

const CreateImage = () => {
  const [prompt, setPrompt] = useState(""); // Lưu prompt người dùng nhập
  const [imageUrl, setImageUrl] = useState(null); // URL ảnh được tạo
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi nếu có

  const API_URL =
    "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";
  const API_KEY = "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"; // Thay bằng API key của bạn

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt!");
      return;
    }

    setError(null); // Xóa lỗi trước đó
    setLoading(true);
    setImageUrl(null);

    try {
      const response = await axios.post(
        API_URL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // Đảm bảo nhận dữ liệu dạng nhị phân
        }
      );

      const url = URL.createObjectURL(new Blob([response.data]));
      setImageUrl(url); // Tạo URL ảnh từ dữ liệu nhị phân
    } catch (err) {
      console.error(err);
      setError(
        "An error occurred while generating the image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Text-to-Image Generator</h1>
      <textarea
        placeholder="Enter a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "80%", height: "80px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={generateImage}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {imageUrl && (
        <div>
          <h3>Generated Image:</h3>
          <img
            src={imageUrl}
            alt="Generated"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default CreateImage;

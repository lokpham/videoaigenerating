import axios from "axios";

const API_URL =
  "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";
const API_KEY = import.meta.env.VITE_hf_key;

export const generateImage = async (prompt) => {
  if (!prompt.trim()) {
    setError("Please enter a prompt!");
    return "";
  }

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
    return url;
  } catch (err) {
    console.error(err);
  } finally {
    return "";
  }
};

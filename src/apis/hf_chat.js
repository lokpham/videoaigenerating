import axios from "axios";

// Lấy API key từ biến môi trường
const API_KEY = import.meta.env.VITE_hf_key;

// URL của Hugging Face API cho GPT-2
const API_URL =
  "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct/v1/chat/completions";

export const sendChatMessage = async (query) => {
  const payload = {
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages: [{ role: "user", content: query }],
  };

  try {
    // Gửi yêu cầu POST đến Hugging Face API
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`, // API key cho Hugging Face
      },
    });

    // Trả về dữ liệu từ API
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error sending message to Hugging Face API:",
      error.response || error.message
    );
    throw error;
  }
};

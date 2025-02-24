import axios from "axios";

const API_KEY = import.meta.env.VITE_hf_key;

const API_URL =
  "https://huggingface.co/api/inference-proxy/together/v1/chat/completions";

export const GenerareText = async (query) => {
  const payload = {
    model: "deepseek-ai/DeepSeek-R1",
    messages: [{ role: "user", content: query }],
    stream: false,
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error sending message to Hugging Face API:",
      error.response || error.message
    );
    throw error;
  }
};

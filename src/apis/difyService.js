import axios from "axios";
const API_KEY = import.meta.env.VITE_dify_key;

const API_URL = "https://api.dify.ai/v1/chat-messages";
const seed =
  "create simple promt, promts use for create image max is 1 prompts. response show simple anwser. do not format anything just plain text and each promt separation by ','";
export const sendChatMessage = async (query, userId) => {
  const payload = {
    inputs: {},
    query: query + " ." + seed,
    response_mode: "blocking", // Cấu hình chế độ phản hồi (có thể là "streaming" hoặc "standard")
    conversation_id: "", // Nếu có cuộc trò chuyện trước đó, điền vào đây
    user: userId, // Mã người dùng, có thể thay đổi tùy vào ứng dụng của bạn
    files: [], // Nếu có tệp đính kèm (hình ảnh, tài liệu), thêm vào đây
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error(
      "Error sending message to Dify API:",
      error.response || error.message
    );
    throw error;
  }
};

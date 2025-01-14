import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { sendChatMessage } from "@/apis/difyService";
import { IoIosSend } from "react-icons/io";
import GenerateListImage from "./GenerateListImage";
import { Skeleton } from "antd";
const ChatOpenAi = () => {
  const [query, setQuery] = useState(""); // Lưu trữ câu hỏi của người dùng
  const [chatResponse, setChatResponse] = useState(""); // Lưu trữ phản hồi của chatbot
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const [prompts, setPrompts] = useState([]);
  const handleSendMessage = async () => {
    if (!query.trim()) return; // Kiểm tra nếu không có câu hỏi nào được nhập

    setLoading(true);
    try {
      const userId = "abc-123"; // Mã người dùng, có thể thay đổi hoặc lấy từ state
      const response = await sendChatMessage(query, userId); // Gọi API để gửi tin nhắn
      const prompts = response.answer.split(", ");

      console.log(prompts);
      setPrompts([...prompts]);
      setChatResponse(response);
      setQuery(""); // Hiển thị phản hồi từ chatbot
    } catch (error) {
      setChatResponse("Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between border-2 border-gray-500 rounded-md max-w-[600px] mx-auto p-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="outline-none w-full block "
          type="text"
        ></textarea>
        {loading ? (
          <AiOutlineLoading3Quarters className="size-[30px] hover:opacity-50 cursor-pointer animate-spin" />
        ) : (
          <IoIosSend
            onClick={handleSendMessage}
            className="size-[30px] hover:opacity-50 cursor-pointer"
          />
        )}
      </div>
      {loading && <Skeleton className="p-2" />}
      {chatResponse && (
        <div className="p-5 ">
          <div className="flex items-center gap-2 p-2 bg-slate-500 rounded-sm shadow-md w-fit text-white">
            {" "}
            <img className="size-[40px]" src="logo.png" alt="logo" />
          </div>
          <pre className="mt-4 text-wrap">{chatResponse.answer}</pre>
          <div>
            <GenerateListImage prompts={prompts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatOpenAi;

import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { sendChatMessage } from "@/apis/hf_chat";
import { IoIosSend } from "react-icons/io";
import GenerateListImage from "./GenerateListImage";
import { Button, notification, Select, Skeleton } from "antd";
import { HiSpeakerWave } from "react-icons/hi2";
import AudioPlayer from "./AudioPlayer ";
import { useAtom } from "jotai";
import { data } from "@/states/main";
import { Link } from "react-router";
import VoiceGenerate from "./SpeakAndRecord";
import SpeakAndRecord from "./SpeakAndRecord";
import TextToAudio from "./TextToAudio";
const GenerateText = () => {
  const [data_a, setData_a] = useAtom(data);
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.error({
      message: "Something wrong!",
      description: "You are missing content field!.",
      placement,
    });
  };

  const [error, setError] = useState({
    state: false,
    message: "",
  });
  const [content, setContent] = useState(""); // Lưu trữ kịch bản của người dùng.
  const [duration, setDuration] = useState(20); // Lưu thời lượng video.
  const [size, setSize] = useState({
    width: 1280,
    height: 720,
  }); // Lưu thời lượng video.

  const [chatResponse, setChatResponse] = useState(""); // Lưu trữ phản hồi của chatbot
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const handleChangeRatio = (value) => {
    console.log(`selected ${value}`);
    let sizevalue;
    switch (value) {
      case "169":
        sizevalue = {
          width: 1280,
          height: 720,
        };
        break;
      case "916":
        sizevalue = {
          width: 720,
          height: 1280,
        };
        break;
      default:
        break;
    }
    setSize(sizevalue);
  };
  const handleSend = async () => {
    if (!content.trim()) {
      openNotification("top");

      return;
    } // Kiểm tra nếu không có câu hỏi nào được nhập

    setLoading(true);
    setChatResponse("");
    try {
      // const userId = "abc-123"; // Mã người dùng, có thể thay đổi hoặc lấy từ state
      const response = await sendChatMessage(
        content +
          `. Write a short paragraph that AI can speech in ${duration} seconds, Do not format anything just text.`
      );
      const prompts = await sendChatMessage(
        response +
          " . From this paragraph, give suggestions for creating related images. give suggestions not title. limit suggestion to 6 suggestions. each suggestion start with number start with 1"
      );

      const result = {
        user_content: content,
        duration: duration,
        size: size,
        script: response,
        prompts: prompts
          .split(/\d{1,2}\.\s/)
          .map((scene) => scene.trim())
          .filter((scene) => scene),
        state: true,
      };
      setData_a(result);
      setChatResponse(response);
    } catch (error) {
      setChatResponse(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {contextHolder}

      <div>
        <h3 className="font-bold text-[1.5rem]">Enter your content!</h3>

        <div className="flex items-center justify-between border-2 border-gray-500 rounded-md max-w-[600px]  p-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your content..."
            className="outline-none w-full block "
            type="text"
          ></textarea>
        </div>
        <h3 className="font-bold text-[1.5rem]">
          How long your video? (seconds)
        </h3>
        <div className="flex items-center justify-between border-2 border-gray-500 rounded-md max-w-[120px]  p-2">
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Your time..."
            className="outline-none w-full block "
            max={180}
            min={20}
            type="number"
          ></input>
        </div>
        <div className="text-[2rem]">
          <h3 className="font-bold text-[1.5rem]">Video ratio?</h3>

          <Select
            className=" border-2 border-gray-500 rounded-md"
            defaultValue="169"
            style={{
              width: 120,
            }}
            size="large"
            onChange={handleChangeRatio}
            options={[
              {
                value: "916",
                label: "9:16",
              },
              {
                value: "169",
                label: "16:9",
              },
            ]}
          />
        </div>

        {loading ? (
          <AiOutlineLoading3Quarters className="size-[30px] hover:opacity-50 cursor-pointer mt-4 animate-spin" />
        ) : (
          <Button
            className="mt-4"
            type="primary"
            size="large"
            onClick={handleSend}
          >
            CREATE
          </Button>
        )}
        {loading && <Skeleton active className="p-4" />}
        {chatResponse && (
          <div className="p-5 ">
            <div className="flex items-center gap-2 p-2 bg-slate-500 rounded-sm shadow-md w-fit text-white">
              {" "}
              <img className="size-[40px]" src="logo.png" alt="logo" />
            </div>

            <pre className="mt-4 text-wrap">{chatResponse}</pre>
            <TextToAudio />
          </div>
        )}
        {data_a.state && (
          <>
            <Link to={"/generateimage"}>
              <Button type="primary" size="large">
                Next
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default GenerateText;

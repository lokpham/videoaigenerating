import React, { useState } from "react";
import { generateImageFlux } from "@/apis/hf_flux";
import { Image } from "antd";
import { sendChatMessage } from "@/apis/hf_chat";
import AudioPlayer from "./AudioPlayer ";
import VideoMaker from "./VideoMaker";
import { useAtom } from "jotai";
import { data } from "@/states/main";
import { Link } from "react-router";

const GenerateListImage = ({ data, size }) => {
  const [imageUrls, setImageUrls] = useState([]); // URLs of generated images
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const generateImage = async () => {
    setError(null);
    setLoading(true);
    setImageUrls([]); // Reset the image URLs trước khi bắt đầu

    try {
      const prompts = data;
      console.log(prompts);
      const batchSize = 3; // Số lượng yêu cầu đồng thời
      const delay = 2000; // Thời gian chờ giữa các batch (ms)
      const results = [];

      // Hàm để xử lý chờ
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (let i = 0; i < prompts.length; i += batchSize) {
        const batch = prompts.slice(i, i + batchSize); // Chia các prompt theo batch

        // Xử lý batch bằng Promise.all
        const batchResults = await Promise.all(
          batch.map(async (prompt) => {
            try {
              const response = await generateImageFlux({
                inputs: prompt + `, image size is ${size.width}x${size.height}`,
              });
              const imageUrl = URL.createObjectURL(response);
              return imageUrl;
            } catch (error) {
              console.error(
                "Error processing the query for prompt:",
                prompt,
                error
              );
              return null; // Trả về null nếu có lỗi
            }
          })
        );

        results.push(...batchResults.filter((url) => url !== null)); // Lưu kết quả hợp lệ
        await wait(delay); // Đợi trước khi xử lý batch tiếp theo
      }

      setImageUrls(results);
    } catch (error) {
      console.error("Error generating images:", error);
      setError("There was an error generating images.");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="font-bold">Let's create your images</h1>
      <br />
      <button
        onClick={generateImage}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? (
          <div className="p-3 text-white shadow-sm rounded-sm hover:opacity-65 bg-gray-500">
            Generating...
          </div>
        ) : (
          <>
            {imageUrls.length > 0 ? (
              ""
            ) : (
              <div className="p-3 mt-2  text-white shadow-sm rounded-md hover:opacity-65 bg-gray-500">
                Generate Images
              </div>
            )}
          </>
        )}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && (
        <div className="flex justify-center">
          <img src="loading.gif" alt="loading" />
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        {imageUrls?.map((item, index) => {
          return (
            <Image
              key={index}
              width={size.width}
              height={size.height}
              src={item}
            />
          );
        })}
        {imageUrls?.length > 0 ? <Link to={"/createvideo"}>Next</Link> : ""}
      </div>
    </div>
  );
};

export default GenerateListImage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { generateImageFlux } from "@/apis/hf_flux";
import { Image } from "antd";
const GenerateListImage = ({ prompts }) => {
  const [imageUrls, setImageUrls] = useState([]); // URL ảnh được tạo
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi nếu có

  const generateImage = async () => {
    setError(null);
    setLoading(true);
    setImageUrls([]);
    for (let i = 0; i < prompts.length; i++) {
      try {
        const response = await generateImageFlux({ inputs: prompts[i] });
        // Use the image blob
        console.log("Image blob received:", response);
        // Example: Create an image URL
        const imageUrl = URL.createObjectURL(response);
        setImageUrls((pre) => [...pre, imageUrl]);
        console.log("Generated Image URL:", imageUrl);
      } catch (error) {
        console.error("Error processing the query:", error);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="font-bold">Lets create your images</h1>
      <br />
      <button
        onClick={generateImage}
        disabled={loading}
        style={{ padding: "10px 20px" }}
      >
        {loading ? (
          <div className="p-3 text-white shadow-sm rounded-sm hover:opacity-65 bg-gray-500">
            {" "}
            Generating...
          </div>
        ) : (
          <div className="p-3 text-white shadow-sm rounded-sm hover:opacity-65 bg-gray-500">
            Generate Images
          </div>
        )}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && (
        <div className="flex justify-center">
          <img src="loading.gif" alt="" />
        </div>
      )}
      <div className="flex gap-2 items-center">
        {imageUrls?.map((item, index) => {
          return <Image width={200} src={item} />;
        })}
      </div>
    </div>
  );
};

export default GenerateListImage;

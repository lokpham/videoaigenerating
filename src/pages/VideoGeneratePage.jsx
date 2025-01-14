import React, { useState } from "react";
import ChatOpenAi from "@/components/ChatOpenAi";

const VideoGeneratePage = () => {
  return (
    <div className="p-4">
      <div>
        <p className="font-bold text-[2rem]">
          Here is steps to create your video with our AI
        </p>
        <ul className="list-decimal">
          <li>Enter your script</li>
          <li>
            Click generate images and wait{" "}
            <span className="text-red-600">
              (Limit: 9 images, its will take long time to generate)
            </span>
          </li>
          <li></li>
        </ul>
      </div>
      <ChatOpenAi />
    </div>
  );
};

export default VideoGeneratePage;

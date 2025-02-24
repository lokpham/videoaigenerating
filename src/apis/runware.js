import axios from "axios";

const API_KEY = import.meta.env.VITE_runware_key;

export const GenerateImage = async (prompt, size) => {
  const width = parseInt(size.width);
  const height = parseInt(size.height);
  console.log(width, height);
  const requestBody = [
    {
      taskType: "authentication",
      apiKey: API_KEY,
    },
    {
      taskType: "imageInference",
      taskUUID: "39d7207a-87ef-4c93-8082-1431f9c1dc97",
      positivePrompt: prompt,
      width: 1024,
      height: 1792,
      modelId: "runware:100@1",
      numberResults: 1,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.runware.ai/v1",
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
        responseType: "blob",
      }
    );

    const imageData = response.data.data.find(
      (task) => task.taskType === "imageInference"
    );
    if (imageData) {
      return [imageData.imageURL]; // Return the image URL
    } else {
      throw new Error("Image generation failed." + response.data);
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

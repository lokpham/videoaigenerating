import axios from "axios";
const API_KEY = import.meta.env.VITE_hf_key;

export async function generateImageFlux(data) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      data,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Ensures the response is treated as a Blob
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error querying the model:", error);
    throw error;
  }
}

// query({ inputs: "Astronaut riding a horse" })
//   .then((response) => {
//     // Use image
//     console.log("Image blob received:", response);
//   })
//   .catch((error) => {
//     console.error("Error handling the response:", error);
//   });

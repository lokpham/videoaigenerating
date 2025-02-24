import { useState, useEffect } from "react";
import { ElevenLabsClient } from "elevenlabs";
import { data } from "@/states/main";
import { useAtom } from "jotai";

const client = new ElevenLabsClient({
  apiKey: "sk_38a45fb1dfd7caedbba4881f908f9e90b2fe91e9d215450a",
});

export default function TextToAudio() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data_a] = useAtom(data);

  const generateAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": "sk_38a45fb1dfd7caedbba4881f908f9e90b2fe91e9d215450a",
          },
          body: JSON.stringify({
            text: data_a.script,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    generateAudio();
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <div className="p-4">
      {loading && <p>Generating...</p>}
      {audioUrl && (
        <audio controls className="mt-4">
          <source src={audioUrl} type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
      )}
    </div>
  );
}

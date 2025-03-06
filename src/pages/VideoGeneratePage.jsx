import { Box, Input, Select, Button, VStack, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import {
  NumberInputField,
  NumberInputLabel,
  NumberInputRoot,
} from "@/components/ui/number-input";

const frameworks = createListCollection({
  items: [
    {
      label: "16:9",
      value: "169",
    },
    {
      label: "9:16",
      value: "916",
    },
    {
      label: "1:1",
      value: "11",
    },
  ],
});
const VideoGeneratePage = () => {
  const [ratio, setRatio] = useState([]);
  const [duration, setDuration] = useState(20);
  console.log(ratio);
  return (
    <div className="p-4">
      <div className="max-w-[800px] mx-auto">
        <p className="font-bold text-[2rem]">
          Here is steps to create your video with our AI
        </p>
        <VStack gapY={5} alignItems={"start"}>
          <Field label="Prompt">
            <Textarea placeholder="Enter your prompt" />
          </Field>
          <Field
            label="Duration"
            helperText="Enter a number between 20 and 60"
            errorText="This field is required and enter a number between 20 and 60"
          >
            <NumberInputRoot
              value={duration}
              max={60}
              min={20}
              onValueChange={(e) => setDuration(e.value)}
            >
              <NumberInputLabel />
              <NumberInputField />
            </NumberInputRoot>
          </Field>
          <SelectRoot
            required
            collection={frameworks}
            width="320px"
            value={ratio.label}
            onValueChange={(e) => setRatio(e.value)}
          >
            <SelectLabel>Select Ratio</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.items.map((movie) => (
                <SelectItem item={movie} key={movie.value}>
                  {movie.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </VStack>
      </div>
    </div>
  );
};

export default VideoGeneratePage;

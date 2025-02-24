import GenerateListImage from "@/components/GenerateListImage";
import { data } from "@/states/main";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const GenerateImage = () => {
  const [data_a, setData_a] = useAtom(data);
  const navigate = useNavigate();
  useEffect(() => {
    if (data_a.state == false) {
      console.log("redirect");
      navigate("/VideoGenerate");
      return;
    }
    console.log(data_a.prompts);
  }, []);
  return (
    <div>
      <GenerateListImage data={data_a.prompts} size={data_a.size} />
    </div>
  );
};

export default GenerateImage;

import { atom } from "jotai";
export const data = atom({
  user_content: "",
  duration: "",
  size: "",
  script: "",
  prompts: [],
  state: false,
  audio: null,
});

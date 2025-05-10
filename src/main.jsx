import { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Default from "./layouts/default";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Default/>
  </StrictMode>
);

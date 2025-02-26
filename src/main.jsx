import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import Default from "./layouts/default";
import GenerateImage from "./pages/GenerateImage";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const VideoGeneratePage = lazy(() => import("./pages/VideoGeneratePage"));
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Default />}>
          <Route index element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/videogenerate" element={<VideoGeneratePage />}></Route>
          <Route path="/generateimage" element={<GenerateImage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

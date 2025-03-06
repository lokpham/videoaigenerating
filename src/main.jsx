import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { Provider } from "./components/ui/provider";
import Default from "./layouts/default";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const VideoGeneratePage = lazy(() => import("./pages/VideoGeneratePage"));
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Default />}>
            <Route index element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route
              path="/videogenerate"
              element={<VideoGeneratePage />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

import { Buffer } from "buffer";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

createRoot(document.getElementById("root")!).render(<App />);

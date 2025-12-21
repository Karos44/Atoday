import React from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

root.innerHTML = `
  <div style="
    color:#ffaa00;
    font-family:'JetBrains Mono', monospace;
    padding:40px;
  ">
    <h1>ARCHIVE TERMINAL ONLINE</h1>
    <p>STATUS: OK</p>
    <p>TIME: ${new Date().toLocaleString()}</p>
  </div>
`;

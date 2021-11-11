import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "/src/test/debug-test";
import Hello from "/src/test/uplot-react-test";

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <Hello />,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "/src/test/debug-test";
import TestUplot from "/src/test/uplot-react-test";
import ChanUplot from "/src/chan/chan";

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  // <TestUplot />,
  <ChanUplot />,
  document.getElementById("root")
);

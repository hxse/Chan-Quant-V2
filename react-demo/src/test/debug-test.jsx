import React from "react";
import { useState } from "react";

function App() {
  const [clicks, setClicks] = useState(0);
  console.log("I render 😁");
  function countAdd() {
    setClicks((clicks) => {
      console.log("click...");
      debugger;
      return clicks + 1;
    });
  }
  return (
    <div>
      <header>
        <button onClick={countAdd}>Clicks: {clicks}</button>
      </header>
    </div>
  );
}

export default App;

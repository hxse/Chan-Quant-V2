import UplotReact from "uplot-react";
import candleOpt from "./candleOpt";
import { funcDataUplot } from "../func/generateIndicator";
import React, { useState } from "react";

function CandlePlot({ dataObj, config }) {
  const [opt, setOpt] = useState(candleOpt({ dataObj, config }));
  const title = "candle";
  if (opt.title != title) {
    setOpt((opt) => {
      opt["title"] = title;
      opt["series"][1]["stroke"] = "rgb(100,100,200)";
      console.log("change Candle opt:", opt);
      return opt;
    });
  }
  const uplotData = funcDataUplot(dataObj, config);

  return (
    <UplotReact
      key="hooks-key"
      options={opt}
      data={uplotData}
      //   target={root}
      onDelete={() => console.log("Deleted from hooks")}
      onCreate={() => console.log("Created from hooks")}
    />
  );
}
export default React.memo(CandlePlot);

import UplotReact from "uplot-react";
import horseOpt from "./horseOpt";
import { funcDataUplot } from "../func/generateIndicator";
import React, { useState } from "react";

function HorsePlot({ dataObj, config }) {
  const opt = horseOpt({ dataObj, config });
  const uplotData = [dataObj.tohlcv[0].slice(config.smaExtra), []];

  console.log("render horsePlot:", uplotData);
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
export default React.memo(HorsePlot);

import UplotReact from "uplot-react";
import React, { useState } from "react";
import usePlot from "../hook/usePlot";
import getOpt from "./horseOpt";

const rangeState = {
  minLast: undefined,
  maxLast: undefined,
  dataCountCurrent: undefined,
  dataCountLast: undefined,
};
function HorsePlot({ dataObj, config, state }) {
  let mode = "opt"; //horse需要从插件中加载数据,如果用data模式,数据会空
  const [uplotData, uplotData_cur, opt] = usePlot({
    mode: mode,
    id: "horsePlot",
    getOpt,
    dataObj,
    config,
    state,
    rangeState,
  });
  return (
    <UplotReact
      key="hooks-key"
      options={opt}
      data={uplotData}
      //   target={root}
      onDelete={() => console.log("Deleted from hooks horseUplot")}
      onCreate={(u) => {
        console.log("Created from hooks horseUplot");
        if (mode == "opt") {
          u.setData(uplotData_cur);
        }
      }}
    />
  );
}
export default React.memo(HorsePlot);

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
function HorsePlot({ dataObj, config, state, plots }) {
  let mode = "opt"; //horse需要从插件中加载数据,如果用data模式,数据会空
  const id = "horsePlot";
  const [uplotData, uplotData_cur, opt] = usePlot({
    id: id,
    mode: mode,
    getOpt,
    dataObj,
    config,
    state,
    rangeState,
    plots,
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
        plots[id] = u;
        if (mode == "opt") {
          u.setData(uplotData_cur);
        }
      }}
    />
  );
}
export default React.memo(HorsePlot);

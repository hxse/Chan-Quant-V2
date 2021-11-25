import UplotReact from "uplot-react";
import React, { useState } from "react";
import usePlot from "../hook/usePlot";
import getOpt from "./candleOpt";

const rangeState = {
  minLast: undefined,
  maxLast: undefined,
  dataCountCurrent: undefined,
  dataCountLast: undefined,
};
function CandlePlot({ dataObj, config, state }) {
  let mode = "opt";
  const [uplotData, uplotData_cur, opt] = usePlot({
    mode: mode,
    id: "candlePlot",
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
          //在这加载数据的好处是只渲染一次(通过更新opt来刷新数据),在isUpdateCandle里加载会渲染两次
          u.setData(uplotData_cur);
        }
      }}
    />
  );
}
export default React.memo(CandlePlot);

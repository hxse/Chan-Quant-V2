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
function CandlePlot({ dataObj, config, state, plots, scale }) {
  let mode = "opt";
  const id = "candlePlot";
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
      onDelete={() => console.log("Deleted from hooks candleUplot")}
      onCreate={(u) => {
        console.log("Created from hooks candleUplot");
        plots[id] = u;
        if (mode == "opt") {
          //在这加载数据的好处是只渲染一次(通过更新opt来刷新数据),在isUpdateCandle里加载会渲染两次
          u.setData(uplotData_cur);
        }
        if (scale) {
          //在开始时设置scale,可以用在screenshot上
          const min = scale[0];
          const max = scale[1]; //一定要注意减1,否则引起精度bug
          // u.setScale("x", {
          //   min,
          //   max,
          // });
          debugger;
        }
      }}
    />
  );
}
export default React.memo(CandlePlot);

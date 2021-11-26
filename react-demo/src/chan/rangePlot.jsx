import UplotReact from "uplot-react";
import React, { useState } from "react";
import usePlot from "../hook/usePlot";
import getOpt from "./rangeOpt";
import { funcDataUplot } from "../func/funcIndicator";

const rangeState = {
  minLast: undefined,
  maxLast: undefined,
  dataCountCurrent: undefined,
  dataCountLast: undefined,
};
function RangePlot({ dataObj, config, state, plots }) {
  let mode = "opt"; //horse需要从插件中加载数据,如果用data模式,数据会空
  const id = "rangePlot";
  //   const uplotData_cur = funcDataUplot(dataObj, config, "sma");
  //   const [uplotData, setUplotData] = useState(uplotData_cur);
  //   const opt_cur = getOpt({ dataObj, config, plots });
  //   const [opt, setOpt] = useState(opt_cur);

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
      onDelete={(u) => {
        console.log("Deleted from hooks rangeUplot");
        let plot = u.root.querySelector(".u-over");
        plot.removeEventListener("wheel", () => {});
      }}
      onCreate={(u) => {
        console.log("Created from hooks rangeUplot");
        plots[id] = u;
        if (mode == "opt") {
          u.setData(uplotData_cur);
        }
      }}
    />
  );
}
export default React.memo(RangePlot);

import UplotReact from "uplot-react";
import React, { useState, useEffect } from "react";
import usePlot from "../hook/usePlot";
import getOpt from "./candleOpt";
import { funcDataUplot } from "../func/funcIndicator";

const rangeState = {
  minLast: undefined,
  maxLast: undefined,
  dataCountCurrent: undefined,
  dataCountLast: undefined,
};

function Screenshot({ dataObj, config, states, plots }) {
  console.log("enter: screenshot");
  const [copyPlots, setCopyPlots] = useState([]);
  const { candleState, horseState, rangeState } = states;
  const mode = "opt";
  const opt = getOpt({ dataObj, config, plots, name: "copyCandle", uncursor: true });
  const uplotData_cur = funcDataUplot(dataObj, config, "sma");
  const [uplotData, setUplotData] = useState(uplotData_cur);
  const id = "candlePlot_";
  const scale = [5, 15];
  opt.weight = 800;
  opt.height = 500;

  if (dataObj.store.at(config.smaExtra).storeArrHistory == undefined) {
    debugger;
  }
  const storeArr = dataObj.store
    .at(config.smaExtra)
    .storeArrHistory.filter((i) => !i.blob)
    .slice(-2);
  useEffect(() => {
    for (const plot of copyPlots) {
      // console.log(plot);
      // const data = plot.ctx.canvas.toDataURL();
    }
    return () => {
      while (copyPlots.length > 0) {
        const plot = copyPlots.pop();
        //在return里会延迟一个更新周期
        // const data = plot.ctx.canvas.toDataURL();
        // (async (text) => {
        //   await navigator.clipboard.writeText(text);
        //   debugger;
        // })(data);
      }
    };
  });
  return (
    <div>
      {storeArr.map((store, index) => {
        index;
        return (
          <div key={"screen" + index} id={"screen" + index}>
            <UplotReact
              // key={"screenPlot" + index}
              options={opt}
              data={uplotData}
              //   target={root}
              onDelete={() => console.log("Deleted from hooks screenshot")}
              onCreate={(u) => {
                console.log("Created from hooks screenshot");

                copyPlots.push(u);
                u.setData(uplotData_cur); //放这里只渲染一次

                if (scale) {
                  const min = store.storeData.idx - 50;
                  const max = store.deleteIdx + 50 ? store.deleteIdx : store.storeData.idx + 10; //一定要注意减1,否则引起精度bug
                  u.setScale("x", {
                    min,
                    max,
                  });
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
export default React.memo(Screenshot);

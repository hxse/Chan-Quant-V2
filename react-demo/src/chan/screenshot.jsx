import UplotReact from "uplot-react";
import React, { useState, useEffect } from "react";
import usePlot from "../hook/usePlot";
import getCandleOpt from "./candleOpt";
import getHorseOpt from "./horseOpt";
import getRangeOpt from "./rangeOpt";
import { funcDataUplot } from "../func/funcIndicator";
import screenshotPlugin from "../plugin/screenshotPlubin";

const rangeState = {
  minLast: undefined,
  maxLast: undefined,
  dataCountCurrent: undefined,
  dataCountLast: undefined,
};
export function setScale(start, end, range, length) {
  const min = parseInt(start) - range;
  const max = end ? parseInt(end) + range : length - 1; //一定要注意减1,否则引起精度bug
  return [min, max];
}
function Screenshot({ dataObj, config, states, plots }) {
  console.log("enter: screenshot");
  const [copyPlots, setCopyPlots] = useState([]);
  const { candleState, horseState, rangeState } = states;
  const mode = "opt";

  const opt = getCandleOpt({ dataObj, config, plots, name: "copyCandle", uncursor: true });
  const uplotData_cur = funcDataUplot(dataObj, config, "sma");
  const horseOpt = getHorseOpt({ dataObj, config, plots, name: "copyHorse", uncursor: true });
  const rangeOpt = getRangeOpt({ dataObj, config, plots, name: "copyRange", uncursor: true });
  const [uplotData, setUplotData] = useState(uplotData_cur);

  const [weight, height] = [800, 500];
  // opt.weight = weight;
  // opt.height = height;
  opt.plugins = [...opt.plugins, screenshotPlugin({ dataObj, config, name: "copyCandle" })];
  // horseOpt.weight = weight;
  // horseOpt.height = height;
  horseOpt.plugins = [...horseOpt.plugins, screenshotPlugin({ dataObj, config, name: "copyHorse" })];
  // rangeOpt.weight = weight;
  // rangeOpt.height = height;
  rangeOpt.plugins = [screenshotPlugin({ dataObj, config, name: "copyRange" })];

  if (dataObj.store.at(config.smaExtra).storeArrHistory == undefined) {
    debugger;
  }

  const lastNum = 3;
  const storeArr = dataObj.store
    .at(config.smaExtra)
    .storeArrHistory.filter((i) => !i.blob)
    .slice(-lastNum)
    .filter((i) => i.send != true);

  for (const store of storeArr) {
    //标记send,已经发送过的store无需重复发送
    store.send = true;
  }

  return (
    <div>
      {storeArr.map((store, index) => {
        index;
        const scale = true;
        const range = 50;
        const [min, max] = setScale(store.storeData.idx, store.deleteIdx, range, dataObj.tohlcv[0].length);
        rangeOpt.hooks = {
          draw: [
            (u) => {
              let left = Math.round(u.valToPos(min, "x"));
              let width = Math.round(u.valToPos(max, "x")) - left;
              let height = u.bbox.height / devicePixelRatio;
              u.setSelect(
                {
                  left,
                  width,
                  height,
                },
                false
              );
            },
          ],
        };

        return (
          <div key={"screen_" + index} id={"screen_" + index}>
            <div key={"candlePlot_" + index} id={"candlePlot_" + index}>
              <UplotReact
                // key={""}
                options={opt}
                data={uplotData}
                //   target={root}
                onDelete={() => console.log("Deleted from hooks " + "candlePlot_" + index)}
                onCreate={(u) => {
                  console.log("Created from hooks screenshot");
                  u.setData(uplotData_cur); //放这里只渲染一次

                  if (scale) {
                    u.setScale("x", {
                      min,
                      max,
                    });
                  }
                }}
              />
            </div>
            <div key={"horsePlot_" + index} id={"horsePlot_" + index}>
              <UplotReact
                // key={""}
                options={horseOpt}
                data={uplotData}
                //   target={root}
                onDelete={() => console.log("Deleted from hooks screenshot")}
                onCreate={(u) => {
                  console.log("Created from hooks screenshot");
                  u.setData(uplotData_cur); //放这里只渲染一次

                  if (scale) {
                    u.setScale("x", {
                      min,
                      max,
                    });
                  }
                }}
              />
            </div>
            <UplotReact
              // key="hooks-key"
              options={rangeOpt}
              data={uplotData}
              //   target={root}
              onDelete={(u) => {
                console.log("Deleted from hooks rangeUplot");
              }}
              onCreate={(u) => {
                console.log("Created from hooks rangeUplot");
                if (mode == "opt") {
                  u.setData(uplotData_cur);
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

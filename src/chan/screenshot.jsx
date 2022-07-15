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
  // horseOpt.weight = weight;
  // horseOpt.height = height;
  // rangeOpt.weight = weight;
  // rangeOpt.height = height;

  // opt.plugins = [...opt.plugins, screenshotPlugin({ dataObj, config, name: "copyCandle" })];
  // horseOpt.plugins = [...horseOpt.plugins, screenshotPlugin({ dataObj, config, name: "copyHorse" })];
  // rangeOpt.plugins = [screenshotPlugin({ dataObj, config, name: "copyRange" })];

  if (dataObj.store.at(config.smaExtra).storeArrHistory == undefined) {
    debugger;
  }

  const lastNum = config.lastPostNum;

  const storeArrHistory = dataObj.store.at(config.smaExtra).storeArrHistory;
  const dom = [];
  for (const [index, store] of Object.entries(storeArrHistory)) {
    if (storeArrHistory.length - index > lastNum) continue;
    if (store.send == true) continue;
    store.send = true;

    const scale = true;
    const range = config.sendRange;
    let [min, max] = setScale(store.storeData.idx, store.deleteIdx, range, dataObj.tohlcv[0].length);
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

    opt.plugins = [
      ...opt.plugins,
      screenshotPlugin({
        dataObj,
        config,
        name: "copyCandle",
        postArgs: {
          time: store?.enterObj?.value?.currentData.time,
          timeStr: store?.enterObj?.value?.currentData.timeStr,
          close: store?.enterObj?.value?.currentData.close,
        },
      }),
    ];
    horseOpt.plugins = [
      ...horseOpt.plugins,
      screenshotPlugin({
        dataObj,
        config,
        name: "copyHorse",
        postArgs: {
          time: store?.enterObj?.value?.currentData.time,
          timeStr: store?.enterObj?.value?.currentData.timeStr,
          close: store?.enterObj?.value?.currentData.close,
        },
      }),
    ];
    rangeOpt.plugins = [
      screenshotPlugin({
        dataObj,
        config,
        name: "copyRange",

        enterObj: store?.enterObj?.value?.currentData,
        leaveObj: store?.leaveObj?.value?.currentData,
      }),
    ];

    dom.push(
      <div key={`screen_${index}`} id={`screen${index}`}>
        <div key={`candlePlot_${index}`} id={`candlePlot_${index}`}>
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
        <div key={`horsePlot_${index}`} id={`horsePlot_${index}`}>
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
        <div key={`rangePlot_${index}`} id={`rangePlot_${index}`}>
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
      </div>
    );
  }
  return <div>{dom}</div>;
}
export default React.memo(Screenshot);

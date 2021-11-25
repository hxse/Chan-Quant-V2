import uPlot from "uplot";
import UplotReact from "uplot-react";
import candleOpt from "./candleOpt";
import { funcDataUplot } from "../func/funcIndicator";
import React, { useState } from "react";

let mode = "opt"; //data 或者是 opt 不同的写法
//如果是opt模式, 需要在isUpdateCandle里写setOpt和onCreate里写setData
//opt模式的好处是,可以在每次渲染的时候,允许改变opt,缺点是需要重载组件,每次更新数据都会触发onCreate和onDelete
//如果是data模式,就只需要在isUpdateCandle里写setData
//data模式的好处是,不需要重构UplotReact组件,更新数据的时候只需要刷新图表就好了,不会触发onCreate和onDelete,但是不允许在更新数据的时候改变opt,只能在初始化时改变
let minLast, maxLast, dataCountLast, rangeCount;
function CandlePlot({ dataObj, config, isUpdate, isInit, isWaiting }) {
  console.log("enter candlePlot");
  // const uplotData = funcDataUplot(dataObj, config, "sma");
  const [uplotData, setUplotData] = useState(funcDataUplot(dataObj, config, "sma"));
  const [opt, setOpt] = useState();
  const newOpt = candleOpt({ dataObj, config });
  const [change, setChange] = useState(false);
  rangeCount = 0;

  newOpt["title"] = "candle";
  newOpt["scales"]["x"] = {
    ...newOpt["scales"]["x"],
    range: (u, min, max) => {
      //为什么不要用setScale,而是用range: https://github.com/leeoniya/uPlot/issues/285
      console.log("上一次重绘坐标 x", minLast, maxLast);
      console.log("下一次重绘坐标 x", min, max);
      console.log(maxLast + 1, dataCountLast, u.data[0].length, rangeCount);
      if (dataCountLast != u.data[0].length) {
        min = minLast;
        let _ = maxLast + 1 != dataCountLast;
        if (_) {
          max = maxLast;
        }
      }
      rangeCount++;
      dataCountLast = u.data[0].length;
      minLast = min;
      maxLast = max;
      return uPlot.rangeNum(min, max, 0, true);
    },
  };

  if (isInit) {
    isInit = false;
    minLast = 0;
    maxLast = uplotData[0].length - 1;
    console.log("init set newOpt");
    setOpt(newOpt);
    setUplotData(funcDataUplot(dataObj, config, "sma"));
    setChange(true);
  }
  if (isUpdate) {
    isUpdate = false;
    const title = "upDateing...";
    newOpt["title"] = title;
    if (mode == "opt") {
      setOpt(newOpt);
      console.log("change Candle opt:", opt);
    } else {
      console.log("set data:", data[0].length);
      setUplotData(funcDataUplot(dataObj, config, "sma"));
    }
    setChange(true);
  }
  if (isWaiting) {
    isWaiting = false;
    const title = "waiting...";
    if (opt["title"] != title) {
      newOpt["title"] = title;
      // setOpt(newOpt);//不能用这个,因为会重新渲染性能浪费,而且会刷新range
      document.body.querySelector(".u-title").textContent = title;
    }
  }
  console.log("end candlePlot");
  return (
    <UplotReact
      id="candle"
      key="hooks-key"
      options={opt}
      data={uplotData}
      //   target={root}
      onDelete={(u) =>
        console.log("Deleted from hooks candleUplot", u.scales.x && u.scales.x.min, u.scales.x && u.scales.x.max)
      }
      onCreate={(u) => {
        if (mode == "opt") {
          //在这加载数据的好处是只渲染一次(通过更新opt来刷新数据),在isUpdateCandle里加载会渲染两次
          u.setData(funcDataUplot(dataObj, config, "sma"));
        }
        console.log("Created from hooks candleUplot");
      }}
    />
  );
}
export default React.memo(CandlePlot);

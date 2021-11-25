import React, { useState } from "react";
import { funcDataUplot } from "../func/funcIndicator";
import uPlot from "uplot";

// let minLast, maxLast, dataCountCurrent, dataCountLast;
//用这个不行,因为在不同组件复用hook时,这些变量会共享,引发冲突,应该用useState(),变量就不会共享了

let mode = "opt"; //data 或者是 opt 不同的写法
//如果是opt模式, 需要在isUpdateCandle里写setOpt和onCreate里写setData
//opt模式的好处是,可以在每次渲染的时候,允许改变opt,缺点是需要重载组件,每次更新数据都会触发onCreate和onDelete
//如果是data模式,就只需要在isUpdateCandle里写setData
//data模式的好处是,不需要重构UplotReact组件,更新数据的时候只需要刷新图表就好了,不会触发onCreate和onDelete,但是不允许在更新数据的时候改变opt,只能在初始化时改变

export default function usePlot({ mode, id, dataObj, config, getOpt, state, rangeState }) {
  console.log(`enter ${id}`);

  const uplotData_cur = funcDataUplot(dataObj, config, "sma");
  const [uplotData, setUplotData] = useState(uplotData_cur);
  const [opt, setOpt] = useState();
  const newOpt = getOpt({ dataObj, config });

  rangeState.dataCountCurrent = uplotData_cur[0].length;

  newOpt["title"] = "candle";
  newOpt["scales"]["x"] = {
    ...newOpt["scales"]["x"],
    range: (u, min, max) => {
      //为什么不要用setScale,而是用range: https://github.com/leeoniya/uPlot/issues/285
      console.log(id, "上一次重绘坐标 x", rangeState.minLast, rangeState.maxLast);
      console.log(id, "下一次重绘坐标 x", min, max);
      console.log(rangeState.dataCountLast, rangeState.dataCountCurrent, u.data[0].length);
      if (rangeState.dataCountLast != rangeState.dataCountCurrent) {
        min = rangeState.minLast;
        if (rangeState.maxLast + 1 != rangeState.dataCountLast) {
          max = rangeState.maxLast;
        }
      }
      rangeState.dataCountLast = rangeState.dataCountCurrent;
      rangeState.minLast = min;
      rangeState.maxLast = max;
      console.log("实际重绘坐标", min, max, uPlot.rangeNum(0, min, max, true));
      // return [min, max];
      return uPlot.rangeNum(min, max, 0, true);
    },
  };

  if (state.isInit) {
    state.isInit = false;
    rangeState.minLast = 0;
    rangeState.maxLast = uplotData_cur[0].length - 1;
    console.log("init set newOpt");
    setOpt(newOpt);
    // setUplotData(uplotData_cur);
  }
  if (state.isUpdate) {
    state.isUpdate = false;
    const title = "upDateing...";
    newOpt["title"] = title;
    if (mode == "opt") {
      setOpt(newOpt);
      console.log("change Candle opt");
    } else {
      console.log("set data:", uplotData_cur[0].length);
      setUplotData(uplotData_cur);
    }
  }
  if (state.isWaiting) {
    state.isWaiting = false;
    const title = "waiting...";
    if (opt["title"] != title) {
      newOpt["title"] = title;
      // setOpt(newOpt);//不能用这个,因为会重新渲染性能浪费,而且会刷新range,直接用querySelector
      document.body.querySelector(`#${id} .u-title`).textContent = title;
    }
  }
  console.log(`end ${id}`, uplotData[0].length);
  return [uplotData, uplotData_cur, opt];
}

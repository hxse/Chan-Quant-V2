import UplotReact from "uplot-react";
import React, { useState, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { setScale } from "./screenshot";

import uPlot from "uplot";
const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}/ {HH} :{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

function split(obj, arr) {
  if (Object.keys(obj).length == 0) return undefined;
  return arr.length > 1 ? split(obj[arr[0]], arr.slice(1)) : obj[arr[0]];
}
function Board({ dataObj, config, state, plots }) {
  const [isLoading, setLoading] = useState(true);
  const [moveData, setMoveData] = useState({}); //最新更新的时间
  const [updateData, setUpdateData] = useState({});

  function updateBoard(idx) {
    const [time, open, high, low, close, volume] = dataObj.tohlcv.map((i) => i[idx]);
    let data = { time: fmtDate(tzDate(parseInt(time))), open, high, low, close, volume };
    function addData(data, dataArr) {
      //dataArr的数据结构为字典
      for (let [key, item] of Object.entries(dataArr)) {
        data[key] = item[idx];
      }
    }
    addData(data, dataObj.sma);
    addData(data, dataObj.horse);
    addData(data, dataObj.quant);
    addData(data, dataObj.plan);
    data = { ...data, store: dataObj.store[idx] };
    return data;
  }
  function onmove(e) {
    const plot = plots[e.path[4].id];
    const idx = plot.cursor.idx + config.smaExtra;
    const data = updateBoard(idx);
    setMoveData(data);
  }
  function onupdate() {
    const idx = dataObj.tohlcv[0].length - 1;
    const data = updateBoard(idx);
    setUpdateData(data);
  }

  function upateLabel() {
    for (let [key, item] of Object.entries(plots)) {
      if (item == false) continue;
      item.root.querySelector("div.u-over").addEventListener("mousemove", onmove);
    }
  }
  useEffect(() => {
    if (state.isInit == false && state.isUpdate == false && state.isWaiting == false) {
      //原理是,如果组件自身重绘,那么就不会改变state里的三个值,如果state三个值改变了就说明是来自大级别的重绘
      //   console.log("已同步");
    }
    //把流程控制放里面,就拿到了渲染后的plots对象
    if (state.isInit == true) {
      setLoading(false);
      state.isInit = false;
      upateLabel();
      onupdate(); //手动触发一下
    }
    if (state.isUpdate == true) {
      state.isUpdate = false;
      upateLabel();
      onupdate(); //手动触发一下
    }
    if (state.isWaiting == true) {
      state.isWaiting = false;
    }
  });

  function clickButton(e) {
    const [start, end] = e.target.textContent.split(" ");
    for (const [name, plot] of Object.entries(plots)) {
      // debugger
      const range = config.sendRange;
      const [min, max] = setScale(start, end, range, dataObj.tohlcv[0].length);
      if (name != "rangePlot") {
        plot.setScale("x", {
          min,
          max,
        });
      } else {
        let left = Math.round(plot.valToPos(min, "x"));
        let width = Math.round(plot.valToPos(max, "x")) - left;
        let height = plot.bbox.height / devicePixelRatio;
        // debugger;
        plot.setSelect(
          {
            left,
            width,
            height,
          },
          false
        );
      }
    }
  }

  if (isLoading) {
    return <div>board loading...</div>;
  }
  return (
    <div>
      <div id="updateBoard">
        {config.board.map((i) =>
          i.endsWith("_") ? (
            <div key={i}>
              {i}: {JSON.stringify(updateData[i.slice(0, i.length - 1)])}
            </div>
          ) : undefined
        )}
      </div>
      <br />
      <div id="moveBoard">
        {config.board.map((i) =>
          i.endsWith("_") || i.includes(".") ? undefined : (
            <div key={i}>
              {i}: {JSON.stringify(moveData[i])}
            </div>
          )
        )}
      </div>
      <div id="quant" style={{ wordWrap: "break-word" }}>
        {config.board.map((i) =>
          i.includes(".") ? (
            <div key={i}>
              {i}: {JSON.stringify(split(moveData, i.split(".")))}
            </div>
          ) : undefined
        )}
      </div>
      <div id="store" style={{ wordWrap: "break-word" }}>
        "storeArr_":
        <br />
        {updateData["store"]["storeArr"].map((store, idx) => (
          <button onClick={clickButton} key={"storeArr" + idx}>
            {store.storeData.idx} {store.deleteIdx}
          </button>
        ))}
        <br />
        "storeArrHistory_":
        <br />
        {updateData["store"]["storeArrHistory"].map((store, idx) => (
          <button onClick={clickButton} key={"storeArrHistory" + idx}>
            {store.storeData.idx} {store.deleteIdx}
          </button>
        ))}
      </div>
    </div>
  );
}
export default React.memo(Board);

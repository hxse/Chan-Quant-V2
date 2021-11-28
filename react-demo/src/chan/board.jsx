import UplotReact from "uplot-react";
import React, { useState, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";

import uPlot from "uplot";
const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}-{HH}-{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

function Board({ dataObj, config, state, plots }) {
  const [time, setTime] = useState(); //光标指向的时间
  const [close, setClose] = useState();
  const [time_, setTime_] = useState(); //最新更新的时间
  const [close_, setClose_] = useState();
  const [isLoading, setLoading] = useState(true);

  function onmove(e) {
    const plot = plots[e.path[4].id];
    const idx = plot.cursor.idx;
    const data = plot.data;
    const [time, open, high, low, close] = data.map((i) => i[idx]);
    unstable_batchedUpdates(() => {
      setTime(time);
      setClose(close);
    });
  }
  function updateTime() {
    const idx = plots.candlePlot.data[0].length - 1;
    const data = plots.candlePlot.data;
    const [time, open, high, low, close] = data.map((i) => i[idx]);
    unstable_batchedUpdates(() => {
      setTime_(time);
      setClose_(close);
    });
  }

  function upateLabel() {
    for (let [key, item] of Object.entries(plots)) {
      if (item == false) continue;
      if (true) {
        item.root.querySelector("div.u-over").addEventListener("mousemove", onmove);
      }
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
      updateTime(); //手动触发一下
    }
    if (state.isUpdate == true) {
      state.isUpdate = false;
      upateLabel();
      updateTime();
    }
    if (state.isWaiting == true) {
      state.isWaiting = false;
    }
  });

  if (isLoading) {
    return <div>board loading...</div>;
  }
  return (
    <div>
      time_: {time_ ? fmtDate(tzDate(parseInt(time_))) : null}
      <br />
      close_: {close_}
      <br />
      time: {time ? fmtDate(tzDate(parseInt(time))) : null}
      <br />
      close: {close}
      <br />
    </div>
  );
}
export default React.memo(Board);

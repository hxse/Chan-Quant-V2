import React from "react";
import { useState, useEffect, useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";

import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";

import useLoop from "../hook/loop-hook";

import wheelZoomPlugin from "../plugin/wheelZoomPlugin";


const options_ = {
  title: "Chart",
  width: 600,
  height: 400,
  series: [
    {
      label: "Date",
    },
    {
      label: "",
      points: { show: false },
      stroke: "black",
      // fill: "blue"
    },
  ],
  scales: { x: { time: false } },

  plugins: [wheelZoomPlugin({ factor: 0.75 })],
};
const dataNum = 200;
const data_ = [[...new Array(dataNum)].map((_, i) => i), [...new Array(dataNum)].map((_, i) => i * Math.random())];


const lazyTime = 1000; //延时更新时间
const mode = "timeout"; //建议用timeout
function HooksChart() {
  const [options, setOptions] = useState(useMemo(() => options_, []));
  const [data, setData] = useState(useMemo(() => data_, []));

  const [time, setTime] = useState(Date.now());

  console.log("render");

  function updateData() {
    let newOptions = {
      ...options,
      title: "Rendered with hooks",
    };
    newOptions = options;
    let newData = [
      [...data[0], data[0].length],
      [...data[1], data[0].length * Math.random()],
    ];
    // newData = data;
    setData(newData);
    setOptions(newOptions);
  }
  const loopOpt = { mode: mode, lazyTime: lazyTime, time: time, setTime: setTime };
  useLoop(loopOpt, updateData);

  return (
    <div style={{ display: "none_" }}>
      <UplotReact
        key="hooks-key"
        options={options}
        data={data}
        //   target={root}
        onDelete={() => console.log("Deleted from hooks")}
        onCreate={() => console.log("Created from hooks")}
      />
    </div>
  );
}

export default HooksChart;

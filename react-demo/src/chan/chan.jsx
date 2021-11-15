import React from "react";
import { useState, useEffect, useMemo, useReducer } from "react";
import { unstable_batchedUpdates } from "react-dom";

import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
//引用图表
import CandlePlot from "./candlePlot";
import HorsePlot from "./horsePlot";
//引用配置文件
import initConfig from "./config";
import candleOpt from "./candleOpt";
//引用hook动作
import useLoop from "../hook/loop-hook";
import { useFetchData, useApi } from "../hook/get-data";
//引用函数
import { funcDataObj, funcCombineUpdateDataObj } from "../func/generateIndicator";

let loopCount = 0;
function ChanUplot() {
  console.count("enter Chan:");

  const [config, setConfig] = useState(initConfig);
  const [isLoading, setLoading] = useState(true);
  const [dataObj, setDataObj] = useState({});
  const [time, setTime] = useState(Date.now());

  useEffect(async () => {
    const url = useApi(config, "initRequest", loopCount);
    useFetchData(
      url,
      (data) => {
        const dataObj = funcDataObj(data, config);
        setDataObj(dataObj);
        setLoading(false);
        console.log("init set data:", dataObj);
      },
      (resData) => resData
    );
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function updateData() {
    loopCount += 1;
    const url = useApi(config, "updateRequest", loopCount);
    useFetchData(
      url,
      (updateData) => {
        const combineDataObj = funcCombineUpdateDataObj(dataObj.tohlcv, updateData, dataObj, config);
        setDataObj(combineDataObj);
        console.log("update data:", combineDataObj);
      },
      (resData) => resData
    );
  }
  console.log("wait...");
  useLoop({ ...config, time: time, setTime: setTime }, updateData);
  console.log("end Chan:");
  return (
    <div style={{ display: "none_" }}>
      <CandlePlot dataObj={dataObj} config={config} opt={{}} />
      <HorsePlot dataObj={dataObj} config={config} opt={{}} />
    </div>
  );
}

export default ChanUplot;

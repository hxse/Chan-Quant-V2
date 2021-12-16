import React from "react";
import { useState, useEffect, useMemo, useReducer } from "react";
import { unstable_batchedUpdates } from "react-dom";

import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
//引用jsx组件
import CandlePlot from "./candlePlot";
import HorsePlot from "./horsePlot";
import RangePlot from "./rangePlot";
import Board from "./board";
import Screenshot from "./screenshot";
//引用配置文件
import config from "./config";
import candleOpt from "./candleOpt";
//引用hook动作
import useLoop from "../hook/loop-hook";
import { useFetchData, useApi } from "../hook/get-data";
//引用函数
import { funcDataObj, funcCombineUpdateDataObj, funcCutUpdateData } from "../func/funcIndicator";
import { genDataObj } from "../func/genIndicator";

let loopCount = 0;
let gdo, res;
const candleState = { isInit: undefined, isUpdate: undefined, isWaiting: undefined };
const horseState = { isInit: undefined, isUpdate: undefined, isWaiting: undefined };
const rangeState = { isInit: undefined, isUpdate: undefined, isWaiting: undefined };
const boardState = { isInit: undefined, isUpdate: undefined, isWaiting: undefined };
const updateAll = (key, bool) => {
  for (const item of [candleState, horseState, rangeState, boardState]) {
    item[key] = bool;
  }
};
const plots = config.plots;

function ChanUplot() {
  console.count("enter Chan:");

  const [isLoading, setLoading] = useState(true);
  const [dataObj, setDataObj] = useState({});
  const [time, setTime] = useState(Date.now());
  useEffect(async () => {
    const url = useApi(config, "initRequest", loopCount);
    useFetchData(
      url,
      (data) => {
        gdo = genDataObj(data, config);
        res = gdo.next(); //js生成器的第一次传参会被忽略掉,所以只拿结果不要传参
        console.log("return0:", res.value?.tohlcv);
        console.log("return0:", res.value?.sma);
        console.log("return0:", res.value?.horse);
        console.log("return0:", res.value?.quant);
        console.log("return0:", res.value?.store);
        if (res.value == undefined) {
          debugger;
        }
        setDataObj(res.value);
        setLoading(false);
        updateAll("isInit", true);
        updateAll("isUpdate", false);
        updateAll("isWaiting", false);
        // console.log("init set data:", res.value);
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
        const cutData = funcCutUpdateData(dataObj.tohlcv, updateData);
        console.log("cut", cutData);

        if (cutData != undefined && cutData[0].length > 0) {
          res = gdo.next(cutData);
          console.log("update0:", res.value?.tohlcv);
          console.log("update0:", res.value?.sma);
          console.log("update0:", res.value?.horse);
          console.log("update0:", res.value?.quant);
          console.log("update0:", res.value?.store);
          updateAll("isInit", false);
          updateAll("isUpdate", true);
          updateAll("isWaiting", false);
        } else {
          updateAll("isInit", false);
          updateAll("isUpdate", false);
          updateAll("isWaiting", true);
        }
        setDataObj({ ...res.value });
      },
      (resData) => resData
    );
  }
  useLoop({ ...config, time: time, setTime: setTime }, updateData);
  console.log("end Chan:");
  return (
    <div
      id="chart"
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div id="plots" style={{ display: "none_" }}>
        <div id="candlePlot">
          {plots.candlePlot ? (
            <CandlePlot dataObj={dataObj} config={config} state={candleState} plots={plots} />
          ) : undefined}
        </div>
        <div id="horsePlot">
          {plots.horsePlot ? (
            <HorsePlot dataObj={dataObj} config={config} state={horseState} plots={plots} />
          ) : undefined}
        </div>
        <div id="rangePlot" style={{ height: "" }}>
          {plots.rangePlot ? (
            <RangePlot dataObj={dataObj} config={config} state={rangeState} plots={plots} />
          ) : undefined}
        </div>
      </div>
      <div id="board">
        <Board dataObj={dataObj} config={config} state={boardState} plots={plots}></Board>
      </div>
      <div id="screenshot" style={{ display: "none_", weight: 2000, height: 1000 }}>
        <Screenshot
          dataObj={dataObj}
          config={config}
          states={{ candleState, horseState, rangeState }}
          plots={plots}
        ></Screenshot>
      </div>
    </div>
  );
}

export default ChanUplot;

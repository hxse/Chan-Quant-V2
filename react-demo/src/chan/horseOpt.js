import uPlot from "uplot";

import wheelZoomPlugin from "../plugin/wheelZoomPlugin";
import horsePlugin from "../plugin/horsePlugin";
import { funcDataUplot } from "../func/funcIndicator";

import { getSize } from "./sizeEvent";

const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}-{HH}-{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

const cursorOpts = {
  y: false,
  lock: false,
  focus: {
    prox: 16,
  },
  sync: {
    key: "moo",
    setSeries: false,
  },
};

const options = ({ dataObj, config }) => {
  const { plotWidth, plotHeight, rangeHeight, parentHeight } = getSize();
  const horseData = funcDataUplot(dataObj, config, "horse");
  return {
    // title: "Chart",
    width: plotWidth,
    height: plotHeight,
    cursor: cursorOpts,
    series: [
      {
        label: "Date",
      },
      {},
    ],
    scales: {
      x: { time: true, distr: 2 },
      y: {
        range: [0, config.smaLevel.length - 1],
        value: (u, v) => v + "L", //不知道为什么,这个没用
      },
    },
    legend: {
      show: false,
    },
    plugins: [horsePlugin({ dataObj, config, horseData })],
  };
};

export default options;

import wheelPanPlugin from "../plugin/wheelPanPlugin.js";
import wheelZoomPlugin from "../plugin/wheelZoomPlugin";
import uPlot from "uplot";
const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}-{HH}-{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

import {getSize} from "./sizeEvent";

const cursorOpts = {
  y: false,
  points: {
    show: false,
  },
  drag: {
    setScale: false,
    x: true,
    y: false,
  },
  sync: {
    key: "moo",
  },
};

function createSeriesOpt(config) {
  if (config) {
    return config.smaLevel.map((value, index) => {
      return {
        label: "sma" + value,
        stroke: `rgb(${config.smaColor[index].join(",")})`,
        points: {
          show: false,
        },
      };
    });
  }
  return [];
}
const options = ({ dataObj, config, plots }) => {
  const { plotWidth, plotHeight, rangeHeight, parentHeight } = getSize();
  return {
    title: "Chart",
    width: plotWidth,
    height: rangeHeight,
    cursor: cursorOpts,
    series: [
      {
        label: "Date",
        value: (u, ts) => fmtDate(tzDate(ts)),
      },
      ...createSeriesOpt(config),
    ],
    scales: {
      x: { time: true, distr: 2 },
    },
    legend: {
      show: false,
    },
    plugins: [wheelPanPlugin(plots, config.rangeFactor, config.rangerMinimumSpacing)],
  };
};

export default options;

import uPlot from "uplot";

import wheelZoomPlugin from "../plugin/wheelZoomPlugin";
import horsePlugin from "../plugin/horsePlugin";

const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}-{HH}-{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

const options = ({ dataObj, config }) => {
  return {
    title: "Chart",
    width: 600,
    height: 400,
    series: [
      {
        label: "Date",
        value: (u, ts) => fmtDate(tzDate(ts)),
      },
      {},
      //   ...createSeriesOpt(config),
    ],
    scales: {
      x: { time: true, distr: 2 },
      y: {
        range: [0, config.smaLevel.length - 1],
      },
    },
    legend: {
      show: false,
    },
    plugins: [wheelZoomPlugin({ factor: 0.75 }), horsePlugin({ dataObj, config })],
  };
};

export default options;

import wheelZoomPlugin from "../plugin/wheelZoomPlugin";
import uPlot from "uplot";
const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}-{HH}-{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

const cursorOpts = {
  y: true,
  lock: true,
  focus: {
    prox: 16,
  },
  sync: {
    key: "moo",
    setSeries: true,
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
const options = ({ dataObj, config }) => {
  return {
    title: "Chart",
    width: 600,
    height: 400,
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
    plugins: [wheelZoomPlugin({ factor: 0.75 })],
  };
};

export default options;

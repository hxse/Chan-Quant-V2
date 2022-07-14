import wheelZoomPlugin from "../plugin/wheelZoomPlugin";
import framePlugin from "../plugin/framePlugin";
import uPlot from "uplot";
const fmtUSD = (val, dec) => "$" + val.toFixed(dec).replace(/\d(?=(\d{3})+(?:\.|$))/g, "$&,");
const fmtDate = uPlot.fmtDate("{YYYY}-{MM}-{DD}-{HH}-{mm}");
const tz = 1 == 1 ? "Asia/Shanghai" : "Etc/UTC";
const tzDate = (ts) => uPlot.tzDate(new Date(ts * 1e3), tz);

import { getSize } from "./sizeEvent";

const cursorOpts = {
  y: true,
  lock: false, //这个用了会出bug,反正也没用,建议别用
  // focus: {//这个是
  //   prox: 16,
  // },
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
const xFormat = () => {
  //好像没什么用,算了,这个不重要
  return {
    space: 40,
    incrs: [
      // minute divisors (# of secs)
      1,
      5,
      10,
      15,
      30,
      // hour divisors
      60,
      60 * 5,
      60 * 10,
      60 * 15,
      60 * 30,
      // day divisors
      3600,
      // ...
    ],
    // [0]:   minimum num secs in found axis split (tick incr)
    // [1]:   default tick format
    // [2-7]: rollover tick formats
    // [8]:   mode: 0: replace [1] -> [2-7], 1: concat [1] + [2-7]
    values: [
      // tick incr          default           year                             month    day                        hour     min                sec       mode
      [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
      [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
      [3600 * 24, "{M}/{D}", "\n{YYYY}", null, null, null, null, null, 1],
      [3600, "{h}{aa}", "\n{M}/{D}/{YY}", null, "\n{M}/{D}", null, null, null, 1],
      [60, "{h}:{mm}{aa}", "\n{M}/{D}/{YY}", null, "\n{M}/{D}", null, null, null, 1],
      [1, ":{ss}", "\n{M}/{D}/{YY} {h}:{mm}{aa}", null, "\n{M}/{D} {h}:{mm}{aa}", null, "\n{h}:{mm}{aa}", null, 1],
      [
        0.001,
        ":{ss}.{fff}",
        "\n{M}/{D}/{YY} {h}:{mm}{aa}",
        null,
        "\n{M}/{D} {h}:{mm}{aa}",
        null,
        "\n{h}:{mm}{aa}",
        null,
        1,
      ],
    ],
  };
};
const options = ({ dataObj, config, name, uncursor }) => {
  const { plotWidth, plotHeight, rangeHeight, parentHeight } = getSize();
  return {
    // title: "Chart",
    width: plotWidth,
    height: plotHeight,
    cursor: uncursor ? undefined : cursorOpts,
    series: [
      {
        label: "Date",
        value: (u, ts) => fmtDate(tzDate(ts)),
        // ...xFormat(),
      },
      ...createSeriesOpt(config),
    ],
    scales: {
      x: {
        time: true,
        distr: 2,
      },
    },
    legend: {
      show: false,
    },
    plugins: [framePlugin({ dataObj, config, name })],
    hooks: {
      //option里面的hooks优先级比插件里面高
      draw: [
        (u) => {
          // debugger;
        },
        (u) => {
          // debugger;
        },
      ],
      ready: [
        (u) => {
          // debugger;
        },
      ],
    },
  };
};

export default options;

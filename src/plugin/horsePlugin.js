import uPlot from "uplot";

function gridPlugin({ dataObj, config, horseData }, show = [2, 3, 4], mode = "horse") {
  let bullishColor = "rgba(255,0,0,0.5)";
  let bearishColor = "rgba(0, 255, 255,0.5)";

  // let bullishColor = 'rgba(243, 112, 106,1)';
  // let bearishColor = 'rgba(115, 240, 234,1)';

  // let bullishColor = 'rgba(245, 90, 85,0.8)';
  // let bearishColor = 'rgba(92, 243, 238,0.8)';

  return {
    opts: (u, opts) => {
      uPlot.assign(opts, {
        cursor: {
          points: {
            show: false,
          },
        },
      });
      for (const index in opts.series) {
        if (show.includes(parseInt(index))) continue;
        const series = opts.series[index];
        series.paths = () => null;
        series.points = {
          show: false,
        };
      }
    },
    hooks: {
      draw: (u) => {
        // if (show.length > 0) return;
        const { ctx, data } = u;

        for (let index in horseData) {
          let series = horseData[index];
          let xMin = u.scales.x.min;
          let xMax = u.scales.x.max;
          let xMinPos = Math.floor(u.valToPos(xMin, "x", true));
          let xMaxPos = Math.floor(u.valToPos(xMax, "x", true));

          let yMin = u.scales.y.min;
          let yMax = u.scales.y.max;
          let yMinPos = Math.floor(u.valToPos(yMin, "y", true));
          let yMaxPos = Math.floor(u.valToPos(yMax, "y", true));

          let yHeight = Math.floor((yMaxPos - yMinPos) / horseData.length);
          let yStart = yMinPos + yHeight * index;

          for (let index_s in series) {
            let yVal = series[index_s];
            let xVal = u.scales.x.distr == 1 ? data[0][index_s] : u.scales.x.distr == 2 ? index_s : null;
            let xPos = Math.floor(u.valToPos(xVal, "x", true));
            let yPos = Math.floor(u.valToPos(index, "y", true));
            let xPos0 = u.valToPos(0, "x", true);
            let xPos1 = u.valToPos(1, "x", true);
            let height = Math.floor(u.valToPos(1, "y", true) - u.valToPos(0, "y", true));
            let weight = Math.ceil(xPos1 - xPos0);

            if (xPos < xMinPos || xPos > xMaxPos) {
              continue;
            }

            // let bodyWidth = Math.min(bodyMaxWidth, weight - gap);//有空隙难看
            let bodyWidth = weight; //没空隙好看

            ctx.fillStyle = yVal > 0 ? bullishColor : bearishColor;
            ctx.fillRect(xPos - bodyWidth / 2, yPos, bodyWidth, height);

            ctx.fillStyle =
              index >= config.smaColor.length ? "rgba(255,255,255,255)" : `rgba(${config.smaColor[index].join(",")},1)`;
            ctx.fillRect(xPos - bodyWidth / 2, yPos, bodyWidth, 1);
          }
        }
      },
    },
  };
}
export default gridPlugin;

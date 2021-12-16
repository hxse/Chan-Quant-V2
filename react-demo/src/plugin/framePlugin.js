import uPlot from "uplot";

function framePlugin({ dataObj, config, name }) {
  name;
  //   debugger;
  return {
    opts: (u, opts) => {
      const id = u.root?.parentElement?.parentElement?.id;
      name;
      //   debugger;
      uPlot.assign(opts, {
        cursor: {
          points: {
            show: false,
          },
        },
      });
      //   for (const index in opts.series) {
      //     const series = opts.series[index];
      //     series.paths = () => null;
      //     series.points = {
      //       show: false,
      //     };
      //   }
    },
    hooks: {
      drawClear: (u) => {
        //初始空白画布时触发
        if (!u.root.parentElement) debugger;
        // debugger;
        const id = u.root.parentElement.parentElement.id;
      },
      drawAxes: (u) => {
        //绘制坐标轴和网格后触发
        if (!u.root.parentElement) debugger;
        // debugger;
        const id = u.root.parentElement.parentElement.id;
      },
      drawSeries: (u) => {
        //在绘制每个系列后触发
        if (!u.root.parentElement) debugger;
        // debugger;
        const id = u.root.parentElement.parentElement.id;
      },
      draw: (u) => {
        //绘制完所有内容后触发
        if (!u.root.parentElement) debugger;
        const id = u.root.parentElement.parentElement.id;
        dataObj;
        console.assert(dataObj.store.length == config.smaExtra + u.data[0].length, "图表中的数据不同步哦");
        const { ctx, data } = u;
        const storeArrHistory = dataObj.store.at(-1).storeArrHistory;
        for (const store of storeArrHistory) {
          const openX = store.storeData.idx;
          const emptyX = store.deleteIdx;
          const openY = store.storeData.close00;
          const emptyY = dataObj.tohlcv[4][store.deleteIdx + config.smaExtra];

          let x0 = u.valToPos(openX, "x", true);
          let x1 =
            store.deleteIdx === undefined
              ? u.valToPos(dataObj.tohlcv[0].length - 1, "x", true)
              : u.valToPos(emptyX, "x", true);

          let y0 = u.valToPos(openY, "y", true);
          let y1 =
            store.deleteIdx === undefined
              ? u.valToPos(dataObj.tohlcv[4].at(-1), "y", true)
              : u.valToPos(emptyY, "y", true);
          if (store.deleteIdx === undefined) {
            // debugger;
          }
          ctx.beginPath();

          //画线
          // ctx.moveTo(x0, y0);
          // ctx.lineTo(x1, y1);
          // ctx.stroke();
          //方块
          if (store.deleteIdx === undefined) {
            ctx.setLineDash([10]);
            ctx.lineWidth = 1;
            ctx.strokeStyle = store.storeData.way ? "rgb(246, 82, 83,0.6)" : "rgb(35, 2, 253,0.6)";
            // ctx.strokeStyle = store.storeData.way ? "red" : "blue";
            ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); // 绘制矩形边框
            ctx.setLineDash([]);
          } else {
            ctx.fillStyle = store.storeData.way ? "rgb(249,140,140,0.3)" : "rgb(151,254,254,0.3)";
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0); // 绘制矩形，填充的默认颜色为黑色
          }

          // debugger;
          // break;
        }
      },
    },
  };
}
export default framePlugin;

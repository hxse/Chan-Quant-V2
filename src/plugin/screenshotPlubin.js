import uPlot from "uplot";

async function postData(data) {
  const rawResponse = await fetch("http://127.0.0.1:8000/store", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const content = await rawResponse.json();
  //   console.log(content);
}

function screenshotPlugin({ dataObj, config, name }) {
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
    },
    hooks: {
      drawClear: (u) => {
        //初始空白画布时触发
        if (!u.root.parentElement) debugger;
        // debugger;
        const id = u.root.parentElement.parentElement.id;
        //填充背景色
        u.ctx.fillStyle = "#fff";
        u.ctx.fillRect(0, 0, u.ctx.canvas.width, u.ctx.canvas.height);
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
        if (dataObj.store.length != config.smaExtra + u.data[0].length) {
          debugger;
        }
        const storeArrHistory = dataObj.store.at(-1).storeArrHistory;

        console.time("canvas.toDataURL time");
        const dataUrl = u.ctx.canvas.toDataURL("image/png");
        console.timeEnd("canvas.toDataURL time");
        if (!id) debugger;

        postData({
          id,
          dataUrl,
          config: Object.fromEntries(Object.entries(config).filter(([k, v]) => k != "plots")),
        });
        // postData({ hello: "world" });
        // debugger
      },
    },
  };
}
export default screenshotPlugin;

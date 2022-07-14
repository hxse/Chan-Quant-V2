export function rangePlotRefreshSelect(u, plots) {
  //刷新rangePlot的范围选择范围,在每次数据更新时,根据candlePlot显示范围
  let candlePlot = plots.candlePlot;
  //当前candlePlot图表显示范围
  let xMin_cur = candlePlot.scales.x.min;
  let xMax_cur = candlePlot.scales.x.max;
  //当前图表现实像素
  let left_cur = Math.round(u.valToPos(xMin_cur, "x"));
  let width_cur = Math.round(u.valToPos(xMax_cur, "x")) - left_cur;
  let height_cur = u.bbox.height / devicePixelRatio;
  //设置rangePlot的选择范围
  u.setSelect(
    {
      left: left_cur,
      width: width_cur,
      height: height_cur,
    },
    false
  );
}

function wheelPanPlugin(plots, rangeFactor, rangerMinimumSpacing) {
  rangeFactor = rangeFactor || 0.75;
  rangerMinimumSpacing = rangerMinimumSpacing || 3;

  function dbClickSelect(u, plots) {
    //重写鼠标双击事件,可以在任意图表双击后自动全选rangePlot
    for (const [key, item] of Object.entries(plots)) {
      if (!item) continue;
      //依次给每个图表添加双击监听事件
      let plotOver = item.root.querySelector(".u-over");
      plotOver.addEventListener("dblclick", () => {
        rangePlotRefreshSelect(u, plots);
      });
    }
  }

  function clamp(nRange, nMin, nMax, fRange, fMin, fMax, tolerance = 3) {
    if (nRange > fRange) {
      //如果要滚动的数据范围差>如果当前全部数据范围差,就返回全部数据范围
      nMin = fMin;
      nMax = fMax;
    } else if (nMin < fMin) {
      //最小值超出屏幕边缘,则最小值不变
      nMin = fMin;
      nMax = fMin + nRange;
      if (Math.abs(nMin - nMax) <= tolerance) {
        //如果数据间隔太小,则保持间隔不变
        nMin = nMin;
        nMax = nMin + tolerance - 1;
      }
    } else if (nMax > fMax) {
      //最大值超出屏幕边缘,则最大值不变
      nMax = fMax;
      nMin = fMax + nRange;
      if (Math.abs(nMin - nMax) <= tolerance) {
        //如果数据间隔太小,则保持间隔不变
        nMin = nMax - tolerance + 1;
        nMax = nMax;
      }
    }
    return [nMin, nMax];
  }

  function wheelZoomRangePlot(u, plots) {
    //鼠标滚轮滚动range横向移动图表
    let plotOver = plots.rangePlot.root.querySelector(".u-over");
    plotOver.addEventListener("wheel", (e) => {
      e.preventDefault();

      let candlePlot = plots.candlePlot;
      //当前candlePlot全部数据范围,不要去捕获屏幕里现实的范围
      let xMin = 0;
      let xMax = candlePlot.data[0].length - 1; //一定要注意-1否则会引起精度bug
      //当前candlePlot全部数据的数据轴范围差
      let xRange = xMax - xMin;
      //当前candlePlot屏幕显示的数据轴范围差
      let oxRange = candlePlot.scales.x.max - candlePlot.scales.x.min;
      //deltaY,正值向下滚动,绝对值为操作系统鼠标滑轮垂直行数设置
      //nxRange,滚动步长,是当前candlePlot屏幕显示范围乘一个自定义系数factor,表示每次滚动几个屏幕
      let nxRange = e.deltaY < 0 ? oxRange * rangeFactor : -oxRange * rangeFactor;
      //滚动后的范围,根据当前的屏幕范围减去滚动步长
      let nxMin = candlePlot.scales.x.min - nxRange;
      let nxMax = candlePlot.scales.x.max - nxRange;
      [nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax, rangerMinimumSpacing);

      u.batch(() => {
        for (const [key, item] of Object.entries(plots)) {
          if (!item) continue;
          if (key == "rangePlot") {
            // 滚动缩放
            let left = Math.round(item.valToPos(nxMin, "x"));
            let width = Math.round(item.valToPos(nxMax, "x")) - left;
            let height = item.bbox.height / devicePixelRatio;
            item.setSelect(
              {
                left,
                width,
                height,
              },
              false
            );
          } else {
            item.setScale("x", {
              min: nxMin,
              max: nxMax,
            });
          }
        }
      });
    });
  }
  return {
    hooks: {
      ready: (u) => {
        //在每次数据更新的时候, 根据candlePlot显示范围,刷新rangePlot的范围选择范围
        rangePlotRefreshSelect(u, plots);
        //重写鼠标双击事件,可以在任意图表双击后自动全选rangePlot
        dbClickSelect(u, plots);
        //鼠标滚轮滚动range横向移动图表
        wheelZoomRangePlot(u, plots);
      },
    },
  };
}
export default wheelPanPlugin;

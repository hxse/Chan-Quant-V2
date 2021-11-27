import { rangePlotRefreshSelect } from "../plugin/wheelPanPlugin";
import config from "./config";

export function getSize() {
  const plots = config.plots;
  const bodyWidth = window.innerWidth;
  const bodyHeight = window.innerHeight;
  const plotWidth = bodyWidth - 20;
  const filterPlot = Object.entries(plots).filter(([key, item]) => (item && key != "rangePlot" ? true : false));
  const rangeHeight = 130;
  const plotHeight = (bodyHeight - rangeHeight - 1) / filterPlot.length;
  const parentHeight = plotHeight - 50 + 17 - 2; //50和17是默认常量,2是容错
  return {
    plotWidth,
    rangeHeight,
    plotHeight,
    parentHeight,
  };
}

export function plotAutoSize(plots) {
  //根据窗口,动态缩放图表
  const resizeEvent = new Event("resize");
  window.addEventListener("resize", () => {
    const { plotWidth, plotHeight, rangeHeight, parentHeight } = getSize();
    for (const [key, item] of Object.entries(plots)) {
      if (!item) continue;
      //图表缩放
      if (key == "rangePlot") {
        item.setSize({ height: rangeHeight, width: plotWidth });
        //根据candlePlot选择rangePlot范围
        rangePlotRefreshSelect(item, plots);
      } else {
        item.setSize({ height: plotHeight, width: plotWidth });
      }

      //隐藏x轴
      item.root.parentElement.style.height = parentHeight;
      item.root.parentElement.style.overflow = "hidden";
    }
  });
  window.dispatchEvent(resizeEvent);
}

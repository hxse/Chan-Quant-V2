const config = {
  plots: { candlePlot: true, horsePlot: true, rangePlot: true }, //true为启用,false为不启用,candlePlot和rangePlot不要设置false,可能引起某些功能不工作
  name: "SHFE.RB",
  frequency: "900s",
  count: 300,
  refresh: false,
  updateCount: 3, //如果启用了fake模式,这个值被忽略,否则按这个值来更新
  updateRefresh: false,
  updateMode: "timeout", //更新模式
  lazyTime: 2000, //更新延时,
  smaLevel: [2, 4, 8, 16, 32, 64],
  smaLevel: [2, 4, 8, 16],
  smaColor: [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
  ],
  fake: true, //是否启用假数据
  fakeNum: 20,
  fakeStep: 5,
  rangeFactor: 0.7, //rangePlot移动当前窗口的百分比
  rangerMinimumSpacing: 10, //rangePlot的最小缩放间隔
};
config.smaExtra = config.smaLevel[config.smaLevel.length - 1] - 1;
if (config.count <= config.fakeNum) {
  debugger;
}
config.board = ["time_", "close_", "time", "close", "sma2", "sma4", "horse2", "horse4", "horse8"]; //如果加了下划线,就代表是更新时的数据
export default config;

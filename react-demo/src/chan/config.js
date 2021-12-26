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
  // smaLevel: [2, 4, 8, 16],
  smaColor: [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
  ],
  fake: true, //是否启用假数据
  fakeNum: 15,
  fakeStep: 5,
  rangeFactor: 0.7, //rangePlot移动当前窗口的百分比
  rangerMinimumSpacing: 10, //rangePlot的最小缩放间隔
  screenNum: 3, //发送plot类型的数量,3个一般是candlePlot+horsePlot+rangePlot,后端程序等到接受到3个时才启动合并图片
};
config.smaExtra = config.smaLevel[config.smaLevel.length - 1] - 1;
if (config.count <= config.fakeNum) {
  debugger;
}
config.board = [
  // "time_",
  // "close_",
  "time",
  "close",
  // "sma2",
  // "sma4",
  // "horse2",
  // "horse4",
  // "horse8",
  // "quant8.idx",
  // "quant8.idxFull",
  // "quant8.isLeftEqual",
  // "quant8.isDownEqual",
  // "quant8.startIdx",
  // "quant8.childIdx",
  // "quant8.equalChildIdxArr",
  // "quant8.diffChildIdxArr",
  "quant8.initChild",
  "quant16.initChild",
  // "quant8.lastChildEqNum",
  // "quant16.lastChildEqNum",
  "plan8.plans",
  "plan8.result",
  "plan16.plans",
  "plan16.result",
  "plan16.initIdx",
  "store.idx",
  "store.idxFull",
  "store.storeEnter",
  "store.storeLeave",
  "store.storeDeleteIdx",
  "store.storeEnterPlans",
  "store.storeLeavePlans",
  "store.storeEnterValue",
  "store.storeLeaveValue",
  "store.storeIdxArrHistory",
  "store.storeIdxArr",
]; //如果加了下划线,就代表是更新时的数据
export default config;

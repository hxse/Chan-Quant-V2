const config = {
  name: "SHFE.RB",
  frequency: "300s",
  count: 100,
  refresh: false,
  updateCount: 3,
  updateRefresh: false,
  updateMode: "timeout", //更新模式
  lazyTime: 1500, //更新延时,
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
  fake: true,
  fakeNum: 60,
  fakeStep: 2,
};
config.smaExtra = config.smaLevel[config.smaLevel.length - 1] - 1;
if (config.count <= config.fakeNum) {
  debugger;
}
export default config;

const config = {
  name: "SHFE.RB",
  frequency: "300s",
  count: 1000,
  refresh: false,
  updateCount: 10,
  updateRefresh: false,
  updateMode: "timeout", //更新模式
  lazyTime: 1000, //更新延时,
  smaLevel: [2, 4, 8, 16, 32, 64],
  smaColor: [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
  ],
  fake: true,
  fakeNum: 300,
  fakeStep: 50,
};
config.smaExtra = config.smaLevel[config.smaLevel.length - 1] - 1;
export default config;

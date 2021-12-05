import { genQuant } from "./customer";
import { genPlan } from "./plan";

function* genSmaData(closeArr, n, fractionDigits = 2) {
  const average = (arr) => arr.reduce((acc, val) => acc + val, 0) / arr.length;
  let value;
  for (let i = 0; true; i++) {
    //增量版本,计算少,性能好
    value = (() => {
      switch (true) {
        case i < n - 1:
          return null;
        case i == n - 1:
          return average(closeArr.slice(0, n));
        case i > n - 1:
          //   return average(closeArr.slice(i - n + 1, i + 1));
          return (value * n - closeArr[i - n] + closeArr[i]) / n;
      }
    })();
    closeArr = yield value === null ? null : parseFloat(value);
  }
}

function* genHorseData([smaDataDown, smaDataUp]) {
  function findLast(array) {
    //如果相等(null状态),那么就寻找前一个的状态作为补足,如果找不到就返回null
    for (let index = array.length - 1; index >= 0; index--) {
      const item = array[index];
      if (item != null) return item;
    }
    return null;
  }
  let array = []; //这是为了找null之前的值,进行的内部状态保留,如果不用生成器的话,这东西就可能找不到了
  for (let idx = 0; true; idx++) {
    let value = smaDataDown[idx] > smaDataUp[idx] ? true : smaDataDown[idx] < smaDataUp[idx] ? false : null;
    value = smaDataDown[idx] == null || smaDataUp[idx] == null ? null : value;
    value = value === null ? findLast(array) : value;
    array.push(value);
    [smaDataDown, smaDataUp] = yield value;
  }
}

function genCallback(dataObj, closeArr, genObj, config) {
  //从指标中计算数据并合并
  for (const [idx, level] of config.smaLevel.entries()) {
    //从生成器中获取sma指标值, 按config.smaLevel中的顺序依次获取
    const smaRes = genObj["sma"][`sma${level}`].next(closeArr());
    //合并指标值到dataObj
    dataObj["sma"][`sma${level}`] = [...dataObj["sma"][`sma${level}`], smaRes.value];

    if (idx > 0) {
      //从生成器中获取horse指标值
      const horseRes = genObj["horse"][`horse${level}`].next([
        dataObj["sma"][`sma${config.smaLevel[idx - 1]}`],
        dataObj["sma"][`sma${level}`],
      ]);
      //合并指标值到dataObj
      dataObj["horse"][`horse${level}`] = [...dataObj["horse"][`horse${level}`], horseRes.value];
    }
    //从生成器中获取quant指标值
    const quantRes = genObj["quant"][`quant${level}`].next(dataObj);
    //合并指标值到dataObj
    dataObj["quant"][`quant${level}`] = [...dataObj["quant"][`quant${level}`], quantRes.value];

    //从生成器中获取策略plan值
    const planRes = genObj["plan"][`plan${level}`].next(dataObj);
    //合并策略值到dataObj
    dataObj["plan"][`plan${level}`] = [...dataObj["plan"][`plan${level}`], planRes.value];
  }
}
function initCallback(dataObj, closeArr, genObj, config) {
  //在opt对象中初始化定义生成器
  for (const level of config.smaLevel) {
    //初始化sma指标对象 in dataObj
    dataObj["sma"] = dataObj["sma"] || {};
    dataObj["sma"][`sma${level}`] = [];
    //初始化horse指标对象 in dataObj
    dataObj["horse"] = dataObj["horse"] || {};
    dataObj["horse"][`horse${level}`] = [];
    //初始化quant指标对象 in dataObj
    dataObj["quant"] = dataObj["quant"] || {};
    dataObj["quant"][`quant${level}`] = [];
    //初始化strategy策略对象 in dataObj
    dataObj["plan"] = dataObj["plan"] || {};
    dataObj["plan"][`plan${level}`] = [];
  }
  for (const [idx, level] of config.smaLevel.entries()) {
    //初始化sma指标生成器 in gen
    genObj["sma"] = genObj["sma"] || {};
    genObj["sma"][`sma${level}`] = genSmaData(closeArr(), level);
    //初始化horse指标生成器 in gen
    genObj["horse"] = genObj["horse"] || {};
    genObj["horse"][`horse${level}`] = genHorseData([
      dataObj["sma"][`sma${config.smaLevel[idx - 1]}`],
      dataObj["sma"][`sma${level}`],
    ]);
    //初始化quant指标生成器 in gen
    genObj["quant"] = genObj["quant"] || {};
    genObj["quant"][`quant${level}`] = genQuant(dataObj, level, config);
    //初始化plan指标生成器 in gen
    genObj["plan"] = genObj["plan"] || {};
    genObj["plan"][`plan${level}`] = genPlan(dataObj, level, config);
  }
}
export function* genDataObj(tohlcvData, config) {
  //添加新指标不要动这个主逻辑函数, 用上面两个回调函数来新增指标
  const dataObj = { tohlcv: tohlcvData }; //数据对象
  const genObj = {}; //生成器对象
  const closeArr = () => tohlcvData[4];
  initCallback(dataObj, closeArr, genObj, config);

  const endIdx = () => closeArr().length - 1;
  // console.log("tohlcvData:", endIdx());

  let updateData;
  function update() {
    if (updateData && updateData[4]) {
      //如果next传参为:不传参,空值,[],[[],[],[],[]],都将自动忽略返回undefined
      tohlcvData = tohlcvData.map((i, idx) => [...i, ...updateData[idx]]);
      dataObj["tohlcv"] = tohlcvData;
    }
  }
  for (let i = 0; true; i++) {
    if (i > endIdx()) {
      updateData = yield undefined;
      update();
      i--;
      continue;
    }
    if (i < endIdx()) {
      genCallback(dataObj, closeArr, genObj, config);
      // console.log("add...");
    }
    if (i == endIdx()) {
      genCallback(dataObj, closeArr, genObj, config);
      // console.log("add... end:", i, endIdx(), closeArr());
      // console.log(i, tohlcvData[0].length, dataObj.tohlcv[0].length);
      updateData = yield dataObj;
      update();
    }
  }
}

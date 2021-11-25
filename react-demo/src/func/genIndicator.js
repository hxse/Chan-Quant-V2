function funcSmaData(closeArr, n, mode = "reduce", sliceNum = 0, fractionDigits = 2) {
  const average = (arr) => arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const sma = [];
  if (n > closeArr.length) {
    return Array(closeArr.length).fill(null).slice(sliceNum);
  }

  if (mode == "reduce") {
    // 用reduce实现的版本, 思路清晰, 性能好
    closeArr.reduce((total, value, index) => {
      let pre = index == n - 1 ? 0 : closeArr[parseInt(index) - n];
      const data = total - pre + value;
      let sum = total - (isNaN(pre) ? 0 : pre) + value;
      const arr = isNaN(data / n) ? null : (data / n).toFixed(fractionDigits);
      sma.push(parseFloat(arr));
      return sum;
    }, 0);
    return sma.slice(sliceNum);
  }

  if (mode == "incremental") {
    for (let i in closeArr) {
      i = parseInt(i);
      //增量版本,计算少,性能好
      const arr =
        i + 1 == n
          ? average(closeArr.slice(0, n)).toFixed(fractionDigits)
          : i + 1 > n
          ? ((sma[sma.length - 1] * n - closeArr[sma.length - n] + closeArr[i]) / n).toFixed(fractionDigits)
          : null;
      sma.push(parseFloat(arr));
    }
    return sma.slice(sliceNum);
  }

  if (mode == "simple") {
    for (let i in closeArr) {
      i = parseInt(i);
      let arr;
      //全量计算版本,代码少
      arr = average(closeArr.slice(i + 1 - n, i + 1), n);
      arr = isNaN(arr) ? null : arr.toFixed(fractionDigits);
      sma.push(parseFloat(arr));
    }
    return sma.slice(sliceNum);
  }
}

function funcHorseData(smaData) {
  function findLast(array) {
    //如果相等(null状态),那么就寻找前一个的状态作为补足,如果找不到就返回null
    for (let index = array.length - 1; index > 0; index--) {
      const item = array[index];
      if (item != null) return item;
    }
    return null;
  }
  const horseData = smaData.map(() => []).slice(1);
  for (let arrIdx = 0; arrIdx < smaData.length - 1; arrIdx++) {
    const smaArr = smaData[arrIdx];
    for (let idx = 0; idx < smaArr.length; idx++) {
      const value = smaArr[idx];
      const value_ = smaData[arrIdx + 1][idx];
      let state = value > value_ ? true : value < value_ ? false : null;
      if (state == null) {
        state = findLast(horseData[arrIdx]);
      }
      horseData[arrIdx][idx] = state;
    }
  }
  return horseData;
}

function funcSmaArr(data, config) {
  return config.smaLevel.map((smaLevel) => funcSmaData(data, smaLevel, "reduce"));
}

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
    //从生成器中获取sma指标值
    let res = genObj["sma"][`sma${level}`].next(closeArr());
    //合并指标值到dataObj
    dataObj["sma"][`sma${level}`] = [...dataObj["sma"][`sma${level}`], res.value];

    if (idx > 0) {
      //从生成器中获取horse指标值
      let res = genObj["horse"][`horse${level}`].next([
        dataObj["sma"][`sma${config.smaLevel[idx - 1]}`],
        dataObj["sma"][`sma${level}`],
      ]);
      //合并指标值到dataObj
      dataObj["horse"][`horse${level}`] = [...dataObj["horse"][`horse${level}`], res.value];
    }
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
  }
  for (const [idx, level] of config.smaLevel.entries()) {
    //初始化sma指标生成器 in gen
    genObj["sma"] = genObj["sma"] || {};
    genObj["sma"][`sma${level}`] = genSmaData(closeArr(), level);
    //初始化horse指标生成器 in gen
    if (idx > 0) {
      genObj["horse"] = genObj["horse"] || {};
      genObj["horse"][`horse${level}`] = genHorseData([
        dataObj["sma"][`sma${config.smaLevel[idx - 1]}`],
        dataObj["sma"][`sma${level}`],
      ]);
    }
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

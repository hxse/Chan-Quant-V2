export function funcSmaData(closeArr, n, mode = "reduce", sliceNum = 0, fractionDigits = 2) {
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

export function funcHorseData(smaData) {
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

export function funcSmaArr(data, config) {
  return config.smaLevel.map((smaLevel) => funcSmaData(data, smaLevel, "reduce"));
}

export function funcDataObj(tohlcvData, config) {
  console.time("genDataObj time:");
  const smaData = funcSmaArr(tohlcvData[3], config);
  const horseData = funcHorseData(smaData);
  console.timeEnd("genDataObj time:");
  return {
    tohlcv: tohlcvData,
    smaData,
    horseData,
  };
}

export function funcCutUpdateData(preTohlcvData, curTohlcvData) {
  const lastTime = preTohlcvData[0][preTohlcvData[0].length - 1];
  const idx = curTohlcvData[0].indexOf(lastTime);
  return idx == -1 ? undefined : curTohlcvData.map((i) => i.slice(idx + 1));
}
function funcUpdateDataObj(preTohlcvData, curTohlcvData, config) {
  const smaExtraData = preTohlcvData.map((i) => i.slice(-config.smaExtra));
  const tempData = curTohlcvData.map((i, idx) => [...smaExtraData[idx], ...i]);
  const tempDataObj = funcDataObj(tempData, config);
  return tempDataObj;
}
function funcCombineDataObj(preDataObj, curDataObj, config) {
  const newDataObj = {};
  for (const key of Object.keys(preDataObj)) {
    newDataObj[key] = [];
    for (const [arrIdx, arr] of preDataObj[key].entries()) {
      newDataObj[key][arrIdx] = [...arr, ...curDataObj[key][arrIdx].slice(config.smaExtra)];
    }
  }
  return newDataObj;
}
export function funcCombineUpdateDataObj(preTohlcvData, curTohlcvData, preDataObj, config) {
  //整合一下上面的函数,暴露api
  const cutData = funcCutUpdateData(preTohlcvData, curTohlcvData);
  if (cutData === undefined) {
    if (curTohlcvData[0].length == 0) {
      console.log("空数据");
    } else {
      console.log("数据超出日期范围,建议刷新");
    }
    return { ...preDataObj }; //虽然数据没变,但是返回新对象,刺激刷新
  }
  if (cutData[0].length == 0) {
    console.log("无需更新数据");
    // todo,可以以后考虑加个手动触发延时,但是现在先别做这个优化了,没必要,
  }
  const cutDataObj = funcUpdateDataObj(preTohlcvData, cutData, config);
  const combineDataObj = funcCombineDataObj(preDataObj, cutDataObj, config);
  console.log(combineDataObj["tohlcv"][0].length);
  return combineDataObj;
}
export function funcDataUplot(dataObj, config, mode) {
  switch (mode) {
    case "sma":
      return [
        dataObj.tohlcv[0].slice(config.smaExtra),
        ...config.smaLevel.map((i) => dataObj.sma[`sma${i}`].slice(config.smaExtra)),
      ];
    case "horse":
      return [...config.smaLevel.map((i) => dataObj.horse[`horse${i}`].slice(config.smaExtra))].slice(1);
  }
}

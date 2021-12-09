export function* genPlan(dataObj, level, config) {
  for (let idxFull = 0; true; idxFull++) {
    let idx = idxFull - config.smaExtra;
    let obj = { idx, idxFull };
    function getItem(name, x, y, mode) {
      //mode为true,输入idx不要带extra和level(2,4,16),为false,输入0,-1,-2,相对坐标
      //x是指定的idx不是idxFull,用0,-1,-2,从右往左数来表示,0表示当前x
      //y是指定的level,从上往下0,-1,-2对应level的倍数,0表示当前y
      if (name == "store") {
        if (mode) {
          return dataObj["store"][x + config.smaExtra];
        } else {
          return dataObj["store"][idxFull + x];
        }
      }
      const tohlcvName = ["time", "open", "high", "low", "close", "volume"];
      if (tohlcvName.includes(name)) {
        //tohlcv数据不需要y参数
        if (mode) {
          return dataObj.tohlcv[tohlcvName.indexOf(name)][x + config.smaExtra];
        } else {
          return dataObj.tohlcv[tohlcvName.indexOf(name)][idxFull + x];
        }
      }
      // debugger;
      if (mode) {
        let arr = dataObj[name][`${name}${y}`];
        return arr ? arr[x + config.smaExtra] : undefined;
      } else {
        let arr = dataObj[name][`${name}${level / 2 ** -y}`];
        return arr ? arr[idxFull + x] : undefined;
      }
    }

    if (idx >= 0) {
      const time00 = getItem("time", 0);
      const close00 = getItem("close", 0);
      const sma00 = getItem("sma", 0, 0);
      const horse00 = getItem("horse", 0, 0);
      const topY = 1; //topY定义为最高影线级别,设定这个的好处是可以把主一级别定义为0
      const itemArr = [
        getItem("quant", 0, 1 - topY),
        getItem("quant", 0, 0 - topY),
        getItem("quant", 0, 0 - topY),
        getItem("quant", -1, 0 - topY),
      ];
      const conditionArr = [
        //要求为一峰影线
        (i) => (i ? i.equalChildIdxLength == 1 : null),
        //要求一笔打破
        (i) => (i ? i.isLeftEqual == false : null),
        //要求不能是震荡,即至少有一峰
        (i) => (i ? i.equalChildIdxLength == 1 : null),
        //要求至少拥有两峰
        (i) => (i ? i.equalChildIdxLength > 1 : null),
      ];
      if (itemArr.length != conditionArr.length) {
        debugger;
      }

      //拿到收盘价的峰尖
      const initIdx = getItem("quant", 0, 0 - topY)?.initChild - 1; //-1是容错率,可以在3-5个K线之间取最高的收盘价
      const initClose = getItem("close", initIdx, undefined, true);

      //storeData是储存一下建仓时的仓位状态,currentData是当前状态
      const currentData = { idx, idxFull, level, itemArr, conditionArr, close00 };
      const storeData = { idx, idxFull, level, close00, initClose };

      const enterPlan = (storeData, currentData) => {
        //不建议对参数解包,因为storeData和currentData里面的key一模一样,解包了反而容易弄混
        const plans = currentData.itemArr.map((i, idx) => currentData.conditionArr[idx](i));
        return plans.every((i) => i === true); //返回bool值,表示当前策略的空开建议
      };
      const leavePlan = (storeData, currentData) => {
        //决定何时平仓,storeData是建仓时的仓位状态
        const diffPriceStore = storeData.close00 - storeData.initClose;
        const diffPriceCurrent = currentData.close00 - storeData.close00;
        // return [diffPriceStore, diffPriceCurrent, Math.abs(diffPriceCurrent) >= Math.abs(diffPriceStore)];
        return Math.abs(diffPriceCurrent) >= Math.abs(diffPriceStore);
      };

      obj = {
        currentData,
        storeData,
        enterPlan,
        leavePlan,
      };
    }
    dataObj = yield obj;
  }
}

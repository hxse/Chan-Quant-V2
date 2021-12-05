export function* genPlan(dataObj, level, config) {
  let quantParentArr, quantParent;

  for (let idxFull = 0; true; idxFull++) {
    let idx = idxFull - config.smaExtra;
    let plan1, plan2, plan3, plans, result, test;

    if (idx >= 0 && config.smaLevel.indexOf(level) > 1) {
      const { tohlcv, sma, horse, quant } = dataObj;
      const { timeArr, openArr, highArr, lowArr, closeArr, volumeArr } = tohlcv;
      const quantArr = dataObj["quant"][`quant${level}`];
      const quantCur = quantArr[idxFull];
      const quantDownArr = dataObj["quant"][`quant${level / 2}`];
      const quantCurLast = quantArr[idxFull - 1];
      const quantDown = quantDownArr[idxFull];
      const quantDownLast = quantDownArr[idxFull - 1];

      plan1 = quantDown.isLeftEqual == false;
      if (level == 8) {
        // debugger;
      }
      //要求至少该影线至少拥有两峰
      plan2 = quantDownLast.equalChildIdxLength > 1 && quantDown.equalChildIdxLength == 1;
      //多要求一根重影线
      plan3 = quantCur.equalChildIdxLength == 1;
      //plan3 = true;
      plans = [plan1, plan2, plan3];
      result = plans.every((i) => i === true) ? "开" : "空";
    }
    dataObj = yield {
      idxFull,
      idx,
      plans,
      result,
      test,
    };
  }
}

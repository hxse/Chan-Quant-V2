export function* genStore(dataObj, config) {
  const storeArr = [];
  for (let idxFull = 0; true; idxFull++) {
    let idx = idxFull - config.smaExtra;
    let obj = { idx, idxFull };
    if (idx >= 0) {
      const planObj = config.smaLevel.map((i) => dataObj.plan[`plan${i}`][idxFull]);
      for (let plan of planObj) {
        const enter = plan.enterPlan(plan.storeData, plan.currentData);
        if (enter) {
          storeArr.push({ storeData: plan.storeData, enter });
        }
      }
      if (storeArr.length > 0) {
        //判断是否平仓
        for (let [index, store] of Object.entries(storeArr)) {
          for (let [name, plan] of Object.entries(planObj)) {
            storeArr[index] = { ...store, leave: plan.leavePlan(store.storeData, plan.currentData) };
          }
        }
      }
      obj = {
        idx,
        idxFull,
        store: [...storeArr],
      };
    }
    dataObj = yield obj;
  }
}

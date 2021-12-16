export function* genStore(dataObj, config) {
  let storeArrHistory = [];
  let storeArr = [];
  for (let idxFull = 0; true; idxFull++) {
    let idx = idxFull - config.smaExtra;
    let obj = { idx, idxFull };
    if (idx >= 0) {
      const planArr = config.smaLevel.map((i) => dataObj.plan[`plan${i}`][idxFull]);

      //开仓处理,添加仓位到planArr,every,必须所有条件符合才开仓
      for (let plan of planArr) {
        const enterObj = plan.enterPlan(plan.currentData);
        const enter = enterObj.plans.every((i) => i === true);
        if (enter) {
          storeArrHistory.push({ enterObj, enter, storeData: plan.storeData });
        }
      }

      //平仓处理,给符合平仓条件的标记为leave,只要有一个条件符合,就平仓
      for (let [index, store] of Object.entries(storeArrHistory)) {
        for (let plan of planArr) {
          const leaveObj = plan.leavePlan(plan.currentData, store.storeData);
          const leave = leaveObj.plans.some((i) => i === true);
          storeArrHistory[index] = {
            ...store,
            leaveObj,
            leave,
          };
          if (leave) {
            break;
          }
        }
      }

      //删除被标记delete的仓位,filter放map前面可以忽略当前的标记
      storeArr = storeArrHistory.filter((store) => store.deleteIdx === undefined);
      //给第一次leave为true的,标记deleteIdx
      //todo 再优化,可以考虑做个leaveObj,清仓时状态保留
      storeArrHistory.map(
        (store) => (store.deleteIdx = store.leave && store.deleteIdx === undefined ? idx : store.deleteIdx)
      );

      obj = {
        idx,
        idxFull,
        storeArr,
        storeArrHistory,
        store: [...storeArr],
        storeDeleteIdx: [...storeArr].map((i) => i.deleteIdx)[0],
        storeEnter: [...storeArr].map((i) => i.enter)[0],
        storeLeave: [...storeArr].map((i) => i.leave)[0],
        storeEnterPlans: [...storeArr].map((i) => i.enterObj.plans)[0],
        storeLeavePlans: [...storeArr].map((i) => i.leaveObj.plans)[0],
        storeEnterValue: [...storeArr].map((i) => i.enterObj.value.currentData.idx)[0],
        storeLeaveValue: [...storeArr].map((i) => i.leaveObj.value.currentData.idx)[0],
        storeIdxArr: [...storeArr].map((i) => i.storeData.idx),
        storeIdxArrHistory: [...storeArrHistory].map((i) => i.storeData.idx),
      };
    }
    dataObj = yield obj;
  }
}

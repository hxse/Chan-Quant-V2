export function* genQuant(dataObj, level, config) {
  let lastIsLeft = null;
  let childIdx = [];
  let lastChildEqNum = null;
  for (let idxFull = 0; true; idxFull++) {
    let idx = idxFull - config.smaExtra;
    let isLeftEqual = null; //如果左右两个horse中有一个是null,返回null
    let isDownEqual = null; //如果上下两个horse中有一个是null,返回null
    let equalChildIdxArr = null;
    let diffChildIdxArr = null;
    let equalChildIdxLength = null;
    let diffChildIdxLength = null;
    let initChild = null;
    let startIdx = null; //直到第一个异色的发生,才会返回idx,否则返回null,在没有异色发生之前,就算horse不为null,也返回null
    if (level != config.smaLevel[0]) {
      const { tohlcv, sma, horse, quant } = dataObj;
      const { timeArr, openArr, highArr, lowArr, closeArr, volumeArr } = tohlcv;
      let currentHorseArr = horse[`horse${level}`];
      let currentQuantArr = quant[`quant${level}`];
      let downHorseArr = horse[`horse${level / 2}`];
      let downQuantArr = quant[`quant${level / 2}`];
      let currentHorse = currentHorseArr.at(-1);
      let leftHorse = currentHorseArr.at(-2);
      isLeftEqual = currentHorse == null || leftHorse == null ? null : currentHorse == leftHorse;
      let down = downHorseArr.at(-1);
      isDownEqual = currentHorse == null || down == null ? null : currentHorse == down;
      if (isLeftEqual === false) {
        lastIsLeft = idx;
      }
      startIdx = lastIsLeft;

      let childQuant = downQuantArr.at(-1);
      if (isLeftEqual === false) {
        childIdx = [childQuant.startIdx];
      } else if (isLeftEqual === true) {
        childIdx = childIdx.includes(childQuant.startIdx) ? childIdx : [...childIdx, childQuant.startIdx];
      } else {
        childIdx = [];
      }

      equalChildIdxArr = childIdx.filter((i, n) => {
        if (i <= startIdx) {
          //当前笔的起点
          return [...currentQuantArr, { isDownEqual }][startIdx + config.smaExtra]?.isDownEqual;
        } else {
          return [...currentQuantArr, { isDownEqual }][i + config.smaExtra]?.isDownEqual;
        }
      }); //判断当前元素和子元素的start是否isDown,手动写入isDownEqual是因为当前的这个值还没有更新到里面
      diffChildIdxArr = childIdx.filter((i) => {
        if (i <= startIdx) {
          //当前笔的起点
          return ![...currentQuantArr, { isDownEqual }][startIdx + config.smaExtra]?.isDownEqual;
        } else {
          return ![...currentQuantArr, { isDownEqual }][i + config.smaExtra]?.isDownEqual;
        }
      });
      equalChildIdxLength = equalChildIdxArr ? equalChildIdxArr.length : 0;
      diffChildIdxLength = diffChildIdxLength ? diffChildIdxLength.length : 0;

      function getInitChild(quant, startIdx, level) {
        if (level <= config.smaLevel[1]) {
          return startIdx;
        } else {
          return getInitChild(quant, quant[`quant${level / 2}`][startIdx + config.smaExtra]?.startIdx, level / 2);
        }
      }
      initChild = getInitChild(quant, startIdx, level);
      //todo,如果initChild是反向的就向右查找一个临近值正向值补全

      if (!isLeftEqual) {
        lastChildEqNum = currentQuantArr[idxFull - 1]?.equalChildIdxArr?.length;
      }
      if (idx == 10 && level == 8) {
        // debugger;
      }
    }
    dataObj = yield {
      idxFull,
      idx,
      level,
      isLeftEqual,
      isDownEqual,
      startIdx,
      childIdx,
      equalChildIdxArr,
      diffChildIdxArr,
      equalChildIdxLength,
      diffChildIdxLength,
      initChild,
      lastChildEqNum,
    };
  }
}

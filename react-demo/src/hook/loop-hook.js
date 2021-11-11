import { unstable_batchedUpdates } from "react-dom";

const useLoop = (opt, upData) => {
  let { mode, lazyTime, time, setTime } = opt;
  //mode:"" 留空则不更新图表
  //mode:"anima" 在浏览器切换标签页或者最小化的时候会直接停掉的
  //mode:"timeout" 最小化时也正常运行,但是setTimeout的最小间隔时间会被限制为1s
  //mode:"timeout"不需要传递time,setTime这两个参数,anima模式需要
  switch (mode) {
    case "anima":
      (async function animLoop() {
        const nowTime = Date.now();
        // 当前时间-上次执行时间如果大于lazyTime，那么执行动画
        if (nowTime - time > lazyTime) {
          unstable_batchedUpdates(() => {
            upData();
            setTime(nowTime); //更新上次执行时间
          });
          return;
        }
        return requestAnimationFrame(animLoop);
      })();
      break;
    case "timeout":
      setTimeout(() => {
        unstable_batchedUpdates(() => {
          upData();
        });
      }, lazyTime);
    default:
      break;
  }
};

export default useLoop;

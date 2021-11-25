import UplotReact from "uplot-react";
import horseOpt from "./horseOpt";
import React, { useState } from "react";

function HorsePlot({ dataObj, config, isUpdate,isInit ,isWaiting}) {
  console.log("enter HorsePlot");
  const [opt, setOpt] = useState(horseOpt({ dataObj, config }));
  const title = "upDateing...";
  if (isUpdate.isUpdateHorse) {
    //需要更新的时候再更新,因为是从插件里加载的数据,更新时会重载组件的
    isUpdate.isUpdateHorse = false;
    const _ = horseOpt({ dataObj, config });
    _["title"] = title;
    setOpt(_);
  }
  const uplotData = [dataObj.tohlcv[0].slice(config.smaExtra), []];
  console.log("end HorsePlot");
  return (
    <UplotReact
      key="hooks-key"
      options={opt}
      data={uplotData}
      //   target={root}
      onDelete={() => console.log("Deleted from hooks horseUplot")}
      onCreate={() => console.log("Created from hooks horseUplot")}
    />
  );
}
export default React.memo(HorsePlot);

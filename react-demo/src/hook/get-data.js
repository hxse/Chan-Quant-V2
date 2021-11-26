import { unstable_batchedUpdates } from "react-dom";

export function useApi(config, mode, loopCount) {
  console.log("loopCount", loopCount);
  let { name, frequency, count, refresh, updateCount, updateRefresh, smaExtra } = config;
  let api;
  if (mode == "initRequest") {
    api = `http://127.0.0.1:8000/ohlcv?name=${name}&frequency=${frequency}&count=${
      count + smaExtra
    }&refresh=${refresh}`;
    if (config.fake) {
      let start = 0;
      let end = config.count + smaExtra - config.fakeNum;
      api = api + `&testUpdate=${true}&splitStart=${start}&splitEnd=${end}`;
    }
  }
  if (mode == "updateRequest") {
    api = `http://127.0.0.1:8000/ohlcv?name=${name}&frequency=${frequency}&count=${
      config.fake ? count + smaExtra : updateCount + smaExtra
    }&refresh=${updateRefresh}`;
    if (config.fake) {
      let start =
        config.count + smaExtra - config.fakeNum + (loopCount - 1) * config.fakeStep - Math.floor(config.fakeStep);
      let end =
        config.count + smaExtra - config.fakeNum + (loopCount - 1) * config.fakeStep + Math.floor(config.fakeStep);
      api = api + `&testUpdate=${true}&splitStart=${start}&splitEnd=${end}`;
      if (start > config.count + smaExtra) {
        api = null; //返回null会默认忽略这次请求
      }
    }
  }
  return api;
}

async function fetchData(url) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log("Request Failed", error);
  }
}
export async function useFetchData(url, batchedUpdates, fake = null) {
  let data = url == null ? null : await fetchData(url);
  unstable_batchedUpdates(() => {
    //因为在异步函数中,所以react不会自动进行批处理的,所以需要引入unstable_batchedUpdates
    //在react18中会自动批处理
    batchedUpdates(fake ? fake(data) : data);
  });
}

import temp from "./config-temp";
function getUrlQuery(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return undefined;
}

// const configName = getUrlQuery("config");
// if (configName == undefined || config[configName] == undefined) {
//   alert("配置文件不存在");
//   throw "配置文件不存在";
// }

const name = getUrlQuery("name");
const frequency = getUrlQuery("frequency");
if (name == undefined || frequency == undefined) {
  alert("参数不全");
  throw "参数不全";
}

export default { ...temp, name: name, frequency: frequency };

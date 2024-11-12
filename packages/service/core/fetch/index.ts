const { fetch } = require("undici");
const { setGlobalDispatcher, ProxyAgent } = require("undici");
const path = require('path')
// 指定静态文件目录
const staticPath = path.join(__dirname, 'public');

const proxyAgent = new ProxyAgent({
  uri: "http://127.0.0.1:7890",
});

setGlobalDispatcher(proxyAgent);

export default fetch;
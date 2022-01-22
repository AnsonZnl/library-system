const CloudBase = require("@cloudbase/node-sdk");
const config = require("./config");

const tcb = CloudBase.init({
    secretId: config.SecretId,
    secretKey: config.SecretKey,
    envId: config.envId, // 云环境 ID，可在腾讯云-云开发控制台获取
});
module.exports = tcb;
// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 
 * 
 * 获取当前的时间，并格式化
 * 
 */
exports.main = (event, context) => {
  let time = new Date()
  const wxContext = cloud.getWXContext()
  return {
    time,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}


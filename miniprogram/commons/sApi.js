const { apis, openidKey, apiHost } = require('./config')
const { getStorageSync } = require('./utils')
export const getUserInfo = () => {
  const _openid = getStorageSync(openidKey)
  return wx.sRequest(apiHost + apis.getUserInfo, {
    openid: _openid
  }).catch((e) => {
  })
}
/**
 * 获取用户列表
 * @param {*} ops 
 */
export const getUsers = (ops) => {
  return wx.sRequest(apiHost + apis.getUserList, ops, {
    method: 'POST'
  }).catch((e) => {})
}
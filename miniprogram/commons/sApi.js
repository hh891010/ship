const { apis, openidKey, apiHost } = require('./config')
const { getStorageSync } = require('./utils')
export const getUserInfo = () => {
  const _openid = getStorageSync(openidKey)
  return wx.sRequest(apiHost + apis.getUserInfo, {
    openid: _openid
  }).catch((e) => {
  })
}
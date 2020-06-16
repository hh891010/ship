const { apis, openidKey, apiHost } = require('./config')
const { getStorageSync } = require('./utils')
/**
 * 获取用户信息
 */
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
/**
 * 修改密码
 * @param {*} ops 
 */
export const updatePassWord = (ops) => {
  return wx.sRequest(apiHost + apis.updateUserPassWord, ops, {
    method: 'POST'
  }).catch((e) => {})
}
/**
 * 添加&修改船舶信息
 */
export const saveShip = (ops) => {
  return wx.sRequest(apiHost + apis.addAndUpdateShip, ops, {
    method: 'POST'
  }).catch((e) => {})
}

export const uploadImg = (path) => {
  return wx.sRequest(apiHost + apis.uploadImage, {}, {
    method: 'POST',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    wxParams: {
      name: 'file',
      filePath: path,
    }
  }, 'uploadFile').catch((e) => {})
}
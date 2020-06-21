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
 * 获取当前用户详细信息
 * @param {*} pkid 
 */
export const getCurrentUserDetail = (pkid) => {
  return wx.sRequest(`${apiHost}${apis.getUserDetail}`, {
    id: pkid
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
 * 添加&修改用户信息
 */
export const saveUserInfo = (ops) => {
  return wx.sRequest(`${apiHost}${apis.addAndUpdateUser}`, ops, {
    method: 'POST'
  }).catch(err => {})
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
  return wx.sRequest(apiHost + apis.addAndEditShip, ops, {
    method: 'POST'
  }).catch((e) => {})
}

/**
 * 获取船舶列表
 * @param {*} ops 
 */
export const selectShips = (ops) => {
  return wx.sRequest(`${apiHost}${apis.selectShipList}`, ops, {
    method: 'POST'
  }).catch(err => {})
}

/**
 * 获取船舶详情
 * @param {*} id 
 */
export const selectShipInfo = (id) => {
  return wx.sRequest(`${apiHost}${apis.selectShipDetail}?id=${id}`).catch(err => {})
}
/**
 * 船舶航迹开关
 * @param {*} ops 
 */
export const setShipWakeStatus = (ops) => {
  return wx.sRequest(`${apiHost}${apis.setWakeStatus}`, ops, {
    method: 'POST'
  }).catch(err => {})
}

/**
 * 设置跟踪船只
 * @param {*} shipId 
 */
export const setFollow = (shipId) => {
  const _url = `${apiHost}${apis.setFollowByShipId}`
  console.log(_url)
  return wx.sRequest(_url, {
    shipId
  }).catch(err => {})
}

/**
 * 获取角色列表
 */
export const selectRoleList = () => {
  return wx.sRequest(`${apiHost}${apis.getRoleList}`).catch(err => {})
}

/**
 * 获取运行中的所有船只
 */
export const selectWorkingShipList = () => {
  return wx.sRequest(`${apiHost}${apis.selectWorkingShips}`).catch(err => {})
}
/**
 * 上传图片
 * @param {*} path 
 */
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
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
 * 统计航迹信息
 * @param {*} ops 
 */
export const calculateTrackInfo = (ops) => {
  return wx.sRequest(`${apiHost}${apis.calculateTrackInfo}`, ops , {
    method: 'POST'
  }).catch(err => {})
}
/**
 * 查询当天航迹信息
 */
export const findCurrentTrack = () => {
  return wx.sRequest(`${apiHost}${apis.findCurrentTrack}`,null,{
    method: 'GET'
  }).catch(err => {})
}

/**
 * 航迹列表
 * @param {*} ops 
 */
export const findTrackPage = (ops) => {
  return wx.sRequest(`${apiHost}${apis.findTrackPage}`, ops , {
    method: 'POST'
  }).catch(err => {})
}
/**
 * 获取航迹详情
 * @param {*} id 
 */
export const getTrackDetail = (id) => {
  return wx.sRequest(`${apiHost}${apis.findTrackDetail}?id=${id}`).catch(err => {})
}
/**
 * 获取当前用户的船只
 */
export const getCurrentShip = () => {
  return wx.sRequest(`${apiHost}${apis.getCurrentUserShip}`).catch(err => {})
}

/**
 * 后去船只历史航海记录
 * @param {*} path 
 */
export const getFollowShipPoint = (id) => {
  return wx.sRequest(`${apiHost}${apis.findFollowShipHistoryLocation}?shipId=${id}`).catch(err => {})
}
/**
 * 查询监测类型
 */
export const findTypeOfInquiry = () => {
  return wx.sRequest(`${apiHost}${apis.findTypeOfInquiry}`).catch(err => {})
}
/**
 * 查询监测记录
 * @param {*} id 
 */
export const findMonitoringById = (id) => {
  return wx.sRequest(`${apiHost}${apis.findShipMonitoringById}?id=${id}`).catch(err => {})
}
/**
 * 添加&修改监测数据
 * @param {*} ops 
 */
export const saveMonitoring = (ops) => {
  return wx.sRequest(`${apiHost}${apis.saveShipMonitoring}`, ops, {
    method: 'POST'
  }).catch(err => {})
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


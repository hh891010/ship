
const { userAuth } = require('./config')
 
const sRequest = (url, data, options) => {
  // 获取auth信息
  const userToken = wx.getStorageSync(userAuth)
  const { 
    header,
    isLoading,
    loadingTitle,
    method,
    noAuth
  } = options || {}
  const _header = Object({
    Authorization: `Bearer ${userToken}`
  }, header)
  if (noAuth) {
    delete _header.Authorization
  }
  return new Promise((resolve, reject) => {
    if (userToken || noAuth) {
      if (isLoading) {
        wx.showLoading({
          title: loadingTitle || '加载中...'
        })
      }
      wx.request({
        url,
        data,
        header: _header,
        method: method || 'GET',
        success: res => {
          if (isLoading) {
            wx.hideLoading()
          }
          const  statusCode = res.statusCode
          switch (statusCode) {
            case 200:
              resolve(res.data)
              break;
            case 401:
              // 跳转登录
              break;
            default:
              reject(res)
              break;
          }
        },
        fail: res => {
          if (isLoading) {
            wx.hideLoading()
            wx.showToast({
              title: '网络异常，请检查网络状态',
              icon: 'none',
              duration: 3000
            })
            reject(res)
          }
        }
      })
    } else {
      // 跳转登录
      reject({
        message: '授权信息失效，请从新登陆'
      })
    }
  })
}
module.exports = {
  sRequest
}
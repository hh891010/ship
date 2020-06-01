
const { userAuthKey } = require('./config')
const { getStorageSync, removeStorageSync } = require('../commons/utils')
const _host = 'https://www.orangesoda.cn'
const filterApis = [
  `${_host}/ship-auth-server/oauth/token`
]
const authFilter = (url) => {
  return filterApis.includes(url)
}

const errToast = (message) => {
  wx.showToast({
    title: message || '网络异常',
    icon: 'none',
    duration: 3000
  })
}

const toLogin = (resolve, reject, ops) => {
  // 跳转登录
  removeStorageSync(userAuthKey)
  wx.$eventBus.$on('login_success', (token) => {
    token && sRequest(ops.url, ops.data, ops.options).then(resolve, reject).catch(() => {})
  })
  wx.navigateTo({
    url: '/pages/home/login/index'
  })
}

const sRequest = (url, data, options) => {
  // 获取auth信息
  const userToken = getStorageSync(userAuthKey)
  const { 
    header,
    isLoading,
    loadingTitle,
    method,
    noAuth,
    specialResponse
  } = options || {}
  const _header = Object.assign({
    Authorization: `Bearer ${userToken}`
  }, header)
  if (noAuth) {
    delete _header.Authorization
  }
  return new Promise((resolve, reject) => {
    if (userToken || noAuth || authFilter(url)) {
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
          const statusCode = res.statusCode
          const _data = res.data
          switch (statusCode) {
            case 200:
              const { data, code, success, message } = _data || {}
              if (specialResponse || (code === 1000000 && success)) {
                resolve(specialResponse ? _data : _data.data)
              } else {
                if (code === 401) {
                  toLogin(resolve, reject, {
                    url,
                    data,
                    options
                  })
                } else {
                  errToast(message)
                  reject(_data)
                }
              }
              break;
            case 401:
              toLogin(resolve, reject, {
                url,
                data,
                options
              })
              break;
            default:
              reject(_data)
              break;
          }
        },
        fail: res => {
          if (isLoading) {
            wx.hideLoading()
          }
          errToast(res.errMsg)
          reject(res)
        }
      })
    } else {
      toLogin(resolve, reject, {
        url,
        data,
        options
      })
    }
  })
}

module.exports = {
  sRequest
}
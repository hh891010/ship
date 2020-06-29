
const { userAuthKey } = require('./config')
const { getStorageSync, removeStorageSync } = require('../commons/utils')
const _host = 'https://www.orangesoda.cn'
const filterApis = [
  `${_host}/ship-auth-server/api/login`
]
const authFilter = (url) => {
  return filterApis.includes(url)
}

const jsonDataType = ['uploadFile']

const errToast = (message) => {
  wx.showToast({
    title: message || '网络异常',
    icon: 'none',
    duration: 3000
  })
}

const toLogin = (resolve, reject, ops, requestName) => {
  // 跳转登录
  removeStorageSync(userAuthKey)
  wx.$eventBus.$on('login_success', (token) => {
    console.log(token, ops)
    token && sRequest(ops.url, ops.data, ops.options, requestName).then(resolve, reject).catch(() => {})
  })
  wx.navigateTo({
    url: '/pages/home/login/index'
  })
}

const sRequest = (url, data, options, requestName = 'request') => {
  const baseData = data
  const baseOps = options
  // 获取auth信息
  const userToken = getStorageSync(userAuthKey)
  const { 
    header,
    isLoading,
    loadingTitle,
    method,
    noAuth,
    specialResponse,
    wxParams
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
      wx[requestName]({
        ...wxParams,
        url,
        data,
        header: _header,
        method: method || 'GET',
        success: res => {
          if (isLoading) {
            wx.hideLoading()
          }
          const statusCode = res.statusCode
          const _data = jsonDataType.indexOf(requestName) > -1 ? JSON.parse(res.data) : res.data
          switch (statusCode) {
            case 200:
              const { data, code, success, message } = _data || {}
              if (specialResponse || (code === 1000000 && success)) {
                resolve(specialResponse ? _data : _data.data)
              } else {
                if (code === 401) {
                  toLogin(resolve, reject, {
                    url,
                    data: baseData,
                    options: baseOps,
                    requestName
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
                data: baseData,
                options: baseOps,
                requestName
              })
              break;
            default:
              reject(_data)
              break;
          }
        },
        fail: res => {
          console.log(res)
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
        options,
        requestName
      })
    }
  })
}

module.exports = {
  sRequest
}

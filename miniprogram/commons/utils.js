const interceptorMethods = ['fail', 'success', 'complete']
// const eventBus = require('./eventBus')
/**
 * 时间转换
 * @param {*} date 
 * @param {*} symbol 年月日连接符
 */
const formatTime = (date, symbol, isTime = true) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const seconds = date.getSeconds()
  let _date = [year, month, day].map(formatNumber).join(symbol || '-')
  if (isTime) {
    _date = _date + ' ' + [hour, minute, seconds].map(formatNumber).join(':')
  }
  return _date
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
      
/**
 * 将方法promise化替换 'fail', 'success'
 * @param {*} method 
 * @param {*} params 
 */
const promisify = (method, params) => {
  if (typeof method !== 'function') {
    throw new Error('method is not a function')
  }
  return new Promise((resolve, reject) => {
    interceptorMethods.forEach(key => {
      params[key] = (res) => {
        if (key === 'success') {
          resolve(res)
        } else if (key === 'fail') {
          reject(res)
        }
      }
    })
    method(params)
  })
}

/**
 * 拆分页面路径和参数
 * @param path
 * @example
 *  '/pages/home/index?a=1&b=2'
 */
const formatPath = path => {
  const [url, param] = path.split('?');
  let params = {}
  if (param) {
    param.split('&').forEach(kv => {
      const [key, value] = kv.split('=');
      params[key] = value;
    });
  }
  return {
    url,
    params
  };
}

/**
 * 创建随机id
 */
const createUid = () => {
  return Math.random().toString().substr(2)
}

const once = (fn) => {
  let called = false
  return (that, ...args) => {
    if (!called) {
      called = true
      fn.apply(that, args)
    }
  }
}

// 页面导航
// const navigateTo = (eventKey, data) => {
//   const _that = this
//   return new Promise((resolve, reject) => {
//     _pageWatch()
//     wx.navigateTo(data)
//       /**
//        * 监听用户页面改变
//        */
//     function _pageWatch () {
//       /**
//        * 用户设置了默认值
//        * @param {Object} data 数据
//        */
//       function _handler (data) {
//         _reset()
//         resolve(data)
//       }
//       /**
//        * 重置
//        */
//       function _reset () {
//         eventBus.$off(eventKey, _handler)
//       }
//       eventBus.$on(eventKey, _handler)
//     }
//   })
// }

module.exports = {
  formatTime,
  promisify,
  formatPath,
  createUid,
  once
}

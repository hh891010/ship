const interceptorMethods = ['fail', 'success', 'complete']
/**
 * 时间转换
 * @param {*} date 
 * @param {*} symbol 年月日连接符
 */
const formatTime = (date, symbol) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const seconds = date.getSeconds()
  return [year, month, day].map(formatNumber).join(symbol || '-') + ' ' + [hour, minute, seconds].map(formatNumber).join(':')
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
 *  '/pages/home/home?a=1&b=2'
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

module.exports = {
  formatTime,
  promisify,
  formatPath
}

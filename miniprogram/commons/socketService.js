// const com = require('./utils')
const wxskt = null
export default {
  async socketConnect() {
    const _that = this
    const url = 'wx://ship.cn/xxx'
    if (wxskt) _that.close
    // 连接socket
    wxskt = wx.connectSocket({
      url: '',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    })
    // 打开socket连接
    wxskt.onOpen(res => {
      console.info('打开连接')
    })

  }
}
/**
 * websocket封装
 */
const config = require('./config.js')
let sotk = null;
let socketOpen =false;

const ws_connect = (sid,reMsg)=>{
  sotk = wx.connectSocket({
    url: config.websocketServer + sid,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    }
  })

  sotk.onOpen(res => {
    socketOpen = true;
    console.log('监听 WebSocket 连接打开事件。', res);
  })
  sotk.onClose(onClose => {
    socketOpen = false;
    console.log('监听 WebSocket 连接关闭事件。', onClose)
  })
  sotk.onError(onError => {
    socketOpen = true;
    console.log('监听 WebSocket 错误。错误信息', onError)
  })

  // 收到消息
  sotk.onMessage(onMessage => {
    const _message = onMessage.data.replace(" ", "");
    if (_message.indexOf('[') === 0) {
      const _data = JSON.parse(_message || '')
      if(_data && typeof _data === 'object'){
        reMsg(_data);
      }
    }
  })
}

module.exports = {
  ws_connect
}
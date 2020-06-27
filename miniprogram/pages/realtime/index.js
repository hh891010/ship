const com = require('../../commons/constant') 
const util = require('../../commons/utils')
const websocket = require('../../commons/websocket')
const { apis, userAuthKey, openidKey, userInfoKey, apiHost } = require('../../commons/config')
const { getUserInfo, getFollowShipPoint, getShipHistory } = require('../../commons/sApi')
// const icon = require('../../images/current.png')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '首页',
    longitude: 0,
    latitude: 0,
    markers: [],
    polyline: [{
      points: [],
      color: "#33c9FF",
      width: 5,
      dottedLine: false,
      arrowLine: true
    }],
    followShipId: 0
  },
  addMonitor() {
    wx.navigateTo({
      url: '/pages/monitor/detail/index'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    if (!app.globalData.token) {
      _that.onLogin()
    }
    wx.$eventBus.$on('refresh_ship', () => {
      _that.getCurrentUser()
    })
  },
  async getOpenidAndToken(code) {
    const _that = this
    const _url = `${apiHost}${apis.getOpenidAndToken}`
    const param = {
      code
    }
    const userInfo = await wx.sRequest(_url, param, {
      isLoading: true,
      noAuth: true
    }).catch(() => {})
    const { token, openid } = userInfo || {}
    util.setStorageSync(userAuthKey, token)
    util.setStorageSync(openidKey, openid)
    if (!token) {
      wx.$eventBus.$on('login_success', (token) => {
        _that.getCurrentUser()
      })
      wx.navigateTo({
        url: '/pages/home/login/index'
      })
    } else {
      _that.getCurrentUser()
    }
  },
  getCurrentShipPoint() {
    const _that = this
    const _user = util.getStorageSync(userInfoKey)
    if (_user && _user.followShipId) {
      _that.setData({
        followShipId: _user.followShipId
      })
      getFollowShipPoint(_user.followShipId).then(res => {
        const { spotList, shipName } = res || {}
        _that.setData({
          title: shipName
        })
        if (spotList && spotList.length > 0) {
          const _ship = spotList[spotList.length - 1]
          const { longitude, latitude } = _ship
          _that.setData({
            longitude,
            latitude,
            ['polyline[0].points']: spotList
          })
        } else {
          _that.setData({
            ['polyline[0].points']: []
          })
        }
      })
    } else {
      util.promisify(wx.showModal, {
        title: '提示',
        content: '您暂无船只权限，请联系管理员',
        showCancel: false,
        confirmText: '知道了'
      }).then(res => {
        if (res.confirm) {
          console.log('用户点了ok')
        }
      })
    }
  },
  async getCurrentUser() {
    const _that = this
    const user = await getUserInfo()
    const { latitude, longitude } = await util.promisify(wx.getLocation, {})
    this.setData({
      latitude,
      longitude
    })
    util.setStorageSync(userInfoKey, user)
    getShipHistory().then(res => {
      const _ships = (res || []).filter(x => x.shipId === user.followShipId)
      let _ship = _ships.length > 0 ? _ships[0] : {}
      _that.setData({
        latitude: _ship.latitude || latitude,
        longitude: _ship.longitude || longitude,
        markers: _that.shipMarkerData(res) || []
      })
    })
    _that.getCurrentShipPoint()
    this.acceptLocationData(user.pkid)
    return user
  },
  shipMarkerData(list) {
    return list.map((x, index) => {
      const item = Object.assign({
        id: index + 1,
        zIndex: 10,
        iconPath: '../../images/boat.png',
        width: 50,
        height: 50,
        callout: {
          color: "#FFFFFF",
          content: x.shipName,
          display: 'ALWAYS',
          bgColor: '#9a9341',
          borderRadius: 5,
          anchorY: 20,
          anchorX: -5
        }
      }, x)
      return item
    })
  },
  onLogin() {
    const _that = this
    util.promisify(wx.login, {
      timeout: 5000
    }).then(res => {
      const { code } = res || {}
      _that.getOpenidAndToken(code)
    })
  },
  acceptLocationData(sid){
    let _that = this
    const followShipId = _that.data.followShipId
    websocket.ws_connect(sid,(data)=>{
      console.log(33333, data)
      const ships = (data || []).filter(x => x.shipId === followShipId)
      const _markers = _that.shipMarkerData(data)
      if (ships && ships.length > 0) {
        const { longitude, latitude } = ships[0]
        const _spotList = _that.data.polyline[0].points
        _spotList.push({ longitude, latitude })
        _that.setData({
          longitude,
          latitude,
          ['polyline[0].points']: _spotList,
          markers: _markers
        })
      } else {
        _that.setData({
          markers: _markers
        })
      }
    })
  }
})
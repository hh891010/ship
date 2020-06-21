const com = require('../../commons/constant') 
const util = require('../../commons/utils')
const { apis, userAuthKey, openidKey, userInfoKey, apiHost } = require('../../commons/config')
const { getUserInfo, getFollowShipPoint } = require('../../commons/sApi')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '首页',
    current: {},
    markers: [
      {
        id: 1,
        longitude: 121.44597861,
        latitude: 37.48515260,
        zIndex: 10,
        iconPath: '../../images/current.png',
        width: 20,
        height: 20,
        callout: {
          color: "#FFFFFF",
          content: '长江一号',
          display: 'ALWAYS',
          bgColor: '#9a9341',
          borderRadius: 5
        }
      },
      {
        id: 2,
        longitude: 121.44577861,
        latitude: 37.48405260,
        zIndex: 10,
        iconPath: '../../images/current.png',
        width: 20,
        height: 30,
        callout: {
          color: "#FFFFFF",
          content: '长江二号',
          display: 'ALWAYS',
          bgColor: '#9a9341',
          borderRadius: 5
        }
      },
      {
        id: 3,
        longitude: 121.44507861,
        latitude: 37.48499260,
        zIndex: 10,
        iconPath: '../../images/current.png',
        width: 20,
        height: 20,
        callout: {
          color: "#FFFFFF",
          content: '长江三号',
          display: 'ALWAYS',
          bgColor: '#9a9341',
          borderRadius: 5
        }
      },
      {
        id: 4,
        longitude: 121.44577861,
        latitude: 37.48205260,
        zIndex: 10,
        iconPath: '../../images/start.png',
        width: 30,
        height: 30
      },
      {
        id: 5,
        longitude: 121.44748986,
        latitude: 37.48299336,
        zIndex: 10,
        iconPath: '../../images/current.png',
        width: 20,
        height: 20,
        callout: {
          color: "#FFFFFF",
          content: '南极科考1号',
          display: 'ALWAYS',
          bgColor: '#9a9341',
          borderRadius: 5
        }
      }
    ],
    polyline: [{
      points: [],
      color: "#33c9FF",
      width: 3,
      dottedLine: false,
      arrowLine: true
    }]
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
      getFollowShipPoint(3).then(res => {
        const { spotList, shipName } = res || {}
        _that.setData({
          title: shipName
        })
        if (spotList && spotList.length > 0) {
          _that.setData({
            current: spotList[0],
            ['polyline[0].points']: spotList
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
    const user = await getUserInfo()
    const { latitude, longitude } = await util.promisify(wx.getLocation, {})
    this.setData({
      current: {
        latitude,
        longitude
      }
    })
    util.setStorageSync(userInfoKey, user)
    this.getCurrentShipPoint()
    return user
  },
  onLogin() {
    const _that = this
    util.promisify(wx.login, {
      timeout: 5000
    }).then(res => {
      const { code } = res || {}
      _that.getOpenidAndToken(code)
    })
  }
})
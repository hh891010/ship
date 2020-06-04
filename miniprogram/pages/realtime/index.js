const com = require('../../commons/constant') 
const util = require('../../commons/utils')
const { apis, userAuthKey, openidKey, userInfoKey, apiHost } = require('../../commons/config')
const { getUserInfo } = require('../../commons/sApi')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '未知',
    latitude: 37.48205260,
    longitude: 121.44577861,
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
      points: [{
          longitude: 121.44577861,
          latitude: 37.48205260
        }, {
          longitude: 121.44611657,
          latitude: 37.48207388
        }, {
          longitude: 121.44725382,
          latitude: 37.48224841
        }, {
          longitude: 121.44766152,
          latitude: 37.48237186
        },{
          longitude: 121.4475274100,
          latitude: 37.4827039000
        },{
          longitude: 121.44748986,
          latitude: 37.48299336
        }
      ],
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
        _that.getCurrentUser().then(res => {
          _that.realtimeGetLocation()
        })
      })
      wx.navigateTo({
        url: '/pages/home/login/index'
      })
    } else {
      _that.getCurrentUser()
    }
  },
  async getCurrentUser() {
    const user = await getUserInfo()
    util.setStorageSync(userInfoKey, user)
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
  },
  realtimeGetLocation() {
    const _that = this
    const _locations = [
      {
        longitude: 121.4476454300,
        latitude: 37.4831679000
      },{
        longitude: 121.4478063600,
        latitude: 37.4831381000
      },{
        longitude: 121.4479565600,
        latitude: 37.4831295800
      },{
        longitude: 121.4480263000,
        latitude: 37.4831636400
      },{
        longitude: 121.44820869,
        latitude: 37.48330837
      }
    ]
    let index = 0
    const timer = setInterval(() => {
      if (index >= _locations.length) {
        clearInterval(timer)
        return
      }
      const _points = _that.data.polyline[0].points
      const currentLocat = _locations[index]
      const _markers = _that.data.markers
      const lastmarker = `markers[${_markers.length - 1}]`
      _points.push(_locations[index])
      _that.setData({
        ['polyline[0].points']: _points,
        [lastmarker]: Object.assign(_markers[_markers.length - 1], currentLocat)
      })
      index++
    }, 2000);
  }
})
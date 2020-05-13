const com = require('../../commons/constant') 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    // polyline: [{
    //   points: com.points,
    //   color: "#ff6600",
    //   width: 2,
    //   dottedLine: false,
    //   arrowLine: true,
    //   borderColor: "#000000",
    //   borderWidth: 5
    // }]
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
  handlerGobackClick() {
    console.log('返回')
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
    wx.getLocation({
      success: function(res) {
        const { latitude, longitude } = res
        _that.setData({
          latitude,
          longitude
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
    _that.realtimeGetLocation()
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
    // setTimeout(() => {
    //   _that.setData({
    //     ['polyline[0].points']: _locations
    //   })
    // }, 3000)
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
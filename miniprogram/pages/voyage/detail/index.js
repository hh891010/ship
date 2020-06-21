const { getTrackDetail } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['航迹记录', '监测记录'],
    voyageTime: '',
    shipName: '',
    mileage: 0,
    currentIndex: 0,
    voyageId: 0,
    monitoringList: null,
    current: {},
    polyline: [{
      points: [
        {
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
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.initFn(id)
  },
  async initFn(id) {
   const result = await getTrackDetail(id)
   const { showDate, shipName, mileage, monitoringList, shipSpotList } = result || {}
   this.setData({
    voyageTime: showDate,
    shipName: shipName,
    monitoringList,
    mileage,
    current: shipSpotList && shipSpotList.length > 0 ? shipSpotList[0] : {},
    ['polyline[0].points']: shipSpotList.map(x => {
      return {
        longitude: x.longitude,
        latitude: x.latitude
      }
    })
   })
  },
  swiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  switchSwiper(e) {
    const index = e.target.dataset.index
    this.setData({
      currentIndex: index
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
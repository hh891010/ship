const { getTrackDetail } = require('../../../commons/sApi')
const { formatTime } = require('../../../commons/utils')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['航迹记录', '监测记录'],
    scale: 15,
    voyageTime: '',
    shipName: '',
    mileage: 0,
    currentIndex: 0,
    voyageId: 0,
    monitoringList: null,
    current: {},
    polyline: [{
      points: [],
      color: "#33c9FF",
      width: 5,
      dottedLine: false,
      arrowLine: true
    }],
    id: 0
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
    this.setData({
      id
    })
    this.initFn()
  },
  getScale(mileage) {
    let _scale = 15
    if (mileage < 5) {
      _scale = 16
    } else if (mileage > 50 && mileage < 100) {
      _scale = 14
    } else if (mileage > 100) {
      _scale = 13
    }
    return _scale
  },
  async initFn() {
   const result = await getTrackDetail(this.data.id)
   const { showDate, shipName, mileage, monitoringList, shipSpotList } = result || {}
   monitoringList.map(x => {
     x.surveyTime = formatTime(new Date(x.surveyTime), '', false)
     return x
   })
   
   this.setData({
    voyageTime: showDate,
    shipName: shipName,
    monitoringList,
    mileage,
    scale: this.getScale(mileage),
    current: shipSpotList && shipSpotList.length > 0 ? shipSpotList[0] : {},
    ['polyline[0].points']: shipSpotList.reverse().map(x => {
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
  moreClick(e) {
    const { monitoring } = e.currentTarget.dataset
    console.log(monitoring)
    wx.$eventBus.$on('refresh_voyage', (obj) => {
      this.initFn()
    })
    wx.navigateTo({
      url: `/pages/monitor/detail/index?id=${monitoring.pkid}`
    });
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
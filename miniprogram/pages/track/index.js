// pages/track/index.js
const uitl = require('../../commons/utils');
const { calculateTrackInfo } = require('../../commons/sApi')
const { findCurrentTrack } = require('../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    tabs: ['自定义', '总计'],
    swiperHeight: '',
    startDate: '2020-06-20',
    endDate: uitl.formatTime(new Date(), '-', false),
    currentDate: uitl.formatTime(new Date(), '-', false),
    totalMileage: 0,
    totalTrackCount: 0,
    totalMonitoringCount: 0,
    showDate: '',
    voyages: [],
    totalTrack: {
      totalMileage: 0,
      totalTrackCount: 0,
      totalMonitoringCount: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFn(true)
  },
  initFn(isInit) {
    calculateTrackInfo({
      startDate: this.data.startDate,
      endDate: this.data.endDate
    }).then(res => {
      const { totalMileage, totalTrackCount, totalMonitoringCount } = res || {}
      this.setData({
        totalMileage,
        totalTrackCount,
        totalMonitoringCount
      })
      if (isInit) {
        this.setData({
          totalTrack: {
            totalMileage,
            totalTrackCount,
            totalMonitoringCount
          }
        })
      }
    })
    this.getCurrentTrack();
  },
  getCurrentTrack(){
    findCurrentTrack().then(res => {
      const {showDate,shipTrackList} = res || {}
      this.setData({
        showDate,
        voyages: shipTrackList
      })
    })		
  },
  moreVoyage() {
    wx.navigateTo({
      url: '/pages/voyage/list/list'
    });
  },
  pickerChange(e) {
    const value = e.detail.value
    const _type = e.target.dataset.type
    if (_type === 'endDate' && !this.data.startDate) {
      wx.showToast({
        title: '请先选择开始日期',
        mask: true,
        icon: 'none'
      })
      return
    }
    if (this.data.endDate) {
      const _startDate = +(new Date(value))
      const _endDate = +(new Date(this.data.endDate))
      if (_startDate > _endDate) {
        this.setData({
          endDate: ''
        })
        return
      }
    }
    this.setData({
      [_type]: value
    })
    this.initFn()
  },
  onVoyageClick(e) {
    const item = e.detail
    wx.navigateTo({
      url: `/pages/voyage/detail/index?id=${item.pkid}`
    });
  },
  getSwiperHeight() {

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
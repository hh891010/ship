// pages/track/index.js
const uitl = require('../../commons/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    tabs: ['自定义', '总计'],
    swiperHeight: '',
    startDate: '',
    endDate: '',
    currentDate: uitl.formatTime(new Date(), '-', false),
    voyages: [1, 2, 3, 4, 5]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      console.log(_startDate, _endDate)
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
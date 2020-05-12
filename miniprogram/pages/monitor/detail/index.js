const com = require('../../../commons/constant');
const { formatTime } = require('../../../commons/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: formatTime(new Date()),
    typeIndex: 0,
    fishType: com.fishType,
    initType: com.initType,
    environmentType: com.environmentType,
    monitorType: {
      id: 1,
      title: '调查种类：',
      isInput: false,
      canShow: true,
      iconmore: false,
      readonly: false,
      value: '',
      isSlot: true
    },
    monitorTypes: [
      {
        id: 1,
        value: '鱼类资源'
      },
      {
        id: 2,
        value: '早期资源'
      },
      {
        id: 3,
        value: '环境生物'
      }
    ]
  },
  monitorTypePickerChange(e) {
    this.setData({
      typeIndex: e.detail.value
    })
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
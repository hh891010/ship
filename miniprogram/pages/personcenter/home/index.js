// pages/person/index.js
const com = require('../../../commons/constant');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: com.homelist
  },
  onChange (e) {
    console.log(e.detail)
  },
  onCellClick(obj) {
    const { id } = obj.detail || {};
    let _url = '/pages/personcenter/detail/detail'
    switch (id) {
      case 1:
        _url = '/pages/personcenter/detail/detail';
        break;
      case 2:
        _url = "/pages/personcenter/password/index";
        break;
      case 3:
        _url = "/pages/ship/list/index"
        break;
      case 4:
        _url = "/pages/personcenter/user/usermanager"
        break;
    }
    wx.navigateTo({
      url: _url
    });
  },
  getUserData(res) {
    console.log(res.detail.userInfo.avatarUrl)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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
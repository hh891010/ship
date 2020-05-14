// miniprogram/pages/home/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  onInputBlur(e) {
    const value = e.detail.value
    const key = e.target.dataset.type
    this.setData({
      [key]: value
    })
  },
  onLogin() {
    if (!this.data.username) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      return
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '登录中'
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.reLaunch({
        url: '/pages/realtime/index'
      })
    }, 2000)
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
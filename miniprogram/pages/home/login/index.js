// const com = require('../../../commons/utils')
const { apis } = require('../../../commons/config')
const base64 = require('js-base64').Base64
const app = getApp()
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
    // com.promisify(wx.login, {
    //   timeout: 5000
    // }).then(res => {
    //   const { code } = res || {}
    // })
  },
  onInputBlur(e) {
    const value = e.detail.value
    const key = e.target.dataset.type
    this.setData({
      [key]: value
    })
  },
  userCheck() {
    let _ = true
    if (!this.data.username) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
      _ = false
    }
    if (!this.data.password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      _ = false
    }
    return _
  },
  onLogin() {
    const _that = this
    if (_that.userCheck()) {
      const basicAuth = base64.encode(`webapp:surveyship$2020`)
      console.log(basicAuth)
      wx.sRequest(`${app.globalData.api_host}${apis.userLogin}`, {
        grant_type: 'password',
        username: _that.data.username,
        password: _that.data.password
      }, {
        isLoading: true,
        loadingTitle: '登录中...',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`
        },
        basicAuth:true
      }).then(res => {
        console.log('login success', res)
      }).catch(err => {
        console.log('login error', err)
      })
    }
    // setTimeout(() => {
    //   wx.hideLoading()
    //   wx.$eventBus.$emit('sLogin', {
    //     token: 'adsfasdf',
    //     userid: 'fasdfasdf'
    //   })
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // }, 2000)
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

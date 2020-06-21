const { setStorageSync } = require('../../../commons/utils')
const { apis, userAuthKey, apiHost } = require('../../../commons/config')
const base64 = require('js-base64').Base64
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: 'admin110',
    password: 'surveyship$2020'
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
  createFormdata(obj = {}) {
    let result = ''
    for (let name of Object.keys(obj)) {
      let value = obj[name];
      result += `\r\n--XXX\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}`
    }
    return result + '\r\n--XXX--'
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
      const _ = _that.createFormdata({
        grant_type: 'password',
        username: _that.data.username,
        password: _that.data.password
      })
      wx.sRequest(`${apiHost}${apis.userLogin}`, _, {
        isLoading: true,
        loadingTitle: '登录中...',
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data;boundary=XXX',
          Authorization: `Basic ${basicAuth}`
        },
        specialResponse: true
      }).then(res => {
        const { access_token } = res || {}
        setStorageSync(userAuthKey, access_token)
        wx.$eventBus.$emit('login_success', access_token)
        wx.navigateBack({
          delta: 1
        })
      }).catch(() => {})
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
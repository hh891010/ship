const { setStorageSync, getStorageSync } = require('../../../commons/utils')
const { apis, userAuthKey, apiHost, openidKey, clientId, clientSecret } = require('../../../commons/config')
const base64 = require('js-base64').Base64
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: 'admin110',
    password: 'surveyship$2020',
    logoUrl: 'https://www.orangesoda.cn/ship-api/images/ba67ad77-18be-4a27-b8e9-7e29a39b8770.jpeg'
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
  async onLogin() {
    const _that = this
    if (_that.userCheck()) {
      const param = {
        clientId: clientId,
        clientSecret: clientSecret,
        grantType: 'password',
        username: _that.data.username,
        password: _that.data.password,
        openid: getStorageSync(openidKey)
      }
      const access_token = await wx.sRequest(`${apiHost}${apis.userLogin}`, param, {
        isLoading: true,
        loadingTitle: '登录中...',
        method: 'POST',
        noAuth: true
      }).catch(() => {})
      setStorageSync(userAuthKey, access_token)
      wx.$eventBus.$emit('login_success', access_token)
      wx.navigateBack({
        delta: 1
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

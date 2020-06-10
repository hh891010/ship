const com = require('../../../commons/constant');
const { apis, apiHost } = require('../../../commons/config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cells: com.userOps,
    sexs: ['男', '女'],
    sexIndex: 0,
    userPkid: 0,
    user: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    const { pkid, isEdit = false } = options || {}
    if (pkid > 0) {
      _that.setData({
        userPkid: pkid
      })
      _that.getUserDetail(isEdit)
    } else {
      const cells = _that.data.cells
      _that.setData({
        cells: cells.map(x => {
          x.value = ''
          x.readonly = false
          x.canShow = x.attrKey !== 'roleCode'
          return x
        })
      })
    }

  },
  async getUserDetail(isEdit) {
    const _that = this
    const _userDetail = await wx.sRequest(`${apiHost}${apis.getUserDetail}`, {
      id: this.data.userPkid
    })
    const cells = _that.data.cells
    _that.setData({
      cells: cells.map(x => {
        x.value = _userDetail[x.attrKey]
        x.readonly = !isEdit
        return x
      })
    })
  },
  addUser() {
    console.log(1111222, this.data.cells)
  },
  onInputChange(e) {
    const _that = this
    const cells = _that.data.cells
    const item = e.detail
    _that.setData({
      cells: cells.map(x => {
        if (x.attrKey === item.attrKey) {
          x.value = item.newValue
        }
        return x
      })
    })
  },
  sexPickerChange(e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1
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
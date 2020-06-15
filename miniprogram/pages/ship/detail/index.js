const { shipOps } = require('../../../commons/constant');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipId: 0,
    cells: shipOps
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { shipId } = options || {}
    this.setData({
      shipId
    })
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
  save() {
    const _that = this
    let _param = {}
    _that.data.cells.map(x => {
      _param[x.attrKey] = x.value
    })
    console.log(_param)
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
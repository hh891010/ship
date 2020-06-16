const { shipOps } = require('../../../commons/constant');
const { userAuthKey, apiHost } = require('../../../commons/config')
const { promisify, getStorageSync } = require('../../../commons/utils')
const { uploadImg } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '添加科考船',
    shipId: 0,
    cells: shipOps,
    shipImages: []
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
  delImg(e) {
    const _that = this
    const { url } = e.target.dataset
    _that.setData({
      shipImages: _that.data.shipImages.filter(x => x !== url)
    })
  },
  async chooseImg() {
    const _that = this
    const { tempFilePaths } = await promisify(wx.chooseImage, {})
    if (tempFilePaths && tempFilePaths.length > 0) {
      const path = tempFilePaths[0]
      uploadImg(path).then(res => {
        const _url = `${apiHost}/ship-api${res}`
        _that.data.shipImages.push(_url)
        _that.setData({
          shipImages: _that.data.shipImages
        })
      })
    }
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
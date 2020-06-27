const { shipOps } = require('../../../commons/constant');
const { userAuthKey, apiHost } = require('../../../commons/config')
const { promisify, verifyPhone } = require('../../../commons/utils')
const { uploadImg, saveShip, selectShipInfo } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '添加科考船',
    shipStatus: ['运行中', '注销'],
    statusIndex: 0,
    shipId: 0,
    isEdit: false,
    cells: shipOps,
    shipImages: [],
    apiHost
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { shipId, isEdit = false } = options || {}
    this.setData({
      shipId,
      isEdit
    })
    if (shipId > 0) {
      this.getShipDetail()
    }
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1
    })
  },
  save() {
    const _that = this
    let _param = {}
    _that.data.cells.map(x => {
      _param[x.attrKey] = x.value
    })
    if (_that.data.shipId > 0) {
      _param.pkid = _that.data.shipId
      delete _param.gpsEnergy
    }
    _param.status = _that.data.statusIndex
    _param.pic = _that.data.shipImages.join(',')
    if (!verifyPhone(_param.gpsMobile) || !verifyPhone(_param.chargePersonMobile)) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      })
      return
    }
    saveShip(_param).then(res => {
      if (res && res > 0) {
        wx.$eventBus.$emit('ship_success', res)
        _that.handlerGobackClick()
      }
    })
  },
  async chooseImg() {
    const _that = this
    if (!_that.data.isEdit) return
    const { tempFilePaths } = (await promisify(wx.chooseImage, {}).catch(err => {})) || {}
    if (tempFilePaths && tempFilePaths.length > 0) {
      const path = tempFilePaths[0]
      uploadImg(path).then(res => {
        const _url = `${res}`
        _that.data.shipImages.push(_url)
        _that.setData({
          shipImages: _that.data.shipImages
        })
      })
    }
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
  delImg(e) {
    const _that = this
    const { url } = e.target.dataset
    _that.setData({
      shipImages: _that.data.shipImages.filter(x => x !== url)
    })
  },
  shipStatusPickerChange(e) {
    this.setData({
      statusIndex: e.detail.value
    })
  },
  getShipDetail() {
    const _that = this
    selectShipInfo(_that.data.shipId).then(ship => {
      const cells = _that.data.cells
      const imgs = (ship.pic || '').split(',').filter(x => x)
      _that.setData({
        statusIndex: ship.status,
        shipImages: imgs,
        cells: cells.map(x => {
          x.value = ship[x.attrKey]
          x.readonly = !_that.data.isEdit
          x.canShow = true
          return x
        })
      })
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
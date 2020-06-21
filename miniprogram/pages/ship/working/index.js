const { selectWorkingShipList, getCurrentUserDetail } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cells: null,
    uPkid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { pkid } = options || {}
    this.setData({
      uPkid: pkid || ''
    })
    this.initFn()
  },
  async initFn() {
    const _that = this
    let userShipIds = ''
    if (_that.uPkid) {
      const _currentUser = await getCurrentUserDetail(_that.uPkid)
      userShipIds = (_currentUser || {}).userShipIds || ''
    }
    const ships = await selectWorkingShipList()
    const _cells = ships.map(x => {
      x.isInput = false
      x.isSlot = true
      x.title = x.shipName
      x.selected = userShipIds.includes(x.pkid)
      return x
    })
    this.setData({
      cells: _cells
    })
  },
  switchChange(e) {
    const _that = this
    const value = e.detail.value
    const { ship } = e.target.dataset || {}
    _that.setData({
      cells: _that.data.cells.map(x => {
        if (x.pkid === ship.pkid) {
          x.selected = value
        }
        return x
      })
    })
  },
  save() {
    const _that = this
    const selectdShips = _that.data.cells.filter(x => x.selected).map(x => x.pkid)
    wx.$eventBus.$emit('working_success', selectdShips)
    _that.handlerGobackClick()
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
const { selectShips, setShipWakeStatus, setFollow, getUserInfo } = require('../../../commons/sApi')
const { userInfoKey } = require('../../../commons/config')
const { getStorageSync, setStorageSync } = require('../../../commons/utils')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    totalPage: 0,
    pageSize: 80,
    keywordName: '',
    shipList: null
  },
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initFn()
  },
  initFn() {
    const _that = this
    const { keywordName, pageIndex, pageSize } = _that.data
    selectShips({
      shipName: keywordName,
      pageNum: pageIndex,
      pageSize
    }).then(res => {
      const totalPage = parseInt(res.total/pageSize) + 1
      const { followShipId } = getStorageSync(userInfoKey) || {}
      const shipList = res.records.map(x => {
        console.log(x)
        let _imgUrl = ''
        const arr = (x.pic || '').split(',')
        if (arr && arr.length > 0) {
          x.shipImage = arr[0]
        }
        x.wake = !!x.wakeStatus
        x.follow = followShipId && followShipId === x.pkid
        return x
      })
      _that.setData({
        totalPage,
        shipList
      })
    })
  },
  onEditShip(e) {
    const ship = e.detail
    this.addShip(ship.pkid, true)
  },
  addShip(pkid, edit) {
    const _that = this
    wx.$eventBus.$on('ship_success', (obj) => {
    _that.setData({
      shipList: [],
      pageIndex: 1,
      totalPage: 0
    })
      _that.initFn()
    })
    wx.navigateTo({
      url: `/pages/ship/detail/index?shipId=${pkid}&isEdit=${edit}`
    });
  },
  toDetail(e) {
    const ship = e.detail
    wx.navigateTo({
      url: `/pages/ship/detail/index?shipId=${ship.pkid}`
    });
  },
  async watchShip(e) {
    const shipId = e.detail.pkid
    const result = await setFollow(shipId)
    if (result) {
      // 重新获取用户跟踪船只
      const user = await getUserInfo()
      setStorageSync(userInfoKey, user)
      this.setData({
        shipList: this.data.shipList.map(x => {
          x.follow = false
          if (x.pkid === shipId) {
            x.follow = !x.follow
          }
          return x
        })
      })
      wx.showToast({
        title: '设置成功',
        icon: 'none'
      })
    }
  },
  switchChange(e) {
    const s = e.detail
    setShipWakeStatus({
      pkid: s.pkid,
      wakeStatus: s.wakeStatus
    }).then(res => {
      if (res) {
        wx.showToast({
          title: `航迹已${s.wakeStatus ? '打开' : '关闭'}`,
          icon: 'none'
        })
      }
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
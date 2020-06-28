const { selectShips, setShipWakeStatus, setFollow, getUserInfo } = require('../../../commons/sApi')
const { userInfoKey, apiHost } = require('../../../commons/config')
const { getStorageSync, setStorageSync, promisify } = require('../../../commons/utils')
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
    wx.$eventBus.$emit('refresh_center')
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '加载中...' })
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
        let _imgUrl = ''
        const arr = (x.pic || '').split(',')
        if (arr && arr.length > 0) {
          let _Img = arr[0]
          if (_Img.indexOf('http') === -1) {
            _Img = `${apiHost}/ship-api${_Img}`
          }
          x.shipImage = _Img
        }
        x.wake = !x.wakeStatus
        x.follow = followShipId && followShipId === x.pkid
        return x
      })
      wx.hideLoading()
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
    const ship = e.detail
    const _that = this
    promisify(wx.showModal, {
      title: '跟踪设置',
      content: `设置${ship.shipName}为当前跟踪船只！`,
      showCancel: false,
      confirmText: '知道了'
    }).then(async res => {
      if (res.confirm) {
        const result = await setFollow(ship.pkid)
        if (result) {
          // 重新获取用户跟踪船只
          const user = await getUserInfo()
          setStorageSync(userInfoKey, user)
          _that.setData({
            shipList: _that.data.shipList.map(x => {
              x.follow = false
              if (x.pkid === ship.pkid) {
                x.follow = !x.follow
              }
              return x
            })
          })
          _that.refreshShip()
          wx.showToast({
            title: `设置${ship.shipName}为当前跟踪船只成功`,
            icon: 'none'
          })
        }
      }
    })
  },
  switchChange(e) {
    const _that = this
    const s = e.detail
    promisify(wx.showModal, {
      title: `${s.wakeStatus ? '开启' : '关闭'}航迹`,
      content: `${s.shipName}${s.wakeStatus ? '开启' : '关闭'}航迹记录！`,
      showCancel: false,
      confirmText: '知道了'
    }).then(async res => {
      if (res.confirm) {
        setShipWakeStatus({
          pkid: s.pkid,
          wakeStatus: s.wakeStatus ? 0 : 1
        }).then(res => {
          if (res) {
            _that.refreshShip()
            wx.showToast({
              title: `${s.shipName}航迹记录已${s.wakeStatus ? '开启' : '关闭'}`,
              icon: 'none'
            })
          }
        })
      }
    })
  },
  refreshShip() {
    wx.$eventBus.$emit('refresh_ship')
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

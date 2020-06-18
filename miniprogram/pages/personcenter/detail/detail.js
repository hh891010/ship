const { userOps } = require('../../../commons/constant');
const { apis, apiHost, userInfoKey } = require('../../../commons/config')
const { selectRoleList, getCurrentUserDetail } = require('../../../commons/sApi')
const { getStorageSync } = require('../../../commons/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cells: userOps,
    isHead: false,
    sexs: ['男', '女'],
    sexIndex: 0,
    userPkid: 0,
    user: null,
    roleNames: [],
    roles: [],
    roleIndex: 0,
    workingShips: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    _that.initFn(options)
  },
  async initFn(ops) {
    const _that = this
    const _roles = await selectRoleList()
    _that.setData({
      roles: _roles || [],
      roleNames: (_roles || []).map(x => x.roleName)
    })
    const { pkid, isEdit = false } = ops || {}
    if (pkid > 0) {
      const _user = getStorageSync(userInfoKey)
      _that.setData({
        userPkid: pkid,
        isHead: pkid === _user.pkid
      })
      _that.getUserDetail(isEdit)
    } else {
      const cells = _that.data.cells
      _that.setData({
        cells: cells.map(x => {
          x.value = ''
          x.readonly = false
          return x
        })
      })
    }
  },
  async getUserDetail(isEdit) {
    const _that = this
    const _userDetail = await getCurrentUserDetail(_that.data.userPkid)
    const cells = _that.data.cells
    _that.setData({
      cells: cells.map(x => {
        x.value = _userDetail[x.attrKey]
        x.readonly = !isEdit
        return x
      })
    })
  },
  onCellClick(e) {
    const _that = this
    const { id } = e.detail || {}
    if (id === 9) {
      wx.$eventBus.$on('working_success', (res) => {
        _that.setData({
          workingShips: res
        })
      })
      wx.navigateTo({
        url: '/pages/ship/working/index'
      });
    }
  },
  addUser() {
    const _that = this
    const { sexs, sexIndex, roleIndex, roles } = _that.data
    let _param = {}
    _that.data.cells.map(x => {
      _param[x.attrKey] = x.value
    })
    _param.userShipIds = _that.data.workingShips
    _param.sex = sexs[sexIndex]
    _param.roleId = roles[roleIndex].pkid
    console.log('user', _param)
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
  rolePickerChange(e) {
    this.setData({
      roleIndex: e.detail.value
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
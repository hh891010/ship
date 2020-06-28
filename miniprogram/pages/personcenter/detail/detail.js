const { userOps } = require('../../../commons/constant');
const { userInfoKey, openidKey, userAuthKey } = require('../../../commons/config')
const { 
  selectRoleList,
  getCurrentUserDetail,
  saveUserInfo,
  userLogout,
  resetPassword
} = require('../../../commons/sApi')
const { getStorageSync, promisify, removeStorageSync } = require('../../../commons/utils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cells: userOps,
    isHead: false,
    isEdit: false,
    isloading: true,
    sexs: ['男士', '女士'],
    sexIndex: 0,
    userPkid: 0,
    user: null,
    roleNames: [],
    roles: [],
    roleIndex: 0,
    workingShips: [],
    newPassword: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _that = this
    const { pkid, isEdit = false } = options || {}
    _that.setData({
      userPkid: pkid,
      isEdit: isEdit
    })
    _that.initFn()
  },
  async initFn() {
    const _that = this
    const { userPkid, isEdit } = _that.data
    wx.showLoading({
      title: '加载中...',
    })
    const _roles = await selectRoleList()
    _that.setData({
      roles: _roles || [],
      roleNames: (_roles || []).map(x => x.roleName)
    })
    if (userPkid > 0) {
      const _user = getStorageSync(userInfoKey)
      _that.setData({
        isHead: userPkid === _user.pkid && !isEdit
      })
      _that.getUserDetail(isEdit)
    } else {
      const cells = _that.data.cells
      _that.setData({
        isloading: false,
        cells: cells.map(x => {
          x.value = ''
          x.readonly = false
          return x
        })
      })
      wx.hideLoading()
    }
  },
  async getUserDetail(isEdit) {
    const _that = this
    const _userDetail = await getCurrentUserDetail(_that.data.userPkid)
    const cells = _that.data.cells
    const _index = this.data.sexs.indexOf(_userDetail.sex)
    _that.setData({
      isloading: false,
      sexIndex: _index,
      cells: cells.map(x => {
        x.value = _userDetail[x.attrKey]
        x.readonly = !isEdit
        x.canShow = x.attrKey !== 'password'
        return x
      })
    })
    wx.hideLoading()
  },
  onCellContentClick(e) {
    const _that = this
    const { id } = e.detail || {}
    if (id === 9 && this.data.isEdit) {
      wx.$eventBus.$on('working_success', (res) => {
        _that.setData({
          workingShips: res
        })
      })
      wx.navigateTo({
        url: `/pages/ship/working/index?pkid=${_that.data.userPkid}`
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
    _param.pkid = _that.data.userPkid
    saveUserInfo(_param).then(res => {
      if (res) {
        wx.$eventBus.$emit('add_user_success', res)
        _that.handlerGobackClick()
      }
    })
  },
  async loginOut() {
    const res =  await promisify(wx.showModal, {
      title: '退出登录',
      content: `是否确定退出登录？`,
      showCancel: true,
      confirmText: '确定'
    })
    if (res.confirm) {
      const userToken = getStorageSync(userAuthKey)
      const openid = getStorageSync(openidKey)
      const result = await userLogout(userToken,openid)
      if (result || 1 === 1) {
        this.cleanUpUserCache()
      }
    }
  },
  cleanUpUserCache() {
    removeStorageSync(userInfoKey)
    removeStorageSync(userAuthKey)
    wx.switchTab({
      url: '/pages/realtime/index'
    })
    wx.$eventBus.$emit('refresh_ship')
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
  onNewPasswordChange(e) {
    const _that = this
    const _password = e.detail.value
    _that.setData({
      newPassword: _password
    })
  },
  async resetPassword() {
    if (!this.data.newPassword) {
      wx.showToast({ title: '新密码不能为空', icon: 'none'})
      return
    }
    const res =  await promisify(wx.showModal, {
      title: '重置密码',
      content: `是否确定重置密码？`,
      showCancel: true,
      confirmText: '确定'
    })
    if (res.confirm) {
      const result = await resetPassword({
        password: this.data.newPassword
      })
      if (result) {
        wx.showToast({ title: '密码已重置', icon: 'success'})
        this.setData({
          newPassword: ''
        })
      }
    }
  }
})
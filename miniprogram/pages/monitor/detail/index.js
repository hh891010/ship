const {
  monitorKeys,
  fishType,
  initType,
  environmentType
} = require('../../../commons/constant');
const { userInfoKey } = require('../../../commons/config')
const { formatTime, getStorageSync } = require('../../../commons/utils');
const { findTypeOfInquiry, findMonitoringById, saveMonitoring, getCurrentShip } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: formatTime(new Date()),
    surveyTime: formatTime(new Date(), '', false),
    id: 0,
    typeIndex: 0,
    trackIndex: 0,
    fishType,
    initType,
    environmentType,
    trackShip: {
      id: 1,
      title: '选择船只：',
      isInput: false,
      canShow: true,
      iconmore: false,
      readonly: false,
      value: '',
      isSlot: true
    },
    trackShips: [],
    monitorType: {
      id: 1,
      title: '调查种类：',
      isInput: false,
      canShow: true,
      iconmore: false,
      readonly: false,
      value: '',
      isSlot: true
    },
    monitorTypes: [],
    isloading: true
  },
  trackPickerChange(e) {
    this.setData({
      trackIndex: e.detail.value
    })
  },
  monitorTypePickerChange(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  surveyTimeChange(e) {
    const value = e.detail.value
    this.setData({
      surveyTime: value
    })
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
    const pkid = options.id || 0
    this.setData({
      id: pkid
    })
    this.initFn()
    console.log(pkid)
  },
  onInputChange(e) {
    const { type } = e.target.dataset
    let cells = []
    const _that = this
    const item = e.detail
    let key = ''
    switch (type) {
      case 1:
        key = 'fishType'
        cells = _that.data.fishType
        break;
      case 2:
        key = 'initType'
        cells = _that.data.initType
        break;
      case 3:
        key = 'environmentType'
        cells = _that.data.environmentType
        break;
    }
    _that.setData({
      [key]: cells.map(x => {
        if (x.attrKey === item.attrKey) {
          x.value = item.newValue
        }
        return x
      })
    })
  },
  async initFn() {
    wx.showLoading({ title: '加载中...' });
    await this.getMonitorType()
    await this.getCurrentUserShip()
    if (this.data.id > 0) {
      await this.getMonitorInfo()
    }
    wx.hideLoading();
    this.setData({
      isloading: false
    })
  },
  getCurrentUserShip() {
    const _that = this
    getCurrentShip().then(res => {
      const _user = getStorageSync(userInfoKey)
      const _ships = res.map(x => x.shipId)
      _that.setData({
        trackIndex: _ships.indexOf(_user.followShipId) === -1 ? 0 : _ships.indexOf(_user.followShipId),
        trackShips: (res || []).map(x => {
          x.value = x.shipName
          return x
        })
      }) 
    })
  },
  async getMonitorType() {
    const result = await findTypeOfInquiry()
    this.setData({
      monitorTypes: (result || []).map(x => {
        x.id = x.key
        x.info = JSON.parse(x.content || {})
        return x
      })
    })
    return result
  },
  saveShipMonitorInfo(e) {
    const _that = this
    const _type = parseInt(_that.data.typeIndex)
    let _key = ''
    let _param = {}
    const _ship = _that.data.trackShips[_that.data.trackIndex]
    const _monitor = _that.data.monitorTypes[_that.data.typeIndex]
    _param.shipId = _ship.shipId
    _param.resourceType = _monitor.key
    _param.surveyTime = _that.data.surveyTime
    switch (_type) {
      case 0:
          _key = 'fishType'
        break;
      case 1:
          _key = 'initType'
        break;
      case 2:
          _key = 'environmentType'
        break;
    }
    const _ = {}
    _that.data[_key].map(x => {
      if (x.canShow && x.attrKey !== 'surveyTime') {
        _[x.attrKey] = x.value
      }
    })
    _param.content = JSON.stringify(_)
    const attr = _that.checkMonitorData(_key, _)
    if (attr > 0) {
      wx.showToast({
        title: '监测数据填写不完整',
        icon: 'none'
      })
      return
    }
    saveMonitoring(_param).then(res => {
      if (res > 0) {
        _that.handlerGobackClick()
      }
    })
  },
  checkMonitorData(key, item) {
    let num = 0
    const attrs = monitorKeys[key]
    attrs.map(x => {
      if (!item[x]) {
        num++
      }
    })
    return num
  },
  async getMonitorInfo() {
    const _that = this
    const result = await findMonitoringById(this.data.id)
    const { shipId, resourceType, content, surveyTime, createByName, createdTime } = result || {}
    // 调查种类
    const typeIndex = _that.data.monitorTypes.map(x => x.key).indexOf(resourceType)
    // 选择船只
    const trackIndex = _that.data.trackShips.map(x => x.shipId).indexOf(shipId)
    // 监测时间
    const _surveyTime = formatTime(new Date(surveyTime), '', false)
    let item = JSON.parse(content || {})
    let _key = ''
    _that.setData({
      typeIndex,
      trackIndex,
      ['trackShip.readonly']: true,
      ['monitorType.readonly']: true
    })
    switch (resourceType) {
      case 1:
          _key = 'fishType'
        break;
      case 2:
          _key = 'initType'
        break;
      case 3:
          _key = 'environmentType'
        break;
    }
    const cells = monitorKeys[_key]
    const cellItems = _that.data[_key]
    _that.setData({
      [_key]: cellItems.map(x => {
        x.readonly = true
        x.canShow = true
        if (x.attrKey === 'surveyTime') {
          x.value = _surveyTime
        }
        if (x.attrKey === 'createByName') {
          x.value = createByName
        }
        if (x.attrKey === 'createdTime') {
          x.value = formatTime(new Date(createdTime), '', false)
        }
        if (cells.indexOf(x.attrKey) > -1) {
          x.value = item[x.attrKey]
        }
        return x
      })
    })
  }
})
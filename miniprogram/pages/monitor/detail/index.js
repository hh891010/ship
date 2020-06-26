const com = require('../../../commons/constant');
const { formatTime } = require('../../../commons/utils');
const { findTypeOfInquiry, findMonitoringById, saveMonitoring, getCurrentShip } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: formatTime(new Date()),
    surveyTime: formatTime(new Date(), '', false),
    typeIndex: 0,
    trackIndex: 0,
    fishType: com.fishType,
    initType: com.initType,
    environmentType: com.environmentType,
    trackShip: {
      id: 1,
      title: '跟踪船只：',
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
    monitorTypes: []
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
    if (pkid > 0) {

    }
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
    // this.getMonitorInfo()
    this.getMonitorType()
    this.getCurrentUserShip()
  },
  getCurrentUserShip() {
    const _that = this
    getCurrentShip().then(res => {
      _that.setData({
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
    const _data = {
      fishType: ['fish_kind', 'fish_count', 'fish_weight'],
      initType: ['spawn_count', 'fries_count', 'net_count', 'net_period'],
      environmentType: ['water_quality_factors', 'neuston', 'zooplankton', 'zoobenthos', 'periphyton', 'hytoplankton', 'hydrophyte']
    }
    const attrs = _data[key]
    attrs.map(x => {
      if (!item[x]) {
        num++
      }
    })
    return num
  },
  async getMonitorInfo() {
    const result = await findMonitoringById()
    console.log(result)
  }
})
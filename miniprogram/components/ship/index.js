// components/ship/index.js
Component({
  externalClasses: ['sitem'],
  /**
   * 组件的属性列表
   */
  properties: {
    ship: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    edit() {
      this.triggerEvent('onEditShip', this.properties.ship)
    },
    switchChange(e) {
      const wake = e.detail.value
      const wakeStatus = e.detail.value ? 1 : 0
      this.triggerEvent('onSwitchChange', Object.assign(this.properties.ship, {
        wake,
        wakeStatus
      }))
    },
    toDetail() {
      this.triggerEvent('onToDetail', this.properties.ship)
    },
    watchShip() {
      this.triggerEvent('onWatchShip', this.properties.ship)
    },
    catchtapFn() {}
  }
})

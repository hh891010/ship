// components/voyage/voyage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    voyages: {
      type: Array
    },
    isSwitch: {
      type: Boolean,
      value: true
    },
    isOpen: {
      type: Boolean,
      value: false
    },
    voyagesDate: {
      type: String
    },
    pkid: {
      type: Number
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
    switchClick() {
      this.triggerEvent('onSwitchClick', {
        pkid: this.properties.pkid,
        isOpen:  !this.properties.isOpen
      })
    }
  }
})

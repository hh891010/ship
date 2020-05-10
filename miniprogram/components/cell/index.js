// components/cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inputInfo: {
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
    onChange() {
      this.triggerEvent('onChange', {
        a: 1
      })
    },
    cellClick() {
      const _that = this
      _that.triggerEvent('onCellClick', _that.properties.inputInfo)
    }
  }
})

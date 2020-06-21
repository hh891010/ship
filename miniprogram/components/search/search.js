// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    searchValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const _that = this
      const item = e.detail
      _that.setData({
        searchValue: item.value
      })
    },
    onInputConfirm(e) {
      this.triggerEvent('onInputConfirm', this.data.searchValue)
    },
    clearSearch() {
      this.setData({
        searchValue: ''
      })
      this.triggerEvent('onClearSearch')
    }
  }
})

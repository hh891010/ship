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
    onInputConfirm(e) {
      const _searchText = e.detail.value
      wx.showToast({
        title: _searchText
      })
    },
    clearSearch() {
      this.setData({
        searchValue: ''
      })
    }
  }
})

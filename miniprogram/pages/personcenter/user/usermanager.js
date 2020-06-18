const { getUsers } = require('../../../commons/sApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 100,
    userName: '',
    userList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList()
  },
  async getUserList() {
    const _that = this
    const { pageNum, pageSize, userName } = this.data
    const result = await getUsers({
      pageNum,
      pageSize,
      userName
    })
    const { records } = result || {} 
    _that.setData({
      userList: (records || []).map(x => {
        const arr = (x.userName || '').split('');
        x.surname = arr.length > 0 ? arr[0] : ''
        return x
      })
    })
  },
  handlerGobackClick() {
    wx.$eventBus.$emit('aaaaa', {
      aaa: 'aaa12'
    })
    wx.navigateBack({
      delta: 1
    })
  },
  addUser() {
    wx.$eventBus.$on('add_success', (obj) => {
      console.log('添加成功', obj)
    })
    wx.navigateTo({
      url: `/pages/personcenter/detail/detail`
    });
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
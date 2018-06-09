// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lostSum:0,
    losts: [{ icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }],
    foundSum: 0,
    founds: [{ icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }, { icon: '/images/markers.png', label: "不知道啥", value: 'buzhidao1' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let size = this.data.founds.length;
    let sizeLost = this.data.losts.length;
    this.setData({
      foundSum: size,
      lostSum:sizeLost
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
  ,
  OnSelected(e) {

  }
})
// pages/postlost.js
const Http = require('../../utils/http.js');
const util = require('../../utils/util.js')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '/images/addImg.png',
    currTime: null,
    location: '',
    TYPE: [],
    foundtype: '',
    longitude: 0,
    latitude: 0,
    index: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime();
    this.initMap();
    this.getLocation();
    this.setData({
      TYPE: util.TYPE,
      foundtype: util.TYPE[0]
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

  },

  onTap(e) {
    console.log(e.currentTarget.dataset.type)
    switch (e.currentTarget.dataset.type) {
      case 'pickPic':
        var that = this
        wx.chooseImage({
          count: 1, // 默认9  
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
            var tempFilePaths = res.tempFilePaths
            that.setData({
              imgUrl: tempFilePaths
            })
          }
        })
        break;
      case 'select':
        break;
      case 'post':

        break;
    }
  },
  getTime() {
    let time = util.formatTime(new Date());
    console.log(time);
    this.setData({
      currTime: time
    })
  },
  async addLost(res2) {
    // console.log(Http)

    let res = await Http.getLost();
    console.log(res2)
    console.log(res)
    let that = this;
    let lost = {
      User_id: 'lalala',
      Longitude: res2.longitude,
      Altitude: res2.latitude,
      Lost_date: util.formatTime(new Date()) + '',
      Tel: '88888',
      Type_num: 1,
      Image: 'hhhhhh',
      note: 'jjj',
      Location: 'hhhh'
    }
    res = await Http.addLost(lost);
    console.log(res);
  },
  onGetLocation(res) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: res.latitude,
        longitude: res.longitude
      },
      success: function (addressRes) {
        var address = addressRes.result.formatted_addresses.recommend;
        console.log(address);
        that.setData({
          location: address
        })
      }
    })
  },
  getLocation() {

    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: async (res) => {
        this.onGetLocation(res);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        await this.addLost(res);
      }
    });
  },
  initMap() {
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'RSFBZ-HSYKG-XFYQD-ITFOO-ZJ2B6-QZB7O' // 必填
    });
  },
  bindPickerChange(e) {
    let t = this.data.TYPE[e.detail.value];
    this.setData({
      foundtype: t,
      index: e.detail.value
    })
  },
  formSubmit(e) {
    let lostTime = e.detail.value.lostTime;
    let contact = e.detail.value.contact;
    let pickLocation = e.detail.value.pickLocation;

    // @RequestParam(value = "User_id") String User_id,
    //         @RequestParam(value = "Location") String Location,
    //         @RequestParam(value = "Longitude") double Longitude,
    //         @RequestParam(value = "Altitude") double Altitude,
    //         @RequestParam(value = "Found_date") String Found_date,
    //         @RequestParam(value = "Pick_location") String Pick_location,
    //         @RequestParam(value = "Tel") String Tel,
    //         @RequestParam(value = "Type_num") int Type_num,
    //         @RequestParam(value = "Image") String Image,
    //         @RequestParam(value = "note") String note,
    //         @RequestParam(value = "state") int state


    const found = {
      Location: this.data.location,
      Longitude: this.data.longitude,
      Altitude: this.data.latitude,
      Found_date: this.data.currTime,
      Pick_location: pickLocation,
      Tel: contact,
      Type_num: this.data.index+1
      // Image:
    }
  }
})
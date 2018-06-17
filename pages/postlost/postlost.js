// pages/postlost.js
const Http = require('../../utils/http.js');
const util = require('../../utils/util.js')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var app = getApp()
var qqmapsdk;
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const multiArray = []

years.push((date.getFullYear() - 1) + '年')
years.push(date.getFullYear() + '年')

var month = date.getMonth()
var day = date.getDate() - 1

var hour = date.getHours()
var minute = date.getMinutes()
var second = date.getSeconds()

for (let i = 1; i <= 12; i++) {
  months.push(i + '月')
}

for (let i = 1; i <= 31; i++) {
  days.push(i + '日')
}

for (let i = 0; i < 24; i++) {
  hours.push(i + '时')
}
for (let i = 0; i <= 59; i++) {
  minutes.push(i + '分')
}

multiArray.push(years)
multiArray.push(months)
multiArray.push(days)
multiArray.push(hours)
multiArray.push(minutes)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    currTime: null,
    location: '',
    TYPE: [],
    foundtype: '',
    longitude: 0,
    latitude: 0,
    index: 0,
    multiArray: multiArray,
    multiIndex: [1, month, day, hour, minute],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onTap(e) {
    console.log(e.currentTarget.dataset.type)
    switch (e.currentTarget.dataset.type) {
      case 'pickPic':
        this.choiseImage();
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

    let res = await Http.getLosts();
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
      success: function(addressRes) {
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
      success: async(res) => {
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
  selectLocation(e) {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        console.log(e.currentTarget.id);
        that.setData({
          location: res.address
        })
      },
    })
  },
  choiseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])

        that.setData({
          imgUrl: tempFilePaths
        })

      }
    })
  },
  upLoadImage(lost) {
    let that = this;
    wx.uploadFile({
      url: Http.uploadImage(),
      filePath: this.data.imgUrl[0], //图片路径，如tempFilePaths[0]
      name: 'image',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        userId: 12345678 //附加信息为用户ID
      },
      success: async function(res) {
        console.log(res)
        console.log(JSON.parse(res.data)['filename']);
        lost['Image'] = JSON.parse(res.data)['filename'];
        wx.showLoading({
          title: '发布中...',
        })
        lost = encodeURI(JSON.stringify(lost), "utf-8");
        lost = decodeURI(lost, "utf-8");
        lost = JSON.parse(lost);
        await Http.addLost(lost);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发布成功',
          success: function(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: function(res) {
        console.log(JSON.parse(res.data)['filename']);
      },
      complete: function(res) {}
    })
  },
  formSubmit(e) {
    let lostTime = e.detail.value.lostTime;
    let contact = e.detail.value.contact;
    // let location = e.detail.value.location;
    const note = e.detail.value.note
    //   private String User_id;
    // private double longitude;
    // private double altitude;
    // private String Lost_date;
    // private String Tel;
    // private int Type_num;
    // private String Image;
    // private String note;
    // private String Location;
    const lost = {
      Location: this.data.location,
      Longitude: this.data.longitude,
      Altitude: this.data.latitude,
      Lost_date: this.data.currTime,
      Tel: contact,
      Type_num: this.data.index + 1,
      User_id: app.globalData.openid,
      // Image:
      note: note,
      state: 0,
    }
    this.upLoadImage(lost)
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // this.setData({
    //   multiIndex: e.detail.value
    // })
  },
})
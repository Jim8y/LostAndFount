//index.js
//获取应用实例
var app = getApp()

const Http = require('../../utils/http.js');
const util = require('../../utils/util.js')
Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    markers: [],
    userInfo: null,
    map: false
  },
  // 页面加载
  async onLoad(options) {
    this.getLocation();
    this.setMapController();
  },
  // 页面显示
  onShow() {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("lafMap");
    this.movetoPosition()
  },
  // 地图控件点击事件
  controltap(e) {
    console.log(e.controlId)

    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1:
        this.movetoPosition();
        break;
      case 2:
        wx.navigateTo({
          url: '../postlost/postlost',
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../postfound/postfound',
        })
      case 4:
        //list
        break;
      case 5:
        break;
      case 6:
        wx.navigateTo({
          url: '../mine/mine',
        })
        break;
      default:
        break;
    }
  },
  // 地图视野改变事件
  bindregionchange(e) {
    // 拖动地图，获取附件单车位置
    if (e.type == "begin") {
    } else if (e.type == "end") {
    }
  },
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap(e) {
    console.log('..')
    console.log(e);
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];
    this.setData({
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        }, {
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },
  setMapController() {
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: 20,
              top: res.windowHeight - 120,
              width: 30,
              height: 30
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/forlost.png',
            position: {
              left: res.windowWidth / 2 - 90 - 35,
              top: res.windowHeight - 80,
              width: 90,
              height: 35
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/forfound.png',
            position: {
              left: res.windowWidth / 2 + 35,
              top: res.windowHeight - 80,
              width: 90,
              height: 35
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/list.png',
            position: {
              left: res.windowWidth - 40,
              top: 10,
              width: 30,
              height: 30
            },
            clickable: true
          },
          {
            id: 5,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 20,
              height: 30
            },
            clickable: true
          },
          {
            id: 6,
            iconPath: '/images/Mine.png',
            position: {
              left: 10,
              top: 10,
              width: 30,
              height: 30
            },
            clickable: true
          }
          ]
        })
      }
    });
  },
  async setMarkers(res, markers) {

    for (let i = 0; i < res.length; i++) {
      res[i]['id'] = markers.length+i;
      let latitude = parseFloat(res[i]['altitude'] + '');
      let longitude = parseFloat(res[i]['longitude'] + '');
      let icon = '../' + res[i]['iconPath'];
      if (latitude > 90 || latitude < -90) {
        continue;
      }
      let marker = {
        iconPath: icon,
        id: i,
        latitude: latitude,
        longitude: longitude,
        width: 30,
        height: 30,
        callout: {
          content: "    语言：微信是不是傻    \n    预计到达时间：10分钟    \n    车牌号：\"12345\"",
          color: "#000000",
          fontSize: 10,
          borderRadius: 2,
          bgColor: '#efefef',
          padding: 3,
          textAlign: 'left',
          display: 'BYCLICK'
        }
      }
      markers.push(marker)
    }
    return markers;
  },
  getLocation() {
    let that = this;
    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: async (res) => {
        console.log(res)
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        that.getMarkers(res.latitude, res.longitude);
      }
    });
  },
  async getMarkers(latitude, longitude) {
    let markers = new Array()
    let res = await Http.getFounds(null, latitude, longitude);
    console.log('11111')
    console.log(res)
    console.log('222222')
    this.setMarkers(res, markers);
    let res2 = await Http.getLosts(null, latitude, longitude);
    console.log('333333')
    console.log(res2)
    console.log('444444')
    this.setMarkers(res2, markers, -1);
    console.log(markers)
    this.setData({
      markers: markers,
      map: true
    })
  }
})
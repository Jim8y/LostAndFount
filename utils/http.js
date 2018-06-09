let hotapp = require('./hotapp.js');
const HOST = "http://39.105.118.89:7777/";

async function getLosts(userId = null) {
  let url = HOST + 'lost/get';

  let res = await httpRequest({}, url)
  return res;
}

async function addLost(lost) {
  // @RequestParam(value = "User_id") String User_id,
  // @RequestParam(value = "Longitude") double Longitude,
  // @RequestParam(value = "Altitude") double Altitude,
  // @RequestParam(value = "Lost_date") String Lost_date,
  // @RequestParam(value = "Tel") String Tel,
  // @RequestParam(value = "Type_num") int Type_num,
  // @RequestParam(value = "Image") String Image,
  // @RequestParam(value = "note") String note,
  // @RequestParam(value = "Location") String Location

  let url = HOST + 'lost/insert';
  return await httpRequest(lost, url, 'POST');
}

async function addUser(name, openId) {
  // @RequestParam(value = "User_id") String User_id,
  // @RequestParam(value = "name") String name
  let url = HOST + 'user/add'
  return await httpRequest({ User_id: openId, name: name }, url, 'POST');
}

function httpRequest(params = {}, url, method = 'GET') {
  return new Promise((resolve, reject) => {
    let type = ''
    if (method === 'GET')
      type = 'application/json';
    else
      type = 'application/x-www-form-urlencoded';
    hotapp.request({
      useProxy: true,
      url: url, // 需要代理请求的网址
      method: method,
      data: params,
      header: {
        'content-type': type
      },
      success: function (res) {
        wx.hideLoading();
        // Loading = false;
        if (res.data) {
          resolve(res.data)
        } else {
          // console.log('网络异常' + res.errMsg)
        }
      },
      fail: function (res) {
      }
    })
  }
  )
}

module.exports = {
  getLost: getLosts,
  addLost: addLost
}
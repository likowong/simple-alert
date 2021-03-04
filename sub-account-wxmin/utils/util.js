// var RSA = require('wx_rsa.js'); //RSA公钥
// var publicKey_pkcs1 = '';  
// //RSA加密方法
// const RSAEncrypt = (word) => { 
//   console.log("123334") ;
//   var encrypt_rsa = new RSA.RSAKey(); 
//   encrypt_rsa = RSA.KEYUTIL.getKey(publicKey_pkcs1);  
//   console.log(encrypt_rsa); 
//   var encStr = encrypt_rsa.encrypt(word)  
//   encStr = RSA.hex2b64(encStr);  
//   return encStr;
// }
var wxRequest = require('./request.js');
const formatTime = date => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime2 = date => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return " " + year + "-" + (month < 10?"0"+month: month) + "-" + (day < 10?"0"+day: day);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const downTime = date => {
  var nowDate = new Date().getTime();
  var endDate = new Date(date).getTime();
  var midDate = endDate - nowDate;
  if(midDate > 0){
    // 计算出相差天数
    var days = Math.floor(midDate/(24*3600*1000));

    // 计算出小时数
    var leave = midDate%(24*3600*1000);   //计算天数后剩余的毫秒数

    var hours = Math.floor(leave/(3600*1000)) + 1;

    if(days >= 0 && hours == 24){
      return days+1 + '天';
    }else if(days > 0 && hours < 24){
      return days + '天' + hours + '小时'
    }else if(days == 0 && hours < 24){
      return hours + '小时';
    }
  }else{
    return false;
  }
}


const buttonClicked = self => {
  self.setData({
    buttonClicked: true
  })

  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}


const showLoading = message => {
  if (wx.showLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message,
      mask: true
    });
  } else {
    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message,
      icon: 'loading',
      mask: true,
      duration: 30000
    });
  }
}

const hideLoading = () => {
  if (wx.hideLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}

// const upLoadImg = (count) => {
//   wx.chooseImage({
//     count: count,
//     sizeType: ['original', 'compressed'],
//     sourceType: ['album', 'camera'],
//     success(res) {
//       showLoading('');

//     }
//   })
// }

//多张图片上传
// data = ['a.jpg','b.jpg','c.jpg'];

const uploadImgs = (data) =>{
  var that = this,
  i = data.i ? data.i : 0,//当前上传的哪张图片
  success = data.success ? data.success : 0,//上传成功的个数
  fail = data.fail ? data.fail : 0;//上传失败的个数

  let baseUrl = wxRequest._baseUrl;
  let token = wx.getStorageSync("token");

  wx.uploadFile({
    url: baseUrl + '/app/oss/upload',
    filePath: data[i],
    name: 'file',//这里根据自己的实际情况改
    header: {  
      "Content-Type": "multipart/form-data",
      "token": token,
    },
    success: (res) => {
      success++;//图片上传成功，图片上传成功的变量+1
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
    },
    complete: () => {
      i++;//这个图片执行完上传后，开始上传下一张
      if(i==data.length){   //当图片传完时，停止调用          
      }else{//若图片还没有传完，则继续调用函数
        data.i=i;
        data.success=success;
        data.fail=fail;
        that.uploadimg(data);
      } 
    }
  });
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  downTime: downTime,
  buttonClicked: buttonClicked,
  showLoading: showLoading,
  hideLoading: hideLoading
}

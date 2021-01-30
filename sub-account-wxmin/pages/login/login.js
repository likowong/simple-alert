// pages/login/login.js
import wxRequest from '../../utils/request'
import wxVaildate from '../../utils/wx_validate'
import util from '../../utils/util'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    accountCode: '',   //手机号
    code:'',    //验证码
    sendCode: false,   //发送验证码按钮是否可点击
    alreadySend: false,   //是否已经发送了验证码
    buttonStatus: false,   //登录按钮的显示状态
    second: 60,          //倒计时时间
    errorMsg: '',          //显示错误信息
    buttonClicked: false    // 防止提交按钮重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let winMsg = wx.getSystemInfoSync();
    this.setData({
      winHeight: winMsg.windowHeight
    });
  },

  // 控制登录按钮的显示状态
  activeButton: function() {
    let {accountCode, code} = this.data;
    if (accountCode && code) {
      this.setData({
        buttonStatus: true
      })
    } else {
      this.setData({
        buttonStatus: false
      })
    }
  },

  // 显示倒计时
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              sendCode: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  // 输入手机号
  inputPhoneNum: function(e) {
    let accountCode = e.detail.value
    if (accountCode.length === 11) {
      let checkedNum = wxVaildate.checkPhoneNum(accountCode)
      if (checkedNum) {
        this.setData({
          accountCode: accountCode,
          sendCode: true
        })
        this.activeButton();
      }
    }else{
      this.setData({
        accountCode: '',
        sendCode: false
      })
    }
  },

  // 获取验证码
  getCode: function(){
    if(this.data.sendCode){
      util.showLoading('获取验证码...');
      let requestData  ={"phone":this.data.accountCode}
      wxRequest.post('/app/api/sendSmsCode',requestData)
        .then(res=>{  //请求成功
          util.hideLoading();
          this.setData({
            alreadySend: true
          })
          this.timer();
        })
    }else{
      return false;
    }
  },

  // 输入验证码
  addCode: function(e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton();
  },

  // 登录
  submitForm: function(e) {
   if(this.data.buttonStatus){
      util.buttonClicked(this);
      let LoginReq = {
        phone: this.data.accountCode,
        smsCode: this.data.code
      };

      wxRequest.post('/app/api/login',LoginReq)
        .then(res=>{  //请求成功
          let token = res.data.msg;
          wx.setStorageSync('token', token);
          wx.setStorageSync('phone', this.data.accountCode);
          wx.reLaunch({
            url: '../order/order'
          })
        })
   }else{
     return false;
   }
  }
})

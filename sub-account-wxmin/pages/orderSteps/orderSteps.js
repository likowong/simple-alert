// pages/orderSteps/orderSteps.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'
const qiniuUploader = require("../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '车贷资料'
      },
      {
        text: '上传资料'
      }
    ],
    form: {
      orderprice: '',      //订单金额
      productid: '',       // 险种Id
      productname: '',     // 险种名
      isincludeprice:'', //代步险价格
      isinclude: '',       // 是否包含代步险
      isfree: '',        // 是否店内赠送
      carage: '',        // 车龄
      insuranceperiod: '',     // 投保期限
      name: '',           // 车主姓名
      idcard: '',         // 车主身份证号
      phone: '',//车主手机号
      carbrand: '',//车辆品牌
      operationmode: '',//营运性质1:非运营车,2:营运车
      carnumber: '',//车架号
      carenginenumber: '',//发动机号
      carbuytime: '',//车辆购置日期
      carbuyprice: '',//购车价
      extmsg: '',//扩展信息
      imagemsg: '',//图片信息
      isincludedata:''//代步险资料
    },
    carTypeName: '',
    active: 0,
    firstStepBtn: false,   //第一步按钮的状态
    lastStepBtn: false,   //最后一步按钮的状态
    carPeriodArr: [12,18,24,36,48,60],     // 车贷可选择的期数
    contractIndex: 0,      // 订车合同的下标
    replyIndex: 0,          // 批复函图片下标
    phone: '',              // 客户手机号
    carAge: [
      {value: '1', text: '新车（0-12个月车龄）'},
      {value: '2', text: '次新车（13-24个月车龄）'},
      {value: '3', text: '二手车（25-36个月车龄）'}
    ],
    insurePeriod: [
      {value: '12', text: '12个月'},
      {value: '24', text: '24个月'},
      {value: '36', text: '36个月'},
      {value: '48', text: '48个月'},
      {value: '60', text: '60个月'}
    ],
    operationNature: [
      {value: '1', text: '非运营车'},
      {value: '2', text: '运营车'}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = wx.getStorageSync("phone");
    this.setData({
      phone: phone
    })
  },

  onShow: function () {
    // 设置车型
    let carType = wx.getStorageSync('carType');
    if(carType){
      this.setData({
        ['form.carTypeId']: carType.id,
        ['form.carTypeName']: carType.name
      })
      wx.removeStorageSync('carType');
    }
    this.activeFirstBtn();
  },

  // 监控第一步按钮的状态 
  activeFirstBtn: function(){
    let {applyOrganization, carSuccessMoney, carType, carPrice } = this.data.form;
    if (applyOrganization && carSuccessMoney && carType && carPrice) {
      this.setData({
        firstStepBtn: true
      })
    } else {
      this.setData({
        firstStepBtn: false
      })
    }
  },
  // 监控最后一步按钮的状态 
  activeLastBtn: function(){
    let {carContractUrl, successReplyUrl} = this.data.form;
    if (carContractUrl.length>0 && successReplyUrl.length>0) {
      this.setData({
        lastStepBtn: true
      })
    } else {
      this.setData({
        lastStepBtn: false
      })
    }
  },
   // 选择车辆年限
   inputCarAge: function(e) {
    let carAge = e.target.dataset.carage;
    this.setData({
      ['form.carAge']: carAge
    })
  }, 

   // 选择投保期限
  inputInsurePeriod: function(e) {
   let insurePeriod = e.target.dataset.period;
   this.setData({
     ['form.insurePeriod']: insurePeriod
   })
 }, 
  
  // 输入数据
  inputData: function(e) {
    this.setData({
      ['form.'+ e.target.dataset.name]: e.detail.value
    })
    this.activeFirstBtn();
  },
  
  // 选择车辆品牌
  selectCarType: function(){
    wx.navigateTo({
      url: '../carType/carType'
    })
  },

  // 输入车贷机构
  inputOrganize: function(e) {
    this.setData({
      ['form.applyOrganization']: e.detail.value
    })
    this.activeFirstBtn();
  },

  // 选择车贷机构
  selectOrganize: function(){
    wx.navigateTo({
      url: '../applyOrganization/applyOrganization'
    })
  },


  // 输入批复金额
  inputCarSuccessMoney: function(e) {
    this.setData({
      ['form.carSuccessMoney']: e.detail.value
    })
    this.activeFirstBtn();
  },
  
  // 输入车辆型号
  inputCarType: function(e) {
    this.setData({
      ['form.carType']: e.detail.value
    })
    this.activeFirstBtn();
  },

  // 输入裸车价
  inputCarPrice: function(e) {
    this.setData({
      ['form.carPrice']: e.detail.value
    })
    this.activeFirstBtn();
  },

  // 选择车贷期数
  inputCarPeriod: function(e) {
    let carPeriod = e.target.dataset.period;
    this.setData({
      ['form.carPeriod']: carPeriod
    })
  }, 

  // 第一步
  firstStep() {
    if(this.data.firstStepBtn){
      this.setData({
        active: 1
      })
    }else{
      return false;
    }
  },

  // 最后一步
  lastStep() {
    if(this.data.lastStepBtn){
      let carContractUrl = this.formatImgArr(this.data.form.carContractUrl);
      let successReplyUrl = this.formatImgArr(this.data.form.successReplyUrl);
      this.setData({
        ['form.carContractUrl']:carContractUrl,
        ['form.successReplyUrl']:successReplyUrl
      })

      this.sendData('orderApply').then((res) => {
        console.log(res);
        if(res.data.status == '1'){
          let orderNumber = res.data.content.orderNumber;
          let phone = this.data.phone;
          let orderMsg = {
            phone: phone,
            orderNumber: orderNumber
          }
          orderMsg = JSON.stringify(orderMsg);

          let h5BaseUrl = wxRequest._h5BaseUrl;
          let baseUrl = wxRequest._baseUrl;
          let token = wxRequest._token.replace(/[\r\n]/g,"");
          let codeBaseUrl = baseUrl+'/common/getQrCode'+'?token='+token;
          let codeReqUrl = h5BaseUrl + '?orderMsg='+ encodeURI(orderMsg);
          let codeWidth = 300;
          let codeHeight = 300;
          let codeUrl = codeBaseUrl + '&txt=' + codeReqUrl + '&width=' + codeWidth + '&height=' + codeHeight;
          wx.setStorageSync('codeUrl', codeUrl);
          wx.reLaunch({
            url: '../code/code'
          })
        }
      });
    }else{
      return false;
    }
  },

  // 上传合同图片(仅拍照)
  uploadContract(e) {
    let imgName = e.currentTarget.dataset.imgname;
    let that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ['original','compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        util.showLoading('上传中...');
        const tempFilePaths = res.tempFilePaths;
        that.uploadServer(tempFilePaths,0,imgName);
      }
    })
  },

  // 上传批复函(拍照/从相册中选择)
  uploadReply(e) {
    let imgName = e.currentTarget.dataset.imgname;
    let that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        util.showLoading('上传中...');
        const tempFilePaths = res.tempFilePaths;
        that.uploadServer(tempFilePaths,0,imgName);
      }
    })
  },

  // 上传图片到服务器
  uploadServer(imgs,currentIndex,imgName){
    let that = this;
    if(currentIndex>=imgs.length){
      util.hideLoading();
      that.activeLastBtn();
      return;
    }
    // let baseUrl = wxRequest._baseUrl;
    // let token = wx.getStorageSync("token");

    qiniuUploader.upload(imgs[currentIndex], (res) => {
      let imgMsg = {};
      imgMsg.url = res.imageURL;

      if(imgName == 'carContractUrl'){
        if(that.data.form.carContractUrl.length < 6){
          that.data.form.carContractUrl.push(imgMsg);
          that.setData({
            ['form.carContractUrl']: that.data.form.carContractUrl
          })
        }else{
          util.hideLoading();
          return;
        }
      }else if(imgName == 'successReplyUrl'){
        if(that.data.form.successReplyUrl.length < 6){
          that.data.form.successReplyUrl.push(imgMsg);
          that.setData({
            ['form.successReplyUrl']: that.data.form.successReplyUrl
          })
        }else{
          util.hideLoading();
          return;
        }
      }
      currentIndex++;
      that.uploadServer(imgs,currentIndex,imgName);
    }, (error) => {
      wx.showToast({
        icon: 'none',
        title: error
      })
      return false;
    }, {
      region: 'ECN',
      uploadURL: 'https://up.qiniup.com',
      uptokenURL: 'https://api.diangc.cn/common/getFileUploadToken',
      domain: 'http://file.diangc.cn'
    })
    // wx.uploadFile({
    //   url: baseUrl + '/common/fileUpload?token=' + token,
    //   filePath: imgs[currentIndex],
    //   name: 'file',
    //   header: {  
    //     "Content-Type": "multipart/form-data",
    //   },
    //   success(res) {
    //     let data = JSON.parse(res.data);
    //     let content = data.content[0];

    //     let imgMsg = {};
    //     imgMsg.url = content.fileUrl;

    //     if(imgName == 'carContractUrl'){
    //       if(that.data.form.carContractUrl.length < 6){
    //         that.data.form.carContractUrl.push(imgMsg);
    //         that.setData({
    //           ['form.carContractUrl']: that.data.form.carContractUrl
    //         })
    //       }else{
    //         util.hideLoading();
    //         return;
    //       }
    //     }else if(imgName == 'successReplyUrl'){
    //       if(that.data.form.successReplyUrl.length < 6){
    //         that.data.form.successReplyUrl.push(imgMsg);
    //         that.setData({
    //           ['form.successReplyUrl']: that.data.form.successReplyUrl
    //         })
    //       }else{
    //         util.hideLoading();
    //         return;
    //       }
    //     }
    //     currentIndex++;
    //     that.uploadServer(imgs,currentIndex,imgName);
    //   },
    //   fail(res) {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '请求超时，请重试'
    //     })
    //     return false;
    //   }
    // })
  },

  // 删除上传的图片
  deleteImg(e){
    let imgIndex = e.currentTarget.dataset.index;
    let imgName = e.currentTarget.dataset.imgname;
    
    if(imgName == 'carContractUrl'){
      this.data.form.carContractUrl.splice(imgIndex, 1);
      this.setData({
        ['form.carContractUrl']: this.data.form.carContractUrl
      });
    }else if(imgName == 'successReplyUrl'){
      this.data.form.successReplyUrl.splice(imgIndex, 1);
      this.setData({
        ['form.successReplyUrl']: this.data.form.successReplyUrl
      });
    }
    this.activeLastBtn();
    
  },

  // 查看图片
  previewImage(e) {
    let current = e.target.dataset.src;
    let imgs = e.target.dataset.imgs;
    let newImgs = [];
    imgs.forEach(function(item){
      newImgs.push(item.url);
    })
    wx.previewImage({
      urls: newImgs, // 需要预览的图片http链接列表
      current: current
    })
  },

  // 图片提交数据格式处理
  formatImgArr(arr) {
    arr.forEach(function(item,index){
      item.sort = index;
      item.name = index;
      item.date = new Date().getTime();
    })
    return arr;
  },

  // 提交数据
  sendData(methodName) {
    util.showLoading('');
    let sendData = {};
    let reqbody = {};
    let paramsMap = {};
    let orderInfoDto = {};
    orderInfoDto.applyOrganization = this.data.form.applyOrganization;
    orderInfoDto.carSuccessMoney = this.data.form.carSuccessMoney;
    orderInfoDto.carType = this.data.form.carType;
    orderInfoDto.successMoney = this.data.form.successMoney;
    orderInfoDto.carPeriod = this.data.form.carPeriod;
    orderInfoDto.carPrice = this.data.form.carPrice;
    paramsMap.orderInfoDto = orderInfoDto;
    paramsMap.carContractUrl = this.data.form.carContractUrl;
    paramsMap.successReplyUrl = this.data.form.successReplyUrl;
    reqbody.paramsMap = paramsMap;
    sendData.reqbody = reqbody;
    sendData.serviceName = 'ApiOrderServiceImpl';
    sendData.methodName = 'saveApplyOrder';

    console.log(JSON.stringify(sendData));

    return new Promise((resolve,reject) => {
      wxRequest.post('/api/miniProgram',sendData)
      .then(res=>{  //请求成功
        util.hideLoading();
        console.log(res.data);
        if(res.data.status == 1){
          resolve(res);
        }else{
          wx.showToast({
            icon: 'none',
            title: res.data.message,
          })
          return false;
        }
      })    
      .catch(res => {
        util.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '请求错误',
        })
        return false;
      })
    })
    
  }
})
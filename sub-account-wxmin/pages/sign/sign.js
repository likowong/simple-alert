// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'
import wxVaildate from '../../utils/wx_validate'

var WxParse = require('../../wxParse/wxParse.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderNo: '',
        name: '',
        idCard: '',
        phone: '',
        isDBX: false,
        signUrl: '',
        dbxSignUrl: '',
        buttonStatus: true,
        signContent: '',
        second: 10,          //倒计时时间
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


        let orderno = options.orderno;
        let isDBX = options.isDBX;
        let name = options.name;
        let idcard = options.idcard;
        let phone = options.phone;
        let projectCode = options.projectCode;
        this.setData({
            orderNo: orderno,
            isDBX: isDBX,
            name: name,
            idCard: idcard,
            phone: phone,
            projectCode: projectCode,
        })
        // 获取签约重要提示
        wxRequest.get('/app/suborderinfo/getSignContent?orderNo=' + orderno + "&projectCode=" + projectCode, "", '')
            .then(res => {
                var that = this;
                var htmlTpl = res.data.signContent;
                WxParse.wxParse('article', 'html', htmlTpl, that, 5);
                this.timer();
            })
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
    // 输入姓名
    inputName: function (e) {
        this.setData({
            name: e.detail.value
        })
        this.activeButton();
    },// 输入手机号
    inputPhoneNum: function (e) {
        let accountCode = e.detail.value
        if (accountCode.length === 11) {
            let checkedNum = wxVaildate.checkPhoneNum(accountCode)
            if (checkedNum) {
                this.setData({
                    phone: accountCode,
                })
                this.activeButton();
            }
        } else {
            this.setData({
                accountCode: ''
            })
        }
    },
    inputIdCard: function (e) {
        let idCard = e.detail.value
        if (idCard.length === 18) {
            let checkedNum = wxVaildate.checkIdcard(idCard)
            if (checkedNum) {
                this.setData({
                    idCard: idCard,
                })
                this.activeButton();
            }
        } else {
            this.setData({
                accountCode: ''
            })
        }
    },
    // 控制登录按钮的显示状态
    activeButton: function () {
        let {name, idCard, phone} = this.data;
        if (name && idCard && phone) {
            this.setData({
                buttonStatus: true
            })
        } else {
            this.setData({
                buttonStatus: false
            })
        }
    },// 签约
    toSign: function (e) {
        if (this.data.buttonStatus) {
            util.buttonClicked(this);

            let data = {
                "orderNo": this.data.orderNo,
                "name": this.data.name,
                "phone": this.data.phone,
                "idCard": this.data.idCard,
                "type": 1
            }
            wx.setStorageSync('data', data);
            util.showLoading('');
            wxRequest.post('/app/suborderinfo/orderSign', data, '')
                .then(res => {  //请求成功
                    let signUrl = res.data.msg;
                    this.setData({
                        signUrl: signUrl
                    })
                    var enCodeSignUrl = encodeURIComponent(signUrl)

                    wxRequest.get('/app/suborderinfo/querySignStatus?orderNo=' + this.data.orderNo + '&type=' + 1 + '', '', '')
                        .then(res => {  //请求成功
                            if (res.data.signStatus.aboolean) {
                                // 是否有代步签
                                if (this.data.isDBX == "true") {
                                    data.type = 2;
                                    wxRequest.post('/app/suborderinfo/orderSign', data, '')
                                        .then(res => {  //请求成功
                                            util.hideLoading();
                                            let dbxSignUrl = res.data.msg;
                                            this.setData({
                                                dbxSignUrl: dbxSignUrl
                                            })
                                            wx.showToast({
                                                icon: 'none',
                                                title: '正在签署代步险合同页面',
                                                duration: 3000,
                                                success: function () {
                                                    setTimeout(function () {
                                                        var enCodeDBXSignUrl = encodeURIComponent(dbxSignUrl)
                                                        wx.navigateTo({
                                                            url: '../signPage/signPage?signUrl=' + enCodeDBXSignUrl
                                                        })
                                                    }, 2000) //延迟时间
                                                }
                                            })

                                        })
                                } else {
                                    util.hideLoading();
                                    wx.showToast({
                                        icon: 'none',
                                        title: '签约成功,进入查看',
                                        duration: 3000,
                                        success: function () {
                                            setTimeout(function () {
                                                // 签约成功,进入查看
                                                wx.navigateTo({
                                                    url: '../signPage/signPage?signUrl=' + enCodeSignUrl
                                                })
                                            }, 2000) //延迟时间
                                        }
                                    })
                                }
                            } else {
                                util.hideLoading();
                                wx.showToast({
                                    icon: 'none',
                                    title: '正在进入签署页面',
                                    duration: 3000,
                                    success: function () {
                                        setTimeout(function () {
                                            // 签约成功,进入查看
                                            wx.navigateTo({
                                                url: '../signPage/signPage?signUrl=' + enCodeSignUrl
                                            })
                                        }, 2000) //延迟时间
                                    }
                                })
                            }
                        })
                })
        } else {
            return false;
        }
    }// 显示倒计时
    , timer: function () {
        let promise = new Promise((resolve, reject) => {
            let setTimer = setInterval(
                () => {
                    this.setData({
                        second: this.data.second - 1
                    })
                    if (this.data.second <= 0) {
                        this.setData({
                            second: ''
                        })
                        resolve(setTimer)
                    }
                }
                , 1000)
        })
        promise.then((setTimer) => {
            clearInterval(setTimer)
        })
    }
})
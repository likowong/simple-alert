// pages/orderSteps/orderSteps.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'
import wxVaildate from '../../utils/wx_validate'

const qiniuUploader = require("../../utils/qiniuUploader");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winHeight: 0,
        steps: [
            {
                text: '基本信息'
            },
            {
                text: '上传资料'
            }
        ],
        nowDate: util.formatTime2(new Date()),
        productList: [], // 产品信息,
        currentCarAge: '',
        form: {
            carage: '',
            carbrandid: '',
            cartypeid: '',
            carbrand: '',
            cartype: '',
            carbuyprice: '',
            carbuytime: '',
            carenginenumber: '',
            carframenumber: '',
            carnumber: '',
            dbxdata: '',
            dbxprice: '',
            dbxyear: '',
            extmsg: '',
            idcard: '',
            imagemsg1: [],
            imagemsg2: [],
            imagemsg3: [],
            imagemsg4: [],
            imagemsg: [],
            dbxImagemsg: [],
            insuranceperiod: '',
            isfree: '',
            isincludedbx: '',
            name: '',
            operationmode: '',
            orderprice: '',
            phone: '',
            producecode: '',
            producetype: '',
            productcompany: '',
            productname: '',
            productprice: '',
            producttypename: '车损险',
            confirm: ''
        },
        carTypeName: '',
        active: 0,
        firstStepBtn: false,   //第一步按钮的状态
        lastStepBtn: false   //最后一步按钮的状态
        // operationNature: [
        //     {value: '1', text: '非运营车'},
        //     {value: '2', text: '运营车'}
        // ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let winMsg = wx.getSystemInfoSync();
        this.setData({
            winHeight: winMsg.windowHeight
        });
        let producecode = options.producecode
        let isfree = options.isFree
        let cciProducetyenum = options.cciProducetyenum
        if (isfree) {
            isfree = 'y'
        } else {
            isfree = 'n'
        }
        let isincludedbx = 'n'
        if (cciProducetyenum) {
            isincludedbx = 'y'
        }
        this.setData({
            ['form.producecode']: producecode,
            ['form.isfree']: isfree,
            ['form.isincludedbx']: isincludedbx,
            ['form.dbxyear']: cciProducetyenum,
        })
        let token = wx.getStorageSync("token");
        // 获取产品年限
        wxRequest.get('/app/subproductrate/list?productCode=' + producecode, "", token)
            .then(res => {
                this.setData({
                    productList: res.data.productRateVos[0]
                })
            })
    },

    onShow: function () {
        // 设置车型
        let carType = wx.getStorageSync('carType');
        if (carType) {
            this.setData({
                ['form.carbrandid']: carType.brandid,
                ['form.cartypeid']: carType.id,
                ['form.carbrand']: carType.brandname,
                ['form.cartype']: carType.name
            })
            wx.removeStorageSync('carType');
        }
        let company = wx.getStorageSync('hxc-company');
        if (company) {
            this.setData({['form.productcompany']: company})
            wx.removeStorageSync('hxc-company');
        }
        this.activeFirstBtn();
    },

    // 监控第一步按钮的状态
    activeFirstBtn: function () {
        let {carage, carbrandid, cartypeid, carbrand, cartype, carbuyprice, carbuytime, carenginenumber, carframenumber, idcard, insuranceperiod, name, operationmode, phone, producecode, productcompany, confirm} = this.data.form;
        if (carage && carbrandid && cartypeid && carbrand && cartype && carbuyprice && carbuytime && carenginenumber && carframenumber && idcard && insuranceperiod && name && operationmode && phone && producecode && productcompany && confirm) {
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
    activeLastBtn: function () {
        if (this.data.form.dbxyear) {
            let {imagemsg1, imagemsg2, imagemsg3, imagemsg4, dbxImagemsg} = this.data.form;
            if (imagemsg1.length > 0 && imagemsg2.length > 0 && imagemsg3.length > 0 && imagemsg4.length > 0 && dbxImagemsg.length > 0) {
                this.setData({
                    lastStepBtn: true
                })
            } else {
                this.setData({
                    lastStepBtn: false
                })
            }
        } else {
            let {imagemsg1, imagemsg2, imagemsg3, imagemsg4} = this.data.form;
            if (imagemsg1.length > 0 && imagemsg2.length > 0 && imagemsg3.length > 0 && imagemsg4.length > 0) {
                this.setData({
                    lastStepBtn: true
                })
            } else {
                this.setData({
                    lastStepBtn: false
                })
            }
        }

    },
    // 选择车辆年限
    inputCarAge: function (e) {
        let producetypenum = e.target.dataset.producetypenum;
        this.setData({
            ['form.carage']: producetypenum,
            currentCarAge: producetypenum
        })
        let productList = this.data.productList;
        let product = {};
        for (var i = 0; i < productList.subProductRates.length; i++) {
            if (productList.subProductRates[i].producetypenum == producetypenum) {
                product = productList.subProductRates[i];
            }
        }
        let data = this.getChildData(product)
        this.setData({
            insurePeriod: data
        })

    },
    getChildData(product) {
        let data = [];
        if (product.oneyearrate) {
            let childData = {value: '12', text: '12个月'}
            data.push(childData);
        }
        if (product.twoyearrate) {
            let childData = {value: '24', text: '24个月'}
            data.push(childData);
        }
        if (product.threeyearrate) {
            let childData = {value: '36', text: '36个月'}
            data.push(childData);
        }
        if (product.fouryearrate) {
            let childData = {value: '48', text: '48个月'}
            data.push(childData);
        }
        if (product.fiveyearrate) {
            let childData = {value: '60', text: '60个月'}
            data.push(childData);
        }
        return data;
    },
    // 选择投保期限
    inputInsurePeriod: function (e) {
        let insuranceperiod = e.target.dataset.insuranceperiod;
        this.setData({
            ['form.insuranceperiod']: insuranceperiod
        })
    },

    // 输入数据
    inputData: function (e) {
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },

    // 修改运营性质
    changeOperationMode: function (e) {
        let arr = e.detail.value
        this.setData({
            ['form.' + e.target.dataset.name]: arr.length > 0 ? arr[0] : ''
        })
        this.activeFirstBtn();
    },
    // 选择车辆品牌
    selectCarType: function () {
        wx.navigateTo({
            url: '/pages/carType/carType'
        })
    },
    // 选择保险公司
    selectCompnay: function () {
        wx.navigateTo({
            url: '/pages/insuranceCompany/insuranceCompany'
        })
    },
    // 修改确认客户已购买车损险
    changeConfirm: function (e) {
        let arr = e.detail.value
        this.setData({
            ['form.' + e.target.dataset.name]: arr.length > 0 ? arr[0] : ''
        })
        this.activeFirstBtn();
    },

    // 第一步
    firstStep() {

        if (this.data.form.carage === '') {
            wx.showToast({title: '请选择车辆年限', icon: 'none'})
            return
        }
        if (this.data.form.insuranceperiod === '') {
            wx.showToast({title: '请选择服务期限', icon: 'none'})
            return
        }
        if (this.data.form.name == '') {
            wx.showToast({title: '姓名只能输入中文和英文并不超过10个字', icon: 'none'})
            return
        } else {
            if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(this.data.form.name)) || this.data.form.name.length > 10) {
                wx.showToast({title: '姓名只能输入中文和英文并不超过10个字', icon: 'none'})
                return
            }
        }
        if (this.data.form.phone == '') {
            wx.showToast({title: '手机号不能填空', icon: 'none'})
            return
        } else {
            if (this.data.form.phone.length != 11) {
                wx.showToast({title: '手机号只能位11位', icon: 'none'})
                return
            }
        }
        if (this.data.form.idcard == '') {
            wx.showToast({title: '身份证不能为空', icon: 'none'})
            return
        } else {
            if (this.data.form.idcard.length != 18) {
                wx.showToast({title: '身份证只能为18位', icon: 'none'})
                return
            }
            let checkedNum = wxVaildate.checkIdcard(this.data.form.idcard)
            if (!checkedNum) {
                return
            }
        }
        if (this.data.form.carframenumber == '') {
            wx.showToast({title: '车架号不能填空', icon: 'none'})
            return
        } else {
            const englishAndNum = /[\W]/g
            if ((englishAndNum.test(this.data.form.carframenumber))) {
                wx.showToast({title: '车架号为17位数字+英文', icon: 'none'})
                return
            }
            if (this.data.form.carframenumber.length != 17) {
                wx.showToast({title: '车架号为17位数字+英文', icon: 'none'})
                return
            }
        }
        if (this.data.form.carenginenumber == '') {
            wx.showToast({title: '发动机号最多10位数字+英文', icon: 'none'})
            return
        } else {
            const englishAndNum = /[\W]/g
            if ((englishAndNum.test(this.data.form.carenginenumber))) {
                wx.showToast({title: '发动机号最多10位数字+英文', icon: 'none'})
                return
            }
            if (this.data.form.carenginenumber.length > 10) {
                wx.showToast({title: '发动机号最多10位数字+英文', icon: 'none'})
                return
            }
        }
        if (this.data.form.confirm == '') {
            wx.showToast({title: '勾选确认客户已购买车损险', icon: 'none'})
            return
        }
        if (this.data.form.operationmode == '') {
            wx.showToast({title: '勾选确认客户车辆性质为非营运车辆', icon: 'none'})
            return
        }
        if (this.data.form.cartype == '') {
            wx.showToast({title: '请选择车辆品牌', icon: 'none'})
            return
        }
        if (this.data.form.carbuytime == '') {
            wx.showToast({title: '请选择购置日期', icon: 'none'})
            return
        }
        if (this.data.form.carbuyprice === '') {
            wx.showToast({title: '请输入购置价格', icon: 'none'})
            return
        }
        if (this.data.firstStepBtn) {
            this.setData({
                active: 1
            })
            if (wx.pageScrollTo) {
                wx.pageScrollTo({
                    scrollTop: 0
                })
            }
        } else {
            return false;
        }
    },

    // 最后一步
    lastStep() {
        if (this.data.lastStepBtn) {
            let imagemsg1 = this.formatImgArr(this.data.form.imagemsg1);
            let imagemsg2 = this.formatImgArr(this.data.form.imagemsg2);
            let imagemsg3 = this.formatImgArr(this.data.form.imagemsg3);
            let imagemsg4 = this.formatImgArr(this.data.form.imagemsg4);
            let imagemsgStr = imagemsg1[0].url + "," + imagemsg2[0].url + "," + imagemsg3[0].url + "," + imagemsg4[0].url;
            let dbxImagemsg = this.formatImgArr(this.data.form.dbxImagemsg);
            let dbxImagemsgStr = ''
            if (dbxImagemsg.length > 0) {
                dbxImagemsgStr = dbxImagemsg[0].url
            }
            this.sendData(imagemsgStr, dbxImagemsgStr).then((res) => {
                let orderNo = res.data.orderNo;
                wx.reLaunch({
                    url: '../orderDetails/orderDetails?orderno=' + orderNo
                })
            });
            this.setData({
                ['form.dbxImagemsg']: dbxImagemsg,
            })
        } else {
            return false;
        }
    },

    // 上传合同图片(仅拍照)
    uploadContract(e) {
        let imgName = e.currentTarget.dataset.imgname;
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                util.showLoading('上传中...');
                const tempFilePaths = res.tempFilePaths;
                that.uploadServer(tempFilePaths, 0, imgName);
            }
        })
    },

    // 上传车辆信息(拍照/从相册中选择)
    uploadReply(e) {
        let imgName = e.currentTarget.dataset.imgname;
        let that = this;
        wx.chooseImage({
            count: 6,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                util.showLoading('上传中...');
                const tempFilePaths = res.tempFilePaths;
                that.uploadServer(tempFilePaths, 0, imgName);
            }
        })
    },

    // 上传图片到服务器
    uploadServer(imgs, currentIndex, imgName) {
        let that = this;
        if (currentIndex >= imgs.length) {
            util.hideLoading();
            that.activeLastBtn();
            return;
        }
        // let baseUrl = wxRequest._baseUrl;
        // let token = wx.getStorageSync("token");

        qiniuUploader.upload(imgs[currentIndex], (res) => {
            let imgMsg = {};
            imgMsg.url = res.imageURL;

            if (imgName == 'imagemsg1') {
                if (that.data.form.imagemsg1.length < 6) {
                    that.data.form.imagemsg1.push(imgMsg);
                    that.setData({
                        ['form.imagemsg1']: that.data.form.imagemsg1
                    })
                } else {
                    util.hideLoading();
                    return;
                }
            } else if (imgName == 'imagemsg2') {
                if (that.data.form.imagemsg2.length < 6) {
                    that.data.form.imagemsg2.push(imgMsg);
                    that.setData({
                        ['form.imagemsg2']: that.data.form.imagemsg2
                    })
                } else {
                    util.hideLoading();
                    return;
                }
            } else if (imgName == 'imagemsg3') {
                if (that.data.form.imagemsg3.length < 6) {
                    that.data.form.imagemsg3.push(imgMsg);
                    that.setData({
                        ['form.imagemsg3']: that.data.form.imagemsg3
                    })
                } else {
                    util.hideLoading();
                    return;
                }
            } else if (imgName == 'imagemsg4') {
                if (that.data.form.imagemsg4.length < 6) {
                    that.data.form.imagemsg4.push(imgMsg);
                    that.setData({
                        ['form.imagemsg4']: that.data.form.imagemsg4
                    })
                } else {
                    util.hideLoading();
                    return;
                }
            } else if (imgName == 'dbxImagemsg') {
                if (that.data.form.dbxImagemsg.length < 6) {
                    that.data.form.dbxImagemsg.push(imgMsg);
                    that.setData({
                        ['form.dbxImagemsg']: that.data.form.dbxImagemsg
                    })
                } else {
                    util.hideLoading();
                    return;
                }
            }
            currentIndex++;
            that.uploadServer(imgs, currentIndex, imgName);
        }, (error) => {
            wx.showToast({
                icon: 'none',
                title: error
            })
            return false;
        }, {
            region: 'SCN',
            uploadURL: 'https://up-z2.qiniup.com',
            uptokenURL: 'https://admin.vanntech.cn/app/oss/getFileUploadToken',
            domain: 'http://file.vanntech.cn'
        })
    },

    // 删除上传的图片
    deleteImg(e) {
        let imgIndex = e.currentTarget.dataset.index;
        let imgName = e.currentTarget.dataset.imgname;

        if (imgName == 'imagemsg1') {
            this.data.form.imagemsg1.splice(imgIndex, 1);
            this.setData({
                ['form.imagemsg1']: this.data.form.imagemsg1
            });
        } else if (imgName == 'imagemsg2') {
            this.data.form.imagemsg2.splice(imgIndex, 1);
            this.setData({
                ['form.imagemsg2']: this.data.form.imagemsg2
            });
        } else if (imgName == 'imagemsg3') {
            this.data.form.imagemsg3.splice(imgIndex, 1);
            this.setData({
                ['form.imagemsg3']: this.data.form.imagemsg3
            });
        } else if (imgName == 'imagemsg4') {
            this.data.form.imagemsg4.splice(imgIndex, 1);
            this.setData({
                ['form.imagemsg4']: this.data.form.imagemsg4
            });
        } else if (imgName == 'dbxImagemsg') {
            this.data.form.dbxImagemsg.splice(imgIndex, 1);
            this.setData({
                ['form.dbxImagemsg']: this.data.form.dbxImagemsg
            });
        }
        this.activeLastBtn();

    },

    // 查看图片
    previewImage(e) {
        let current = e.target.dataset.src;
        let imgs = e.target.dataset.imgs;
        let newImgs = [];
        imgs.forEach(function (item) {
            newImgs.push(item.url);
        })
        wx.previewImage({
            urls: newImgs, // 需要预览的图片http链接列表
            current: current
        })
    },

    // 图片提交数据格式处理
    formatImgArr(arr) {
        arr.forEach(function (item, index) {
            item.sort = index;
            item.name = index;
            item.date = new Date().getTime();
        })
        return arr;
    },

    // 提交数据
    sendData(imagemsgStr, dbxImagemsgStr) {
        util.showLoading('');
        let form = this.data.form;
        form.imagemsg = imagemsgStr
        form.dbxdata = dbxImagemsgStr
        let token = wx.getStorageSync("token");
        return new Promise((resolve, reject) => {
            wxRequest.post('/app/suborderinfo/save', JSON.stringify(form), token)
                .then(res => {  //请求成功
                    util.hideLoading();
                    resolve(res);
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

    }, backLastStep() {
        this.setData({
            active: 0
        });
    },
    // 校验
    validName: function (e) {
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },
    validcarframenumber: function (e) {
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },
    validcarenginenumber: function (e) {
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },
    validPhoneNum: function (e) {
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },
    validIdCard: function (e) {
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },
    validgetCarDate: function (e) {
        if (this.data.form.producecode != "SCCI") {
            let carage = this.data.form.carage;
            if (!carage) {
                wx.showToast({title: "请选择车辆年限", icon: "none"});
                return
            }
            let nowDate = new Date().toLocaleDateString();
            let value = e.detail.value;
            let days = this.checkDate(value, nowDate);
            if (days <= 0) {
                wx.showToast({title: "与所选车辆年限不符，请确认后重新选择", icon: "none"});
                return
            }
            if (days > (carage / 12 * 365)) {
                wx.showToast({title: "与所选车辆年限不符，请确认后重新选择", icon: "none"});
                return
            }
        }
        this.setData({
            ['form.' + e.target.dataset.name]: e.detail.value
        })
        this.activeFirstBtn();
    },
    checkDate: function (startTime, endTime) {

        //日期格式化
        var start_date = new Date(startTime.replace(/-/g, "/"));
        var end_date = new Date(endTime.replace(/-/g, "/"));
        //转成毫秒数，两个日期相减
        var ms = end_date.getTime() - start_date.getTime();
        //转换成天数
        var day = parseInt(ms / (1000 * 60 * 60 * 24));
        return day
    }
})
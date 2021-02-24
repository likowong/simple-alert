// pages/orderSteps/orderSteps.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

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
        },
        carTypeName: '',
        active: 0,
        firstStepBtn: false,   //第一步按钮的状态
        lastStepBtn: false,   //最后一步按钮的状态
        operationNature: [
            {value: '1', text: '非运营车'},
            {value: '2', text: '运营车'}
        ],
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
        this.activeFirstBtn();
    },

    // 监控第一步按钮的状态
    activeFirstBtn: function () {
        let {carage, carbrandid, cartypeid, carbrand, cartype, carbuyprice, carbuytime, carenginenumber, carframenumber, idcard, insuranceperiod, name, operationmode, phone, producecode, productcompany} = this.data.form;
        if (carage && carbrandid && cartypeid && carbrand && cartype && carbuyprice && carbuytime && carenginenumber && carframenumber && idcard && insuranceperiod && name && operationmode && phone && producecode && productcompany) {
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
            let {imagemsg, dbxImagemsg} = this.data.form;
            if (imagemsg.length > 0 && dbxImagemsg.length > 0) {
                this.setData({
                    lastStepBtn: true
                })
            } else {
                this.setData({
                    lastStepBtn: false
                })
            }
        } else {
            let {imagemsg} = this.data.form;
            if (imagemsg.length > 0) {
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

    // 选择车辆品牌
    selectCarType: function () {
        wx.navigateTo({
            url: '../carType/carType'
        })
    },


    // 第一步
    firstStep() {
        if (this.data.firstStepBtn) {
            this.setData({
                active: 1
            })
        } else {
            return false;
        }
    },

    // 最后一步
    lastStep() {
        if (this.data.lastStepBtn) {
            let imagemsg = this.formatImgArr(this.data.form.imagemsg);
            let dbxImagemsg = this.formatImgArr(this.data.form.dbxImagemsg);
            let imagemsgStr = "";
            let dbxImagemsgStr = "";
            for (var i = 0; i < imagemsg.length; i++) {
                imagemsgStr = imagemsgStr + imagemsg[i].url + ","
            }
            if (dbxImagemsg) {
                for (var i = 0; i < dbxImagemsg.length; i++) {
                    dbxImagemsgStr = dbxImagemsgStr + dbxImagemsg[i].url + ","
                }
            }
            this.sendData(imagemsgStr, dbxImagemsgStr).then((res) => {
                let orderNo = res.data.orderNo;
                wx.reLaunch({
                    url: '../orderDetails/orderDetails?orderno=' + orderNo
                })
            });
            this.setData({
                ['form.dbxImagemsg']: dbxImagemsg,
                ['form.imagemsg']: imagemsg

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

            if (imgName == 'imagemsg') {
                if (that.data.form.imagemsg.length < 6) {
                    that.data.form.imagemsg.push(imgMsg);
                    that.setData({
                        ['form.imagemsg']: that.data.form.imagemsg
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

        if (imgName == 'imagemsg') {
            this.data.form.imagemsg.splice(imgIndex, 1);
            this.setData({
                ['form.imagemsg']: this.data.form.imagemsg
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
    }
})
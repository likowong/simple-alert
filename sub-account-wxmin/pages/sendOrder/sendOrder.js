// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        productList: [],
        cci: {"producecode": '', "yearrate": []},
        cciProducetyenum: '',
        cciproducecode: '',
        isFree: '',
        producecode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync("token");
        wxRequest.get('/app/subproductrate/list', "", token)
            .then(res => {
                for (var i = 0; i < res.data.productRateVos.length; i++) {
                    if (res.data.productRateVos[i].productCode == "CCI") {
                        let cci = {
                            "producecode": res.data.productRateVos[i].productCode,
                            "yearrate": this.yearrate(res.data.productRateVos[i].subProductRates[0])
                        }
                        this.setData({
                            cci: cci
                        })
                        res.data.productRateVos.splice(i);
                    }
                }
                this.setData({
                    productList: res.data.productRateVos
                })
        })
    },
    checkboxChange(e) {
        let checked = e.currentTarget.dataset.checked;
        const cci = this.data.cci
        if (checked != '') {
            for (let j = 0; j < cci.yearrate.length; j++) {
                cci.yearrate[j].checked = ''
            }
            this.setData({
                cciProducetyenum: '',
                cciProducecode: '',
                cci: cci
            })
        } else {
            let cciProducetyenum = e.currentTarget.dataset.producetypenum;
            let producecode = e.currentTarget.dataset.producecode;
            for (let j = 0; j < cci.yearrate.length; j++) {
                if (cci.yearrate[j].producetypenum == cciProducetyenum) {
                    cci.yearrate[j].checked = true
                } else {
                    cci.yearrate[j].checked = ''
                }
            }
            this.setData({
                cciProducetyenum: cciProducetyenum,
                cciProducecode: producecode,
                cci: cci
            })
        }
    },
    yearrate(productRateVo) {
        let years = [];

        if (productRateVo.oneyearrate) {
            let year = {"producetypenum": "12", "year": "一年期", "checked": ''}
            years.push(year)
        }
        if (productRateVo.twoyearrate) {
            let year = {"producetypenum": "24", "year": "二年期", "checked": ''}
            years.push(year)
        }
        if (productRateVo.threeyearrate) {
            let year = {"producetypenum": "36", "year": "三年期", "checked": ''}
            years.push(year)
        }
        if (productRateVo.fouryearrate) {
            let year = {"producetypenum": "48", "year": "四年期", "checked": ''}
            years.push(year)
        }
        if (productRateVo.fiveyearrate) {
            let year = {"producetypenum": "60", "year": "五年期", "checked": ''}
            years.push(year)
        }
        return years;
    }, isFree(e) {
        if (this.data.isFree == '') {
            this.setData({
                isFree: true
            })
        } else {
            this.setData({
                isFree: ''
            })
        }
    }, selectProduct(e) {
        let productcode = e.currentTarget.dataset.productcode;
        this.setData({
            producecode: productcode
        })
    }, toOrderSteps(e) {
        let producecode = this.data.producecode

        if (!producecode) {
            wx.showToast({
                icon: 'none',
                title: "请选择产品"
            })
            return
        }
        let isFree = this.data.isFree
        let cciproducecode = this.data.cciproducecode
        let cciProducetyenum = this.data.cciProducetyenum
        wx.navigateTo({
            url: '../orderSteps/orderSteps?producecode=' + producecode + "&isFree=" + isFree + "&cciproducecode=" + cciproducecode + "&cciProducetyenum=" + cciProducetyenum
        })
    }
})
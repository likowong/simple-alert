// pages/order/order.js
import wxRequest from '../../utils/request'
import util from '../../utils/util'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        productList: [],
        productTypes: []

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync("token");
        wxRequest.get('/app/subproductrate/list', "", token)
            .then(res => {
                this.setData({
                    productList: res.data.productRateVos
                })
            })
    },
    //跳转到提单详情页面
    selectProduct(e) {
        this.setData({
            productTypes: this.data.productList[e.currentTarget.dataset.index].subProductRates
        })
    }
    // 跳到价格设置页
    , bindTapPriceCarType(e) {
        let index = e.currentTarget.dataset.index;
        let productType = this.data.productTypes[index];
        let yearOfPrice = this.yearOfPrice(productType)
        let url = "?produceName=" + productType.producename + "&produceCode=" + productType.producecode + "&produceTypeNum=" + productType.producetypenum + "&productType=" + productType.producttype + "&yearOfPrice=" + yearOfPrice
        wx.navigateTo({
            url: '/pages/priceCarType/priceCarType' + url
        })
    }, yearOfPrice(productType) {
        let yearOfPrice = ""
        if (productType.oneyearrate) {
            yearOfPrice = yearOfPrice + '12'
        }
        if (productType.twoyearrate) {
            yearOfPrice = yearOfPrice + ',24'
        }
        if (productType.threeyearrate) {
            yearOfPrice = yearOfPrice + ',36'
        }
        if (productType.fouryearrate) {
            yearOfPrice = yearOfPrice + ',48'
        }
        if (productType.fiveyearrate) {
            yearOfPrice = yearOfPrice + ',60'
        }
        return yearOfPrice
    }
})
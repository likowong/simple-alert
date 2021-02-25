const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

class Request {
    _header = {
        'content-type': 'application/json',
        'token': null
    }

    //_baseUrl = 'https://admin.vanntech.cn'
    _baseUrl = 'http://192.168.1.5'

    _token = ''

    interceptors = []

    constructor() {
        const token = wx.getStorageSync("token");
        if (token) {
            this._token = token
            // this._header.token = token
        }
        return this._token;
    }

    // intercept(res) {
    //     return this.interceptors
    //         .filter(f => typeof f === 'function')
    //         .every(f => f(res))
    // }
    intercept(res) {
        switch (res.data.code) {
            case 0:
                return true;
            case 500:
                wx.showToast({
                    icon: 'none',
                    title: res.data.msg,
                })
                return false;
            case 403:   // token失效
                wx.showToast({
                    icon: 'none',
                    title: "登录失效,请重新登录",
                    success: function () {
                        setTimeout(function () {
                            wx.reLaunch({
                                url: '/pages/login/login'
                            })
                        }, 2000) //延迟时间
                    }
                })

                return false;
            default:
                wx.showToast({
                    icon: 'none',
                    title: res.msg,
                })
                return false;
        }
    }

    fail() {
        wx.showToast({
            icon: 'none',
            title: '请求失败，请重试'
        })
    }

    request({url, method, header = {}, data}) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: (this._baseUrl || '') + url,
                method: method || METHOD.GET,
                data: data,
                header: {
                    token: header,
                },
                success: res => this.intercept(res) && resolve(res),
                fail: res => this.fail() && reject
            })
        })
    }


    get(url, data, header) {
        return this.request({url, method: METHOD.GET, header, data})
    }

    post(url, data, header) {
        return this.request({url, method: METHOD.POST, header, data})
    }

    put(url, data, header) {
        return this.request({url, method: METHOD.PUT, header, data})
    }

    delete(url, data, header) {
        return this.request({url, method: METHOD.DELETE, header, data})
    }

    token(token) {
        this._header.token = token
        return this
    }

    header(header) {
        this._header = header
        return this
    }

    baseUrl(baseUrl) {
        this._baseUrl = baseUrl
        return this
    }

    interceptor(f) {
        if (typeof f === 'function') {
            this.interceptors.push(f)
        }
        return this
    }
}

export default new Request

export {METHOD}
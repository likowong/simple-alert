const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

class Request {
    // _h5BaseUrl = 'http://172.22.5.126:8090'
    _h5BaseUrl = 'https://diangc.cn/order'
    _header = {
        'content-type': 'application/json',
        'token': null
    }

    // _baseUrl = 'http://172.22.5.49:8081'
    _baseUrl = 'http://localhost'

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
        switch(res.data.code){
            case 0:
              return true;
            case 500:
                wx.showToast({
                    icon: 'none',
                    title: res.data.message,
                })
                return false;
            case 403:   // token失效
              wx.reLaunch({
                url: '/pages/login/login'
              })
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

    request({ url, method, header = {}, data }) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: (this._baseUrl || '') + url + '?token=' + this.constructor(),
                method: method || METHOD.GET,
                data: data,
                header: {
                    ...this._header,
                    ...header
                },
                success: res => this.intercept(res) && resolve(res),
                fail: res => this.fail() && reject
            })
        })
    }


    get(url, data, header) {
        return this.request({ url, method: METHOD.GET, header, data })
    }

    post(url, data, header) {
        return this.request({ url, method: METHOD.POST, header, data })
    }

    put(url, data, header) {
        return this.request({ url, method: METHOD.PUT, header, data })
    }

    delete(url, data, header) {
        return this.request({ url, method: METHOD.DELETE, header, data })
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

export { METHOD }
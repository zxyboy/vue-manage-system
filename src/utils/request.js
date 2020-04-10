import axios from 'axios'
import globalConfig from "../api/config/global_configuration.mjs";
import {Message} from 'element-ui';


const service = axios.create({
    // URL
    baseURL: globalConfig.host,
    // 方法
    method: "post",
    // 请求头
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json"
    },
    // 超时时间 单位毫秒 ,
    timeout: 5000
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    // withCredentials: true
});

/**
 * 请求拦截器
 */
service.interceptors.request.use(
    config => {
        let token = localStorage.getItem(globalConfig.token);
        if (token) {
            config.headers.Authorization = token;
        }
        console.log("执行了请求拦截器 ===>", config);
        return config;
    },
    error => {
        console.log("请求 error ==> ", error);
        return Promise.reject();
    }
);

/**
 * 响应拦截器
 */
service.interceptors.response.use(
    response => {
        console.log("response 拦截器", response)
        // 返回数据
        let data = response.data.data;
        // 操作错误时，会返回errors字段。类型为数组。
        let errors = response.data.errors;
        if (response.status === 200 && data && !errors) {
            return data;
        } else {
            return errors;
        }
    },
    error => {
        if (error.response && error.response.status) {
            let status = error.response.status;
            if (status === 401) {
                // window.location.href = "/login";
                Message.error("用户凭证已失效，请重新登录!");
                // localStorage.clear();
            } else {
                Message.error("状态码：" + status + ", 请求服务器异常!");
            }
        } else {
            Message.error("请求服务器异常,请稍后重试!");
        }
        // console.log("response type  error ==> ", JSON.stringify(error));
        // Message.error(error);
        return Promise.reject();
    }
)

/**
 * 自定义Http请求对象
 */
class Request {

    constructor(axios) {
        this.axios = axios;
        // this.router = router;
    }

    /**
     * 请求方法
     * @param data
     * @param config
     * @returns {*}
     */
    post(param, config) {

        let stringify = JSON.stringify(param);
        console.log("stringify ==> ", stringify)
        this.axiosPromise = this.axios.post(globalConfig.baseURI, stringify, config)
        return this;
    }

    /**
     * 请求接口成功： 状态码 200 处理方法
     *
     * 如果后台接口状态码返回401， 传入的failCallback无效。强制返回登陆页面
     * @param successCallback
     * @param failCallback
     */
    then(successCallback, failCallback) {
        this.thenPromise = this.axiosPromise.then(dataOrError => {
            // console.log("router ==> ", this.router)
            // this.router.push("/")
            // 请求发生错误
            if (dataOrError instanceof Array) {
                let errors = dataOrError;
                let errorMessage = "";
                errors.forEach(error => {
                    errorMessage += error.message;
                    if (error.extensions && error.extensions.errorCode
                        && error.extensions.errorCode === 401) {
                        // 清除用户登陆信息
                        localStorage.clear();
                        // TODO 跳转登陆页面
                        // console.log("跳转登录页.....")
                        window.location.href =  "/login";
                        // router.app.$router.push("/")
                        return;
                    }
                });
                let skip = false;
                if (failCallback) {
                    skip = failCallback(errors)
                }
                if (skip) {
                    return;
                }
                // 错误弹窗
                Message.error(errorMessage);
            } else {
                let data = dataOrError;
                console.log("success ==>", data);
                successCallback(data);
            }
        });
        return this;
    }

    /**
     * 处理请求失败情况： 状态码不是200
     * @param failCallback
     */
    catch(failCallback) {
        this.thenPromise.catch(function (error) {
            if (!error) {
                Message.error("未知错误，请稍后重试!")
                return;
            }
            failCallback(error);
        });
    }
}

let request = new Request(service)


export default request


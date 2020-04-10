import globalConfig from "../api/config/global_configuration";
import request from "./request";
// 时间格式化
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


class Utils {
    /**
     * 跳转登陆页面
     * @param that
     */
    static routerToLogin(that) {
        localStorage.clear();
        that.$router.push("/login");
    }


    /**
     * 格式化日期 ， 固定格式 yyyy-MM-dd
     * @param date
     * @return {string}
     */
    static formatDate(date) {
        date = new Date(date);
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();
        mymonth < 10 ? mymonth = "0" + mymonth : mymonth;
        myweekday < 10 ? myweekday = "0" + myweekday : myweekday;
        return `${myweekday}号`;
        // return `${myyear}-${mymonth}-${myweekday}`;
    }

    /**
     * 获取当天月所有日期，返回数组
     * @return {[]}
     */
    static getDaysOfCurrentMonth() {
        let now = new Date();
        let currentMonthNum = Utils.getTotalDayOfCurrentMonth();
        let currentMonth = [];
        for (let i = 1; i <= currentMonthNum; i++) {
            let day = now.setDate(i);
            let everyDay = Utils.formatDate(day);
            currentMonth.push(everyDay);
        }
        return currentMonth;
    }

    /**
     * 获取当天月所有截止到当前天日期，返回数组
     * @return {[]}
     */
    static getDaysOfMonth(fmt) {
        let now = new Date();
        let currentMonthNum = now.getDate();
        let currentMonth = [];
        for (let i = 1; i <= currentMonthNum; i++) {
            let day = now.setDate(i);
            let everyDay = Utils.strToDateStrWithoutMinus8Hours(day, fmt);
            currentMonth.push(everyDay);
        }
        return currentMonth;
    }


    /**
     * 获取本月一共有多少天
     * @return {number}
     */
    static getTotalDayOfCurrentMonth() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let d = new Date(year, month, 0);
        return d.getDate();
    }

    /**
     * 获取指定月有多少年
     * @param year
     * @param month
     * @return {number}
     */
    static getTotalDayOfMonth(year, month) {
        let d = new Date(year, month, 0);
        return d.getDate();
    }

    /**
     * 格式化秒
     * @param value
     * @return {string}
     */
    static formatSeconds(value) {
        let seconds = parseInt(value); // 需要转换的时间秒
        // 分
        let minutes = 0;
        // 小时
        let hours = 0;
        // 天
        let days = 0;
        // 月 - 30天算一个月
        let months = 0;
        // 年 - 365天 算一年
        let years = 0;

        if (seconds >= 60) {
            // 分
            minutes = parseInt(seconds / 60);
            seconds = parseInt(seconds % 60);
            if (minutes > 60) {
                // 小时
                hours = parseInt(minutes / 60);
                minutes = parseInt(minutes % 60);
                if (hours > 24) {
                    //天
                    days = parseInt(hours / 24);
                    hours = parseInt(hours % 24);
                    if (days > 30) {
                        months = parseInt(days / 30);
                        hours = parseInt(days % 30)
                        if (months > 12) {
                            years = parseInt(months / 12);
                            months = parseInt(months % 12)
                        }
                    }
                }
            }
        }

        let result = '';

        if (seconds >= 0) {
            result = "" + parseInt(seconds) + "秒";
        }
        if (minutes > 0) {
            result = "" + parseInt(minutes) + "分" + result;
        }
        if (hours > 0) {
            result = "" + parseInt(hours) + "小时" + result;
        }
        if (days > 0) {
            result = "" + parseInt(days) + "天" + result;
        }
        if (months > 0) {
            result = "" + parseInt(months) + "月" + result;
        }
        if (years > 0) {
            result = "" + parseInt(years) + "年" + result;
        }
        return result;
    }


    /**
     * 判断限制图片上传大小
     * @param file
     */
    static limitUpdateFileSize(file, maxFileSize, that) {
        const isLt2M = file.size / 1024 / 1024 < maxFileSize;
        if (!isLt2M) {
            that.$message.error('上传Excel文件大小不能超过 ' + maxFileSize + 'MB!');
        }
        return isLt2M;
    }

    /**
     * 根据图片urls,返回file数组
     * @param urls
     * @return {{url: string}[]|*[]}
     */
    static getFileList(urls) {
        if (urls) {
            return urls.split(",").map(item => {
                let url = globalConfig.imageHost + item;
                let file = {
                    url: url
                }
                return file;
            });
        } else {
            return [];
        }

    }


    /**
     * 删除图片
     * @param file
     * @param fileList
     */
    static removeFile(file, fileList, removeImageStr, that) {
        let obj = {};
        if (file.originalUrl) {
            obj.url = file.originalUrl;
        } else {
            let url = file.url.replace(globalConfig.imageHost, "");
            obj.url = url;
        }
        let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeImageStr, obj);
        request.post(mutationGraphQLParam).then(data => {
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].url == file.url) {
                    fileList.splice(i, 1);
                }
            }
            if (that) {
                that.$message.success("删除成功");
            }
        });
    }

    /**
     * 上传图片成功
     * @param response
     * @param fileList
     */
    static uploadImageSuccess(response, fileList, that) {
        let originalUrl = response.data.url;
        let url = globalConfig.imageHost + originalUrl;
        let image = {
            originalUrl: originalUrl,
            url: url
        };
        fileList.push(image);
        that.$message.success("上传成功!");
    }


    static downloadImage(imgSrc, that, name) {//下载图片地址和图片名
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
            let a = document.createElement("a"); // 生成一个a元素
            let event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name || "未命名"; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
            that.$message.success("下载成功");
        };
        image.src = imgSrc;
    }

    /**
     *
     *  判断array数组中是否包含element对象
     *   判断依据 ： 依据element对象的key值是否相等
     * @param element
     * @param array
     * @param key
     * @return boolean
     */
    static hasElementByKey(element, key, array) {
        let contains = false;
        array.forEach(item => {
            if (item[key] && element[key] && item[key] === element[key]) {
                contains = true;
                return contains;
            }
        });
        return contains;
    }


    /**
     * 数组array去重，
     *  注意：array中只能保存字面值， 不能保存对象类型
     * @param array
     * @returns {unknown[]}
     */
    static dedupe(array) {
        return Array.from(new Set(array));
    }

    /**
     * 数组或者对象深拷贝
     * @param objOrArr
     * @returns {any}
     */
    static deepClone(objOrArr) {
        return JSON.parse(JSON.stringify(objOrArr));
    }

    /**
     * 日期格式化
     * @param date
     * @param fmt
     * @returns {*}
     */
    static dateFormat(date, fmt) {
        fmt = fmt ? fmt : globalConfig.formatter;
        return date.format(fmt);
    }

    /**
     * 字符串转Date
     * @param dateStr
     * @returns {Date}
     */

    static strToDate(dataStr) {
        let date = new Date(dataStr);
        let time = date.getTime();
        date.setTime(time - 8 * 60 * 60 * 1000);
        return date;
    }


    static strToDateWithoutMinus8Hours(dataStr) {
        let date = new Date(dataStr);
        return date;
    }

    /**
     * 字符串时间转换格式
     * @param dateStr
     * @param fmt
     * @returns {*}
     */
    static strToDateStrWithoutMinus8Hours(dateStr, fmt) {
        fmt = fmt ? fmt : globalConfig.formatter;
        return this.strToDateWithoutMinus8Hours(dateStr).format(fmt);
    }

    // 浏览器中可用
    // static strToDate(dataStr) {
    //     let date = eval('new Date(' + dataStr.replace(/\d+(?=-[^-]+$)/,
    //         function (a) {
    //             return parseInt(a, 10) - 1;
    //         }).match(/\d+/g) + ')');
    //     return date;
    // }


    /**
     * 字符串时间转换格式
     * @param dateStr
     * @param fmt
     * @returns {*}
     */
    static strToDateStr(dateStr, fmt) {
        fmt = fmt ? fmt : globalConfig.formatter;
        return this.strToDate(dateStr).format(fmt);
    }

    /**
     * 查询接口参数
     * @param query
     * @param variables
     * @returns {{}}
     */
    static getGraphQLParam(query, variables) {
        let obj = {};
        obj.query = query;
        if (variables) {
            obj.variables = variables;
        }
        return obj
    }

    /**
     * 修改接口参数
     * @param query
     * @param variables
     * @returns {{}}
     */
    static getMutationGraphQLParam(query, variables, key) {
        let obj = {};
        obj.query = query;
        let input = {};
        if (key) {
            input[key] = variables;
        } else {
            input.input = variables;
        }
        obj.variables = input;
        return obj
    }


}

export default Utils
import Utils from "./utils";

class ECharsUtils {

    constructor() {
    }


    static buildLineSeriesData(name, dataArray) {

        return {
            name: name,
            type: 'line',
            // type: 'bar',
            data: dataArray,
            // markPoint: {
            //     data: [
            //         {type: 'max', name: '最大值'},
            //         {type: 'min', name: '最小值'}
            //     ]
            // },
            // markLine: {
            //     data: [
            //         {type: 'average', name: '平均值'}
            //     ]
            // }
        };
    }

    static buildLineMonthStat(monthStat, legendData, seriesData) {
        let daysOfCurrentMonth = Utils.getDaysOfMonth("yyyy-MM-dd");
        let obj = {
            userNum: '',
            paperNum: '',
            examNum: '',
            totalExamTime: '',
            signNum: '',
            noteNum: ''
        };

        // 处理没有日期的图表数据
        let fullData = [];
        if (monthStat.length == daysOfCurrentMonth.length - 1) {
            fullData = monthStat;
        } else {
            for (let dateStr of daysOfCurrentMonth) {
                let hasContain = false;
                for (let item of monthStat) {
                    if (dateStr == item.today) {
                        hasContain = true;
                        fullData.push(item)
                        break;
                    }
                }
                if (!hasContain) {
                    fullData.push(obj);
                }
            }
        }

        // 构建图表数据
        let userNumArr = fullData.map(item => item.userNum);
        let paperNumArr = fullData.map(item => item.paperNum);
        let examNumArr = fullData.map(item => item.examNum);
        let signNumArr = fullData.map(item => item.signNum);
        let noteNumArr = fullData.map(item => item.noteNum);
        // 放入图表Series中
        seriesData.push(ECharsUtils.buildLineSeriesData(legendData[0], userNumArr));
        seriesData.push(ECharsUtils.buildLineSeriesData(legendData[1], paperNumArr));
        seriesData.push(ECharsUtils.buildLineSeriesData(legendData[2], examNumArr));
        seriesData.push(ECharsUtils.buildLineSeriesData(legendData[3], signNumArr));
        seriesData.push(ECharsUtils.buildLineSeriesData(legendData[4], noteNumArr));
    }

}

export default ECharsUtils;
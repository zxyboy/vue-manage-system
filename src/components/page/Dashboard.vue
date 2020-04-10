<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:210px;">
                    <div class="user-info">
                        <img :src="imageUrl()" class="user-avator" alt/>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{lastLoginTime()}}</span>
                    </div>
                </el-card>

                <el-card shadow="hover" style="height:800px;">
                    <template>
                        <div id="userAgeStat" style="width: 100%; height: 350px;">
                        </div>
                    </template>
                    <template>
                        <div id="userGenderStat" style="width: 100%; height: 350px;">
                        </div>
                    </template>
                </el-card>


            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb6">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{indexStat.totalUserNum}}</div>
                                    <div>总用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-data grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{indexStat.totalPaperNum}}</div>
                                    <div>总试卷数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-alarm-clock grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalTestTime}}</div>
                                    <div>累计考试时长</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                </el-row>

                <el-row :gutter="20">

                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{indexStat.testingUserNum}}</div>
                                    <div>正在考试人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-data grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{indexStat.checkingUserNum}}</div>
                                    <div>正在批改试卷数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-view grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{indexStat.todaySignNum}}</div>
                                    <div>今日签到人数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-card shadow="hover" style="height:800px;">
                    <template>
                        <div id="userGrowthMapStat" style="width: 933px; height: 700px;">
                        </div>
                    </template>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">

            <el-card shadow="hover">
                <template>
                    <div id="userGrowthHistogram" style="width: 100%; height: 500px;">
                    </div>
                </template>
            </el-card>
        </el-row>
        <el-row :gutter="20">
            <el-card shadow="hover">
                <template>
                    <div id="userPaperLineChart" style="width: 100%; height: 500px;">
                    </div>
                </template>
            </el-card>
        </el-row>
    </div>
</template>

<script>
    import globalConfig from "../../api/config/global_configuration";
    import Utils from "../../utils/utils";
    import {indexStatQuery} from "../../api/dashboard"
    import request from "../../utils/request";
    import echarts from 'echarts';
    import ECharsUtils from "../../utils/ECharsUtils";

    let chinaJSON = require("../../assets/map/china");

    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem(globalConfig.username),
                userInfo: {},
                indexStat: {},
                totalTestTime: '',
                userGrowthMapStat: {},
                userGrowthHistogram: {},
                userPaperLineChart: {},
                // 用户年龄分布
                userAgeStat: {},
                userAgeStatColumn: [],
                userAgeStatData: [],
                // 用户性别分布
                userGenderStat: {},
                userGenderStatColumn: [],
                userGenderStatData: [],
                // 累计数据统计
                totalLegendData: [],
                totalSeriesData: [],
                // 净增长统计
                growthLegendData: [],
                growthSeriesData: [],

                dataList: [],
                yearMonth: Utils.dateFormat(new Date(), "yyyy年MM月"),
                monthDays: Utils.getDaysOfCurrentMonth()
            };
        },
        components: {
            // Schart
        },
        mounted() {
            this.indexStatMethod();
        },
        computed: {
            role() {
                let item = localStorage.getItem(globalConfig.userInfo);
                if (item) {
                    let userInfo = JSON.parse(item);
                    let roles = userInfo.roles;
                    if (roles && roles.length > 0) {

                        return roles.map(role => role.roleDesc).join(",");
                    } else {
                        return "未知角色";
                    }
                } else {
                    Utils.routerToLogin(this);
                }

            },

        },
        created() {
            // this.handleListener();
            // this.changeDate();


        },
        // activated() {
        //     this.handleListener();
        // },
        // deactivated() {
        //     window.removeEventListener('resize', this.renderChart);
        //     bus.$off('collapse', this.handleBus);
        // },
        methods: {
            drawMap() {

                this.userGrowthMapStat = echarts.init(document.getElementById('userGrowthMapStat'));
                let dataList = this.dataList;
                echarts.registerMap('china', chinaJSON);
                this.userGrowthMapStat.setOption({
                    title: {
                        text: "全国各省用户分布图"
                    },
                    tooltip: {
                        triggerOn: "click",
                        formatter: function (e, t, n) {
                            return .5 == e.value ? e.name + "：有疑似病例" : e.seriesName + "<br />" + e.name + "：" + e.value
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: 1000,
                        left: 26,
                        bottom: 20,
                        showLabel: !0,
                        text: ["高", "低"],
                        pieces: [{
                            gt: 100,
                            label: "> 100 人",
                            color: "#7f1100"
                        }, {
                            gte: 10,
                            lte: 100,
                            label: "10 - 100 人",
                            color: "#ff5428"
                        }, {
                            gte: 1,
                            lt: 10,
                            label: "1 - 9 人",
                            color: "#ff8c71"
                        }, {
                            value: 0,
                            color: "#ffffff"
                        }],
                        show: !0
                    },
                    geo: {
                        map: "china",
                        roam: !1,
                        scaleLimit: {
                            min: 1,
                            max: 2
                        },
                        zoom: 1.23,
                        top: 120,
                        label: {
                            normal: {
                                show: !0,
                                fontSize: "14",
                                color: "rgba(0,0,0,0.7)"
                            }
                        },
                        itemStyle: {
                            normal: {
                                //shadowBlur: 50,
                                //shadowColor: 'rgba(0, 0, 0, 0.2)',
                                borderColor: "rgba(0, 0, 0, 0.2)"
                            },
                            emphasis: {
                                areaColor: "#f2d5ad",
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                borderWidth: 0
                            }
                        }
                    },
                    series: [{
                        name: "用户人数",
                        type: "map",
                        geoIndex: 0,
                        data: dataList
                    }]
                });
            },
            drawPie() {
                let option = {
                    title: {
                        text: '用户年龄分布',
                        subtext: '实时数据',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.userAgeStatColumn
                    },
                    series: [
                        {
                            name: '年龄分布',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: this.userAgeStatData,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                this.userAgeStat = echarts.init(document.getElementById('userAgeStat'));
                this.userAgeStat.setOption(option);

            },
            drawGenderPie() {
                let option = {

                    title: {
                        text: '用户性别分布',
                        subtext: '实时数据',
                        left: 'center'

                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: this.userGenderStatColumn
                    },
                    series: [
                        {
                            name: '性别分布',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            top: '20%',
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: this.userGenderStatData

                        }
                    ]
                };
                this.userGenderStat = echarts.init(document.getElementById('userGenderStat'));
                this.userGenderStat.setOption(option);

            },
            drawHistogram() {
                let text = this.yearMonth + '累计数量统计';
                this.userGrowthHistogram = echarts.init(document.getElementById('userGrowthHistogram'));
                let option = {
                    title: {
                        text: text,
                        subtext: '实时数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: this.totalLegendData
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: this.monthDays
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: this.totalSeriesData
                }

                this.userGrowthHistogram.setOption(option);
            },
            drawLineChars() {
                let text = this.yearMonth + '净增长数量统计';
                this.userPaperLineChart = echarts.init(document.getElementById('userPaperLineChart'));
                let option = {
                    title: {
                        text: text,
                        subtext: '实时数据'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: this.growthLegendData
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: this.monthDays
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: this.growthSeriesData
                }

                this.userPaperLineChart.setOption(option);
            },
            indexStatMethod() {
                let graphQLParam = Utils.getGraphQLParam(indexStatQuery);
                request.post(graphQLParam).then(data => {
                    // 首页数量统计
                    this.indexStat = data.indexStat;
                    this.totalTestTime = Utils.formatSeconds(this.indexStat.totalTestTime);
                    // 年龄区间分布
                    let ageStat = data.userAgeStat;
                    this.userAgeStatColumn = ageStat.map(item => item.ageRange);
                    this.userAgeStatData = ageStat.map(item => {
                        return {value: item.ageNum, name: item.ageRange};
                    });

                    this.drawPie();
                    // 性别比例
                    let genderStat = data.userGenderStat;
                    this.userGenderStatColumn = genderStat.map(item => item.gender);
                    this.userGenderStatData = genderStat.map(item => {
                        return {value: item.genderNum, name: item.gender};
                    });
                    this.drawGenderPie();
                    // 用户省分布
                    this.dataList = data.userProvinceNumStat;
                    this.drawMap();
                    // 当前月份累计统计
                    let totalMonthStat = data.totalMonthStat;
                    this.totalLegendData = ['用户数量', '试卷数量', '考试次数', '签到次数', '笔记数量'];
                    ECharsUtils.buildLineMonthStat(totalMonthStat, this.totalLegendData, this.totalSeriesData);
                    this.drawHistogram();

                    // 当前月份净增统计
                    let growthMonthStat = data.growthMonthStat;
                    this.growthLegendData = this.totalLegendData;
                    ECharsUtils.buildLineMonthStat(growthMonthStat, this.growthLegendData, this.growthSeriesData);
                    this.drawLineChars();
                });
            },
            imageUrl() {
                let item = localStorage.getItem(globalConfig.userInfo);
                if (item) {
                    let userInfo = JSON.parse(item);
                    let avatarUrl = globalConfig.imageHost + userInfo.avatarUrl;
                    return avatarUrl;
                } else {
                    Utils.routerToLogin(this);
                }
            },
            lastLoginTime() {
                let item = localStorage.getItem(globalConfig.userInfo);
                if (item) {
                    let userInfo = JSON.parse(item);
                    let lastLoginTime = userInfo.lastLoginTime;
                    return Utils.strToDateStr(lastLoginTime);
                } else {
                    Utils.routerToLogin(this);
                }
            }
        }
    };
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .mgb6 {
        margin-bottom: 6px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>

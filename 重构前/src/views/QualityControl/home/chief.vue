<template>
    <div class="qc-chief-wrap clearFix">
        <!-- 左侧质量控制任务列表 -->
        <div class="ep-task">
            <div class="task-total">
                质量控制导航
            </div>
            <div class="task-list">
                <ul v-for="(v,i) of chiefList" :key="'chiefList'+i" v-if="v.children.some(v=>v.limit)">
                    <div class="caption">
                        <div>
                            <img :src="v.imgUrl" alt="" style="width:100%;height:100%;">
                        </div>
                        <h3>{{v.title}}</h3>
                    </div>
                    <router-link tag="li" v-for="(value,index) of v.children" :key="'v.children'+index" :to="value.url" v-if="value.limit">
                        <div></div>
                        {{value.page}}
                    </router-link>
                </ul>
            </div>
        </div>
        <!-- 右侧数据展示 -->
        <div class="data-show-wrap">
            <!-- 第一栏 -->
            <div class="digital-data row">
                <div class="digital-detail" @click="skipDetail(checkLimit('pm:inspection:task'),{name:'inspection-task-list'})">
                    <div class="digital-type">
                        <div class="digital-icon">
                            <img :src="digitalImgs[0]" alt="" style="width:80%;height:80%">
                        </div>
                        <div class="digital-title">
                            <p class="textEllipsis">巡检科室总数</p>
                            <span>上个月</span>
                        </div>
                    </div>
                    <div class="digital-count">
                        {{lineOneData.sectionCount | LOFormat}}
                    </div>
                </div>
                <div class="digital-detail" @click="skipDetail(checkLimit('pm:one:task'),{name:'MaintenanceTask'})">
                    <div class="digital-type">
                        <div class="digital-icon">
                            <img :src="digitalImgs[1]" alt="" style="width:80%;height:80%">
                        </div>
                        <div class="digital-title">
                            <p class="textEllipsis">日常保养科室总数</p>
                            <span>昨天</span>
                        </div>
                    </div>
                    <div class="digital-count">
                        {{lineOneData.oneCountStatistical | LOFormat}}
                    </div>
                </div>
                <div class="digital-detail" @click="skipDetail(checkLimit('pm:two:task'),{name:'MaintenanceTask',query:{type:'2'}})">
                    <div class="digital-type">
                        <div class="digital-icon">
                            <img :src="digitalImgs[2]" alt="" style="width:80%;height:80%">
                        </div>
                        <div class="digital-title">
                            <p class="textEllipsis">二级保养总数</p>
                            <span>本月</span>
                        </div>
                    </div>
                    <div class="digital-count">
                        {{lineOneData.twoCountStatistical | LOFormat}}
                    </div>
                </div>
                <div class="digital-detail" @click="skipDetail(checkLimit('pm:three:task'),{name:'MaintenanceTask',query:{type:'3'}})">
                    <div class="digital-type">
                        <div class="digital-icon">
                            <img :src="digitalImgs[3]" alt="" style="width:80%;height:80%">
                        </div>
                        <div class="digital-title">
                            <p class="textEllipsis">三级保养总数</p>
                            <span>本月</span>
                        </div>
                    </div>
                    <div class="digital-count">
                        {{lineOneData.threeCountStatistical | LOFormat}}
                    </div>
                </div>
                <div class="digital-detail" @click="skipDetail(checkLimit('pm:adverseevent'),{name:'adverse-event-list'})">
                    <div class="digital-type row">
                        <div class="digital-icon">
                            <img :src="digitalImgs[4]" alt="" style="width:80%;height:80%">
                        </div>
                        <div class="digital-title">
                            <p class="textEllipsis">不良事件上报总数</p>
                            <span>自启用起</span>
                        </div>
                    </div>
                    <div class="digital-count">
                        {{lineOneData.adverseEventCount | LOFormat}}
                    </div>
                </div>
            </div>

            <!-- 第三栏 -->
            <div class="c-footer row">
                <div class="measurement">
                    <div class="title">
                        <p>计量任务</p>
                        <!-- <router-link tag="div"  to="">查看更多<span :is="'Icon'" type="chevron-right"></span></router-link> -->
                    </div>
                    <div class="measurement-chart">
                        <div style="opsition:relative;border-bottom:1px solid #e2e2e2;">
                            <p class="measurement-title measurement-title-normal">正常计量设备</p>
                            <div style="width:413px;height:200px;">
                                <kld-echarts :option='kldPieOption' :auto-resize='false' type='pie' compontent='title,legend,tooltip'></kld-echarts>
                            </div>
                        </div>
                        <div class="low-m">
                            <p class="measurement-title">低值计量设备</p>
                            <p class="low-total">{{EMDatas.low}}
                                <span>低值计量设备总数</span>
                            </p>
                        </div>

                    </div>
                </div>
                <div class="c-process">
                    <div class="title">
                        <p>任务进度预览</p>
                    </div>
                    <div class="process-table">
                        <Tabs v-model="tabName" @on-click="getTab">
                            <TabPane label="巡检">
                                <Table class="i-table-stripe" stripe :data="inspectionTableData.data" :columns="inspectionTableData.columns" style="background-color:#fafafa"></Table>
                            </TabPane>
                            <TabPane label="保养" style="background-color:#fafafa">
                                <Table class='i-table-stripe' :data="maintenanceTableData.data" :columns="maintenanceTableData.columns" style="background-color:#fafafa"></Table>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>
            </div>
            <!-- 第二栏 -->
            <div class="bar-graph row">
                <div class="title">
                    <p>日常保养TOP10
                        <span>（上月）</span>
                    </p>
                    <router-link tag="div" :to='{name:"MaintenanceTask"}' :style="{visibility:ViewLimit('pm:one:task')?'visible':'hidden'}">查看更多
                        <span :is="'Icon'" type="chevron-right"></span>
                    </router-link>
                </div>

                <div class="canvas-wrap" v-if="echartsData">
                    <kld-echarts :option='echartsData' type='bar' auto-resize compontent='title,grid,tooltip'></kld-echarts>
                </div>
                <!-- 暂无数据 -->
                <div class="canvas-noData" v-else>
                    暂无数据
                </div>
            </div>

        </div>
    </div>
</template>

<script>
// import Pie from '@common/pie/pie.vue';
import { chief, digitalImgs } from "./API.js";
// 引入基本模板
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";
export default {
    data() {
        return {
            myChart: null,
            //科长入口
            chiefList: chief.call(this),
            //第一栏图标+数据
            digitalImgs: digitalImgs,
            lineOneData: {},
            //柱状图dom;
            barDom: "",
            //柱状图数据
            echartsData: null,
            //计量饼图数据
            EMDatas: {
                pieData: [{ value: 0, name: "暂无数据" }],
                low: 0
            },

            tabName: 0,
            currentName: 0,
            //任务进度数据
            columns: [
                {
                    title: "姓名",
                    key: "name"
                },
                {
                    title: "任务名称",
                    key: "taskName"
                },
                {
                    title: "任务进度",
                    key: "taskProcess"
                },
                {
                    title: "任务结束时间",
                    key: "endTime"
                }
            ],
            //巡检
            inspectionData: [
                // {
                //     name:"工程师1",
                //     taskName:"一号病区楼巡检任务",
                //     taskProcess:"7/10",
                //     endTime:"2018-05-13",
                // }
            ],
            maintenanceData: [
                // {
                //     name:"工程师1",
                //     taskName:"一号病区楼巡检任务",
                //     taskProcess:"7/10",
                //     endTime:"2018-05-13",
                // }
            ],
            loadBarData: false
        };
    },
    computed: {
        inspectionTableData() {
            return {
                columns: this.columns,
                data: this.inspectionData
            };
        },
        maintenanceTableData() {
            return {
                columns: this.columns,
                data: this.maintenanceData
            };
        },
        kldPieOption() {
            return {
                color: ["#82c4a0", "#50ba73", "#30aea0", "#5ab79c", "#2d6274"],
                title: {
                    subtext: "总计",
                    subtextStyle: {
                        align: "center",
                        fontSize: 16
                    },
                    text: this.EMDatas.pieData.reduce((p, c) => ({
                        value: p.value + c.value
                    })).value,
                    x: "center",
                    top: "70",
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 30,
                        color: "#000"
                    }
                },
                legend: {
                    orient: "vertical",
                    right: "0px",
                    y: "center",
                    selectedMode: false
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        center: ["center", "center"],
                        name: "设备计量",
                        type: "pie",
                        radius: ["60%", "80%"],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            }
                        },
                        data: this.EMDatas.pieData
                    }
                ]
            };
        }
    },
    filters: {
        //第一栏过滤器
        LOFormat(data) {
            return +data ? data : 0;
        }
    },
    methods: {
        // initEchart() {
        //     this.myChart = echarts.init(this.barDom);
        //     this.myChart.setOption(this.echartsData);
        // },

        getTab(name) {
            if (name === this.currentName) {
                return;
            }
            console.log(name);
            this.currentName = name;
        },
        //首页数据
        getDatas() {
            //第一栏数据
            this.$axios
                .get("/statistical/getItem")
                .then(res => {
                    this.lineOneData = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
            //计量统计
            this.$axios
                .get("/statistical/measurementStatistical")
                .then(res => {
                    this.EMDatas = this.EMDatasFormat(res.data);
                })
                .catch(error => {
                    console.log(error);
                });
            //柱状图数据
            this.$axios
                .post("/pmMaintenance/getOneLog", {
                    limit: 10,
                    offset: 0,
                    params: {}
                })
                .then(
                    res => {
                        let data = res.data.data;
                        if (data.length === 0) {
                            this.echartsData = false;
                            return;
                        }
                        let lastNoCount = data.map(v => v.lastNoCount);
                        let lastCount = data.map(v => v.lastCount);
                        let departmenInfo = data.map(v => v.departmentName);
                        this.echartsData = {
                            tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                    // 坐标轴指示器，坐标轴触发有效
                                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            legend: {
                                data: ["已执行", "未执行"],
                                right: "5%",
                                selectedMode: false
                            },
                            grid: {
                                left: "3%",
                                right: "4%",
                                bottom: "3%",
                                containLabel: true
                            },
                            xAxis: {
                                splitLine: { show: false },
                                type: "category",
                                axisLabel: {
                                    interval: 0 //强制显示所有的x轴坐标（类目名）
                                },
                                data: departmenInfo
                            },
                            yAxis: {
                                splitLine: { show: false },
                                type: "value",
                                name: "数量（次）"
                            },
                            series: [
                                {
                                    name: "已执行",
                                    type: "bar",
                                    stack: "总量",
                                    data: lastCount
                                },
                                {
                                    name: "未执行",
                                    type: "bar",
                                    stack: "总量",
                                    barMaxWidth: 100,
                                    data: lastNoCount
                                }
                            ],
                            color: ["#9acbd2", "#e7485a"]
                        };
                        this.loadBarData = true;
                    },
                    error => {
                        this.echartsData = false;
                    }
                );
            //巡检保养数据
            this.$axios.get("/statistical/executionProgress").then(
                ({ data: { inspection, maintenance } }) => {
                    this.inspectionData = inspection.map(v => {
                        // console.log(v.num,v.totality,"=========>巡检")
                        return {
                            name: v.uName || "暂无",
                            taskName: v.sName || "暂无",
                            taskProcess:
                                this.isUndefined(v.num) ||
                                this.isUndefined(v.totality)
                                    ? "暂无"
                                    : `${v.num}/${v.totality}`,
                            endTime: v.endTime ? v.endTime.slice(0, 10) : "暂无"
                        };
                    });
                    this.maintenanceData = maintenance.map(v => {
                        // console.log(v.endTime,"==========>保养")
                        return {
                            name: v.uName || "暂无",
                            taskName: v.sName || "暂无",
                            taskProcess:
                                this.isUndefined(v.num) ||
                                this.isUndefined(v.totality)
                                    ? "暂无"
                                    : `${v.num}/${v.totality}`,
                            endTime: v.endTime ? v.endTime.slice(0, 10) : "暂无"
                        };
                    });
                },
                error => {
                    console.log(error);
                }
            );
        },
        isUndefined(temp) {
            return temp === undefined || temp === null;
        },
        //饼图数据格式化
        EMDatasFormat(data) {
            let arr = ["强检设备", "非强检设备", "院内计量设备"];
            if (data.length === 0 || data.length === 1) {
                return {
                    low: data.filter(v => v.low !== undefined)[0].count,
                    pieData: [{ value: 0, name: "暂无数据" }]
                };
            } else {
                return {
                    low: data.filter(v => v.low !== undefined)[0].count,
                    pieData: data
                        .filter(v => v.low === undefined && v.mtType < 2)
                        .map(v => ({
                            value: +v.count,
                            name: arr[v.mtType]
                        }))
                };
            }
        },
        skipDetail(limit, route) {
            if (limit) {
                this.$router.push(route);
            }
        }
    },
    components: {
        kldEcharts
    },
    mounted() {
        this.getDatas();
    }
};
</script>

<style lang="less">
.qc-chief-wrap {
    width: 100%;
    min-width: 900px;
    margin: 40px auto 0;
    @left: 14%;
    @center: 1%;
    @sameHeight: 905px;

    .ep-task {
        float: left;
        margin-right: @center;
        width: @left;
        height: @sameHeight;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        box-sizing: border-box;

        .task-total {
            width: 100%;
            height: 42px;
            background-color: #459ca2;
            border-radius: 3px 3px 0px 0px;
            padding-left: 10px;

            font-size: 16px;
            line-height: 42px;
            color: #fafafa;
        }
        .task-list {
            ul {
                .caption {
                    display: flex;
                    align-items: center;
                    height: 42px;
                    background-color: rgba(208, 208, 208, 0.5);
                    div {
                        width: 18px;
                        height: 18px;
                        margin: 0 10px;
                    }
                    h3 {
                        font-size: 14px;
                        color: #020e0f;
                    }
                }
                li {
                    display: flex;
                    align-items: center;
                    height: 42px;
                    background-color: #fafafa;

                    font-size: 14px;
                    color: #666666;
                    cursor: pointer;
                    div {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: #459ca2;
                        margin-left: 25px;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
    .data-show-wrap {
        float: left;
        height: @sameHeight;
        width: 100% - @center - @left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .digital-data {
            height: 146px;
            display: flex;
            justify-content: space-between;
            .digital-detail {
                width: (100%-2%)/5;
                height: 100%;
                background-color: #ffffff;
                border-radius: 3px;
                padding: 20px 30px;
                cursor: pointer;
                .digital-type {
                    display: flex;
                    align-items: center;
                    .digital-icon {
                        width: 32px;
                        height: 32px;
                        margin-top: -7px;
                        flex-shrink: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .digital-title {
                        flex-grow: 1;
                        padding-left: 10px;
                        p {
                            font-size: 14px;
                            color: #666666;
                            width: 90%;
                        }
                        span {
                            font-size: 14px;
                            color: #a9a8a9;
                        }
                    }
                }
                .digital-count {
                    font-size: 50px;
                    color: #0c8399;
                    text-align: center;
                }
            }
        }
        .bar-graph {
            height: 355px;
            background-color: #fafafa;
            border-radius: 3px;
            overflow: hidden;
            .canvas-wrap {
                width: 100%;
                height: 300px;
                margin: 0 auto;
                // display: flex;
                // justify-content: center;
            }
            .canvas-noData {
                height: 300px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
            }
        }
        .c-footer {
            height: 366px;
            display: flex;
            flex-direction: row;
            position: relative;
            .measurement {
                flex-shrink: 0;
                width: 423px;
                height: 366px;
                background-color: #fafafa;
                border-radius: 3px;
                margin-right: 10px;
                display: flex;
                flex-direction: column;
                .measurement-chart {
                    width: 100%;
                    flex-grow: 1;
                    .measurement-title {
                        font-size: 14px;
                        color: #000000;
                        font-weight: bold;
                        margin: 10px;
                    }
                    .measurement-title-normal {
                        position: absolute;
                    }
                    .low-m {
                        .low-total {
                            font-size: 30px;
                            font-weight: bold;
                            color: #0c8399;
                            margin-left: 10px;
                            margin-top: 15px;
                            padding-left: 5px;
                            span {
                                font-size: 14px;
                                color: #666666;
                                display: inline-block;
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
            .c-process {
                position: absolute;
                left: 433px;
                right: 0;
                top: 0;
                height: 366px;
                background-color: #fafafa;
                border-radius: 3px;
                display: flex;
                flex-direction: column;
                .process-table {
                    width: 100%;
                    flex-grow: 1;
                    .ivu-table-body {
                        height: 236px;
                        overflow-x: hidden;
                    }
                }
            }
        }
    }
    .title {
        height: 55px;
        width: 100%;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        p {
            height: 30px;
            border-left: 4px solid #76bdc1;

            font-size: 16px;
            line-height: 30px;
            color: #020e0f;
            padding-left: 10px;
            span {
                color: #a9a8a9;
            }
        }
        > div {
            color: #459ca2;
            font-size: 14px;
            display: flex;
            align-items: center;
            cursor: pointer;
            i {
                display: inline-block;
                border-radius: 50%;
                width: 17px;
                height: 17px;
                background-color: #459ca2;
                color: #fff;
                text-align: center;
                line-height: 17px;
                font-size: 12px;
                margin-left: 10px;
            }
        }
    }
}
</style>

<template>
    <div>
        <div class="content">

            <div class="nav-title">
                <div class="nav-line"></div>
                <p style="cursor:pointer">首页</p>
            </div>
            <h2><img :src=' require("../../img//home.svg")'
                     class='home-icon' />控制台</h2>

            <div class="main">
                <div>
                    <div class="control-data">
                        <div class="data-left">
                            <div class="control-number number-top">
                                <div class="number-service top-block">
                                    <div class="service-left service-block">
                                        <span>
                                            <img :src="require('./image/maintain.png')"
                                                 alt="">
                                        </span>

                                    </div>
                                    <div class="service-right service-block">
                                        <p>
                                            正在维修中设备
                                        </p>
                                        <div>
                                            <number-animate @click.native='jump("FormService")'
                                                            :end='totalData.maintenanceCount'></number-animate>
                                            <!-- <span>
                                                {{totalData.maintenanceCount}}
                                            </span> -->
                                            <span>
                                                台
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div class='number-order top-block'>
                                    <div class="service-left service-block">
                                        <span>
                                            <img :src="require('./image/receiving.png')"
                                                 alt="">
                                        </span>

                                    </div>
                                    <div class="service-right service-block">
                                        <p>
                                            待接单
                                        </p>
                                        <div>
                                            <!-- <ICountUp :startVal="0" :endVal="totalData.orderCount" :duration="3" /> -->
                                            <number-animate @click.native='jump("FormWaiting")'
                                                            :end='totalData.orderCount'></number-animate>
                                            <!-- <span>
                                                {{totalData.orderCount}}
                                            </span> -->
                                            <span>
                                                单
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="control-number center-block">
                                <div class="center-left">
                                    <div>
                                        本月质控任务
                                    </div>
                                    <div>
                                        <!-- <ICountUp :startVal="0" :endVal="ControlData.oneCount" :duration="0" :option='{useEasing: true, useGrouping: true, }' /> -->
                                        <number-animate :end='ControlData.oneCount'
                                                        @click.native='jump("QS")'></number-animate>
                                        <!-- <span>{{ControlData.oneCount}}</span> -->
                                        <span>本月质控总数</span>
                                    </div>
                                </div>
                                <div class="center-right">
                                    <div class="center-right-data">
                                        <div>
                                            <p>一级保养(台)</p>
                                            <div @click="jump('one')">
                                                <span>{{ControlData.oneLogs}} /</span>
                                                <span>{{ControlData.oneCount}}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p>二级保养(台)</p>
                                            <div @click="jump('two')">
                                                <span>{{ControlData.maintenLogs}} /</span>
                                                <span>{{ControlData.maintenCount}}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p>三级保养(台)</p>
                                            <div @click="jump('three')">
                                                <span>{{ControlData.threeLogs}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="center-right-data">
                                        <div>
                                            <p>巡检任务（台）</p>
                                            <div @click="jump('IT')">
                                                <span>{{ControlData.inspLogs}} /</span>
                                                <span>{{ControlData.inspCount}}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p>计量（台）</p>
                                            <div @click="jump('EM')">
                                                <span>{{ControlData.measurLogs}} /</span>
                                                <span>{{ControlData.measurCount}}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p>不良事件（件）</p>
                                            <div @click="jump('AE')">
                                                <span>{{ControlData.monthEvent}} /</span>
                                                <span>{{ControlData.eventCount}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </div>
                            <div class="control-number aseet-number">
                                <div class="aseet-number-title">
                                    资产数据
                                </div>
                                <div class="aseet-number-content">
                                    <div>
                                        <p>在用设备</p>
                                        <div>
                                            <number-animate @click.native='jump("AssetUse")'
                                                            :end='assetData.inUseCount'></number-animate>

                                            <!-- <span>
                                                {{assetData.inUseCount}}
                                            </span> -->

                                            <span>
                                                台
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p>闲置设备</p>
                                        <div>
                                            <number-animate @click.native='jump("AssetAwait")'
                                                            :end='assetData.idleCount'></number-animate>

                                            <!-- <span>
                                                {{assetData.idleCount}}
                                            </span> -->

                                            <span>
                                                台
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p>备用设备</p>
                                        <div>
                                            <number-animate @click.native='jump("AssetPrepare")'
                                                            :end='assetData.standbyCount'></number-animate>

                                            <!-- <span>
                                                {{assetData.standbyCount}}
                                            </span> -->

                                            <span>
                                                台
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p>已报废设备</p>
                                        <div>
                                            <number-animate @click.native='jump("AssetScrap")'
                                                            :end='assetData.scrapCount'></number-animate>

                                            <!-- <span>
                                                {{assetData.scrapCount}}
                                            </span> -->

                                            <span>
                                                台
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="data-right">
                            <div class="meet">
                                <div class="meet-left">
                                    <img :src="require('./image/应急物资.png')"
                                         alt="">
                                </div>
                                <div class="meet-right">
                                    <div class="r-title">应急物资调用表</div>
                                    <router-link class="meet-more"
                                                 :to="{name: 'emergency-list'}">
                                        <span>查看更多</span>
                                        <img :src="require('../../common/kld-learn-more/images/查看更多.png')"
                                             alt="">
                                    </router-link>
                                </div>
                                <div class="meet-foot">
                                    <div>
                                        待用总台数：<span></span>
                                    </div>
                                    <div v-for="item in lifeEntryData">
                                        {{item.typeName}} <span>{{item.count}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="news">

                                <news-information></news-information>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="chart-bar">
                    <div class='bar-img brand-bar'>
                        <div class="brand-title">
                            <kld-title title='设备品牌维修率占比 TOP10'
                                       id='home-title'></kld-title>
                        </div>
                        <div class="bar-conent">
                            <kld-echarts :option='brandOpt'
                                         auto-resize
                                         v-if='brandData.length'></kld-echarts>
                            <div class="no-data"
                                 v-show='!brandData.length'>暂无数据</div>
                        </div>
                    </div>
                    <div class='bar-img asset-bar'>
                        <div class="brand-title">
                            <kld-title title='大型设备分布TOP10'
                                       id='home-title'></kld-title>
                        </div>
                        <div class="bar-conent">
                            <div class="bar-filtrate">
                                <div class="filtrate-radio">
                                    <RadioGroup v-model="seachData.radio">
                                        <Radio :label="10">
                                            <span>10万以上</span>
                                        </Radio>
                                        <Radio :label="50">
                                            <span>50万以上</span>
                                        </Radio>
                                    </RadioGroup>
                                </div>
                                &nbsp;&nbsp; &nbsp;&nbsp;
                                <div class="filtrate-input">
                                    <kld-input-number @on-blur="minBlur"
                                                      number
                                                      :min='0'
                                                      v-model="seachData.minInput"></kld-input-number>
                                    -
                                    <kld-input-number @on-blur="maxBlur"
                                                      number
                                                      :min='seachData.minInput===null||seachData.minInput===""?0:seachData.minInput'
                                                      v-model="seachData.maxInput"></kld-input-number>&nbsp;&nbsp;万元
                                </div>
                            </div>
                            <div style="width:100%;height:300px;"
                                 class="echarts-box">
                                <kld-echarts :option='assetOpt'
                                             auto-resize></kld-echarts>
                                <div v-show="!eqData.os_Name.length"
                                     class="eq-no-data">
                                    暂无数据
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Life-support">
                    <div class="Life-title">
                        <kld-title title='急救生命支持类保障数据'></kld-title>
                    </div>
                    <div class="Life-content">
                        <kld-echarts :option='lifeOpt'
                                     auto-resize
                                     v-if='lifeData.atName.length'></kld-echarts>

                        <div class="no-data"
                             v-show='!lifeData.atName.length'>暂无数据</div>
                    </div>
                </div>
                <div class="quality">
                    <div class="quality-title">
                        <kld-title title='质量控制'
                                   target='QS-chief-home'></kld-title>
                    </div>
                    <div class="quality-content">
                        <div class="quality-block">
                            <div class="quality-title">
                                不良事件类型统计
                            </div>
                            <div class="qulity-content">
                                <div class="pie-title">
                                    本月占比：
                                </div>
                                <div class="quality-pie">
                                    <kld-echarts :option='badOpt'
                                                 auto-resize>
                                    </kld-echarts>

                                </div>
                            </div>
                        </div>
                        <div class="quality-block">
                            <div class="quality-title">
                                日常保养
                            </div>
                            <div class="qulity-content"
                                 v-if="TopFive.length">
                                <div class="pie-title">
                                    本月占比：
                                </div>
                                <div class="quality-pie">
                                    <kld-echarts :option='everyOpt'
                                                 auto-resize></kld-echarts>

                                    <div>
                                        <ul class="topFive">
                                            <li>本月执行top5</li>
                                            <li class="textEllipsis"
                                                v-for="(item,i) in TopFive"
                                                :key='i+(+new Date())'>{{i+1+'、'+item.departmentName}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div v-else
                                 class="qulity-no-data">
                                暂无数据
                            </div>
                        </div>
                        <div class="quality-block">
                            <div class="quality-title">
                                设备计量-强检类
                            </div>
                            <div class="qulity-content">
                                <div class="pie-title">
                                    本月占比：
                                </div>
                                <div class="quality-pie">
                                    <kld-echarts :option='measureOpt'
                                                 auto-resize>
                                    </kld-echarts>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <doc-download></doc-download>
            </div>
        </div>
        <div class='QS-footer'>
            Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
        </div>
    </div>
</template>

<script>
//kld-input-number
import title from "@common/kld-learn-more/index.vue";
import tempOpt from "./bar-option"; //柱状图配置信息
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";
import portData from "./portData.js";
import down from "./doc-download/index";
import news from "./news-information/news-information";
import inputNumber from "@common/kld-input-number";
import numberTranstion from "@common/number-transtion/index.vue";
// import ICountUp from "vue-countup-v2";
export default {
    mixins: [portData], //异步获取的数据
    data() {
        return {
            tempOpt,
            seachData: {
                radio: 10,
                minInput: "",
                maxInput: ""
            },
            minNumber: 100000,
            maxINumber: null
        };
    },
    components: {
        [title.name]: title,
        kldEcharts,
        [down.name]: down,
        [news.name]: news,
        [inputNumber.name]: inputNumber,
        [numberTranstion.name]: numberTranstion
        // ICountUp
    },
    methods: {
        minBlur(value) {
            if (
                this.seachData.minInput !== null &&
                this.seachData.minInput !== ""
            ) {
                this.minNumber = this.seachData.minInput * 10000;
                this.seachData.radio = "";
                this.getEquipment();
            }
        },
        maxBlur(value) {
            if (
                this.seachData.maxInput !== null &&
                this.seachData.maxInput !== ""
            ) {
                this.maxINumber = this.seachData.maxInput * 10000;
                this.seachData.radio = "";
                this.getEquipment();
            }
        },
        jump(name) {
            switch (name) {
                case "FormService":
                    this.$router.push({
                        name: "singer-center",
                        params: {
                            frStatus: "1"
                        }
                    });
                    break;

                case "FormWaiting":
                    this.$router.push({
                        name: "singer-center",
                        params: {
                            repairType: "0"
                        }
                    });
                    break;
                case "QS":
                    this.$router.push({
                        name: "QS-chief-home"
                    });
                    break;
                case "AssetUse":
                    this.$router.push({
                        name: "asset-home",
                        query: {
                            used: "1"
                        }
                    });
                    break;
                case "AssetAwait":
                    this.$router.push({
                        name: "asset-home",
                        query: {
                            used: "0"
                        }
                    });
                    break;
                case "AssetPrepare":
                    this.$router.push({
                        name: "asset-home",
                        query: {
                            used: "3"
                        }
                    });
                    break;
                case "one":
                    this.$router.push({
                        name: "MaintenanceTask",
                        query: {
                            type: "1"
                        }
                    });
                    break;
                case "two":
                    this.$router.push({
                        name: "MaintenanceTask",
                        query: {
                            type: "2"
                        }
                    });
                    break;
                case "three":
                    this.$router.push({
                        name: "MaintenanceTask",
                        query: {
                            type: "3"
                        }
                    });
                    break;
                //name:"inspection-task-list"
                case "IT":
                    this.$router.push({
                        name: "inspection-task-list"
                    });
                    break;
                case "EM":
                    this.$router.push({
                        name: "QS-chief-home"
                    });
                    break;
                case "AE":
                    this.$router.push({
                        name: "adverse-event-list"
                    });
                    break;
            }
        }
    },
    watch: {
        "seachData.radio"(value) {
            if (value !== "") {
                this.minNumber = value * 10000;
                this.seachData.minInput = null;
                this.seachData.maxInput = null;
                this.maxINumber = null;
                this.getEquipment();
            }
            //replace(/[^\-?\d.]/g,'')
        }
    },
    computed: {
        brandOpt() {
            //let temp = tempOpt;
            let temp = JSON.parse(JSON.stringify(tempOpt));
            temp.yAxis[0].name = "维修率（%）";
            temp.color = ["#89d0d7"];
            let brandName = [];
            let brandCount = [];
            this.brandData.map(v => {
                if (v.brandName !== undefined && v.brandName !== null) {
                    brandName.push(v.brandName);
                }
                if (v.brandCount !== undefined && v.brandCount !== null) {
                    brandCount.push(v.brandCount - 0);
                }
            });
            brandCount = brandCount.sort((a, b) => {
                return b - a;
            });
            temp.xAxis[0].data = brandName;
            temp.series[0].data = brandCount;
            return temp;
        },
        assetOpt() {
            let temp_ = JSON.parse(JSON.stringify(tempOpt));
            temp_.color = ["#39bdcd"];
            temp_.yAxis[0].name = "设备（台）";
            temp_.series[0].name = "设备数量";
            temp_.yAxis[0].minInterval = 1;
            temp_.series[0].data = this.eqData.assetCount;
            temp_.xAxis[0].data = this.eqData.os_Name;

            return temp_;
        },
        lifeOpt() {
            let temp = JSON.parse(JSON.stringify(tempOpt));
            temp.yAxis[0].name = "设备（台）";
            temp.color = ["#2a81b9", "#61c9f6"];
            temp.grid.left = "4%";
            temp.xAxis[0].data = this.lifeData.atName;
            temp.legend = {
                data: ["备用", "待用"],
                top: 20,
                right: 20
            };
            temp.series = [
                {
                    name: "待用",
                    type: "bar",
                    stack: "总量",
                    barMaxWidth: 40,
                    data: this.lifeData.umAssetCount,
                    label: {
                        normal: {
                            show: true,
                            position: "inside"
                        }
                    }
                },
                {
                    name: "备用",
                    type: "bar",
                    stack: "总量",
                    barMaxWidth: 40,
                    data: this.lifeData.upAssetCount,
                    label: {
                        normal: {
                            show: true,
                            position: "inside"
                        }
                    }
                }
            ];
            return temp;
        },
        badOpt() {
            return {
                color: [
                    "#65c8d0",
                    "#37b9bc",
                    "#b1e1fa",
                    "#4ab8f4",
                    "#0d8fd6",
                    "#2177ae"
                ],
                legend: {
                    show: true,
                    orient: "orient",
                    top: 0,
                    right: 15,
                    width: 50,
                    formatter: obj => {
                        if (
                            typeof obj === "string" &&
                            obj.length > 7 &&
                            window.screen.width < 1792
                        ) {
                            return obj.substring(0, 7) + "...";
                        } else {
                            return obj;
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                series: [
                    {
                        center: ["28%", "50%"],
                        name: "不良事件",
                        type: "pie",
                        radius: ["70%", "90%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: "center",
                                formatter: `${this.badTotal}\n{x|不良事件总和}`,
                                rich: {
                                    x: {
                                        fontSize: 14,
                                        color: "#666666",
                                        lineHeight: 30
                                    }
                                },
                                fontSize: 20
                            },
                            emphasis: {
                                show: false,
                                fontSize: 20,
                                labelLine: {
                                    show: false
                                }
                            }
                        },

                        data: this.badData
                    }
                ]
            };
        },
        everyOpt() {
            return {
                color: ["#5ba4c8"],
                tooltip: {
                    show: false,
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                grid: {
                    left: "2%"
                },
                series: [
                    {
                        center: ["30%", "50%"],
                        name: "日常保养",
                        type: "pie",
                        radius: ["70%", "90%"],
                        data: this.everyData
                    }
                ]
            };
        },
        measureOpt() {
            return {
                color: ["#5ba4c8", "#8ad4d6"],
                legend: {
                    show: true,
                    orient: "orient",
                    top: 0,
                    right: 15,
                    width: 50,
                    formatter: obj => {
                        if (obj === "未计量") {
                            return (
                                obj + "：" + this.constraintData.unExecuteCount
                            );
                        }
                        if (obj === "已计量") {
                            return (
                                obj + "：" + this.constraintData.executeCount
                            );
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                series: [
                    {
                        center: ["40%", "50%"],
                        name: "强检类",
                        type: "pie",
                        radius: ["70%", "90%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: "center",
                                formatter: `${
                                    this.constraintData.measurementCount
                                }\n{x|应计量总和}`,
                                rich: {
                                    x: {
                                        fontSize: 14,
                                        color: "#666666",
                                        lineHeight: 30
                                    }
                                },
                                fontSize: 20
                            },
                            emphasis: {
                                show: false,
                                fontSize: 20,
                                labelLine: {
                                    show: false
                                }
                            }
                        },

                        data: this.constraint
                    }
                ]
            };
        }
    },
    beforeRouteEnter(to, from, next) {
        next(v => {
            if (v.$store.state.user_in.roles[0].srName !== "CHIEF") {
                next({ name: "Engineer-Doctor-Home" });
            } else {
                next();
            }
        });
    }
};
</script>

<style scoped lang="less">
@import url("./less/home");
/deep/#home-title {
    .learn-more {
        display: none;
    }
}
</style>
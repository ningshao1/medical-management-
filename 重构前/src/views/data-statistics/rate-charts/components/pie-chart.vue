<template>

    <div class="pie-chart-wrap">
        <div class="pie-content">
            <kld-echarts
                :option="option"
                ref="kld-echarts"
                v-bind="$attrs"
            ></kld-echarts>

        </div>
        <i-row class="pie-bar">
            <i-col
                v-for="(percent,name) of chartDataObj"
                :key="name"
                :span="12"
            >
                <i-row>
                    <i-col
                        :span="14"
                        v-ellipsis-tooltip.native="name"
                    >
                        {{name}}：
                    </i-col>
                    <i-col :span="10">{{percent}}%</i-col>
                </i-row>
            </i-col>
        </i-row>
    </div>
</template>
<script>
import kldEcharts from "@common/kld-echarts";
export default {
    name: "pie-chart",
    components: { kldEcharts },
    props: {
        chartData: {
            default() {
                return [];
            }
        },
        currentBar:{
            default(){
                return {name:''}
            }
        }
    },
    data() {
        return {};
    },
    methods: {
        queryHighLight({ dataIndex, name }, seriesIndex = 0) {
            this.$refs["kld-echarts"].myChart.dispatchAction({
                type: "highlight",
                seriesIndex,
                dataIndex,
                name
            });
        },
        queryDownplay({ dataIndex, name }, seriesIndex = 0) {
            this.$refs["kld-echarts"].myChart.dispatchAction({
                type: "downplay",
                seriesIndex,
                dataIndex,
                name
            });
        }
    },
    computed: {
        pieTotal() {
            return this.chartData.length
                ? this.chartData.reduce((pre, { value }) => {
                      return value + pre;
                  }, 0)
                : 0;
        },
        chartDataObj() {
            return this.chartData.reduce((pre, { name }) => {
                pre[name] = null;
                return pre;
            }, {});
        },
        option() {
            const circlePoint = ["50%", "50%"];
            const mainMin = 50;
            const mainMax = 60;
            const getRadius = (min, max) => {
                return [`${min}%`, `${max}%`];
            };
            const concentricCircleSeries={
                type: "pie",
                center: circlePoint,
                data: [0],
                itemStyle:{
                    color:"#dddee1",
                },
                silent:true,
                label: {
                    normal:{
                        show:false
                    }
                },
                animation:false
            }

            return {
                color: [
                    "#326b9a",
                    "#387db6",
                    "#4490ce",
                    "#539ddb",
                    "#62afee",
                    "#7abef6",
                    "#9bd0fb",
                    "#b7dbf9"
                ],
                title: {
                    text: "分类中品牌占比",
                    left: "left",
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 400
                    },
                    left: 20,
                    top: 10
                },
                tooltip: {
                    trigger: "item",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "none" // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: ({name,percent}) => {
                        return `<span style="font-size:16px;">${this.currentBar.name}</span>
                        <br/>
                        <span>品牌：</span><span>${name}</span>
                        <br/>
                        <span>占比：</span><span>${percent}%</span>
                        `;
                    }
                },
                series: [
                    {
                        ...concentricCircleSeries,
                        radius: getRadius(mainMin - 10, mainMin - 9),
                    },
                    {
                        ...concentricCircleSeries,
                        radius: getRadius(mainMax + 9, mainMax + 10),
                    },
                    {
                        type: "pie",
                        radius: getRadius(mainMin, mainMax),
                        center: circlePoint,
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: "center",
                                textStyle: {
                                    fontSize: "15"
                                },
                                formatter: ({ name, percent }) => {
                                    for (let key in this.chartDataObj) {
                                        if (key === name) {
                                            this.chartDataObj[key] = percent;
                                        }
                                    }
                                    this.$forceUpdate();
                                    return this.currentBar.name;
                                }
                            }
                        },
                        labelLine: {
                            show: false
                        },

                        data: this.chartData
                    }
                ]
            };
        }
    }
};
</script>

<style lang="less" scoped>
.pie-chart-wrap {
    height: 100%;
    .pie-content {
        height: 250px;
    }
    .pie-bar {
        height: calc(100% - 250px);
        padding: 3px 10px;
        overflow: auto;
        user-select: none;
    }
}
</style>



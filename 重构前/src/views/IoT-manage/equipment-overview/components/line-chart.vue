<template>
    <kld-echarts :option="option"
                 v-bind="$attrs"
                 auto-resize
                 v-on="$listeners"
                 ref="kld-echarts"></kld-echarts>
</template>

<script>
// import echarts from "echarts/lib/echarts";
import kldEcharts from "@common/kld-echarts";
export default {
    name: "line-chart",
    components: { kldEcharts },
    props: {
        chartData: {
            default() {
                return [];
            }
        },
        yAxisName: {
            default: "设备偏差"
        },
    },
    data() {
        return {};
    },
    computed: {
        option() {
            return {
                color: "#3ba1f4", // 0% 处的颜色
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: this.chartData.map(v => v.month),
                    axisLabel: {
                        interval: 0
                    }
                },
                yAxis: {
                    type: "value",
                    name: "(%)"
                },
                tooltip: {
                    trigger: "axis",
                    formatter: `日 期：{b}<br />${this.yAxisName}：{c}%`
                },
                grid: {
                    left: "2%",
                    right: "3%",
                    bottom: "3%",
                    top: "12%",
                    containLabel: true
                },
                series: [
                    {
                        data: this.chartData.map(v => v.usedRate),
                        type: "line",
                        areaStyle: {
                            //区域填充样式
                            normal: {
                                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                                color: {
                                    type: "linear",
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: "#3ba1f4" // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: "rgb(59, 161, 244,0)" // 100% 处的颜色
                                        }
                                    ],
                                    globalCoord: false // 缺省为 false
                                }
                            }
                        }
                    }
                ],

            };
        },

    },
    methods: {
        clickHandler(...arg) {
            this.$emit('click', ...arg);
        }
    }
};
</script>

<style lang="less" scoped>
</style>

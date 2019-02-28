<template>
    <div class="line-chart-wrap">
        <div class="line-bar">
            <div class="bar-title">生命支持类设备分类维修率</div>
            <div>
            </div>
        </div>
        <div class="line-content">
            <kld-echarts
                :option="option"
                v-bind="$attrs"
                v-on="$listeners"
            >
            </kld-echarts>
        </div>

    </div>
</template>
<script>
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
        currentBar:{
            default:0
        }
    },
    data() {
        return {};
    },
    computed: {
        option() {
            return {
                color: ["#3398DB"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "none" // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: ([first,
                        {
                            data: { value },
                            marker,
                            axisValue,
                            seriesName
                        }
                    ]) => {
                        return `<span>${axisValue}</span>
                        <br/>
                        ${marker}${seriesName}:${this.percentFormat(value)}
                        `;
                    }
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    top: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: this.chartData.map(({ name }) => name),
                        silent: true,
                        axisTick: {
                            show: false
                        }
                    },
                    {
                        show: false,
                        data: this.chartData.map(({ name }) => name),
                        silent: true,
                    },
                    {
                        show:false,
                        data: this.chartData.map(({ name }) => name),
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        max: 1,
                        axisLabel: {
                            formatter: value => {
                                return this.percentFormat(value);
                            }
                        }
                    }
                ],
                series: [
                    {
                        xAxisIndex: 1,
                        silent: true,
                        name: "维修率",
                        type: "bar",
                        barWidth: 50,
                        data: this.chartData.map((data, i) => {
                            return {
                                ...data,
                                value: 1,
                                itemStyle: {
                                    color: i === this.currentBar ? "rgba(0, 0, 0, 0.08)" : "transparent"
                                }
                            };
                        })
                    },
                    {
                        name: "维修率",
                        xAxisIndex: 2,
                        type: "bar",
                        barWidth: 30,
                        data: this.chartData,
                        label: {
                            formatter: ({ value }) => this.percentFormat(value),
                            show: true,
                            position: "top"
                        }
                    }
                ]
            };
        }
    },
    methods: {
        percentFormat(value) {
            return `${Math.round(value * 100 * 100) / 100}%`;
        }
    }
};
</script>
<style lang="less" scoped>
.line-chart-wrap {
    height: 100%;
    .line-bar {
        height: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        .bar-title {
            color: #000;
            font-size: 14px;
        }
    }
    .line-content {
        height: calc(100% - 50px);
    }
}
</style>



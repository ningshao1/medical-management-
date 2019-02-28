<template>
    <div class="pie-wrap">
        <div class="chart-floor">
            <kld-eacharts :option="option"
                          @mouseover="pieMouseover"
                          @mouseout="pieMouseout"
                          @highlight="highlight"
                          @downplay="downplay"
                          @resized="resized"
                          ref="kld-echarts"
                          :throttling="false"
                          autoResize></kld-eacharts>
            <div class="view-text"
                 :style="viewInfo.style">
                {{viewInfo.text}}
            </div>
        </div>
        <div class="statistics-floor">
            <div v-for="(v,i) of viewStatistics"
                 :class="v.class||'single-statistics'"
                 :key="v.key">
                <p class='num-count'>{{v.count}}</p>
                <p class="hospital-address">{{v.label}}</p>
            </div>

        </div>

    </div>
</template>
<script>
import kldEacharts from "@common/kld-echarts";
import titleFloor from "./title-floor.vue";
export default {
    name: "pie-wrap",
    components: { kldEacharts, titleFloor },
    props: {
        type: {
            default: 1
        },
        chartColors: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            statistics: {
                bb: {
                    key: "bb",
                    label: "本部院区",
                    count: "--"
                },
                yy: {
                    key: "yy",
                    label: "友谊院区",
                    count: "--"
                },
                gr: {
                    key: "gr",
                    label: "广仁院区",
                    count: "--"
                }
            },
            maxData: null,
            viewInfo: {
                text: "",
                style: {
                    color: ""
                }
            }
        };
    },
    created() {
        this.loadCountInternetThings(this.type);
    },
    computed: {
        totalStatistics() {
            let count = Object.values(this.statistics).reduce(
                (pre, current) => {
                    return pre + current.count;
                },
                0
            );
            count = count === +count ? count : "--";
            return {
                key: "total",
                count,
                label: "总计",
                class: "total-statistics"
            };
        },
        viewStatistics() {
            return Object.assign(
                { total: this.totalStatistics },
                this.statistics
            );
        },
        statisticsForPie() {
            let total = Number(this.totalStatistics.count) || 0;
            let statisticsArray = Object.values(this.statistics);
            let lastIndex = statisticsArray.length - 1; //获得末尾索引
            let calculatePercentage = this.calculate();
            statisticsArray = statisticsArray
                .reverse()
                .map((item, i) => {
                    let { count } = item;
                    let value = Number(count) || 0;
                    let legendPercentage = total === 0 ? 0 : value / total;
                    return {
                        ...item,
                        value,
                        legendPercentage: calculatePercentage(
                            legendPercentage,
                            i,
                            lastIndex
                        )
                    };
                })
                .reverse();
            let max = Math.max(
                ...statisticsArray.map(
                    ({ legendPercentage }) => legendPercentage
                )
            );

            let isSelectShow = false;
            let show;
            return statisticsArray.map(
                ({ label, key, value, legendPercentage }, i) => {
                    //显示第一个最大值
                    if (!isSelectShow) {
                        show = isSelectShow = legendPercentage === max;
                    } else {
                        show = false;
                    }
                    if (show) {
                        this.setHighLight({ dataIndex: i, name: label });
                    }
                    return {
                        value,
                        name: label,
                        legendPercentage
                    };
                }
            );
        },
        option() {
            let insideRadius = 60;
            let gap = 10;
            let outsideRadius = insideRadius + gap;

            let temp = {
                legend: {
                    orient: "vertical",
                    right: "25%",
                    top: "middle",
                    itemGap: 25,
                    data: this.statisticsForPie.map(({ name }) => ({
                        name,
                        icon: "none"
                    })),
                    formatter: name => {
                        let legendPercentage = this.statisticsForPie.find(
                            v => v.name === name
                        ).legendPercentage;
                        return `${name}：${legendPercentage}%`;
                    },
                    textStyle: {
                        color: "rgba(0,0,0,0.6)"
                    }
                },
                series: [
                    {
                        type: "pie",
                        radius: [`${insideRadius}%`, `${outsideRadius}%`],
                        color: this.chartColors,
                        center: ["25%", "50%"],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: "center"
                            },
                            emphasis: {
                                show: false,
                                formatter: "{d}%",
                                fontSize: 18
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        data: this.statisticsForPie
                    }
                ]
            };

            return temp;
        }
    },
    methods: {
        async loadCountInternetThings(type) {
            this.loading = true;
            try {
                const { data } = await this.$axios.post(
                    `/internetThings/countInternetThings/${type}`
                );
                Object.keys(data).forEach(key => {
                    this.statistics[key].count = data[key];
                });
            } finally {
                this.loading = false;
            }
        },
        calculate() {
            let count = 0;
            return (legendPercentage, i, lastIndex) => {
                let current =
                    parseInt(Math.round(legendPercentage * 100 * 100)) / 100;
                let result =
                    i === lastIndex
                        ? count === 0 && current === 0
                            ? 0
                            : Number((100 - count).toFixed(2))
                        : current;
                count += current;
                return result;
            };
        },
        pieMouseover(arg) {
            const { dataIndex, seriesIndex } = arg;
            this.queryHighLight({ dataIndex }, seriesIndex);
        },
        pieMouseout() {
            this.queryHighLight(this.maxData);
        },
        highlight({ dataIndex, name, seriesName }) {
            this.setViewInfo(name, dataIndex);
            if (!this.maxData) {
                return;
            }
            if (seriesName) {
                if (this.maxData.name === name) {
                    return;
                }
                this.queryDownplay(this.maxData);
                return;
            }
            if (this.maxData.dataIndex === dataIndex) {
                return;
            }
            this.queryDownplay(this.maxData);
        },
        setViewInfo(name, dataIndex) {
            dataIndex = name
                ? this.statisticsForPie.findIndex(temp => temp.name === name)
                : dataIndex;
            this.viewInfo = {
                text: `${this.statisticsForPie[dataIndex].legendPercentage}%`,
                style: {
                    color: this.chartColors[dataIndex]
                }
            };
        },
        downplay({ seriesName }) {
            if (!seriesName) {
                return;
            }
            this.queryHighLight(this.maxData);
        },
        resized() {
            if (!this.$refs["kld-echarts"] || !this.maxData) {
                return;
            }

            this.queryHighLight(this.maxData);
        },
        setHighLight(dataInfo, seriesIndex = 0) {
            if (!this.$refs["kld-echarts"]) {
                return;
            }
            this.$nextTick(() => {
                this.queryHighLight(dataInfo, seriesIndex);
                this.$nextTick(() => {
                    this.maxData = dataInfo;
                });
            });
        },
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
    }
};
</script>
<style lang="less" scoped>
.pie-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .floor(@height) {
        width: 100%;
        height: @height;
    }
    @statistics-height: 63px;
    @chart-height: calc(100% - @statistics-height);
    @text-color: rgba(0, 0, 0, 0.78);
    .chart-floor {
        .floor(@chart-height);
        position: relative;
        .view-text {
            position: absolute;
            z-index: 1000;
            top: 50%;
            left: 25%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            font-weight: 900;
        }
    }
    .statistics-floor {
        .floor(@statistics-height);
        border-top: solid 1px #dce0e6;
        background-color: #f5f6fa;
        display: flex;
        align-items: center;
        .single-statistics {
            width: 100%/4;
            height: 50px;
            display: flex;
            flex-direction: column;
            padding: 3px 0;
            align-items: center;
            justify-content: space-between;
            .num-count {
                font-size: 16px;
                color: @text-color;
            }
            .hospital-address {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.38);
            }
        }
        .total-statistics {
            .single-statistics;
            border-right: 1px solid #dce0e6;
        }
    }
}
</style>



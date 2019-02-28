<template>
    <div class="bar-echarts fallout-chart">
        <div class="bar-title">
            全院门诊量与放射科检查量对比分析<span>（{{lastYear}}~{{currentYear}}年度）</span>
        </div>
        <div class="bar">
            <div class="pie-wrap">
                <div class="left-pie">
                    <kld-echarts :option="leftPieOption"
                                 :loading="leftPieLoading"
                                 auto-resize
                                 ref="left-pie"></kld-echarts>
                </div>
                <div class="right-pie">
                    <kld-echarts :option="rightPieOption"
                                 :loading="rightPieLoading"
                                 auto-resize
                                 ref="right-pie"></kld-echarts>
                </div>
            </div>
            <div class="line">
                <kld-echarts :option="lineOption"
                             :loading="lineLoading"
                             auto-resize
                             :no-data='!lineLoading&&!mzLineData.length&&!fsLineData.length'
                             ref="line"></kld-echarts>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.bar-echarts {
    width: 100%;
    background: #fff;
    .bar {
        height: 300px;
    }
}
.bar-title {
    background: #eaeaea;
    color: #333;
    font-size: 16px;
    line-height: 48px;
    padding-left: 10px;
    > span {
        color: #a7a7a7;
        font-size: 14px;
    }
}
.fallout-chart {
    .pie-wrap {
        display: flex;
        border-bottom: 1px dashed rgba(2, 31, 57, 0.1);
        .left-pie,
        .right-pie {
            width: 50%;
            height: 150px;
        }
    }
    .line {
        width: 100%;
        height: 150px;
    }
}
</style>

<script>
import KldEcharts from "@common/kld-echarts";

export default {
    name: "fallout-chart",
    components: { KldEcharts },
    data() {
        return {
            leftPieValue: 0,
            rightPieValue: 0,
            mzLineData: [],
            fsLineData: [],

            leftPieLoading: false,
            rightPieLoading: false,
            lineLoading: false,
            currentYear: new Date().getFullYear() - 1,
            lastYear: new Date().getFullYear() - 2,
        };
    },

    computed: {
        leftPieOption() {
            const leftPieValue = Number.isNaN(this.leftPieValue)
                    ? 1
                    : Number.isFinite(this.leftPieValue)
                    ? this.leftPieValue
                    : 1,
                fixedValue =
                    leftPieValue < 0 ? 0 : leftPieValue > 1 ? 1 : leftPieValue,
                placeholderValue = 1 - fixedValue;

            return {
                title: {
                    top: "center",
                    left: "50%",
                    textStyle: {
                        fontWeight: 400,
                        fontSize: 14,
                        color: "#333"
                    },
                    text: `${this.currentYear}年对比${this.lastYear}年\n门诊量同比增长`
                },
                series: [
                    {
                        type: "pie",
                        radius: ["70%", "80%"],
                        center: ["80px", "50%"],
                        hoverAnimation: false,
                        silent: true,
                        label: {
                            normal: {
                                position: "center"
                            }
                        },
                        data: [
                            {
                                value: placeholderValue,
                                tooltip: {
                                    show: false
                                },
                                itemStyle: {
                                    normal: {
                                        color: "#E0E3E9"
                                    }
                                }
                            },
                            {
                                value: fixedValue,
                                itemStyle: {
                                    normal: {
                                        color: "#176bf2"
                                    }
                                },
                                label: {
                                    formatter: `${(leftPieValue * 100).toFixed(
                                        2
                                    )}%`,
                                    textStyle: {
                                        fontSize: 20,
                                        color: "#176bf2"
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
        },
        rightPieOption() {
            const rightPieValue = Number.isNaN(this.rightPieValue)
                    ? 1
                    : Number.isFinite(this.rightPieValue)
                    ? this.rightPieValue
                    : 1,
                fixedValue =
                    rightPieValue < 0
                        ? 0
                        : rightPieValue > 1
                        ? 1
                        : rightPieValue,
                placeholderValue = 1 - fixedValue;

            return {
                title: {
                    top: "center",
                    left: "50%",
                    textStyle: {
                        fontWeight: 400,
                        fontSize: 14,
                        color: "#333"
                    },
                    text: `${this.currentYear}年对比${this.lastYear}年\n放射科工作量增幅`
                },
                series: [
                    {
                        type: "pie",
                        radius: ["70%", "80%"],
                        center: ["80px", "50%"],
                        hoverAnimation: false,
                        silent: true,
                        label: {
                            normal: {
                                position: "center"
                            }
                        },
                        data: [
                            {
                                value: placeholderValue,
                                tooltip: {
                                    show: false
                                },
                                itemStyle: {
                                    normal: {
                                        color: "#E0E3E9"
                                    }
                                }
                            },
                            {
                                value: fixedValue,
                                itemStyle: {
                                    normal: {
                                        color: "#85abc0"
                                    }
                                },
                                label: {
                                    formatter: `${(rightPieValue * 100).toFixed(
                                        2
                                    )}%`,
                                    textStyle: {
                                        fontSize: 20,
                                        color: "#85abc0"
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
        },
        lineOption() {
            return {
                color: ["#176bf2", "#85abc0"],
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["门诊同比增长", "放射科检查同比增长"],
                    right: 20
                },
                xAxis: {
                    type: "category",
                    data: this.mzLineData.map(({ month }) => month),
                    axisTick: {
                        // 坐标轴小标记
                        show: false // 属性show控制显示与否，默认不显示
                    }
                },
                yAxis: {
                    type: "value",
                    name: "增幅%",
                    nameTextStyle: {
                        verticalAlign: "bottom"
                    }
                },
                grid: {
                    left: "3%",
                    right: "2%",
                    bottom: "3%",
                    top: "20%",
                    containLabel: true
                },
                series: [
                    {
                        name: "门诊同比增长",
                        symbol: "circle",
                        data: this.mzLineData.map(({ value }) => value),
                        type: "line"
                    },
                    {
                        name: "放射科检查同比增长",
                        symbol: "circle",
                        data: this.fsLineData.map(({ value }) => value),
                        type: "line"
                    }
                ]
            };
        }
    },

    created() {
        this.getLeftPieData();
        this.getRightPieData();
        this.getLineData();
    },
    methods: {
        async getLeftPieData() {
            this.leftPieLoading = true;
            try {
                const {
                    data: { patientVolume, patientVolumeLast }
                } = await this.$axios.post("/cba/getMzYearOnYearGrowth", {
                    hospId: this.$store.state.user_in.osId
                });
                this.leftPieValue =
                    (patientVolume - patientVolumeLast) / patientVolume;
            } finally {
                this.leftPieLoading = false;
            }
        },
        async getRightPieData() {
            this.rightPieLoading = true;
            try {
                const {
                    data: { patientVolume, patientVolumeLast }
                } = await this.$axios.post("/cba/getFSKYearOnYearGrowth", {
                    hospId: this.$store.state.user_in.osId
                });
                this.rightPieValue =
                    (patientVolume - patientVolumeLast) / patientVolume;
            } finally {
                this.rightPieLoading = false;
            }
        },

        async getLineData() {
            this.lineLoading = true;
            try {
                const {
                        data: { mzLastYear, fsLastYear }
                    } = await this.$axios.post("/cba/getOnYearGrowthLine", {
                        hospId: this.$store.state.user_in.osId
                    }),
                    transform = ({
                        monthly: month,
                        patientVolumeBefore: before,
                        patientVolumeLast: last
                    }) => ({
                        month: `${month}月`,
                        value: (((last - before) / before) * 100).toFixed(2)
                    });

                this.mzLineData = mzLastYear.map(transform);
                this.fsLineData = fsLastYear.map(transform);
            } finally {
                this.lineLoading = false;
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs["left-pie"].nativeResize();
            this.$refs["right-pie"].nativeResize();
            this.$refs["line"].nativeResize();
        });
    }
};
</script>
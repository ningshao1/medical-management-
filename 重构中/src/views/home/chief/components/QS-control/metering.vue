<template>
    <div class="qs-common kld-badnewss mertering">
        <div class=" badness">
            <p class="common-title">设备计量-强检类</p>
            <span class="round-title">本月占比：</span>
            <span class="metering-all">计量总数：{{measurementCount}}</span>
            <kld-echarts auto-resize
                         :option='badOpt'>
            </kld-echarts>
        </div>
    </div>
</template>

<script>
import kldecharts from "@c/kld-echarts";
export default {
    name: "kldMetering",
    data() {
        return {
            measurementCount: 0,
            unExecuteCount: 0,
            executeCount: 0
        };
    },
    created() {
        this.getConstraint();
    },
    methods: {
        //计量信息
        getConstraint() {
            this.$axios
                .get(
                    `/statistical/measurementCount/${
                        this.$store.state.userInfo.osId
                    }`
                )
                .then(
                    ({
                        data: { executeCount, measurementCount, unExecuteCount }
                    }) => {
                        this.executeCount = executeCount;
                        this.measurementCount = measurementCount;
                        this.unExecuteCount = unExecuteCount;
                    }
                );
        }
    },
    components: {
        [kldecharts.name]: kldecharts
    },
    computed: {
        badOpt() {
            return {
                color: ["#93ccf4", "#599af3"],
                legend: {
                    show: true,
                    orient: "orient",
                    x: "right",
                    // bottom: 40,
                    top: "30%",
                    itemGap: 18,
                    formatter: a => {
                        if (a === "未计量")
                            return a + "：" + this.unExecuteCount;
                        else return a + "：" + this.executeCount;
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                series: [
                    {
                        center: ["40%", "50%"],
                        name: "设备计量",
                        type: "pie",
                        radius: ["40%", "55%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            //图形样式
                            normal: {
                                borderColor: "#ffffff",
                                borderWidth: 2
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: "center",
                                formatter: `{y|${
                                    this.measurementCount
                                }}\n{x|计量}`,
                                rich: {
                                    y: {
                                        color: "#4b74e0",
                                        fontSize: 14
                                    },
                                    x: {
                                        fontSize: 14,
                                        color: "#666666",
                                        lineHeight: 20
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

                        data: [
                            {
                                value: this.unExecuteCount,
                                name: "未计量"
                            },
                            { value: this.executeCount, name: "已计量" }
                        ]
                    }
                ]
            };
        }
    }
};
</script>

<style scoped lang="less">
@import url("./qs.common.less");
.metering-all {
    position: absolute;
    right: 30px;
    top: 25px;
}
.mertering {
    padding-right: 5%;
}
</style>

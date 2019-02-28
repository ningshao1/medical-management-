<template>
    <div class="qs-common kld-badnewss">
        <div class=" badness">
            <p class="common-title">不良事件类型统计</p>
            <span class="round-title">本月占比：</span>
            <kld-echarts auto-resize
                         :option='badOpt'
                         :loading='loading'
                         v-if="badData.length">
            </kld-echarts>
            <div class="no-data center"
                 v-else>
                暂无数据
            </div>
        </div>
    </div>
</template>

<script>
import kldecharts from "@c/kld-echarts";
const BADNESS_LIST = {
    6: { name: "其它" },
    5: { name: "需要内、外科治疗避免永久性损伤" },
    4: { name: "可能导致机体功能机构永久性损伤" },
    3: { name: "机体功能结构永久性损伤" },
    2: { name: "危及生命" },
    1: { name: "死亡" }
};
export default {
    name: "kldBadness",
    data() {
        return {
            badTotal: 0,
            badData: [],
            loading: false
        };
    },
    components: {
        [kldecharts.name]: kldecharts
    },
    computed: {
        badOpt() {
            return {
                color: [
                    "#36acca",
                    "#69cfe9",
                    "#9ed5ff",
                    "#599af3",
                    "#4b74e0",
                    "#3e61bb"
                ],
                legend: {
                    show: true,
                    orient: "orient",
                    x: "right",
                    itemGap: 18,
                    formatter: obj => {
                        if (
                            typeof obj === "string" &&
                            obj.length > 7 &&
                            document.body.clientWidth < 1792
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
                        center: ["40%", "50%"],
                        name: "不良事件",
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
                                formatter: `{y|${this.badTotal}}\n{x|件}`,
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

                        data: this.badData
                    }
                ]
            };
        }
    },
    created() {
        this.getBad();
    },
    methods: {
        getBad() {
            this.loading = true;
            this.$axios
                .get(`/statistical/adverseEventCount`)
                .then(({ data }) => {
                    if (data instanceof Array) {
                        const temp = [];
                        let total = 0;
                        data.map(v => {
                            if (
                                v.aeCount !== undefined &&
                                v.aeCount !== null &&
                                v.aeCount !== ""
                            ) {
                                total = v.aeCount - 0 + total;
                                temp.push({
                                    ...BADNESS_LIST[v.aeType],
                                    value: v.aeCount - 0
                                });
                            }
                        });
                        this.badTotal = total;
                        this.badData = temp;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style scoped lang="less">
@import url("./qs.common.less");
</style>

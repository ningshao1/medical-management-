<template>
    <div class="qs-common kld-badnewss everyday">
        <div class=" badness">
            <p class="common-title">日常保养</p>
            <span class="round-title">本月占比：</span>
            <kld-echarts auto-resize
                         :option='everyOpt'
                         :loading='loading'
                         v-if='topFive.length'>
            </kld-echarts>
            <div class="no-data center"
                 v-else>
                暂无数据
            </div>
            <div class="top-five"
                 v-if="topFive.length">
                <ul>
                    <li>本月执行top5</li>
                    <li v-for="(item,i) in topFive"
                        :key="i">{{i+1+'、'}}{{item.departmentName}}</li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import kldecharts from "@c/kld-echarts";
export default {
    name: "kldEverydata",
    data() {
        return {
            topFive: [],
            percentage: 0,
            loading: false
        };
    },
    components: {
        [kldecharts.name]: kldecharts
    },
    computed: {
        everyOpt() {
            return {
                color: ["#5ba4c8"],
                tooltip: {
                    show: false,
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                grid: {
                    left: "5%"
                },
                series: [
                    {
                        center: ["50%", "50%"],
                        name: "Pie3",
                        type: "pie",
                        clockWise: false,
                        avoidLabelOverlap: false,
                        radius: ["40%", "55%"],
                        hoverAnimation: false,
                        //图形样式
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                },
                                borderColor: "#ffffff",
                                borderWidth: 2
                            }
                        },
                        data: [
                            {
                                value: this.percentage,
                                name: "已保养占比",
                                label: {
                                    normal: {
                                        formatter: "{d}%",
                                        position: "center",
                                        show: true,
                                        hoverAnimation: false,

                                        textStyle: {
                                            fontSize: "20",
                                            fontWeight: "normal",
                                            color: "rgba(0, 0, 0, 0.65);"
                                        }
                                    }
                                }
                            },
                            {
                                value: 100 - this.percentage,
                                name: "未保养占比",
                                label: {
                                    show: false,
                                    emphasis: {
                                        show: false,
                                        fontSize: 20,
                                        color: "",
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                itemStyle: {
                                    show: false,
                                    normal: {
                                        color: "#cbcfd8", // 未完成的圆环的颜色
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    },
                                    emphasis: {
                                        color: "#cbcfd8" // 未完成的圆环的颜色
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
        }
    },
    created() {
        this.getEvery();
    },
    watch: {
        TopFive() {
        }
    },
    methods: {
        //获取日常保养
        getEvery() {
            this.loading = true;
            this.$axios
                .get(
                    `/statistical/oneLogCount/${
                        this.$store.state.userInfo.osId
                    }`
                )
                .then(({ data }) => {
                    console.log(data);
                    this.percentage = data.percentage * 100;
                    this.topFive = data.top5;
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
.everyday {
    padding-right: 2% !important;
}
.badness {
    position: relative;
    // max-width: 600px;
    .top-five {
        position: absolute;
        right: 20px;
        top: 0;
        li {
            padding: 3px 0;
            color: rgba(0, 0, 0, 0.65);
        }
    }
}
</style>

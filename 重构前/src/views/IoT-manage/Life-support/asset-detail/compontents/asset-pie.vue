<template>
    <div class="pie">
        <div class="pie-parent">
            <kld-echarts :option='option'></kld-echarts>
        </div>
        <div class="pie-time">
            <p>在用时间</p>
            <p> {{chooseDate(pieData.zyTime)}}</p>
        </div>
        <div class="pie-time">
            <p>待用时间</p>
            <p> {{chooseDate(pieData.dyTime)}}</p>
        </div>
        <div class="pie-time">
            <p>维修时间</p>
            <p> {{chooseDate(pieData.wxTime)}}</p>
        </div>
    </div>
</template>
<script>
import echarts from "@common/kld-echarts/index";
import chooseData from "@common/method/util";
export default {
    props: {
        data: { required: true }
    },
    name: "asset-pie",
    data() {
        return {};
    },
    components: {
        [echarts.name]: echarts
    },
    computed: {
        pieData() {
            if (this.data) return this.data;
            else return {};
        },
        option() {
            if (!this.data || Object.keys(this.data).length === 0) return {};
            return {
                color: ["#43aea8", "#a2cfde", "#d9dde1"],
                series: [
                    {
                        type: "pie",
                        radius: ["55%", "70%"],
                        center: ["50%", "50%"],
                        label: {
                            normal: {
                                position: "center"
                            }
                        },
                        data: [
                            {
                                value: this.pieData.zyTime || 0,
                                name: "在用时间",
                                label: {
                                    normal: {
                                        formatter: "{d} %",
                                        textStyle: {
                                            fontSize: 14,
                                            color: "#666666",
                                            padding: [20, 0, 0, 0, 0]
                                        }
                                    }
                                },
                                tooltip: {
                                    trigger: "item",
                                    formatter:
                                        "{a} <br/>计算公式:占比率=({b}/注销总数)*100%<br/> 吊销注销数 : {c}"
                                }
                            },
                            {
                                value: this.pieData.dyTime || 0,
                                name: "待用时间",
                                label: {
                                    normal: {
                                        formatter: "\n在用率",
                                        textStyle: {
                                            color: "#666",
                                            fontSize: 12,
                                            padding: [20, 0, 0, 0, 0]
                                        }
                                    }
                                }
                            },
                            {
                                value: this.pieData.wxTime || 0,
                                name: "维修时间",
                                label: {
                                    show: false
                                }
                            }
                        ]
                    }
                ]
            };
        }
    },
    methods: {
        chooseDate(time) {
            if (!time) return `0小时`;
            const data = /(^\d+)(\.?(\d+))?$/.exec(time);
            if (data === null) {
                return `0小时`;
            }
            if (data[3] === undefined || data[3] === "0") {
                return data[1] + `小时`;
            } else {
                return (
                    data[1] +
                    `小时` +
                    (parseFloat(data[2]) * 60).toFixed(2) +
                    `分钟`
                );
            }
        }
    }
};
</script>

<style lang="less" scoped>
.pie {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .pie-parent {
        height: 150px;
        width: 400px;
    }
    .pie-time {
        min-width: 200px;
        padding-left: 10px;
        width: 30%;
        margin-top: 30px;
        > p:nth-of-type(1) {
            color: #666666;
            font-size: 14px;
            padding-bottom: 5px;
        }
        > p:nth-of-type(2) {
            color: #000000;
            font-size: 14px;
        }
    }
    .pie-time:nth-of-type(2) {
        border-left: solid 3px #43aea8;
    }
    .pie-time:nth-of-type(3) {
        border-left: solid 3px #a2cfde;
    }
    .pie-time:nth-of-type(4) {
        border-left: solid 3px #d9dde1;
    }
}
</style>

<template>
    <div class="bar-echarts">
        <div class="bar-title">
            放射科大型设备工作量及收入对比分析<span>（{{new Date().getFullYear()-1}}年度）</span>
        </div>
        <div class="bar">
            <kld-echarts :option='options'
                         :autoResize='true'
                         :no-data='!loading&&!countData.length&&!InData.length'
                         :loading='loading'
                         ref='kld-echarts'></kld-echarts>
        </div>
    </div>
</template>
<script>
import barEchart from "@common/kld-echarts/kld-echarts";
// import { accMul } from "@common/method/util";
const assetName = ["CR", "CT", "DR", "MR"];
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {}
    try {
        m += s2.split(".")[1].length;
    } catch (e) {}
    return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
    );
}
export default {
    name: "bar-echarts",
    data() {
        return {
            countData: null,
            InData: null,
            loading: true
        };
    },
    components: {
        [barEchart.name]: barEchart
    },
    computed: {
        options() {
            return {
                color: ["#7EC2F3", "#95D098"],
                tooltip: {
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    data: ["检查量占比", "收入占比"],
                    right: 20
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: {
                    data: assetName
                },
                yAxis: {
                    type: "value",
                    name: "占比（%）"
                },
                series: [
                    {
                        name: "检查量占比",
                        type: "bar",
                        data: this.countData,
                        barMaxWidth: 50
                    },
                    {
                        name: "收入占比",
                        type: "bar",
                        data: this.InData,
                        barMaxWidth: 50
                    }
                ]
            };
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs["kld-echarts"].nativeResize();
        });
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.loading = true;
            this.$axios
                .post(`/cba/getFSKAnalysis`, {
                    hospId: this.$store.state.user_in.osId
                })
                .then(({ data }) => {
                    if (!Object.values(data).some(v => +v)) {
                        this.countData = [];
                        this.InData = [];
                        return;
                    }
                    const newArray = [];
                    const InArray = [];
                    assetName.forEach((v, i) => {
                        for (const key in data) {
                            if (
                                key.startsWith(v.toLowerCase()) &&
                                key.startsWith("CountProportion", v.length)
                            ) {
                                newArray.push(
                                    data[key] !== null
                                        ? accMul(data[key], 100)
                                        : 0
                                );
                            } else if (
                                key.startsWith(v.toLowerCase()) &&
                                key.startsWith("IncomeProportion", v.length)
                            ) {
                                InArray.push(
                                    data[key] !== null
                                        ? accMul(data[key], 100)
                                        : 0
                                );
                            }
                        }
                    });
                    this.countData = newArray;
                    this.InData = InArray;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
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
</style>



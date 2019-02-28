<template>
    <div class="bar-echarts">
        <div class="bar-title">
            全院科室累计收入对比 <span>（{{new Date().getFullYear()}}年度）</span>
        </div>
        <div class="all-title">
            <p>
                全院科室今年累计总收入（万元）：<span>{{allMoney/10000}}</span>
            </p>
        </div>
        <div class="bar">
            <kld-echarts :option='options'
                         :autoResize='true'
                         :loading='loading'
                         ref='kld-echarts'>
            </kld-echarts>
        </div>
    </div>
</template>
<script>
import barEchart from "@common/kld-echarts/kld-echarts";
export default {
    name: "all-office",
    data() {
        return {
            countData: null,
            InData: null,
            loading: false,
            facilityData: [],
            partsData: [],
            oldPartsData: [],
            allMoney: 0
        };
    },
    components: {
        [barEchart.name]: barEchart
    },
    computed: {
        options() {
            return {
                color: ["#abd39f", "#6A9C78"],
                tooltip: {
                    axisPointer: {
                        type: "shadow"
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "10%",
                    top: "12%",
                    containLabel: true
                },
                xAxis: {
                    data: this.facilityData,
                    axisLabel: {
                        formatter: value => {
                            if (typeof value === "string" && value.length > 5) {
                                return value.match(/.{5}|.+$/g).join("\n");
                            }
                            return value;
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    name: "万元"
                },
                series: [
                    {
                        name: "今年累计收入",
                        type: "bar",
                        data: this.partsData,
                        barMaxWidth: 50,
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        }
                    },
                    {
                        name: "去年累计收入",
                        type: "bar",
                        data: this.oldPartsData,
                        barMaxWidth: 50,
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        }
                    }
                ],
                dataZoom: [
                    {
                        show: this.facilityData.length > 10,
                        type: "slider",
                        startValue: 0,
                        endValue: 9,
                        height: 12,
                        fillerColor: "#b3b3b3",
                        backgroundColor: "#E0E0E0",
                        handleSize: 0,
                        bottom: 0,
                        showDataShadow: false,
                        showDetail: false
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
                .post(`cba/getGrossIncome`, {
                    hospId: this.$store.state.user_in.osId
                })
                .then(({ data: { newYearList, oldYearList } }) => {
                    oldYearList.map(e => {
                        const obj = newYearList.find(
                            v => v.sectionId === e.sectionId
                        );
                        if (obj) obj["oldGrossIncome"] = e.grossIncome;
                        else
                            newYearList.push({
                                sectionName: e.sectionName,
                                oldGrossIncome: e.grossIncome,
                                grossIncome: 0
                            });
                    });
                    const name = [],
                        money = [],
                        oldMoney = [];
                    var allMoney = 0;
                    newYearList.map(v => {
                        name.push(v.sectionName);

                        money.push(v.grossIncome ? v.grossIncome / 10000 : 0);
                        oldMoney.push(
                            v.oldGrossIncome ? v.oldGrossIncome / 10000 : 0
                        );
                        if (typeof v.grossIncome === "number")
                            allMoney += v.grossIncome;
                    });
                    this.partsData = money;
                    this.facilityData = name;
                    this.oldPartsData = oldMoney;
                    this.allMoney = allMoney;
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
.all-title {
    display: flex;
    justify-content: flex-end;
    > p {
        padding-right: 30px;
        font-size: 16px;
        margin-top: 10px;
        margin-bottom: 8px;
        span {
            color: #abd39f;
        }
    }
}
</style>



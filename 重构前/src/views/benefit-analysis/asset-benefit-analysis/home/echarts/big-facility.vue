<template>
    <div class="bar-echarts">
        <div class="bar-title">
            大型设备各部位诊断累计收入对比 <span>（{{new Date().getFullYear()}}年度）</span>
        </div>
        <div class="filter-select">
            <i-select>
                <i-option v-for="item in facilityData"
                          :label='item'
                          :value='item'
                          :key='item'>
                </i-option>
            </i-select>
            <i-select>
                <i-option v-for="item in partsData"
                          :label='item'
                          :value='item'
                          :key='item'>
                </i-option>
            </i-select>
        </div>
        <div class="bar">
            <kld-echarts :option='options'
                         :autoResize='true'
                         ref='kld-echarts'>
            </kld-echarts>
        </div>
    </div>
</template>
<script>
import barEchart from "@common/kld-echarts/kld-echarts";
export default {
    name: "big-facility",
    data() {
        return {
            countData: null,
            InData: null,
            loading: true,
            facilityData: Array.from({ length: 20 }, (v, k) => k),
            partsData: Array.from({ length: 20 }, (v, k) => k)
        };
    },
    components: {
        [barEchart.name]: barEchart
    },
    computed: {
        options() {
            return {
                color: ["#c5b3ce"],
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
                    data: Array.from(
                        { length: 20 },
                        (v, k) => "索引值是一个" + k
                    ),
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
                        name: "累计收入",
                        type: "bar",
                        data: Array.from({ length: 20 }, (v, k) => k),
                        barMaxWidth: 30,
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
        getData() {}
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
.filter-select {
    display: flex;
    justify-content: flex-end;
    > div {
        margin: 5px;
        width: 25%;
        min-width: 200px;
    }
}
</style>



<template>
    <div class="asset-trend"
         :style="{height:height+'px'}">
        <slot name='title'>

        </slot>
        <div class="no-data"
             v-if='!showTitle'>
            暂无数据
        </div>
        <kld-echarts :option='options'>

        </kld-echarts>

    </div>
</template>
<script>
import echarts from "@common/kld-echarts/index";
export default {
    name: "asset-trend",
    props: {
        data: {
            default() {
                return {
                    xData: [],
                    yData: []
                };
            },
            required: true
        },
        height: { default: 181 },
        zoom: {
            default: false
        },
        tooltip: {
            required: true
        }
    },
    data() {
        return {
            options: {}
        };
    },
    watch: {
        data: {
            handler() {
                this.options = {
                    color: ["#7bc2be"],
                    xAxis: {
                        type: "category",
                        data: this.data ? this.data.xData : []
                    },
                    tooltip: {
                        trigger: "axis",
                        formatter: `${
                            this.tooltip.xAxis
                        }：{b}<br />百分比：{c}${this.tooltip.yAxis}`
                    },
                    grid: {
                        left: "5%",
                        right: "10%",
                        bottom: "0%",
                        top: "5%",
                        bottom: "45%"
                    },
                    yAxis: [
                        {
                            type: "value",
                            show: true //显示纵轴false-不显示，true-显示
                        }
                    ],
                    series: [
                        {
                            data: this.data ? this.data.yData : [],
                            type: "line",
                            name: "百分比"
                        }
                    ],
                    dataZoom: [
                        {
                            show: this.zoom,
                            type: "slider",
                            startValue: 0,
                            endValue: 6,
                            height: 12,
                            fillerColor: "#b3b3b3",
                            backgroundColor: "#E0E0E0",
                            handleSize: 0,
                            bottom: 45,
                            showDataShadow: false,
                            showDetail: false
                        }
                    ]
                };
            },
            deep: true
        }
    },
    computed: {
        showTitle() {
            return this.data;
        }
    },
    components: {
        [echarts.name]: echarts
    }
};
</script>
<style lang="less" scoped>
.asset-trend {
    height: 181px;
    background: #fafafa;
    position: relative;
}
.no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate("-50%", "-50%");
}
</style>



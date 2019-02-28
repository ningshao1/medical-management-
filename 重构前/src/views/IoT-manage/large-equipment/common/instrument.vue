<template>
    <div class="instrument">
        <slot name='title'
              class="title"></slot>
        <kld-echarts :option='options' auto-resize></kld-echarts>
    </div>
</template>
<script>
import echarts from "@common/kld-echarts/index";
import echart from "echarts";
export default {
    name: "kld-instrument",
    props: {
        option: { required: true }
    },
    data() {
        return {};
    },
    components: {
        [echarts.name]: echarts
    },
    watch: {
        option: {
            handler(val) {
                this.options = {
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    series: [
                        {
                            type: "gauge",
                            center: ["50%", "50%"], // 默认全局居中
                            min: 0,
                            max: val.max,
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    // 属性lineStyle控制线条样式
                                    color: [
                                        [
                                            val.value / val.max,
                                            new echart.graphic.LinearGradient(
                                                1,
                                                1,
                                                0,
                                                1,
                                                [
                                                    {
                                                        offset: 0,
                                                        color: "#F67280"
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: "#C06C84"
                                                    }
                                                ]
                                            )
                                        ],
                                        [2, "#e1e1e1"]
                                    ],
                                    width: 20
                                }
                            },
                            splitLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                color: "#000",
                                show: true,
                                padding: [50, -30, -25, -20],
                                fontSize: 12,
                                distance: -20,
                                formatter(value) {
                                    if (value === 0 || value === val.max) {
                                        return value + val.units;
                                    }
                                }
                            },
                            pointer: {
                                show: false,
                                length: "0",
                                width: "0"
                            },
                            detail: {
                                formatter: data => {
                                    return data + val.units;
                                },
                                offsetCenter: [0, 0],
                                textStyle: {
                                    fontSize: 16
                                }
                            },
                            data: [
                                {
                                    value: val.value
                                }
                            ]
                        }
                    ]
                };
            },
            deep: true,
            immediate: true
        }
    }
};
</script>
<style>
.instrument {
    height: 200px;
}
.title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.78);
}
</style>

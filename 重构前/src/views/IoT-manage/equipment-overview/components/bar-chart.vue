<template>
    <div class="bar-chart-wrap">
        <kldEcharts :option='option'
                    autoResize
                    :no-data="!remoteData.length"></kldEcharts>
    </div>
</template>

<script>
import kldEcharts from "@common/kld-echarts";
export default {
    name: "bar-chart",
    components: { kldEcharts },
    data() {
        return {
            loading: false,
            remoteData: [
                //     {
                //         balance: 100,
                //         insepctfee: 110694884.21000671,
                //         ip: "192.168.1.102",
                //         jianChaC: 45,
                //         os_ID: "561990011768016896",
                //         os_Name: "消炎1室",
                //         pre: "7.5"
                //     },
            ],
            types: [
                {
                    key: "jianChaC",
                    name: "累计数",
                    color: "#459ca2"
                    // itemStyle:{}
                },
                {
                    key: "balance",
                    name: "平衡点",
                    color: "rgba(69,156,162,0.15)",
                    textColor: "#495060"
                    // itemStyle:{
                    //      borderColor: "#000",
                    //     borderWidth: 1,
                    //     borderType: "dashed"
                    // }
                }
            ]
        };
    },
    computed: {
        optionData() {
            return this.remoteData.map(({ balance, jianChaC, assetName }) => {
                return {
                    xAxis: assetName,
                    balance: Math.round(+balance),
                    jianChaC: Math.round(+jianChaC)
                };
            });
        },

        option() {
            return {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                    // formatter: "{b}<br/>{a2}：{c2}<br/>{a1}：{c1}"
                },
                legend: {
                    data: this.types.map(item => item.name).reverse(),
                    right: 50,
                    top: 5
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    top: "15%",
                    containLabel: true
                },
                yAxis: {
                    type: "value",
                    max: parseInt(
                        (Math.max(
                            ...this.optionData.reduce((pre, current) => {
                                this.types.forEach(({ key }) => {
                                    pre.push(current[key]);
                                });
                                return pre;
                            }, [])
                        ) +
                            1) *
                            1.3
                    ),
                    name: "(次)",
                    minInterval: 1
                },
                xAxis: {
                    type: "category",
                    axisLabel: {
                        interval: 0,
                        formatter: (value, index) => {
                            // console.log(value)
                            let maxLength = 6;
                            let result = "";
                            if (value) {
                                value.split("").forEach((v, i) => {
                                    result += !!((i + 1) % maxLength)
                                        ? v
                                        : v + "\n";
                                });
                            }
                            // console.log(result)
                            return result;
                        }
                    },
                    data: this.optionData.map(v => v.xAxis)
                },
                series: this.types.map(({ key, name, color, textColor }, i) => {
                    return {
                        name,
                        color,
                        type: "bar",
                        barWidth: 30,
                        label: {
                            normal: {
                                show: true,
                                color: textColor || color,
                                position: "top"
                            }
                        },
                        data: this.optionData.map(item => item[key])
                    };
                })
            };
        }
        // option() {
        //     return {
        //         tooltip: {
        //             trigger: "axis",
        //             axisPointer: {
        //                 type: "shadow"
        //             },
        //             formatter: "{b}<br/>{a2}：{c2}<br/>{a1}：{c1}"
        //         },
        //         legend: {
        //             data: this.types.map(item => item.name).reverse(),
        //             right: 50,
        //             top:5
        //         },
        //         grid: {
        //             left: "3%",
        //             right: "3%",
        //             bottom: "3%",
        //             top: "0%",
        //             containLabel: true
        //         },
        //         yAxis: {
        //             type: "value",
        //             max: "dataMax",
        //             name:"(次)",
        //             minInterval:1
        //         },
        //         xAxis: Array.from({ length: this.types.length + 1 }).map(
        //             (v, i) => ({
        //                 type: "category",
        //                 data: this.optionData.map(v => v.xAxis),
        //                 show: i === 0
        //             })
        //         ),
        //         series: [
        //             {
        //                 name: "背景",
        //                 color: "rgba(0,0,0,0.05)",
        //                 type: "bar",
        //                 xAxisIndex: 0,
        //                 barWidth: 30,
        //                 z: 1,
        //                 data: Array.from({
        //                     length: this.types.length + 1
        //                 }).fill(
        //                     parseInt((Math.max(
        //                         ...this.optionData.reduce((pre, current) => {
        //                             this.types.forEach(({ key }) => {
        //                                 pre.push(current[key]);
        //                             });
        //                             return pre;
        //                         }, [])
        //                     )+1)*1.5)
        //                 )
        //             },
        //             ...this.types.map(({ key, name, color, textColor,itemStyle }, i) => {
        //                 return {
        //                     name,
        //                     color,
        //                     type: "bar",
        //                     xAxisIndex: i + 1,
        //                     z: i + 1,
        //                     barWidth: 30,
        //                     label: {
        //                         normal: {
        //                             show: true,
        //                             color: textColor || color,
        //                             position: "top"
        //                         }
        //                     },
        //                     itemStyle,
        //                     data: this.optionData.map(item => item[key])
        //                 };
        //             })
        //         ]
        //     };
        // }
    },
    created() {
        this.loadCumulativeStatistics();
    },
    methods: {
        async loadCumulativeStatistics() {
            this.loading = true;
            try {
                const { data } = await this.$axios.get(
                    `internetThings/getCumulativeStatistics`
                );
                this.remoteData = data
                    ? data.filter(({ assetName }) => assetName)
                    : [];

                this.$emit("get-category-count", this.remoteData.length);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.bar-chart-wrap {
    width: 100%;
    height: 100%;
}
</style>

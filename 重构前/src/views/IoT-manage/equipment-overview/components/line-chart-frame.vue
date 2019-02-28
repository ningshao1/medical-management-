<template>
    <div class="line-chart-frame">
        <div class="text-view">
            <div v-for="(v,i) of this.textViewList"
                 :class="{'single-area':true,'area-active':v.area===currentArea}"
                 :key="i"
                 @click="toggleChart(v,i)">
                <div class="area-info">
                    {{v.title}}
                </div>
                <div class="count-info">
                    共{{v.count}}台
                </div>
                <div class="statistics-info">
                    <template v-if="v.chartData">

                        <span class="latest-statistics">
                            {{v.chartData|usedRate}}
                        </span>
                        <span :class='{
                            "statistics-rate":true,
                            "statistics-rate-plus":usedChangeRate(v.chartData),
                            "statistics-rate-minus":!usedChangeRate(v.chartData),
                            }'>
                            {{usedChangeRate(v.chartData,true)}}
                        </span>

                    </template>
                </div>
            </div>
        </div>
        <div class="chart-view">
            <line-chart :chart-data='chartData'
                        y-axis-name="使用率"
                        :no-data="!chartData.length"
                        :loading="!!loading"
                        auto-resize></line-chart>
        </div>
    </div>
</template>
<script>
import lineChart from "./line-chart";
export default {
    name: "line-chart-frame",
    components: { lineChart },
    data() {
        return {
            textViewMap: {
                bb: {
                    key: "bb",
                    title: "本部院区",
                    area: 1
                },
                yy: {
                    key: "yy",
                    title: "友谊院区",
                    area: 2
                },
                gr: {
                    key: "gr",
                    title: "广仁院区",
                    area: 3
                }
            },
            currentArea: 1,
            loading: 0,
            chartData: [],
            cancelToken: null
        };
    },
    created() {
        this.init();
    },
    computed: {
        textViewList() {
            return Object.values(this.textViewMap);
        }
    },
    filters: {
        usedRate(chartData) {
            return chartData.length
                ? `${chartData[chartData.length - 1].usedRate}%`
                : "0%";
        }
    },
    methods: {
        async init() {
            let { data: lifeData } = await this.loadLifeCount();
            this.textViewMap = Object.keys(this.textViewMap).reduce(
                (total, currentKey, i) => {
                    total[currentKey] = {
                        ...this.textViewList[i],
                        count: lifeData[currentKey]
                    };
                    return total;
                },
                {}
            );
            this.formatUsedRateChart(this.currentArea);
        },

        async loadAllUsedRateChart() {
            return await Promise.all(
                this.textViewList.map(({ area }) =>
                    this.loadUsedRateChart(area)
                )
            );
        },
        async formatUsedRateChart(area) {
            if (this.cancelToken) {
                this.cancelToken();
            }
            this.loading++;
            try {
                let { data } = await this.loadUsedRateChart(area);
                let array = Object.entries(data);
                this.chartData = array
                    .map((v, i) => {
                        let index = Number(v[0].replace(/^\d{4}-/, ""));
                        return {
                            index,
                            month: `${(index + "").padStart(2, "0")}月`,
                            usedRate: v[1]
                        };
                    })
                    .sort((pre, cur) => {
                        return pre.index - cur.index;
                    });
            } finally {
                this.loading--;
            }
        },
        loadUsedRateChart(area) {
            return this.$axios.post(
                `/internetThings/usedRateChart/${area}`,
                {},
                {
                    cancelToken: new this.$axios.CancelToken(c => {
                        this.cancelToken = c;
                    })
                }
            );
        },
        loadLifeCount() {
            return this.$axios.post(`/internetThings/countInternetThings/1`);
        },
        usedChangeRate(chartData, rate = false) {
            let len = chartData.length;
            if (!len) {
                return "+0%";
            }
            let latest = chartData[len - 1].usedRate;
            let previous = chartData[len - 2].usedRate;
            let difference = latest - previous;
            if (!rate) {
                return difference >= 0;
            }
            if (previous === 0) {
                if (latest === 0) {
                    return "+0%";
                }
                return "+100%";
            }
            let prefix = difference >= 0 ? "+" : "-";
            let absDifference = Math.abs(difference);
            return `${prefix}${(absDifference / previous).toFixed(2) * 100}%`;
        },
        toggleChart({area}, index) {
            if(area===this.currentArea){
                return;
            }
            this.currentArea = area;
            this.formatUsedRateChart(area);
        }
    }
};
</script>
<style lang="less" scoped>
.line-chart-frame {
    width: 100%;
    height: 100%;
    display: flex;
    @text-width: 140px;
    .text-view {
        width: @text-width;
        height: 100%;
        display: flex;
        flex-direction: column;
        .single-area {
            height: 100%/3;
            width: 100%;
            padding: 15px 0 15px 10px;
            border-bottom: 1px solid #c8ced3;
            border-left: 4px solid transparent;
            border-right: 1px solid #c8ced3;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            &.area-active {
                border-left: 4px solid #0c8399;
            }
            &:last-child {
                border-bottom: none;
            }
            .color-weight(@color) {
                font-weight: 600;
                color: @color;
            }
            .area-info {
                .color-weight(rgba(0, 0, 0, 0.38));
            }
            .count-info {
                .color-weight(rgba(0, 0, 0, 0.87));
            }
            .statistics-info {
                .latest-statistics {
                    .color-weight(rgba(0, 0, 0, 0.87));
                    margin-right: 10px;
                }
                .statistics-rate {
                    &.statistics-rate-plus {
                        color: #95d098;
                    }
                    &.statistics-rate-minus {
                        color: #dc8787;
                    }
                }
            }
        }
    }
    .chart-view {
        width: calc(100% - @text-width);
        height: 100%;
    }
}
</style>



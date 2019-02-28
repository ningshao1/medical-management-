<template>
    <div class="rate-charts-wrap">
        <div class="charts-wrap">
            <div class="line-wrap">
                <line-chart
                    :chart-data="lineChartData"
                    auto-resize
                    :loading="loading.line"
                    :current-bar="currentBar.dataIndex||0"
                    :no-data="!loading.line&&!lineChartData.length"
                    @click="barClick"
                ></line-chart>
                <div class="bar-date-picker">
                    <date-picker
                        type='year'
                        v-model="year"
                        format="统计时间 yyyy年"
                        :editable="false"
                        :clearable='false'
                    ></date-picker>
                </div>
            </div>
            <div class="pie-wrap">
                <pie-chart
                    :current-bar="currentBar"
                    :loading="loading.pie"
                    :no-data="!loading.pie&&!pieChartData.length"
                    :chart-data="pieChartData"
                ></pie-chart>
            </div>
        </div>
    </div>
</template>
<script>
import lineChart from "./components/line-chart.vue";
import pieChart from "./components/pie-chart.vue";
export default {
    name: "rate-charts",
    components: { lineChart, pieChart },
    data() {
        return {
            lineChartData: [],
            pieChartData: [],
            year: new Date(),
            loading: {
                line: false,
                pie: false
            },
            currentBar: {
                dataIndex: 0
            }
        };
    },
    computed: {
        yearFormat() {
            return this.year.getFullYear();
        }
    },
    created() {
        this.getLife(this.yearFormat);
    },
    methods: {
        async getLife(year) {
            this.loading.line = true;
            try {
                let { data } = await this.$axios.get(
                    `/faultReport/findFaultReportByAssetTypeStatistical/${year}`
                );

                if (!data.length) {
                    this.lineChartData = [];
                    this.pieChartData = [];
                    return;
                }
                this.lineChartData = data.map(
                    ({ assetTypeId, num, ratio: value, typeName: name }) => ({
                        assetTypeId,
                        num,
                        value,
                        name
                    })
                );
                this.currentBar = {
                    dataIndex: 0,
                    name:this.lineChartData[0].name
                };
                await this.getpie({ year, assetTypeId: data[0].assetTypeId });
                this.$forceUpdate()
            } finally {
                this.loading.line = false;
            }
        },
        async getpie({ year, assetTypeId }) {
            this.loading.pie = true;
            try {
                const { data } = await this.$axios.get(
                    `/faultReport/findAssetTypeStatistical/${year}/${assetTypeId}`
                );
                this.pieChartData = data
                    .filter(({ brandName, count }) => brandName && count)
                    .map(({ count: value, brandName: name }) => ({
                        value: +value,
                        name
                    }));
                return true;
            } finally {
                this.loading.pie = false;
            }
        },
        barClick(arg) {
            const {
                data: { assetTypeId },
                dataIndex,
                name
            } = arg;
            this.currentBar = {dataIndex,name};
            this.getpie({ year: this.yearFormat, assetTypeId });
        }
    },
    watch: {
        year() {
            this.getLife(this.yearFormat);
        }
    }
};
</script>

<style lang="less" scoped>
.rate-charts-wrap {
    .charts-wrap {
        width: 100%;
        height: 400px;
        display: flex;
        justify-content: space-between;
        @pie-width: 350px;
        @cell: 10px;
        @line-width: calc(100% - @pie-width - @cell);
        .chart-wrap(@width) {
            width: @width;
            height: 100%;
            border: 1px solid #dddee1;
            background-color: #fff;
        }
        .line-wrap {
            .chart-wrap(@line-width);
            position: relative;
            .bar-date-picker {
                position: absolute;
                top: 10px;
                right: 20px;
                z-index: 10000;
            }
        }
        .pie-wrap {
            .chart-wrap(@pie-width);
        }
    }
}
</style>



<template>
    <div>
        <i-row :gutter='20'>
            <i-col :span='12'>
                <div class="asset-detail-line">
                    <loT-asset-info :data='assetInfoData'></loT-asset-info>
                </div>
            </i-col>
            <i-col :span='12'>
                <div class="asset-detail-line trend-data">
                    <asset-trend :data='trendData'
                                 :zoom='true'
                                 :tooltip='{xAxis:"日期",yAxis:"%"}'>
                        <div slot='title'
                             class="trend-title">
                            <span>设备在用率走势</span>
                            <DatePicker type="month"
                                        placeholder="请选择日期"
                                        style="width: 150px"
                                        :value='trendSearch.time'
                                        format='yyyy-MM'
                                        @on-change='trendSearch.time=$event'>
                            </DatePicker>
                        </div>
                    </asset-trend>
                </div>
            </i-col>
        </i-row>
        <div class="in-use asset-detail-line">
            <div class="asset-title">
                设备在用率
            </div>
            <div class="asset-pie">
                <div class="pie-time">
                    <DatePicker :value="timeRange.start"
                                @on-change='startTimeHandler'
                                placeholder="开始时间"
                                type="datetime"
                                :clearable='false'>
                    </DatePicker>
                    <span>至</span>
                    <DatePicker :value="timeRange.end"
                                @on-change='startEndHandler'
                                placeholder="结束时间"
                                type="datetime"
                                :clearable='false'>
                    </DatePicker>
                </div>
                <asset-pie :data='pieData'></asset-pie>
            </div>
            <div class="detail-table">
                <asset-table :search='tableSearch'
                             :assetInfo='assetInfoData'>

                </asset-table>
            </div>

        </div>
    </div>
</template>
<script>
import assetInfo from "./compontents/aseet-info";
import trend from "./compontents/asset-trend";
import table from "./compontents/table";
import assetPie from "./compontents/asset-pie";
import moment from "moment";
export default {
    data() {
        return {
            assetInfoData: {},
            trendData: null,
            trendSearch: {
                time: moment(new Date()).format("YYYY-MM")
            },
            timeRange: {
                start: "",
                end: ""
            },
            pieData: {},
            // startDateOption: {
            //     disabledDate(...data) {
            //         return false;
            //     }
            // },
            tempStartTime: "",
            tempEndTime: ""
        };
    },
    components: {
        [assetInfo.name]: assetInfo,
        [trend.name]: trend,
        [table.name]: table,
        [assetPie.name]: assetPie
    },
    computed: {
        tagId() {
            return this.$route.params.id;
        },
        osId() {
            return this.$store.state.user_in.osId;
        },
        tableSearch() {
            const { start, end } = this.timeRange;
            return {
                epc: this.assetInfoData.epc,
                starttime: start,
                endtime: end
            };
        }
    },
    watch: {
        trendSearch: {
            handler() {
                this.getTrendData();
            },
            deep: true
        },
        timeRange: {
            handler(val) {
                if (val.start === "" || val.end === "") return;
                this.getPieData();
            },
            deep: true
        }
    },
    created() {
        this.getAssetInfoData().then(() => {
            this.getDefaultDateRange();
            this.getTrendData();
            // this.getPieData();
        });
    },
    methods: {
        getAssetInfoData() {
            return this.$axios
                .post(
                    `/internetThings/getObjectByTagId/${parseInt(this.tagId)}`
                )
                .then(({ data }) => {
                    this.assetInfoData = data;
                });
        },
        getTrendData() {
            this.$axios
                .post(
                    `/internetThings/listZyChart/${this.assetInfoData.epc}/${
                        this.trendSearch.time
                    }`
                )
                .then(({ data }) => {
                    if (data instanceof Array) {
                        const xData = [],
                            yData = [];
                        data.map(v => {
                            if (
                                /^\w{4}[-](\w{2}[-]\w{2})/.test(
                                    Object.keys(v)[0]
                                )
                            ) {
                                xData.push(RegExp.$1);
                                yData.push(v[Object.keys(v)[0]]);
                            }
                        });
                        this.trendData = {
                            xData,
                            yData
                        };
                    }
                });
        },
        getPieData() {
            this.$axios
                .post(`internetThings/getZyRate`, {
                    starttime: this.timeRange.start,
                    endtime: this.timeRange.end,
                    epc: this.assetInfoData.epc
                })
                .then(({ data }) => {
                    this.pieData = data;
                });
        },

        async getDefaultDateRange() {
            const {
                data: { startDay, endDay }
            } = await this.$axios.post(
                `/internetThings/dayTrack/${this.assetInfoData.epc}`
            );
            [this.timeRange.start, this.timeRange.end] = [startDay, endDay];
            this.tempStartTime = startDay;
            this.tempEndTime = endDay;
        },
        startTimeHandler(time) {
            if (
                moment(time) <= moment(this.timeRange.end) &&
                moment(time) >= moment(this.tempStartTime)
            ) {
                this.timeRange.start = time;
            } else {
                this.$Message.warning("请选择正确的日期");
                this.timeRange.start = "";
                setTimeout(() => {
                    this.timeRange.start = this.tempStartTime;
                });
            }
        },
        startEndHandler(time) {
            if (
                moment(time) >= moment(this.timeRange.start) &&
                moment(time) >= moment(this.tempEndTime)
            ) {
                this.timeRange.end = time;
            } else {
                this.$Message.warning("请选择正确的日期");
                this.timeRange.end = "";
                setTimeout(() => {
                    this.timeRange.end = this.tempEndTime;
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
.asset-title {
    color: #f2740c;
    font-size: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #c8ced3;
}
.asset-detail-line {
    border: 1px solid #c8ced3;
    height: 100%;
}
.trend-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    > span {
        color: #454f63;
        font-size: 18px;
    }
}
.in-use {
    margin-top: 20px;
    padding: 0 20px;
    background: #fafafa;
}
.asset-pie {
    background: #fff;
    margin: 20px;
    position: relative;
    .asset-detail-line();
    .pie-time {
        position: absolute;
        right: 20px;
        top: 15px;
    }
}
</style>

<template>
    <kld-box>
        <div class="title"
             slot="title">
            <span>设备瞬时数据采集</span>
            <span>刷新频率：5min</span>
            <span>最近刷新时间：{{time}}</span>
            <span>
                <Icon type="refresh"
                      class="refresh"
                      @click="refresh">
                </Icon>
            </span>
        </div>
        <div class='pie-line'>
            <Loading v-show='loading'></Loading>

            <div class="asset-data-collection">

                <kld-instrument :option='temperatureConf'>
                    <div slot='title'
                         class="instrument-title">设备温度</div>
                </kld-instrument>
                <kld-instrument :option='powerConf'>
                    <div slot='title'
                         class="instrument-title">瞬时功率</div>
                </kld-instrument>
                <div>
                    <div class="instant-info"><span>瞬时功率：</span><span>{{assetInfo.kw}} </span><span> kw</span></div>
                    <div class="instant-info"><span>累计度数：</span><span>{{assetInfo.kwh}} </span><span> kwh</span></div>
                    <div class="instant-info"><span>温度：</span><span>暂无</span></div>
                    <div class="instant-info"><span>湿度：</span><span>暂无</span></div>
                </div>
            </div>
            <div class="line-top">
                <asset-trend :data='lineData'
                             :height='314'
                              :tooltip='{xAxis:"时间",yAxis:"kw"}'>
                    <div slot="title"
                         class="trend-title">
                        设备瞬时功率动态监测
                    </div>
                </asset-trend>
            </div>
        </div>
    </kld-box>
</template>

<style lang="less" scoped>
.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}
.asset-data-collection {
    width:100%;
    display: flex;
    align-items: center;
    position: relative;
    > div {
        width: 30%;
    }
    > div:nth-of-type(3) {
        width: 40%;
    }
}
.instrument-title {
    text-align: center;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.78);
    font-weight: 600;
}
.instant-info {
    padding: 10px 0;
    padding-left: 20px;
    white-space: nowrap;
    border-left: solid 1px #c8ced3;
    > span:nth-of-type(1) {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.78);
        text-align: right;
        display: inline-block;
        width: 75px;
    }
    span:nth-of-type(2) {
        color: rgba(193, 108, 132, 0.78);
        font-size: 14px;
    }
    span:nth-of-type(3) {
        color: rgba(0, 0, 0, 0.78);
        font-size: 14px;
    }
}
.line-top {
    margin-top: 30px;
}
.refresh {
    font-size: 20px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.38);
}
.pie-line {
    position: relative;
}
.trend-title {
    color: rgba(0, 0, 0, 0.78);
    font-size: 16px;
    font-weight: 600;
}
</style>

<script>
import KldBox from "../common/kld-box";
import instrument from "../common/instrument";
import line from "../../Life-support/asset-detail/compontents/asset-trend";
import moment from "moment";
export default {
    name: "asset-data-collection",
    data() {
        return {
            temperatureConf: {
                max: 100,
                units: "℃",
                value: 0
            },
            powerConf: {
                max: 30,
                units: "kw",
                value: 0
            },
            assetInfo: {},
            lineData: null,
            time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            loading: false
        };
    },
    components: {
        KldBox,
        [instrument.name]: instrument,
        [line.name]: line
    },
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    created() {
        this.getLineData();
    },
    watch: {
        data(val) {
            console.log(val);
            this.getInstrument();
        }
    },
    methods: {
        getInstrument() {
            this.loading = true;
            this.$axios
                .post("/internetThings/readW", {
                    ip: this.data.ip || "10.36.226.86"
                })
                .then(({ data }) => {
                    this.assetInfo = { ...data };
                    this.powerConf.value = data.kw;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getLineData() {
            this.$axios
                .post(`/internetThings/listWbyDate/${this.$route.query.id}`)
                .then(({ data }) => {
                    const reg = /^\d{4}[-]\d{2}[-]\d{2}\s(\d{2}[:]\d{2})[:]\d{2}/;
                    if (!(data instanceof Array) || data.length === 0) return;
                    const chooseDate = []; //里面储存格式化和去重的数据
                    const linData = [];
                    data.map(v => {
                        if (reg.test(v.date)) {
                            //去重判断
                            if (
                                chooseDate.findIndex(
                                    v => v.date === RegExp.$1
                                ) !== -1
                            )
                                return;
                            chooseDate.push({
                                date: RegExp.$1,
                                kw: v.kw
                            });
                        }
                    });
                    const lineData = {
                        xData: [chooseDate[0].date],
                        yData: [chooseDate[0].kw]
                    };
                    let tempTime = chooseDate[0].date;
                    Array.from({ length: 12 }).map((v, i) => {
                        tempTime = tempTime.split(":");
                        const SUBTime = moment({
                            hour: tempTime[0],
                            minute: tempTime[1]
                        })
                            .add(5, "m")
                            .format("HH:mm");
                        tempTime = SUBTime;
                        const findTime = chooseDate.find(
                            v => v.date === SUBTime
                        );
                        if (findTime) {
                            lineData.xData.push(findTime.date);
                            lineData.yData.push(findTime.kw);
                        }
                    });
                    console.log(lineData);
                    this.lineData = lineData;
                });
        },
        arrayUnique(arr, only = "id") {
            var hash = {};
            var newArr = [];
            newArr = arr.reduce(function(item, next) {
                hash[next[only]]
                    ? ""
                    : (hash[next[only]] = true && item.push(next));
                return item;
            }, []);
            return newArr;
        },
        refresh() {
            this.time = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            this.getLineData();
            this.getInstrument();
        }
    }
};
</script>
<template>
    <div class="diagnostic-history-wrap">
        <div class="line-charts-wrap">
            <kld-echarts :loading='lineLoading'
                         auto-resize
                         :option='lineChartsData'></kld-echarts>
        </div>
        <div class="search-wrap">
            <i-row :gutter='10'>
                <i-col :span="6">
                    <i-input class="kld-input"
                             :placeholder="'姓名/设备/ID/身份证号'"
                             clearable
                             v-model="searchData.keyword"></i-input>
                </i-col>
                <i-col :span="6">
                    <DatePicker split-panels
                                v-model='searchData.dateRange'
                                :placeholder="'检查时间'"
                                type="daterange"
                                clearable
                                class="kld-date-picker"
                                :options='extraOpt'></DatePicker>
                </i-col>
                <i-col :span="6">
                    <Select class="kld-select"
                            v-model="searchData.diagnoseResult"
                            :placeholder="'检查结果'">
                        <Option v-for="({value,label},i) of diagnosisStatus"
                                :key="i"
                                :value="value"
                                :label="label"></Option>
                    </Select>
                </i-col>
                <i-col :span="6"
                       class-name='reset-wrap'>
                    <Button class="kld-btn-default"
                            @click="reset">重置</Button>
                </i-col>
            </i-row>
        </div>
        <div class="diagnostic-history-list">

            <i-table :loading='!!listLoading'
                     :columns='columns'
                     :data='listData'></i-table>
            <kld-page :pageSize='page.size'
                      :current="page.current"
                      :total="page.total"
                      @on-change="pageChange"
                      style="margin:15px 0;"></kld-page>
        </div>
        <div class="goback-wrap">
            <Button class='kld-btn-default'
                    @click='goback'>返回</Button>
        </div>
    </div>
</template>
<script>
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";
import kldPage from "@common/page";

export default {
    name: "diagnostic-history",
    components: {
        //  kldLine ,
        kldPage,
        kldEcharts
    },
    data() {
        let currentDate = new Date();
        return {
            lineData: [],
            searchData: {
                keyword: "",
                diagnoseResult: "",
                dateRange: ["", ""]
            },
            searchTimer: null,
            listLoading: 0,
            lineLoading: false,
            columns: [
                {
                    title: "检查时间",
                    key: "checkDate",
                    render: (h, { column, row, index }) => {
                        let temp = row[column.key];
                        return h(
                            "span",
                            temp ? this.$store.state.localeDate(temp) : ""
                        );
                    },
                    width: 130
                },
                {
                    title: "病人姓名",
                    key: "name",
                    width: 150
                },
                {
                    title: "性别",
                    key: "sex",
                    width: 80
                },
                {
                    title: "年龄",
                    key: "age",
                    width: 80
                },
                {
                    title: "就诊/住院ID",
                    key: "id",
                    width: 120
                },
                {
                    title: "身份证号码",
                    key: "nationalId",
                    width: 175
                },
                {
                    title: "开单科室",
                    key: "unitName"
                },
                {
                    title: "使用设备",
                    key: "assetName",
                    render: (h, { column, row, index }) => {
                        let temp = row[column.key];
                        return h(
                            "span",
                            {
                                style: {
                                    color: "#2d8cf0"
                                }
                            },
                            temp
                        );
                    }
                },
                {
                    title: "检查结果",
                    key: "diagnoseResult",
                    render: (h, { column, row, index }) => {
                        let temp = row[column.key];
                        let style = {
                            color: temp === "阳性" ? "green" : "red"
                        };
                        return h(
                            "span",
                            {
                                style
                            },
                            temp
                        );
                    },
                    width: 100
                }
            ],
            listData: [],
            page: {
                size: 10,
                current: 1,
                total: 0
            },
            diagnosisStatus: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    value: "阳性",
                    label: "阳性"
                },
                {
                    value: "阴性",
                    label: "阴性"
                }
            ],
            extraOpt: {
                //时间范围限制
                disabledDate(date) {
                    return date - currentDate >= 0;
                }
            },
            cancelToken: null
        };
    },
    computed: {
        lineChartsData() {
            return {
                tooltip: {
                    trigger: "axis",
                    formatter: "日 期：{b}<br />阳性率：{c}%"
                },
                xAxis: {
                    type: "category",
                    // boundaryGap: false,
                    // data: ["10-04", "10-05", "10-06", "10-07", "10-08", "10-09", "10-10"]
                    data: this.lineData.map(v => v.checkMonth),
                    axisTick: {
                        // 坐标轴小标记
                        show: false // 属性show控制显示与否，默认不显示
                    }
                },
                yAxis: {
                    type: "value"
                },
                grid: {
                    left: "3%",
                    right: "2%",
                    bottom: "3%",
                    top: "25%",
                    containLabel: true
                },
                series: [
                    {
                        symbol: "circle",
                        // symbolSize: 10,
                        // data: [82, 93, 90, 93, 90, 30, 32],
                        data: this.lineData.map(v =>
                            ((v.positiveRate || 0) * 100).toFixed(2)
                        ),
                        type: "line",
                        itemStyle: {
                            color: "#137c60"
                        },
                        lineStyle: {
                            color: "#137c60"
                        },
                        label: {
                            show: true,
                            formatter: "{c}%"
                        }
                    }
                ],
                title: {
                    text: "近一年阳性率走势",

                    left: "50px"
                }
            };
        },
        dateRangeFormat() {
            return this.searchData.dateRange.map(date => {
                return date ? this.$store.state.localeDate(date) : "";
            });
        },
        doctorId() {
            return this.$route.query.id;
        }
    },
    methods: {
        pageChange(page = 1) {
            if (this.cancelToken) {
                this.cancelToken();
            }
            this.page.current = page;
            this.listLoading++;
            const request = {
                limit: this.page.size,
                offset: (this.page.current - 1) * this.page.size,
                params: {
                    keyword: this.searchData.keyword.trim(),
                    diagnoseResult: this.searchData.diagnoseResult,
                    startDate: this.dateRangeFormat[0]
                        ? this.dateRangeFormat[0] + " 00:00:00"
                        : "",
                    endDate: this.dateRangeFormat[1]
                        ? this.dateRangeFormat[1] + " 23:59:59"
                        : "",
                    doctorId: this.doctorId,
                    hospId: this.$store.state.user_in.osId
                }
            };
            const config = {
                cancelToken: new this.$axios.CancelToken(c => {
                    // executor 函数接收一个 cancel 函数作为参数
                    this.cancelToken = c;
                })
            };
            this.$axios
                .post(
                    `/cba/getApplyInfoPositiveByDoctorNameList`,
                    request,
                    config
                )
                .then(({ data: { data, recordsTotal } }) => {
                    this.listData = data;
                    this.page.total = recordsTotal;
                })
                .finally(() => {
                    this.listLoading--;
                });
        },
        getlist() {
            this.pageChange();
        },

        getLineDate() {
            //获得折线图
            this.lineLoading = true;
            this.$axios
                .post(`/cba/getDoctorMonthPositiveRate`, {
                    doctorId: this.doctorId,
                    hospId: this.$store.state.user_in.osId
                })
                .then(({ data }) => {
                    this.lineData = data;
                })
                .finally(() => {
                    this.lineLoading = false;
                });
        },
        reset() {
            //重置
            this.searchData = {
                keyword: "",
                diagnoseResult: "",
                dateRange: ["", ""]
            };
        },
        goback() {
            this.$router.go(-1);
        }
    },
    watch: {
        searchData: {
            handler() {
                clearTimeout(this.searchTimer);
                this.searchTimer = setTimeout(() => {
                    this.getlist();
                }, 300);
            },
            deep: true
        }
    },
    created() {
        this.getlist();
        this.getLineDate();
    }
};
</script>
<style lang="less" scoped>
.diagnostic-history-wrap {
    width: 100%;
    background-color: #fafafa;
    .line-charts-wrap {
        width: 100%;
        height: 200px;
        border: 1px solid rgba(2, 31, 57, 0.1);
    }
    .search-wrap {
        background: rgb(250, 250, 250);
        width: 100%;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        padding: 20px;
        margin-top: 20px;
        .reset-wrap {
            display: flex;
            justify-content: flex-end;
        }
    }
    .diagnostic-history-list {
        margin-top: 15px;
    }
    .goback-wrap {
        width: 100%;
        height: 80px;
        padding: 0 15px;
        background-color: #fafafa;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
}
</style>



<template>
    <div class="large-equipment-list">
        <kld-box class="mb-20">
            <template slot="title">大型医疗设备偏差走势</template>
            <div class="pie-wrap">
                <line-chart :chartData='lineData' y-axis-name="设备偏差" @click="chartClick"></line-chart>
            </div>
        </kld-box>
        <div class="kld-box-effect">
            <Form ref="search-form"
                  :model="searchData">
                <Row :gutter="20">
                    <i-col span="6">
                        <FormItem prop="keyword">
                            <Input class="kld-input"
                                   v-model="searchData.keyword"
                                   placeholder="设备编码/设备名称/品牌" />
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem prop="date">
                            <DatePicker :value="searchData.date"
                                        @on-change="searchData.date = $event"
                                        placeholder="选择月份"
                                        class="kld-date-picker"
                                        type="month"
                                        format="yyyy-MM"
                                        :clearable="false" />
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </div>

        <div class="kld-box-effect mt-20 p-0 relative">
            <Loading v-if="tableLoading"></Loading>
            <kld-table :data="tableData"
                       :columns="tableColumns"
                       height="300"
                       @on-row-click="rowClick" />
            <div class="font-weight-bold table-total py-20 pl-20">
                <span>合计</span>
                <div class="col">
                    <div v-for="(total,i) in tableTotal"
                         class="px-18" :key='i'>{{total}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
import list from "../common/list";
import {KldTable} from "@/components";
import KldPage from "@/common/page";
import moment from "moment";
import {tableRenderEllipsis} from "@/utils";
import KldBox from '../common/kld-box';
import line from "../../equipment-overview/components/line-chart.vue";
export default {
    name: "large-equipment-list",
    mixins: [list],
    components: {
        KldTable,
        KldPage,
        KldBox,
        [line.name]: line
    },
    data() {
        return {
            searchData: {
                departmentId: this.$store.state.user_in.osId,
                // departmentId: '534508400248098816',
                keyword: "",
                date: moment().format("YYYY-MM")
                // date: '2018-10'
            },
            pageData: {
                pageSize: 10000000
            },
            lineData: []
        };
    },
    computed: {
        tableUrl: () => "/internetThings/MonthlydeviationList",
        tableColumns: () => [
            {
                title: "资产编码",
                render: tableRenderEllipsis("assetCode", "text-uppercase")
            },
            {
                title: "资产名称",
                render: tableRenderEllipsis("assetName", "kld-success")
            },
            {
                title: "品牌",
                render: tableRenderEllipsis("brandName")
            },
            {
                title: "型号",
                render: tableRenderEllipsis("assetClass")
            },
            {
                title: "所属科室",
                render: tableRenderEllipsis("os_Name")
            },
            {
                title: "用电量(kw·h)",
                width: 110,
                key: "kwh"
            },
            {
                title: "检查数",
                width: 110,
                key: "jccount"
            },
            {
                title: "开单数",
                width: 110,
                key: "kdcount"
            },
            {
                title: "偏差值(%)",
                width: 110,
                key: "deviation_rate"
            }
        ],

        tableTotal() {
            return this.tableData
                .reduce(
                    (result, item) => {
                        const current = [
                            item.kwh,
                            item.jccount,
                            item.kdcount,
                            item.deviation_rate
                        ];

                        return result.map((last, index) => {
                            const currentNum = Number(current[index]);
                            return (
                                last +
                                (Number.isNaN(currentNum) ? 0 : currentNum)
                            );
                        });
                    },
                    [0, 0, 0, 0]
                )
                .map((total, index) => {
                    if (index === 0) {
                        return total.toFixed(1);
                    } else if (index === 3) {
                        return total.toFixed(2);
                    } else {
                        return total.toFixed(0);
                    }
                });
        }
    },

    created() {
        this.getTableData();
        this.getLineData();
    },
    methods: {
        rowClick({ assetId: id }) {
            this.$router.push({
                name: "large-equipment-detail",
                query: {
                    id
                }
            });
        },
        chartClick({name}) {
            this.searchData.date = name;
        },
        getLineData() {
            this.$axios
                .post(`internetThings/MonthlydeviationZouShi`)
                .then(({ data }) => {
                    data = data || [];
                    const firstDate = moment(data.length === 0 ? Date.now() : data[data.length - 1].times).subtract(12, 'months');
                    const res = new Array(12 - data.length).fill(undefined).concat(data);

                    this.lineData = res.map(
                        (item) => {
                            return {
                                usedRate: item && Number.parseFloat(item.deviation_rate),
                                month: firstDate.add(1, 'months').format('YYYY-MM')
                            }
                        }
                    );
                });
        }
    }
};
</script>

<style lang="less" scoped>
    .large-equipment-list {
        .table-total {
            display: flex;
            justify-content: space-between;
            background-color: #e5e5e5;
            .col {
                display: flex;
                > div {
                    width: 110px;
                }
            }
        }

        /deep/.kld-table {
            th,
            td {
                /*height: 60px;*/
            }
        }
    }
    .pie-wrap {
        height: 300px;
    }
</style>
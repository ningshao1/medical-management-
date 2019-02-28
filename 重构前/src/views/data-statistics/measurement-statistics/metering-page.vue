<template>
    <div class="metering-page-wrap">
        <div class="kld-box-effect mb-20">
            <i-row>
                <i-col :span='6'>

                    <date-picker
                        type="daterange"
                        :clearable='false'
                        :editable="false"
                        range-type="month"
                        v-model="daterange"
                        @on-change="getList"
                    ></date-picker>
                </i-col>

            </i-row>
        </div>
        <div class="metering-bar">
            <display-bar :data='barData'></display-bar>
        </div>
        <div class="metering-content">
            <expand-table
                :data="expandTableData"
                :selected.sync="tableSelected"
            >
                <template slot="footer">
                    <Button
                        @click="exportExcel"
                        :loading="btnLoading"
                        type="ghost"
                        class="btn-info"
                    >导出报表</Button>
                </template>
            </expand-table>
        </div>
        <kld-loading v-if="listLoading"></kld-loading>
    </div>
</template>
				

<script>
import displayBar from "../components/display-bar.vue";
import moment from "moment";
import { tableRenderEllipsis, numberToLocale, downloadFile } from "@/utils";
import ExpandTable from "../components/expand-table";
import kldLoading from "@common/loading/loading.vue";

export default {
    name: "metering-page",
    components: { displayBar, ExpandTable, kldLoading },
    data() {
        const current = new Date();
        const getDate = month => {
            return month
                ? new Date(current.getFullYear(), current.getMonth(), 1)
                : new Date(current.getFullYear() + 1, 0, 0);
        };
        return {
            barInfo: {},
            daterange: [getDate(true), getDate(false)],
            tableSelected: [],
            overdueData: [],
            btnLoading: false,
            listLoading: false,

            expandColumns: [
                {
                    type: "index",
                    width: 60,
                    title: "序号"
                },
                {
                    title: "设备名称",
                    render: tableRenderEllipsis("assetName", "kld-success")
                },
                {
                    title: "设备编码",
                    render(
                        h,
                        {
                            row: { assetCode }
                        }
                    ) {
                        return <span>{assetCode}</span>;
                    }
                },
                {
                    title: "所属科室",
                    key: "osName"
                }
            ]
        };
    },
    props: {
        pageInfo: {
            default() {
                return {
                    type: 1,
                    totalName: "强检类总数"
                };
            }
        }
    },
    created() {
        this.getList();
    },
    computed: {
        expandTableData() {
            return [
                {
                    title(h) {
                        return <span class="kld-success">逾期</span>;
                    },
                    expandData: this.overdueData,
                    expandColumns: this.expandColumns,
                    _expanded: true
                }
            ];
        },
        formatDateRange() {
            return this.daterange.map(date => moment(date).format("YYYY-MM"));
        },
        remoteDateRange() {
            return {
                startTime: this.formatDateRange[0],
                endTime: this.formatDateRange[1]
            };
        },
        barData() {
            const { normal, overdue } = this.barInfo;
            const norDefined = this.isDefined(normal);
            const overDefined = this.isDefined(overdue);
            if (!(norDefined && overDefined)) {
                return [
                    {
                        name: this.pageInfo.totalName,
                        value: "--"
                    },
                    {
                        name: "完成数",
                        value: "--"
                    },
                    {
                        name: "逾期数",
                        value: "--"
                    },
                    {
                        name: "完成率",
                        value: "--"
                    }
                ];
            }
            const total = normal + overdue;

            return [
                {
                    name: this.pageInfo.totalName,
                    value: total
                },
                {
                    name: "完成数",
                    value: normal
                },
                {
                    name: "逾期数",
                    value: overdue
                },
                {
                    name: "完成率",
                    value: total
                        ? `${((normal / total) * 100).toFixed(2)}%`
                        : "--"
                }
            ];
        }
    },
    methods: {
        isDefined(item) {
            return item !== undefined && item !== null;
        },
        async getList() {
            this.listLoading = true;
            const { type } = this.pageInfo;
            try {
                const requestBody = {
                    type,
                    ...this.remoteDateRange
                };
                const {
                    data: [barInfo, overdueData]
                } = await this.$axios.post(
                    `/measurementTask/findMeasurementRecords`,
                    requestBody
                );
                this.barInfo = barInfo || {};
                this.overdueData = overdueData || [];
            } finally {
                this.listLoading = false;
            }
        },
        async exportExcel() {
            // if(!this.tableSelected.length){//todo
            //     return this.$Message.warning("请先选择需要导出的表格!");
            // }
            this.btnLoading = true;
            try {
                const { type, label } = this.pageInfo;
                const resquestBody = {
                    type,
                    ...this.remoteDateRange
                };
                const conifg = {
                    responseType: "blob"
                };
                const { data } = await this.$axios.post(
                    `/measurementTask/downloadMeasurementRecords`,
                    resquestBody,
                    conifg
                );
                const filename = `质控统计表3-${label}（${this.formatDateRange.join(
                    "~"
                )}）.xls`;
                downloadFile(data, filename);
            } finally {
                this.btnLoading = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.metering-page-wrap {
    position: relative;
    > div {
        width: 100%;
    }
    .metering-content {
        margin-top: 20px;
        border: 1px solid #dddee1;
        border-radius: 3px;
        .btn-info {
            background-color: #fff;
            height: 44px;
            width: 100px;
        }
    }
}
</style>


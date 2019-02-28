<template>
    <div>
        <div class="search">
            <i-row>
                <i-col span='6'>
                    <DatePicker :value='search.startTime'
                                type="month"
                                format="yyyy-MM"
                                placement="bottom-end"
                                placeholder="上报时间开始"
                                style="width:44%"
                                @on-change="search.startTime=$event"
                                :editable='false'>
                    </DatePicker>
                    至
                    <DatePicker :value='search.endTime'
                                type="month"
                                format="yyyy-MM"
                                placement="bottom-end"
                                placeholder="上报时间结束"
                                style="width:44%"
                                @on-change="search.endTime=$event"
                                :editable='false'>
                    </DatePicker>
                </i-col>
            </i-row>
        </div>
        <div class="info">
            不良事件上报数：<span>{{page.total}}</span>
        </div>
        <div class="table">
            <Table :data='tableData'
                   :columns='column'
                   :loading="TableLoading"
                   ref="selection">
            </Table>
            <div class="page">
                <div>
                    <!-- <i-checkbox size='large'
                                @on-change='allSelect'></i-checkbox> -->
                    <i-button class="export"
                              @click='exportExcel'>导出表格</i-button>
                </div>
                <page @on-change="getTableData"
                      :current.sync="page.current"
                      :page-size="page.size"
                      :total="page.total">
                </page>
            </div>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import { downFile } from "@common/method/util";
export default {
    data() {
        return {
            tableData: [],
            TableLoading: false,
            selectData: [],
            column: [
                // {
                //     title: " ",
                //     width: 40,
                //     align: "left",
                //     render: (h, params) => {
                //         return h("Checkbox", {
                //             props: {
                //                 value: params.row.checked
                //             },
                //             on: {
                //                 "on-change": select => {
                //                     params.row.checked = select;
                //                     if (select) {
                //                         this.selectData.push(params.row);
                //                     } else {
                //                         const index = this.selectData.findIndex(
                //                             v =>
                //                                 v.reportID ===
                //                                 params.row.reportID
                //                         );
                //                         if (index === -1) return;
                //                         this.selectData.splice(index, 1);
                //                     }
                //                 }
                //             }
                //         });
                //     }
                // },
                {
                    title: "序号",
                    key: "index",
                    align: "left",
                    width: 60,
                    render: (h, params) => {
                        return h(
                            "div",
                            (this.page.current - 1) * this.page.size +
                                params.index +
                                1
                        );
                    }
                },
                {
                    title: "设备名称",
                    key: "assetName",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    color: "##0c8399"
                                }
                            },
                            params.row.assetName
                        );
                    }
                },
                {
                    title: "设备编码",
                    key: "assetCode"
                },
                {
                    title: "设备型号",
                    key: "assetClass"
                },
                {
                    title: "所属科室",
                    key: "osName"
                },
                {
                    title: "上报人",
                    key: "creatorName"
                },
                {
                    title: "上报时间",
                    key: "aeReportDate"
                }
            ],

            page: {
                size: 10,
                current: 1,
                total: 10
            },
            search: {
                startTime: moment(new Date()).format("YYYY-MM"),
                endTime: new Date().getFullYear() + "-12"
            }
        };
    },
    components: {},
    created() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            this.TableLoading = true;
            this.$axios
                .post(
                    `/adverseEvent/${
                        this.$store.state.user_in.osId
                    }/reportForms`,
                    {
                        limit: this.page.size,
                        offset: (this.page.current - 1) * this.page.size,
                        params: { ...this.search }
                    }
                )
                .then(({ data: { data, recordsTotal } }) => {
                    data.map(v => {
                        const index = this.selectData.findIndex(
                            e => e.assetId === v.assetId
                        );
                        if (index !== -1) v.checked = true;
                        else v.checked = false;
                    });
                    this.tableData = data;
                    this.page.total = recordsTotal;
                })
                .finally(() => {
                    this.TableLoading = false;
                    this.$forceUpdate();
                });
        },
        allSelect(change) {
            if (change) {
                this.tableData.map(v => {
                    const index = this.selectData.findIndex(
                        e => v.assetId === e.assetId
                    );
                    if (index === -1) {
                        this.$set(v, "checked", true);
                        this.selectData.push(v);
                    } else {
                        this.$set(v, "checked", true);
                    }
                });
            } else {
                this.tableData.map(v => {
                    let index = this.selectData.findIndex(e => {
                        return e.assetId === v.assetId;
                    });
                    if (index === -1) {
                        this.$set(v, "checked", false);
                    }
                    this.$set(v, "checked", false);
                    this.selectData.splice(index, 1);
                });
            }
        },
        exportExcel() {
            this.$axios
                .post(
                    `/adverseEvent/${
                        this.$store.state.user_in.osId
                    }/excelExport`,
                    {
                        ...this.search
                    },
                    {
                        responseType: "blob"
                    }
                )
                .then(res => {
                    if (res.data.size <= 0) {
                        this.$Message.warning("暂无数据");
                        return;
                    }
                    downFile(res, "不良事件下载.xlsx");
                });
            // if (this.selectData.length === 0) {
            //     this.$Message.warning("请选择要导出的数据");
            //     return;
            // }
            // const downData = JSON.parse(JSON.stringify(this.selectData));
            // downData.map(v => {
            //     v.aeReportDate = ' = "' + v.aeReportDate + ' " '.toString();
            // });
            // this.$refs.selection.exportCsv({
            //     columns: this.column.slice(2),
            //     filename: "不良统计.csv",
            //     data: this.selectData
            // });
        }
    },
    watch: {
        search: {
            handler() {
                this.page.current = 1;
                this.getTableData();
            },
            deep: true
        }
    }
};
</script>
<style lang="less" scoped>
@color: #0c8399;
.bg {
    background-color: #fafafa;
    border-radius: 3px;
    border: solid 1px #c8ced3;
}
.search {
    .bg;
    padding: 10px 10px;
}
.info {
    .bg;
    font-size: 14px;
    line-height: 25px;
    letter-spacing: 0px;
    color: #666666;
    margin: 10px 0;
    padding: 10px 10px;
    span {
        color: @color;
    }
}
.table {
    margin: 10px 0;
    .bg;
}
.export {
    height: 35px;
    width: 90px;
    color: #333333;
    background-color: #ffffff;
    border-radius: 3px;
    border: solid 1px #cccccc;
}
.page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    padding: 15px;
    background-color: rgba(235, 235, 235, 0.5);
}
/deep/ .table {
    .ivu-table {
        th,
        td {
            background: #fafafa;
        }
    }
}
</style>

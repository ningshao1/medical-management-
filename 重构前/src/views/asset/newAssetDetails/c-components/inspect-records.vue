<template>
    <div class="inspect-records kld-box-effect">
        <Loading v-if="tableLoading"></Loading>
        <Table @on-row-click="goToDetails" class="records-table" :columns="recordsTableColumns" :data="recordsTableData"></Table>
        <div class="table-page">
            <kld-page @on-change="getRecords" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "./common";
.inspect-records {
    position: relative;
}
.records-table {
    /deep/.ivu-table-body {
        tr {
            height: 74px;
        }
    }
}
.table-page {
    padding-top: 20px;
    text-align: center;
}
</style>

<script>
import kldPage from "@common/page/page";
import kldTag from "@inspection-common/kld-tag.vue";
import numToLocale from "@common/numberToLocale";
import moment from "moment";
export default {
    name: "inspect-records",
    components: { kldPage },
    data() {
        return {
            tableLoading: false,
            recordsTableColumns: [
                {
                    title: "序号",
                    width: 120,
                    render: (h, { index }) =>
                        h(
                            "p",
                            (
                                (this.pageData.current - 1) *
                                    this.pageData.pageSize +
                                index +
                                1
                            )
                                .toString()
                                .padStart(2, "0")
                        )
                },
                {
                    title: "任务名称",
                    key: "sName",
                    render: (h, params) => {
                        return h(
                            "p",
                            { class: "kld-success" },
                            params.row.sName
                        );
                    }
                },
                {
                    title: "任务期数",
                    key: "periods",
                    render: h => {
                        return h("p", numToLocale(1) + "期");
                    }
                },
                {
                    title: "执行时间",
                    key: "executeStartTime",
                    render: (h, params) => {
                        return h(
                            "p",
                            {},
                            moment(params.row.executeStartTime).format(
                                "YYYY-MM-DD"
                            ) +
                                "-" +
                                moment(params.row.executeEndTime).format(
                                    "YYYY-MM-DD"
                                )
                        );
                    }
                },
                { title: "执行人", key: "executeName", width: 120 },
                {
                    title: "执行状态",
                    key: "status",
                    render: (h, { row: { status } }) => {
                        let type = "",
                            tagText = "";
                        switch (status) {
                            case 0:
                                type = "default";
                                tagText = "未完成";
                                break;
                            case 1:
                                type = "warning";
                                tagText = "执行中";
                                break;
                            case 2:
                                type = "success";
                                tagText = "已完成";
                                break;
                            case 3:
                                type = "purple";
                                tagText = "未完成";
                                break;
                            case 4:
                                type = "error";
                                tagText = "逾期";
                        }

                        return h(kldTag, { props: { type } }, tagText);
                    }
                }
            ],
            recordsTableData: [],
            pageData: {
                total: 0,
                pageSize: 10,
                current: 1
            }
        };
    },
    props: {
        loaded: Function
    },
    created() {
        this.getRecords();
    },
    methods: {
        getRecords() {
            this.$axios
                .post(
                    `/maintenanceSchedule/${this.$store.state.user_in.osId}/${
                        this.$route.params.id
                    }/assetList`,
                    {
                        limit: 10,
                        offset: (this.pageData.current - 1) * 10,
                        params: {}
                    }
                )
                .then(({ data: { data, recordsTotal } }) => {
                    this.recordsTableData = data;
                    this.pageData.total = recordsTotal;

                    this.loaded();
                })
                .catch(() => {
                    this.loaded();
                });
        },
        goToDetails({sId}) {
            this.$router.push({
                name: 'inspection-task-details',
                query: {id: sId}
            });
        }
    }
};
</script>
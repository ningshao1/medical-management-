<template>
    <div class="kld-box-effect">
        <Loading v-if="tableLoading"></Loading>
        <Table @on-row-click="goToDetails" class="records-table" :columns="recordsTableColumns" :data="recordsTableData"></Table>
        <div class="table-page">
            <kld-page @on-change="getRecords" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "../c-components/common";
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

export default {
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
                    title: "报告日期",
                    key: "aeReportDate"
                },
                {
                    title: "事件后果",
                    key: "aeConseQuence",
                    width: 300,
                    render(h, params) {
                        return h(
                            "p",
                            {},
                            params.row.aeConseQuence === 1
                                ? "死亡"
                                : params.row.aeConseQuence === 2
                                    ? "危及生命"
                                    : params.row.aeConseQuence === 3
                                        ? "机体功能结构永久性损伤"
                                        : params.row.aeConseQuence === 4
                                            ? "可能导致机体功能机构永久性损伤"
                                            : params.row.aeConseQuence === 5
                                                ? "需要内、外科治疗避免上述永久损伤"
                                                : "其它"
                        );
                    }
                },
                {
                    title: "事件报告状态",
                    key: "aeReportStatus",
                    width: 300,
                    render(h, params) {
                        return h(
                            "p",
                            {},
                            params.row.aeReportStatus === 1
                                ? "已通知使用单位"
                                : params.row.aeReportStatus === 2
                                    ? "已通知生产企业"
                                    : params.row.aeReportStatus === 3
                                        ? "已通知经营企业"
                                        : params.row.aeReportStatus === 4
                                            ? "已通知药监"
                                            : "其它"
                        );
                    }
                },
                { title: "上传人", key: "creatorName" },
                {
                    title: "操作",
                    render: (h, params) => {
                        return h(
                            "a",
                            {
                                attrs: {
                                    href: "javascript:;"
                                },
                                on: {
                                    click: () => {
                                        if (params.row.paths instanceof Array) {
                                            if (params.row.paths.length > 0) {
                                                params.row.paths.map(v => {
                                                    this.download(
                                                        this.upfile_ + v
                                                    );
                                                });
                                            } else {
                                                this.$Message.warning(
                                                    "对不起，该项暂无报告"
                                                );
                                            }
                                        }
                                    }
                                }
                            },
                            "下载报告"
                        );
                    }
                }
            ],
            recordsTableData: [],
            pageData: {
                total: 0,
                pageSize: 10,
                current: 1
            },
        };
    },
    props: {
        loaded: Function
    },
    created() {
        typeof this.loaded === "function" && this.loaded();
        this.getRecords();
    },
    methods: {
        getRecords() {
            this.$axios
                .post(
                    `/adverseEvent/listByAssetId/${this.$route.params.id}`,
                    {
                        limit: 10,
                        offset: (this.pageData.current - 1) * 10,
                        params: {}
                    }
                )
                .then(res => {
                    this.pageData.total = res.data.recordsTotal;
                    this.recordsTableData = res.data.data;
                });
        },
        download(src) {
            this.$axios
                .get(src, {
                    responseType: "blob"
                })
                .then(res => {
                    let $a = document.createElement("a");
                    $a.setAttribute("href", URL.createObjectURL(res.data));
                    $a.setAttribute("target", "_self");
                    $a.setAttribute("download", "img.png");
                    $a.style.display = "none";
                    document.body.appendChild($a);
                    $a.click();
                    document.removeChild($a);
                });
        },
        goToDetails({id}) {
            this.$router.push({
                name: 'adverseEventDetail',
                query: {id}
            });
        }
    }
};
</script>
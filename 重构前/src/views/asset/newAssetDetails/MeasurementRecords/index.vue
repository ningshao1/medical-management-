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
                    title: "检定结果",
                    key: "mrResult",
                    width: 100,
                    render(h, params) {
                        return h(
                            "p",
                            {
                                class:
                                    params.row.mrResult === 1
                                        ? " kld-error"
                                        : "kld-success"
                            },
                            params.row.mrResult === 1 ? "不合格" : "合格"
                        );
                    }
                },
                {
                    title: "证书编号",
                    width: 200,
                    key: "mrCode",
                    render(h, params) {
                        return h(
                            "p",
                            {
                                style: {
                                    color: "#2195ec"
                                }
                            },
                            params.row.mrCode
                        );
                    }
                },
                { title: "发证时间", key: "executionTime", width: 200 },
                { title: "检定机构", key: "mrCode", width: 300 },
                { title: "上传时间", key: "uploadTime", width: 200 },
                { title: "上传人", key: "executeName" },
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
                                        if (
                                            params.row.photos instanceof Array
                                        ) {
                                            if (params.row.photos.length > 0) {
                                                params.row.photos.map(v => {
                                                    if (v !== null) {
                                                        this.download(
                                                            this.upfile_ + v
                                                        );
                                                    }
                                                });
                                            } else {
                                                this.$Message.warning(
                                                    "对不起，该项没有证书"
                                                );
                                            }
                                        } else if (
                                            typeof params.row.attachmentPath ===
                                            "string"
                                        ) {
                                            this.download(
                                                params.row.attachmentPath
                                            );
                                        } else {
                                            this.$Message.warning(
                                                "对不起，该项没有证书"
                                            );
                                        }
                                    }
                                }
                            },
                            "下载证书"
                        );
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
    computed: {
        assetId() {
            return this.$route.params.id;
        }
    },
    created() {
        typeof this.loaded === "function" && this.loaded();
        this.getRecords();
    },
    methods: {
        getRecords() {
            this.$axios
                .post(`/assets/getMeasurement`, {
                    limit: 10,
                    offset: (this.pageData.current - 1) * 10,
                    params: {
                        id: this.$route.params.id
                    }
                })
                .then(({ data: { data, recordsTotal } }) => {
                    this.recordsTableData = data;
                    this.pageData.total = recordsTotal;
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
        goToDetails({ mrId }) {
            this.$router.push({
                name: "normalEM-detail",
                query: { id: this.assetId }
            });
        }
    }
};
</script>
<template>
    <div>
        <i-table :data='tableData'
                 :columns='columns'
                 :loading='loading'>

        </i-table>
        <kld-page @on-change="getData"
                  :current.sync="page.current"
                  :total="page.total"
                  :page-size="page.pageSize"
                  class="table-page">
        </kld-page>
    </div>
</template>
<script>
import kldPage from "@common/page/index";

export default {
    name: "asset-table",
    props: {
        search: {
            required: true
        },
        assetInfo: {
            required: true
        }
    },
    data() {
        return {
            data: [],
            columns: [
                {
                    title: "序号",
                    key: "",
                    render: (h, { index }) => {
                        return h(
                            "div",
                            {},
                            (this.page.current - 1) * this.page.pageSize +
                                index +
                                1
                        );
                    }
                },
                {
                    title: "开始时间",
                    key: "datetime"
                },
                {
                    title: "状态",
                    key: "state",
                    render: (h, { row: { state } }) => {
                        return h(
                            "div",
                            {},
                            state === 1
                                ? "在用"
                                : state === 2
                                ? "待用"
                                : state === 3
                                ? "维修"
                                : ""
                        );
                    }
                },
                {
                    title: "位置",
                    key: "departmentName"
                },
                {
                    title: "备注",
                    render: (h, { row: { departmentId } }) => {
                        return h(
                            "div",
                            {},
                            departmentId !== this.assetInfo.departmentId
                                ? "借出"
                                : ""
                        );
                    }
                }
            ],
            page: {
                current: 1,
                total: 10,
                pageSize: 10
            },
            tableData: [],
            loading: false
        };
    },
    watch: {
        search: {
            handler(val) {
                if (val && (val.starttime === "" || val.endtime === "")) return;
                this.page.current = 1;
                this.getData();
            },
            deep: true
        },
        assetInfo: {
            handler() {
                if (
                    this.search &&
                    (this.search.starttime === "" || this.search.endtime === "")
                )
                    return;
                this.getData();
            }
        }
    },
    components: {
        [kldPage.name]: kldPage
    },
    methods: {
        getData() {
            const page = this.page;
            this.loading = true;
            this.$axios
                .post(`/internetThings/listTrack`, {
                    limit: page.pageSize,
                    offset: (page.current - 1) * page.pageSize,
                    params: {
                        ...this.search
                    }
                })
                .then(({ data: { data, recordsTotal } }) => {
                    page.total = recordsTotal;
                    this.tableData = data;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="less" scoped>
.table-page {
    margin: 15px 0;
}
</style>


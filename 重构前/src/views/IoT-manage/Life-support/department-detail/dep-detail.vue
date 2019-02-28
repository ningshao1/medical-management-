<template>
    <div class="dep-detail">
        <div class="dep-name">
            {{$route.params.name}}
        </div>
        <div class='dep-search'>
            <i-row :gutter='15'>
                <i-col span='6'>
                    <i-input class="kld-input"
                             placeholder='资产名称/资产编码'
                             v-model.trim="search.keyword">
                    </i-input>
                </i-col>
                <i-col span='6'>
                    <i-select class="kld-select"
                              placeholder='资产状态'
                              v-model="search.state">
                        <i-option v-for="item in assetState"
                                  :key='item.key'
                                  :value='item.key'
                                  :label='item.value'>
                        </i-option>
                    </i-select>
                </i-col>
            </i-row>
        </div>
        <div class="dep-table">
            <i-table :data='tableData'
                     :columns='columns'
                     :loading='loading'>

            </i-table>
        </div>
        <kld-page @on-change="getData"
                  :current.sync="page.current"
                  :total="page.total"
                  :page-size="page.pageSize">
        </kld-page>
        <div class="dep-foot">
            <i-button class="kld-btn-default"
                      @click="back">返回</i-button>
        </div>
    </div>
</template>
<script>
import kldPage from "@common/page/index";
import confirm from "@common/kld-confirm/index";
export default {
    name: "dep-detail",
    data() {
        return {
            assetState: [
                {
                    value: "全部",
                    key: ""
                },
                {
                    value: "在用",
                    key: 1
                },
                {
                    value: "待用",
                    key: 2
                },
                {
                    value: "维修",
                    key: 3
                }
            ],
            tableData: [],
            page: {
                total: 10,
                current: 1,
                pageSize: 10
            },
            search: {
                departmentId: this.$route.params.id,
                state: null,
                keyword: null,
                bindingState: 1
            },
            columns: [
                {
                    title: "序号",
                    width: 80,
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
                    title: "资产名称",
                    key: "assetName",
                    render: (h, { row: { assetName } }) => {
                        return h(
                            "div",
                            {
                                style: {
                                    color: "#0c8399"
                                }
                            },
                            assetName
                        );
                    }
                },
                {
                    title: "资产编码",
                    key: "assetCode"
                },
                {
                    title: "品牌",
                    key: "brandName"
                },
                {
                    title: "型号",
                    key: "assetClass"
                },
                {
                    title: "RFID标签",
                    key: "epc",
                    width: 220
                },
                {
                    title: "资产位置",
                    key: "location"
                },
                {
                    title: "资产状态",
                    key: "state",
                    width: 100,
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
                    title: "操作",
                    render: (h, { row: { tagId, epc } }) => {
                        return h(
                            "router-link",
                            {
                                attrs: {
                                    to: {
                                        name: "asset-detail",
                                        params: {
                                            id: tagId
                                        }
                                    }
                                }
                            },
                            epc ? "查看详情" : ""
                        );
                    }
                }
            ],
            loading: false
        };
    },
    watch: {
        search: {
            handler() {
                this.page.current = 1;
                this.getData();
            },
            deep: true
        }
    },
    components: {
        [kldPage.name]: kldPage
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.loading = true;
            const page = this.page;
            this.$axios
                .post(`/internetThings/lifeAssetList`, {
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
        },
        back() {
            confirm({
                title: "提示",
                content: "确定返回？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.$router.go(-1);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.dep-detail {
    background-color: #fafafa;
    border-radius: 3px;
    border: solid 1px #c8ced3;
    padding: 60px 20px;
    padding-bottom: 80px;
    position: relative;
    > .dep-name {
        padding: 10px 0;
        font-size: 16px;
        background-color: #eaeaea;
        padding-left: 10px;
        position: absolute;
        left: 0;
        width: 100%;
        top: 0;
    }
    > .dep-search {
        border-radius: 3px;
        border: solid 1px #c8ced3;
        padding: 10px 20px;
    }
}
.dep-table {
    margin-bottom: 10px;
}
.dep-foot {
    position: absolute;
    bottom: 0;
    height: 60px;
    display: flex;
    left: 0;
    padding: 0 10px;
    justify-content: flex-end;
    align-items: center;
    background: #e5e5e5;
    width: 100%;
}
</style>


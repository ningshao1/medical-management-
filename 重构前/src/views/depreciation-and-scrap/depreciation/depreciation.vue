<template>
    <div class="depreciation">
        <div class="position-to-title">
            <Button :loading="exportExcelLoading" @click="printExcel" class="kld-btn" icon="arrow-down-a">导出Excel表格</Button>
        </div>
        <div class="search kld-box-effect">
            <Form :model="searchData" ref="search-form">
                <Row type="flex" :gutter="20">
                    <i-col>
                        <FormItem prop="keyWord">
                            <i-input v-model.trim="searchData.keyWord" placeholder="设备编码/设备名称" icon="ios-search-strong" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem prop="assetStatu">
                            <Select v-model="searchData.assetStatu" class="kld-select" placeholder="资产状态">
                                <Option value="0">闲置</Option>
                                <Option value="1">在用中</Option>
                                <Option value="2">报废</Option>
                                <Option value="3">备用</Option>
                                <Option value="4">待用</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem prop="time">
                            <DatePicker :value="searchData.time" @on-change="searchData.time = $event" placeholder="统计时间" class="kld-date-picker"></DatePicker>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem prop="equipmentType">
                            <kld-tree-select
                                    style="width: 300px;"
                                    placeholder="设备分类"
                                    :data="assetTypeTree"
                                    filterable
                                    v-model="searchData.equipmentType"
                                    title-key="typeName"
                                    children-key="lists"
                            ></kld-tree-select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem prop="assetValue">
                            <Select v-model="searchData.assetValue" class="kld-select" placeholder="资产价值">
                                <Option value="1">小于10万</Option>
                                <Option value="2">10万-50万</Option>
                                <Option value="3">大于50万</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <Button @click="resetSearch" class="kld-btn-default">重置</Button>
                        <Button @click="getAssetList" icon="android-search" class="kld-btn">检索</Button>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="ael-list-wrap">
            <!-- 左侧科室树 -->
            <div class="ael-list-tree">
                <kld-search-tree
                        placeholder="科室名称搜索"
                        select-wrap-class="name-search"
                        select-class="kld-select"
                        tree-wrap-styles="padding: 10px 0;"
                >
                    <kld-tree
                        slot="tree"
                        ref="section-tree"
                        :data="treeData"
                        title-key="osName"
                        children-key="lists"
                        @current-change="sectionTreeChange"
                        highlight-current
                        first-expanded
                    ></kld-tree>
                </kld-search-tree>
            </div>
            <!-- 右侧列表 -->
            <div class="ael-list">
                <div class="table">
                    <Loading v-if="tableLoading"></Loading>
                    <Table :columns="tableColumns" :data="tableData" class='i-table-stripe' @on-row-click="tableRowClick"></Table>
                    <div style="text-align: center; padding: 14px 0;">
                        <kld-page style="margin-top:10px;" @on-change="getAssetList" :page-size="pageData.size" :total='pageData.total' :current.sync='pageData.current'></kld-page>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="detailsModalShow" :scrollable="true" :width="1246" title="资产折旧详情">
            <div class="details-modal">
                <Loading v-if="detailsModalLoading"></Loading>
                <div class="title">
                    <span>上月折旧明细</span>
                    <!--<a href="javascript:" @click="printDetails">打印详情</a>-->
                </div>
                <Form label-position="top">
                    <Row type="flex" :gutter="20">
                        <i-col span="8">
                            <FormItem label="资产编码：">
                                <i-input :value="detailsData.assetNumber" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="资产名称：">
                                <i-input :value="detailsData.assetName" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="分配时间：">
                                <i-input :value="detailsData.collarTime" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row type="flex" :gutter="20">
                        <i-col span="8">
                            <FormItem label="资产原值（元）：">
                                <i-input :value="detailsData.assetValue" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="累计折旧（元）：">
                                <i-input :value="detailsData.depreciationValueSubtotal" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="净值（元）：">
                                <i-input :value="detailsData.netValue" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row type="flex" :gutter="20">
                        <i-col span="8">
                            <FormItem label="已折旧（月）：">
                                <i-input :value="detailsData.depreciationMonths" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="预计折旧年限（月）：">
                                <i-input :value="detailsData.depreciationAgeLimit" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="折旧方式：">
                                <i-input value="平均年限法" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row type="flex" :gutter="20">
                        <i-col span="8">
                            <FormItem label="月折旧率：">
                                <i-input :value="detailsData.depreciationRate" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="月折旧额（元）：">
                                <i-input :value="detailsData.depreciationValue" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                </Form>
                <div class="title">历史折旧明细</div>
                <Table ref="details-table" highlight-row class="details-table" @on-row-click="detailsRowClick" :columns="detailsTableColumns" :data="detailsTableData"></Table>
                <div class="details-page">
                    <kld-page @on-change="detailsPageChange" :current.sync="detailsPageData.current" :total="detailsPageData.total" :page-size="detailsPageData.pageSize"></kld-page>
                </div>
            </div>
            <div slot="footer">
                <Button class="kld-btn-default" @click="detailsModalCancel">返回</Button>
            </div>
        </Modal>
    </div>
</template>

<style lang="less" scoped>
.depreciation {
}

.search {
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 10px;
    .kld-input,
    .kld-select,
    .kld-date-picker {
        width: 300px;
    }
    .kld-btn {
        margin-left: 10px;
    }
    .ivu-col {
        margin-bottom: 10px;
    }
}
.section-tree {
    /deep/.ivu-poptip-body {
        max-height: 300px;
        overflow: auto;
    }
}

.ael-list-wrap {
    @wrapWidth: 20.5%;
    @wrapHeight: 882px;
    @wrapSpace: 1%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .ael-list-tree {
        width: @wrapWidth;
        height: @wrapHeight;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        /deep/.name-search {
            padding: 20px;
            border-bottom: 1px solid #ccd2d7;
        }
    }
    .ael-list {
        width: 100% - @wrapSpace - @wrapWidth;
        height: @wrapHeight;
        position: relative;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        .table {
            width: 100%;
            height: 100%;
            /deep/.ivu-table-header {
                tr {
                    font-size: 14px;
                    height: 60px;
                }
            }
            /deep/.ivu-table-body {
                tr {
                    height: 70px;
                }
            }
        }
        .loading-page {
            width: 100%;
            height: 100%;
            .demo-spin-icon-load {
                animation: ani-demo-spin 1s linear infinite;
            }
            @keyframes ani-demo-spin {
                from {
                    transform: rotate(0deg);
                }
                50% {
                    transform: rotate(180deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        }
    }
}

.details-modal {
    font-size: 14px;
    position: relative;
    .title {
        color: #f2740c;
        padding: 16px 0;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .ivu-row-flex {
        margin-top: 10px;
    }

    .details-table {
        border-left: 1px solid #dddee1;
        border-top: 1px solid #dddee1;
        margin-top: 20px;
    }

    .details-page {
        text-align: center;
        padding-top: 16px;
    }
}
</style>

<script>
    import kldPage from "@common/page/page.vue";
    import renderEllipsis from "@common/render-ellipsis";
    import KldTreeSelect from '@common/kld-tree-select';
    import KldSearchTree from '@common/kld-search-tree';
    import KldTree from '@common/kld-tree';

    const openDownload = (url, filename) => {
    const downloadLink = document.createElement("a");
    downloadLink.style.position = "absolute";
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};
export default {
    name: "depreciation",
    components: { kldPage , KldTreeSelect, KldSearchTree, KldTree},
    data() {
        return {
            exportExcelLoading: false,
            tableLoading: false,
            tableColumns: [
                {
                    title: "资产名称",
                    render(h, { row: { assetNumber, assetName } }) {
                        return h("div", [
                            h(
                                "p",
                                {
                                    attrs: {
                                        class: "textEllipsis",
                                        title: `资产名称：${assetName}`
                                    },
                                    style: {
                                        color: "#0c8399"
                                    }
                                },
                                assetName
                            ),
                            h(
                                "p",
                                {
                                    attrs: {
                                        class: "textEllipsis",
                                        title: `资产编码：${assetNumber}`
                                    }
                                },
                                assetNumber
                            )
                        ]);
                    }
                },
                {
                    title: "设备型号",
                    render: (h, { row: { assetModel } }) =>
                        renderEllipsis(h, assetModel)
                },
                {
                    title: "设备分类",
                    render: (h, { row: { assetType } }) =>
                        renderEllipsis(h, assetType)
                },
                { title: "资产原值(元)", width: 140, key: "assetValue" },
                { title: "已折旧(月)", width: 140, key: "depreciationMonths" },
                { title: "月折旧额(元)", width: 140, key: "depreciationValue" },
                {
                    title: "累计折旧(元)",
                    width: 140,
                    render(h, { row: { depreciationValueSubtotal } }) {
                        return h(
                            "p",
                            { class: "kld-error" },
                            depreciationValueSubtotal
                        );
                    }
                },
                {
                    title: "净值(元)",
                    width: 140,
                    render(h, { row: { netValue } }) {
                        return h("p", { class: "kld-success" }, netValue);
                    }
                }
            ],
            tableData: [],

            treeData: [],
            treeDataCache: [],

            assetTypeTree: [],

            searchData: {
                keyWord: "",
                departments: "",
                time: "",
                equipmentType: "",
                assetValue: "",
                assetStatu: ""
            },
            pageData: {
                current: 1,
                total: 0,
                pageSize: 10
            },

            detailsModalShow: false,
            detailsData: {
                assetNumber: "",
                assetName: "",

                assetValue: "",
                depreciationValueSubtotal: "",
                netValue: "",
                depreciationMonths: "",

                depreciationRate: "",
                depreciationValue: ""
            },
            detailsTableData: [],
            restDetailsTableData: [],
            detailsTableColumns: [
                {
                    title: "序号",
                    width: 80,
                    render: (h, { index }) => {
                        const { pageSize, current } = this.detailsPageData;

                        return h("span", (current - 1) * pageSize + index + 1);
                    }
                },
                {
                    title: "资产名称",
                    render(h, { row: { assetNumber, assetName } }) {
                        return h("div", [
                            h(
                                "p",
                                {
                                    style: {
                                        color: "#0c8399"
                                    }
                                },
                                assetName
                            ),
                            h("p", assetNumber)
                        ]);
                    }
                },
                {
                    title: "设备型号",
                    width: 100,
                    render: (h, { row: { assetModel } }) =>
                        renderEllipsis(h, assetModel)
                },
                {
                    title: "设备分类",
                    render: (h, { row: { assetType } }) =>
                        renderEllipsis(h, assetType)
                },
                { title: "资产原值(元)", width: 120, key: "assetValue" },
                { title: "已折旧(月)", width: 120, key: "depreciationMonths" },
                { title: "月折旧额(元)", width: 120, key: "depreciationValue" },
                {
                    title: "累计折旧(元)",
                    width: 120,
                    key: "depreciationValueSubtotal"
                },
                { title: "净值(元)", width: 120, key: "netValue" }
            ],
            detailsPageData: {
                pageSize: 5,
                current: 1,
                total: 0
            },
            detailsModalLoading: false
        };
    },
    watch: {
        searchData: {
            deep: true,
            handler() {
                this.pageData.current = 1;
                this.getAssetList();
            }
        }
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.getAssetList();
        this.getSectionTree();
        this.getAssetTypeTree();
    },
    methods: {
        //获取资产列表
        getAssetList() {
            // return console.log(this.searchData);
            this.tableLoading = true;
            return this.$axios
                .post("/depreciation/list", {
                    offset: (this.pageData.current - 1) * 10,
                    limit: this.pageData.pageSize,
                    params: this.searchData
                })
                .then(({ data: { data, recordsTotal } }) => {
                    this.pageData.total = recordsTotal;
                    this.tableData = data;
                })
                .finally(() => (this.tableLoading = false));
        },

        //获取科室树
        getSectionTree() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.treeData = JSON.parse(
                        JSON.stringify(
                            (this.treeDataCache = [data])
                        )
                    );
                });
        },

        //获取院内分类树
        getAssetTypeTree() {
            return this.$axios
                .get('/assetTypes/typeAllTree')
                .then(({ data }) => {
                    this.assetTypeTree = data;
                });
        },

        //重置搜索
        resetSearch() {
            this.$refs["search-form"].resetFields();
            this.$refs['section-tree'].setCurrentKey(null);
        },


        tableRowClick(row) {
            this.detailsModalShow = true;
            this.detailsModalLoading = true;
            this.$axios
                .get(`/depreciation/${row.assetNumber}`)
                .then(({ data }) => {
                    this.detailsData = data.shift() || {};
                    this.restDetailsTableData = data;
                    this.detailsPageData.total = data.length;
                    this.detailsPageData.current = 1;
                    this.detailsPageChange();
                })
                .finally(() => (this.detailsModalLoading = false));
        },

        detailsPageChange() {
            const { current, pageSize } = this.detailsPageData;
            this.detailsTableData = this.restDetailsTableData.slice(
                (current - 1) * pageSize,
                current * pageSize
            );
        },

        printExcel() {
            // this.$refs['download-btn'].download({
            //     url: '/depreciation/excel',
            //     method: 'POST',
            //     data: this.searchData,
            //     responseType: 'blob'
            // });
            if (this.searchData.departments) {
                // headers:{'Content-type': 'multipart/form-data'},
                this.exportExcelLoading = true;
                this.$axios
                    .post("/depreciation/excel", this.searchData, {
                        responseType: "blob"
                    })
                    .then(({ data }) => {
                        this.$Message.success("导出成功");
                        const downloadUrl = URL.createObjectURL(data);
                        openDownload(downloadUrl, "折旧信息.xls");
                        URL.revokeObjectURL(downloadUrl);
                    })
                    .finally(() => (this.exportExcelLoading = false));
            } else {
                this.$Message.warning("请选择科室");
            }
        },

        printDetails() {
            // this.$refs['table'].exportCsv({
            //     columns: [
            //
            //     ]
            // });
        },

        //树被点击时
        sectionTreeChange(data) {
            this.searchData.departments = data ? data.id : '';
        },

        detailsRowClick(row) {
            this.detailsData = row;
        },
        detailsModalCancel() {
            this.detailsModalShow = false;
        }
    }
};
</script>
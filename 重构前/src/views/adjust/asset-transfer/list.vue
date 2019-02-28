<template>
    <div class="borrow-transfer-list">
        <!-- <div class="position-to-title">
            <Button @click="borrowApplyShow = true" class="kld-btn">申请借用</Button>
        </div> -->
        <div class="search kld-box-effect">
            <Form :model="searchData" ref="search-form" >
                <Row type="flex" style="flex-wrap: nowrap;" :gutter="20">
                    <i-col class="grow">
                        <Row class="gutter" type="flex" :gutter="20">
                            <i-col span="8">
                                <FormItem prop="keyword">
                                    <i-input v-model.trim="searchData.keyword" placeholder="设备编码/设备名称/品牌/型号" icon="ios-search-strong" class="kld-input"></i-input>
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="sectionId">
                                    <kld-tree-select
                                            v-model="searchData.sectionId"
                                            :data="sectionTreeData"
                                            title-key="osName"
                                            children-key="lists"
                                            placeholder="所在科室"
                                            filterable
                                            first-expanded
                                    ></kld-tree-select>
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <Row>
                                    <i-col span="11">
                                        <FormItem prop="startTime">
                                            <DatePicker v-model="searchData.startTime" @on-change="searchBytime" placeholder="起始时间" class="kld-date-picker"></DatePicker>
                                        </FormItem>
                                    </i-col>
                                    <i-col style="text-align: center; line-height: 44px;" span="1">
                                        至
                                    </i-col>
                                    <i-col span="11">
                                        <FormItem prop="endTime">
                                            <DatePicker v-model="searchData.endTime" @on-change="searchBytime" placeholder="结束时间" class="kld-date-picker"></DatePicker>
                                        </FormItem>
                                    </i-col>
                                </Row>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="assetTypeId">
                                    <kld-tree-select
                                            v-model="searchData.assetTypeId"
                                            :data="assetTypeData"
                                            title-key="typeName"
                                            children-key="lists"
                                            placeholder="设备分类"
                                            filterable
                                    ></kld-tree-select>
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="assetType">
                                    <Select v-model="searchData.assetType" class="kld-select" placeholder="资产状态">
                                        <Option :value="2">全部</Option>
                                        <Option :value="0">待验收</Option>
                                        <Option :value="1">已验收</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                    </i-col>
                    <i-col class="shrink">
                        <Button @click="resetSearch" class="kld-btn-default">重置</Button>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="c-table kld-box-shadow">
            <Table @on-row-click="jumpTransferDetail" :columns="tableColumns" :data="tableData"></Table>
            <Kloading v-if="!loaded"></Kloading>
            <div class="c-table-page">
                <kld-page @on-change="getTransferListData" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "../common/common";
.borrow-transfer-list {
    .kld-box-shadow {
        position: relative;
    }
}
.section-tree {
    width: 100%;
    /deep/input {
        cursor: pointer;
    }
    /deep/.ivu-poptip-popper {
        width: 100%;
    }
    /deep/.ivu-poptip-rel {
        width: 100%;
    }
    /deep/.ivu-poptip-body {
        max-height: 300px;
        overflow: auto;
    }
    /deep/.ivu-poptip-body-content {
        overflow: initial;
    }
}
</style>

<script>
    import Kloading from "@common/loading/loading";
    import kldPage from "@common/page/page";
    import borrowApply from "../common/borrow-apply";
    import KldTreeSelect from '@common/kld-tree-select';

    export default {
    name: "asset-transfer-list",
    components: { kldPage, borrowApply, Kloading, KldTreeSelect},
    data() {
        return {
            loaded: false,

            sectionTreeData: [],
            assetTypeData: [],
            timer: null,

            tableColumns: [
                {
                    title: "状态",
                    key: "acceptanceType",
                    render: (h, params) => {
                        // console.log(params.column.key)
                        return params.row[params.column.key] == "1"
                            ? h("span", "已验收")
                            : h("span", "待验收");
                    }
                },
                { title: "资产编码", key: "assetCode" },
                { title: "资产名称", key: "assetName" },
                {
                    title: "转移信息",
                    key: "transferInfo",
                    render: (h, params) => {
                        return h("div", [
                            params.row.oldSectionName,
                            h(
                                "span",
                                {
                                    style: {
                                        color: "#01b0c7"
                                    }
                                },
                                "->"
                            ),
                            params.row.sectionName
                        ]);
                    }
                },
                { title: "品牌", key: "brandName" },
                { title: "型号", key: "assetClass" },
                { title: "设备分类", key: "typeName" }
            ],
            tableData: [],

            searchData: {
                startTime: "",
                endTime: "",
                sectionId: "",
                // oldSectionId:'',
                keyword: "",
                assetType: 2,
                assetTypeId: ""
            },
            sectionShow: {
                oldSection: false,
                oldSectionName: "",
            },
            pageData: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    watch: {
        searchData: {
            handler() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.getTransferListData();
                }, 300);
            },
            deep: true
        }
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.getOriginData();
    },
    methods: {
        getOriginData() {
            this.getSectionTree();
            this.getAssetTypeTree();
            this.getTransferListData();
        },
        //获取资产验收列表
        getTransferListData(page = 1) {
            this.pageData.current = page;
            this.loaded = false;
            this.$axios
                .post(`/assetBorrow/assetTransfer/list`, {
                    limit: this.pageData.pageSize,
                    offset:
                        this.pageData.pageSize * (this.pageData.current - 1),
                    params: {
                        keyword: this.searchData.keyword,
                        sectionId: this.searchData.sectionId,
                        // oldSectionId:this.searchData.oldSectionId,
                        startTime: this.searchData.startTime
                            ? this.searchData.startTime
                                  .toLocaleString("zh", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit"
                                  })
                                  .replace(/\//g, "-")
                            : "",
                        endTime: this.searchData.endTime
                            ? this.searchData.endTime
                                  .toLocaleString("zh", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit"
                                  })
                                  .replace(/\//g, "-") + " 23:59:59"
                            : "",
                        assertTypeId: this.searchData.assetTypeId,
                        acceptanceType:
                            this.searchData.assetType == 2
                                ? ""
                                : this.searchData.assetType + ""
                    }
                })
                .then(
                    res => {
                        this.tableData = res.data.data;
                        this.pageData.total = res.data.recordsTotal;
                        this.loaded = true;
                        //    .map(v=>{
                        //        return {
                        //            ...v,
                        //            transferInfo:v.oldSectionName+">"+v.sectionName
                        //        }
                        //    });
                    },
                    error => {
                        this.loaded = true;
                    }
                );
        },
        searchBytime() {
            if (
                this.searchData.startTime > this.searchData.endTime &&
                this.searchData.startTime &&
                this.searchData.endTime
            ) {
                this.$Message.warning("完成时间应比开始时间晚！");
            } else {
                this.getTransferListData();
            }
        },
        //获取科室树
        getSectionTree() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionTreeData = [data];
                });
        },
        //获得院内分类
        getAssetTypeTree() {
            this.$axios
                .get('/assetTypes/typeAllTree')
                .then(({ data }) => {
                    this.assetTypeData = data;
                });
        },


        resetSearch() {
            this.$store.state.reload();
            // this.sectionShow={};
            // this.assetTypeName='';
            // this.searchData = {
            //     startTime:'',
            //     endTime:'',
            //     sectionId:'',
            //     // oldSectionId:'',
            //     keyword:'',
            //     assetType:2,
            //     assetTypeId:''
            // }
        },

        jumpTransferDetail(row) {
            if (!this.ViewLimit("section:query")) {
                this.$Message.warning("对不起，你没有权限查看该详情");
                return;
            }
            this.$router.push({
                name: "transfer-detail",
                query: { id: row.id }
            });
        }
    }
};
</script>
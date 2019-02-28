<template>
    <div class="borrow-apply-list">
        <div class="position-to-title">
            <Button v-if='ViewLimit("borrow:apply")'
                    @click="borrowApplyShow = true"
                    class="kld-btn">申请借用</Button>
        </div>
        <div class="search kld-box-effect borrow-search">
            <Form :model="searchData"
                  ref="search-form">
                <Row :type="'flex'"
                     :gutter="20">
                    <i-col class="grow">
                        <Row class="gutter"
                             :type="'flex'"
                             :gutter="20">
                            <i-col span="8">
                                <FormItem prop="keyword">
                                    <i-input v-model.trim="searchData.keyword"
                                             placeholder="设备编码/设备名称/品牌/型号"
                                             icon="ios-search-strong"
                                             class="kld-input"></i-input>
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="departmentId">
                                    <kld-tree-select v-model="searchData.departmentId"
                                                     :data="sectionTreeData"
                                                     title-key="osName"
                                                     children-key="lists"
                                                     placeholder="所在科室"
                                                     filterable
                                                     first-expanded></kld-tree-select>
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="typeId">
                                    <kld-tree-select v-model="searchData.typeId"
                                                     :data="classifyData"
                                                     title-key="typeName"
                                                     children-key="lists"
                                                     placeholder="所在分类"
                                                     filterable></kld-tree-select>
                                </FormItem>
                            </i-col>

                            <i-col span="8">
                                <FormItem prop='startTime'>
                                    <Row>
                                        <i-col span="10"
                                               class="reset-time">
                                            <DatePicker :options='startOpt'
                                                        :value="searchData.startTime"
                                                        @on-change="searchData.startTime = $event"
                                                        placeholder="开始时间"
                                                        class="kld-date-picker"></DatePicker>
                                        </i-col>
                                        <i-col style="text-align: center; line-height: 44px;"
                                               span="2">
                                            至
                                        </i-col>
                                        <i-col span="10">
                                            <DatePicker :options='endOpt'
                                                        :value="searchData.endTime"
                                                        @on-change="searchData.endTime = $event"
                                                        placeholder="结束时间"
                                                        class="kld-date-picker"></DatePicker>
                                        </i-col>
                                    </Row>
                                </FormItem>
                            </i-col>
                        </Row>
                    </i-col>
                    <i-col class="shrink">
                        <Button @click="resetSearch"
                                class="kld-btn-default">重置</Button>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="c-table">
            <loading v-if="loadShow"></loading>
            <Table @on-row-click="goToApply"
                   :columns="tableColumns"
                   :data="tableData"></Table>

            <div class="table-page">
                <kld-page @on-change="getBorrowListData"
                          :current.sync="pageData.current"
                          :total="pageData.total"
                          :page-size="pageData.pageSize"></kld-page>
            </div>
        </div>
        <borrow-apply v-model="borrowApplyShow"
                      @on-resolve="getBorrowListData"></borrow-apply>
    </div>
</template>
<script>
import kldPage from "@common/page/page";
import borrowApply from "../common/borrow-apply";
import moment from "moment";
import loading from "@common/loading/loading.vue";
import KldTreeSelect from "@common/kld-tree-select";

export default {
    name: "borrow-apply-list",
    components: { KldTreeSelect, kldPage, borrowApply, loading },
    data() {
        return {
            loadShow: false,
            searchData: {
                keyword: "",
                departmentId: "",
                typeId: "",
                startTime: "",
                endTime: ""
            },
            borrowApplyShow: false,
            sectionTreeData: [],
            classifyData: [],

            tableColumns: [
                {
                    title: "借用时间",
                    key: "ratifyTime",
                    width: 210,
                    //width: 150,
                    render(
                        h,
                        {
                            row: { ratifyTime }
                        }
                    ) {
                        return h(
                            "span",
                            {},
                            moment(ratifyTime).format("YYYY-MM-DD HH:mm")
                        );
                    }
                },
                {
                    title: "状态",
                    //width: 100,
                    render(
                        h,
                        {
                            row: { type }
                        }
                    ) {
                        return h(
                            "span",
                            {},
                            type === 0 ? "借出" : type === 1 ? "借入" : ""
                        );
                    }
                },
                {
                    title: "资产编码",
                    key: "assetCode"
                    //width: 150
                },
                {
                    title: "资产名称",
                    width: 200,
                    render(h, { row }) {
                        return h(
                            "span",
                            {
                                style: {
                                    color: "#0c8399"
                                }
                            },
                            row.assetName
                        );
                    }
                },
                { title: "品牌", width: 120, key: "brandName" },
                {
                    title: "型号",
                    key: "assetClass"
                    //width: 150
                },
                { title: "设备分类", width: 120, key: "atName" },
                {
                    title: "资产位置",
                    // width: 200,
                    key: "sectionName",
                    render(h, { row }) {
                        return h("div", {}, [
                            h("span", {}, row.sectionName),
                            h(
                                "span",
                                {
                                    style: {
                                        color: "#0c8399"
                                    }
                                },
                                "->"
                            ),
                            h("span", {}, row.osName)
                        ]);
                    }
                },
                {
                    title: "费用类型",
                    key: "charge",
                    // width: 100,
                    render(h, { row }) {
                        return h(
                            "div",
                            {
                                style: {
                                    color:
                                        row.charge !==
                                        ("" || "0" || null || undefined)
                                            ? "#e7485a"
                                            : ""
                                }
                            },
                            row.charge === undefined || row.charge === null
                                ? ""
                                : row.charge === "0"
                                    ? "无偿"
                                    : `￥${row.charge}`
                        );
                    }
                }
            ],
            startOpt: {
                disabledDate: date => {
                    if (this.searchData.endTime !== "") {
                        return (
                            date &&
                            date.valueOf() >
                                new Date(this.searchData.endTime).valueOf()
                        );
                    }
                }
            },
            endOpt: {
                disabledDate: date => {
                    if (this.searchData.startTime !== "") {
                        return (
                            date &&
                            date.valueOf() <
                                new Date(
                                    this.searchData.startTime + " 00:00:00"
                                ).valueOf()
                        );
                    }
                }
            },

            tableData: [],

            pageData: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    watch: {
        searchData: {
            handler(searchData) {
                this.pageData.current = 1;
                this.getBorrowListData();
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
        this.getSectionTree();
        this.getClassfiy();
        this.getBorrowListData();
        if (this.$store.state.user_in.roles[0].srName !== "DOCTOR") {
            this.tableColumns.splice(1, 1);
        }
    },
    methods: {
        getBorrowListData() {
            this.loadShow = true;
            this.$axios
                .post(`/assetBorrow/listAssetBorrow`, {
                    limit: 10,
                    offset: (this.pageData.current - 1) * 10,
                    params: this.searchData
                })
                .then(({ data }) => {
                    this.tableData = data.data;
                    this.pageData.total = data.recordsTotal;
                })
                .finally(() => {
                    this.loadShow = false;
                });
        },
        getSectionTree() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionTreeData = [data];
                });
        },
        getClassfiy() {
            this.$axios.get("/assetTypes/typeAllTree").then(({ data }) => {
                this.classifyData = data;
            });
        },

        resetSearch() {
            //window.location.replace(window.location.href);
            this.searchData.endTime = "";
            this.$refs["search-form"].resetFields();
        },

        goToApply(row) {
            if (!this.ViewLimit("borrow:query")) {
                this.$Message.warning("对不起，您没权限查看详情");
                return;
            }
            if (row.returnType === 0) {
                this.$router.push({
                    name: "borrow-detail",
                    query: {
                        id: row.id,
                        assetId: row.assetId,
                        brandName: row.brandName,
                        atName: row.atName
                    }
                });
            } else {
                this.$router.push({
                    name: "borrow-accept",
                    query: {
                        id: row.id,
                        assetId: row.assetId,
                        brandName: row.brandName,
                        atName: row.atName
                    }
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../common/common";
.borrow-apply-list {
}
.section-tree {
    width: 100%;
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
}
.borrow-search {
    .reset-time {
        padding-left: 0 !important;
    }
}
.table-page {
    text-align: center;
    margin: 8px 0;
}
.c-table {
    position: relative;
}
</style>
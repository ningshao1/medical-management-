<template>
    <div
        class="asset-list-wrap"
        v-load="loading"
    >
        <div class="asset-list-search-bar full-width">
            <kld-crad noheader>
                <table-wrap
                    @fresh="reset"
                    :search.sync="search.keyword"
                    :matchAmount="page.total"
                    @search-advanced="updateSearch"
                >
                    <template slot="header">
                        <el-button @click="$router.push({name:'asset-add'})">
                            新增资产
                        </el-button>
                    </template>
                    <el-form
                        :model="searchAdvamced"
                        slot="search-advanced"
                        label-width="138px"
                        label-position="left"
                    >
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item prop="warrantyStatus">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        保修状态：
                                    </div>
                                    <el-select
                                        v-model="searchAdvamced.warrantyStatus"
                                        placeholder="选择保修状态"
                                    >
                                        <el-option
                                            v-for="({value,label},i)  of warrantyStatusList"
                                            :key='i'
                                            :value="value"
                                            :label="label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="consummate">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        信息完善状态：
                                    </div>
                                    <el-select
                                        v-model="searchAdvamced.consummate"
                                        placeholder="选择信息完善状态"
                                    >
                                        <el-option
                                            v-for="({value,label},i) of consummateList"
                                            :key='i'
                                            :value="value"
                                            :label="label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="used">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        资产状态：
                                    </div>
                                    <el-select
                                        v-model="searchAdvamced.used"
                                        placeholder="选择资产状态"
                                    >
                                        <el-option
                                            v-for="({value,label},i) of usedList"
                                            :key='i'
                                            :value="value"
                                            :label="label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="pictureStatus">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        有无设备图片：
                                    </div>
                                    <el-select
                                        v-model="searchAdvamced.pictureStatus"
                                        placeholder="有无设备图片"
                                    >
                                        <el-option
                                            v-for="({value,label},i) of pictureStatusList"
                                            :key='i'
                                            :value="value"
                                            :label="label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="associate">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        设备分类关联情况：
                                    </div>
                                    <el-select
                                        v-model="searchAdvamced.associate"
                                        placeholder="设备分类关联情况"
                                    >
                                        <el-option
                                            v-for="({value,label},i) of associateList"
                                            :key='i'
                                            :value="value"
                                            :label="label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="assetLabelType">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        设备标签粘贴情况：
                                    </div>
                                    <el-select
                                        v-model="searchAdvamced.assetLabelType"
                                        placeholder="设备标签粘贴情况"
                                    >
                                        <el-option
                                            v-for="({value,label},i) of assetLabelTypeList"
                                            :key='i'
                                            :value="value"
                                            :label="label"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="departmentId">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        所属科室：
                                    </div>
                                    <tree-select
                                        v-model="searchAdvamced.departmentId"
                                        placeholder="请选择所属科室"
                                        :data='departmentTree'
                                        :props='{label:"osName"}'
                                        first-expand
                                    ></tree-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item prop="assertTypeId">
                                    <div
                                        slot='label'
                                        class="full-width"
                                    >
                                        设备分类：
                                    </div>
                                    <tree-select
                                        v-model="searchAdvamced.assertTypeId"
                                        placeholder="请选择设备分类"
                                        :data='assetTypeTree'
                                        leaf-only
                                        code-prefix
                                    ></tree-select>
                                </el-form-item>
                            </el-col>

                        </el-row>
                    </el-form>
                    <asset-table
                        @row-click="handlerRowClick"
                        :asset-table="assetTable"
                    ></asset-table>
                    <div class="pagination-warp full-width flex justify-content-end mt-10">

                        <el-pagination
                            :page-size="page.pageSize"
                            :current-page="page.currentPage"
                            @current-change="pageChange"
                            :total="page.total"
                        ></el-pagination>
                    </div>

                </table-wrap>
            </kld-crad>
        </div>

    </div>
</template>
<script>
import {Common as mixin} from "@/mixins";
import { Portal } from "portal-vue";
import TableWrap from "@c/TableWrap";
import TreeSelect from "@c/TreeSelect";
import KldCrad from "@c/KldCard";
import AssetTable from "./asset-table";
export default {
    name: "asset-list",
    components: { Portal, TableWrap, TreeSelect, KldCrad, AssetTable },
    mixins: [mixin],
    props: {},
    data() {
        return {
            page: {
                pageSize: 10,
                total: 0,
                currentPage: 1
            },
            search: {
                //关键字
                keyword: null
            },
            loading: false,
            assetTable: [],
            advamcedItems: {},
            departmentTree: [],
            assetTypeTree: [],
            searchAdvamced: {
                //保修状态
                warrantyStatus: null,
                //信息完善状态
                consummate: null,
                //资产状态
                used: null,
                //有无设备图片
                pictureStatus: null,
                //设备关联状态
                associate: null,
                //科室id
                departmentId: this.$store.state.userInfo.osId,
                //设备分类Id
                assertTypeId: null,
                //资产标签粘贴
                assetLabelType: null
            },
            warrantyStatusList: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: "1",
                    label: "保内"
                },
                {
                    value: "2",
                    label: "已出保"
                }
            ],
            consummateList: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: "1",
                    label: "完善"
                },
                {
                    value: "2",
                    label: "未完善"
                }
            ],
            usedList: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: "0",
                    label: "闲置"
                },
                {
                    value: "1",
                    label: "在用"
                },
                {
                    value: "3",
                    label: "备用机"
                },
                {
                    value: "4",
                    label: "待用"
                }
            ],
            pictureStatusList: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: "1",
                    label: "有设备图片"
                },
                {
                    value: "0",
                    label: "无设备图片"
                }
            ],
            associateList: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: "1",
                    label: "已关联"
                },
                {
                    value: "2",
                    label: "未关联"
                }
            ],
            assetLabelTypeList: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: "1",
                    label: "已贴"
                },
                {
                    value: "2",
                    label: "未贴"
                }
            ]
        };
    },
    computed: {
        searchItems() {
            return {
                ...this.search,
                ...this.advamcedItems
            };
        }
    },
    created() {
        this.loadOrigin();
        this.pageChange();
    },
    methods: {
        loadOrigin() {
            this.loadDepartment();
            this.loadCountryType();
        },
        async loadCountryType() {
            this.assetTypeTree = await this.$store.dispatch("loadCountryType");
        },
        async loadDepartment() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.departmentTree = [data];
        },
        reset() {},
        updateSearch(searchAdvamced) {
            this.advamcedItems = { ...searchAdvamced };
        },
        pageChange(page = 1) {
            this.page.currentPage = page;
            this.querySearch();
        },
        async querySearch() {
            this.loading = true;
            try {
                const url = `assets/${this.osId}/list`;
                const { pageSize, currentPage } = this.page;
                const request = {
                    limit: pageSize,
                    offset: pageSize * (currentPage - 1),
                    params: this.searchItems
                };
                const {
                    data: { data, recordsFiltered }
                } = await this.$axios.post(url, request);
                this.page.total = recordsFiltered;
                this.assetTable = data || [];
            } finally {
                this.loading = false;
            }
        },
        assetTableFormat(assetTable) {
            return assetTable.map(row => {
                let { labels, ...others } = row;
                return {
                    ...others,
                    labels: (labels && labels.filter(v => v)) || []
                };
            });
        },
        handlerRowClick(row, event, column) {
            const { id } = row;
            this.$router.push({ name: "asset-details", params: { id } });
        }
    },
    watch: {
        searchItems: {
            handler(searchItems) {
                this.pageChange();
            },
            deep: true
        }
    }
};
</script>
<style lang="less" scoped>
.asset-list-wrap {
    .asset-list-search-bar {
    }
}
</style>
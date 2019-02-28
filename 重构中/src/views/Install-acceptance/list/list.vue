<template>
    <div class="install-list"
         v-load='loading'>
        <kld-card noheader>
            <kld-table-wrap :search.sync="search.keyword"
                            @fresh="getList">
                <template slot="header">

                    <el-button size="mini"
                               jump='install-detail'>新增</el-button>

                </template>
                <el-form :model="advancedSearch"
                         slot="search-advanced"
                         label-width="85px"
                         label-position="left">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="品牌："
                                          prop="brandId">
                                <el-select placeholder="请输入品牌名称"
                                           v-model="advancedSearch.brandId"
                                           filterable
                                           remote
                                           reserve-keyword
                                           :remote-method="getBrandList"
                                           :loading='brandLoading'>
                                    <el-option v-for="item in brandList"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="开始时间："
                                          prop="startTime">
                                <el-date-picker v-model="advancedSearch.startTime"
                                                value-format="yyyy-MM-dd"
                                                placeholder="安装开始时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="结束时间："
                                          prop="endTime">
                                <el-date-picker value-format="yyyy-MM-dd"
                                                v-model="advancedSearch.endTime"
                                                placeholder="安装结束时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="科室名称："
                                          prop="departmentId">
                                <tree-select placeholder='请输入科室名称'
                                             v-model="advancedSearch.departmentId"
                                             :data='treeData'
                                             :props="{
                                                 label:'osName',
                                                 children:'lists'
                                             }"
                                             node-key='id'
                                             firstExpand>
                                </tree-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </kld-table-wrap>
            <el-table :data='data'
                      @row-click='rowClick'
                      :row-style='{
                          cursor: "pointer"
                      }'>
                <el-table-column label='资产编码'
                                 prop="assetCode"
                                 min-width='20%'>
                </el-table-column>
                <el-table-column label='资产名称'
                                 prop="assetName"
                                 min-width='30%'>
                </el-table-column>
                <el-table-column label='品牌'
                                 prop="brandName"
                                 min-width='10%'>
                </el-table-column>
                <el-table-column label='安装科室'
                                 prop="osName"
                                 min-width='10%'>
                </el-table-column>
                <el-table-column label='安装时间'
                                 prop='collarTime'
                                 min-width='10%'>
                </el-table-column>
                <el-table-column label='标书'
                                 prop='tbtype'
                                 min-width='10%'>
                    <template slot-scope="scope">
                        {{scope.row.tbtype===1?"有标书":"无标书"}}
                    </template>
                </el-table-column>
                <el-table-column label='验收报告'
                                 prop='actype'
                                 min-width='10%'>
                    <template slot-scope="scope">
                        {{scope.row.actype===1?"有验收报告":"无验收报告"}}
                    </template>
                </el-table-column>
            </el-table>
        </kld-card>
        <el-pagination class="text-right pt-10"
                       :current-page.sync="page.current"
                       :total="page.total"
                       :page-size="page.size"
                       @current-change="getList">
        </el-pagination>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { List } from "@/mixins";
import { TableWrap, KldCard, TreeSelect } from "@/components";
export default {
    name: "list",
    props: {
        type: {
            type: String,
            default: "1"
        }
    },
    mixins: [List],
    components: {
        [KldCard.name]: KldCard,
        [TreeSelect.name]: TreeSelect,
        [TableWrap.name]: TableWrap
    },
    data() {
        return {
            search: {
                keyword: null,
                type: this.type
            },
            advancedSearch: {
                startTime: null,
                endTime: null,
                brandId: null,
                departmentId: null
            },
            settings: false,
            brandList: [],
            brandLoading: false,
            treeData: []
        };
    },

    computed: {
        url() {
            return `/assetacceptance/list`;
        },
        hospitalId() {
            return this.$store.state.userInfo.osId;
        }
    },
    watch: {
        "advancedSearch.departmentId"(val) {}
    },
    created() {
        this.getList();
        this.getSectionData();
    },
    methods: {
        getBrandList(query) {
            this.brandLoading = true;
            this.$axios
                .post(`assertBrandcopys/${this.hospitalId}/list`, {
                    limit: 1000,
                    offset: 0,
                    params: {
                        keyword: query
                    }
                })
                .then(({ data: { data } }) => {
                    const brandList = data.map(item => {
                        return {
                            value: item.brandId,
                            label: item.brandName
                        };
                    });
                    brandList.unshift({
                        value: null,
                        label: "全部"
                    });
                    this.brandList = brandList;
                })
                .finally(() => {
                    this.brandLoading = false;
                });
        },
        rowClick(item) {
            if (!item) return;
            var step = 0;
            if (this.type === "0" && item.type < 2) {
                step = item.type + 1;
            } else if (this.type === "1" && item.type == 3) {
                step = 2;
            } else if (step === 0) {
                return;
            }
            this.$router.push({
                name: "install-detail",
                query: {
                    step,
                    date: item.collarTime,
                    name: item.osName,
                    id: item.id
                }
            });
        },
        getSectionData() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.hospitalId}`)
                .then(({ data }) => {
                    this.treeData = [data];
                });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
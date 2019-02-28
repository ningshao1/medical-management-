<template>
    <div class='benefit-ananlysis-home-warp'>
        <div class="benefit-bar">
            <div>
                <bar-echarts></bar-echarts>
            </div>
            <div>
                <fallout-chart></fallout-chart>
            </div>
        </div>
        <div class="search-bar">
            <i-row :gutter='10'>
                <i-col :span="5">
                    <i-input class="kld-input"
                             :placeholder="'请输入关键字:资产名称'"
                             clearable
                             v-model="searchData.keyword"></i-input>
                </i-col>
                <i-col :span="4">
                    <kld-input-number :placeholder="'请输入阳性率'"
                                      :max='100'
                                      :min='0'
                                      :number='true'
                                      class='pr-input'
                                      ref="positive-rate"
                                      v-model="searchData.positiveRate">
                        <span slot='prepend'>阳性率</span>
                        <span slot="append">%</span>
                        <Select v-model="searchData.positiveRateType "
                                class="kld-select append-select"
                                slot="append"
                                style="width: 60px">
                            <Option :value="1"
                                    :disabled='searchData.positiveRate===100'>以上</Option>
                            <Option :value="2"
                                    :disabled='searchData.positiveRate===0'>以下</Option>
                        </Select>
                    </kld-input-number>
                </i-col>
            </i-row>
        </div>
        <i-row type="flex"
               justify='space-between'
               class-name="benefit-ananlysis-content">
            <i-col style="width:315px;"
                   class-name='select-trees-warp'>
                <Tabs value="name1"
                      type="card"
                      class="select-trees"
                      v-model="TabName">
                    <TabPane label="科室列表"
                             name="name1"
                             class="department-tree-wrap">
                        <kld-search-tree placeholder="科室名称搜索">
                            <kld-tree slot="tree"
                                      :only-leaf='true'
                                      ref='department-tree'
                                      :data="departmentTree"
                                      :current.sync="searchData.departmentId"
                                      title-key="osName"
                                      children-key="lists"
                                      highlight-current
                                      first-expanded>
                            </kld-tree>
                        </kld-search-tree>
                    </TabPane>
                    <TabPane label="分类列表"
                             name="name2"
                             class="country-tree-wrap">
                        <kld-search-tree placeholder="分类名称搜索">
                            <!-- <kld-tree slot="tree" :data="hosTypeTree" :current.sync="searchData.hosTypeId" title-key="typeName" children-key="lists" highlight-current > -->
                            <kld-tree slot="tree"
                                      :only-leaf='true'
                                      ref='country-tree'
                                      :data="initializeID||TabName==='name2'?countryTree:[]"
                                      :current.sync="searchData.countryId"
                                      title-key="typeName"
                                      children-key="lists"
                                      highlight-current>
                            </kld-tree>
                        </kld-search-tree>
                    </TabPane>
                </Tabs>
            </i-col>
            <i-col style="width:calc(100% - 325px);"
                   class-name="benefit-ananlysis-list">
                <table class="benefit-ananlysis-table">
                    <thead>
                        <tr>
                            <th>设备名称</th>
                            <th>所属科室</th>
                            <th>分类</th>
                            <th style="width:160px">阳性率</th>
                            <!-- <th>效益分析</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(v,i) of assetList"
                            :key="v.id"
                            style="cursor:pointer;"
                            @click='jumpDetail(v)'>
                            <td>
                                <div v-ellipsis-tooltip="v.assetName">

                                    {{v.assetName}}
                                </div>
                            </td>
                            <td style="width:200px;">
                                <div v-ellipsis-tooltip="v.osName">
                                    {{v.osName}}
                                </div>
                            </td>
                            <td>
                                <div v-ellipsis-tooltip="v.typeName">
                                    {{v.typeName}}
                                </div>
                            </td>
                            <td>
                                {{Math.round((v.positiveRate||0)*100)}}%
                            </td>
                            <!-- <td>
                                <Avatar>经</Avatar>
                                <Avatar>社</Avatar>
                            </td> -->
                        </tr>
                        <tr v-if='!assetList.length'>
                            <td colspan="5"
                                style="text-align:center;">暂无设备</td>
                        </tr>
                    </tbody>
                </table>
                <kld-page :current='page.current'
                          :total="page.total"
                          :page-size="page.pageSize"
                          @on-change='getAssetList'
                          style='margin-top:15px;'></kld-page>
                <kld-loading v-if="!!assetListLoading"></kld-loading>
            </i-col>
        </i-row>

    </div>
</template>
<script>
// const bar = () => import("./echarts/bar");
// const FalloutChart = () => import("./echarts/fallout-chart");
import bar from "./echarts/bar";
import FalloutChart from "./echarts/fallout-chart";
const KldSearchTree = () => import("@common/kld-search-tree");
import kldTree from "@common/kld-tree";
import kldPage from "@common/page";
import kldInputNumber from "@common/kld-input-number";
import kldLoading from "@common/loading/loading";
export default {
    name: "benefit-ananlysis-home",
    data() {
        return {
            TabName: "name1",
            initializeID: 0, //是否已经初始化一次
            initing: false,
            searchData: {
                departmentId: "",
                hosTypeId: "",
                countryId: "",
                keyword: "",
                positiveRate: 0,
                positiveRateType: 1
            },
            departmentTree: [], //科室树
            hosTypeTree: [], //院内分类树
            countryTree: [], //国家分类树
            assetList: [], //设备列表
            assetListLoading: 0,
            page: {
                total: 0,
                current: 1,
                pageSize: 10
            },
            cancelToken: null
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === "benefit-analysis") {
                vm.getAssetList(vm.page.current);
            }
        });
    },
    methods: {
        init() {
            this.initing = true;
            this.loadDepartmentTree();
            //   this.loadHosTypeTree();
            this.loadCountryTree();

            this.getAssetList();
        },
        loadDepartmentTree() {
            this.$store.dispatch("loadDepartmentTree", true).then(res => {
                this.departmentTree = [res.data];
            });
        },
        // loadHosTypeTree() {
        //   this.$store.dispatch("loadHosTypeTree", true).then(res => {
        //     this.hosTypeTree=res.data||[];
        //   });
        // },
        loadCountryTree() {
            this.$store.dispatch("loadCountryTree", true).then(res => {
                this.countryTree = res.data || [];
            });
        },

        getAssetList(page = 1) {
            if (this.cancelToken) {
                this.cancelToken();
            }
            this.page.current = page;
            const requestBody = {
                limit: this.page.pageSize,
                offset: (this.page.current - 1) * this.page.pageSize,
                params: {
                    hospId: this.$store.state.user_in.osId || "",
                    keyword: this.searchData.keyword.trim() || "",
                    assetTypeId: this.searchData.countryId || "",
                    sectionId: this.searchData.departmentId || "",
                    positiveRate: this.searchData.positiveRate / 100,
                    positiveRateType: this.searchData.positiveRateType
                }
            };
            const config = {
                cancelToken: new this.$axios.CancelToken(c => {
                    // executor 函数接收一个 cancel 函数作为参数
                    this.cancelToken = c;
                })
            };

            this.assetListLoading++;
            this.$axios
                .post(`/cba/assetList`, requestBody, config)
                .then(res => {
                    this.assetList = res.data.data || [];
                    this.page.total = res.data.recordsTotal;
                })
                .finally(() => {
                    this.assetListLoading--;
                    this.initing = false;
                });
        },
        jumpDetail(assetInfo) {
            this.$router.push({
                name: "benefit-analysis-detail",
                query: { id: assetInfo.id }
            });
        }
    },
    watch: {
        searchData: {
            handler(val) {
                if (this.initing) {
                    return;
                }
                // if(val.departmentId){
                //   let node=this.$refs['department-tree'].getNode(val.departmentId);
                //   if(node.childNodes.length)return;
                // }
                if (val.countryId) {
                    let node = this.$refs["country-tree"].getNode(
                        val.countryId
                    );
                    if (node.childNodes.length) return;
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.getAssetList();
                }, 200);
            },
            deep: true
        },
        "searchData.positiveRate": {
            handler(value) {
                if (value === 0) {
                    this.searchData.positiveRateType = 1;
                }
                if (value === 100) {
                    this.searchData.positiveRateType = 2;
                }
            }
        },
        TabName() {
            this.initializeID = 1;
        }
    },
    created() {
        this.init();
    },
    components: {
        kldTree,
        kldLoading,
        KldSearchTree,
        kldPage,
        kldInputNumber,
        "bar-echarts": bar,
        // [bar.name]: bar,
        FalloutChart
    }
};
</script>
<style lang="less" scoped>
.benefit-ananlysis-home-warp {
    .border() {
        border: 1px solid #dddee1;
    }
    .search-bar {
        //搜索栏
        background: rgb(250, 250, 250);
        width: 100%;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        padding: 20px;
        margin-top: 20px;
        /deep/.pr-input {
            .append-select {
                .ivu-select-selection:hover {
                    border-color: transparent;
                }
            }
            .ivu-input {
                text-align: right;
            }
        }
    }
    .benefit-ananlysis-content {
        height: 1000px;
        margin: 20px 0 10px;
        .select-trees-warp {
            height: 100%;
            .select-trees {
                height: 100%;
                /deep/.ivu-tabs-content {
                    height: calc(100% - 55px);
                    .ivu-tabs-tabpane{
                    height: 100%;
                    .border();
                    background-color: #fafafa;
                        box-shadow: none;
                    }
                }
                .department-tree-wrap {
                    height: calc(100% - 52px);
                    overflow: auto;
                }
            }
        }
        .benefit-ananlysis-list {
            .border() ;
            background-color: rgb(250, 250, 250);
            position: relative;
            /deep/.benefit-ananlysis-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                td,
                th {
                    border-bottom: 1px solid rgba(2, 31, 57, 0.1);
                    padding: 0 10px;
                    text-align: left;
                    height: 60px;
                }
                tbody {
                    tr {
                        cursor: pointer;
                        &:hover td {
                            background-color: #ebf7ff;
                        }
                    }
                }
            }
        }
    }
    .benefit-bar {
        display: flex;
        > div {
            padding: 0 8px;
            width: 50%;
        }
    }
}
</style>


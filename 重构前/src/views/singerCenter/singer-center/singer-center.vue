<template>
    <div class="singer-center">
        <i-form ref="search-form"
                :model="search">

            <i-button @click='jumpCreateSinger'
                      class="kld-btn jump-btn"
                      icon="plus"
                      v-if="checkLimit('fr:add')">新增报单</i-button>
            <div class="search-bar">
                <i-row :gutter='20'>
                    <i-col :span="6">
                        <form-item prop="keyword">
                            <i-input class="kld-input"
                                     v-model="search.keyword"
                                     icon="ios-search"
                                     placeholder="请输入关键字"></i-input>
                        </form-item>
                    </i-col>
                    <i-col :span="6">
                        <form-item prop="warrantyStatus">
                            <i-select class="kld-select"
                                      v-model="search.warrantyStatus"
                                      placeholder="保修状态">
                                <i-option v-for="(v,i) of warrantyStatusList"
                                          :key="i"
                                          :value="v.value">{{v.label}}</i-option>

                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="6">
                        <form-item prop="repairType">
                            <i-select class="kld-select"
                                      v-model="search.repairType"
                                      placeholder="报单进程">
                                <i-option v-for="(v,i) of repairTypeList"
                                          :key="i"
                                          :value="v.value">{{v.label}}</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="6">
                        <form-item prop="used">
                            <i-select class="kld-select"
                                      v-model="search.used"
                                      placeholder="资产状态">
                                <i-option v-for="(v,i) of usedList"
                                          :key="i"
                                          :value="v.value">{{v.label}}</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                </i-row>
                <i-row :gutter='20'>
                    <i-col :span='6'>
                        <form-item prop="purchaseMount">
                            <i-select class="kld-select"
                                      v-model="search.purchaseMount"
                                      placeholder="资产价值">
                                <i-option v-for="(v,i) of purchaseMountList"
                                          :key="i"
                                          :value="v.value">{{v.label}}</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span='8'>
                        <div class="date-range-wrap">
                            <form-item prop="startTime">
                                <date-picker class="kld-date-picker"
                                             v-model="search.startTime"
                                             placeholder="报单开始时间"
                                             :options="startTimeOptions"
                                             :editable="false"></date-picker>
                            </form-item>
                            <span style="padding:5px;">至</span>
                            <form-item prop="endTime">
                                <date-picker class="kld-date-picker"
                                             v-model="search.endTime"
                                             placeholder="报单结束时间"
                                             :options="endTimeOptions"
                                             :editable="false"></date-picker>
                            </form-item>

                        </div>
                    </i-col>
                </i-row>
                <div class="search-button">
                    <i-button class='kld-btn-default'
                              style='margin-right:15px;'
                              @click="reSearch">
                        重置
                    </i-button>
                    <i-button class="kld-btn"
                              icon="ios-search"
                              @click="doSearch">
                        检索
                    </i-button>
                </div>
            </div>
            <div class="singer-center-content">
                <div class="department-tree">
                    <form-item prop='orgstructId'
                               class="tree-form-item">

                        <kld-side-tree v-model="search.orgstructId"
                                       :props="{label:'osName'}"
                                       :data='departmentTree'
                                       placeholder="科室名称"
                                       first-expand
                                       :large-input='false'
                                       show-input></kld-side-tree>
                    </form-item>
                </div>
                <div class="asset-list-wrap">
                    <Tabs value="all"
                          type='card'
                          class="tabs-wrap">
                        <TabPane :label="tabPaneLabel('singerAll','全部报单')"
                                 name="all">
                            <singer-table :singer-list-info="singerAll"
                                          @row-in-click="jumpDetail"></singer-table>
                            <kld-page :current="singerAll.currentPage"
                                      :total="singerAll.total"
                                      :page-size="singerAll.size"
                                      @on-change="loadSingerList(singerAll,$event)">
                            </kld-page>
                        </TabPane>
                        <TabPane :label="tabPaneLabel('singerMine','我的报单')"
                                 name="mine">

                            <singer-table :singer-list-info="singerMine"
                                          @row-in-click="jumpDetail"></singer-table>
                            <kld-page :current="singerMine.currentPage"
                                      :total="singerMine.total"
                                      :page-size="singerMine.size"
                                      @on-change="loadSingerList(singerMine,$event)"></kld-page>
                        </TabPane>
                    </Tabs>

                </div>
            </div>
        </i-form>
    </div>
</template>
<script>
import kldSideTree from "@common/kld-side-tree";
// import simpleTable from "../components/simple-table";
import singerTable from "./singer-table.vue";
import kldPage from "@common/page/page.vue";
export default {
    name: "singer-center",
    components: {
        kldSideTree,
        // simpleTable,
        singerTable,
        kldPage
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === "singer-detail") {
                vm.loadSingerList(vm.singerAll);
                vm.loadSingerList(vm.singerMine);
            }
        });
    },
    data() {
        const columns = [
            {
                key: "assetName",
                label: "设备名称",
                width: "20%"
            },
            {
                key: "assetInfo",
                label: "设备信息",
                width: "20%"
            },
            {
                key: "osName",
                label: "所属科室"
            },
            {
                key: "typeName",
                label: "分类"
            },
            {
                key: "reportDate",
                label: "报单时间",
                width: "130px"
            },
            {
                key: "finishTime",
                label: "维修报告提交时间",
                width: "130px"
            },
            {
                key: "userName",
                label: "工程师",
                width: "100px"
            },
            {
                key: "type",
                label: "进程",
                width: "80px"
            }
        ];
        class singerTemp {
            constructor(userId) {
                this.columns = columns;
                this.data = [];
                this.cancelToken = null;
                this.loading = false;
                this.userId = userId;
                this.currentPage = 1;
                this.size = 10;
                this.total = 0;
            }
        }
        return {
            search: {
                //关键词
                keyword: "",
                //保修状态
                warrantyStatus: "",
                //报单进程
                repairType: "",
                //资产状态
                used: "",
                //资产价值
                purchaseMount: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: "",
                //科室
                orgstructId: this.$store.state.user_in.osId
            },
            warrantyStatusList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    label: "保内",
                    value: 1
                },
                {
                    label: "已出保",
                    value: 2
                }
            ],
            repairTypeList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    label: "待接单",
                    value: "0"
                },
                {
                    label: "维修中",
                    value: "1"
                },
                {
                    label: "待验收",
                    value: "2"
                },
                {
                    label: "已完修",
                    value: "3"
                },
                {
                    label: "转交中",
                    value: "4"
                },
                {
                    label: "已撤回",
                    value: "5"
                }
            ],
            usedList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    label: "在用",
                    value: 1
                },
                {
                    label: "闲置",
                    value: 0
                },
                {
                    label: "备用",
                    value: 3
                },
                {
                    label: "待用",
                    value: 4
                }
            ],
            purchaseMountList: [
                {
                    value: "",
                    label: "全部"
                },
                {
                    label: "0-10万(不含10万)",
                    value: 1
                },
                {
                    label: "10万-50万(不含50万)",
                    value: 2
                },
                {
                    label: "50万以上",
                    value: 3
                }
            ],
            departmentTree: [],
            singerAll: new singerTemp(),
            singerMine: new singerTemp(this.$store.state.user_in.id)
        };
    },
    computed: {
        startTimeOptions() {
            return {
                disabledDate: date => {
                    let end = this.search.endTime;
                    return end ? date - new Date(end) > 0 : false;
                }
            };
        },
        endTimeOptions() {
            return {
                disabledDate: date => {
                    let start = this.search.startTime;
                    return start ? date - new Date(start) < 0 : false;
                }
            };
        },
        frStatus() {
            return this.$route.params.frStatus !== undefined ? 1 : undefined;
        },
        dateRange() {
            let start = this.search.startTime;
            let end = this.search.endTime;
            return {
                startTime: start ? this.$store.state.localeDate(start) : "",
                endTime: end
                    ? this.$store.state.localeDate(end) + " 23:59:59"
                    : ""
            };
        }
    },
    created() {
        this.loadCountryTree();
    },
    mounted() {
        this.search.repairType = this.$route.params.repairType || "";
        this.loadSingerList(this.singerAll);
        this.loadSingerList(this.singerMine);
    },
    watch: {
        search: {
            handler() {
                this.loadSingerList(this.singerAll);
                this.loadSingerList(this.singerMine);
            },
            deep: true
        }
    },
    methods: {
        async loadCountryTree() {
            const { data } = await this.$store.dispatch(
                "loadDepartmentTree",
                true
            );
            this.departmentTree = [data];
        },
        isDefined(item) {
            return item !== undefined && item !== null;
        },
        isNumber(item) {
            return item === +item;
        },
        jumpCreateSinger() {
            this.$router.push({ name: "create-singer" });
        },
        //重新搜索
        reSearch() {
            this.$refs["search-form"].resetFields();
        },
        doSearch() {
            this.loadSingerList(this.singerAll);
            this.loadSingerList(this.singerMine);
        },
        searchFormat(search) {
            let obj = {};
            for (let i in search) {
                obj[i] = search[i] === "" ? null : search[i];
            }
            return obj;
        },

        //请求报单列表
        async loadSingerList(info, page = 1) {
            const { userId } = info;
            info.currentPage = page;
            if (info.cancelToken) {
                info.cancelToken();
            }
            const url = `/faultReport/list`;
            const requestBody = {
                limit: info.size,
                offset: (info.currentPage - 1) * info.size,
                params: {
                    ...this.searchFormat(this.search),
                    ...this.dateRange,
                    frStatus: this.frStatus,
                    userId
                }
            };
            const config = {
                cancelToken: new this.$axios.CancelToken(c => {
                    // executor 函数接收一个 cancel 函数作为参数
                    info.cancelToken = c;
                })
            };
            info.loading = true;
            try {
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(url, requestBody, config);
                info.data = data;
                info.total = recordsTotal;
            } finally {
                info.loading = false;
            }
        },
        jumpDetail(row) {
            if (!this.checkLimit("fr:query")) {
                this.$Message.warning("您没有权限查看详情！");
                return;
            }
            this.$router.push({
                name: "singer-detail",
                query: { id: row.id }
            });
        },
        tabPaneLabel(type, label) {
            let imgs = {
                singerAll: require("@img/all_singer.svg"),
                singerMine: require("@img/mi_asinger.svg")
            };

            return h => {
                return h(
                    "div",
                    {
                        style: {
                            display: "flex",
                            alignItems: "center"
                        }
                    },
                    [
                        h("img", {
                            domProps: {
                                src: imgs[type]
                            },
                            style: {
                                verticalAlign: "middle",
                                width: "15px",
                                marginRight: "5px"
                            }
                        }),
                        h("span", label)
                    ]
                );
            };
        }
    }
};
</script>

<style lang="less" scoped>
.singer-center {
    position: relative;
    .border() {
        border: 1px solid #dddee1;
    }
    .jump-btn {
        position: absolute;
        top: -68px;
        right: 0;
    }
    .search-bar {
        .border();
        padding: 20px 200px 5px 20px;
        border-radius: 3px;
        background-color: rgb(250, 250, 250);
        position: relative;
        > .ivu-row {
            margin-bottom: 15px;
        }
        .date-range-wrap {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
        }
        .search-button {
            position: absolute;
            top: 20px;
            right: 15px;
        }
    }
    .singer-center-content {
        height: 860px;
        width: 100%;
        display: flex;
        margin-top: 20px;
        .department-tree {
            .border();
            width: 250px;
            height: 100%;
            flex-shrink: 0;
            background-color: #fafafa;
            padding: 10px;
            border-radius: 5px;
            .tree-form-item {
                height: 100%;
                /deep/.ivu-form-item-content {
                    height: 100%;
                }
            }
        }
        .asset-list-wrap {
            width: calc(~"100% - 270px");
            margin-left: 20px;
            border-radius: 5px;
            /deep/.tabs-wrap {
                height: 100%;
                background-color: #fafafa;
                .ivu-tabs-bar {
                    background-color: #f3f4f5;
                }
                .ivu-tabs-content {
                    height: calc(100% - 55px);
                    
                    .ivu-tabs-tabpane {
                        .border();
                        background-color: transparent;
                        box-shadow: none;
                    }
                }
            }
        }
    }
}
</style>



<template>
    <div>
        <div class="life-head">
            <i-row>
                <i-col span='7'>
                    <kld-dropdown-tree v-model="search.departmentId"
                                       :data="OSData"
                                       :first-expand="true"
                                       :props='osProps'
                                       placeholder="选择科室">
                    </kld-dropdown-tree>
                </i-col>
            </i-row>
        </div>
        <div class="life-list">
            <Loading v-show="loading"></Loading>
            <i-row :gutter='15'>
                <template v-if="dataList.length">
                    <i-col span='6'
                           v-for="(item,i) in dataList"
                           :key='i'>
                        <router-link class='list-every'
                                     tag='div'
                                     :to='{name:"department-detail",params:{id:item.departmentId,name:item.departmentName}}'>
                            <div class="every-top">
                                <span class='every-title'>{{item.departmentName}}</span>
                                <span>...</span>
                            </div>
                            <div class="every-foot">
                                <span class="amount">总数<i>{{item.count1+item.count2+item.count3}}</i>台</span>
                                <div class="classify">
                                    <div>
                                        <span>{{item.count1}}</span>
                                        <span>在用</span>
                                    </div>
                                    <div>
                                        <span>{{item.count2}}</span>
                                        <span>待用</span>
                                    </div>
                                    <div>
                                        <span>{{item.count3}}</span>
                                        <span>维修</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </i-col>
                </template>
                <template v-else>
                    <i-col>
                        <div class="no-data">
                            暂无数据
                        </div>
                    </i-col>
                </template>

            </i-row>
            <kld-page @on-change="getListData"
                      :current.sync="page.current"
                      :total="page.total"
                      :page-size="page.pageSize">
            </kld-page>
        </div>
    </div>
</template>
<script>
import kldTree from "@common/kld-dropdown-tree/index";
import kldPage from "@common/page/index";
export default {
    name:'life-all',
    data() {
        return {
            page: {
                total: 10,
                current: 1,
                pageSize: 12
            },
            search: {
                departmentId: null
            },
            OSData: [],
            dataList: [],
            loading: false
        };
    },
    created() {
        this.getOSData();
        this.getListData();
    },
    components: {
        [kldTree.name]: kldTree,
        [kldPage.name]: kldPage
    },
    computed: {
        osProps() {
            return {
                label: "osName",
                children: "lists"
            };
        }
    },
    watch: {
        search: {
            handler() {
                this.page.current = 1;
                this.getListData();
            },
            deep: true
        }
    },
    methods: {
        getOSData() {
            this.$axios
                .get(`/orgstruct/findAllTree/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    this.OSData = [data];
                });
        },
        getListData() {
            const page = this.page;
            this.loading = true;
            this.$axios
                .post(`/internetThings/countLifeAsset`, {
                    limit: page.pageSize,
                    offset: (page.current - 1) * page.pageSize,
                    params: {
                        departmentId: this.search.departmentId
                            ? this.search.departmentId
                            : null,
                        osId: this.$store.state.user_in.osId
                    }
                })
                .then(({ data: { data, recordsTotal } }) => {
                    page.total = recordsTotal;
                    this.dataList = data;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>


<style lang="less" scoped>
.life-head {
    padding: 15px 8px;
    background: #fafafa;
    border-radius: 3px;
    border: solid 1px #dce0e6;
}
.life-list {
    margin-top: 10px;
    background: #fafafa;
    padding: 10px;
    position: relative;
}
.list-every {
    padding: 18px 10px;
    border-radius: 3px;
    border: solid 1px #c8ced3;
    cursor: pointer;
    margin-bottom: 12px;
    &:hover {
        border-color: #1891ac;
    }
    .every-top {
        position: relative;
        height: 35px;
        .every-title {
            color: #333333;
            font-size: 16px;
            position: absolute;
            left: 0;
            top: 0;
        }
        > span {
            font-size: 25px;
            color: #aaa;
            position: absolute;
            right: 0;
            top: -14px;
            //margin-bottom: 5px;
        }
    }
    .every-foot {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 5px;
        .amount {
            color: #888888;
            font-size: 14px;
            > i {
                color: #0c8399;
                font-size: 18px;
                padding: 0 3px;
                font-style: normal;
            }
        }
        .classify {
            display: flex;
            > div {
                display: flex;
                flex-direction: column;
                margin: 0 5px;
                text-align: center;
                > span:nth-of-type(1) {
                    font-size: 16px;
                    color: #666;
                }
                > span:nth-of-type(2) {
                    font-size: 14px;
                    color: #7d7d7d;
                }
            }
            > div:nth-last-of-type(1) {
                margin-right: 0;
            }
        }
    }
}
.no-data {
    text-align: center;
    padding: 20px;
    font-size: 14px;
}
</style>

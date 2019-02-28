<template>
    <div class="emergency-chief-list">
        <Row :gutter="20">
            <i-col span="5">
                <div class="kld-box-effect content-height relative">
                    <Loading v-if="sectionLoading"></Loading>
                    <kld-search-tree
                            select-class="kld-select"
                            select-wrap-styles="padding: 0 0 20px 0"
                            placeholder="请输入科室名称"
                    >
                        <kld-tree
                                slot="tree"
                                :data="sectionData"
                                title-key="osName"
                                children-key="lists"
                                first-expanded
                                highlight-current
                                :current.sync="searchData.departmentId"
                        ></kld-tree>
                    </kld-search-tree>
                </div>
            </i-col>
            <i-col span="19">
                <div class="kld-box-effect content-height relative">
                    <Loading v-if="listLoading"></Loading>
                    <Row v-if="listData.length > 0" :gutter="20">
                        <i-col span="8" v-for="item in listData" :key="item.os_ID">
                            <router-link :to="{name: 'emergency-detail', params: {id: item.os_ID}}" class="block">
                                <div class="emergency-card mb-20">
                                    <div class="emergency-card-title">
                                        <p class="text-ellipsis" :title="item.osName">{{item.osName}}</p>
                                    </div>
                                    <div class="emergency-card-content lh30">
                                        <Row>
                                            <i-col span="10">
                                                <ul class="br1 fwb pl-10">
                                                    <li>
                                                        <p class="text-ellipsis">呼吸机</p>
                                                        <p class="text-ellipsis">除颤仪</p>
                                                        <p class="text-ellipsis">心电监护仪</p>
                                                    </li>
                                                </ul>
                                            </i-col>
                                            <i-col span="7">
                                                <ul class="pl-10">
                                                    <li v-for="value in [item.huxiD, item.chuchanD, item.xindianD]">
                                                        待用
                                                        <span v-if="value === 0" class="disabled pl-8">0</span>
                                                        <span v-else class="orange pl-8">{{value}}</span>
                                                    </li>
                                                </ul>
                                            </i-col>
                                            <i-col span="7">
                                                <ul class="pl-10">
                                                    <li v-for="value in [item.huxiZ, item.chuchanZ, item.xindianZ]">
                                                        在用
                                                        <span v-if="value === 0" class="disabled pl-8">0</span>
                                                        <span v-else class="green pl-8">{{value}}</span>
                                                    </li>
                                                </ul>
                                            </i-col>
                                        </Row>
                                    </div>
                                    <div class="emergency-card-footer">
                                        <p>
                                            <span class="disabled">科室电话：</span>
                                            {{item.osPhone || '暂无'}}
                                        </p>
                                    </div>
                                </div>
                            </router-link>
                        </i-col>
                    </Row>
                    <p v-else class="no-data-text">暂无数据</p>
                    <kld-page
                            :current.sync="pageData.current"
                            :page-size="pageData.pageSize"
                            :total="pageData.total"
                            @on-change="getList"
                    ></kld-page>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<style lang="less" scoped>
    @border-color: #dbdfe2;
    @kld-green: #1891ac;
    .disabled{
        color: #aaa;
    }
    .orange{
        color: #e3c075;
    }
    .green{
        color: #00b37f;
    }
    .br1{
        border-right: 1px solid @border-color;
    }
    .lh30{
        line-height: 30px;
    }
    .content-height{
        height: 750px;
    }
    .fwb{
        font-weight: bold;
    }
    .emergency-chief-list {
        position: relative;
        .no-data-text{
            font-size: 16px;
            text-align: center;
            line-height: 40px;
            margin-bottom: 20px;
        }
        .emergency-card{
            color: #333;
            font-size: 14px;
            border: 1px solid @border-color;
            border-radius: 3px;
            overflow: hidden;
            &:hover{
                &/*,.br1,.emergency-card-footer*/{
                    border-color: @kld-green;
                    /*border-width: 2px;*/
                    /*box-shadow: 0 0 1px @kld-green;*/
                    box-shadow: 0 0 0 1px @kld-green;
                }
            }
            .emergency-card-title{
                background-color: #f3f3f3;
                padding: 12px;
            }
            .emergency-card-content{
                padding: 12px;
            }
            .emergency-card-footer{
                padding: 12px;
                border-top: 1px solid @border-color;
            }

        }
    }
</style>

<script>
    import KldSearchTree from '@common/kld-search-tree';
    import KldTree from '@common/kld-tree';
    import KldPage from '@common/page';
    import emptyToNull from '@common/empty-to-null';
    import {debounce} from '@/utils';

    export default {
        name: "emergency-chief-list",
        components: {
            KldSearchTree,
            KldTree,
            KldPage
        },

        data() {
            return {
                sectionLoading: false,
                sectionData: [],
                searchData: {
                    departmentId: this.$store.state.user_in.osId
                },

                listData: [],
                listLoading: false,

                pageData: {
                    current: 1,
                    pageSize: 9,
                    total: 0
                }
            };
        },

        computed: {
            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },

        watch: {
            searchData: {
                deep: true,
                handler: debounce(function () {
                    this.pageData.current = 1;
                    this.getList();
                }, 200)
            },

            $route: {
                immediate: true,
                handler({name}) {
                    if (name === 'emergency-list') {
                        this.getSectionData();
                        this.getList();
                    }
                }
            }
        },

        methods: {
            async getList() {
                this.listLoading = true;
                try {
                    const {pageData: {current, pageSize}, searchData} = this;
                    const {data: {data, recordsTotal}} = await this.$axios.post('/EmergencyMaterials/homePageList', {
                        limit: pageSize,
                        offset: (current - 1) * pageSize,
                        params: emptyToNull(searchData)
                    });

                    this.listData = data;
                    this.pageData.total = recordsTotal;
                } finally {
                    this.listLoading = false;
                }
            },

            async getSectionData() {
                this.sectionLoading = true;
                try {
                    const {data} = await this.$axios.get(`/orgstruct/findAllTree/${this.hospitalId}`);

                    this.sectionData = [data];
                } finally {
                    this.sectionLoading = false;
                }
            }
        }
    }
</script>
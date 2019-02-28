<template>
    <div class="emergency-doctor-list">
        <Row :gutter="20" type="flex">
            <i-col span="5" style="position: relative;">
                <kld-nav
                        title="设备分类"
                        :items="assetTypes"
                        :current.sync="searchData.assetTypeId"
                        title-key="typeName"
                        item-key="assetTypeId"
                        class="full-height"
                ></kld-nav>
                <Loading v-if="typeLoading"></Loading>
            </i-col>
            <i-col span="19">
                <div class="kld-box-effect">
                    <Loading v-if="listLoading"></Loading>
                    <Row v-if="listData.length > 0" :gutter="20">
                        <i-col span="8" v-for="item in listData" :key="item.os_ID">
                            <div class="emergency-card mb-20">
                                <div class="emergency-card-title">
                                    <p class="text-ellipsis" :title="item.osName">{{item.osName}}</p>
                                </div>
                                <div class="emergency-card-content lh50">
                                    <Row>
                                        <i-col span="10">
                                            <ul class="fwb">
                                                <li>
                                                    <p class="text-ellipsis">{{currentTypeName}}</p>
                                                </li>
                                            </ul>
                                        </i-col>
                                        <i-col span="7">
                                            <ul>
                                                <li :class="[item.daiYong ? 'orange' : 'disabled']">
                                                    待用
                                                    <span class="pl-8 fz-30">{{item.daiYong || 0}}</span>
                                                </li>
                                            </ul>
                                        </i-col>
                                        <i-col span="7">
                                            <ul>
                                                <li :class="[item.zaiYong ? 'green' : 'disabled']">
                                                    在用
                                                    <span class="pl-8 fz-30">{{item.zaiYong || 0}}</span>
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
                        </i-col>
                    </Row>
                    <p v-else class="no-data-text mb-20">暂无数据</p>
                    <kld-page
                        :current.sync="pageData.current"
                        :total="pageData.total"
                        :page-size="pageData.pageSize"
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
    .lh50{
        line-height: 50px;
    }
    .fwb{
        font-weight: bold;
    }
    .fz-30{
        font-size: 30px;
    }
    .emergency-doctor-list {
        position: relative;
        .no-data-text{
            font-size: 16px;
            text-align: center;
            line-height: 40px;
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
    import KldNav from '@/views/adjust/common/kld-nav';
    import KldPage from '@/common/page';

    export default {
        name: "emergency-doctor-list",
        components: {
            KldNav,
            KldPage
        },

        data() {
            return {
                assetTypes: [],
                typeLoading: false,
                listData: [],
                listLoading: false,

                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 9
                },

                searchData: {
                    departmentId: this.$store.state.user_in.osId,
                    assetTypeId: null
                }
            };
        },

        computed: {
            currentTypeName() {
                const {searchData: {assetTypeId: current}} = this;
                return this.assetTypes.find(({assetTypeId}) => {
                    return current === assetTypeId;
                }).typeName;
            }
        },

        watch: {
            $route: {
                handler({name}) {
                    if (name === 'emergency-list') {
                        this.getAssetTypes();
                    }
                },
                immediate: true
            },

            searchData: {
                deep: true,
                handler() {
                    this.pageData.current = 1;
                    this.getList();
                }
            }
        },

        methods: {
            async getAssetTypes() {
                this.typeLoading = true;
                try {
                    const {data} = await this.$axios.post('/EmergencyMaterials/getLifeDetail');
                    this.assetTypes = data;
                    this.searchData.assetTypeId = this.$route.query.id || data[0].assetTypeId;
                } finally {
                    this.typeLoading = false;
                }
            },
            async getList() {
                this.listLoading = true;
                try {

                    const {pageData: {current, pageSize}} = this,
                        {data: {data, recordsTotal}} = await this.$axios.post('/EmergencyMaterials/homePageList', {
                            limit: pageSize,
                            offset: (current - 1) * pageSize,
                            params: this.searchData
                        });

                    this.listData = data;
                    this.pageData.total = recordsTotal;
                } finally {
                    this.listLoading = false;
                }
            },
        }
    }
</script>
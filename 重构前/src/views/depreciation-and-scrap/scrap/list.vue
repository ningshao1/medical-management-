<template>
    <div class="scrap-list">
        <div v-if="applyLimit" class="position-to-title">
            <Button @click="applyScrap" class="kld-btn" icon="plus">申请报废</Button>
        </div>
        <div class="search kld-box-effect">
            <Form :model="searchData" ref="search-form">
                <Row type="flex" :gutter="20">
                    <i-col>
                        <FormItem>
                            <i-input v-model.trim="searchData.keyWord" placeholder="关键词搜索" icon="ios-search-strong" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem>
                            <Select v-model="searchData.scrapStatus" class="kld-select" placeholder="申请状态">
                                <Option value="">全部</Option>
                                <Option value="1">已申请</Option>
                                <Option value="2">审批中</Option>
                                <Option value="3">已通过</Option>
                                <Option value="4">已拒绝</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem>
                            <kld-tree-Select
                                    v-model="searchData.departmentId"
                                    :data="sectionTreeData"
                                    clearable
                                    filterable
                                    first-expanded
                                    placeholder="请选择科室"
                            ></kld-tree-Select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <Button @click="getScrapList" icon="android-search" class="kld-btn">检索</Button>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="scrap-list kld-box-effect">
            <Loading v-if="tableLoading"></Loading>
            <Table :columns="scrapListColumns" :data="scrapList" @on-row-click="scrapDetails"></Table>
            <div class="table-page">
                <kld-page @on-change="getScrapList" :current.sync="pageData.current" :page-size="pageData.pageSize" :total="pageData.total"></kld-page>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .scrap-list {
        position: relative;
    }
    .search{
        display: flex;
        margin-bottom: 15px;
        padding-bottom: 10px;
        .kld-input,.kld-select,.kld-date-picker,.kld-tree-select{
            width: 300px;
        }
        .ivu-col{
            margin-bottom: 10px;
        }
    }
    .section-tree{
        /deep/.ivu-poptip-body{
            max-height: 300px;
            overflow: auto;
        }
    }

    .scrap-list{
        /deep/.ivu-table{
            width: 100%;
            height: 100%;
            background-color: transparent;
            /*border-left: 1px solid #dddee1;*/
            /*border-top: 1px solid #dddee1;*/
            &:before,&:after{
                display: none;
            }
            td{
                background-color: transparent;
            }
            .ivu-table-header{
                tr{
                    font-size: 14px;
                    height: 60px;
                }
            }
            .ivu-table-body{
                tr{
                    height: 70px;
                }
            }
        }
    }
    .table-page{
        text-align: center;
        padding: 20px 20px 0 20px;
    }

    /*/deep/*/
    .test-modal-content{
        width: 300px;
        height: 300px;
        text-align: center;
        line-height: 300px;
    }
</style>

<script>
    import transformTreeData from '@common/transformSectionTreeData';
    import kldPage from '@common/page/page.vue';
    import testLimit from '@common/test-limit';
    import renderEllipsis from '@common/render-ellipsis';
    import poptipShowInfo from '@common/poptip-show-info';
    import kldTreeSelect from '@common/kld-tree-select';

    export default {
        name: "scrap-list",
        components: {kldPage, kldTreeSelect},
        data() {
            return {
                applyLimit: testLimit('ds:add'),
                detailsLimit: testLimit('ds:query'),

                searchData: {
                    keyWord: '',
                    scrapStatus: '',
                    departmentId: '',
                },
                pageData: {
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                scrapList: [],
                scrapListColumns: [
                    {title: '申请状态', width: 100, render(h, {row: {scrapStatus}}) {
                        let className = '',
                            text = '';
                        switch (scrapStatus) {
                            case '1':
                                className = 'kld-default';
                                text = '已申请';
                                break;
                            case '2':
                                className = 'kld-default';
                                text = '审批中';
                                break;
                            case '3':
                                className = 'kld-default';
                                text = '已通过';
                                break;
                            case '4':
                                className = 'kld-error';
                                text = '已拒绝';
                                break;
                        }

                        return h('p', {class: className}, text);
                    }},
                    {title: '资产名称', ellipsis: true, render(h, {row: {assetCode, assetName}}) {
                        return h('div', [
                            h(
                                'p',
                                {
                                    attrs: {
                                        title: assetName,
                                        class: 'kld-success'
                                    }
                                },
                                assetName
                            ),
                            h('p', {attrs: {title: assetCode}}, assetCode)
                        ]);
                    }},
                    {title: '设备信息', ellipsis: true, render(h, {row: {assetBrand, assetModel}}) {
                        return h('div', [
                            h('p', {attrs: {title: assetModel}}, `型号：${assetModel}`),
                            h(
                                'p',
                                {attrs: {title: assetBrand}},
                                `品牌：${assetBrand}`
                            )
                        ]);
                    }},
                    {title: '所属科室', render: (h, {row: {department}}) => renderEllipsis(h, department)},
                    {title: '申请人', render: (h, {row: {proposer, proposerId}}) => h(poptipShowInfo, {props: {infoId: proposerId}}, [renderEllipsis(h, proposer)])},
                    {title: '使用年限(月)', width: 140, key: 'useAge'},
                    {title: '申请时间', width: 140, key: 'appliyTime'}
                ],

                sectionTreeData: [],
                tableLoading: false,
            };
        },
        created() {
            this.getScrapList();
            this.getSectionData();
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            }
        },
        watch: {
            searchData: {
                deep: true,
                handler() {
                    this.pageData.current = 1;
                    this.getScrapList();
                }
            }
        },
        methods: {
            //获取报废列表
            getScrapList() {
                this.tableLoading = true;
                return this.$axios.post('/scrap/list', {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * 10,
                    params: this.searchData
                })
                    .then(({data: {data, recordsTotal}}) => {
                        this.scrapList = data;
                        this.pageData.total = recordsTotal;
                    })
                    .finally(() => this.tableLoading = false);
            },
            //获取科室树
            getSectionData() {
                return this.$axios.get(`orgstruct/findAllTree/${this.user_in.osId}`)
                    .then(
                        ({data}) => {
                            this.sectionTreeData = transformTreeData(data);
                        }
                    );
            },


            //查看报废详情
            scrapDetails({scrapId}) {
                if (this.detailsLimit) {
                    this.$router.push({name: 'scrap-details', query: {id: scrapId}});
                }
            },

            //申请报废
            applyScrap() {
                this.$router.push({name: 'scrap-apply'});
            }
        }
    }
</script>
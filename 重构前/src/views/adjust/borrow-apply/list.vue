<template>
    <div class="borrow-apply-list">
        <div class="position-to-title">
            <Button v-if="ViewLimit('borrow:apply')" @click="borrowApplyShow = true" class="kld-btn">申请借用</Button>
        </div>
        <div class="search kld-box-effect">
            <Form :model="searchData" ref="search-form">
                <Row type="flex" :gutter="20">
                    <i-col class="grow">
                        <Row class="gutter" type="flex" :gutter="20">
                            <i-col span="8">
                                <FormItem prop="keyword">
                                    <i-input v-model.trim="searchData.keyword" placeholder="设备编码/设备名称/品牌/型号" icon="ios-search-strong" class="kld-input"></i-input>
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="departmentId">
                                    <kld-tree-select
                                            v-model="searchData.departmentId"
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
                                    <i-col span="10">
                                        <FormItem prop="startTime">
                                            <DatePicker :value="searchData.startTime" @on-change="searchData.startTime = $event" placeholder="开始时间" class="kld-date-picker"></DatePicker>
                                        </FormItem>
                                    </i-col>
                                    <i-col style="text-align: center; line-height: 44px;" span="2">
                                        至
                                    </i-col>
                                    <i-col span="10">
                                        <FormItem prop="endTime">
                                            <DatePicker :value="searchData.endTime" @on-change="searchData.endTime = $event" placeholder="结束时间" class="kld-date-picker"></DatePicker>
                                        </FormItem>
                                    </i-col>
                                </Row>
                            </i-col>
                            <i-col span="8">
                                <FormItem prop="ratifyType">
                                    <Select v-model="searchData.ratifyType" class="kld-select" placeholder="申请状态">
                                        <Option :value="0">已申请</Option>
                                        <Option :value="1">使用中</Option>
                                        <Option :value="2">已拒绝</Option>
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
            <Loading v-if="tableLoading"></Loading>
            <Table @on-row-click="goToApply" :columns="tableColumns" :data="tableData"></Table>
            <div class="c-table-page">
                <kld-page @on-change="getBorrowListData" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
            </div>
        </div>
        <borrow-apply v-model="borrowApplyShow" @on-resolve="getBorrowListData"></borrow-apply>
    </div>
</template>

<style lang="less" scoped>
    @import "../common/common";
    .borrow-apply-list {

    }
    .c-table{
        position: relative;
    }
    .section-tree{
        width: 100%;
        /deep/.ivu-poptip-popper{
            width: 100%;
        }
        /deep/.ivu-poptip-rel{
            width: 100%;
        }
        /deep/.ivu-poptip-body{
            max-height: 300px;
            overflow: auto;
        }
        /deep/.ivu-poptip-body-content{
            overflow: initial;
        }
    }
</style>

<script>
    import kldPage from '@common/page/page';
    import borrowApply from '../common/borrow-apply';
    import moment from 'moment';
    import emptyToNull from '@common/empty-to-null';
    import renderEllipsis from '../common/render-ellipsis';
    import poptipShowInfo from '@common/poptip-show-info';
    import KldTreeSelect from '@common/kld-tree-select';

    export default {
        name: "borrow-apply-list",
        components: {kldPage, borrowApply, poptipShowInfo, KldTreeSelect},
        data() {
            return {
                borrowApplyShow: false,

                sectionTreeData: [],
                tableLoading: false,
                tableColumns: [
                    {title: '申请时间', width: 170 ,render(h, {row: {createTime}}) {
                        return h('p', moment(createTime).format('YYYY-MM-DD HH:mm'))
                    }},
                    {title: '状态', width: 100, render(h, {row: {ratifyType}}) {
                        let text = '',
                            className = '';
                        switch (ratifyType) {
                            case 0:
                                text = '已申请';
                                break;
                            case 1:
                                text = '使用中';
                                break;
                            case 2:
                                text = '已拒绝';
                                className = 'kld-error';
                        }

                        return h('p', {class: className}, text);
                    }},
                    {title: '资产名称', render: (h, {row: {assetName}}) => renderEllipsis(h, assetName, 'kld-success')},
                    {title: '数量', width: 80, key: 'assetNumber'},
                    {title: '申请科室', render: (h, {row: {osName}}) => renderEllipsis(h, osName)},
                    {title: '申请人', render: (h, {row: {createName, createId}}) => {
                        return h(
                            poptipShowInfo,
                            {
                                props: {infoId: createId}
                            },
                            [
                                renderEllipsis(h, createName)
                            ]
                        );
                    }},
                    {title: '预计借用时长', width: 120, key: 'hours'},
                    {title: '费用类型', width: 100, render(h, {row: {money}}) {
                            switch (money) {
                                case null:
                                    return h('p', '未设置');
                                case '0':
                                    return h('p', {class: 'kld-success'}, '无偿');
                                default:
                                    return h('p', {class: 'kld-error'}, '有偿');
                            }
                    }},
                    {title: '备注', render: (h, {row: {borrowNote}}) => renderEllipsis(h, borrowNote)},
                ],
                tableData: [],

                searchData: {
                    startTime: '',
                    endTime: '',
                    ratifyType: '',
                    departmentId: '',
                    keyword: ''
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
            this.getBorrowListData();
        },
        methods: {
            //获取借用申请列表
            getBorrowListData() {
                this.tableLoading = true;
                return this.$axios.post('/assetBorrow/listAssetBorrowApply', {
                    offset: (this.pageData.current - 1) * this.pageData.pageSize,
                    limit: this.pageData.pageSize,
                    params: emptyToNull(this.searchData)
                })
                    .then(({data: {data, recordsTotal}}) => {
                        this.tableData = data;
                        this.pageData.total = recordsTotal;
                    })
                    .finally(() => this.tableLoading = false);
            },

            //获取科室树
            getSectionTree() {
                return this.$axios.get(`orgstruct/findAllTree/${this.user_in.osId}`)
                    .then(({data}) => {
                        this.sectionTreeData = [data];
                    });
            },

            //重置搜索
            resetSearch() {
                this.$refs['search-form'].resetFields();
            },

            //前往审批界面
            goToApply({id}) {
                this.$router.push({
                    name: 'borrow-approval-details',
                    query: {id}
                });
            }

        }
    }
</script>
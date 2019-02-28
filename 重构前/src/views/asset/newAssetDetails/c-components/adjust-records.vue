<template>
    <div class="adjust-records kld-box-effect">
        <div class="tabs">
            <div class="tabs-left">
                <div class="tabs-title">设备调剂</div>
                <div class="tabs-wrap">
                    <div @click="changeTabsType('borrow')" :class="{active: tabsType === 'borrow'}" class="tabs-item">
                        <span>设备借用记录</span>
                    </div>
                    <div @click="changeTabsType('transfer')" :class="{active: tabsType === 'transfer'}" class="tabs-item">
                        <span>设备转移记录</span>
                    </div>
                </div>
            </div>
            <div class="tabs-right">
                <div class="table-wrap c-table">
                    <Loading v-if="tableLoading"></Loading>
                    <Table @on-row-click="goToDetails" class="records-table" :columns="recordsTableColumns" :data="recordsTableData"></Table>
                    <div class="c-table-page">
                        <kld-page @on-change="getRecords" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @border-color: rgba(2, 31, 57, 0.1);
    .adjust-records {
        position: relative;
    }
    .records-table{
        border-left: 0;
        border-top: 0;
        /deep/.ivu-table{
            &:before,&:after{
                display: none;
            }
            .ivu-table-body{
                tr{
                    height: 74px;
                }
            }
        }
    }
    .tabs{
        font-size: 14px;
        display: flex;
        .tabs-wrap{
            height: 770px;
        }
        .tabs-item{
            padding: 18px;
            position: relative;
            background-color: #f5f6fa;
            border-bottom: 1px solid @border-color;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            .badge{
                padding: 0 10px;
                border-radius: 30px;
                border: 1px solid #dce0e6;
                text-align: center;
                line-height: 30px;
                color: #a9a8a9;
                background-color: #fff;
                flex-shrink: 0;
            }
            span{
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &.active{
                background-color: #fff;
                color: #0c8399;
                .badge{
                    color: #0c8399;
                    border-color: #0c8399;
                }
                &:before{
                    position: absolute;
                    content: '';
                    display: block;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 4px;
                    background-color: #0c8399;
                }
            }
        }
        .tabs-title{
            padding: 18px;
            background-color: #eaeaea;
            border-bottom: 1px solid @border-color;
        }
        .tabs-left{
            width: 16%;
            margin-right: 1%;
            border: 1px solid @border-color;
            border-radius: 4px;
        }
        .tabs-right{
            width: 83%;
            height: 830px;
            .c-table{
                background-color: #fff;
                height: 100%;
                position: relative;
            }
        }
    }
</style>

<script>
    import kldPage from '@common/page/page';
    import moment from 'moment';

    const ellipsisNode = (h, content) => h('p', {attrs: {class: 'textEllipsis', title: content}}, content);

    export default {
        name: 'adjust-records',
        components: {kldPage},
        data() {
            return {
                tableLoading: false,
                tabsType: 'borrow',


                recordsTableAllColumns: [
                    [
                        {title: '状态', width: 100, render(h, {row: {returnType}}) {
                            let className = '',
                                text = '';
                            switch (returnType) {
                                case 0:
                                    className = 'kld-warning';
                                    text = '借用中';
                                    break;
                                case 1:
                                    className = '';
                                    text = '待验收';
                                    break;
                                case 2:
                                    className = 'kld-success';
                                    text = '已验收';
                            }

                            return h('p', {class: className}, text);
                        }},
                        {title: '借出时间',  width: 170, render(h, {row: {ratifyTime}}) {
                            return h('p', moment(ratifyTime).format('YYYY-MM-DD HH:mm'));
                        }},
                        {title: '借出人', render: (h, {row: {ratifyName}}) => ellipsisNode(h, ratifyName)},
                        {title: '归还时间', width: 170, render(h, {row: {returnTime}}) {
                                return h('p', moment(returnTime).format('YYYY-MM-DD HH:mm'));
                            }},
                        {title: '借用科室', render: (h, {row: {osName}}) => ellipsisNode(h, osName)},
                        {title: '借用人', render: (h, {row: {createName}}) => ellipsisNode(h, createName)},
                        {title: '费用', width: 200, render(h, {row: {charge}}) {
                            switch (charge) {
                                case undefined:
                                    return h('p', '未设置');
                                case '0':
                                    return h('p', {class: 'kld-success'}, '无偿');
                                default:
                                    return h('p', {class: 'kld-error'}, charge);
                            }
                        }}
                    ],
                    [
                        {title: '状态', width: 100, render(h, {row: {acceptanceType}}) {
                                let className = '',
                                    text = '';
                                switch (acceptanceType) {
                                    case 0:
                                        className = 'kld-warning';
                                        text = '待验收';
                                        break;
                                    case 1:
                                        className = '';
                                        text = '已验收';
                                }

                                return h('p', {class: className}, text);
                        }},
                        {title: '转移信息', render(h, {row: {oldSectionName, SectionName}}) {
                            return h(
                                'p',
                                {attrs: {class: 'textEllipsis', title: `${oldSectionName} -> ${SectionName}`}},
                                [
                                    h('span', oldSectionName),
                                    h('span', {class: 'kld-success'}, ' -> '),
                                    h('span', SectionName),
                                ]
                            );
                        }},
                        {title: '转移人', render: (h, {row: {handleName}}) => ellipsisNode(h, handleName)},
                        {title: '转移时间', width: 170, key: 'acceptanceTime', render(h, {row: {acceptanceTime}}) {
                            return h('p', moment(acceptanceTime).format('YYYY-MM-DD HH:mm'));
                        }},
                        {title: '备注', render: (h, {row: {acceptanceNote}}) => ellipsisNode(h, acceptanceNote)}
                    ]
                ],
                recordsTableColumns: [],
                recordsTableData: [],
                pageData: {
                    total: 0,
                    pageSize: 10,
                    current: 1
                },

                axiosUrl: '',
                detailsName: ''
            };
        },
        props: {
            loaded: Function
        },
        created() {
            this.init()
                .then(
                    () => typeof this.loaded === 'function' && this.loaded(),
                    () => typeof this.loaded === 'function' && this.loaded(false)
                );
        },
        computed: {
            assetId() {
                return this.$route.params.id;
            }
        },
        watch: {
            tabsType: {
                handler(type) {
                    switch (type) {
                        case 'borrow':
                            this.recordsTableColumns = this.recordsTableAllColumns[0];
                            this.axiosUrl = '/assets/getAssetBorrow';
                            this.detailsName = 'borrow-detail';
                            break;
                        case 'transfer':
                            this.recordsTableColumns = this.recordsTableAllColumns[1];
                            this.axiosUrl = '/assets/getAssetShift';
                            this.detailsName = 'transfer-detail';
                    }

                    this.pageData.current = 1;
                    this.getRecords();
                },
                immediate: true
            }
        },
        methods: {
            init() {
                this.recordsTableColumns = this.recordsTableAllColumns[0];
                return Promise.resolve()
            },

            getRecords() {
                this.tableLoading = true;
                return this.$axios.post(this.axiosUrl, {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * this.pageData.pageSize,
                    params: {id: this.assetId}
                })
                    .then(({data: {data, recordsTotal}}) => {
                        this.recordsTableData = data;
                        this.pageData.total = recordsTotal;
                    })
                    .finally(() => this.tableLoading = false);
            },
            changeTabsType(type) {
                this.tabsType = type;
            },
            goToDetails({id}) {
                this.$router.push({
                    name: this.detailsName,
                    params: {
                        id,
                        id: this.assetId,
                    }
                });
            }
        }
    }
</script>
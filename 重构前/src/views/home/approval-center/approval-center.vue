<template>
    <div class="approval-center kld-box-effect">
        <div class="head">
            <kld-learn-more title="审批中心" jump-name="进入模块"></kld-learn-more>
        </div>
        <div class="c-table">
            <Table
                :data="tableData"
                :columns="tableColumns"
                :show-header="false"
            ></Table>
            <Loading v-if="tableLoading"></Loading>
        </div>
        <div class="table-page">
            <arrow-page
                :page-size="pageData.pageSize"
                :total="pageData.total"
                :current.sync="pageData.current"
                @on-page-change="getApprovalData"
            ></arrow-page>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @border-color: #e2e2e2;
    @border-style: 1px solid @border-color;
    .approval-center {
        width: 100%;
        display: inline-block;
        padding: 0;
        position: relative;
        >.head{
            padding: 14px 20px;
            border-bottom: @border-style;
        }
        .table-page{
            position: absolute;
            right: 127px;
            top: 10px;
        }
    }
    .c-table{
        border: none;
        height: 200px;
        position: relative;
        /deep/.ivu-table{
            tr{
                height: 100px;
                &:last-of-type{
                    td{
                        border-bottom: none;
                    }
                }
            }
            .ivu-table-tip{
                tr{
                    height: 200px;
                }
            }
        }
    }
</style>

<script>
    import kldLearnMore from '@common/kld-learn-more/index';
    import arrowPage from '../components/arrow-page';
    import poptipShowInfo from '@common/poptip-show-info';
    import testLimit from '@common/test-limit';

    const formatDate = date => date.match(/^(.+)\s/)[1];
    export default {
        name: "approval-center",
        components: {arrowPage, kldLearnMore},
        data() {
            return {
                approvalLimit: {
                    transfer: testLimit('fr:transfer'),
                    yearPlain: testLimit('ann:edit:record'),
                    scrap: testLimit('ds:edit') || testLimit('ds:undo') || testLimit('ds:agree'),
                    borrow: testLimit('borrow:ratify')
                },

                tableLoading: false,
                tableData: [],
                tableColumns: [
                    {width: 120, render(h, {row: {type}}) {
                        let typeText = '';

                        switch (type) {
                            case 1:
                                typeText = '维修转交申请';
                                break;
                            case 2:
                                typeText = '年度计划申请';
                                break;
                            case 3:
                                typeText = '报废申请';
                                break;
                            case 4:
                                typeText = '申请';
                        }

                        return h('span', typeText);
                    }},
                    {render(h, {row: {name, nameId}}) {
                        return h(
                            poptipShowInfo,
                            {props: {infoId: nameId}},
                            [
                                h(
                                    'p',
                                    '申请人'
                                ),
                                h(
                                    'p',
                                    {
                                        style: {color: '#666'},
                                        attrs: {
                                            class: 'textEllipsis',
                                            title: name
                                        }
                                    },
                                    name
                                )
                            ]
                        );
                    }},
                    {render(h, {row: {osName}}) {
                        return h('div', [
                            h('p', '所在科室'),
                            h(
                                'p',
                                {
                                    attrs: {
                                        class: 'textEllipsis',
                                        title: osName
                                    },
                                    style: {color: '#666'}
                                },
                                osName
                            )
                        ]);
                    }},
                    {render(h, {row: {time}}) {
                            return h('div', [
                                h('p', '时间'),
                                h('p', {style: {color: '#666'}}, formatDate(time))
                            ]);
                    }},
                    {render(h, {row: {type, note}}) {
                        let title = '',
                            content = note;
                        switch (type) {
                            case 1:
                                title = '维修设备';
                                break;
                            case 2:
                                title = '采购类型';
                                switch (note) {
                                    case '0':
                                        content = '10万元以下';
                                        break;
                                    case '1':
                                        content = '10万到50万';
                                        break;
                                    case '2':
                                        content = '50万以上';
                                }
                                break;
                            case 3:
                                title = '设备名称';
                                break;
                            case 4:
                                title = '设备名称';
                        }

                        return h(
                            'div',
                            [
                                h('p', title),
                                h(
                                    'p',
                                    {
                                        attrs: {
                                            class: 'textEllipsis',
                                            title: content
                                        },
                                        style: {color: '#666'}
                                    },
                                    content
                                )
                            ]
                        );
                    }},
                    {width: 130, render: (h, {row: {type, id}}) => {
                        let pushName = '';

                        switch (type) {
                            case 1:
                                if (! this.approvalLimit.transfer) return;
                                pushName = 'singer-detail';
                                break;
                            case 2:
                                if (! this.approvalLimit.yearPlain) return;
                                pushName = 'approval';
                                break;
                            case 3:
                                if (! this.approvalLimit.scrap) return;
                                pushName = 'scrap-details';
                                break;
                            case 4:
                                if (! this.approvalLimit.borrow) return;
                                pushName = 'borrow-approval-details';
                        }

                        return h(
                            'Button',
                            {
                                class: 'kld-btn',
                                style: {height: '36px'},
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: pushName,
                                            query: {id}
                                        });
                                    }
                                }
                            },
                            '进入审批'
                        );
                    }}
                ],
                pageData: {
                    total: 0,
                    pageSize: 2,
                    current: 1
                }
            };
        },
        created() {
            this.getApprovalData();
        },
        methods: {
            getApprovalData() {
                this.tableLoading = true;
                return this.$axios.post('/statistical/listApprove', {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * this.pageData.pageSize,
                    params: {}
                })
                    .then(({data: {data, recordsTotal}}) => {
                        this.pageData.total = recordsTotal;
                        this.tableData = data;
                    })
                    .finally(() => this.tableLoading = false);
            }
        }
    }
</script>
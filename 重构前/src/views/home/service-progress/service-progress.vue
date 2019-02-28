<template>
    <div class="service-progress kld-box-effect">
        <div class="head">
            <kld-learn-more
                title="维修进度"
                :view="false"
            ></kld-learn-more>
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
                    :current.sync="pageData.current"
                    :total="pageData.total"
                    :page-size="pageData.pageSize"
                    @on-page-change="getTableData"
            ></arrow-page>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @border-style: 1px solid #e2e2e2;
    .c-table{
        border: none;
        height: 86 * 2px;
        position: relative;
        /deep/.ivu-table{
            tr{
                height: 86px;
                &:last-of-type{
                    td{
                        border-bottom: none;
                    }
                }
            }
            .ivu-table-tip{
                tr{
                    height: 86 * 2px;
                }
            }
        }
    }
    .service-progress {
        padding: 0;
        position: relative;
        .head{
            padding: 14px 20px;
            border-bottom: @border-style;
        }
        .table-page{
            position: absolute;
            top: 10px;
            right: 20px;
        }
    }
</style>

<script>
    import kldLearnMore from '@common/kld-learn-more';
    import poptipShowInfo from '@common/poptip-show-info';
    import stepProgress from '../components/step-progress';
    import arrowPage from '../components/arrow-page';


    const columnsRender = (h, {title, content, ellipsis, infoId}) => {
        return h(
            infoId ? poptipShowInfo : 'div',
            infoId ? {props: {infoId}} : undefined,
            [
                h('p', {style: {color: '#020e0f', marginBottom: '10px'}}, title),
                typeof content === 'string' ?
                h(
                    'p',
                    {
                        attrs: ellipsis ? {
                            class: 'textEllipsis',
                            title: content
                        } : undefined,
                        style: {
                            color: '#666'
                        }
                    },
                    content
                ) : content
            ]
        );
    };

    export default {
        name: "service-progress",
        components: {kldLearnMore, arrowPage},
        data() {
            return {
                tableLoading: false,
                tableData: [],
                tableColumns: [
                    {render: (h, {row: {assetName}}) => columnsRender(h, {
                            title: '设备名称',
                            content: assetName,
                            ellipsis: true
                        })},
                    {render: (h, {row: {userName, userId}}) => columnsRender(h, {
                            title: '工程师',
                            content: userName,
                            infoId: userId,
                            ellipsis: true
                        })},
                    {width: 160, render: (h, {row: {phone}}) => columnsRender(h, {
                            title: '联系方式',
                            content: phone,
                            ellipsis: true
                        })},
                    {width: 480, render: (h, {row: {RepairType}}) => columnsRender(h, {
                            title: '维修进度',
                            content: h(
                                stepProgress,
                                {
                                    props: {
                                        data: [
                                            {
                                                title: '已报单',
                                                value: 0
                                            },
                                            {
                                                title: '维修中',
                                                value: 1
                                            },
                                            {
                                                title: '待验收',
                                                value: 2
                                            },
                                            {
                                                title: '已完成',
                                                value: 3
                                            }
                                        ],
                                        value: RepairType
                                    }
                                }
                            )
                        })},
                ],
                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 2
                }
            };
        },
        created() {
            this.getTableData();
        },
        methods: {
            getTableData() {
                this.tableLoading = true;
                return this.$axios.post('/statistical/reportList', {
                    offset: (this.pageData.current - 1) * this.pageData.pageSize,
                    limit: this.pageData.pageSize,
                    params: {}
                })
                    .then(({data: {data, recordsTotal}}) => {
                        this.tableData = data;
                        this.pageData.total = recordsTotal;
                    })
                    .finally(() => this.tableLoading = false);
            }
        }
    }
</script>
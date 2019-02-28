<template>
    <div class="modify-nodes">
        <Loading v-if="loading"></Loading>
        <Table :columns="tableColumns" :data="tableData"></Table>
        <div class="table-page">
            <kld-page :current.sync="pageData.current" @on-change="getModifyList" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
        </div>
        <Modal
                v-model="modifyModal.show"
                title="留痕内容"
                width="800"
        >
            <Row :gutter="20" class="modify-modal-content">
                <i-col span="12">
                    <Card :padding="0">
                        <p slot="title">原内容</p>
                        <div class="content-wrap">
                            <p class="content">{{modifyModal.oldText}}</p>
                        </div>
                    </Card>
                </i-col>
                <i-col span="12">
                    <Card :padding="0">
                        <p slot="title">修改内容</p>
                        <div class="content-wrap">
                            <p class="content">{{modifyModal.newText}}</p>
                        </div>
                    </Card>
                </i-col>
            </Row>
        </Modal>
        <Modal
                v-model="rejectModal.show"
                title="申请理由"
                width="800"
        >
            <i-input :value="rejectModal.reason" type="textarea" readonly :rows="10"></i-input>
        </Modal>
    </div>
</template>

<script type="text/jsx">
    import KldPage from '@common/page';
    import PoptipShowInfo from '@common/poptip-show-info';
    import moment from 'moment';
    import renderEllipsis from '@common/render-ellipsis';

    export default {
        name: 'modify-nodes',
        components: {
            KldPage
        },
        data() {
            return {
                tableData: [],

                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 10
                },

                loading: false,

                modifyModal: {
                    show: false,
                    oldText: '',
                    newText: ''
                },
                rejectModal: {
                    show: false,
                    reason: ''
                }
            }
        },

        computed: {
            purchaseId() {
                return this.$route.params.id;
            },
            tableColumns() {
                return [
                    {
                        title: '序号',
                        width: 80,
                        render: (h, {index}) => {
                            const {pageData: {current, pageSize}} = this;
                            return <span>{(current - 1) * pageSize + index + 1}</span>;
                        }
                    },
                    {
                        title: '时间',
                        width: 150,
                        render(h, {row: {modifyTime}}) {
                            console.log(modifyTime);
                            return <span>{moment(modifyTime).format('YYYY-MM-DD HH:mm')}</span>;
                        }
                    },
                    {
                        title: '名称',
                        width: 120,
                        render(h, {row: {state}}) {
                            return <span>{['进口设备论证', '技术参数说明', '对内公示'][state - 1]}</span>;
                        }
                    },
                    {
                        title: '创建者',
                        render: (h, {row: {applyName, applyId}}) => (
                            <PoptipShowInfo info-id={applyId}>{applyName}</PoptipShowInfo>
                        )
                    },
                    {
                        title: '修改者',
                        render: (h, {row: {modifierName, modifierId}}) => (
                            <PoptipShowInfo info-id={modifierId}>{modifierName}</PoptipShowInfo>
                        )
                    },
                    {
                        title: '留痕内容',
                        render: (h, {row: {modifyState: state, modifyContent}}) => {
                            const delimiter = '-*',
                                replaceReg = /-\*/g;

                            switch (state) {
                                case 1:
                                    return <a onClick={() => this.checkModify(...modifyContent.split(delimiter))} href="javascript:">查看内容</a>;
                                case 2:
                                    return renderEllipsis(h, `上传 (${modifyContent.replace(replaceReg, ', ')})`);
                                case 3:
                                    return renderEllipsis(h, `删除 (${modifyContent.replace(replaceReg, ', ')})`);
                                case 4:
                                    return (
                                        <a
                                            onClick={() => this.checkRejectReason(modifyContent)}
                                            disabled={modifyContent ? null : true}
                                            href="javascript:"
                                            title="点击查看申请理由"
                                        >
                                            打回申请
                                        </a>
                                    );
                                default:
                                    return (
                                        <span>
                                            {
                                                [
                                                    '对内公示',
                                                    '技术参数说明申请提交', '技术参数说明审批提交',
                                                    '进口设备论证申请提交', '进口设备论证审批提交',
                                                    '技术参数说明申请保存', '技术参数说明审批保存',
                                                    '进口设备论证申请保存', '进口设备论证审批保存'
                                                ][state - 5]
                                            }
                                        </span>
                                    );
                            }
                        }
                    }
                ];
            }
        },

        created() {
            this.getModifyList();
        },


        methods: {
            fresh() {
                this.pageData.current = 1;

                return this.getModifyList();
            },

            checkModify(oldText, newText) {
                const {modifyModal} = this;
                modifyModal.show = true;
                modifyModal.oldText = oldText;
                modifyModal.newText = newText;
            },
            checkRejectReason(reason) {
                this.rejectModal.show = true;
                this.rejectModal.reason = reason;
            },

            async getModifyList() {
                this.loading = true;
                try {
                    const {pageData: {current, pageSize}} = this;
                    const {data: {data, recordsTotal}} = await this.$axios.post('/purchase/findPurchaseVersionLog', {
                        offset: (current - 1) * pageSize,
                        limit: pageSize,
                        params: {
                            purchaseId: this.purchaseId,
                        }
                    });

                    this.tableData = data;
                    this.pageData.total = recordsTotal;
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .modify-nodes {
        position: relative;
        height: 100%;
        .table-page{
            text-align: center;
            padding: 10px;
        }
    }
    
    .modify-modal-content{
        .content-wrap{
            height: 400px;
            overflow: auto;
            .content{
                padding: 16px;
            }
        }
    }
</style>


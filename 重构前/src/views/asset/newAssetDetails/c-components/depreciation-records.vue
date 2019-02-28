<template>
    <div class="depreciation-records kld-box-effect">
        <Table @on-row-click="goToDetails" class="records-table" :columns="recordsTableColumns" :data="recordsTableData"></Table>
        <div class="table-page">
            <kld-page @on-change="getCurrentRecords" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
        </div>

        <Modal
                v-model="detailsModalShow"
                :scrollable="true"
                :width="1246"
                title="资产折旧详情"
                class-name="vertical-center-modal"
        >
            <div class="details-modal">
                <Form label-position="top">
                    <Row :gutter="20">
                        <i-col span="8">
                            <FormItem label="资产编码：">
                                <i-input :value="toUpperCase(detailsData.assetNumber)" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="资产名称：">
                                <i-input :value="detailsData.assetName" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="分配时间：">
                                <i-input :value="detailsData.collarTime" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row :gutter="20">
                        <i-col span="8">
                            <FormItem label="资产原值（元）：">
                                <i-input :value="detailsData.assetValue" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="累计折旧：">
                                <i-input :value="detailsData.depreciationValueSubtotal" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="净值：">
                                <i-input :value="detailsData.netValue" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row :gutter="20">
                        <i-col span="8">
                            <FormItem label="已折旧（月）：">
                                <i-input :value="detailsData.depreciationMonths" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="预计折旧年限（月）：">
                                <i-input :value="detailsData.depreciationAgeLimit" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="折旧方式：">
                                <i-input value="平均年限法" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row :gutter="20">
                        <i-col span="8">
                            <FormItem label="月折旧率：">
                                <i-input :value="detailsData.depreciationRate" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                        <i-col span="8">
                            <FormItem label="月折旧额（月）：">
                                <i-input :value="detailsData.depreciationValue" class="kld-input" disabled></i-input>
                            </FormItem>
                        </i-col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button class="kld-btn-default" @click="detailsModalShow = false">返回</Button>
            </div>
        </Modal>
    </div>
</template>

<style lang="less" scoped>
    @import "./common";
    .depreciation-records{
        position: relative;
    }
    .records-table{
        /deep/.ivu-table-body{
            tr{
                height: 74px;
            }
        }
    }
    .table-page{
        padding-top: 20px;
        text-align: center;
    }
    .details-modal{
        .ivu-row{
            margin-bottom: 16px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
    }
</style>

<script>
    import kldPage from '@common/page/page';
    import renderEllipsis from '@common/render-ellipsis';
    import {toUpperCase} from '@/utils';

    export default {
        name: "depreciation-records",
        components: {kldPage},
        data() {
            return {
                recordsTableColumns: [
                    {title: '资产名称', render: (h, {row: {assetName, assetNumber}}) => {
                            return h(
                                'div',
                                [
                                    h(
                                        'p',
                                        {
                                            attrs: {
                                                class: 'textEllipsis kld-success'
                                            }
                                        },
                                        assetName
                                    ),
                                    h(
                                        'p',
                                        {
                                            attrs: {
                                                class: 'textEllipsis'
                                            }
                                        },
                                        assetNumber
                                    )
                                ]
                            );
                        }},
                    {title: '设备型号', render: (h, {row: {assetModel}}) => renderEllipsis(h, assetModel)},
                    {title: '设备分类', render: (h, {row: {assetType}}) => renderEllipsis(h, assetType)},
                    {title: '资产原值(元)', width: 140, key: 'assetValue'},
                    {title: '已折旧(月)',  width: 140, key: 'depreciationMonths'},
                    {title: '月折旧额(元)',  width: 140, key: 'depreciationValue'},
                    {title: '累计折旧(元)',  width: 140, render : (h, {row: {depreciationValueSubtotal}}) => {
                            return h(
                                'p',
                                {class: 'kld-error'},
                                depreciationValueSubtotal
                            );
                        }},
                    {title: '净值(元)', width: 140, render: (h, {row: {netValue}}) => {
                            return h(
                                'p',
                                {class: 'kld-success'},
                                netValue
                            );
                        }}
                ],
                recordsTableData: [],
                recordsAllData: [],
                pageData: {
                    total: 0,
                    pageSize: 10,
                    current: 1
                },

                detailsModalShow: false,
                detailsData: {}
            };
        },
        props: {
            loaded: Function
        },
        computed: {
            assetId() {
                return this.$route.params.id;
            },
            user_in() {
                return this.$store.state.user_in;
            }
        },
        created() {
            this.getAssetCode()
                .then(this.getRecords)
                .then(
                    () => {
                        this.getCurrentRecords();
                        typeof this.loaded === 'function' && this.loaded();
                    },
                    () => typeof this.loaded === 'function' && this.loaded(false)
                );
        },
        methods: {
            getAssetCode() {
                return this.$axios.get(`/assets/${this.user_in.osId}/${this.assetId}`)
                    .then(({data: {assetCode}}) => assetCode);
            },
            getRecords(assetCode) {
                return this.$axios.get(`/depreciation/${assetCode}`)
                    .then(({data}) => {
                        this.recordsAllData = data;
                        this.pageData.total = data.length;
                    });
            },

            getCurrentRecords() {
                const start = (this.pageData.current - 1) * this.pageData.pageSize;

                this.recordsTableData = this.recordsAllData.slice(
                    start,
                    start + this.pageData.pageSize
                );
            },

            goToDetails(row) {
                this.detailsData = row;
                this.detailsModalShow = true;
            },
            toUpperCase
        }
    }
</script>
<template>
    <div class="kld-box-effect purchase-records">
        <Form label-position="top">
            <kld-title>
                <span>基础信息</span>
                <!--<Button class="kld-btn print" icon="printer">打印</Button>-->
            </kld-title>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="申请科室：">
                        <i-input :value="recordsData.osName" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="申请时间：">
                        <i-input :value="formatDate(recordsData.arTime)" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="科室电话：">
                        <i-input :value="recordsData.osPhone" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <kld-title>设备采购信息</kld-title>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="采购类型：">
                        <i-input v-if="recordsData.arType === 0" value="小于10W" class="kld-input" disabled></i-input>
                        <i-input v-else-if="recordsData.arType === 1" value="10W-50W" class="kld-input" disabled></i-input>
                        <i-input v-else-if="recordsData.arType === 2" value="大于50W" class="kld-input" disabled></i-input>
                        <i-input v-else class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="公示人：">
                        <i-input :value="recordsData.openName" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="公示时间：">
                        <i-input :value="recordsData.openTime" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col>
                    <Table class="records-table" :data="recordsTableData" :columns="recordsTableColumns"></Table>
                </i-col>
            </Row>
            <kld-title>采购原因</kld-title>
            <Row :gutter="20">
                <i-col>
                    <i-input :value="recordsData.arWhy" :rows="4" disabled type="textarea"></i-input>
                </i-col>
            </Row>
            <kld-title>效益预估</kld-title>
            <Row :gutter="20">
                <i-col>
                    <i-input :value="recordsData.arBenefits" :rows="4" readonly disabled type="textarea"></i-input>
                </i-col>
            </Row>
            <kld-title>审批说明意见</kld-title>
            <Row :gutter="20">
                <i-col>
                    <i-input :value="recordsData.arOpinion" :rows="4" disabled type="textarea"></i-input>
                </i-col>
            </Row>
        </Form>
    </div>
</template>

<style lang="less" scoped>
    @import "./common";
    .kld-title{
        position: relative;
        .kld-btn{
            position: absolute;
            right: 0;
            bottom: 6px;
        }
    }
    .ivu-row{
        margin-top: 20px;
    }
</style>

<script>
    import kldTitle from './kld-title';
    export default {
        name: "purchase-records",
        components: {kldTitle},
        props: {
            loaded: Function
        },
        data() {
            return {
                recordsData: {},
                recordsTableColumns: [
                    {title: '序号', width: 120, render: (h, {index}) => h('p', (index + 1).toString().padStart(2, '0'))},
                    {title: '设备名称', render(h, {row: {assetName}}) {
                        return h(
                            'p',
                            {
                                attrs: {
                                    class: 'textEllipsis',
                                    title: assetName
                                },
                            },
                            assetName
                        );
                    }},
                    {title: '申请数量', width: 120, key: 'number'},
                    {title: '公示数量',  width: 120, key: 'openNumber'},
                    {title: '预算单价', key: 'money'},
                    {title: '意向品牌（多选）', key: 'brandName'},
                    {title: '备注', key: 'note'}
                ],
                recordsTableData: []
            };
        },
        created() {
            this.getRecords()
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
        methods: {
            getRecords() {
                return this.$axios.get(`/assets/getAnnualPlan/${this.assetId}`)
                    .then(({data}) => {
                        this.recordsData = data;
                        this.recordsTableData = data.annualplanPurchases;
                    });
            },
            formatDate(date) {
                return date && date.replace(/\s.*$/, '');
            }
        }
    }
</script>
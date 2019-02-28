<template>
    <component
            :is="isCollapse ? 'kld-collapse' : 'div'"
            :open="false"
            class="annual-fifty-step1"
            title="申请计划详情"
    >
        <div style="padding: 10px 20px;">
            <base-info :data="data"></base-info>
            <procurement-name :detail="isDetail" :procurement="formData" ref="procurement-name" :type="$route.query.type"></procurement-name>
            <div class="single-input">
                <kld-type title="采购原因 *"></kld-type>
                <Form :model="formData" ref="single-input-1">
                    <FormItem :rules="{required: true, message: '采购原因为必填'}" prop="buyWhy">
                        <i-input type="textarea" v-model="formData.buyWhy" :rows="6" :disabled="isDetail"></i-input>
                    </FormItem>
                </Form>
            </div>
            <analyze-info ref="analyze-info" :detail="isDetail" :select-data="formData"></analyze-info>
            <div class="single-input">
                <kld-type title="社会效益分析 *"></kld-type>
                <Form :model="formData" ref="single-input-2">
                    <FormItem :rules="{required: true, message: '社会效益分析为必填'}" prop="benefitAnalysis">
                        <i-input type="textarea" v-model="formData.benefitAnalysis" :rows="6" :disabled="isDetail"></i-input>
                    </FormItem>
                </Form>
            </div>
            <feasibility-report
                    v-model="formData.annualPlanMore"
                    :data="data"
                    ref="feasibility-report"
                    :is-detail="isDetail"
            ></feasibility-report>
        </div>
    </component>
</template>

<script>
    import BaseInfo from '../../common/basic-info';
    import FeasibilityReport from '../../common/feasibility-report';
    import AnalyzeInfo from '../../../add-annual/common/analyze';
    import ProcurementName from '../../../add-annual/common/procurement-name'
    import KldType from '@common/kld-type';
    // import kldConfirm from '@common/kld-confirm';
    import emptyToNull from '@common/empty-to-null';
    import noExpandMerge from '@common/no-expand-merge';
    import KldCollapse from "../../common/kld-collapse/index";


    export default {
        name: 'annual-fifty-step1',
        components: {KldCollapse, BaseInfo, FeasibilityReport, AnalyzeInfo, ProcurementName, KldType},
        props: {
            data: {
                type: Object
            },
            isCollapse: {
                type: Boolean,
                default: false
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                formData: {
                    id: '',
                    planType: this.$route.query.type,
                    buyType: '',
                    buyWhy: '',
                    benefitAnalysis: '',
                    assetName: '',
                    assetNum: '',
                    assetMoney: '',
                    totalPrice: '',
                    importation: 1,
                    capitalSource: 1,

                    durableYears: '',
                    rates: '',
                    expectIncome: '',
                    depreciationCost: '',
                    staffCost: '',
                    maintainCost: '',
                    consumableCost: '',
                    surplus: '',
                    recycle: '',

                    annualPlanMore: {
                        sectionResume: '',
                        projectNecessity: '',
                        configDemand: '',
                        configPeople: '',
                        projectSetout: '',
                        siteSetout: '',
                        economicAnalysis: '',
                        applyReason: '',
                        socialBenefitAnalysis: '',
                        funding: ''
                    }
                }
            }
        },
        watch: {
            data: {
                immediate: true,
                handler(data) {
                    if (data) {
                        data.assetMoney /= 10000;
                        noExpandMerge(this.formData, data);
                    }
                }
            }
        },
        computed: {
            isDetails() {
                const $route = this.$route;
                switch ($route.name) {
                    case 'fifty-annual-details':
                    case 'two-hundred-annual-details':
                        return true;
                    default:
                        return $route.query.step === '1';
                }
            }
        },
        methods: {
            async submit(cache = false) {
                //缓存不需要验证
                if (! cache && ! await this.validate()) {
                    return;
                }

                const data = emptyToNull(this.formData);

                //单价单位为元，乘以一万
                data.assetMoney *= 10000;

                //计算总价
                data.totalPrice = data.assetMoney * data.assetNum;

                await this.$axios.post(
                    cache ?
                        '/annualPlanTmp/saveAnnualPlanMoreCaChe' :
                        '/annualPlanTmp/saveAnnualPlanMore',
                    data
                );

                this.$Message.success(
                    cache ?
                        '缓存成功' :
                        '提交申请成功'
                );

                this.$router.go(-1);
            },
            validate() {
                const {
                    'procurement-name' : procurementName,
                    'analyze-info' : analyzeInfo,
                    'feasibility-report': report,
                    'single-input-1': input1,
                    'single-input-2': input2
                } = this.$refs;

                return Promise.all([
                    procurementName.rules(),
                    analyzeInfo.verify(),
                    report.validate(),
                    input1.validate(),
                    input2.validate()
                ])
                    .then(res => res.every(i => i));
            }
        },
    }
</script>
<style lang="less" scoped>
    .annual-fifty-step1 {
        width: 100%;
        .single-type {
            width: 100%;
        }
    }

    .single-input {
        margin: 30px 0;
    }
</style>


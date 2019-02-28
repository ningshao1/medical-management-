<template>
    <div class="feasibility-report" @keydown.tab.prevent>
        <kld-type title="可行性论证报告*"></kld-type>
        <div class="tabs-wrap">
            <Tabs type="card" v-model="currentTab">
                <template v-for="tab in allTabs">
                    <TabPane :name="tab.name" :label="tabHeaderRender(tab)">
                        <i-input
                                @on-focus="tabTextAreaFocus(tab.name, tab.placeholder)"
                                v-model="value[tab.name]"
                                :placeholder="tab.placeholder"
                                :maxlength="2000"
                                type="textarea"
                                :rows="6"
                                :disabled="isDetail"
                        ></i-input>
                    </TabPane>
                </template>
            </Tabs>
        </div>
    </div>
</template>
<script>
import kldType from "@common/kld-type/kld-type";
export default {
    components: { kldType },
    props: {
        value: {
            type: Object,
            default() {
                return {
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
                };
            }
        },
        isDetail: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentTab: '',
            allTabs: [
                {label: '科室概况', name: 'sectionResume', placeholder: '阐述学科建设水平、现有设备情况、设备使用与开展项目情况等。'},
                {label: '申请理由', name: 'applyReason', placeholder: '阐述拟引进设备在医疗、科研、教育中的作用；\n可完成哪些检查、治疗工作；\n在学科建设中的地位，可达到的目标；\n所了解的在周边同类医院中应用情况等。'},
                {label: '项目必要性', name: 'projectNecessity', placeholder: '阐述拟引进设备是否临床工作常规必备设备？\n是否三级医院技术要求必备设备？\n是否本专科核心技术开展必备设备？\n是否省、市级重点学科建设必备设备？\n是否新技术、新项目开展必需设备？\n是否科研项目或教学任务开展必需设备？'},
                {label: '设备配置要求', name: 'configDemand', placeholder: '阐述拟引进设备配置要求、主要技术参数、数量；\n拟引进设备产地：国产或进口；\n现有同类设备情况：首次新引进、设备更新、增加数量；\n推荐引进的设备品牌、型号，请提供3个以上。'},
                {label: '经济效益分析', name: 'economicAnalysis', placeholder: '阐述拟引进设备使用年限；\n预期的年工作量情况；\n年收入情况：收费标准，产值；\n年支出情况：维修费用、人员开支、易耗品开支、水电气开支等；\n是否需用到耗材、耗品、试剂、专用药品？\n需用耗材、耗品是否为省、市中标目录内产品？\n消耗品年支出情况；\n设备收益情况：收支结余、设备成本回收期限等。'},
                {label: '社会效益分析', name: 'socialBenefitAnalysis', placeholder: '阐述拟引进设备能为百姓医疗服务带来哪些便利；\n是否能填补技术空白；\n是否能提升医院知名度；\n是否能承担政府保障职能；\n在临床科研工作、教学任务中的作用等。'},
                {label: '资金预算来源', name: 'funding', placeholder: ''},
                {label: '人员配备情况', name: 'configPeople', placeholder: '阐述设备项目开展人员储备情况、技术准入资质、操作上岗证等具备情况。'},
                {label: '场地配备情况', name: 'siteSetout', placeholder: '阐述设备工作场所准备，水电气要求，辐射防护、排污环保等要求。'},
                {label: '项目准备周期', name: 'projectSetout', placeholder: '内容格式（申报日期自？年？月，拟投入使用日期为？年？月。）'}
            ]
        };
    },
    methods: {
        tabHeaderRender({label, name}) {
            return h => {
                return h('div',{
                    class: 'header-render'
                },[
                    h('span', label),
                    h('div',{
                        class: 'correct-saved',
                        style:{
                            display: this.value[name] ? 'block' : 'none',
                        }
                    },[
                        h('div',{
                            class: 'trangle-background'
                        }),
                        h('Icon',{
                            props:{
                                type:'checkmark'
                            },
                            class: 'icon-wrap'
                        })
                    ])
                ])
            }
        },
        tabTextAreaFocus(name, placeholder) {
            if (! this.value[name]) {
                this.value[name] = placeholder;
            }
        },
        validate() {
            for (const [, value] of Object.entries(this.value)) {
                if (! value) {
                    this.$Message.warning('请填写所有可行性论证报告');
                    return false;
                }
            }

            return true;
        }
    }
};
</script>

<style lang="less" scoped>
.feasibility-report {
    .asset-name-wrap {
        display: flex;
        align-items: center;
        margin: 25px 0;
        .asset-name {
            font-size: 14px;
            color: #000000;
            display: inline-block;
            margin-right: 20px;
        }
        .details-asset-name {
            font-size: 16px;
            color: #0c8399;
        }
    }
    /deep/.tabs-wrap {
        .ivu-tabs-bar {
            .ivu-tabs-tab {
                background-color: #e3e3e3;
                color: #666666;
                &-active {
                    background-color: #f3f4f5;
                    color: #22a1b9;
                    height: auto;
                }
            }
            .ivu-tabs-nav-container {
                height: auto;
            }
        }
        .ivu-tabs-tabpane {
            padding: 3px;

            .single-report-config {
                height: 30px;
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .config-button {
                    margin-right: 10px;
                    font-size: 14px;
                    cursor: pointer;
                    &-save {
                        color: #2195ec;
                    }
                    &-edit {
                        color: #2195ec;
                    }
                    &-cancel {
                        color: #999999;
                    }
                }
            }
            .ivu-input {
                width: 100%;
            }
            /*.ivu-input:hover {*/
                /*border-color: rgba(2, 31, 57, 0.1) !important;*/
            /*}*/
            .asset-source {
                display: flex;
                margin-bottom: 10px;
                font-size: 14px;
                align-items: center;
                position: absolute;
                top: -25px;
                left: 0;
            }
        }
        .active-tab {
            height: 100px;
        }
    }
    /deep/.header-render {
        position: relative;
        .correct-saved {
            position: absolute;
            top: -5px;
            right: -16px;
            width: 20px;
            height: 20px;
            .trangle-background {
                position: absolute;
                width: 0px;
                height: 0px;
                top: 0;
                right: 0;
                border-color: #459ca2 #459ca2 transparent transparent;
                border-width: 10px;
                border-style: solid;
            }
            .icon-wrap {
                position: absolute;
                top: 2px;
                right: -9px;
                color: #fff;
                font-size: 10px;
            }
        }
    }
}
</style>

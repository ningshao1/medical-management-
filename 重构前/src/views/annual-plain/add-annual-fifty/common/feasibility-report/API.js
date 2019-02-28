import capitalBudget from './capital-budget'
let tabPanesBasic=[
    {
        label: "科室概况",
        name:'sectionResume',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述学科建设水平、现有设备情况、设备使用与开展项目情况等。"
            },
            source: null
        },
    },
    {
        label: "申请理由",
        name:'buyWhy',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述拟引进设备在医疗、科研、教育中的作用；\n可完成哪些检查、治疗工作；\n在学科建设中的地位，可达到的目标；\n所了解的在周边同类医院中应用情况等。"
            },
            source: null
        },
    },
    {
        label: "项目必要性",
        name:'projectNecessity',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述拟引进设备是否临床工作常规必备设备？\n是否三级医院技术要求必备设备？\n是否本专科核心技术开展必备设备？\n是否省、市级重点学科建设必备设备？\n是否新技术、新项目开展必需设备？\n是否科研项目或教学任务开展必需设备？"
            },
            source: null
        },
    },
    {
        label: "设备配置要求",
        name:'configDemand',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: `阐述拟引进设备配置要求、主要技术参数、数量；\n拟引进设备产地：国产或进口；\n现有同类设备情况：首次新引进、设备更新、增加数量；\n推荐引进的设备品牌、型号，请提供3个以上。`
            },
            source: 1//importation
        },
    },
    {
        label: "经济效益分析",
        name:'economicAnalysis',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述拟引进设备使用年限；\n预期的年工作量情况；\n年收入情况：收费标准，产值；\n年支出情况：维修费用、人员开支、易耗品开支、水电气开支等；\n是否需用到耗材、耗品、试剂、专用药品？\n需用耗材、耗品是否为省、市中标目录内产品？\n消耗品年支出情况；\n设备收益情况：收支结余、设备成本回收期限等。"
            },
            source: null
        },
    },
    {
        label: "社会效益分析",
        name:'benefitAnalysis',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述拟引进设备能为百姓医疗服务带来哪些便利；\n是否能填补技术空白；\n是否能提升医院知名度；\n是否能承担政府保障职能；\n在临床科研工作、教学任务中的作用等。"
            },
            source: null
        },
    },
    {
        label: "资金预算来源",
        name:"sourceOfFundingBudget",
        tabPaneInfo: {
            assetMoney:null,
            assetNum:null,
            totalPrice:null,
            capitalSource:null,
        },
        component:capitalBudget
    },
    {
        label: "人员配备情况",
        name:'configPeople',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述设备项目开展人员储备情况、技术准入资质、操作上岗证等具备情况。"
            },
            source: null
        },
    },
    {
        label: "场地配备情况",
        name:'siteSetout',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "阐述设备工作场所准备，水电气要求，辐射防护、排污环保等要求。"
            },
            source: null
        },
    },
    {
        label: "项目准备周期",
        name:'projectSetout',
        tabPaneInfo: {
            inputInfo: {
                text: null,
                placeholder: "内容格式（申报日期自？年？月，拟投入使用日期为？年？月。）"
            },
            source: null
        },
    }
];
let tabPanes=function(){

    return tabPanesBasic.map(v=>{
        return {
            headerRender:(step)=>{
                // console.log(step)
                // step.qualified=!!(!step.editing&&step.saved&&!this.details&&step.nonempty);
                step.qualified=!!(!step.editing&&step.saved&&!this.details);
                // console.log(!step.editing,step.saved,step.label)
                return (h)=>{
                    return h('div',{
                        class:{
                            'header-render':true
                        }
                    },[
                        h('span',v.label),
                        h('div',{
                            class:{
                                'correct-saved':true
                            },
                            style:{
                                display:step.qualified?'block':'none',
                                // display:'block',
                            }
                        },[
                            h('div',{
                                class:{
                                    'trangle-background':true
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type:'checkmark'
                                },
                                class:{
                                    'icon-wrap':true
                                }
                            })
                        ])
                    ])
                }
            },
            ...v,
            editing:true,
            saved:false,
            qualified:false,
            savedInfo:JSON.parse(JSON.stringify(v.tabPaneInfo))
        }
    })
}

export {
    tabPanes
}
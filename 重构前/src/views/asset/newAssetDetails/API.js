import assetDetails from './assetDetails/index';
import purchaseRecords from './c-components/purchase-records';
import acceptRecords from './c-components/accept-records';
import maintenance from './maintenance/index'
import depreiationRecords from './c-components/depreciation-records';
import inspectRecords from './c-components/inspect-records';
import MaintenanceRecords from "./MaintenanceRecords";
import MeasurementRecords from "./MeasurementRecords";
import AdverseEvent from "./AdverseEvent";
import adjustRecords from './c-components/adjust-records';

let assetDetailsImage=require('./static/资产详情.png');
let purchaseRecordsImage=require("./static/采购记录.png");
let acceptRecordsImage=require('./static/验收记录.png')
let maintenanceImage=require("./static/维修记录.png");
let depreiationRecordsImage=require('./static/折旧信息.png')
let inspectRecordsImage=require('./static/巡检记录.png')
let MaintenanceRecordsImage=require('./static/保养记录.png')
let MeasurementRecordsImage=require('./static/计量记录.png')
let AdverseEventImage=require('./static/不良事件.png')
let adjustRecordsImage=require('./static/设备调剂.png')
let placeholder1=require('./static/配置许可证.png')
let placeholder2=require('./static/配置规划执行.png')
let placeholder3=require('./static/操作规程.png')




const assetInfo=[//tab页信息表格式
    {
        TabPaneInfo:{//分页render信息
            name:'assetDetails',//key不可重复
            title:'设备详情',//tab标题
            imgUrl:assetDetailsImage,//标题前图片
        },
        component: assetDetails,//内容组件
        loaded: false,//是否请求过数据
        loadData: false//数据是否请求成功
    },
    {
        TabPaneInfo:{
            name:'purchaseRecords',
            title:'采购记录',
            imgUrl:purchaseRecordsImage,
        },
        component: purchaseRecords,
        loaded: false,
        loadData: false
    },

    {
        TabPaneInfo:{
            name:'acceptRecords',
            title:'验收记录',
            imgUrl:acceptRecordsImage,
        },
        component: acceptRecords,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'maintenance',
            title:'维修记录',
            imgUrl:maintenanceImage,
        },
        component: maintenance,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'depreiationRecords',
            title:'折旧信息',
            imgUrl:depreiationRecordsImage,
        },
        component: depreiationRecords,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'inspectRecords',
            title:'巡检记录',
            imgUrl:inspectRecordsImage,
        },
        component: inspectRecords,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'MaintenanceRecords',
            title:'保养记录',
            imgUrl:MaintenanceRecordsImage,
        },
        component: MaintenanceRecords,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'MeasurementRecords',
            title:'计量记录',
            imgUrl:MeasurementRecordsImage,
        },
        component: MeasurementRecords,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'AdverseEvent',
            title:'不良事件',
            imgUrl:AdverseEventImage,
        },
        component: AdverseEvent,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'adjust-records',
            title:'设备调剂',
            imgUrl:adjustRecordsImage,
        },
        component: adjustRecords,
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'placeholder1',
            title:'配置许可证',
            imgUrl:placeholder1,
        },
        component: {
            render: (h) => {
                return h('div', {
                    style: {
                        padding: "15px",
                        fontSize: "16px",
                    }
                }, '暂无')
            }, props: ["loaded"], created() {
                this.loaded();
            }
        },
        loaded: false,
        loadData: false
    }, 
    {
        TabPaneInfo:{
            name:'placeholder2',
            title:'配置规划执行',
            imgUrl:placeholder2,
        },
        component: {
            render: (h) => {
                return h('div', {
                    style: {
                        padding: "15px",
                        fontSize: "16px",
                    }
                }, '暂无')
            }, props: ["loaded"], created() {
                this.loaded();
            }
        },
        loaded: false,
        loadData: false
    },
    {
        TabPaneInfo:{
            name:'placeholder3',
            title:'操作规程',
            imgUrl:placeholder3,
        },
        component: {
            render: (h) => {
                return h('div', {
                    style: {
                        padding: "15px",
                        fontSize: "16px",
                    }
                }, '暂无')
            }, props: ["loaded"], created() {
                this.loaded();
            }
        },
        loaded: false,
        loadData: false
    }

]


const labelRender=function({imgUrl,title,name}){
    return (h)=>{
        return h('div',{
            style:{
                display: 'flex',
                alignItems: 'center',
                position:'relative'
            }
        },[
            imgUrl?h('img',{
                style:{
                    width:'18px',
                    height:'18px',
                    
                },
                attrs:{
                    src:imgUrl
                }
            }):'',
            h('span',{
                style:{
                    display:'block',
                    marginLeft:'5px'
                }
            },title),
            this.redDOt[name]?
                    h('i',{
                        style:{
                            display:'inline-block',
                            width:"8px",
                            height:'8px',
                            "background-color":"red",
                            "border-radius":"50%",
                            position:'absolute',
                            top:'0',
                            right:'-10px'
                        }
                    })
                    :
                    ''
        ])
    }
}
let tabPanes = function () {
    return assetInfo.map(({TabPaneInfo,component,loaded,loadData})=>{
        
        return {
            label:labelRender.call(this,TabPaneInfo),
            component,
            loaded,
            loadData,
        }
    })
}
export { tabPanes }



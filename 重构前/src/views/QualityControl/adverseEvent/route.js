const adverseEvent=()=>import("./adverseEventList/adverseEventList"),
      reportAdverseEvent=()=>import("./reportAdverseEvent/reportAdverseEvent"),
      adverseEventDetail=()=>import('./adverseEventList/print/print.vue');

let route=[
    {
        path:"adverseEvent",
        component:{render: h => h('router-view')},
        meta:{
            label:"不良事件",
            imgUrl: require("../static/pageTipImg/不良事件.png")
        },
        redirect: {name: 'adverse-event-list'},
        children:[
            {
                path:"adverseEvent",
                name:'adverse-event-list',
                component:adverseEvent,
                meta:{
                    label:'不良事件列表',
                    breadcrumbHide: true,
                    imgUrl:require("../static/pageTipImg/不良事件.png"),
                    limit: 'pm:adverseevent'
                }
            },
            {
                path:"reportAdverseEvent",
                name:'report-adverse-event',
                component:reportAdverseEvent,
                meta:{
                    label:'不良事件上报',
                    imgUrl:require("../static/pageTipImg/不良事件.png"),
                    limit: 'pm:adverseevent:upload'
                }
            },
            {
                path:"adverseEventDetail",
                name:'adverseEventDetail',
                component:adverseEventDetail,
                meta:{
                    label:'不良事件详情',
                    limit: 'pm:adverseevent:query'
                }
            }
        ]
    }
];
export default route;
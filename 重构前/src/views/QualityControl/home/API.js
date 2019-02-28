//科长页面
let chief = function() {
    return [
        {
            title: "巡检任务",
            imgUrl: require("../static/img/巡检.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:inspection:element"),
                    // limit:true,
                    page: "巡检要素管理",
                    url: { name: "inspection-element" }
                },
                {
                    limit: this.ViewLimit("pm:inspection:model"),
                    // limit:true,
                    page: "巡检模板管理",
                    url: { name: "inspection-template" }
                },
                {
                    limit: this.ViewLimit("pm:inspection:task"),
                    // limit:true,
                    page: " 巡检任务管理",
                    url: { name: "inspection-task" }
                }
            ]
        },
        {
            title: "保养任务",
            imgUrl: require("../static/img/保养.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:maintain:element"),
                    // limit:true,
                    page: "保养要素管理",
                    url: { name: "MaintenanceFactors" }
                },
                {
                    limit: this.ViewLimit("pm:maintain:model"),
                    // limit:true,
                    page: "保养模板管理",
                    url: { name: "templateList_" }
                },
                {
                    limit:
                        this.ViewLimit("pm:one:task") ||
                        this.ViewLimit("pm:two:task") ||
                        this.ViewLimit("pm:three:task"),
                    // limit:true,
                    page: "保养任务管理",
                    url: { name: "MaintenanceTask_" }
                }
            ]
        },
        {
            title: "设备计量",
            imgUrl: require("../static/img/设备计量.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:measurement"),
                    page: "正常设备计量",
                    url: { name: "normal-EM" }
                },
                {
                    limit: this.ViewLimit("pm:lowmeasurement"),
                    // limit:true,
                    page: "低值设备计量",
                    url: { name: "low-value-EM" }
                }
            ]
        },
        {
            title: "不良事件",
            imgUrl: require("../static/img/不良事件.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:adverseevent"),
                    page: "不良事件列表",
                    url: { name: "adverse-event-list" }
                },
                {
                    limit: this.ViewLimit("pm:adverseevent:upload"),
                    page: "不良事件上报",
                    url: { name: "report-adverse-event" }
                }
            ]
        }
    ];
};
//工程师页面
let engineerList = function() {
    return [
        {
            title: "巡检任务",
            imgUrl: require("../static/img/巡检.png"),
            children: [
                {
                    limit:
                        this.ViewLimit("pm:inspection:element") &&
                        this.ViewLimit("pm:inspection:element:list"),
                    page: "巡检要素管理",
                    url: { name: "inspection-element" }
                },
                {
                    limit: this.ViewLimit("pm:inspection:model"),
                    page: "巡检模板管理",
                    url: { name: "inspection-template" }
                },
                {
                    limit: this.ViewLimit("pm:inspection:task"),
                    page: " 巡检任务管理",
                    url: { name: "inspection-task" }
                }
            ]
        },
        {
            title: "保养任务",
            imgUrl: require("../static/img/保养.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:maintain:element"),
                    page: "保养要素管理",
                    url: { name: "MaintenanceFactors" }
                },
                {
                    limit: this.ViewLimit("pm:maintain:model"),
                    page: "保养模板管理",
                    url: { name: "templateList_" }
                },
                {
                    limit:
                        this.ViewLimit("pm:one:task") ||
                        this.ViewLimit("pm:two:task") ||
                        this.ViewLimit("pm:three:task"),
                    page: "保养任务管理",
                    url: { name: "MaintenanceTask_" }
                }
            ]
        },
        {
            title: "不良事件",
            imgUrl: require("../static/img/不良事件.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:adverseevent"),
                    page: "不良事件列表",
                    url: { name: "adverse-event-list" }
                },
                {
                    limit: this.ViewLimit("pm:adverseevent:upload"),
                    page: "不良事件上报",
                    url: { name: "report-adverse-event" }
                }
            ]
        },
        {
            title: "设备计量",
            imgUrl: require("../static/img/设备计量.png"),
            children: [
                {
                    limit: this.ViewLimit("pm:measurement"),
                    page: "正常设备计量",
                    url: { name: "normal-EM" }
                },
                {
                    limit: this.ViewLimit("pm:lowmeasurement"),
                    page: "低值设备计量",
                    url: { name: "low-value-EM" }
                }
            ]
        }
    ];
};
//医生页面
let doctorList = function() {
    return [
        {
            title: "保养任务",
            imgUrl: require("../static/img/保养.png"),
            children: [
                {
                    page: "日常保养任务",
                    url: { name: "MaintenanceTask" }
                }
            ]
        },
        {
            title: "不良事件",
            imgUrl: require("../static/img/不良事件.png"),
            children: [
                {
                    page: "不良事件列表",
                    url: { name: "adverse-event-list" }
                },
                {
                    page: "不良事件上报",
                    url: { name: "report-adverse-event" }
                }
            ]
        }
    ];
};
//chief
let digitalImgs = [
    require("../static/img/巡检2.png"),
    require("../static/img/日常保养2.png"),
    require("../static/img/二级保养2.png"),
    require("../static/img/三级保养2.png"),
    require("../static/img/不良事件2.png")
];
//doctor
let docLineOne = [
    require("../static/img/日常保养（大）.png"),
    require("../static/img/不良事件（大）.png")
];
//日历数据格式化
function calendarDataFormat(data) {
    let status = ["未开始", "执行中", "已完成", "未完成", "逾期"];
    let type = [
        undefined,
        {
            name: "巡检任务",
            color: "#9ac4fe"
        },
        {
            name: "保养任务",
            color: "#fb9796"
        },
        {
            name: "不良事件",
            color: "#f7a16e"
        },
        {
            name: "日常保养",
            color: [undefined, "#6a84e8", "#459ca2"]
        }
    ];
    let tipStyle = {
        title: `'font-size: 14px;color: #666666;'`,
        content: `'font-size: 12px;color: #020e0f;'`
    };
    return data.filter(v => !(v.type == 4 && v.status == 0)).map(v => {
        if (v.type == 1 || v.type == 2) {
            return {
                start: new Date(v.startTime),
                title: `${type[v.type].name}`,
                color: "#fff",
                bgColor: type[v.type].color,
                data: {
                    jump:
                        v.type == 1
                            ? this.ViewLimit("pm:inspection:task")
                            : this.ViewLimit("pm:two:task"),
                    // jump:true,
                    page:
                        v.type === 1
                            ? "inspection-task-list"
                            : "MaintenanceTask"
                },
                popupTemplate: [
                    {
                        title: `<span style=${tipStyle.title}>执行时间</span>`,
                        content: `<span style=${tipStyle.content}>${
                            v.startTime
                        }至${v.endTime}</span>`
                    },
                    {
                        title: `<span style=${tipStyle.title}>任务状态</span>`,
                        content: `<span style=${tipStyle.content}>${
                            status[v.status]
                        }</span>`
                    }
                ]
            };
        }
        if (v.type == 3) {
            return {
                start: new Date(v.startTime),
                title: `${type[v.type].name}`,
                color: "#fff",
                bgColor: type[v.type].color,
                data: {
                    jump: this.ViewLimit("pm:adverseevent"),
                    page: "adverse-event-list"
                },
                popupTemplate: [
                    {
                        title: `<span style=${tipStyle.title}>上报人</span>`,
                        content: `<span style=${tipStyle.content}>${
                            v.uploadName ? v.uploadName : "暂无"
                        }</span>`
                    },
                    {
                        title: `<span style=${tipStyle.title}>事后结果</span>`,
                        content: `<span style=${tipStyle.content}>${
                            v.aeConsequence ? v.aeConsequence : "暂无"
                        }</span>`
                    }
                ]
            };
        }
        if (v.type == 4) {
            return {
                start: new Date(v.startTime),
                title: `${type[v.type].name}`,
                color: "#fff",
                bgColor: type[v.type].color[v.status],
                data: {
                    jump: this.ViewLimit("pm:one:task"),
                    // jump:true,
                    page: "MaintenanceTask"
                }
            };
        }
    });
}

export {
    chief,
    engineerList,
    doctorList,
    digitalImgs,
    docLineOne,
    calendarDataFormat
};

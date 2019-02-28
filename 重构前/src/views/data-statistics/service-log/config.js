import moment from 'moment';
export const column = [{
        title: "设备名称",
        key: "assetName",
        align: "left",
        show: true
    },
    {
        title: "所属科室",
        key: "osName",
        align: "left",
        show: true
    },
    {
        title: "设备品牌",
        key: "brandName",
        align: "left",
        show: true
    },
    {
        title: "设备型号",
        key: "assetClass",
        align: "left",
        show: true
    },
    {
        title: "保修状态",
        key: "warrantyStatus",
        align: "left",
        render: (h, params) => {
            return h(
                "div", {},
                params.row.warrantyStatus === "1" ?
                "在保" :
                params.row.warrantyStatus === "2" ?
                "保外" :
                ""
            );
        },
        show: true
    },

    {
        title: "报单时间",
        key: "reportDate",
        align: "left",
        width: 150,
        render: (h, params) => {
            var formatTime = moment(params.row.reportDate).format(
                "YYYY-MM-DD hh:mm"
            );
            params.row.formatReportDate = formatTime;
            return h("div", {}, formatTime);
        },
        show: true
    },
    {
        title: "响应时长(h)",
        key: "responseHours",
        align: "left",
        // render: (h, params) => {
        //     const formatTime = (
        //         (params.row.receiveTime - params.row.reportDate) /
        //         3600000
        //     ).toFixed(2);
        //     params.row.ResponseTime = formatTime;
        //     return h("div", {}, formatTime);
        // },
        show: true
    },
    {
        title: "维修用时(h)",
        key: "maintenanceHours",
        // render: (h, params) => {
        //     const formatTime = (
        //         (params.row.createTime - params.row.receiveTime) /
        //         3600000
        //     ).toFixed(2);
        //     params.row.serviceTime = formatTime;
        //     return h("div", {}, formatTime);
        // },
        show: true
    },
    {
        title: "报单人",
        align: "left",
        key: "createName",
        show: true
    },
    {
        title: "工程师",
        align: "left",
        key: "userName",
        show: true
    },
    {
        title: "分类",
        key: "typeName",
        align: "left",
        show: false
    },
    {
        title: "设备序列号",
        key: "assetSN",
        width: 180,
        align: "left",
        show: false
    },

    {
        title: "维修开始时间",
        key: "receiveTime",
        align: "left",
        width: 150,
        render: (h, params) => {
            var formatTime = moment(params.row.receiveTime).format(
                "YYYY-MM-DD hh:mm"
            );
            params.row.formatReceiveTime = formatTime;
            return h("div", {}, formatTime);
        },
        show: false
    },
    {
        title: "维修结束时间",
        width: 150,
        align: "left",
        key: "createTime",
        render: (h, params) => {
            var formatTime = moment(params.row.createTime).format(
                "YYYY-MM-DD hh:mm"
            );
            params.row.formatcreateTime = formatTime;
            return h(
                "div", {},
                moment(params.row.createTime).format(
                    "YYYY-MM-DD hh:mm"
                )
            );
        },
        show: false
    }
]
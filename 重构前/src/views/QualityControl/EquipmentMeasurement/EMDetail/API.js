let EMform = {
    EMform() {
        return {
            //基础信息
            assetName: "", // 设备/资产名称
            alClass: "", // 设备型号
            alOldCode: "", //设备序列号
            alOsId: "", //所属科室(id)
            alBrand: "", // 设备厂家/品牌名称

            //计量信息
            // mrState: 0, //计量区分/设备类型
            mtType: 0, // 计量类型
            mId: "", //检定/计量机构
            executionTime: new Date(), //执行时间
            mrMoney: "", //费用
            mrWorkhours: "", //耗时
            //计量结果
            mrChargeName: "", // 批准/主管人
            mrExecuteName: this.$store.state.user_in.name, // 执行人（即新增人）
            mrCheckName: "", // 校准员
            mrAuditName: "", // 核验员
            mrCode: "", // 证书编号
            mrResult: 0, // 计量结果
            photos: [], //合格证书
            mrNote: null,
            mrType: 0,
            alNumber: 1,
            mtCycle:''
        };
    },
    EMrule: {
        alNumber: [
            { required: true, message: "该项是必填字段" },
            {
                pattern: /^\d*$/,
                message: "该项请填写数字"
            }
        ],
        mtCycle: [
            { required: true, message: "该项是必填字段" },
            {
                pattern: /^\d*$/,
                message: "该项请填写数字"
            }
        ],
        assetName: [{ required: true, message: "该项是必填字段" }],
        alOsId: [
            { required: true, message: "该项是必填字段", trigger: "change" }
        ],
        mrResult: [{ required: true, message: "该项是必选项目" }],
        executionTime: [{ required: true, message: "该项是必选项目" }],
        mId: [{ required: true, message: "该项是必选项目" }],
        mrMoney: [
            {
                required: false,
                type: "string",
                pattern: /^\d*$/,
                message: "该项请填写数字",
                trigger: "blur"
            }
        ],
        mrWorkhours: [
            {
                required: false,
                type: "string",
                pattern: /^\d*$/,
                message: "该项请填写数字",
                trigger: "blur"
            }
        ]
    }
};
export default EMform;

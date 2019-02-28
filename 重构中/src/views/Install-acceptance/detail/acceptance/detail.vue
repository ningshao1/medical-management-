<template>
    <div class="install-detail">

        <div class="detail-form">
            <el-form :model="detailData"
                     ref="form"
                     :rules="formRule">
                <form-structure>
                    <div slot='form-left'>
                        <install-basic-info :basicData.sync='detailData'
                                            ref='basic-info'
                                            :detail='detail'
                                            class="mb-20">
                        </install-basic-info>
                        <asset-bind-contract :disabled='detail'
                                             class="mb-20"
                                             :asset-items.sync='detailData'>
                        </asset-bind-contract>
                        <depreciation-info :asset-items.sync='detailData'
                                           :disabled='detail'
                                           class="mb-20">
                        </depreciation-info>
                        <mesurement-info v-if="measureShow"
                                         :asset-items.sync='detailData'
                                         :disabled='detail'></mesurement-info>
                    </div>
                    <div slot='form-right'>
                        <asset-info :data='detailData'
                                    :disabled='detail'></asset-info>
                    </div>

                </form-structure>
            </el-form>

        </div>

    </div>
</template>

<script>
import { KldCard } from "@/components";
import structure from "@c/form-structure";
import basic from "./components/basic-info";
import contract from "@/views/asset-catalog/asset-add-modify/asset-bind-contract/index";
import depreciationInfo from "@/views/asset-catalog/asset-add-modify/depreciation-info";
import assetInfo from "./components/asset-info";
import dayjs from "dayjs";
import { urlToFile, uploadImg } from "@u";
const measureInfo = () =>
    import("@/views/asset-catalog/asset-add-modify/measurement-info");
import { confirm } from "@el";
export default {
    name: "addAcceptance",
    data() {
        return {
            detail: false,
            measureShow: false,
            quickID: null, //直接选择资产下一步的ID
            loading: false,
            detailData: {
                hosId: this.$store.state.userInfo.osId,
                assetName: "",
                assetClass: "",
                assetSN: "",
                registration: "", //设备注册证号
                assetBrandId: "",
                brandName: "",
                assertTypeId: "", //国家分类ID
                breatheType: 1, //呼吸机类别
                collarTime: "", //安装时间
                departmentId: "", //所属科室
                installSection: "", //安装地点id
                userId: "",
                userName: "",
                responsibleId: "", //责任人ID
                responsibleName: "",
                contractId: "", //合同id
                contractName: "",
                purchaseMount: "0", //原值
                assetWarrntyDate: "", //过保日期
                depreciationType: 0, //折旧类型
                depreciationAgeLimit: 5, //折旧年限
                speedDepreciationRate: "", //加速折旧系数
                mtType: null,
                lastTime: null, //上次计量时间
                cycle: null, //计量周期
                id: undefined,
                labelIds: [],
                photos: []
            },

            formRule: {
                assetName: [
                    {
                        required: true,
                        message: "资产名称为必填项",
                        trigger: ""
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5\w\!@#$%^&?*()_\.-]*$/,
                        message: "请勿使用中文标点符号！",
                        trigger: "blur"
                    },
                    { max: 100, message: "最多100个字符！" }
                ],
                assetSN: [
                    {
                        required: true,
                        message: "序列号为必填项",
                        trigger: ""
                    }
                ],

                assetBrandId: {
                    required: true,
                    message: "品牌为必选项"
                },
                // hospitalId: {
                //     required: true,
                //     message: "院内分类为必选项"
                // },
                assertTypeId: {
                    required: true,
                    message: "国家分类为必选项"
                },
                departmentId: {
                    required: true,
                    message: "安装科室为必选项"
                },
                collarTime: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error("该项为必填项"));
                            return;
                        }
                        if (!this.detailData.assetWarrntyDate) {
                            callback();
                            return;
                        }
                        if (
                            dayjs(value).isBefore(
                                dayjs(this.detailData.assetWarrntyDate)
                            )
                        ) {
                            callback();
                        } else {
                            callback(new Error("安装时间需要小于过保时间"));
                        }
                    }
                },
                userId: {
                    required: true,
                    message: "使用人为必选项"
                },
                responsibleId: {
                    required: true,
                    message: "责任人为必选项"
                },
                assetWarrntyDate: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error("该项为必填项"));
                            return;
                        }
                        if (!this.detailData.collarTime) {
                            callback();
                            return;
                        }
                        if (
                            dayjs(this.detailData.collarTime).isBefore(
                                dayjs(value)
                            )
                        ) {
                            callback();
                        } else {
                            callback(new Error("过保时间需要大于安装时间"));
                        }
                    }
                },
                purchaseMount: [
                    {
                        trigger: "",
                        required: true,
                        validator(rule, value, callback) {
                            if (value !== "") {
                                if (/^[0-9]+$/.test(value)) {
                                    callback();
                                } else {
                                    callback(new Error("该项只能输入数字"));
                                }
                            } else {
                                callback(new Error("该项为必填字段"));
                            }
                        }
                    }
                ],
                cycle: [
                    { required: true },
                    {
                        trigger: "",
                        validator(rule, value, callback) {
                            if (value !== "" && value !== null) {
                                if (/^\+?[1-9]\d*$/.test(value)) {
                                    callback();
                                } else {
                                    callback(
                                        new Error("该项只能输入大于0的整数")
                                    );
                                }
                            } else {
                                callback();
                            }
                        }
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.detailData.mtType === 0) {
                                if (value === null || value === "") {
                                    callback(new Error("该项为必填项！"));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                speedDepreciationRate: [
                    {
                        trigger: "",
                        validator(rule, value, callback) {
                            if (value !== "") {
                                if (/^[0-9]+$/.test(value)) {
                                    callback();
                                } else {
                                    callback(new Error("该项只能输入数字"));
                                }
                            } else {
                                callback();
                            }
                        }
                    }
                ],

                lastTime: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (this.detailData.mtType === 0) {
                                if (!value) {
                                    callback(new Error("该项为必填项！"));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            }
        };
    },
    watch: {
        "detailData.mtType"(val) {
            this.measureShow = val !== null;
        },
        "detailData.collarTime"(val) {
            if (!this.detailData.assetWarrntyDate) {
                this.detailData.assetWarrntyDate = dayjs(val)
                    .add(1, "year")
                    .format("YYYY-MM-DD");
            }
        }
    },
    computed: {},
    components: {
        [KldCard.name]: KldCard,
        [structure.name]: structure,
        [basic.name]: basic,
        [contract.name]: contract,
        [depreciationInfo.name]: depreciationInfo,
        [assetInfo.name]: assetInfo,
        mesurementInfo: measureInfo
    },
    mounted() {
        this.$refs["basic-info"].$on("rowClick", ({ labels, assetId }) => {
            setTimeout(() => {
                this.$refs["form"].clearValidate();
            });
            this.detail = true;
            const photo = this.detailData.photos.map(v => v.photoUrl);
            this.detailData.labelIds = labels.map(v => v.labelId); //标签回显
            if (photo) {
                urlToFile(photo).then(data => {
                    this.detailData.photos = data; //图片回显
                });
            }
            this.quickID = assetId;
        });
    },
    methods: {
        async next(callback) {
            if (this.detail) {
                confirm({
                    title: "提示",
                    content: "确认提交？",
                    okText: "确定",
                    cancelText: "取消",
                    ok: async () => {
                        await this.quickSave();
                        callback && callback();
                        return;
                    }
                });
            } else {
                this.$refs["form"].validate(async data => {
                    if (!data) return;
                    confirm({
                        title: "提示",
                        content: "确认提交？",
                        okText: "确定",
                        cancelText: "取消",
                        ok: async () => {
                            await this.save();
                            callback && callback();
                        }
                    });
                });
            }
        },
        quickSave() {
            return this.$axios
                .post(`assetacceptance/save?type=2`, {
                    id: this.quickID
                })
                .then(({ data }) => {
                    //传出科室名称和安装时间
                    console.log(
                        this.$refs["basic-info"].$refs["osTree"].currentLabel
                    );
                    this.$emit(
                        "getInfo",
                        data,
                        this.$refs["basic-info"].$refs["osTree"].currentLabel,
                        this.detailData.collarTime
                    );
                })
                .finally(v => {
                    this.loading = false;
                });
        },
        async save() {
            const query = this.correction(this.detailData);
            const photos = await uploadImg(query.photos, 7);
            return this.$axios
                .post(`/assetacceptance/save?type=1`, {
                    ...query,
                    photos
                })
                .then(({ data }) => {

                    //传出科室名称和安装时间
                    this.$emit(
                        "getInfo",
                        data,
                        this.$refs["basic-info"].$refs["osTree"].currentLabel,
                        this.detailData.collarTime
                    );
                })
                .finally(v => {
                    this.loading = false;
                });
        },
        correction(query) {
            for (const key in query) {
                switch (key) {
                    case "cycle":
                        query[key] = this.itemQuery(query, key);
                        break;
                    case "lastTime":
                        query[key] = this.itemQuery(query, key);
                        break;
                    case "mtType":
                        query[key] = this.itemQuery(query, key);
                        break;
                }
            }
            return query;
        },
        itemQuery(qyery, key) {
            return !this.isMeasure || query[key] === "" ? null : query[query];
        }
    }
};
</script>

<style scoped lang="scss">
.install-detail {
    padding-bottom: 70px;
}
</style>

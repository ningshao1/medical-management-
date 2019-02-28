<template>
    <div class="asset-add-modify-wrap">
        <el-form
            ref="form"
            :model="assetItems"
            class="asset-add-modify-form"
            :rules="ruleValidate"
        >
            <div class="asset-add-modify-container">
                <!-- 左侧主体 -->
                <div class="main-info-grid">
                    <el-row>
                        <el-col>
                            <base-info
                                :asset-items.sync="assetItems"
                                :origin-asset-items='originAssetItems'
                            ></base-info>
                        </el-col>
                        <el-col>
                            <asset-bind-contract
                                :asset-items.sync="assetItems"
                                :origin-asset-items='originAssetItems'
                            ></asset-bind-contract>
                        </el-col>
                        <el-col>
                            <depreciation-info
                                :asset-items.sync="assetItems"
                                :origin-asset-items='originAssetItems'
                            ></depreciation-info>
                        </el-col>
                        <el-col v-if="isMeasure">
                            <measurement-info
                                :asset-items.sync="assetItems"
                                :origin-asset-items='originAssetItems'
                            ></measurement-info>
                        </el-col>
                    </el-row>
                </div>
                <!-- 右侧附加框 -->
                <div class="additional-info-grid">
                    <additional-info
                        :asset-items.sync="assetItems"
                        :origin-asset-items='originAssetItems'
                    ></additional-info>
                </div>
            </div>
        </el-form>
        <Portal
            class="footer-button"
            to='breadcrumb'
        >
            <template v-if="isAdd">
                <el-button type='default'>返回</el-button>
                <el-button
                    @click="checkAdd"
                    :loading="submiting"
                >确定</el-button>
            </template>
            <template v-else>
                <el-button type='default'>返回</el-button>
                <el-button
                    @click="checkModify"
                    :loading="submiting"
                    :disabled='!originAssetItemsLoaded'
                >确定</el-button>

            </template>

        </Portal>
    </div>
</template>
<script>
import BaseInfo from "./base-info";
import AdditionalInfo from "./additional-info";
import assetBindContract from "./asset-bind-contract";
import depreciationInfo from "./depreciation-info";
import measurementInfo from "./measurement-info";
import { baseMixin } from "./mixin.js";
import { Portal } from "@/plugins/portal-vue.js";
import { uploadImg, urlToFile } from "@/utils/index.js";
export default {
    name: "asset-add-modify",
    components: {
        BaseInfo,
        AdditionalInfo,
        assetBindContract,
        depreciationInfo,
        measurementInfo,
        Portal
    },
    mixins: [baseMixin],
    props: {},
    data() {
        const requiredMessage = "该项为必填项！";
        const requiredErrorMessage = new Error(requiredMessage);

        const assetSNValidator = async (rule, value, callback) => {
            if (value === this.originAssetItems.assetSN) {
                return callback();
            }
            const { data } = await this.$axios.get(
                `/assets/checkSn?snCode=${value}`
            );
            if (data === 0) {
                return callback();
            }
            return callback("该序列号已存在，请更换新的序列号！");
        };
        const collarTimeValidator = (rule, value, callback) => {
            if (
                (!this.isAdd && this.originAssetItems.collarTime && !value) ||
                (this.isAdd && !value)
            ) {
                callback(requiredErrorMessage);
            } else if (
                this.assetItems.collarTime &&
                this.assetItems.assetWarrntyDate &&
                new Date(this.assetItems.collarTime) >
                    new Date(this.assetItems.assetWarrntyDate)
            ) {
                callback(new Error("领用时间应早于过保时间！"));
            } else {
                callback();
            }
        };
        const rightTimeValidator = (rule, value, callback) => {
            if (!value) {
                callback(requiredErrorMessage);
            } else if (
                this.assetItems.collarTime &&
                this.assetItems.assetWarrntyDate &&
                new Date(this.assetItems.collarTime) >
                    new Date(this.assetItems.assetWarrntyDate)
            ) {
                callback(new Error("领用时间应早于过保时间！"));
            } else {
                callback();
            }
        };
        const mtValidator = (rule, value, callback) => {
            // if (!this.checkMTLimit) {//TODO
            //     callback();
            //     return;
            // }
            if (value === null || value === "") {
                if (this.assetItems.mtType === 0) {
                    return callback(requiredErrorMessage);
                }
                if (this.assetItems.lastTime || this.assetItems.cycle) {
                    return callback(requiredErrorMessage);
                }
                if (
                    !this.isAdd &&
                    (this.originAssetItems.lastTime ||
                        this.originAssetItems.cycle)
                ) {
                    return callback(requiredErrorMessage);
                }
            }

            callback();
        };
        const nullValidator = (rule, value, callback) => {
            if (value) {
                return callback();
            }
            return callback(requiredErrorMessage);
        };
        return {
            originAssetItems: {},
            originAssetItemsLoaded: false,
            assetItems: {
                //基本信息
                assetName: "",
                assetBrandId: "",

                brandName: "",
                assertTypeId: null, //国家分类
                assertTypeName: undefined,
                breatheType: 1, //呼吸机分类
                collarTime: null,
                departmentId: null,
                osName: "",
                installSection: null,
                userId: "",
                userName: "",
                responsibleId: "",
                responsibleName: "",
                assetSN: "",
                oldAssetCode: "",
                assetClass: "",
                used: 1,
                registration: "",
                //合同关联
                contractId: "",
                contractName: "",
                purchaseMount: "0",
                assetWarrntyDate: "",
                //折旧信息
                depreciationType: 0,
                depreciationAgeLimit: 5,
                speedDepreciationRate: "",
                //计量信息
                lastTime: null,
                cycle: null,
                mtType: null,
                //设备信息
                labelIds: [],
                assetLabelType: 2,
                //非输入框信息
                lifeType: 0,
                photos: []
            },
            ignoreItems: {
                add: {
                    assertTypeName: undefined,
                    brandName: undefined,
                    contractName: undefined,
                    osName: undefined
                },
                modify: {
                    contractName: undefined
                }
            },
            submiting: false,
            ruleValidate: {
                assetName: [
                    { required: true, message: requiredMessage },
                    {
                        pattern: /^[\u4e00-\u9fa5\w()-]*$/,
                        message:
                            "设备名称仅支持中英文、数字、下划线、英文括号和短横线!",
                        trigger: "blur"
                    },
                    { max: 100, message: "最多100个字符！" }
                ],
                assetBrandId: {
                    required: true,
                    message: requiredMessage,
                    trigger: "change"
                },
                assertTypeId: {
                    required: true,
                    validator: nullValidator,
                    trigger: "change"
                },
                assetSN: [
                    {
                        required: true,
                        message: requiredMessage,
                        trigger: "change"
                    },
                    { validator: assetSNValidator, trigger: "change" }
                ],
                collarTime: {
                    required: true,
                    validator: collarTimeValidator,
                    trigger: "change"
                },
                departmentId: {
                    required: true,
                    validator: nullValidator,
                    trigger: "change"
                },
                userId: {
                    required: true,
                    message: "此科室暂未设置管理人，请联系管理员添加！"
                },
                responsibleId: {
                    required: true,
                    message: "此科室暂未设置负责人，请联系管理员添加！"
                },
                purchaseMount: { required: true, message: requiredMessage },
                assetWarrntyDate: {
                    required: true,
                    validator: rightTimeValidator,
                    trigger: "change"
                },
                depreciationType: { required: true, message: requiredMessage },
                depreciationAgeLimit: {
                    required: true,
                    message: requiredMessage
                },
                lastTime: { validator: mtValidator, trigger: "change" },
                cycle: { validator: mtValidator, trigger: "change" },
                mtType: { validator: mtValidator, trigger: "change" },
                used: { required: true, message: requiredMessage }
            }
        };
    },
    computed: {
        isMeasure() {
            return this.assetItems.mtType !== null;
        },
        checkMTLimit() {
            return this.isAdd
                ? this.checkLimit("ass:measurement:add")
                : this.checkLimit("ass:measurement:edit");
        }
    },
    watch: {
        isMeasure: {
            handler(val) {
                if (!val) {
                    this.assetItems.lastTime = "";
                    this.assetItems.cycle = null;
                }
            },
            immediate: true
        }
    },
    created() {},
    mounted() {
        if (!this.isAdd) {
            this.remoteAssetDetails();
        }
    },
    methods: {
        checkModify() {
            this.formValidate(this.modify);
        },
        async modify() {
            this.submiting = true;
            try {
                const photos = await uploadImg(this.assetItems.photos, 7);
                const url = `/assets/${this.osId}`;
                const requestBody = {
                    ...this.assetItems,
                    id: this.assetId,
                    photos,
                    purchaseMountFlag:
                        +this.assetItems.purchaseMount !==
                        +this.originAssetItems.purchaseMount
                            ? "true"
                            : "false",
                    collarTimeFlag:
                        (this.assetItems.collarTime !==
                            this.originAssetItems.collarTime) +
                        "",
                    cycle: this.checkMTLimit
                        ? +this.assetItems.cycle || null
                        : undefined,
                    lastTime: this.checkMTLimit
                        ? this.assetItems.lastTime || null
                        : undefined,
                    mtType: this.checkMTLimit
                        ? this.assetItems.mtType
                        : undefined,
                    ...this.ignoreItems.modify
                };

                await this.$axios.put(url, requestBody);
                this.$message.success("编辑资产成功！");
                this.submiting = false;
                this.$router.go(-1);
            } finally {
                this.submiting = false;
            }
        },

        checkAdd() {
            this.formValidate(this.add);
        },
        //请求资产信息
        async remoteAssetDetails() {
            const { data } = await this.$axios.get(
                `/assets/${this.osId}/${this.assetId}`
            );

            this.originAssetItems = JSON.parse(JSON.stringify(data));
            this.originAssetItemsLoaded = true;
            this.assetItems = await this.assetDetailsFormat(
                data,
                this.assetItems
            );
        },
        async assetDetailsFormat(data, assetItems) {
            let cache = JSON.parse(JSON.stringify(data)),
                result = {};
            for (let i in assetItems) {
                result[i] = cache[i];
            }
            result.labelIds = (cache.labels || []).map(
                ({ labelId }) => labelId
            );
            result.photos = [];

            (async () => {
                try {
                    result.photos = await urlToFile(
                        (cache.photos || []).map(({ photoUrl }) => photoUrl)
                    );
                } catch (e) {
                    console.error(e);
                }
            })();

            return result;
        },

        async add() {
            this.submiting = true;
            try {
                const photos = await uploadImg(this.assetItems.photos, 7);
                const url = `/assets/${this.osId}`;
                const requestBody = {
                    id: this.assetIdBySN || undefined,
                    hosId: this.userInfo.osId,
                    ...this.assetItems,
                    photos,
                    speedDepreciationRate:
                        this.assetItems.speedDepreciationRate || "0",
                    cycle: this.checkMTLimit
                        ? +this.assetItems.cycle || null
                        : undefined,
                    lastTime: this.checkMTLimit
                        ? this.assetItems.lastTime || null
                        : undefined,
                    mtType: this.checkMTLimit
                        ? this.assetItems.mtType
                        : undefined,
                    ...this.ignoreItems.add
                };

                await this.$axios.post(url, requestBody);
                this.$message.success("新增资产成功！");
                this.submiting = false;
                this.$router.go(-1);
            } finally {
                this.submiting = false;
            }
        },
        formValidate(success, error, formName = "form") {
            error =
                error ||
                (() => {
                    this.$message.error("请修改错误内容后提交！");
                });
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    error();
                    return;
                }
                success();
            });
        },
        propValidate(prop, formName = "form") {
            this.$refs[formName].validateField(prop);
        },
        resetForm(formName = "form") {
            this.$refs[formName].resetFields();
        }
    }
};
</script>
<style lang="less" scoped>
.asset-add-modify-wrap {
    width: 100%;
    > .asset-add-modify-form {
        width: 100%;
        .asset-add-modify-container {
            width: 100%;

            display: flex;
            .main-info-grid {
                flex: 1;
                padding-right: 20px;
                > .el-row {
                    > .el-col {
                        margin-bottom: 10px;
                    }
                }
            }
            .additional-info-grid {
                width: 380px;
                flex-shrink: 0;
            }
        }
    }
}
</style>
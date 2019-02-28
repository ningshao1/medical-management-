<template>
    <div class="base-info-wrap">
        <kld-card
            title="基本信息"
            no-head-icon
        >
            <div class="full-width">
                <el-row :gutter="20">
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="设备名称"
                            prop="assetName"
                        >
                            <float-table
                                v-model="cardItems.assetName"
                                placeholder='请输入设备名称'
                                :columns="assetName.columns"
                                :remote-method="assetNameAutocomplete"
                                :value-key="assetName.valueKey"
                                @select="getPreInfo"
                            ></float-table>

                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="型号"
                            prop="assetClass"
                        >
                            <float-table
                                v-model="cardItems.assetClass"
                                placeholder='请填写设备型号'
                                :columns="assetClass.columns"
                                :remote-method="assetClassAutocomplete"
                                :value-key="assetClass.valueKey"
                                @select="getPreInfo"
                            ></float-table>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >

                        <el-form-item
                            label="序列号"
                            prop="assetSN"
                        >
                            <asset-sn
                                v-model="cardItems.assetSN"
                                placeholder='请填写设备序列号'
                            ></asset-sn>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="设备注册证号"
                            prop="registration"
                        >
                            <el-input
                                placeholder='请填写设备型号'
                                v-model="cardItems.registration"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-row :gutter="20">
                            <el-col :span="viewBreatheType?12:24">
                                <el-form-item
                                    label="设备分类"
                                    prop="assertTypeId"
                                >
                                    <!-- <el-cascader
                                
                                >

                                </el-cascader> -->
                                    <tree-select
                                        v-model="cardItems.assertTypeId"
                                        :data='country.list'
                                        leaf-only
                                        code-prefix
                                        placeholder='请选择设备分类'
                                        @current-change="assertTypeChange"
                                    ></tree-select>
                                </el-form-item>
                            </el-col>
                            <el-col
                                v-if="viewBreatheType"
                                :span="12"
                            >
                                <el-form-item
                                    label="呼吸机分类"
                                    prop="breatheType"
                                >
                                    <el-radio-group
                                        class="full-width inline-block"
                                        v-model="cardItems.breatheType"
                                    >
                                        <el-radio :label='2'>无创</el-radio>
                                        <el-radio :label="3">有创</el-radio>
                                        <el-radio :label="4">混合型</el-radio>
                                    </el-radio-group>

                                </el-form-item>

                            </el-col>
                        </el-row>
                    </el-col>

                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="品牌"
                            prop="assetBrandId"
                        >
                            <float-table
                                :selected-item.sync="selectedItem"
                                v-model="assetBrand.brandName"
                                placeholder='请选择品牌'
                                remote-no-keyword
                                :columns="assetBrand.columns"
                                :remote-method="brandNameAutocomplete"
                                :value-key="assetBrand.valueKey"
                                :node-key="assetBrand.nodeKey"
                                ref="asset-brand"
                            ></float-table>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="领用时间"
                            prop="collarTime"
                        >
                            <el-date-picker
                                :editable='false'
                                clearable
                                :disabled="collarTimeDisabled"
                                value-format="yyyy-MM-dd"
                                v-model="cardItems.collarTime"
                                placeholder='请选择领用时间'
                                @change='collarTimeChange'
                            ></el-date-picker>

                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="现有编码"
                            prop="oldAssetCode"
                        >
                            <el-input
                                v-model="cardItems.oldAssetCode"
                                placeholder='请填写设备现有编码'
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="资产标签"
                            prop="assetLabelType"
                        >
                            <el-select
                                v-model="cardItems.assetLabelType"
                                placeholder="请选择资产标签"
                            >
                                <el-option
                                    :value="1"
                                    label='已贴'
                                >
                                </el-option>
                                <el-option
                                    :value="2"
                                    label="未贴"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="所属科室"
                            prop="departmentId"
                        >
                            <tree-select
                                v-model="cardItems.departmentId"
                                :data='departmentTree'
                                placeholder='请选择所属科室'
                                :props='{label:"osName"}'
                                first-expand
                                :ban-select='[osId]'
                                @current-change="departmentChange"
                            ></tree-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="安装地点"
                            prop="installSection"
                        >
                            <tree-select
                                v-model="cardItems.installSection"
                                :data='departmentTree'
                                placeholder='请选择安装地点'
                                :props='{label:"osName"}'
                                first-expand
                                :ban-select='[osId]'
                            ></tree-select>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="管理人"
                            prop="userId"
                        >
                            <el-input
                                v-model="cardItems.userName"
                                :disabled="true"
                                placeholder='选择所属科室自动填充'
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col
                        :span="12"
                        :lg="6"
                    >
                        <el-form-item
                            label="责任人"
                            prop="responsibleId"
                        >
                            <el-input
                                v-model="cardItems.responsibleName"
                                :disabled="true"
                                placeholder='选择所属科室自动填充'
                            ></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </div>

        </kld-card>

    </div>
</template>
<script>
import mixin from "../mixin.js";
import { TreeSelect } from "@c";
import FloatTable from "../components/float-table.vue";
import AssetSn from "../components/AssetSn.vue";
export default {
    name: "base-info",
    mixins: [mixin],
    components: { TreeSelect, FloatTable, AssetSn },
    props: {},
    data() {
        return {
            assetName: {
                columns: [
                    {
                        key: "assetName",
                        title: "名称"
                    },
                    {
                        key: "assetClass",
                        title: "型号"
                    },
                    {
                        key: "brandName",
                        title: "品牌"
                    }
                ],
                valueKey: "assetName"
            },
            assetClass: {
                columns: [
                    {
                        key: "assetName",
                        title: "名称"
                    },
                    {
                        key: "assetClass",
                        title: "型号"
                    },
                    {
                        key: "brandName",
                        title: "品牌"
                    }
                ],
                valueKey: "assetClass"
            },
            assetBrand: {
                brandName: "",
                columns: [
                    {
                        key: "brandName",
                        title: "名称"
                    },
                    {
                        key: "manufactor",
                        title: "厂商"
                    },
                    {
                        key: "modeCountry",
                        title: "国别"
                    }
                ],
                valueKey: "brandName",
                nodeKey: "brandId"
            },

            country: {
                list: []
            },

            departmentTree: []
        };
    },
    computed: {
        viewBreatheType() {
            return (
                this.cardItems.breatheType !== 1 &&
                this.cardItems.breatheType !== 0
            );
        },
        collarTimeDisabled() {
            return (
                !this.isAdd &&
                !!(
                    this.originAssetItems.collarTime &&
                    this.originAssetItems.purchaseMount != "0"
                )
            );
        },
        selectedItem: {
            get() {
                const { valueKey, nodeKey } = this.assetBrand;
                return {
                    [valueKey]: this.cardItems.brandName,
                    [nodeKey]: this.cardItems.assetBrandId
                };
            },
            set(val) {
                const { valueKey, nodeKey } = this.assetBrand;
                let { [valueKey]: brandName, [nodeKey]: assetBrandId } = val;
                this.cardItems.assetBrandId = assetBrandId;
                this.cardItems.brandName = brandName;
            }
        }
        // cardItems: {
        //     get() {
        //         return this.assetItems;
        //     },
        //     set(val) {
        //         this.$emit("update:assetItems", val);
        //     }
        // },
    },
    created() {
        this.loadCountryType();
        this.loadDepartmentTree();
    },
    methods: {
        async loadCountryType() {
            this.country.list = await this.$store.dispatch(
                "loadCountryType",
                true
            );
        },
        async loadDepartmentTree() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.departmentTree = [data];
        },

        async assetNameAutocomplete(
            keyword,
            { pageSize, currentPage, total },
            callback
        ) {
            const request = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                params: {
                    name: keyword
                }
            };
            let back = null;
            try {
                const { data } = await this.$axios.post(
                    `assets/getOtherByAssetName`,
                    request
                );
                back = data;
            } finally {
                callback(back);
            }
        },
        async getPreInfo(item) {
            const { assetName, assetClass, assetId, id } = item;
            const remoteId = assetId || id;
            this.cardItems.assetName = assetName;
            this.cardItems.assetClass = assetClass;
            const { data } = await this.$axios.post(
                `/assets/getOtherByAssetId?id=${remoteId}`
            );
            this.preInfoFormat(data);
        },
        preInfoFormat(preData) {
            preData = preData || {};
            const {
                brandName,
                assetBrandId,
                depreciationAgeLimit,
                registration,
                assertTypeId,
                hosId,
                breathe_type
            } = preData;
            //设备品牌
            if (brandName && assetBrandId) {
                const { valueKey, nodeKey } = this.assetBrand;
                this.selectedItem = {
                    [valueKey]: brandName,
                    [nodeKey]: assetBrandId
                };
                // this.$refs["asset-brand"].setKeyNode(assetBrandId, brandName);
            }
            //设备型号
            if (depreciationAgeLimit) {
                this.cardItems.depreciationAgeLimit = depreciationAgeLimit;
            }
            //折旧年限
            if (registration) {
                this.cardItems.registration = registration;
            }
            //设备注册证号
            if (assertTypeId) {
                this.cardItems.assertTypeId = assertTypeId;
            }
            //选择呼吸机类型todo
            if (breathe_type) {
                this.$nextTick(() => {
                    if (this.cardItems.assertTypeId) {
                        this.cardItems.breatheType = breathe_type;
                    }
                });
            }

            //若不是该医院
            if (hosId !== this.osId) {
                return;
            }
            //标签todo
        },
        async assetClassAutocomplete(
            keyword,
            { pageSize, currentPage, total },
            callback
        ) {
            const request = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                params: {
                    assetClass: keyword
                }
            };
            let back = null;
            try {
                const { data } = await this.$axios.post(
                    `assets/getAssetClass`,
                    request
                );
                back = data;
            } finally {
                callback(back);
            }
        },
        async brandNameAutocomplete(
            keyword,
            { pageSize, currentPage, total },
            callback
        ) {
            const request = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                params: {
                    keyword
                }
            };
            let back = null;
            try {
                const { data } = await this.$axios.post(
                    `assertBrandcopys/${this.osId}/list`,
                    request
                );
                back = data;
            } finally {
                callback(back);
            }
        },
        assertTypeChange(data, node) {
            if (!node) {
                return;
            }

            //判断是否生命支持类
            const lifeType = Number(
                data.state === 3 || data.state === 2 || data.state === 1
            );
            //当切换 入/出 生命支持类时重置；
            if (this.cardItems.lifeType !== lifeType) {
                //TODO
                this.cardItems.used = 1;
            }
            this.cardItems.lifeType = lifeType;
            //获得分类基础信息
            this.cardItems.assertTypeId = node.key;
            this.cardItems.assertTypeName = data.typeName;

            //是否设置呼吸机类型
            let breatheType = this.cardItems.breatheType;
            this.cardItems.breatheType =
                data.state === 2 ? (breatheType >= 2 ? breatheType : 2) : 1;
            this.$nextTick(() => {
                this.cardItems.mtType = data.type;
            });
        },
        //修改领用时间
        collarTimeChange(collarTime) {
            if (
                !collarTime
                // ||this.cardItems.assetWarrntyDate
            ) {
                return;
            }

            this.cardItems.assetWarrntyDate = this.dayjs(collarTime)
                .add(1, "year")
                .format("YYYY-MM-DD");
        },
        departmentChange(data, node) {
            node = node || {};
            const { key, label } = node;
            this.cardItems.osName = label;
            this.cardItems.installSection = key;
            this.getOrgstructResponsible(key);
        },
        async getOrgstructResponsible(key) {
            const { data: info } = key
                ? await this.$axios.get(
                      `orgstruct/${key}/getOrgstructResponsible`
                  )
                : {};
            const personInfo = info || {};
            const { responsible, responsibleName, user, userName } = personInfo;
            this.cardItems.userId = user;
            this.cardItems.userName = userName;
            this.cardItems.responsibleId = responsible;
            this.cardItems.responsibleName = responsibleName;
        }
    }
};
</script>
<style lang="scss" scoped>
.base-info-wrap {
}
</style>
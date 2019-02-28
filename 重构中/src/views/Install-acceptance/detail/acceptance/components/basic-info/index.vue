<template>
    <div class="basic-info">
        <kld-card title="基础信息">
            <div slot='head-icon'></div>
            <el-row :gutter='20'>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="设备名称"
                                  prop='assetName'>
                        <div class="asset-name">
                            <div class="exist-asset">
                                资产已入库？ <a href="javascript:;"
                                   @click="show=true;">点击选择已有设备</a>
                            </div>
                            <float-table v-model="data.assetName"
                                         placeholder='请输入设备名称'
                                         :remote-method='getAssetData'
                                         :columns="assetName.columns"
                                         :value-key="assetName.valueKey"
                                         :disabled='detail'
                                         @select="getPreInfo">
                            </float-table>
                        </div>
                        <!-- <el-input placeholder="请输入名称"></el-input> -->
                    </el-form-item>

                </el-col>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="型号"
                                  prop='assetClass'>
                        <float-table v-model="data.assetClass"
                                     placeholder='请填写设备型号'
                                     :columns="assetClass.columns"
                                     :remote-method="getClassData"
                                     :value-key="assetClass.valueKey"
                                     :disabled='detail'
                                     @select="getPreInfo"></float-table>
                    </el-form-item>

                </el-col>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="序列号"
                                  prop='assetSN'>
                        <asset-sn v-model="data.assetSN"
                                  placeholder='请填写设备序列号'
                                  :disabled='detail'></asset-sn>
                    </el-form-item>

                </el-col>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="设备注册证号"
                                  prop='registration'>
                        <el-input placeholder="请输入设备注册证号"
                                  v-model="data.registration"
                                  :disabled='detail'>
                        </el-input>
                    </el-form-item>

                </el-col>
                <el-col :span='24'>
                    <el-row :gutter="20">
                        <el-col :span='spanLong'>
                            <el-form-item label="国家分类"
                                          prop='assertTypeId'>
                                <tree-select v-model="data.assertTypeId"
                                             :data='country.list'
                                             leaf-only
                                             code-prefix
                                             placeholder='请选择国家分类'
                                             :disabled='detail'
                                             @current-change='getCountryNode'>
                                </tree-select>
                            </el-form-item>

                        </el-col>
                        <template v-if="spanLong===12">
                            <el-col :span='12'>
                                <el-form-item label="呼吸机分类"
                                              prop='breatheType'>
                                    <div>
                                        <el-radio-group class="full-width inline-block"
                                                        v-model="data.breatheType">
                                            <el-radio :label='2'
                                                      :disabled='detail'>无创</el-radio>
                                            <el-radio :label="3"
                                                      :disabled='detail'>有创</el-radio>
                                            <el-radio :label="4"
                                                      :disabled='detail'>混合型</el-radio>
                                        </el-radio-group>
                                    </div>
                                </el-form-item>

                            </el-col>
                        </template>
                    </el-row>
                </el-col>

                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="品牌"
                                  prop='assetBrandId'>
                        <float-table :selected-item.sync="selectedItem"
                                     v-model="assetBrand.brandName"
                                     placeholder='请选择品牌'
                                     remote-no-keyword
                                     mode="select"
                                     :columns="assetBrand.columns"
                                     :remote-method="getBrandData"
                                     :value-key="assetBrand.valueKey"
                                     :node-key="assetBrand.nodeKey"
                                     :disabled='detail'
                                     ref="asset-brand"></float-table>
                    </el-form-item>

                </el-col>

                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="安装时间"
                                  prop='collarTime'>
                        <el-date-picker :editable='false'
                                        clearable
                                        value-format="yyyy-MM-dd"
                                        v-model="data.collarTime"
                                        placeholder='请选择安装时间'
                                        :disabled='detail'></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="所属科室"
                                  prop='departmentId'>
                        <tree-select v-model="data.departmentId"
                                     :data='departmentTree'
                                     placeholder='请选择所属科室'
                                     :props='{label:"osName"}'
                                     first-expand
                                     :ban-select='[osId]'
                                     @current-change="departmentChange"
                                     :disabled='detail'
                                     ref='osTree'></tree-select>
                    </el-form-item>
                </el-col>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="安装地点"
                                  prop='installSection'>
                        <tree-select v-model="data.installSection"
                                     :data='departmentTree'
                                     placeholder='请选择安装地点'
                                     :props='{label:"osName"}'
                                     first-expand
                                     :ban-select='[osId]'
                                     :disabled='detail'></tree-select>
                    </el-form-item>

                </el-col>

                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="管理人">
                        <el-input v-model="data.userName"
                                  placeholder='选择所属科室自动填充'
                                  disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'
                        :lg='6'>
                    <el-form-item label="负责人">
                        <el-input v-model="data.responsibleName"
                                  placeholder='选择所属科室自动填充'
                                  disabled>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </kld-card>
        <exist-dialog :visible.sync='show'
                      @row-click='rowClick'>
        </exist-dialog>
    </div>
</template>

<script>
import { TreeSelect } from "@c";
import floatTable from "@/views/asset-catalog/asset-add-modify/components/float-table.vue";
import AssetSn from "@/views/asset-catalog/asset-add-modify/components/AssetSn.vue";
import mixin from "../mixin.js";
const existDialog = () => import("../exist-dialog");
export default {
    mixins: [mixin],
    name: "installBasicInfo",
    props: {
        basicData: {
            type: Object,
            default() {
                return {};
            }
        },
        detail: {
            type: Boolean
        }
    },
    data() {
        return {
            show: false,
            spanLong: 24, //控制呼吸机显示长度
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
                        key: "assetClass",
                        title: "型号"
                    },
                    {
                        key: "assetName",
                        title: "名称"
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
                        title: "品牌名称"
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
                list: [],
                isLive: false
            },
            departmentTree: []
        };
    },
    components: {
        [floatTable.name]: floatTable,
        [AssetSn.name]: AssetSn,
        [TreeSelect.name]: TreeSelect,
        existDialog
    },
    computed: {
        data: {
            get() {
                return this.basicData;
            },
            set(val) {
                this.$emit("update:basicData", val);
            }
        },
        selectedItem:{
             get(){
                const {valueKey,nodeKey}=this.assetBrand;
                return {
                    [valueKey]:this.data.brandName,
                    [nodeKey]:this.data.assetBrandId
                }
            },
            set(val){
                const {valueKey,nodeKey}=this.assetBrand;
                let {[valueKey]:brandName,[nodeKey]:assetBrandId}=val;
                this.data.assetBrandId=assetBrandId;
                this.data.brandName=brandName;
            }
        }
    },
    created() {
        this.loadCountryType();
        this.loadDepartmentTree();
    },
    methods: {
        async getAssetData(
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
            this.data.assetName = assetName;
            this.data.assetClass = assetClass;
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
                const {valueKey,nodeKey}=this.assetBrand;
                this.selectedItem={
                    [valueKey]:brandName,
                    [nodeKey]:assetBrandId
                }
                // this.$refs["asset-brand"].setKeyNode(assetBrandId, brandName);
            }
            //设备型号
            if (depreciationAgeLimit) {
                this.data.depreciationAgeLimit = depreciationAgeLimit;
            }
            //设备注册证号
            if (registration) {
                this.data.registration = registration;
            }
            //
            if (assertTypeId) {
                this.data.assertTypeId = assertTypeId;
            }
            //选择呼吸机类型todo
            if (breathe_type) {
                this.$nextTick(() => {
                    if (this.data.assertTypeId) {
                        this.data.breatheType = breathe_type;
                    }
                });
            }
        },
        async getClassData(
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
        async getBrandData(
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
        async loadCountryType() {
            this.country.list = await this.$store.dispatch(
                "loadCountryType",
                true
            );
        },
        getCountryNode(node) {
            if (!node) return;
            if (node.state === 2) {
                //是否为呼吸机
                this.spanLong = 12;
                this.data.breatheType = 2;
            } else {
                this.spanLong = 24;
                this.data.breatheType = 1;
            }
            this.data.mtType = node.type;
            if (node.type === null) {
                this.data.lastTime = null;
                this.data.cycle = null;
            }
        },
        async loadDepartmentTree() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.departmentTree = [data];
        },
        async departmentChange(node) {
            if (node) {
                const {
                    data: { userName, user, responsibleName, responsible }
                } = await this.$axios.get(
                    `orgstruct/${node.id}/getOrgstructResponsible`
                );
                this.data.userName = userName;
                this.data.responsibleName = responsibleName;
                this.data.userId = user;
                this.data.responsibleId = responsible;
            }
        },
        async rowClick({ id }) {
            const { data } = await this.$axios.get(
                `assets/getAssetAcceptance/${id}`
            );

            for (const key in data) {
                this.data[key] = data[key];
                if (key === "assetTypeId") {
                    this.data["assertTypeId"] = data[key];
                }
            }
            const {valueKey,nodeKey}=this.assetBrand;
                this.selectedItem={
                    [valueKey]:data["brandName"],
                    [nodeKey]:"11"
                }
            // this.$refs["asset-brand"].setKeyNode("11", data["brandName"]);
            this.show = false;
            this.$emit("rowClick", data);
        }
    }
};
</script>

<style scoped lang="less">
.asset-name {
    position: relative;
    .exist-asset {
        position: absolute;
        right: 0;
        z-index: 1;
    }
}
</style>

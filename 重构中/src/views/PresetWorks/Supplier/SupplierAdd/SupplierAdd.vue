<template>
    <div class="supplier-add" v-load="loading">
        <el-form :model="formData" :rules="rules" label-position="top" label-width="100px" :validate-on-rule-change="false" ref="form">
            <kld-card
                    title="基础信息"
                    no-head-icon
            >
                <el-row :gutter="20">
                    <el-col :xs="12" :span="8">
                        <el-form-item prop="type" label="供应商分类">
                            <el-select v-model="formData.type" placeholder="请选择供应商分类">
                                <el-option
                                        v-for="(label, index) in supplierTypes"
                                        :label="label"
                                        :value="index"
                                        :key="index"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :span="8">
                        <el-form-item prop="supplierName" label="供应商名称">
                            <el-input v-model="formData.supplierName" placeholder="请输入供应商名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :span="8">
                        <el-form-item prop="supplierContactName" label="联系人">
                            <el-input v-model="formData.supplierContactName" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :span="8">
                        <el-form-item prop="supplierPhone" label="联系方式">
                            <kld-input-number v-model="supplierPhone" :precision="0" placeholder="请输入联系方式"></kld-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :span="8">
                        <el-form-item prop="provinceid" label="供应商地址">
                            <select-area v-model="supplierArea" placeholder="请选择地区"></select-area>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :span="8">
                        <el-form-item prop="addressDetail">
                            <template slot="label">&nbsp;</template>
                            <el-input v-model="formData.addressDetail" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item prop="labelIds">
                            <template slot="label">
                                供应商标签
                                <span class="text-secondary">（每个供应商最多添加5个标签）</span>
                            </template>
                            <select-supplier-tag v-model="formData.labelIds"></select-supplier-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
            </kld-card>
            <kld-card
                    title="相关资质信息"
                    no-head-icon
            >
                <kld-form-item prop="businessPhotos" label-width="100%">
                    <template slot="label" slot-scope="{Asterisk}">
                        营业执照
                        <component :is="Asterisk"></component>
                        <span class="text-secondary">（支持上传最多5张图片或单个图片最大3M）</span>
                    </template>
                    <file-upload
                            ref="business-upload"
                            :images.sync="formData.businessPhotos"
                            :action-image="`/photo/${hospitalId}/3/upload`"
                            v-bind="uploadCommonProps"
                    ></file-upload>
                </kld-form-item>
                <kld-form-item prop="licensePhotos" label-width="100%">
                    <template slot="label" slot-scope="{Asterisk}">
                        医疗器械经营许可证
                        <component :is="Asterisk"></component>
                        <span class="text-secondary">（支持上传最多5张图片或单个图片最大3M）</span>
                    </template>
                    <file-upload
                            ref="license-upload"
                            :images.sync="formData.licensePhotos"
                            :action-image="`/photo/${hospitalId}/4/upload`"
                            v-bind="uploadCommonProps"
                    ></file-upload>
                </kld-form-item>
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop="licenseDate" label="医疗器械经营许可证到期时间">
                            <el-date-picker v-model="formData.licenseDate" placeholder="请选择到期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </kld-card>
        </el-form>
        <Portal to="action">
            <el-button size="large" @click="submit" :loading="submitLoading">提交</el-button>
            <el-button type="default" size="large" @click="goBack">返回</el-button>
        </Portal>
    </div>
</template>

<script>
    import {KldCard, FileUpload, Portal, KldInputNumber, SelectArea, KldFormItem} from '@/components';
    import {isValid} from '@/utils';
    import SelectSupplierTag from './components/SelectSupplierTag';
    export default {
        name: "supplier-add",
        components: {
            KldCard,
            SelectSupplierTag,
            FileUpload,
            Portal,
            KldInputNumber,
            SelectArea,
            KldFormItem,
        },
        data() {
            return {
                formData: {
                    type: 0,
                    supplierName: null,
                    supplierContactName: null,
                    supplierPhone: null,
                    addressDetail: null,
                    areaid: null,
                    cityid: null,
                    provinceid: null,
                    labelIds: [],
                    businessPhotos: [],
                    licensePhotos: [],
                    licenseDate: null,
                    osID: this.$store.state.userInfo.osId,
                },
                submitLoading: false,
                loading: false,
            };
        },
        computed: {
            rules() {
                return {
                    type: {required: true, message: '供应商分类为必选'},
                    supplierName: {required: true, message: '供应商名称为必填'},
                    supplierContactName: {required: true, message: '联系人为必填'},
                    supplierPhone: {required: true, message: '联系方式为必填'},
                    ...this.dynamicRules
                };
            },

            dynamicRules() {
                const isNormalSupplier = this.formData.type === 0;
                return {
                    businessPhotos: {required: isNormalSupplier, message: '必须上传营业执照'},
                    licensePhotos: {required: isNormalSupplier, message: '必须上传医疗器械经营许可证'},
                    licenseDate: {required: isNormalSupplier, message: '许可证到期时间为必选'},
                };
            },

            supplierPhone: {
                get() {
                    const value = this.formData.supplierPhone;
                    if (isValid(value)) {
                        return Number(this.formData.supplierPhone);
                    }
                },
                set(value) {
                    this.formData.supplierPhone = isValid(value) ? String(value) : null;
                }
            },
            supplierArea: {
                get() {
                    const {provinceid: province, cityid: city, areaid: area} = this.formData;
                    return [province, city, area].filter(isValid);
                },
                set(value) {
                    const {formData} = this;
                    [formData.provinceid, formData.cityid, formData.areaid] = value.concat(new Array(3 - value.length).fill(null));
                }
            },



            supplierTypes() {
                return ['设备供应商', '保养供应商', '计量机构'];
            },

            // isAdd() {
            //     return this.$route.name === 'supplier-add';
            // },
            // isEdit() {
            //     return this.$route.name === 'supplier-edit';
            // },


            uploadCommonProps() {
                return {
                    limit: 5,
                    maxSize: 1024 * 1024 * 3,
                    accept: ['.jpeg', '.jpg', '.png', '.gif'],
                }
            },
            hospitalId() {
                return this.$store.state.userInfo.osId;
            },
            submitConfig() {
                return {
                    method: 'post',
                    url: ['/supplier', '/measurement/savaMaintain', '/measurement/saveMeasurement'][this.formData.type],
                    data: this.formData
                }
            }
        },
        watch: {
            dynamicRules(rules) {
                this.clearValidate(Object.keys(rules));
            }
        },
        methods: {
            async submit() {
                await this.$refs.form.validate();
                await Promise.all([
                    this.$refs['business-upload'].upload(),
                    this.$refs['license-upload'].upload(),
                ]);
                this.submitLoading = true;
                try{
                    await this.$axios(this.submitConfig);
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.goBack();
                } finally {
                    this.submitLoading = true;
                }
            },
            goBack() {
                this.$router.back();
            },
            clearValidate(props) {
                const {form} = this.$refs;
                if (form) {
                    form.clearValidate(props);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supplier-add {

    }
</style>
<template>
    <div class="supplier-detail" v-load="loading">
        <el-form label-width="100px" label-position="left">
            <kld-card
                    title="基础信息"
                    no-head-icon
            >
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="供应商分类：">{{supplierTypes[formData.type]}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供应商名称：">{{formData.supplierName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人：">{{formData.supplierContactName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式：">{{formData.supplierPhone}}</el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="供应商地址：">
                            <transform-empty>{{supplierArea}}</transform-empty>
                            &nbsp;
                            <transform-empty>{{formData.addressDetail}}</transform-empty>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="供应商标签：">
                            <transform-empty>
                                <kld-tag v-for="(name, index) in supplierTagNames" :key="index">{{name}}</kld-tag>
                            </transform-empty>
                        </el-form-item>
                    </el-col>
                </el-row>
            </kld-card>
            <kld-card
                    title="相关资质信息"
                    no-head-icon
            >
                <el-form-item label="营业执照"></el-form-item>
                <file-upload :images="formData.businessPhotos" detail></file-upload>
                <el-form-item label="医疗器械经营许可证" label-width="200px"></el-form-item>
                <file-upload :images="formData.businessPhotos" detail></file-upload>
                <el-form-item label="医疗器械经营许可证到期时间：" label-width="220px">
                    <transform-empty>{{formData.licenseDate}}</transform-empty>
                </el-form-item>
            </kld-card>
        </el-form>
    </div>
</template>

<script>
    import SupplierEdit from '../SupplierEdit';
    import {isValid} from '@/utils';
    import {KldTag, TransformEmpty} from '@/components';
    export default {
        name: "supplier-detail",
        extends: SupplierEdit,
        components: {KldTag, TransformEmpty},
        data() {
            return {
                formData: {
                    province: null,
                    city: null,
                    area: null,
                    addressDetail: null,
                    labels: []
                }
            };
        },
        computed: {
            supplierArea() {
                const {province, city, area} = this.formData;
                return `${[province, city, area].filter(isValid).join('/')}`;
            },
            supplierTagNames() {
                const {formData: {labels}} = this;
                return Array.isArray(labels) ? labels.map(
                    tag => tag.labelName
                ) : [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supplier-detail {
        .el-form-item{
            margin-bottom: 0;
        }
    }
</style>
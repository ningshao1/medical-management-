<template>
    <div class="contract-detail" v-load="loading">
        <el-form label-width="100px" label-position="left">
            <kld-card
                    no-head-icon
                    title="合同基础信息"
            >
                <el-form-item slot="head-icon" label="合同状态：">
                    <p class="font-weight-bold">
                        <template v-if="formData.contractStatus === 0">正常</template>
                        <span v-else class="text-disabled">废弃</span>
                    </p>
                </el-form-item>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="合同编号：">{{formData.contractCode}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同名称：">{{formData.contractName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="签订日期：">{{formData.signDate}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同类型：">{{formData.contractType}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供应商名称：">{{formData.supplierName}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系人：">{{formData.supplierContactor}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式：">{{formData.supplierContact}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="采购金额：">{{formData.purchaseAmount}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="合同标签：">
                            <transform-empty>
                                <kld-tag v-for="(tag, index) in formData.labels" :key="index">{{tag.labelName}}</kld-tag>
                            </transform-empty>
                        </el-form-item>
                    </el-col>
                </el-row>
            </kld-card>
            <kld-card
                no-head-icon
                title="分期付款项"
                class="mt-10"
            >
                <el-form-item label="分期数：">{{formData.periodsNum}}</el-form-item>
                <el-table :data="formData.paymentInstalments" class="mt-9">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column label="期数">
                        <template slot-scope="{$index}">第{{$index + 1}}期</template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="{row: {paymentStatus: status}}">
                            <span v-if="status === 1" class="text-orange">已支付</span>
                            <template v-else>未支付</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="付款日期" prop="paymentDate"></el-table-column>
                    <el-table-column label="付款金额" prop="paymentAmount"></el-table-column>
                </el-table>
            </kld-card>
            <kld-card
                    title="合同所含设备"
                    no-head-icon
                    class="mt-10"
            >
                <el-table :data="formData.assetIds">
                    <el-table-column label="设备名称" prop="assetName"></el-table-column>
                    <el-table-column label="设备品牌" prop="brandName"></el-table-column>
                    <el-table-column label="设备型号" prop="assetClass"></el-table-column>
                    <el-table-column label="过保日期" prop="assetWarrntyDate"></el-table-column>
                </el-table>
            </kld-card>
            <kld-card
                    title="合同所含备件"
                    no-head-icon
                    class="mt-10"
            >
                <el-table :data="formData.spareParts">
                    <el-table-column label="备件名称" prop="sparePartName"></el-table-column>
                    <el-table-column label="备件型号" prop="sparePartModel"></el-table-column>
                    <el-table-column label="所属设备" prop="assetName">
                        <template slot-scope="{row}">{{assetsMap[row.assetId]}}</template>
                    </el-table-column>
                    <el-table-column label="备件数量" prop="sparePartNum"></el-table-column>
                </el-table>
            </kld-card>
            <kld-card
                    title="合同图片"
                    no-head-icon
                    class="mt-10"
            >
                <file-upload :images="formData.pics" detail></file-upload>
            </kld-card>
        </el-form>
        <Portal to="action">
            <div class="flex justify-content-end full-width ">
                <router-link v-if="!loading && formData.contractStatus === 0" :to="editRoute" class="mr-10">
                    <el-button size="large">编辑</el-button>
                </router-link>
                <el-button type="default" size="large" @click="goBack">返回</el-button>
            </div>
        </Portal>
    </div>
</template>

<script>
    import ContractEdit from '../ContractEdit';
    import {TransformEmpty, KldTag, PageTips} from '@/components';
    export default {
        extends: ContractEdit,
        name: "contract-detail",
        components: {
            KldTag,
            PageTips,
            TransformEmpty
        },
        data() {
            return {
                formData: {
                    labels: []
                }
            };
        },
        computed: {
            assetsMap() {
                return this.formData.assetIds.reduce(
                    (map, asset) => {
                        map[asset.assetId] = asset.assetName;
                        return map;
                    },
                    {}
                );
            },
            editRoute() {
                return {
                    name: 'contract-edit',
                    query: {id: this.queryId}
                };
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contract-detail {
        .el-form-item{
            margin-bottom: 0;
        }
    }
</style>
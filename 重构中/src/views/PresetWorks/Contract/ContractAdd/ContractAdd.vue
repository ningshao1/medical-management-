<template>
    <div class="contract-add" v-load="loading">
        <el-form
                class="flex"
                label-position="top"
                :rules="formRules"
                :model="formData"
                ref="form"
        >
            <div class="flex-grow-lazy-1">
                <kld-card
                        title="合同基础信息"
                        noHeadIcon
                >
                    <el-row :gutter="20">
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="合同编号" prop="contractCode">
                                <el-input
                                        v-model="formData.contractCode"
                                        placeholder="请输入合同编号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="合同名称" prop="contractName">
                                <el-input
                                        v-model="formData.contractName"
                                        placeholder="请输入合同名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="签订日期" prop="signDate">
                                <el-date-picker
                                        v-model="formData.signDate"
                                        placeholder="请输入签订日期"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="合同类型" prop="contractType">
                                <el-select
                                        v-model="formData.contractType"
                                        placeholder="请选择合同类型"
                                >
                                    <el-option :value="1" label="维保合同"></el-option>
                                    <el-option :value="2" label="采购合同"></el-option>
                                    <el-option :value="3" label="维修合同"></el-option>
                                    <el-option :value="4" label="其它"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <kld-form-item label-width="100%" prop="supplierId">
                                <div slot="label" slot-scope="{Asterisk}" class="flex justify-content-between">
                                    <span>
                                        供应商名称
                                        <component :is="Asterisk" class="pl-4"></component>
                                    </span>
                                    <span>
                                        供应商未入库？
                                        <router-link :to="{name: 'supplier-add'}">点击新增</router-link>
                                    </span>
                                </div>
                                <select-supplier v-model="supplier"></select-supplier>
                            </kld-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="联系人" prop="supplierContactor">
                                <el-input :value="formData.supplierContactor" placeholder="系统自动带入" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="联系方式" prop="supplierContact">
                                <el-input :value="formData.supplierContact" placeholder="系统自动带入" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :md="8" :lg="6">
                            <el-form-item label="采购金额" prop="purchaseAmount">
                                <kld-input-number
                                        v-model="formData.purchaseAmount"
                                        :precision="2"
                                        :min="0"
                                        placeholder="请输入采购金额"
                                        :disabled="!isAdd"
                                >
                                    <span slot="prepend">￥</span>
                                </kld-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </kld-card>
                <kld-card
                        title="分期付款项"
                        class="mt-10"
                        no-head-icon
                >
                    <el-form-item label="分期数" prop="periodsNum">
                        <el-row class="flex align-items-center" :gutter="20">
                            <el-col :span="6">
                                <kld-input-number
                                        v-model="periods"
                                        placeholder="请输入分期数"
                                        :min="0"
                                        :precision="0"
                                        :default-value="0"
                                        :disabled="!isAdd"
                                >
                                    <template slot="append">期</template>
                                </kld-input-number>
                            </el-col>
                            <el-col v-if="isAdd" :span="18">
                                <span class="text-orange flex-shrink-0">*请填写合同实际分期数，并完善分期详情表格内容</span>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <installment-payment
                            v-model="formData.paymentInstalments"
                            :periods="formData.periodsNum"
                            :total="formData.purchaseAmount"
                            :disabled="!isAdd"
                            :status-editable="isEdit"
                    ></installment-payment>
                </kld-card>
                <kld-card
                        title="合同所含设备"
                        class="mt-10"
                        no-head-icon
                >
                    <contract-assets v-model="formData.assetIds"></contract-assets>
                </kld-card>
                <kld-card
                        title="合同所含备件"
                        class="mt-10"
                        no-head-icon
                >
                    <contract-spare-parts
                            v-model="formData.spareParts"
                            :assets="formData.assetIds"
                    ></contract-spare-parts>
                </kld-card>

            </div>
            <div class="flex-shrink-0 ml-20" style="width: 400px;">
                <kld-card
                        v-if="isEdit"
                        title="合同状态"
                        body-class-name="empty-none"
                >
                    <el-radio-group slot="head-icon" v-model="formData.contractStatus">
                        <el-radio :label="0">正常</el-radio>
                        <el-radio :label="1">废弃</el-radio>
                    </el-radio-group>
                </kld-card>
                <kld-card title="添加标签">
                    <span slot="head-icon" class="text-secondary">单台资产最多添加5个标签</span>
                    <select-contract-tag v-model="formData.labelIds"></select-contract-tag>
                </kld-card>
                <kld-card title="合同图片">
                    <span slot="head-icon" class="text-secondary">支持上传最多5张图片或单个图片最大3M</span>
                    <file-upload
                            ref="file-upload"
                            :action-image="imageAction"
                            :images.sync="formData.pics"
                            :accept="['.jpeg', '.jpg', '.png', '.gif']"
                            :limit="5"
                            :max-size="1024 * 1024 * 3"
                    ></file-upload>
                </kld-card>
            </div>
        </el-form>

        <Portal to="action">
            <div class="full-width justify-content-end flex pr-tips">
                <el-button @click="submit" size="large" :loading="submitLoading">提交</el-button>
                <el-button @click="goBack" type="default" size="large">返回</el-button>
            </div>
        </Portal>
    </div>
</template>

<script>
    import {KldCard, KldFormItem, Portal, KldInputNumber, FileUpload} from '@/components';
    import {isValid} from '@/utils';

    import InstallmentPayment from './components/InstallmentPayment';
    import SelectSupplier from './components/SelectSupplier';
    import ContractAssets from './components/ContractAssets';
    import ContractSpareParts from './components/ContractSpareParts';
    import SelectContractTag from './components/SelectContractTag';

    export default {
        name: "contract-add",
        components: {
            KldCard,
            KldInputNumber,
            KldFormItem,
            Portal,
            FileUpload,

            InstallmentPayment,
            SelectSupplier,
            ContractAssets,
            ContractSpareParts,
            SelectContractTag
        },
        data() {
            return {
                formData: {
                    contractCode: null,
                    contractName: null,
                    signDate: null,
                    contractType: null,
                    supplierId: null,
                    supplierName: null,
                    supplierContactor: null,
                    supplierContact: null,
                    purchaseAmount: null,

                    contractStatus: 0,

                    periodsNum: 0,
                    paymentInstalments: [],
                    labelIds: [],
                    pics: [],
                    spareParts: [],
                    assetIds: [],
                },
                submitLoading: false,
                loading: false
            };
        },
        computed: {
            formRules() {
                return {
                    contractCode: {required: true, message: '合同编号为必填'},
                    contractName: {required: true, message: '合同名称为必填'},
                    signDate: {required: true, message: '签订日期为必填'},
                    contractType: {required: true, message: '合同类型为必填'},
                    supplierId: {required: true, message: '供应商为必填'},
                    // periodsNum: {required: true, message: '合同编号为必填'},
                };
            },
            periods: {
                get() {
                    return this.formData.periodsNum;
                },
                set(value) {
                    this.formData.periodsNum = isValid(value) ? value : 0;
                }
            },
            supplier: {
                get() {
                    const {formData} = this;
                    return {
                        id: formData.supplierId,
                        supplierName: formData.supplierName
                    };
                },
                set(value) {
                    const {formData} = this;
                    formData.supplierId = value.id;
                    formData.supplierName = value.supplierName;
                    formData.supplierContactor = value.supplierContactName;
                    formData.supplierContact = value.supplierPhone;
                }
            },
            hospitalId() {
                return this.$store.state.userInfo.osId;
            },
            imageAction() {
                return `/photo/${this.hospitalId}/2/upload`;
            },
            routeName() {
                return this.$route.name;
            },
            isAdd() {
                return this.routeName === 'contract-add';
            },
            isEdit() {
                return this.routeName === 'contract-edit';
            },
            clearAssets() {
                return this.formData.assetIds.map(
                    ({assetId, assetWarrntyDate, departmentId, hosId}) => ({assetId, assetWarrntyDate, departmentId, hosId})
                );
            },
            submitConfig() {
                const data = {...this.formData};
                data.assetIds = this.clearAssets;
                // delete data.periodsNum;
                // delete data.paymentInstalments;
                return {
                    method: this.isAdd ? 'post' : 'put',
                    url: `/contracts/${this.hospitalId}/${this.isAdd ? '' : this.queryId}`,
                    data: {
                        ...data,
                    }
                };
            },
        },
        methods: {
            async submit() {
                await this.$refs.form.validate();

                if (this.validateAssets() && this.validateSpareParts() && this.validateInstallment()) {
                    this.submitLoading = true;
                    try {
                        await this.$refs['file-upload'].upload();
                        await this.$axios(this.submitConfig);
                        this.$message({
                            type: 'success',
                            message: this.isAdd ? '新增成功' : '修改成功'
                        });
                        this.goBack();
                    } finally {
                        this.submitLoading = false;
                    }
                }
            },

            validateAssets() {
                const result = this.formData.assetIds.every(
                    asset => isValid(asset.assetWarrntyDate)
                );
                if (!result) {
                    this.$message({
                        type: 'warning',
                        message: '设备过保日期为必填'
                    });
                }

                return result;
            },
            validateSpareParts() {
                const messages = {
                    sparePartName: '备件名称为必填',
                    sparePartModel: '备件型号为必填',
                    assetId: '备件所属设备为必填',
                    sparePartNum: '备件数量为必填'
                };

                for (const item of this.formData.spareParts) {
                    for (const [key, message] of Object.entries(messages)) {
                        if (!isValid(item[key])) {
                            this.$message({
                                type: 'warning',
                                message
                            });
                            return false;
                        }
                    }
                }

                return true;
            },
            validateInstallment() {
                const {
                    paymentInstalments: data,
                    purchaseAmount: total
                } = this.formData;
                if (data.length > 0) {
                    if (! data.every(({paymentDate}) => paymentDate)) {
                        this.$message({
                            type: 'warning',
                            message: '分期付款日期为必填'
                        });
                        return false;
                    } else if (
                        Number(data.reduce((money, {paymentAmount}) => money + Number(paymentAmount), 0).toFixed(2)) !== total || 0
                    ) {
                        this.$message({
                            type: 'warning',
                            message: '分期总金额必须等于采购金额'
                        });
                        return false;
                    }
                }
                return true;
            },
            goBack() {
                this.$router.back();
            }
        },
    }
</script>
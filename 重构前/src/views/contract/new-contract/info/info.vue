<template>
    <div class="contract-info kld-box-effect relative">
        <Loading v-if="pageLoading"></Loading>
        <Form :model="formData" :rules="formRules" ref="form" label-position="top">
            <Row :gutter="20" class="mb-26">
                <i-col span="12">
                    <FormItem prop="contractCode" label="合同编号：">
                        <i-input v-model="formData.contractCode" class="kld-input" placeholder="请输入合同编号" :disabled="isDetail"></i-input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem prop="contractName" label="合同名称：">
                        <i-input v-model="formData.contractName" class="kld-input" placeholder="请输入合同名称" :disabled="isDetail"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-26">
                <i-col span="12">
                    <FormItem prop="signDate" label="签订日期：">
                        <DatePicker :value="formData.signDate" :disabled="isDetail" @on-change="formData.signDate = $event" class="kld-date-picker" placeholder="请选择签订日期"></DatePicker>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem prop="contractType" label="合同类型：">
                        <Select v-model="formData.contractType" class="kld-select" placeholder="请选择合同类型" :disabled="isDetail">
                            <Option :value="1">维保合同</Option>
                            <Option :value="2">采购合同</Option>
                            <Option :value="3">维修合同</Option>
                            <Option :value="4">其它</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-26">
                <i-col span="12">
                    <FormItem prop="supplierName" label="供应商名称：">
                        <Row :gutter="20">
                            <i-col :span="isDetail ? 24 : 18" class="relative">
                                <i-input
                                        @on-focus="selectSupplierModalShow = true"
                                        :value="formData.supplierName"
                                        class="kld-input"
                                        placeholder="请选择供应商"
                                        :disabled="isDetail"
                                        readonly
                                ></i-input>

                                <check-supplier-exist v-if="! isAdd" :supplier-id="formData.supplierId"></check-supplier-exist>

                                <select-supplier-modal
                                        v-if="! isDetail"
                                        :show.sync="selectSupplierModalShow"
                                        @select="selectSupplierHandler"
                                ></select-supplier-modal>
                            </i-col>
                            <i-col v-if="! isDetail" span="6">
                                <router-link :to="{name: 'add-supplier'}" class="block">
                                    <Button class="kld-btn full-width" icon="plus">新增供应商</Button>
                                </router-link>
                            </i-col>
                        </Row>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem prop="supplierContactor" label="联系人：">
                        <i-input :value="formData.supplierContactor" disabled class="kld-input" placeholder="该供应商联系人"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-26">
                <i-col span="12">
                    <FormItem prop="supplierContact" label="联系方式：">
                        <i-input :value="formData.supplierContact" disabled class="kld-input" placeholder="该供应商联系方式"></i-input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem prop="purchaseAmount" label="采购金额（元）：">
                        <kld-input-number v-model="formData.purchaseAmount" :precision="2" class="kld-input" placeholder="请输入采购金额" :disabled="! isAdd"></kld-input-number>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-20">
                <i-col span="24">
                    <FormItem prop="labelIds">
                        <template slot="label">
                            添加标签： <span class="kld-default">（每台设备最多添加5个标签）</span>
                        </template>
                        <contract-label-select v-model="formData.labelIds" :max="5" placeholder="请选择合同标签" :disabled="isDetail"></contract-label-select>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-20">
                <i-col span="24">
                    <FormItem prop="paymentInstalments">
                        <template slot="label">
                            分期付款选项： <span class="kld-default">（如合同存在分期请勾选，并填写采购金额）</span>
                        </template>
                        <payment-installments
                                ref="payment-installments"
                                :disabled="! isAdd"
                                v-model="formData.paymentInstalments"
                                :total="formData.purchaseAmount"
                                :money-editable-rows="moneyEditableRows"
                        />
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-20">
                <i-col span="24">
                    <FormItem prop="pics">
                        <template slot="label">
                            合同图片： <span class="kld-default">（拖拽图片到该区域，完成上传；或点击）</span>
                        </template>
                        <file-upload ref="file-upload" :default-images="formData.pics" type="2" :max-size="1024 * 1024 * 3" :accept="['.jpg', '.jpeg', '.png', '.gif']" :editable="! isDetail"/>
                        <p class="kld-default">支持上传单张3M以内的图片</p>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20" class="mb-20">
                <i-col span="24">
                    <contract-assets
                            ref="contract-assets"
                            :assets.sync="formData.assetIds"
                            :spare-parts.sync="formData.spareParts"
                            :disabled="isDetail"
                    />
                </i-col>
            </Row>
        </Form>

        <div class="kld-form-footer " style="margin: 20px -20px -20px -20px;">
            <div>
                <Checkbox
                        v-if="! isAdd && delLimit"
                        v-model="contractStatus"
                        :true-value="1"
                        :false-value="0"
                >设为无效合同</Checkbox>
            </div>
            <div>
                <Button @click="goBack(! isDetail)" class="kld-btn-default">返回</Button>
                <router-link v-if="isDetail && editLimit && contractStatus === 0" class="inline-block ml-20" :to="{name: 'contract-edit', query: {id: contractId}}">
                    <Button class="kld-btn">编辑</Button>
                </router-link>
                <Button v-if="! isDetail" class="kld-btn ml-20" @click="submit" :loading="submitLoading">确认</Button>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .contract-info {
        .kld-form-footer{
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>

<script>
    import KldInputNumber from '@common/kld-input-number';
    import ContractLabelSelect from './components/contract-label-select';
    import PaymentInstallments from './components/payment-installments';
    import FileUpload from './components/file-upload';
    import ContractAssets from './components/contract-assets';

    const SelectSupplierModal = () => import('./components/select-supplier-modal');
    const CheckSupplierExist = () => import('./components/check-supplier-exist');

    import kldConfirm from '@common/kld-confirm';
    import emptyToNull from '@common/empty-to-null';
    import merge from '@/common/no-expand-merge';
    export default {
        name: "contract-info",
        components: {
            KldInputNumber,
            SelectSupplierModal,
            ContractLabelSelect,
            PaymentInstallments,
            FileUpload,
            ContractAssets,
            CheckSupplierExist
        },
        data() {
            return {
                formData: {
                    contractCode: '',
                    contractName: '',
                    signDate: '',
                    contractType: '',
                    supplierId: '',
                    supplierName: '',
                    supplierContactor: '',
                    supplierContact: '',
                    purchaseAmount: '',

                    contractStatus: 0,

                    periodsNum: 0,
                    paymentInstalments: [],
                    labelIds: [],
                    pics: [],
                    spareParts: [],
                    assetIds: [],
                },

                selectSupplierModalShow: false,
                submitLoading: false,
                pageLoading: false,

                moneyEditableRows: []
            }
        },

        computed: {
            editLimit() {
                return this.checkLimit('con:edit');
            },
            delLimit() {
                return this.checkLimit('con:del');
            },
            formRules() {
                return {
                    contractCode: {required: true, message: '合同编号为必填'},
                    contractName: {required: true, message: '合同名称为必填'},
                    signDate: {required: true, message: '签订日期为必填'},
                    contractType: {required: true, message: '合同类型为必选'},
                    supplierName: {required: true, message: '供应商为必选'},
                };
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
            isDetail() {
                return this.routeName === 'contract-detail';
            },

            contractId() {
                return this.$route.query.id;
            },
            hospitalId() {
                return this.$store.state.user_in.osId;
            },

            contractStatus: {
                get() {
                    return this.formData.contractStatus;
                },
                async set(val) {
                    if (this.isDetail) {
                        await this.$axios.put(`/contracts/${this.hospitalId}/${this.contractId}/status?contractStatus=${val}`);
                        if (val === 1) {
                            this.$Message.success('已设置为无效合同');
                        }
                    }

                    this.formData.contractStatus = val;
                }
            }
        },

        watch: {
            'formData.paymentInstalments'({length}) {
                this.formData.periodsNum = length;
            },

            $route: {
                immediate: true,
                handler() {
                    if (this.isEdit || this.isDetail) {
                        this.getDetails();
                    }
                }
            }
        },

        methods: {
            async getDetails() {
                this.pageLoading = true;

                try {
                    const {data} = await this.$axios.get(`/contracts/${this.hospitalId}/${this.contractId}`);

                    data.labelIds = data.labels.map(({labelId}) => labelId);
                    data.pics = data.attachments;
                    data.assetIds = data.assets;

                    this.moneyEditableRows = this.isEdit ?
                        data.paymentInstalments.filter(({paymentStatus}) => paymentStatus === 0)
                        :
                        [];

                    merge(this.formData, data);
                } finally {
                    this.pageLoading = false;
                }
            },
            async submit() {
                const contractAssets = this.$refs['contract-assets'];
                if (
                    await this.$refs.form.validate() &&
                    (this.isAdd ? this.$refs['payment-installments'].validate() : true) &&
                    contractAssets.validate()
                ) {
                    const formData = emptyToNull(this.formData),
                        config = {
                            data: formData
                        };
                    formData.pics = await this.$refs['file-upload'].submit();
                    formData.assetIds = contractAssets.getEffectAssets();
                    formData.spareParts = contractAssets.getEffectSpareParts();

                    if (this.isAdd) {
                        config.url = `/contracts/${this.hospitalId}`;
                        config.method = 'post';

                        delete formData.contractStatus;
                    } else {
                        config.url = `/contracts/${this.hospitalId}/${this.contractId}`;
                        config.method = 'put';

                        // delete formData.paymentInstalments;
                        // delete formData.periodsNum;
                    }


                    this.submitLoading = true;

                    try {
                        await this.$axios(config);
                        this.$Message.success('提交成功');
                        this.goBack();
                    } finally {
                        this.submitLoading = false;
                    }
                }
            },

            goBack(needConfirm) {
                if (needConfirm === true) {
                    kldConfirm({
                        content: '返回后，所有修改都不会被保存，确定返回？',
                        ok: () => {
                            this.$router.back();
                        }
                    });
                } else {
                    this.$router.back();
                }
            },

            selectSupplierHandler(data) {
                const {formData} = this;
                formData.supplierId = data.id;
                formData.supplierName = data.supplierName;
                formData.supplierContactor = data.supplierContactName;
                formData.supplierContact = data.supplierPhone;
            }
        }
    }
</script>
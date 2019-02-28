<template>
    <Modal
            v-model="modalShow"
            :title="modalTitle"
            width="1000"
            @on-visible-change="visibleChange"
    >
        <div class="collect-asset-modal">
            <Form :model="formData" ref="form" :rules="formRules" label-position="top">
                <Row :gutter="20" class="mb-26">
                    <i-col span="8">
                        <FormItem prop="name" label="设备名称：">
                            <i-input v-model="formData.name" placeholder="请填写" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem prop="brand" label="品牌：">
                            <i-input v-model="formData.brand" placeholder="请填写" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem prop="model" label="型号：">
                            <i-input v-model="formData.model" placeholder="请填写" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                </Row>
                <Row :gutter="20" class="mb-26">
                    <i-col span="8">
                        <FormItem prop="departmentId" label="所属科室：">
                            <kld-tree-select
                                    v-model="formData.departmentId"
                                    :data="sectionData"
                                    title-key="osName"
                                    children-key="lists"
                                    first-expanded
                                    placeholder="请选择"
                                    :disables="sectionDisables"
                                    filterable
                            ></kld-tree-select>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem prop="location" label="位置：">
                            <i-input v-model="formData.location" placeholder="请填写" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem prop="ip" label="IP地址：">
                            <i-input v-model="formData.ip" placeholder="请填写" class="kld-input"></i-input>
                        </FormItem>
                    </i-col>
                </Row>
                <Row :gutter="20" class="mb-26">
                    <i-col span="8">
                        <FormItem prop="type" label="绑定类型：">
                            <Select v-model="formData.type" placeholder="请选择" class="kld-select">
                                <Option :value="1">大型设备采集器</Option>
                                <Option :value="2">标签读写器</Option>
                                <Option :value="3">其他</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="16">
                        <FormItem :class="{'ivu-form-item-required': formData.type === 1}" prop="assetId" label="选择设备：">
                            <asset-select
                                    v-model="formData.assetId"
                                    :disabled="formData.type !== 1"
                                    placeholder="请选择"
                                    ref="asset-select"
                            ></asset-select>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </div>
        <template slot="footer">
            <Button @click="closeModal" class="kld-btn-default">取消</Button>
            <Button @click="submit" class="kld-btn" :loading="submitLoading">确认</Button>
        </template>
    </Modal>
</template>

<script>
    import AssetSelect from './asset-select';
    import KldTreeSelect from '@/common/kld-tree-select';
    import merge from '@/common/no-expand-merge';
    import emptyToNull from '@/common/empty-to-null';
    export default {
        name: "collect-asset-modal",
        components: {
            KldTreeSelect,
            AssetSelect
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'add'
            },
        },
        data() {
            return {
                formData: {
                    id: '',
                    name: '',
                    brand: '',
                    model: '',
                    departmentId: '',
                    oldDepartmentId: '',
                    location: '',
                    ip: '',
                    oldIp: '',
                    type: '',
                    assetId: ''
                },

                sectionData: [],

                submitLoading: false,
            };
        },

        computed: {
            formRules() {
                return {
                    name: {
                        required: true,
                        message: '设备名称为必填'
                    },
                    brand: {
                        required: true,
                        message: '品牌为必填'
                    },
                    model: {
                        required: true,
                        message: '型号为必填'
                    },
                    departmentId: {
                        required: true,
                        message: '所属科室为必填'
                    },
                    location: {
                        required: true,
                        message: '位置为必填'
                    },
                    ip: {
                        required: true,
                        message: 'IP地址为必填'
                    },
                    type: {
                        required: true,
                        message: '绑定类型为必选'
                    },
                    assetId: {
                        validator: (rule, value, callback) => {
                            if (this.formData.type === 1) {
                                if (! value) {
                                    callback(new Error('设备为必选'));
                                }
                            }
                            callback();
                        }
                    }
                }
            },

            modalShow: {
                get() {
                    return this.show;
                },
                set(v) {
                    this.$emit('update:show', v);
                }
            },
            modalTitle() {
                return {
                    add: '新增设备',
                    edit: '编辑设备',
                }[this.type];
            },
            hospitalId() {
                return this.$store.state.user_in.osId;
            },
            sectionDisables() {
                return [this.hospitalId];
            }
        },

        watch: {
            'formData.type'(type) {
                if (type !== 1) {
                    this.formData.assetId = '';
                    this.$refs.form.validateField('assetId');
                }
            }
        },

        created() {
            this.getSectionData();
        },

        methods: {
            async getSectionData() {
                const {data} = await this.$axios.get(`/orgstruct/findAllTree/${this.hospitalId}`);
                data.disabled = true;
                this.sectionData = [data];
            },
            setData(data) {
                merge(this.formData, data);
                this.$refs['asset-select'].setQuery(data.assetName);
            },

            async submit() {
                if (await this.validate()) {
                    const requestConfig = {
                        data: emptyToNull(this.formData)
                    };
                    if (this.type === 'add') {
                        requestConfig.url = '/internetThings/addCollect';
                        requestConfig.method = 'put';
                        delete requestConfig.data.id;
                    } else {
                        requestConfig.url = '/internetThings/updateCollect';
                        requestConfig.method = 'post';
                    }

                    this.submitLoading = true;

                    try {
                        await this.$axios(requestConfig);

                        this.$Message.success(`${this.modalTitle}成功`);
                        this.$emit('submitted');
                        this.closeModal();
                    } finally {
                        this.submitLoading = false;
                    }
                }
            },


            closeModal() {
                this.modalShow = false;
            },
            visibleChange(show) {
                if (show) {

                } else {
                    this.resetFields();
                }
            },
            resetFields() {
                this.$refs.form.resetFields();
                this.formData.oldDepartmentId = '';
                this.formData.oldIp = '';
                this.formData.id = '';
            },
            validate(cb) {
                return this.$refs.form.validate(cb);
            }
        }
    }
</script>

<style lang="less" scoped>
    .collect-asset-modal {

    }
</style>
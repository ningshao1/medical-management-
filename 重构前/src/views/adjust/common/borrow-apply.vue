<template>
    <Modal
        v-model="modalShow"
        title="借用申请"
        :width="1300"
        class-name="vertical-center-modal"
        :mask-closable="false"
    >
        <Form :model="formData" :rules="formRules" ref="modal-form" label-position="top" class="borrow-apply">
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="申请人：">
                        <poptip-show-info :info-id="user_in.id" width="100%">
                            <i-input :value="formData.userName" disabled class="kld-input" placeholder="请填写"></i-input>
                        </poptip-show-info>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="申请科室：">
                        <i-input :value="user_in.osName" disabled class="kld-input" placeholder="请填写"></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="申请借用设备：" prop="assetName">
                        <i-input v-model="formData.assetName" class="kld-input" placeholder="请填写"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="借用数量：" prop="assetNum">
                        <kld-input-number number v-model="formData.assetNum" class="kld-input" placeholder="请填写"></kld-input-number>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="预计借用时长：" prop="huors">
                        <kld-input-number number v-model="formData.huors" class="kld-input" placeholder="请填写">
                            <template slot="append">小时</template>
                        </kld-input-number>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="费用类型：" prop="money">
                        <RadioGroup v-model="formData.money" size="large">
                            <Radio label="0">无偿</Radio>
                            <Radio label="1">有偿</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col>
                    <FormItem label="备注：" prop="note">
                        <i-input v-model="formData.note" type="textarea" :rows="4" placeholder="请填写"></i-input>
                    </FormItem>
                </i-col>
            </Row>
        </Form>
        <template slot="footer">
            <Button @click="modalCancel" class="kld-btn-default">取消</Button>
            <Button :loading="submitLoading" @click="modalSubmit" class="kld-btn">提交</Button>
        </template>
    </Modal>
</template>

<style lang="less" scoped>
    .borrow-apply {
        .ivu-row{
            margin-bottom: 26px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
    }

    /*.input-append-wrap{*/
        /*display: flex;*/
        /*.ivu-input-number{*/
            /*flex-grow: 1;*/
        /*}*/
        /*.append{*/
            /*flex-shrink: 0;*/
            /*text-align: center;*/
            /*line-height: 44px;*/

        /*}*/
    /*}*/
</style>

<script>
    import kldInputNumber from '@common/kld-input-number';
    import kldConfirm from '@common/kld-confirm';
    import poptipShowInfo from '@common/poptip-show-info';

    export default {
        name: "borrow-apply",
        components: {kldInputNumber, poptipShowInfo},
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                submitLoading: false,

                formData: {
                    userName: '',
                    userId: '',
                    sectionId: '',
                    assetName: '',
                    assetNum: '',
                    money: '0',
                    note: '',
                    huors: ''
                },
                formRules: {
                    assetName: {
                        required: true,
                        message: '申请借用设备为必填'
                    },
                    assetNum: [
                        {
                            required: true,
                            message: '借用数量为必填'
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: '最小值为1'
                        }
                    ],
                    huors: {
                        validator(rule, value, callback) {
                            if (value === '') {
                                callback();
                            } else {
                                if (typeof value === 'number') {
                                    if (value > 0) {
                                        callback();
                                    } else {
                                        callback(new Error('预计借用时长必须大于0'));
                                    }
                                } else {
                                    callback(new Error('预计借用时长必须为数字'));
                                }
                            }
                        }
                    }
                },
            };
        },
        computed: {
            modalShow: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                    this.$refs['modal-form'].resetFields();
                }
            },

            user_in() {
                return this.$store.state.user_in;
            }
        },
        created() {
            this.formData.userName = this.user_in.name;
            this.formData.userId = this.user_in.id;
            this.formData.sectionId = this.user_in.groupId;
        },
        methods: {
            modalSubmit() {


                this.$refs['modal-form'].validate(valid => {
                    if (valid) {
                        kldConfirm({
                            content: '确认提交借用申请',
                            ok: () => {
                                this.submitLoading = true;
                                this.$axios.post('/assetBorrow/saveborrowApply', this.formData)
                                    .then(
                                        () => {
                                            this.modalShow = false;
                                            this.$emit('on-resolve');
                                            this.$Message.success('新增借用申请成功');
                                        }
                                    )
                                    .finally(() => this.submitLoading = false);
                            }
                        });
                    }
                });
            },
            modalCancel() {
                this.modalShow = false;
            }
        }
    }
</script>
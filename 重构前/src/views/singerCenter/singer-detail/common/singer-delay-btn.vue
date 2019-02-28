<template>
    <i-button class='kld-btn'
              @click="show=true">
        <template>
            延长维修时间
        </template>
        <Modal v-model="show"
               title="延长维修时间"
               class-name="singer-delay-modal">
            <Form ref="singerDelay"
                  :model="singerDelay"
                  class="singer-delay-form"
                  :rules="singerDelayValidate">
                <FormItem label="请选择延时理由"
                          prop="delayType">
                    <Select v-model="singerDelay.delayType"
                            placeholder="请选择延时理由"
                            @on-change="delayTypeChange">
                        <Option v-for="(v,i) of delayTypes"
                                :key="i"
                                :value="v.value">{{v.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注信息"
                          prop="delayReason">
                    <Input type="textarea"
                           :rows='3'
                           v-model="singerDelay.delayReason"
                           placeholder="请填写备注信息" />

                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost"
                        @click="singerDelayFlag=false">取消</Button>
                <Button type="primary"
                        :loading="btnLoading"
                        @click="checkDelay">确定</Button>
            </div>

        </Modal>
    </i-button>
</template>
<script>
import kldConfirm from "@common/kld-confirm/index.js";
export default {
    name: "singer-delay-btn",
    data() {
        const validateRemarks = (rule, value, callback) => {
            if (value === "" && this.singerDelay.delayType == 3) {
                callback(new Error("选择‘其他’时，备注为必填项！"));
            } else {
                callback();
            }
        };
        return {
            show: false,
            btnLoading: false,
            singerDelay: {
                delayType: "",
                delayReason: ""
            },
            singerDelayValidate: {
                delayType: { required: true, message: "请选择延时理由" },
                delayReason: [{ validator: validateRemarks, trigger: "blur" }]
            },
            delayTypes: [
                {
                    value: 0,
                    label: "供应商更换配件"
                },
                {
                    value: 1,
                    label: "拆机维修"
                },
                {
                    value: 2,
                    label: "等待购买配件寄达"
                },
                {
                    value: 3,
                    label: "其他"
                }
            ]
        };
    },
    props: {
        singerInfo: Object
    },
    computed: {
        singerId() {
            return this.$route.query.id;
        },
        userInfo() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        checkDelay() {
            this.$refs.singerDelay.validate(valid => {
                if (valid) {
                    this.extendedRepairTime();
                }
            });
        },
        async extendedRepairTime() {
            this.btnLoading = true;
            try {
                let requestBody = {
                    id: this.singerId,
                    delayType: this.singerDelay.delayType,
                    delayReason: this.singerDelay.delayReason
                };
                await this.$axios.put(
                    `/faultReport/delayFaultReport`,
                    requestBody
                );
                this.$Message.success("申请延时成功！");
                this.$store.state.reload();
            } finally {
                this.btnLoading = false;
            }
        },
        delayTypeChange(type) {
            if (type !== 3) {
                this.$refs.singerDelay.validateField("delayReason");
            }
        }
    }
};
</script>

<style lang="less" scoped>
/deep/.singer-delay-modal {
    .singer-delay-form {
        margin: 20px 0;
        .ivu-form-item {
            margin-bottom: 20px !important;
        }
    }
}
</style>





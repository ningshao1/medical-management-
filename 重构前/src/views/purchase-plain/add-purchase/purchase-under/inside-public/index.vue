<template>
    <div class="inside-public">
        <kld-collapse :open='insideData.procurementState>=8' :title='"对内公示"' v-if="insideData.procurementState>7">
            <div class="inside">
                <text-upload :DetailInfo='oldDetail' ref='publicity' :Detail='insideDetail' :uploadOption='uploadOption' :UpLoadDateURL='UpLoadDateURL' :DetailfileURL='openFileURL'>
                    <p class="open-title">
                        招标说明
                    </p>
                    <div class="open-time">
                        <Form ref="formInline" inline :label-width="100" :model="openData" :rules='openRule'>
                            <FormItem prop="bidTime" label="开标时间：">
                                <DatePicker transfer :disabled='insideDetail' :value="openData.bidTime" @on-change='openData.bidTime=$event' type="date" placeholder="请选择开标日期" style="width: 200px"></DatePicker>
                                </Input>
                            </FormItem>
                            <FormItem prop="bidAddress" label="开标地点：">
                                <Input :max-length="1000" :disabled='insideDetail' v-model="openData.bidAddress" placeholder="请输入开标地点" style="width: 200px"></Input>
                            </FormItem>
                        </Form>
                    </div>
                </text-upload>
                <div class="under-btn" v-if="insideData.procurementState>=8">
                    <Button type="primary" @click="back">返回</Button>
                    <Button type="primary" v-if="showPost" @click="postData">提交</Button>
                </div>
            </div>
        </kld-collapse>

    </div>
</template>
<script>
import collapse from "../../../../annual-plain/add-annual-fifty/common/kld-collapse/index.vue";
import textUpload from "../../common/components/text-upload/index";
import kldConfirm from "@/common/kld-confirm";
export default {
    name: "inside-public",
    props: {
        oldDetail: {
            type: Object
        }
    },
    data() {
        return {
            UpLoadDateURL: [
                `purchase/${
                    this.$store.state.user_in.osId
                }/uploadPurchasePlan/${this.$route.params.id}/29
`
            ],
            openData: {
                bidAddress: "",
                bidTime: ""
            }, //开标信息
            openRule: {
                bidAddress: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ],
                bidTime: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ]
            }
        };
    },
    components: {
        [collapse.name]: collapse,
        [textUpload.name]: textUpload
    },
    computed: {
        insideData() {
            return this.oldDetail || {};
        },
        id() {
            return this.$route.params.id;
        },
        uploadOption() {
            return {
                accept: [".doc", ".docx", ".xls", ".xlsx", ".wps"],
                maxSize: 3072 * 1024
            };
        },
        openFileURL() {
            return this.insideData.files instanceof Array
                ? this.insideData.files.filter(v => v.type === 29)
                : [];
        },
        //控制提交按钮的显示隐藏
        showPost() {
            if (!this.ViewLimit("purchase:publicity")) {
                return false;
            }
            if (this.oldDetail.procurementState === 8) {
                return true;
            } else {
                return false;
            }
        },
        insideDetail() {
            if (this.insideData.procurementState > 8) {
                return true;
            }
        }
    },
    watch: {
        insideData(data) {
            const { bidTime, bidAddress } = data;
            this.openData = { bidTime, bidAddress };
        }
    },
    methods: {
        postData() {
            kldConfirm({
                title: "提示",
                content: "确定提交吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    if (this.oldDetail.procurementState === 8) {
                        this.commit();
                    }
                }
            });
        },
        commit() {
            this.$refs["formInline"].validate(valid => {
                if (!valid) return;
                this.$refs["publicity"].uploadFile().then(() => {
                    this.$axios
                        .post(`/purchase/commit`, {
                            ...this.openData,
                            purchaseId: this.id
                        })
                        .then(() => {
                            this.$Message.success("提交成功");
                            this.$router.go(-1);
                        });
                });
            });
        },
        back() {
            kldConfirm({
                title: "提示",
                content: "确定返回吗",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.$router.go(-1);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.under-btn {
    display: flex;
    justify-content: flex-end;
    > button {
        margin: 0 6px;
    }
}
</style>


<template>
    <div class='add-acceptance'>
        <div class='add-step'>
            <KldStep :data='stepList' :current="stepNum-1"></KldStep>
        </div>
        <div class="add-center">
            <div class='add-content'>
                <component :is='`step${stepNum}`' :Nasset='asset' ref="addAcceptance" :loading='loading'></component>
            </div>
            <div class="add-acceptance-btn">
                <Button class='acceptance-back-btn' v-if="stepNum<=1" @click="goBack">返回</Button>
                <Button class='acceptance-skip-btn' v-if="stepNum==3" @click="skip">跳过</Button>
                <Button class="kld-btn ivu-btn acceptance-next-btn" v-if="stepNum!=4" @click="next" >保存，下一步</Button>
            </div>
        </div>
    </div>
</template>
<script>
import kldConfirm from "@common/kld-confirm";
import step from "@common/step/step.vue";
import step1 from "./one-step/one-step";
import step2 from "./two-step/two-step";
import step3 from "./three-step/three-step";
import step4 from "./four-step/four-step";
export default {
    data() {
        return {
            loading: {
                show: false
            },
            list: null,
            stepList: [
                "确认验收设备",
                "录入资产验收文档",
                "关联采购计划",
                "完成"
            ],
            stepNum: this.$route.query.step || 1, //操作步数
            //取资产信息
            asset: {
                NassetId: this.$route.query.id || "",
                sectionName: this.$route.query.osName || "",
                collarTime: this.$route.query.collarTime || ""
            }
        };
    },
    components: {
        [step.name]: step,
        [step1.name]: step1,
        [step2.name]: step2,
        [step3.name]: step3,
        [step4.name]: step4
    },
    methods: {
        next() {
            // console.log(this.$refs.addAcceptance);
            this.$refs.addAcceptance.next(this.doJump);
        },
        doJump() {
            this.loading.show = false;
            ++this.stepNum;
        },
        skip() {
            this.$refs.addAcceptance.skip(this.doJump);
        },
        goBack() {
            kldConfirm({
                title: "提示",
                content: "返回后表单所有数据不会保存，确认返回？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    //当点击了确认按钮时
                    this.$router.go(-1);
                },
                cancel: () => {
                    //取消按钮同上
                    console.log("cancel");
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.add-step {
    background-color: #fafafa;
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    .c_bar {
        margin: 6px 0;
    }
}
.add-acceptance {
    > .add-center {
        background-color: #fafafa;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 15px;
        > .add-content {
            padding: 0 25px;
            border-radius: 3px;
        }
        > .add-acceptance-btn {
            padding: 15px;
            background-color: rgba(210, 210, 210, 0.5);
            position: relative;
            height: 60px;
            // display: flex;
            // justify-content: space-between;
            > .acceptance-back-btn {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                padding: 13px 30px;
            }
            > .acceptance-skip-btn {
                position: absolute;
                right: 150px;
                top: 50%;
                transform: translateY(-50%);
                padding: 13px 30px;
            }
            > .acceptance-next-btn {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
}
</style>

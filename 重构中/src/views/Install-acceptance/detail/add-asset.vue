<template>
    <div>
        <Portal to="breadcrumb">
            <kld-steps :steps='steps'
                       class="install-step"
                       :active="step">
            </kld-steps>
        </Portal>
        <component :is='stepName'
                   ref='add-asset'
                   @getInfo='getInfo'></component>
        <Portal to='action'>
            <div class="detail-btn"
                 v-if="step!==3">
                <div>
                    <el-button type="default"
                               class="next"
                               @click="back">返回</el-button>
                    <el-button type="default"
                               class="next"
                               v-if="step===2"
                               @click="jumpOver">跳过</el-button>
                    <el-button class="next"
                               @click="next">下一步</el-button>
                </div>

            </div>
        </Portal>

    </div>
</template>

<script>
const addAcceptance = () => import("./acceptance/index.js");
const enteringFile = () => import(`./entering-file/index.js`);
const relevnce = () => import("./relevance/index.js");
const installSuccess = () => import("./success");
import { Portal } from "@/components";
import step from "@c/KldSteps";
import { confirm } from "@el";
export default {
    data() {
        return {
            step: this.$route.query.step ? Number(this.$route.query.step) : 0,
            steps: [
                {
                    title: "确认验收设备"
                },
                {
                    title: "录入资产验收文档 "
                },
                {
                    title: "关联采购计划  "
                },
                {
                    title: "完成"
                }
            ]
        };
    },
    computed: {
        stepName() {
            const step = String(this.step);
            const stepMap = {
                "0": "addAcceptance",
                "1": "enteringFile",
                "2": "installRelevnce",
                "3": "installSuccess"
            };
            return stepMap[step];
        }
    },
    components: {
        [step.name]: step,
        Portal,
        addAcceptance,
        enteringFile,
        installRelevnce: relevnce,
        installSuccess
    },
    methods: {
        next() {
            this.$refs["add-asset"].next(() => {
                this.step++;
            });
        },
        getInfo(id, name, date) {
            this.$router.replace({
                name: this.$route.name,
                query: {
                    id,
                    name,
                    date,
                    step: this.step + 1
                }
            });
        },
        jumpOver() {
            this.$refs["add-asset"].jumpOver();
        },
        back() {
            confirm({
                title: "提示",
                content: "确定返回？",
                okText: "确定",
                cancelText: "取消",
                ok: () => {
                    this.$router.go(-1);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.detail-btn {
    background-color: #e5e7e8;
    height: 70px;
    bottom: 0;
    width: 100%;
    position: relative;
    right: 0;
    min-width: 1200px;
    > div {
        position: absolute;
        right: 430px;
        top: 20px;
    }
}
.next {
    height: 40px;
}
</style>


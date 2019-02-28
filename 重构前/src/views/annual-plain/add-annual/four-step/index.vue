<template>
    <div>
        <div>
            <application-plan></application-plan>
        </div>
        <div>
            <committee :put='true' :ListData='ListData'></committee>
        </div>
        <div>
            <reportApply @complete='complete'></reportApply>
        </div>
        <div class="bottom-button">
            <Button class="kld-btn" @click="showModal">提交审批</Button>
        </div>
    </div>
</template>
<script>
import ALPlan from "../common/application-plan/index";
import kldConfirm from "@common/kld-confirm";
import committee from "../common/committee/index";
import reportApply from "../../add-annual-fifty/common/step-parts/report-apply.vue";
export default {
    props: {
        add: {
            type: Function
        }
    },
    data() {
        return {
            voteShow: true,
            verdict: {},
            ListData: []
        };
    },
    components: {
        [ALPlan.name]: ALPlan,
        [committee.name]: committee,
        reportApply
    },
    created() {
        this.getDetail();
    },
    methods: {
        showModal() {
            delete this.verdict["workeType"];
            let temp = this.verdict;
            if (
                temp.unitExpertsType === 0 ||
                temp.unitExpertsType === undefined
            ) {
                console.log(temp);
                this.$Message.warning("专家论证意见为必选项");
                return;
            }
            if (temp.unitExpertsType === 1 && temp.departmentType === 0) {
                this.$Message.warning("相关部门意见为必填项");
                return;
            }
            if (
                temp.unitExpertsType === 1 &&
                temp.departmentType === 1 &&
                temp.approveType === 0
            ) {
                this.$Message.warning("结论性表决意见为必填项");
                return;
            }

            kldConfirm({
                title: "确认提交审批",
                content: "是否确认提交审批",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.postApprove();
                },
                cancel: () => {}
            });
        },
        //数据提交
        postApprove() {
            Promise.all(
                this.verdict.photos.map(v => {
                    let data = new FormData();
                    data.append("file", v);
                    return this.$axios.post(
                        `/photo/${this.$store.state.user_in.osId}/15/upload`,
                        data,
                        {
                            headers: { "Content-Type": "multipart/form-data" }
                        }
                    );
                })
            ).then(res => {
                let temp = res.map(v => v.data);
                if (
                    this.verdict.unitExpertsType === 2 ||
                    this.verdict.departmentType === 2
                ) {
                    this.verdict.approveType = 7;
                }
                // delete this.verdict["photos"];
                this.$axios
                    .put(`/annualPlanTmp/updateAnnualPlanApproveType`, {
                        id: this.$route.query.id,
                        ...this.verdict,
                        photos: temp
                    })
                    .then(res => {
                        this.$Message.success("数据提交成功");
                        this.$router.go(-1);
                    });
            });
        },
        //详情获取
        getDetail() {
            this.$axios
                .get(`/annualPlanTmp/${this.$route.query.id}?type=${1}`)
                .then(({ data }) => {
                    this.ListData = data.annualPlanVote;
                });
        },
        complete(value) {
            delete value["workeType"];
            this.verdict = value;
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../common/base.less");
.vote-content {
    > div {
        margin: 20px 0;
    }
    > div:nth-of-type(1) {
        font-size: 16px;
        color: #000000;
        span {
            color: #fe881a;
        }
    }
    > div:nth-of-type(2) {
        color: #666666;
        font-size: 14px;
    }
}
.bottom-button {
    bottom: -86px;
}
</style>


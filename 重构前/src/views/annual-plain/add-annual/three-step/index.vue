<template>
    <div>
        <div>
            <application-plan></application-plan>
        </div>
        <div>
            <committee v-model="voteType" :ListData='ListData'></committee>
        </div>
        <div class="bottom-button">
            <Button v-if="ViewLimit('annual:statistical')" class="kld-btn" @click="voteShow=true">提交委员会表决结果</Button>
            <Button v-else  class="kld-btn"  @click="$router.go(-1)">返回</Button>
        </div>
        <Modal v-model="voteShow" title="表决结果确认" class-name='vote-modal'>
            <div class="vote-content">
                <div>
                    本次表决结果为：
                    <span>{{voteType===1?'同意':'拒绝'}}</span>
                </div>
            </div>
            <div slot="footer">
                <Button class="ivu-btn ivu-btn-text ivu-btn-large" @click='voteShow = false;'>取消</Button>
                <Button @click="postData" class="kld-btn">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import ALPlan from "../common/application-plan/index";
import committee from "../common/committee";
export default {
    props: {
        add: {
            type: Function
        }
    },
    data() {
        return {
            voteShow: false,
            voteType: 1,
            ListData: []
        };
    },
    components: {
        [ALPlan.name]: ALPlan,
        [committee.name]: committee
    },
    created() {
        this.getData();
    },
    methods: {
        //提交数据
        postData() {
            this.$axios
                .put(`/annualPlanTmp/updateAnnualPlanUnifiedResult`, {
                    id: this.$route.query.id,
                    voteType: this.voteType
                })
                .then(() => {
                    this.$Message.success("数据提交成功");
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.voteShow = false;
                });
        },
        //获取详情
        getData() {
            this.$axios
                .get(`/annualPlanTmp/${this.$route.query.id}?type=${1}`)
                .then(({ data }) => {
                    this.ListData = data.annualPlanVote;
                });
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
</style>


<template>
    <div class="annual-fifty-step2">
        <committee
                :style="committeeIsDetail ? 'margin: 0 20px 10px 20px' : 'margin-bottom: 10px'"
                :detail='committeeIsDetail'
                :ListData='ListData'
                v-if="listShow"
                :all-data="data"
                :resolve-show="true"
                :put="committeePut"
        ></committee>
        <Modal v-model="modelShow" title='委员会表决' width='800' class-name='annual-fifty-step2-wrap'>
            <Form ref="annual-plan-vote" class="annual-plan-vote-wrap" :model='fromData' :rules="rules">
                <FormItem prop="voteType" label="表决结果">
                    <RadioGroup v-model="fromData.voteType">
                        <Radio :label='1'>通过</Radio>
                        <Radio :label='2'>不通过</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="voteNote" label="意见表述(限100字)">
                    <i-input :maxlength="100" type="textarea" :autosize='{minRows: 6}'
                             v-model="fromData.voteNote"></i-input>
                </FormItem>
            </Form>
            <div slot="footer">
                <i-button class="kld-btn-default" @click="modelShow=false">取消</i-button>
                <i-button class="kld-btn" @click="doVote" :loading="loading">确定</i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import committee from "../../../add-annual/common/committee/index";
    import KldCollapse from "../../common/kld-collapse/index";

    export default {
        name: "annual-fifty-step2",
        components: {KldCollapse,  committee},
        props: {
            data: {
                type: Object
            },
            isDetail: {
                type: Boolean,
                default: false
            },
            isCollapse: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                modelShow: false,
                fromData: {
                    voteType: 1,
                    voteNote: ""
                },
                rules: {
                    voteType: {required: true}
                },
                loading: false,
                ListData: [],
                listShow: false
            };
        },
        computed: {
            isChief() {
                return this.$store.state.user_in.roles[0].srName === 'CHIEF';
            },

            committeeIsDetail() {
                return ! this.isCollapse && this.isDetail;
            },

            //判断是否不展开  true为不展开
            committeePut() {
                return this.isDetail && this.isCollapse;
            }
        },
        methods: {
            doVote() {
                this.loading = true;
                this.$axios
                    .put(`/annualPlanTmp/updateAnnualPlanVote`, {
                        alId: this.$route.query.id,
                        userId: this.$store.state.user_in.id,
                        ...this.fromData
                    })
                    .then(res => {
                        this.$Message.success('投票成功');
                        this.$router.go(-1);
                    })
                    .finally(res => {
                        this.loading = false;
                        this.modelShow = false;
                    });
            },
            submit() {
                this.modelShow = true;
            }
        },
        watch: {
            data: {
                immediate: true,
                handler(details) {
                    if (details) {
                        const myId = this.$store.state.user_in.id,
                            myVote = (this.ListData = details.annualPlanVote).find(
                                ({userId}) => userId === myId
                            ),
                            isVoted = myVote && myVote.voteType !== 0;

                        if (isVoted) {
                            this.fromData.voteType = myVote.voteType;
                            this.fromData.voteNote = myVote.voteNote;
                        }
                        this.listShow = isVoted || this.ViewLimit("annual:statistical") || this.isChief || this.ViewLimit('annual:upvote');
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .annual-fifty-step2 {
        width: 100%;
        /*padding: 10px 30px 0;*/
        /deep/ .fifty-report-apply {
            padding: 0px;
        }
        /deep/ .fifty-voting-statistics {
            right: 0px;
        }
        /deep/ .fifty-collapse .header-right {
            display: none;
        }
    }

    /deep/ .annual-fifty-step2-wrap {
        .ivu-radio-group {
            width: 100%;
        }
    }
</style>


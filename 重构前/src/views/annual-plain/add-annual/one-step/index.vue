<template>
    <div class="one-step">
        <Form ref="one-step"
              :model="oneStep"
              :rules="ruleOneStep">
            <div class="one-step-block">
                <kld-type title='采购类型'
                          class="step-type"></kld-type>
                <RadioGroup v-model="buyType"
                            class="radio-group">
                    <Radio :label="1"
                           :disabled="$parent.stepNumber>1||detail"
                           v-if="!($parent.stepNumber>1||detail)||(buyType===1&&($parent.stepNumber>1||detail))">
                        <span class='title'>0-20万元（不含20万元）</span>
                    </Radio>
                    <Radio :label="2"
                           :disabled="$parent.stepNumber>1||detail"
                           v-if="!($parent.stepNumber>1||detail)||(buyType===2&&($parent.stepNumber>1||detail))">
                        <span class="title">20万元-50万元（不含50万元）</span>
                    </Radio>
                </RadioGroup>
            </div>
            <div class="one-step-block">
                <basics :detail='$parent.stepNumber>1||detail'
                        :officeData='officeData'>
                    <div slot="time"
                         class="basics-block"
                         v-if="$parent.stepNumber>1||detail">
                        <span>申请时间</span>
                        <i-input disabled
                                 class="kld-input"
                                 :value='applyTime'></i-input>
                    </div>
                </basics>
            </div>
            <div class="one-step-block">
                <pr-name style="font-size: 14px;"
                         :detail='$parent.stepNumber>1||detail'
                         ref="prName"
                         :procurement='procurement'
                         :buyType='buyType'></pr-name>
            </div>

            <div class="one-step-block">
                <kld-type title='采购原因 *'
                          class="step-type"></kld-type>
                <FormItem prop="buyWhy">
                    <div class="buyWhy">
                        <i-input type="textarea"
                                 :maxlength='2000'
                                 :rows='6'
                                 :disabled="$parent.stepNumber>1||detail"
                                 v-model="oneStep.buyWhy"></i-input>
                    </div>
                </FormItem>
            </div>
            <div class="one-step-block">
                <analyze :detail='$parent.stepNumber>1||detail'
                         :selectData="analyze"
                         ref='analyze'></analyze>
            </div>
            <div class="one-step-block">
                <kld-type title='社会效益分析 *'
                          class="step-type"></kld-type>
                <FormItem prop="benefitAnalysis">
                    <div class="procurement">
                        <i-input type="textarea"
                                 :maxlength='2000'
                                 :rows='6'
                                 :disabled="$parent.stepNumber>1||detail"
                                 v-model="oneStep.benefitAnalysis"></i-input>
                    </div>
                </FormItem>
            </div>
            <!-- 列表组件 -->
            <div>
                <committee :detail='true'
                           v-if="committeeShow"
                           :ListData='ListData'></committee>
            </div>
            <div style="padding:15px 0"
                 v-if='PlanDetail&&PlanDetail.approveType===4&&ViewLimit("annual:statistical")'>
                <span>结论性表决意见：</span>
                <RadioGroup v-model="vote.voteType"
                            style="font-size:14px!important"
                            class="vote-radio">
                    <Radio :label="1">
                        <span>通过</span>
                    </Radio>
                    <Radio :label="2">
                        <span>未通过</span>
                    </Radio>
                </RadioGroup>
                <Button class="kld-btn"
                        style='height:30px;'
                        @click="postVoteData">提交</Button>
                <div style="margin-top:10px;">
                    <div style='padding-bottom:10px;'>表决意见备注：</div>
                    <i-input type="textarea"
                             :maxlength='2000'
                             :rows='4'
                             v-model="vote.voteNote"></i-input>
                </div>
            </div>
            <div class="bottom-button"
                 v-if='$parent.stepNumber<=2'>
                <Button class="kld-btn"
                        @click="GoBack">返回</Button>
                <Button class="kld-btn"
                        :loading='loading'
                        v-if="buttonShow"
                        @click="postApply">{{$parent.stepNumber===1?"提交申请":"委员会表决"}}</Button>
            </div>
            <Modal v-model="voteShow"
                   title="委员会表决"
                   @on-ok="postVote"
                   class-name='vote-modal'
                   :styles='{width:"700px"}'>
                <div>
                    <div class="result">
                        <div>表决结果：</div>
                        <RadioGroup v-model="voteType">
                            <Radio :label="1">
                                <span>通过</span>
                            </Radio>
                            <Radio :label="2">
                                <span>未通过</span>
                            </Radio>
                        </RadioGroup>
                    </div>
                    <div class="result">
                        <div>
                            意见表述：
                        </div>
                        <i-input type="textarea"
                                 :maxlength='2000'
                                 :rows='4'
                                 v-model="voteNote"></i-input>
                    </div>
                </div>
                <div slot="footer">
                    <Button class="ivu-btn ivu-btn-text ivu-btn-large"
                            @click="voteShow=false">取消</Button>
                    <Button :loading='voteLoading'
                            class='kld-btn'
                            @click="postVote">确定</Button>
                </div>
            </Modal>
        </Form>
    </div>
</template>
<script>
import typeName from "@common/kld-type/kld-type";
import basics from "../common/basics/index";
import prName from "../common/procurement-name";
import analyze from "../common/analyze/index";
import confirm from "@common/kld-confirm/index";
import committee from "../common/committee/index";
export default {
    props: {
        add: {
            type: Function
        },
        detail: false
    },
    data() {
        return {
            vote: {
                voteType: 0,
                voteNote: ""
            },
            limits: true,
            loading: false,
            voteLoading: false,
            officeData: {},
            applyTime: "",
            ListShow: false, //控制列表显示
            ListData: [],
            // planType: 1,
            buyType: 1,
            voteShow: false,
            procurement: {
                assetName: "",
                assetNum: 1,
                assetMoney: 0,
                importation: 1
            }, //设备采购信息,
            analyze: {
                capitalSource: 1,
                durableYears: "5",
                rates: null,
                expectIncome: null,
                depreciationCost: null,
                staffCost: null,
                maintainCost: null,
                consumableCost: null,
                surplus: null,
                recycle: null
            }, //经济效益分析
            oneStep: {
                buyWhy: "", //采购原因
                benefitAnalysis: "" //社会效益分析
            },
            ruleOneStep: {
                buyWhy: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ],
                benefitAnalysis: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "blur"
                    }
                ]
            },
            //第二步参数
            voteType: 1,
            voteNote: "",
            btnShow: false
        };
    },
    components: {
        [typeName.name]: typeName, //标题
        basics, //基础信息
        prName, //设备采购
        analyze, //经济效益
        committee
    },
    created() {
        // (this.$parent.stepNumber > 1 || this.detail) && this.getDetail();
        if (
            (this.$parent.stepNumber > 1 || this.detail) &&
            !this.ViewLimit("annual:vote")
        ) {
            this.limits = false;
        }
    },
    methods: {
        GoBack() {
            confirm({
                title: "提示",
                content: "是否确定返回",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$router.go(-1);
                },
                cancel: () => {}
            });
        },
        //提交决定意见
        postVoteData() {
            if (this.vote.voteType === 0) {
                this.$Message.warning("请选择表决意见");
                return;
            }
            confirm({
                title: "提示",
                content: "是否确定提交",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$axios
                        .put(`/annualPlanTmp/updateAnnualPlanUnifiedResult`, {
                            id: this.$route.query.id,
                            voteType: this.vote.voteType,
                            vote: this.vote.voteNote
                        })
                        .then(res => {
                            this.$Message.success("结论性表决成功");
                            this.$router.go(-1);
                        });
                }
            });
        },
        postApply() {
            if (this.$parent.stepNumber === 1) {
                let analyze = this.$refs["analyze"].verify();

                this.$refs["one-step"].validate(valid => {
                    console.log(analyze);
                    let temp = this.$refs["prName"].rules();
                    if (valid && temp && analyze) {
                        confirm({
                            title: "确认提交申请",
                            content: "是否确认提交申请",
                            maskClosable: false, //是否允许点击遮罩关闭 默认:false
                            okText: "确定", //确认按钮文本  默认:确认
                            cancelText: "取消", //确认取消文本  默认:取消
                            ok: () => {
                                this.postData();
                            }
                        });
                    } else {
                        this.$Message.warning("请确保信息填写正确和完整");
                    }
                });
            } else {
                if (this.$route.query.step === "1") {
                    this.$Message.warning(
                        "赋予投票权限时投票已开始，无法对此计划进行投票。"
                    );
                    return;
                }
                if (
                    this.ListData.findIndex(v => {
                        if (typeof v === "object" && v !== null) {
                            return v.userId === this.$store.state.user_in.id;
                        }
                    }) === -1
                ) {
                    this.$Message.warning("您不在该次计划的投票时期内");
                } else {
                    this.voteShow = true;
                }
            }
        },
        //提交数据
        postData() {
            let temp = JSON.parse(JSON.stringify(this.analyze));
            // let ap = {};
            // for (var key in temp.annualPlanLess) {
            //   if (key !== "durableYears" && key !== "recycle" && key !== "surplus") {
            //     ap[key] =
            //       temp.annualPlanLess[key] !== "" && temp.annualPlanLess[key] !== null
            //         ? (temp.annualPlanLess[key] - 0) * 10000
            //         : null;
            //   } else if (key === "recycle" || key === "surplus") {
            //     ap[key] =
            //       temp.annualPlanLess[key] !== "" && temp.annualPlanLess[key] !== null
            //         ? temp.annualPlanLess[key] - 0
            //         : null;
            //   }
            // }
            // temp.annualPlanLess = Object.assign(temp.annualPlanLess, ap);
            this.loading = true;
            this.$axios
                .post(`/annualPlanTmp/saveAnnualPlanLess`, {
                    planType: 1,
                    buyType: this.buyType,
                    ...this.procurement,
                    assetMoney: this.procurement.assetMoney * 10000,
                    totalPrice:
                        this.procurement.assetNum *
                        this.procurement.assetMoney *
                        10000,
                    buyWhy: this.oneStep.buyWhy,
                    ...this.analyze,
                    benefitAnalysis: this.oneStep.benefitAnalysis,
                    temporary: this.$route.query.type === "0" ? 1 : 0
                })
                .then(({ data }) => {
                    this.$router.go(-1);
                    this.$Message.success("年度计划添加成功");
                })
                .finally(res => {
                    this.loading = false;
                });
        },
        //委员会表决数据提交
        postVote() {
            this.voteLoading = true;
            this.$axios
                .put(`/annualPlanTmp/updateAnnualPlanVote`, {
                    alId: this.$route.query.id,
                    userId: this.$store.state.user_in.id,
                    voteType: this.voteType,
                    voteNote: this.voteNote
                })
                .then(res => {
                    this.$Message.success("投票成功");
                    this.voteShow = false;
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.voteLoading = false;
                });
        }
    },
    computed: {
        PlanDetail() {
            return this.$store.state.PLAN_DETAIL.PlanDetail;
        },
        //投票列表
        committeeShow() {
            return (
                this.$parent.stepNumber === 2 &&
                this.PlanDetail &&
                this.PlanDetail.approveType === 4 &&
                this.ListShow
            );
        },
        buttonShow() {
            return (
                this.limits &&
                (!this.PlanDetail || this.PlanDetail.approveType !== 1)
            );
        }
    },
    watch: {
        PlanDetail: {
            handler(data) {
                if (!data) return;
                let {
                    applicantName,
                    sectionName,
                    sectionPhone,
                    applyTime,
                    buyWhy,
                    planType,
                    benefitAnalysis,
                    assetName,
                    assetNum,
                    assetMoney,
                    importation,
                    capitalSource,
                    annualPlanVote,
                    buyType
                } = data;
                this.officeData = {
                    applicantName,
                    sectionName,
                    sectionPhone
                };
                this.buyType = null;
                this.$nextTick(() => {
                    this.buyType = buyType;
                });
                //列表赋值
                this.ListData = annualPlanVote;
                //日期处理
                applyTime !== null
                    ? (this.applyTime = applyTime.split(" ")[0])
                    : "";
                this.oneStep = { buyWhy, benefitAnalysis, applyTime };
                this.planType = planType;
                this.benefitAnalysis = benefitAnalysis;

                this.procurement = {
                    assetName,
                    assetNum,
                    assetMoney: assetMoney / 10000,
                    importation
                };
                // if (typeof annualPlanLess === "object" && annualPlanLess !== null) {
                //   for (var key in annualPlanLess) {
                //     if (
                //       key !== "durableYears" &&
                //       key !== "recycle" &&
                //       key !== "surplus"
                //     ) {
                //       if (
                //         annualPlanLess[key] !== null &&
                //         annualPlanLess[key] !== ""
                //       ) {
                //         annualPlanLess[key] = annualPlanLess[key] / 10000;
                //       }
                //     }
                //   }
                // } else {
                //   annualPlanLess = {};
                // }

                this.analyze = data;
                if (annualPlanVote instanceof Array) {
                    temp = -1;
                    let temp = annualPlanVote.findIndex(v => {
                        if (typeof v === "object" && v !== null) {
                            return (
                                v.userId === this.$store.state.user_in.id &&
                                v.voteType !== 0
                            );
                        }
                    });
                    temp !== -1
                        ? (this.btnShow = true)
                        : (this.btnShow = false);
                    //判断当用户用户有权限显示列表，没有权限投票之后显示列表
                    if (
                        this.btnShow ||
                        this.ViewLimit("annual:statistical") ||
                        this.$store.state.user_in.roles[0].srName === "CHIEF" ||
                        this.ViewLimit("annual:upvote")
                    ) {
                        this.ListShow = true;
                    } else {
                        this.ListShow = false;
                    }
                } else {
                    this.btnShow = false;
                }
            },
            immediate: true
        }
    }
};
</script>
<style lang="less" scoped>
@import "../common/base.less";
.one-step {
    padding: 10px 20px;
    font-size: 14px;
    /deep/ .one-step-block {
        margin-bottom: 30px;
        // .ivu-radio-wrapper-disabled {
        //     > span:nth-of-type(1) {
        //         display: none;
        //     }
        // }
        .procurement {
            width: 100%;
            textarea {
                width: 100%;
                height: 100px;
                padding: 10px;
                color: #666666;
                font-size: 14px;
            }
        }
    }
    /deep/.step-type {
        margin: 10px 0;
        margin-top: 0;
        p {
            padding-bottom: 10px;
        }
    }
}
/deep/.vote-modal {
    .result {
        margin-bottom: 10px;
        > div:nth-of-type(1) {
            margin-bottom: 10px;
        }
    }
}
.radio-group {
    .title {
        font-size: 14px;
    }
}
/deep/.vote-radio {
    .ivu-radio-wrapper {
        font-size: 14px;
    }
}
</style>


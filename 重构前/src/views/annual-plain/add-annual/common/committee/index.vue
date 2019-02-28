<template>
    <div v-if="showList">
        <div class="detail-title" @click="show" v-if="!detail">
            <div class="title-name">
                委员会表决
            </div>
            <div class="title-info">
                <div class="info-block">

                    <span @click.stop="filterData(1)">
                        通过
                        <span class="title-number">
                            {{voteResult.agree}}
                        </span>
                    </span>
                    <span @click.stop="filterData(2)">
                        未通过
                        <span class="title-number">
                            {{voteResult.reject}}
                        </span>
                    </span>
                    <span @click.stop="filterData(0)">
                        未表态
                        <span class="title-number">
                            {{voteResult.waiver}}
                        </span>
                    </span>
                    <span @click.stop="filterData(3)">
                        全部
                        <span class="title-number">
                            {{voteResult.waiver-0+(voteResult.reject-0)+(voteResult.agree-0)}}
                        </span>
                    </span>
                </div>
                <span class="detail-icon">
                    <img :src="put?require('../../../../image/open.png'):require('../../../../image/close.png')" alt="" :class="toggle?judge?'rotateup':'rotateIn':''">
                </span>
            </div>
        </div>
        <div class="detail-title preview" style="padding: 0;" v-else>
            <div class="title-name">
                委员会表决
            </div>
            <div class="title-info">
                <div class="info-block">

                    <span @click.stop="filterData(1)">
                        通过
                        <span class="title-number">
                            {{voteResult.agree}}
                        </span>
                    </span>
                    <span @click.stop="filterData(2)">
                        未通过
                        <span class="title-number">
                            {{voteResult.reject}}
                        </span>
                    </span>
                    <span @click.stop="filterData(0)">
                        未表态
                        <span class="title-number">
                            {{voteResult.waiver}}
                        </span>
                    </span>
                    <span @click.stop="filterData(3)">
                        全部
                        <span class="title-number">
                            {{voteResult.waiver-0+(voteResult.reject-0)+(voteResult.agree-0)}}
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div class="detail-table" :style='put?{display:"none"}:""'>
            <div class="table-pie">
                <div style="height:600px;max-height:600px;overflow:auto;width:70%" class="table-box">
                    <div>
                        <table width="100%" border="1">
                            <tr>
                                <th>表决人</th>
                                <th>表决结果</th>
                                <th style="with:40%">表决意见</th>
                                <th v-if="voteTr">更正</th>
                            </tr>
                            <tr v-for="(item,i) in tempData" :key='i' v-if="tempData.length>0">
                                <td :style="$store.state.user_in.roles[0].srName==='CHIEF'||$store.state.user_in.id===item.userId||ViewLimit('annual:upvote')?'':'color:#f2740c'">{{$store.state.user_in.roles[0].srName==='CHIEF'||ViewLimit('annual:upvote')?item.userName:$store.state.user_in.id===item.userId?item.userName:'***'}}</td>
                                <td :style="item.voteType===1?'color:#0c8399':item.voteType===2?'color: #e7485a':'color:#999999'">{{item.voteType===1?'通过':item.voteType===2?"未通过":item.voteType===0?'未表决':""}}</td>
                                <td class="omit" :title="item.voteNote">{{item.voteNote}}</td>
                                <td v-if="voteTr">
                                    <a href="javascript:;" @click="change(item)" v-if="item.voteType!==0">修改</a>
                                </td>
                            </tr>
                            <tr v-else>
                                <td>暂无数据</td>
                            </tr>
                        </table>
                        <div class="page">
                            <Page :total="page.total" :current.sync="page.current" :page-size='10'></Page>
                        </div>
                    </div>
                </div>
                <div class='vote-pie' ref='vote-pie'>
                    <kld-echarts  ref="kldpie" :option='pieOpt' auto-resize></kld-echarts>
                </div>
            </div>

            <!-- <div class="detail-radio" v-if='step-0>=5&&($route.name==="add-annual"||$route.name==="detail-annual")'>
        <div class="radio-title">
          结论性表决意见：
          <span style="color:#020e0f">{{step==="5"?'拒绝':step-0>5?'同意':''}}</span>
        </div>

      </div> -->
            <div v-if="voteShow">
                <votes :data='AllData' style='padding:0'></votes>
            </div>
        </div>

        <Modal v-model="AmendShow" title="修改委员会表决意见" class-name='vote-modal'>
            <div>
                <div>
                    <div style="padding:0 0 8px 0">
                        统计表决结果：
                    </div>
                    <RadioGroup v-model="oldData.voteType">
                        <Radio :label='1'>
                            <span>通过</span>
                        </Radio>
                        <Radio :label='2'>
                            <span>不通过</span>
                        </Radio>
                        <!-- <Radio :label='0'><span>未表决</span></Radio> -->
                    </RadioGroup>
                </div>
                <div>
                    <span class="modal-title">表决意见</span>
                    <Input v-model="oldData.voteNote" :rows="4" type="textarea" placeholder="请修改表决意见"></Input>
                </div>
            </div>
            <div slot="footer">
                <Button class="ivu-btn ivu-btn-text ivu-btn-large" @click="AmendShow=false">取消</Button>
                <Button class='kld-btn' @click="ChangeResult">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import votes from "../../../add-annual-fifty/common/finally-resolve/index";
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";

export default {
    name: "committee",
    props: {
        detail: {
            default: false
        },
        put: {
            default: false
        },
        value: {
            default: Number
        },
        ListData: {
            default() {
                return [];
            }
        },
        AllData: {
            default() {
                return null;
            }
        },
        resolveShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            datalist: [], //数据列表
            judge: true,
            toggle: false,
            voteResult: {
                agree: 0,
                reject: 0,
                waiver: 0
            },
            AmendShow: false,
            result: 0,
            oldData: {},
            voteNote: "",
            newData: {},
            page: {
                total: 10,
                current: 1
            },
            tempData: [],
            centerData: [],
            showList: true
        };
    },
    created() {
        this.getVote();
    },
    methods: {
        show() {
            this.toggle = true;
            $(".detail-table").slideToggle();

            this.$refs["kldpie"].nativeResize();
            this.judge = !this.judge;
        },
        getVote() {
            this.$axios
                .get(`/annualPlanTmp/getApproveResult/${this.$route.query.id}`)
                .then(({ data }) => {
                    data.map(v => {
                        if (typeof v === "object" && v !== null) {
                            if (v.voteType === 1) {
                                this.voteResult["agree"] = v.count;
                            } else if (v.voteType === 2) {
                                this.voteResult["reject"] = v.count;
                            }
                            if (v.voteType === 0) {
                                this.voteResult["waiver"] = v.count;
                            }
                        }
                    });
                });
        },
        ChangeResult() {
            this.$axios
                .put(`annualPlanTmp/updateOldAnnualPlanVote`, {
                    alId: this.$route.query.id,
                    userId: this.oldData.userId,
                    voteType: this.oldData.voteType,
                    voteNote: this.oldData.voteNote
                })
                .then(res => {
                    this.AmendShow = false;
                    this.newData.voteType = this.oldData.voteType;
                    this.newData.voteNote = this.oldData.voteNote;
                    this.$Message.success("修改成功");
                    this.voteResult = {
                        agree: 0,
                        reject: 0,
                        waiver: 0
                    };
                    this.getVote();
                });
        },
        change(item) {
            this.AmendShow = true;
            this.newData = item;
            this.oldData = JSON.parse(JSON.stringify(item));
        },
        //数据删选
        filterData(value) {
            console.log(this.ListData);
            if (value === 3) {
                this.centerData = this.ListData;
                this.tempData = this.centerData.slice(0, 10);
            } else {
                this.centerData = this.ListData.filter(
                    ({ voteType }) => voteType === value
                );
                this.tempData = this.centerData.slice(0, 10);
            }
            this.page.current = 1;
            this.page.total = this.centerData.length;
        },
        ListShow() {
            if (this.ListData instanceof Array) {
                temp = -1;
                let temp = this.ListData.findIndex(v => {
                    if (
                        typeof v === "object" &&
                        v !== null &&
                        v !== undefined
                    ) {
                        return (
                            v.userId === this.$store.state.user_in.id &&
                            v.voteType !== 0
                        );
                    }
                });
                let btnShow = true;
                temp !== -1 ? (btnShow = true) : (btnShow = false);
                //判断当用户用户有权限显示列表，没有权限投票之后显示列表
                if (
                    btnShow ||
                    this.ViewLimit("annual:statistical") ||
                    this.$store.state.user_in.roles[0].srName === "CHIEF" ||
                    this.ViewLimit("annual:upvote")
                ) {
                    this.showList = true;
                } else {
                    this.showList = false;
                }
            } else {
                this.showList = false;
            }
        }
    },
    computed: {
        voteType: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        },
        pieOpt() {
            return {
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: ["通过", "未通过", "未表决"]
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color: ["#0c8399", "#e7485a", "#d3dee5"],
                series: [
                    {
                        name: "表决结果",
                        type: "pie",
                        radius: "55%",
                        center: ["50%", "60%"],
                        data: [
                            { value: this.voteResult.agree, name: "通过" },
                            { value: this.voteResult.reject, name: "未通过" },
                            { value: this.voteResult.waiver, name: "未表决" }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            };
        },

        voteShow() {
            const tpName = this.$route.name;
            return (
                (tpName === "add-annual" ||
                    tpName === "fifty-annual-details") &&
                (this.PlanDetail.approveType >= 6 || this.resolveShow)
            );
        },
        PlanDetail() {
            return (
                this.$store.state.PLAN_DETAIL.PlanDetail || this.AllData || {}
            );
        },
        voteTr() {
            const step = this.PlanDetail.approveType;

            return (
                this.ViewLimit("annual:upvote") &&
                (step === 4 || step === 5 || (step === 6 && step !== 2))
            );
        }
    },
    watch: {
        "page.current": {
            handler(value) {
                this.tempData = this.centerData.slice(
                    (value - 1) * 10,
                    (value - 1) * 10 + 10
                );
            }
        },
        ListData: {
            handler(value) {
                this.page.total = this.ListData.length;
                this.centerData = value;
                this.tempData = value.slice(
                    (this.page.current - 1) * 10,
                    (this.page.current - 1) * 10 + 10
                );
                this.ListShow();
            },
            immediate: true
        }
    },
    components: {
        votes,
        kldEcharts
    }
    // watch: {
    //     voteType(value) {
    //         this.$emit("input", value);
    //     }
    // }
};
</script>
<style lang="less" scoped>
@import url("../../common/base.less");
.detail-title {
    cursor: pointer;
    left: 0;
    height: 60px;
    background-color: #ededed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    color: #020e0f;
    font-size: 16px;
    &:hover {
        background: #f2f2f2;
    }
    .title-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-block {
            margin-right: 20px;
            margin-bottom: 4px;
            > span {
                color: #666666;
                font-size: 14px;
                padding: 0 10px;
                display: inline-block;
                line-height: 50px;
            }
            .title-number {
                padding: 0px 8px;
                border-right: 1px solid #d0d0d0;
            }
            span:nth-of-type(1) .title-number {
                color: #0c8399;
            }
            span:nth-of-type(2) .title-number {
                color: #e7485a;
            }
            span:nth-of-type(3) .title-number {
                color: #999999;
            }
            span:nth-of-type(4) .title-number {
                color: #999999;
                border-right: none;
            }
        }
    }
}
.detail-icon {
    display: inline-block;
    width: 17px;
    img {
        width: 100%;
    }
}
.detail-table {
    padding: 20px;

    .table-box {
        padding: 20px 25px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
    }
    table {
        border: none;
        border-collapse: collapse;
        table-layout: fixed;
        tr {
            border-bottom: 1px solid #e2e2e2;
            padding: 15px 0;
        }

        th,
        td {
            border: none;
            padding: 10px 20px;
            text-align: left;
            color: #666666;
            font-size: 14px;
        }
        th {
            font-weight: 600;
        }
    }
    .detail-radio {
        padding: 20px 0;
        background: #fafafa;
        border: none;
        display: flex;
        .radio-title {
            color: #f2740c;
            font-size: 14px;
            margin-right: 20px;
        }
    }
}
.preview {
    background: transparent;
    border-bottom: 1px solid #e2e2e2;
    &:hover {
        background: transparent;
    }
    .title-name {
        color: #f2740c;
        font-size: 15px;
    }
    & + .detail-table {
        padding: 20px 0px;
        padding-bottom: 0;
    }
}
.modal-title {
    display: inline-block;
    padding: 10px 0;
}
.page {
    padding: 10px 0;
    text-align: center;
}
.table-pie {
    display: flex;

    .vote-pie {
        height: 100%;
        width: 30%;
        height: 400px;
        padding-left: 10px;
    }
}
</style>

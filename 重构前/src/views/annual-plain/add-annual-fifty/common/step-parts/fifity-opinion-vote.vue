<template>
    <kld-collapse :open='open' :details="details">
        <span slot="title">
            委员会表决
        </span>
        <div slot="extra-header" class="fifty-voting-statistics">
            <opion-voting-statistics></opion-voting-statistics>
        </div>
        <!--<div class='vote-table-wrap vote-table-wrap-header'>-->
        <!--<table class="vote-table">-->
        <!--<thead>-->
        <!--<tr>-->
        <!--<th>表决人</th>-->
        <!--<th>表决结果</th>-->
        <!--<th>意见表述</th>-->
        <!--<th v-if="modifyLimit">更正</th>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tbody>-->
        <!--<tr v-for="(v,i) of annualPlanVote" :key="i">-->
        <!--<td>{{v.userName}}</td>-->
        <!--<td v-if="v.voteType===1" class="vote-td-agree">通过</td>-->
        <!--<td v-if="v.voteType===2" class="vote-td-disAgree">未通过</td>-->
        <!--<td v-if="v.voteType===0" class="vote-td-discard">未表决</td>-->
        <!--<td class="textEllipsis">{{v.voteNote}}</td>-->
        <!--</tr>-->
        <!--<tr v-if="!annualPlanVote.length">-->
        <!--<td colspan="3" style="text-align:center;">暂无人员投票</td>-->
        <!--</tr>-->
        <!--</tbody> -->
        <!--</table>-->
        <!--</div>-->
        <div class='vote-table-wrap vote-table-wrap-body'>
            <table class="vote-table">
                <thead>
                    <tr>
                        <th>表决人</th>
                        <th>表决结果</th>
                        <th>意见表述</th>
                        <th v-if="showModifyBtn && modifyLimit">更正</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(v,i) of PlanVoteListe" :key="i">
                        <td>{{v.userName}}</td>
                        <td v-if="v.voteType===1" class="vote-td-agree">通过</td>
                        <td v-if="v.voteType===2" class="vote-td-disAgree">未通过</td>
                        <td v-if="v.voteType===0" class="vote-td-discard">未表决</td>
                        <td class="textEllipsis">{{v.voteNote}}</td>
                        <td v-if="showModifyBtn && modifyLimit">
                            <a v-if="v.voteType !== 0" @click="modifyModalShow(v)" href="javascript:">修改</a>
                        </td>
                    </tr>
                    <tr v-if="!PlanVoteListe.length">
                        <td colspan="3" style="text-align:center;">暂无人员投票</td>
                    </tr>
                </tbody>
            </table>
            <div style="text-align:center;padding:15px 0;">
                <Page :total='page.total' :current.sync='page.current' :page-size='10'></Page>
            </div>
        </div>
        <Modal v-model="modifyOpinionModal.show" title="修改委员会表决意见" width="700">
            <Form label-position="top" :model="modifyOpinionModal.data">
                <FormItem label="表决结果：" prop="voteType">
                    <RadioGroup v-model="modifyOpinionModal.data.voteType">
                        <Radio :label="1">通过</Radio>
                        <Radio :label="2">未通过</Radio>
                        <!--<Radio :label="3">未表决</Radio>-->
                    </RadioGroup>
                </FormItem>
                <FormItem style="margin-top: 20px;" label="意见表述：" prop="voteNote">
                    <i-input v-model="modifyOpinionModal.data.voteNote" type="textarea" :rows="4"></i-input>
                </FormItem>
            </Form>
            <template slot="footer">
                <Button @click="modifyOpinionModal.show = false" class="kld-btn-default">取消</Button>
                <Button :loading="modifyOpinionModal.loading" @click="modifyModalConfirm" class="kld-btn">确认</Button>
            </template>
        </Modal>
    </kld-collapse>
</template>

<script>
import opionVotingStatistics from "../opion-voting-statistics/index";
import kldCollapse from "../kld-collapse/index";
import testLimit from "@common/test-limit";
export default {
  name: "fifity-opinion-vote",
  components: { kldCollapse, opionVotingStatistics },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    details: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modifyLimit: testLimit("annual:upvote"),
      modifyOpinionModal: {
        show: false,
        loading: false,
        data: {
          alId: "",
          userId: "",
          voteType: "",
          voteNote: ""
        }
      },
      page: {
        total: 10,
        current: 1
      },
      PlanVoteListe: []
    };
  },
  computed: {
    allDetails() {
      return this.$store.state.fifty.details;
    },
    annualPlanVotePlanVote() {
      if (this.allDetails && this.allDetails.annualPlanVote) {
        return this.allDetails.annualPlanVote;
      } else {
        return [];
      }
    },
    wrapComponent() {
      return this.$parent.$parent;
    },
    showModifyBtn() {
      const step = this.$route.query.step;
      return step !== "6" && step !== "7";
    }
  },
  watch: {
    "page.current": {
      handler(value) {
        this.PlanVoteListe = this.annualPlanVotePlanVote.slice(
          (value - 1) * 10,
          (value - 1) * 10 + 10
        );
      }
    },
    annualPlanVotePlanVote: {
      handler(value) {
        this.page.total = value.length;
        this.PlanVoteListe = value.slice(0, 10);
      },
      immediate: true
    }
  },
  methods: {
    modifyModalShow(v) {
      this.modifyOpinionModal.show = true;

      const data = this.modifyOpinionModal.data;
      data.alId = v.alId;
      data.userId = v.userId;
      data.voteType = v.voteType;
      data.voteNote = v.voteNote;
    },
    async modifyModalConfirm() {
      try {
        this.modifyOpinionModal.loading = true;
        await this.$axios.put(
          "/annualPlanTmp/updateOldAnnualPlanVote",
          this.modifyOpinionModal.data
        );
        this.$Message.success("修改成功");
        this.modifyOpinionModal.show = false;
        this.wrapComponent.getInfo();
      } finally {
        this.modifyOpinionModal.loading = false;
      }
    }
  }
};
</script>


<style lang="less" scoped>
.fifty-voting-statistics {
  position: absolute;
  right: 50px;
}

.vote-table-wrap {
  width: 100%;
  // margin-top:20px;
  // padding:10px 15px;
  // border:solid 1px rgba(2, 31, 57, 0.1);
  background-color: #fff;
  // border-radius: 5px;
  .vote-table {
    width: 100%;
    table-layout: fixed;
    font-size: 14px;
    border-collapse: collapse;
    border-radius: 3px;
    thead {
      th {
        text-align: left;
        &:nth-child(3) {
          width: 50%;
        }
      }
    }
    tbody {
      td {
        text-align: left;
        &:nth-child(3) {
          width: 50%;
        }
      }
    }
    th,
    td {
      border-bottom: solid 1px rgba(2, 31, 57, 0.1);
      height: 50px;
    }
    .vote-td-agree {
      color: #0c8399;
    }
    .vote-td-disAgree {
      color: #e7485a;
    }
    .vote-td-discard {
      color: #aaa;
    }
  }
  &-header {
    padding: 10px 15px 0;
    border-radius: 5px 5px 0 0;
  }
  &-body {
    padding: 0px 15px 10px;
    border-radius: 0px 0px 5px 5px;
    height: 500px;
    overflow: auto;
  }
}
</style>


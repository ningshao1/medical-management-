 <template>
  <div>
    <div class="content">
      <div class="nav-title">
        <div class="nav-line"></div>
        <p>
          <span>
            <router-link to="/index/home"
                         style=" color: #999 ">首页</router-link>
          </span>
          <span>
            <router-link to="/annualPlan"
                         style=" color: #999;cursor:pointer ">>年度计划</router-link>
          </span>
          <span style="color: #333333;cursor:pointer">
            <i style="color:#01b0c7">> </i>新增计划</span>
        </p>
      </div>
      <div class="nav-sub">
        <h2><img src="../../../img/addplan.svg"
               alt=""
               style="width:20px;margin-right:5px;cursor: pointer;vertical-align: middle;">新增计划</h2>

      </div>

      <div class="line"></div>
    </div>
    <div class='content'>
      <kld-step :data='stepData'
                class="add-plan-step"
                :current='currentStep===2?3:currentStep'>
      </kld-step>
      <div>
        <kld-type :title='"采购类型 *"'></kld-type>
        <RadioGroup size="large"
                    v-model="formData.ar_type">
          <Radio :label="0"
                 :disabled='currentStep>0'>
            <span>0-10万元（不含10万元）</span>
          </Radio>
          <Radio :label="1"
                 :disabled='currentStep>0'>
            <span>10万元-50万元（不含50万元）</span>
          </Radio>
          <Radio :label="2"
                 :disabled='currentStep>0'>
            <span>50万元以上</span>
          </Radio>
        </RadioGroup>
        <kld-type :title='"基础信息"'></kld-type>
        <i-row :gutter='20'>
          <i-col :span='8'>
            <label class="add-plan-label">申请科室：</label>
            <i-input class="kld-input"
                     v-model="formData.osName"
                     disabled>

            </i-input>
          </i-col>
          <i-col :span='8'
                 v-if="currentStep>0">
            <label class="add-plan-label">申请时间：</label>
            <i-input class="kld-input"
                     v-model="formData.ar_time"
                     disabled>

            </i-input>
          </i-col>
          <i-col :span='8'
                 :offset="currentStep>0?0:8">
            <label class="add-plan-label">科室电话：</label>
            <i-input class="kld-input"
                     v-model="formData.osPhone"
                     disabled>

            </i-input>
          </i-col>
        </i-row>
        <kld-type :title='"计划采购信息"'></kld-type>
        <add-table v-model="formData"
                   :ar_Type='formData.ar_type'
                   ref='add-table'
                   v-if="currentStep===0">
        </add-table>
        <table-detail v-else
                      :data='formData.annualplanPurchases'
                      :currentStep='currentStep'
                      ref='table-detail'
                      :total='total'
                      @checkbox='selectData=$event'></table-detail>
        <kld-type :title='"采购原因*"'></kld-type>
        <i-input type='textarea'
                 :rows='4'
                 placeholder='请输入采购原因'
                 :maxlength='2000'
                 v-model="formData.ar_why"
                 :disabled='currentStep>0'>
        </i-input>
        <kld-type :title='"效益预估*"'></kld-type>
        <i-input type='textarea'
                 :rows='4'
                 placeholder='请输入效益预估'
                 :maxlength='2000'
                 v-model="formData.ar_benefits"
                 :disabled='currentStep>0'>
        </i-input>
        <kld-type :title='"审批意见*"'
                  v-if="currentStep>0"></kld-type>
        <i-input type='textarea'
                 :rows='4'
                 placeholder='请输入效益预估'
                 :maxlength='2000'
                 v-model="ar_opinion"
                 :disabled='currentStep>1'
                 v-if="currentStep>0">
        </i-input>
      </div>
      <div class="btn-shadow">
        <Button class="kld-btn"
                @click="cancel">取消</Button>
        <Button class="kld-btn"
                @click="submit"
                :loading='postLoading'
                v-if="currentStep<2">确定</Button>
      </div>
    </div>
  </div>
</template>

<script>
const addTable = () => import("./components/add-table.vue");
const tableDetail = () => import("./components/table-detail.vue");
import step from "@common/step/index";
import type from "@common/kld-type/index";
import confirm from "@common/kld-confirm/index";
import moment from "moment";
export default {
  data() {
    return {
      stepData: ["提交申请 ", "讨论审批", "结果公示"],
      currentStep: 0,
      postLoading: false,
      formData: {
        osName: this.$store.state.user_in.osName,
        osPhone: this.$store.state.user_in.osPhone,
        ar_type: 0,
        annualplanPurchases: [
          {
            ap_name: null,
            ap_number: null,
            ap_money: null,
            ap_brand: [],
            ap_note: null
          }
        ],
        os_id: this.$store.state.user_in.groupId,
        ar_time: moment().format("YYYY-MM-DD hh:mm:ss"),
        ar_why: "",
        ar_benefits: ""
      },
      total: 10,
      selectData: [],
      taskId: "",
      ar_opinion: null //审批意见
    };
  },

  created() {
    if (this.isTrue(this.$route.params.id)) {
      this.getDetail();
    }
  },
  watch: {},
  computed: {
    userInfo() {
      return this.$store.state.user_in;
    }
  },
  methods: {
    cancel() {
      confirm({
        title: "提示",
        content: "确定返回？",
        maskClosable: false, //是否允许点击遮罩关闭 默认:false
        okText: "确定", //确认按钮文本  默认:确认
        cancelText: "取消", //确认取消文本  默认:取消
        ok: () => {
          this.$router.go(-1);
        }
      });
    },
    getDetail() {
      this.$axios
        .post(`annualplan/getAnnualplan/${this.$route.params.id}`, {
          limit: 10,
          offset: 0,
          params: {}
        })
        .then(({ data }) => {
          for (const i in this.formData) {
            if (data[i] !== undefined) this.formData[i] = data[i];
          }
          this.currentStep = data["ar_plan"];
          this.ar_opinion = data.ar_opinion;
          this.taskId = data.taskId;
          this.total = data.count;
        });
    },
    submit() {
      confirm({
        title: "提示",
        content: "确定提交吗？",
        maskClosable: false, //是否允许点击遮罩关闭 默认:false
        okText: "确定", //确认按钮文本  默认:确认
        cancelText: "取消", //确认取消文本  默认:取消
        ok: () => {
          if (this.currentStep === 0) {
            this.addPost();
          } else if (this.currentStep === 1) {
            this.examinePost();
          }
        }
      });
    },
    //添加提交
    addPost() {
      this.$refs["add-table"].submit().then(() => {
        if (!this.isTrue(this.formData.ar_why)) {
          this.$Message.warning("采购原因为必填项");
          return;
        }
        if (!this.isTrue(this.formData.ar_benefits)) {
          this.$Message.warning("效益预估为必填项");
          return;
        }
        this.postLoading = true;
        this.axios
          .post(`/annualplan/saveAnnualplan`, {
            ...this.addPostDataHandler(this.formData)
          })

          .then(res => {
            this.$Message.success("新增成功");
            this.$router.go(-1);
          })
          .finally(() => {
            this.postLoading = false;
          });
      });
    },
    //数据处理
    addPostDataHandler(obj) {
      const newObj = JSON.parse(JSON.stringify(obj));
      newObj["department"] = this.formData.osName;
      delete newObj["osName"];
      delete newObj["osPhone"];
      newObj["annualplanPurchases"].map(v => {
        v["ap_brand"] = v["ap_brand"].join(",");
      });
      return newObj;
    },
    //审批提交
    examinePost() {
      if (this.ar_opinion === null || this.ar_opinion === "") {
        this.$Message.warning("审批意见为必填项");
        return;
      }
      this.postLoading = true;
      this.$axios
        .post(`annualplan/updateAnnualplan`, {
          annualplanPurchases: this.selectData,
          id: this.$route.params.id,
          ar_opinion: this.ar_opinion
        })
        // .then(() => {
        //   this.getsub();
        // })
        .finally(() => {
          this.postLoading = false;
        });
    },
    getsub() {
      this.$axios
        .post(`activiti/complete/${this.taskId}/${this.$route.params.id}`, {})
        .then(res => {
          this.$Message.success("提交成功");
          this.$router.go(-1);
        });
    },

    isTrue(val = null) {
      return val !== null && val !== "";
    }
  },
  components: {
    [step.name]: step,
    [type.name]: type,
    "add-table": addTable,
    "table-detail": tableDetail
  }
};
</script>

<style scoped lang="less">
// @import url("./addPlan");
.content {
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
  .nav-title {
    margin-top: 12px;
    position: relative;
    .nav-line {
      height: 16px;
      width: 4px;
      background-color: #76bdc1;
      display: inline-block;
    }
    > p {
      margin-left: 6px;
      display: inline-block;
      font-size: 12px;
      color: #999999;
      position: relative;
      top: -3px;
    }
  }
  .nav-sub {
    display: flex;
    justify-content: space-between;
    h2 {
      font-weight: normal;
      color: #333333;
      font-size: 16px;
      margin-top: 8px;
    }
    .nav-btn {
      width: 120px;
      height: 45px;
      background-color: #22a1b9;
      border: solid 1px #0c8399;
    }
  }
}
/deep/.add-plan-step {
  .c_bar {
    border: 1px solid rgba(2, 31, 57, 0.1);
    background: #fafafa;
  }
}
.add-plan-label {
  font-size: 14px;
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #495060;
  line-height: 1;
  padding: 10px 12px 10px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.btn-shadow {
  height: 60px;
  margin-top: 10px;
  background-color: rgba(210, 210, 210, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  > button {
    margin: 0 8px;
  }
}
</style>
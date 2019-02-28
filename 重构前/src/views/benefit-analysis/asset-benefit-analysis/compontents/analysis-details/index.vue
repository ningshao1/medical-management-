<template>
    <div class="analysis-details-wrap">
        <i-row :gutter='20' class="search-bar">
            <i-col span='7'>
                <!-- <DatePicker :clearable='false' type="daterange" class="kld-date-picker" v-model="searchInput.date" :options="extraOpt" placeholder="检查日期时间段选择"></DatePicker> -->
                <DatePicker split-panels :clearable='false' type="daterange" class="kld-date-picker" v-model="dateRange" :options="extraOpt" placeholder="检查日期时间段选择"></DatePicker>
            </i-col>
            <i-col span='7'>
                <Select class="kld-select" v-model="searchInput.gender" placeholder='性别'>
                    <Option :value="''">全部</Option>
                    <Option :value="'男'">男</Option>
                    <Option :value="'女'">女</Option>
                </Select>
            </i-col>
            <i-col span='7'>
                <kld-input-number :number='true' v-model="searchInput.startAge" placeholder="年龄选择" style="width:45%"></kld-input-number>
                    至
                <kld-input-number :number='true' v-model="searchInput.endAge" placeholder="年龄选择" style="width:45%"></kld-input-number>
            </i-col>
            <i-col span='3'>
                <Button class="kld-btn-default" @click="reset">重置</Button>
            </i-col>
        </i-row>
        <div class="list-wrap">
            <Table :columns='columns' :data='listData' :loading='loading'></Table>
            <kld-page :total='pageInfo.total' :pageSize='pageInfo.limit' @on-change="getList" style='margin-top:15px;' :current="pageInfo.currentPage"></kld-page>
        </div>

    </div>
</template>

<script>
import kldPage from "@common/page/page.vue";
import kldInputNumber from "@common/kld-input-number";
import kldLoading from "@common/loading/loading.vue";
export default {
  name: "analysis-details",
  components: { kldPage, kldInputNumber, kldLoading },
  data() {
    let currentDate = new Date(new Date() - 60*60*24*1000 );
    return {
      searchInput: {
        gender: "",
        startAge: "",
        endAge: ""
      },
      extraOpt:{
        disabledDate (date) {
          
            return date - currentDate>=0;
        }
      },
      pageInfo: {
        currentPage: 1,
        total: 0,
        limit: 20
      },
      columns: [
        {
          title: "检查日期",
          key: "checkDate",
          width: 150
        },
        {
          title: "病人类型",
          key: "type",
          width: 100
        },
        {
          title: "病人姓名",
          key: "name",
          width: 150
        },
        {
          title: "性别",
          key: "sex",
          width: 80
        },
        {
          title: "年龄",
          key: "age",
          width: 80
        },
        {
          title: "身份证号码",
          key: "nationalId",
          width: 200
        },
        {
          title: "就诊/住院ID",
          key: "id",
          width: 150
        },
        {
          title: "检查项目名称",
          key: "checkItemName"
        },
        {
          title: "诊断结果",
          key: "diagnoseResult",
          width: 100,
          render: (h, { row, column, index }) => {
            let temp=row[column.key]
            return h("span",{
                style:{
                  color:temp==='阳性'?'green':"red"
                }
            }, temp);
          }
        }
      ],
      listData: [],
      timer: null,
      loading: false,
      reseted:false,//是否由点击重置按钮触发
      dateCounts:null,
    };
  },
  props:{
    activePane:{},
    timeChangeCount:{},
  },
  watch: {
    searchInput: {
      handler(ND) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if(this.reseted){//由点击重置按钮触发则取消请求
            this.reseted=false;
            return;
          }
          if (
            this.isNumber(ND.startAge) &&
            this.isNumber(ND.endAge) &&
            ND.startAge > ND.endAge
          ) {
            this.$Message.warning("请填写正确的年龄范围！");
            return;
          }
          this.getListByOther(this.activePane);
        }, 100);
      },
      deep: true
    },
    // activePane(paneIndex){//判断当前页  是否与上次时间相同
    //   if(paneIndex===1&&this.dateCounts!==this.timeChangeCount){

    //       this.getList();
    //   }
    // }
  },
  computed:{
    dateRange:{
      get(){
        return this.$store.state.dateRange
      },
      set(dateArray){
        this.$store.commit("setDateRange", dateArray);
        this.getListByOther(this.activePane);
      }
    }
  },
  created() {
    
    this.getOriginData();//TODO接口可用后打开
  },
  methods: {
    getOriginData() {

        this.getListByOther(this.activePane);
    },
    isNumber(num) {
      return num === +num;
    },
    getListByOther(paneIndex){
      // if(paneIndex===1){//当view视图在该tab页时触发
        this.$emit("timeChange");
        this.getList()
      // }
    },
    getList(page = 1) {
      this.currentPage = page;
      this.loading = true;
      this.$axios
        .post(`/cba/queryApplyInfoList`, {
          params:{

            assetId: this.$route.query.id,
            startDate: this.dateRange[0]
              ? this.$store.state.localeDate(this.dateRange[0])+' 00:00:00'
              : "",
            endDate: this.dateRange[1]
              ? this.$store.state.localeDate(this.dateRange[1])+' 23:59:59'
              : "",
            sex: this.searchInput.gender,
            startAge: this.searchInput.startAge || null,
            endAge: this.searchInput.endAge || null,
          },
          offset: this.pageInfo.limit * (this.currentPage - 1),
          limit: this.pageInfo.limit
        })
        .then(res => {
          this.pageInfo.total = res.data.recordsTotal;
          if (!res.data.recordsTotal) {
            this.listData = [];
            return;
          }
          this.listData = this.listDataFormat(res.data.data);
        })
        .finally(res => {
          this.loading = false;
          this.dateCounts=this.timeChangeCount;
        });
    },
    listDataFormat(list) {
      return list.map(v => {
        return {
          ...v,
          checkDate: v.checkDate
            ? this.$store.state.localeDate(+v.checkDate)
            : ""
        };
      });
    },
    reset() {
      this.$store.commit("resetDateRange");


      this.reseted=true;
      this.searchInput = {
        gender: "",
        startAge: "",
        endAge: ""
      };
    }
  }
};
</script>

<style lang="less" scoped>
.analysis-details-wrap {
  // min-height:500px;
    background-color: #fafafa;
  .search-bar {
    padding: 20px 30px;
  }
  .list-wrap {
    position: relative;
    /deep/.ivu-table-wrapper {
      margin-bottom: 20px;
      .ivu-table {
        th {
          background-color: #eaeaea;
          height: 54px;
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
}
</style>

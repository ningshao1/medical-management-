<template>
    <div class="fifty-report-apply" :style="styles">
        <ul class="single-results ">
            <li class="single-result">
            </li>
            <li class="single-result">
                <span class="single-title single-title-result">
                    医用仪器设备配置专家论证意见：*
                </span>
                <div class="result-radio" v-if="!details">
                    <RadioGroup v-model="allOption.unitExpertsType">
                        <Radio :label="1">同意</Radio>
                        <Radio :label="2">拒绝</Radio>
                    </RadioGroup>
                </div>
                <div class="result-radio" v-else>
                    <template v-if="allOption.unitExpertsType===1">
                        同意
                    </template>
                    <template v-else>
                        拒绝
                    </template>
                </div>
            </li>
            <li class="single-result" v-if="!details||allOption.departmentType">
                <span :class="unitExpertsType?'single-title single-title-result':'single-title'">
                    医用仪器设备配置相关部门意见：*
                </span>
                <div class="result-radio" v-if="!details">
                    <RadioGroup v-model="allOption.departmentType">
                        <Radio :disabled="!unitExpertsType" :label="1">同意</Radio>
                        <Radio :disabled="!unitExpertsType" :label="2">拒绝</Radio>
                    </RadioGroup>
                </div>
                <div class="result-radio" v-else>
                    <template v-if="allOption.departmentType===1">
                        同意
                    </template>
                    <template v-else>
                        拒绝
                    </template>
                </div>
            </li>
            <li class="single-result" v-if="checkpage&&(!details||allOption.unitExpertsType)">
                <span :class="(details||departmentType)?'single-title single-title-result':'single-title'">
                    职工大会已通报：*
                </span>
                <div class="result-radio" v-if="!details">
                    <RadioGroup v-model="allOption.workeType">
                        <Radio :disabled="!departmentType" :label="1">是</Radio>
                        <Radio :disabled="!departmentType" :label="2">否</Radio>
                    </RadioGroup>
                </div>
                <div class="result-radio" v-else>
                    <template v-if="allOption.workeType===1">
                        是
                    </template>
                    <template v-else>
                        否
                    </template>
                </div>
            </li>
        </ul>

        <div class="img-files">
            <p class="single-title-result">上传图片：</p>
            <c-upload v-if="!details" :fileList="allOption.photos"></c-upload>
            <image-view v-else :imgUrlList="allOption.photos||[]" :showStyle="'border:1px dashed #dddee1;background-color:#fff;'"></image-view>
            <!-- <div class="img-files-zindex" v-if="!(checkpage?workeType:departmentType)">

            </div> -->
        </div>

        <div class="single-result-finally" >
            <span :class="(checkpage?workeType:departmentType)||details?'single-title single-title-result':'single-title'">
                结论性表决意见：*
            </span>
            <div class="result-radio" v-if="!details">
                <RadioGroup v-model="allOption.approveType">
                    <Radio :disabled="!(checkpage?workeType:departmentType)" :label="6">是</Radio>
                    <Radio :disabled="!(checkpage?workeType:departmentType)" :label="7">否</Radio>
                </RadioGroup>
            </div>
            <div class="result-radio" v-else>
                <template v-if="allOption.approveType===6">
                    是
                </template>
                <template v-else>
                    否
                </template>
            </div>
        </div>

    </div>
</template>

<script>
import CUpload from "@common/C-Upload/C-upload";
import imageView from "@common/imageView/ImageView";
export default {
  name: "fifty-report-apply",
  components: { CUpload, imageView },
  data() {
    return {
      circuit: 2,
      allOption: {
        unitExpertsType: 0,
        departmentType: 0,
        workeType: 0,
        approveType: 0,
        photos: []
      }
    };
  },

  watch: {
    allOption: {
      handler(ND, OD) {
        // console.log(ND)
        let temp = false;
        Object.keys(this.allOption).forEach(v => {
          // console.log(v);
          if (temp && v !== "photos") {
            this.allOption[v] = 0;
          }
          if (this.allOption[v] === 2 && v !== "photos") {
            temp = true;
          }
        });
        // this.allOption.approveType=this.allOption.approveType||7

        this.$emit("complete", { ...this.allOption });
      },
      deep: true
    },
    reportApplyData: {
      handler(ND) {
        if (ND) {
          this.allOption = JSON.parse(JSON.stringify(ND));
        }
      },
      immediate: true
    }
  },
  computed: {
    checkpage() {
      return this.$route.query.type === "3";
    },
    unitExpertsType() {
      return this.allOption.unitExpertsType === 1;
    },
    departmentType() {
      return this.allOption.departmentType === 1;
    },
    workeType() {
      return this.allOption.workeType === 1;
    },
    approveType() {
      return this.allOption.workeType === 6;
    }
  },
  props: {
    styles: {
      type: [Object, String],
      default: ""
    },
    details: {
      type: Boolean,
      default: false
    },
    reportApplyData: {
      type: [Object, String],
      default: null
    }
  }
};
</script>

<style lang="less" scoped>
.fifty-report-apply {
  padding: 0 30px;

  .single-result-basic {
    display: flex;
    align-items: center;
    .result-radio {
      margin-left: 20px;
    }
    .single-title {
      font-size: 16px;
      color: #a9a8a9;
    }
    .single-title-result {
      font-size: 16px;
      color: #f2740c;
    }
  }
  .single-results {
    .single-result {
      margin: 20px 0;
      .single-result-basic;
    }
  }
  /deep/.result-radio {
    font-size: 16px;
    color: #020e0f;
    .ivu-radio-wrapper {
      font-size: 16px;
    }
  }
  .img-files {
    position: relative;
    .single-title {
      font-size: 14px;
      color: #a9a8a9;
    }
    .single-title-result {
      font-size: 14px;
      color: #020e0f;
    }
    // .img-files-zindex{
    //     width:100%;
    //     height: 100%;
    //     position: absolute;
    //     top:0;
    //     left: 0;
    // }
  }
  .single-result-finally {
    margin: 20px 0;
    .single-result-basic;
  }
}
</style>

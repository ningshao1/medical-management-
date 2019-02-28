<template>
  <div>
    <!-- 弹窗 -->
    <div class="tree_m">
      <Modal   @on-ok="ok"
         @on-cancel="cancel" v-model="msginfo.modal2" :title="msginfo.title" :class-name="`vertical-center-modal tree_tan four_tan t_tan ${msginfo.ClassNames}`" :okText='msginfo.okText' :transition-names="['transform: translateX(-100%)', 'fade']">
        <div class='content_t'>
          <img v-if="msginfo.src" style="width:80px;height:80px;" :src="msginfo.src" alt="">
          <div class="msg_c">{{msginfo.name}}</div>
        </div>
      </Modal>
    </div>
  </div>
</template>
<style>

</style>
<script>
export default {
    props: {
        msginfo: {
            default: {
                title: "确认接单",
                className: "tree_tan",
                okText: "确认验收",
                src: "",
                name: "是否确认接受此报修工单？",
                modal2: false,
                id: 1,
                ClassNames: "tree_tan four_tan"
            }
        }
    },
    data() {
        return {};
    },
    methods: {
      ok(){
        this.$emit('pro_ok', this.msginfo.id)
      },
      cancel(){
          this.$emit('pro_cancel', this.msginfo.id)
      }
    }
};
</script>
<style lang="less" scoped>
 .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>

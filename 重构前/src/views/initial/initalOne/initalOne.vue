<template>
    <div style='position:relative;height: 665px;background:#fff;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <!-- 标题 -->
        <div class="one_title">
            <div class='title_content'>
                <div>欢迎使用恺立达设备管理软件</div>
            </div>
        </div>
        <!-- 主体 -->
        <div class='one_content'>
            <div class='one_b'>
                <div class='one_Messager' v-show="mes_show">
                    <span>
                        <img src="./img/error.png" alt="">
                    </span>
                    <span>{{show_text}}</span>
                </div>
                <div>
                    <div class='one_info'>
                        <div class='info_h'>手机号</div>
                        <span class='info_z' style='background-color: #f5f6fa;'>{{user_info.phone}}</span>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>请输入新密码：</div>
                        <div class='one_tu'><input v-model="user_info.newpw" class='info_z' type="password"><img src="./img/closeeye.png" alt=""></div>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>请确认新密码：</div>
                        <div class='one_tu'><input v-model="user_info.v_pw" class='info_z' type="text"><img src="./img/openeye.png" alt=""></div>
                    </div>
                </div>
            </div>
        </div>
        <span class='one_next' @click="change_pw">
            <span>下一步</span>
            <span class='one_right'>>></span>
        </span>
    </div>
</template>
<style scoped lang="less" >
@import "./initalOne.less";
</style>
<script>
import qs from "qs";
export default {
  data(){
      return{
          user_info:{
              phone:JSON.parse(localStorage.getItem('user_in')).phone,
              newpw:'',
              v_pw:''
          },
          mes_show:false,
          show_text:'',
          user_in:JSON.parse(localStorage.getItem('user_in'))

      }
  },
  methods: {
      //调用修改密码接口
  
      change_pw(){
          if(!/^(\w){6,20}$/.exec(this.user_info.newpw)){
               this.mes_show=true;
              this.show_text='只能输入6-20个字母、数字、下划线'
              return;
          }
          if(this.user_info.newpw!=this.user_info.v_pw){
               this.mes_show=true;
               this.show_text='两次输入的密码不匹配'
               return;
          }
          this.axios.put(`/users/${this.user_in.groupId}/${this.user_in.id}/newpass`,  qs.stringify({
              newPassword:this.user_info.newpw

          })).then(res=>{
              this.$router.replace('/initial/two')
                
          }).catch(error=>{
              console.log(error)
          })
      }
  }
}
</script>

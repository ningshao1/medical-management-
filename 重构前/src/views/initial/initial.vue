<template>
  <div class='inital'>
    <!-- 标题 -->
    <div class="title">
      <div v-for="(item,index) in list_title" :key='index' class='block'>
        <span>{{index+1}}</span>
        <span>{{item}}</span>
        <span>·····</span>
      </div>
      <div class='block'>
        <span>7</span>
        <span>完成</span>
      </div>
    </div>
    <!-- 子路由显示区域 -->
    <div class='show_block'>
      <div>
        <router-view></router-view>
      </div>
    </div>
    <div class='inital_foot'>Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有</div>
  </div>
</template>
<style scoped lang="less">
@import "./initial.less";
</style>

<script>
export default {
  data() {
    return {
      list_title: [
        "开始使用",
        "信息完善",
        "数据导入",
        "数据对应",
        "分类对应",
        "用户管理"
      ] //初始化标题信息
    };
  }
};
</script>


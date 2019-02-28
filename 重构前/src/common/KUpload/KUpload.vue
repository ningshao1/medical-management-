<template>
<div>
    <Upload
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
        :before-upload="handleBeforeUpload"
        mutiple
        :format="['doc','docx']" 
        :show-upload-list="false"   
    >
        <div style="padding: 20px 0">
            <div style="width:100%;height:100%" v-show="!this.uploadFile.length">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>Click or drag files here to upload</p>
            </div>
            <div style="width:100%;height:100%" v-show="this.uploadFile.length">
               <img v-for="(v,i) of uploadFile" :key="'uploadFile'+i" src="v.imgUrl" alt="">
            </div>
        </div>
    </Upload>
</div>
    
</template>

<script>
export default {
  data() {
    return {
      uploadFile: []
    };
  },
  methods: {
    handleBeforeUpload(file) {
    //   if (file.name.match(/\.doc$|\.docx$/)) {
    //     file.imgUrl = require("../../views/formManage/image/word.png");
    //   }
    //   if (file.name.match(/\.xls$|\.xlsx$/)) {
    //     file.imgUrl = require("../../views/formManage/image/excel.png");
    //   }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>

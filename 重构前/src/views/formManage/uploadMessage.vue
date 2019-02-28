<template>
    <div>
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <p style="cursor:pointer">
                    <span @click="backIndex">首页</span>
                    <span>
                        <i style="color:#01b0c7">> </i>
                        <span @click="formManage">表单管理</span>
                    </span>
                </p>
                <div class="form-search">
                    <h2>
                        文档上传

                    </h2>

                </div>

            </div>
            <div class="line"></div>
            <div class="upload" style="background:#fafafa">
                <div class="upload-box" style="background:#fafafa">
                    <p>上传文件：</p>
                    <!-- <Upload multiple type="drag" :on-success='up_succ'  :on-error='up_error' :action="imgsrc" :format='["doc","docx","xlsx","xls"]' :show-upload-list="false" :on-format-error='up_error' ref="formUpload">

                        <div style="padding: 20px 0;height:220px;background:#fafafa" v-show="allPhoto">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>从电脑上选择要上传的文档，按住Ctrl可以上传多份文件</p>
                        </div>
                        <div id="photoFlex" v-show="!allPhoto">
                            <div v-for="(item,index) in imgData" :key="index" style="margin:0 2px;width:80px;" class="fileWrap">
                                <Icon type="close" class="doDelFile" @click.native.stop="doDelFile(index)" v-show="false" />
                                <img  :src="item.imgUrl" width="60px" height="60px" style="margin:0 5px;" alt="">
                                <p style="font-size:10px;text-align:center;white-space:nowrap;overflow:hidden;">{{item.name}}</p>
                            </div>
                        </div>
                    </Upload> -->


                    <c-upload-file :fileList="fileData" :maxCount="'infinity'" :maxSize="'infinity'"></c-upload-file>
                    

                </div>
                <div class="upload-title">
                    <p>
                        <span style="color: #f2740c;">*</span>温馨提示：</p>

                    <p>
                        本模块支持上传文档类型：
                        <img src="./image/word.png" alt=""> doc，docx；
                        <img src="./image/excel.png" alt=""> xls，xlsx.
                    </p>
                </div>
                <div class="asset-footer" style="background:#fff;line-height:0;background:#fafafa">
                    <div class="retrieval-btn">
                        <Button @click="goBack">取消</Button>
                        <Button class="btn-active" @click="goUpload">确定</Button>
                    </div>
                </div>
            </div>
            <div style="padding-bottom:50px"></div>
        <div class="tree_m">
            <Modal v-model="singer" title="文档上传" class-name="singer_tan" cancel-text='取消' okText='确定' @on-cancel='shure'>
                <div class='content_t'>
                <div class="msg_c">确定取消本次上传文档吗？</div>
                  <div class="msg_d" style="display:flex">
                        <button id="btn1" @click="shure">取消</button>
                        <button id="btn2" @click="shure2">确定</button>               
                    </div>   
                </div>
              <div slot="footer"></div>
            </Modal>

            <!-- 确认按钮error模态窗 -->
            <Modal v-model="checkUpdate" title="文档上传" class-name="singer_tan" cancel-text='取消' okText='确定' @on-cancel='doCancel'>
                <div class='content_t'>
                <div class="msg_c">{{updateErrorMsg}}</div>
                  <div class="msg_d" style="display:flex">
                        <button id="btn1" @click="doCancel">取消</button>
                        <button id="btn2" @click="doCancel(true)">确定</button>               
                    </div>   
                </div>
              <div slot="footer"></div>
            </Modal>
        </div>
            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>

    </div>
</template>

<script>
import CUploadFile from "@common/C-UploadFile/CUploadFile";
export default {
  data() {
    return {
      imgUrl: require("./image/word.png"),
      allPhoto: true,
      singer: false,

      //确认键模态窗
      checkUpdate: false,
      filename: "",
      fileData: [],
      updateErrorMsg: "请选择上传文件"
    };
  },
  methods: {
    backIndex() {
      this.$router.push({ path: "/index/home" });
    },
    formManage() {
      this.$router.push({ path: "/index/formManage" });
    },
    shure() {
      this.singer = false;
    },
    shure2() {
      this.$router.push("/index/formManage");
    },



    goBack() {
        this.singer = true;
    },

    //确认提交
    goUpload() {
        
      if (this.fileData.length === 0) {
        this.checkUpdate = true;
        return;
      }
      
      let config={
        headers: {'Content-Type': 'multipart/form-data'}
      }
      Promise.all(
          this.fileData.map(file=>{
              let data=new FormData();
              data.append('file',file)
              return this.$axios.post(`/fileUplod/${this.$store.state.user_in.osId}/upload`,data,config);
          })
      ).then(
        res=>{
          this.$Message.success("文件上传成功")
          this.$router.go(-1);
        },
        err=>{
          this.$Message.error("文件上传失败，请检查您的网络")
        }
      )
    },
    doCancel() {
      this.checkUpdate = false;
    }
  },
  components:{
    CUploadFile
  }
};
</script>

<style scoped lang="less">
#btn1 {
  width: 120px;
  height: 40px;
  margin: 45px 20px 0px;
  border: none;
  cursor: pointer;
}
#btn2 {
  width: 120px;
  height: 40px;
  margin: 45px 20px 0px;
  background-color: #22a1b9;
  color: #ffffff;
  border: none;
  cursor: pointer;
}
#photoFlex {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  height: 100px;
    .fileWrap{
        position: relative;
        .doDelFile{
            position: absolute;
            right:0;
            top:0;
        }
    }
}
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

  .form-search {
    h2 {
      font-weight: normal;
      color: #333333;
      font-size: 16px;
      margin-top: 1px;
      line-height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  .line {
    height: 1px;
    background-color: #ccd2d7;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .upload {
    height: 492px;
    background-color: #ffffff;
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    .upload-box {
      padding: 20px 30px;
      p:nth-child(1) {
        font-size: 14px;
        color: #000000;
        margin-bottom: 12px;
      }
      p:nth-child(2) {
        font-size: 16px;
        color: #b1b0b0;
      }
    }
  }
  .upload-title {
    margin-top: 20px;
    padding: 20px 30px;
    p:nth-child(1) {
      font-size: 14px;
      color: #000000;
    }
    p:nth-child(2) {
      color: #666666;
      font-size: 14px;
    }
    img {
      width: 21px;
      height: 23px;
    }
  }
}

</style>
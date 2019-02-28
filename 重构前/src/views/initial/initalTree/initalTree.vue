<template>
    <div class='inital_two' style='position:relative;height: 665px;background:#fff;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <!-- 标题 -->
        <div class="two_title">
            <div class='title_content'>
                <div>请将医院现有数据进行导入操作</div>
            </div>
        </div>
        <div class="tree_content">
            <div class="c_zhu">
                <div class='up_title'>上传文件:</div>
                <div class='up_content'>
                    <Upload type="drag" :on-success='up_succ' :on-error='up_error' :on-remove='rm_' :action="upfile_+up_url">
                        <div style="padding: 50px 0 0 0">
                            <Icon type="ios-cloud-upload" size="70" style="color: #3399ff"></Icon>
                            <p style='font-size: 13px;'>也可以拖拽文件到该区域，完成上传；或点击</p>
                        </div>
                    </Upload>
                </div>
            </div>

            <div class='tree_tishi'>
                <div class='ti_title'>操作步骤提示：</div>
                <ol>
                    <li>1、将医院原有的资产清单以Excel表格形式进行上传；</li>
                    <li>2、上传提示成功后请点击“下一步”继续；</li>
                    <li>3、如上传失败请重复之前步骤或检查资产清单文件格式再进行上传操作；</li>
                    <li>4、如有疑问，相关格式请参考附件
                        <span class='t_fujian'>点击下载附件</span>
                    </li>
                </ol>
            </div>
            <div class='tree_tishi'>
                <div class='ti_title'>
                    <span style='color:red'>*</span> 温馨提示：</div>
                <div class='title_c'>为了更好的协助医院进行资产管理，请尽量完善资料，以便后续操作。</div>
            </div>
        </div>

        <div>
            <span class='one_prv' @click='up_'>
                <span>&lt;&lt;</span>
                <span class='one_right'>上一步</span>
            </span>
            <span class='one_next' @click='back_'>
                <span>下一步</span>
                <span class='one_right'>>></span>
            </span>
        </div>
        <!-- 弹窗 -->
        <div class="tree_m">
            <Modal v-model="modal2" :title="msginfo.title" class-name="tree_tan" :okText='msginfo.okText'>
                <div class='content_t'>
                    <img style="width:80px;height:80px;" :src="msginfo.imgUrl" alt="">
                    <div class="msg_c">{{msginfo.name}}</div>
                </div>

            </Modal>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url("./initalTree");
</style>


<script>
export default {
    data() {
        return {
            modal2: false,
            next_: false,
            up_url: `fileUpload?login-token=${
                JSON.parse(localStorage.getItem("token")).token
            }`,
            msginfo: {
                title: "上传文件",
                imgUrl: "./src/views/initial/initalTree/img/sucess.png",
                name: "文件南京大学医学院附属鼓楼医院.xls已经成功上传",
                okText: "确认"
            }
        };
    },
    methods: {
        up_succ() {
            //this.modal2 = true;
            this.$Message.success("文件上传成功");
            this.next_ = true;
        },
        up_error(e) {
            //             this.modal2 = true;
            //             this.msginfo.name = `上传失败
            // 请检查文件格式是否正确`;
            //             this.msginfo.imgUrl =
            //                 "./src/views/initial/initalTree/img/error.png";
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        rm_() {
            this.axios
                .delete("/fileUpload")
                .then(res => {
                    this.next_ = false;
                    this.$Message.success("文件删除成功");
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    cosnole.log(error);
                });
        },
        up_() {
            this.$router.push("/initial/two");
        },
        back_() {
            console.log(this.next_);
            this.next_
                ? this.$router.push("/initial/four")
                : this.$Message.warning("请先上传文件在进行下一步操作");
        }
        // down_() {
        //     this.axios.get("/fileUplod/33668").then(res => {
        //         console.log(res);
        //     });
        // }
    }
    // components:{
    //     msg
    // }
};
</script>

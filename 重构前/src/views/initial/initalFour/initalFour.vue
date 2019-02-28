<template>
    <div class='inital_two' style='position:relative;height: 665px;background:#fff;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <!-- 标题 -->
        <div class="two_title">
            <div class='title_content'>
                <div>请将导入的文件与数据库中字段进行匹配</div>
            </div>
        </div>
        <div class='four_content'>
            <div>
                <div class='c_box'>
                    <div class='four_left'>
                        <div class='c_title'>字段匹配：</div>
                        <div class="left_content">
                            <div class='zd_box' v-for='(item,index) in left_list' :key='index'>
                                <div class='zd_left'>
                                    <span class="zd_name">{{item}}</span>
                                    <span class="zd_line">···················</span>
                                </div>
                                <div class='zd_center'>对应右表</div>
                                <div class='zd_right'>
                                    <span class="zd_line">···················</span>
                                    <input type="text" placeholder="匹配序号" :data-id='index' @blur="get_b">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='four_right'>
                        <div class='c_title'>系统内置资产字段：</div>
                        <div class="right_content">
                            <div>
                                <ol>
                                    <li v-for='(item,index) in r_list' :key='item'>{{index+1+'、'+item}}</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div>
            <span class='one_prv' @click="prv_">
                <span>&lt;&lt;</span>
                <span class='one_right'>上一步</span>
            </span>
            <span class='one_next' @click='down'>
                <span>下一步</span>
                <span class='one_right'>>></span>
            </span>
        </div>

        <!-- 弹窗 -->
        <!-- <div class="tree_m">
           <Modal
        v-model="modal2"
        :title="msginfo.title"
        class-name="tree_tan"
        :okText='msginfo.okText'
       >
       <div class='content_t'>
           <img style="width:80px;height:80px;" :src="msginfo.imgUrl" alt="">
           <div class="msg_c">{{msginfo.name}}</div>
       </div>
  
 

       
    </Modal>
        </div> -->
    </div>
</template>
<style lang="less" scoped>
@import url("./initalFour.less");
</style>
<script>
//import $ from "jquery";
export default {
    data() {
        return {
            left_list: null,
            r_list: null,
            l_index: [],
            r_index: [],
            in_info: []
        };
    },
    methods: {
        get_list() {
            let r_list = [];
            let that = this;
            this.axios.get("/assets/findAssetField").then(res => {
                res.data.forEach(item => {
                    switch (item) {
                        case "assetName":
                            r_list.push("资产名称");
                            that.in_info.push("assetName");
                            break;
                        case "assetCode":
                            r_list.push("现有编码");
                            that.in_info.push("assetCode");
                            break;
                        case "assertTypeId":
                            r_list.push("类别");
                            that.in_info.push("assertTypeId");
                            break;
                        case "assetBrandId":
                            r_list.push("资产");
                            that.in_info.push("assetBrandId");
                            break;
                        case "departmentId":
                            r_list.push("领用科室");
                            that.in_info.push("departmentId");
                            break;
                        case "assetClass":
                            r_list.push("设备型号");
                            that.in_info.push("assetClass");
                            break;
                        case "brandName":
                            r_list.push("品牌");
                            that.in_info.push("brandName");
                            break;
                        case "collarTime":
                            r_list.push("领用时间");
                            that.in_info.push("collarTime");
                            break;
                        default:
                            break;
                    }
                });
                this.r_list = r_list;
            });
        },
        get_tmp() {
            this.axios
                .get("assets/findTmpAssetField")
                .then(res => {
                    this.left_list = res.data;
                })
                .catch(error => {
                    this.$Message.warning("左侧列表获取失败");
                });
        },
        prv_() {
            this.$router.push("/initial/three");
        },
        //点击下一步
        down() {
            if (this.l_index.length == 0) {
                this.$Message.warning("请进行字段匹配");
                return;
            }
            let that = this;
            let info = {};
            for (let key in this.l_index) {
                info[that.in_info[that.r_index[key]]] =
                    that.left_list[this.l_index[key]];
            }
            this.post_info(info);
        },
        //数据发送请求
        post_info(obj) {
            this.axios
                .post("/assets/importAsset", obj)
                .then(res => {
                    this.$router.push("/initial/five");
                })
                .catch(error => {
                    this.$Message.warning("提交失败,请重新提交");
                });
        },
        get_b(e) {
            conosle.log(e.path[0].dataset.id);
            console.log(this.l_index);
            let that = this;
            if ($.inArray(e.path[0].dataset.id, this.l_index) == -1) {
                if (e.path[0].value) {
                    this.l_index.push(e.path[0].dataset.id);
                    this.r_index.push(e.path[0].value - 1);
                }
            } else {
                if (e.path[0].value.trim() == "") {
                    console.log(e.path[0].dataset.id);
                    this.l_index.splice(e.path[0].dataset.id - 1, 1);
                    this.r_index.splice(e.path[0].dataset.id - 1, 1);
                } else {
                    this.r_index[
                        $.inArray(e.path[0].dataset.id, this.l_index)
                    ] =
                        e.path[0].value - 1;
                }
            }
            // let info_ = {};
            // for (let key in this.l_index) {
            //     info[that.left_list[key]] = that.r_list[that.r_index[key]];
            // }
            // console.log(info);
        }
    },
    created() {
        this.get_list();
        this.get_tmp();
    }
};
</script>


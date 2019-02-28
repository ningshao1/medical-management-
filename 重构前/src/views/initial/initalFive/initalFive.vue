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
                            <div class='zd_box' v-for='(item,index) in l_list' :key='index'>
                                <div class='zd_left'>
                                    <span class="zd_name">{{item}}</span>
                                    <span class="zd_line">···················</span>
                                </div>
                                <div class='zd_center'>对应右表</div>
                                <div class='zd_right'>
                                    <span class="zd_line">···················</span>
                                    <input :data-id='index' @blur="get_b" type="text" placeholder="匹配序号">
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class='four_right'>
                        <div class='c_title flex_r'>
                            <span>系统内置资产字段：</span>
                            <div>
                                <span>
                                    <span style='color:#f2740c'>*</span>2017年新医疗器械分类目录</span>
                                <span class='down_'>点击下载</span>
                            </div>
                        </div>
                        <div class="right_content">
                            <div class='cont_box'>
                                <ol v-for='(item,index) in r_list' :key='index'>
                                    <li v-for="(items,indexs) in item" :key='indexs'>{{items.index+'、'+items.typeName}}</li>
                                </ol>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div>
            <span class='one_prv' @click="prv">
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
@import url("./initalFive.less");
</style>
<script>
//import $ from "jquery";
export default {
    data() {
        return {
            l_list: null, //初始化左边数据
            r_list: null, //初始化右边数据
            l_index: [],
            r_index: [],
            in_info: []
        };
    },
    methods: {
        //右边数据接口
        right_list() {
            const that = this;
            this.axios
                .get("assetTypes/assetTypecopyList")
                .then(res => {
                    that.in_info = res.data;
                    let newarr = [];
                    let datas = res.data;
                    for (let i = 0; i < datas.length; i += 12) {
                        let arr = [];
                        for (let j = i; j < i + 12; j++) {
                            if (datas[j] == undefined) {
                                break;
                            } else {
                                datas[j]["index"] = j + 1;
                                arr.push(datas[j]);
                            }
                        }
                        newarr.push(arr);
                    }
                    this.r_list = newarr;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //左边数据接口
        left_list() {
            this.axios
                .get("assetTypes/getTmpAssetTypecopy")
                .then(res => {
                    this.l_list = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //失去焦点后获取数据
        get_b(e) {
            console.log(e);
            let that = this;
            if(e.path[0].value>this.in_info.length){
                this.$Message.warning('你输入的序号不在系统范围之中,请重新输入')
                e.path[0].value='';
                return;
            }
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
        },
        prv(){
             this.$router.push('/initial/four')
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
                info[that.in_info[that.r_index[key]].id] =
                    that.l_list[this.l_index[key]];
            }
            console.log(info);
            this.post_info(info);
        },      
        post_info(obj){
            this.axios.post('/assetTypes/importAssetTypecopy',obj).then(res=>{
               this.$router.push('/initial/six')
            }).catch(error=>{
                 this.$Message.warning('提交失败')
            })
        }
    },
    created() {
        //初始化获取数据
        this.right_list();
        this.left_list();
    }
};
</script>


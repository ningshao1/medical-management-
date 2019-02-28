<template>
    <div>
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <p style="cursor:pointer">
                    <span @click="backIndex">首页</span>
                    <span>
                        <i style="color:#01b0c7">> </i>
                        <span>表单管理</span>
                    </span>
                </p>
                <div class='one_Messager' v-show="according ">
                    <span>
                        <img src="@/img/error1.png" alt="">
                    </span>
                    <span>首页放置的文档数已达上限 8/8</span>
                </div>
            </div>
            <div class="form-search">
                <h2>
                    <img :src='fromS' style="vertical-align:middle;width: 25px;margin-right: 5px;" />文档列表
                    <span>（首页放置文档数 {{this.num}}/8）</span>
                </h2>
                <div class="nav-search">
                    <input icon="ios-search" placeholder="请输入关键字" v-model="uname" style="width:280px;height:35px;padding-left:10px;" @keyup="findAll">
                    <!-- <Button shape="circle" @click.native="jump">上传文档</Button> -->
                    <div v-if="ViewLimit('excel:upload')" @click="jump" style="width: 95px;height:37px;line-height:37px; color:#fff;background-color: #22a1b9;font-size:12px;text-align:center;border-radius:3px;display: inline-block;cursor:pointer">上传文档</div>
                </div>
            </div>

            <div class="line"></div>
            <div class="form-tab" style="background:#fafafa" v-if="ViewLimit('excel:query')">
                <Kloading v-if="spinShow"></Kloading>
                <table class="table-stripe" width="100%" border="1" style="border-collapse:collapse;" v-if='ViewLimit("excel:query")'>
                    <tr>
                        <th>文档名称</th>
                        <th>上传时间</th>
                        <th>上传人</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="(item,index) in info" :key="index">
                        <td style="width:25%;padding:5px 20px;">{{item.fileName}}</td>
                        <td style="width:25%">{{item.cTime}}</td>
                        <td style="width:25%">
                            <poptip-show-info :info-id="item.createId">{{item.uName}}</poptip-show-info>
                        </td>
                        <td style="width:25%">
                            <a href="javascript:;" v-if="ViewLimit('excel:download')" @click="download(index)">下载 |</a>
                            <a href="javascript:;" v-if="ViewLimit('excel:edit')" @click="homepage(index)" ref="cael" :class="[item.type==1?'color1':'color2']">{{item.type==1?"首页文件 |":"普通文件 |"}}</a>
                            <a href="javascript:;" v-if="ViewLimit('excel:del')" @click="deleteDocument(index)">删除</a>
                        </td>
                    </tr>
                </table>
                <div class="page">
                    <Page :total="total" @on-change="query"></Page>
                </div>
            </div>
            <div class="tree_m">
                <Modal v-model="modal2" title="删除文档" class-name="singer_tan" cancel-text='取消' ok-text='确定' @on-cancel='shure2'>
                    <div class='content_t' style="justify-content: center">
                        <div class="msg_c">你确定要删除此文件?</div>
                        <div class="msg_d" style="display:flex">
                            <button id="btn1" @click="shure2">取消</button>
                            <button id="btn2" @click="del">确定</button>
                        </div>
                    </div>
                    <div slot="footer"></div>
                </Modal>
            </div>
            <div style="padding-bottom:50px"></div>
            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>

    </div>
</template>

<script>
import Kloading from "../../common/loading/loading";
import poptipShowInfo from '@common/poptip-show-info';
var fromS = require("../../img/from.svg");
export default {
    data() {
        return {
            fromS: fromS,
            modal2: false,
            modal_loading: false,
            uname: "",
            info: "",
            documentId: "",
            content: "下载",
            total: 0,
            number: 0,
            according: false,
            spinShow: true,
            num: 0,
            pageNum: 1,
            limit: []
        };
    },
    created() {
        this.query();
        this.pagetotal();
        this.limit = JSON.parse(localStorage.getItem("limit"));
        this.limit.forEach(e => {
            // console.log(e.plPermission+e.plName)
        });
        console.log()
    },
    methods: {
        shure2() {
            this.modal2 = false;
        },
        backIndex() {
            this.$router.push({ path: "/index/home" });
        },
        jump() {
            this.$router.push("/index/formManage/uploadMessage");
        },
        //获取页面数据
        query(page = 1) {
            this.spinShow = true;
            let line = (page - 1) * 10;
            let oid = JSON.parse(localStorage.getItem("user_in")).osId;

            this.axios
                .post("/fileUplod/filelist", {
                    limit: 10,
                    offset: line,
                    params: {
                        osid: oid
                    }
                })
                .then(res => {
                    this.info = res.data.data;
                    this.total = res.data.recordsTotal;
                    // 判断首页只显示8个警告
                    // this.info.forEach(element => {

                    // if (element.type == 1) this.number += 1;
                    // });

                    // if (this.number >= 8) {
                    //     this.according = true;
                    //     setTimeout(() => {
                    //         this.according = false;
                    //     }, 3000);
                    // }
                    this.spinShow = false;
                })
                .catch(err => {
                    this.$Message.warning("文件列表获取失败");
                    console.log(err);
                    this.spinShow = false;
                });
        },
        //显示条数
        pagetotal() {
            this.axios
                .get("/fileUplod/getFiles/count")
                .then(res => {
                    this.num = res.data;
                    // 判断首页只显示8个警告
                    // if (this.num+1>= 9) {
                    //     this.according = true;
                    //     setTimeout(() => {
                    //         this.according = false;
                    //     }, 3000);
                    // }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //下载
        download(index) {
            this.documentId = this.info[index].id;
            let id = this.documentId;

            this.axios
                .get(`/fileUplod/${id}`)
                .then(res => {
                    this.$Message.success("下载成功");
                    //             let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                    // 　　　　   　let objectUrl = URL.createObjectURL(blob);
                    // 　　　　　   window.location.href = objectUrl;
                })
                .catch(err => {
                    this.$Message.warning("文件下载失败");
                    console.log(err);
                });
        },
        //删除
        deleteDocument(index) {
            this.documentId = this.info[index].id;
            let id = this.documentId;

            this.modal2 = true;
            // this.axios
            //     .delete(`/fileUplod/${id}`)
            //     .then(res => {
            //         this.info.splice(index, 1);
            //         this.$Message.success("删除成功");
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });
        },
        //弹窗删除警告
        del() {
            let id = this.documentId;
            this.modal_loading = true;

            this.axios
                .delete(`/fileUplod/${id}`)
                .then(res => {
                    this.$Message.success("删除成功");
                })
                .catch(err => {
                    this.$Message.error("删除失败，请见检查你的网络");
                    console.log(err);
                });

            setTimeout(() => {
                this.modal_loading = false;
                this.modal2 = false;
                this.query();
                this.pagetotal();
            }, 200);
        },
        // 查询
        findAll() {
            let oid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.axios
                .post("/fileUplod/filelist", {
                    limit: 10,
                    offset: 0,
                    params: {
                        osid: oid,
                        name: this.uname
                    }
                })
                .then(res => {
                    this.info = res.data.data;
                    this.total=res.data.recordsTotal;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //首页显示状态
        homepage(index) {
            let test = this.$refs.cael[index].text;
            this.documentId = this.info[index].id;
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            let id = this.documentId;
            this.axios
                .post(`/fileUplod/filelist/${osid}/${id}`)
                .then(res => {
                    this.pagetotal();
                    this.query();
                    //  this.$Message.success("放入首页");
                })
                .catch(err => {
                    this.pagetotal();
                    // 判断首页只显示8个警告
                    if (this.num + 1 >= 9) {
                        this.according = true;
                        setTimeout(() => {
                            this.according = false;
                        }, 3000);
                    }
                    console.log(err);
                });
        }
    },
    components: {
        Kloading, poptipShowInfo
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
    cursor: pointer;
    border: none;
}
.color1 {
    color: #57a3f3;
}
.color2 {
    color: #ccc;
}
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        margin-top: 14px;
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
        display: flex;
        justify-content: space-between;
        h2 {
            font-weight: normal;
            color: #333333;
            font-size: 16px;
            margin-top: 8px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            line-height: 40px;
            span {
                font-size: 12px;
                color: #999999;
                line-height: 40px;
            }
        }
        .ivu-input-wrapper {
            width: auto;
        }
    }

    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .form-tab {
        height: 670px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        //padding: 20px 30px;
        position: relative;
        table {
            border: none;

            tr {
                border: none;
                border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                //height: 50px;
                text-align: left;
                font-size: 14px;
                th {
                    color: #666666;
                    border: none;
                    padding: 10px 20px;
                }
                td {
                    border: none;
                    padding: 12px 20px;
                    span {
                        font-size: 12px;
                        color: #999999;
                    }
                }
            }
        }
        .page {
            margin-top: 20px;
            text-align: center;
        }
    }
}

.one_Messager {
    height: 30px;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 15px;
    position: absolute;
    width: 35%;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
    // display: none;
    span:nth-of-type(1) {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 0, 0, 0.15);
        text-align: center;
        line-height: 38px;
        border-radius: 50%;
    }
    span:nth-of-type(2) {
        padding-left: 45px;
        line-height: 30px;
        color: #cc0000;
    }
}
</style>
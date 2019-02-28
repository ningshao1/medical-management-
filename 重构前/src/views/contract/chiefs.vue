<template>
    <div>
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <ul>
                    <li style="cursor:pointer">
                        <router-link to="/index/home" style=" color: #999 ">首页</router-link>

                    </li>
                    <li style="cursor:pointer">
                        <span>></span>

                        预置工作
                    </li>
                    <li style="cursor:pointer">
                        <span>></span>
                        合同管理
                    </li>
                </ul>
            </div>
            <div class="nav-sub">
                <h2><img :src='ht' style="vertical-align:middle;width:20px;margin-right: 5px;" />合同管理</h2>
                <div class="nav-search">
                    <!-- <Button shape="circle" @click="jumpaddcontract" v-show="limit.findIndex(e=>{return e.plPermission=='con:add'})!=-1">新建合同</Button> -->
                    <Button @click="jumpaddcontract" class="kld-btn" icon="plus" v-show="limit.findIndex(e=>{return e.plPermission=='con:add'})!=-1">新建合同</Button>
                </div>
            </div>
            <div class="line"></div>
            <div class="search">
                <div class="search-box chiefs">
                    <Input icon="ios-search" style="width:20%;cursor:pointer;" placeholder="关键词查找" v-model="search.keyWord" @keyup.native="searchinfo"></Input>
                 
                    <div class='flex_r' style="width: 20%;">
                        <DatePicker :editable="false" @on-change="getStartTime" format="yyyy-MM-dd" placeholder="申请开始时间" style="width: 46%;" v-model="time"></DatePicker>
                        <span style="line-height: 45px;font-size:14px;">至</span>

                        <DatePicker :editable="false" @on-change="getStartTime1" format="yyyy-MM-dd" placeholder="申请结束时间" style="width: 46%;" v-model="time1"></DatePicker>
                    </div>
                    <Select v-model="search.contractType" style="width:20%" placeholder="合同分类" @on-change="searchinfo">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="search.contractStatus" style="width:20%" placeholder="合同状态" @on-change="searchinfo">
                        <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div class="search-btn" style="width: 16%">
                        <Button @click="reset">重置</Button>
                        <Button class="btn-active kld-btn" icon="android-search" @click="searchinfo" v-show="limit.findIndex(e=>{return e.plPermission=='con:query'})!=-1">检索</Button>
                    </div>
                </div>
            </div>
            <div class="main">
                <div class="main_tree">
                    <tree @on-selected="sectionTreeClick" ref="tree" :data='data1' @on-select-change='select_c'></tree>
                </div>
                <div class="info">
                    <div class="main-info">
                        <Kloading v-if="spinShow"></Kloading>
                        <table class="table-stripe" width="100%" border="1" style="border-collapse:collapse;">
                            <tr class="one" style="height:60px;">
                                <th style="padding-left:40px;width:30%">合同信息</th>
                                <th>供应商名称</th>
                                <th>合同分类</th>
                                <th>合同状态</th>
                                <th>签订日期</th>
                                <th>操作</th>
                            </tr>
                            <tr v-for="(item, index) in contractlist" :key="item.index">

                                <td style="padding-left:40px;width:30%" @click="seeinfo(index)">
                                    <p>{{item.contractId}}</p>
                                    <p class="equipment-title">{{item.contractName}}</p>
                                    <Button class="supplier-label" style="transform: scale(0.95)" type="ghost" shape="circle" v-for="btn in item.labels" :key="btn.id" v-show='btn.labelName!=="" && btn.labelName!==null'>{{btn.labelName}}</Button>
                                </td>
                                <td @click="seeinfo(index)">
                                    <p>{{item.supplierName}}</p>
                                    <span>{{item.supplierContactor}}</span><br>
                                    <span>{{item.supplierContact}}</span>
                                </td>

                                <td @click="seeinfo(index)">
                                    <p v-show="item.contractType==1">维保合同</p>
                                    <p v-show="item.contractType==2">采购合同</p>
                                    <p v-show="item.contractType==3">维修合同</p>
                                    <p v-show="item.contractType==4">其它</p>
                                </td>
                                <td @click="seeinfo(index)">
                                    <p v-show="item.contractStatus==1" style="color:#eb6100">废弃</p>
                                    <p v-show="item.contractStatus==0">正常</p>
                                </td>
                                <td @click="seeinfo(index)">
                                    <p> {{item.signDate}}</p>
                                </td>
                                <td>
                                    <!-- <a href="javascript:"   @click="seeinfo(index)">查看|</a> -->
                                    <a href="javascript:" @click="edit(index)" v-show="(limit.findIndex(e=>{return e.plPermission=='con:edit'})!=-1)&&item.contractStatus!=1">编辑</a>
                                    <!-- <a href="javascript:" @click="del(index)" v-show="limit.findIndex(e=>{return e.plPermission=='con:del'})!=-1">丨删除</a> -->
                                </td>
                            </tr>

                        </table>
                        <div class="page">
                            <Page :total="pages" @on-change="getcontract" v-show="pages>10"></Page>
                        </div>
                    </div>
                </div>

            </div>
            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>
        <promt :msginfo='del_info' @pro_ok="dels(ind)"></promt>
    </div>
</template>

<script>
import Kloading from "../../common/loading/loading";
import promt from "../../common/prompt/prompt";
var htSvg = require("../../img/ht.svg");
export default {
    data() {
        return {
            ind: "",
            ht: htSvg,
            info: "",
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要是删除当前行数据",
                modal2: false
            },
            back: false,
            time1: "",
            time: "",
            labels: [],
            labellist: [],
            contractlist: "",
            pages: 0,
            user_info: JSON.parse(localStorage.getItem("user_in")),
            limit: JSON.parse(localStorage.getItem("limit")),
            search: {
                info: "",
                contractType: "",
                contractStatus: "",
                keyWord: null
            },
            cityList: [
                {
                    value: "",
                    label: "全部合同"
                },
                {
                    value: "2",
                    label: "采购合同"
                },
                {
                    value: "1",
                    label: "维保合同"
                },
                {
                    value: "3",
                    label: "维修合同"
                },
                {
                    value: "4",
                    label: "其它"
                }
            ],

            cityList1: [
                {
                    value: '',
                    label: "全部"
                },
                {
                    value: "1",
                    label: "废弃"
                },
                {
                    value: "0",
                    label: "正常"
                }
            ],
            spinShow: true,
            //树状数据
            data1: [
                {
                    title: "全部合同",
                    value: "",
                    expand: true,
                    children: [
                        {
                            title: "采购合同",
                            value: "2"
                        },
                        {
                            value: "1",
                            title: "维保合同"
                        },
                        {
                            value: "3",
                            title: "维修合同"
                        },
                        {
                            value: "4",
                            title: "其它"
                        }
                    ]
                }
            ]
        };
    },
    created() {
        this.getcontract();
        this.getlabel();
    },

    methods: {
        //获取医院标签接口接口
        getlabel() {
            this.axios
                .get(`/labelOrgstructs/${this.user_info.osId}/list?type=${1}`)
                .then(res => {
                    this.labels = res.data;
                    this.getlabels();
                })
                .catch(error => {});
        },

        //查看信息
        seeinfo(index) {
            if (this.ViewLimit('con:query')) {
                localStorage.setItem(
                    "contractlist",
                    JSON.stringify(this.contractlist[index].id)
                );
                this.$router.push("/index/contract/previews");
            }

        },

        //获取标签数据
        getlabels() {
            this.axios
                .get(`/labels/${1}`)
                .then(res => {
                    this.labels.push(res.data);
                })
                .catch(error => {});
        },
        //删除当前条数据
        del(index) {
            this.info = this.contractlist[index].id;
            this.del_info.modal2 = true;
            this.ind = index;
        },
        dels(ind) {
            this.axios
                .delete(`/contracts/${this.info}`)
                .then(res => {
                    this.contractlist.splice(ind, 1);
                    // this.getcontract();
                    this.$Message.info("删除数据成功");
                })
                .catch(error => {
                    this.$Message.warning("删除数据失败");
                });
        },

        //编辑跳转
        edit(index) {
            localStorage.setItem(
                "contractlist",
                JSON.stringify(this.contractlist[index].id)
            );
            sessionStorage.removeItem("suuplierinfo");
            this.$router.push("/index/contract/editcontract");
        },
        //获取时间
        getStartTime(date) {
            this.time = date;
        },
        //结束时间
        getStartTime1(data) {
            this.time1 = data;
            if (this.time) {
                var stime = this.time.split("-").join("");
            }

            if (this.time1) {
                var etime = this.time1.split("-").join("");
            }

            if (stime - etime > 0) {
                this.time = "";
                this.$Message.warning("开始时间不能大于结束时间");
                return;
            }
        },
        //获取合同列表
        getcontract(page = 1) {
            let line = (page - 1) * 10;
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;

            this.axios
                .post(
                    `/contracts/${osid}/list`,

                    {
                        limit: 10,
                        offset: line,
                        params: {
                            labelIds: this.labellist,
                            contractType: this.search.contractType,
                            contractStatus: this.search.contractStatus,
                            startTime: this.time,
                            keyword: this.search.keyWord,
                            endTime: this.time1
                        }
                    }
                )
                .then(res => {
                    this.contractlist = res.data.data;
                    this.pages = res.data.recordsTotal;
                    this.spinShow = false;
                })
                .catch(error => {
                    this.$Message.warning("获取列表信息错误");
                    this.spinShow = false;
                });
        },
        //重置信息
        reset() {
            this.labellist = [];
            this.time = "";
            this.time1 = "";
            this.search = {
                info: "",
                contractType: "",
                contractStatus: "",
                keyWord: null
            };
            this.searchinfo();
        },
        jumpaddcontract() {
            sessionStorage.removeItem("suuplierinfo");
            sessionStorage.removeItem("infos");
            sessionStorage.removeItem("infoss");
            sessionStorage.removeItem("infosss");
            sessionStorage.removeItem("infossss");
            this.$router.push("/index/contract/addContract");
        },

        //搜索信息
        searchinfo() {
            this.spinShow = true;
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.axios
                .post(
                    `/contracts/${osid}/list`,

                    {
                        limit: 10,
                        offset: 0,
                        params: {
                            // keyword: key,
                            labelIds: this.labellist,
                            contractType: this.search.contractType,
                            contractStatus: this.search.contractStatus,
                            startTime: this.time,
                            keyword: this.search.keyWord,
                            endTime: this.time1
                        }
                    }
                )
                .then(res => {
                    this.pages = res.data.recordsTotal;
                    this.contractlist = res.data.data;
                    this.spinShow = false;
                })
                .catch(error => {
                    // this.$Message.warning("查询数据错误");
                    this.spinShow = false;
                });
        },
        //树节点点击触发的函数
        select_c(e){
           this.search.contractType=e[0].value;
           this.searchinfo();
        },


        //树被点击时
        sectionTreeClick(nodeKey) {
            const node = this.$refs['tree'].flatState[nodeKey].node;

            if (node.children && node.children.length > 0) {
                this.$set(node, 'expand', ! node.expand);
            }
        },
    },
    components: {
        Kloading,
        promt
    }
};
</script>

<style scoped lang="less">
    .supplier-label{
        margin: 4px 4px 0 0;
    }
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        margin-top: 14px;
        display: flex;
        .nav-line {
            height: 16px;
            width: 4px;
            background-color: #76bdc1;
            display: inline-block;
        }

        li {
            margin-left: 6px;
            display: inline-block;
            font-size: 12px;
            color: #999999;
            position: relative;
            top: -3px;
        }
        li:last-child {
            color: #333333;
        }
        li:last-child span {
            color: #76bdc1;
        }
    }
    .nav-sub {
        display: flex;
        justify-content: space-between;
        h2 {
            font-weight: normal;
            color: #333333;
            font-size: 16px;
            margin-top: 8px;
        }
        .nav-btn {
            width: 120px;
            height: 45px;
            background-color: #22a1b9;
            border: solid 1px #0c8399;
        }
    }

    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .search {
        //height: 138px;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 8px;
        padding: 22px;
        .search-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .search-btn {
            text-align: center;
            //margin-top: 12px;
            .ivu-btn {
                width: 72px;
                height: 38px;
            }
            .btn-active {
                background-color: #22a1b9;
                color: #ffffff;
                margin-left: 20px;
            }
        }
    }
    .main {
        display: flex;
        margin-top: 20px;
        padding-bottom: 50px;
        .main_tree {
            width: 20%;
            background: rgb(250, 250, 250);
            margin-right:10px;
            padding:20px 0 0 20px;
        }
        .info {
            width: 80%;
            background: #fafafa;
            border-radius: 3px;
            border: solid 1px #dce0e6;
            .main-info {
                position: relative;
                height: 100%;
                table {
                    background: #fafafa;
                    table-layout: fixed;
                    border: none;
                    tr:nth-child(1) {
                        height: 40px;
                    }
                    .one th {
                        text-align: left;
                    }
                    tr {
                        border: none;
                        border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                        //height: 90px;
                        text-align: left;
                        font-size: 14px;

                        &:not(.one):hover {
                            background: #f2f2f2;
                            cursor: pointer;
                        }
                        th {
                            color: #666666;
                            border: none;
                            font-size: 14px;
                        }
                        td {
                            border: none;
                            padding: 8px;
                            padding-left: 0px;
                            padding-right: 0px;
                            font-size: 13px;
                            span {
                                font-size: 12px;
                                color: #999999;
                            }
                            .equipment-title {
                                color: #0c8399;
                                font-size: 16px;
                            }
                        }
                    }
                }
                .page {
                    margin-top: 20px;
                    text-align: center;
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>
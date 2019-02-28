<template>
    <div>
        <div class="content" style="padding-bottom:40px;">
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
                        供应商管理
                    </li>
                </ul>
            </div>
            <div class="nav-sub">
                <h2><img :src='supp' style="vertical-align:middle;width:25px;margin-right: 5px;" />供应商管理</h2>
                <div class="nav-search" style="display:flex">
                    <Input icon="ios-search" placeholder="请输入关键字" @on-keydown.13="searchlist" v-model="keyword" v-show="limit.findIndex(e=>{return e.plPermission=='sup:query'})!=-1" @on-click="searchlist"></Input>
                    <!-- <Button shape="circle" @click="jumpaddsupp" v-show="limit.findIndex(e=>{return e.plPermission=='sup:add'})!=-1">新增供应商</Button> -->
                    <Button @click="jumpaddsupp" class="kld-btn" icon="plus" v-show="limit.findIndex(e=>{return e.plPermission=='sup:add'})!=-1">新增供应商</Button>
                </div>
            </div>
            <div class="line"></div>
            <div class="main">
                <div class="left-list">
                    
                    <ul>
                        <li>
                            <p>供应商分类</p>
                        </li>
                        <li v-for='(item,i) in classify' :key='i' :class="liIndex===item.type?'check-li':''" @click='liIndex=item.type;supplierinfo()'><p>{{item.name}}</p></li>
                    </ul>
                </div>
                <div class="info">
                    <div class="main-info">
                        <Kloading v-if="spinShow"></Kloading>
                        <table class='table-stripe' width="100%" border="1" style="border-collapse:collapse;">
                            <thead>
                            <tr class="one" style="height:52px">
                                <th style="padding-left:40px;">序号</th>
                                <th style="width:26%">
                                    <!--当当前tab页为计量机构时 更换表头-->
                                    {{liIndex === '2' ? '检定单位' : '供应商信息'}}
                                </th>
                                <th>联系人</th>
                                <th>联系方式</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <template v-if="supplierlist.length > 0">
                                <tr v-for="(item, index) in supplierlist" :key="index">
                                    <td style="padding-left:40px;" @click="seeinfo(index)">{{(10 * (currentPage - 1) + index + 1) | addZero}}</td>
                                    <td @click="seeinfo(index)" style="width:26%">
                                        <p class="equipment-title">{{item.supplierName}}</p>
                                        <Button class="supplier-label" type="ghost" shape="circle" size="small" v-for="(btn,index) in item.labels" :key="index" v-show='btn.labelName!==""&&btn.labelName!==null'>{{btn.labelName}}</Button>
                                    </td>
                                    <td @click="seeinfo(index)">
                                        <p>
                                            {{item.supplierContactName}}
                                        </p>
                                    </td>
                                    <td @click="seeinfo(index)">{{item.supplierPhone}}</td>
                                    <td>
                                        <!-- <a href="javascript:" @click="seeinfo(index)" >查看详情|</a> -->
                                        <a href="javascript:" @click="editinfos(index)" v-show="limit.findIndex(e=>{return e.plPermission=='sup:edit'})!=-1">修改|</a>
                                        <a href="javascript:" @click="editinfost(index)" v-show="limit.findIndex(e=>{return e.plPermission=='sup:query'})!=-1">查看|</a>
                                        <a href="javascript:" @click="delinfo(index)" v-show="limit.findIndex(e=>{return e.plPermission=='sup:del'})!=-1">删除</a>
                                    </td>
                                </tr>
                            </template>
                            <tr v-else>
                                <td colspan="5">
                                    <p class="text-center fz-14">暂无数据</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="page">
                            <Page :total="pages" @on-change="supplierinfo" v-show="pages>10"></Page>
                        </div>

                    </div>
                </div>

            </div>
            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>

        </div>
        <promt :msginfo='del_info' @pro_ok="del(ind)"></promt>
    </div>
</template>

<script>
import Kloading from "../../common/loading/loading";
import promt from "../../common/prompt/prompt";

var supp = require("../../img/supper.svg");
export default {
    data() {
        return {
            keyword: "",
            ind: "",
            info: "",
            pages: 0,
            currentPage: 1,
            limit: JSON.parse(localStorage.getItem("limit")),
            supplierlist: [],

            label: [],
            labels: "",
            spinShow: true,
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要是删除当前行数据",
                modal2: false
            },
            supp: supp,
            //供应商分类
            classify: [
                {
                    name: "全部",
                    type: null
                },
                {
                    name: "设备供应商",
                    type: "0"
                },
                {
                    name: "保养供应商",
                    type: "1"
                },
                {
                    name: "计量机构",
                    type: "2"
                }
            ],
            liIndex:null
        };
    },
    created() {
        this.supplierinfo();
    },

    methods: {
        seeinfo(index) {
            localStorage.setItem(
                "supplierid",
                JSON.stringify(this.supplierlist[index].id)
            );
            this.$router.push("/index/supplierinfo");
        },

        jumpaddsupp() {
            this.$router.push("/index/supplier/addSupplier");
        },

        searchlist() {
            this.supplierinfo();
        },
        editinfost(index) {
            localStorage.setItem(
                "supplierid",
                JSON.stringify(this.supplierlist[index].id)
            );
            this.$router.push("/index/supplierinfo");
        },

        editinfos(index) {
            localStorage.setItem(
                "supplierid",
                JSON.stringify(this.supplierlist[index].id)
            );
            this.$router.push({
                path: "/index/supplierinfo",
                query: { status: true }
            });
        },
        //获取后台数据
        supplierinfo(page = 1) {
            this.spinShow = true;
            this.currentPage = page;
            let line = (page - 1) * 10;
            this.axios
                .post(
                    `/supplier/list`,

                    {
                        limit: 10,
                        offset: line,
                        params: {
                            keyword: this.keyword,
                            type: this.liIndex,
                            osId: this.$store.state.user_in.osId
                        }
                    }
                )
                .then(res => {
                    this.spinShow = false;
                    this.supplierlist = res.data.data;
                    this.pages = res.data.recordsTotal;
                })
                .catch(error => {
                    this.spinShow = false;
                    console.log(error);
                    this.$Message.warning("获取列表信息错误");
                });
        },
        //删除数据
        delinfo(index) {
            this.info = this.supplierlist[index].id;
            this.del_info.modal2 = true;
            this.ind = index;
        },

        del(ind) {
            this.axios
                .delete(`/supplier/${this.info}`)
                .then(res => {
                    // this.supplierinfo();
                    this.supplierlist.splice(ind, 1);
                    this.$Message.info("删除数据成功");
                })
                .catch(error => {
                    console.log(error);
                    this.$Message.warning("获取列表信息错误");
                });
        }
    },
    filters: {
        addZero(val) {
            if (typeof val === 'number') {
                return val < 10 ? '0' + val.toString() : val.toString();
            } else {
                return val;
            }
        }
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
            margin-top: 1px;
            line-height: 40px;
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
    .main {
        display: flex;
        margin-top: 20px;
        padding-bottom: 50px;
        min-height: 500px;
        .left-list {
            width: 20%;
            max-width: 250px;
            min-height: 200px;
            flex: 1;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px #dce0e6;
            > ul {
                li:nth-of-type(1){
                       background-color: #fafafa;
                }
                > li {
                    font-size: 14px;
                    padding: 18px 12px;
                    background-color: #f5f6fa;
                    border-bottom: solid 1px #dce0e6;
                    cursor: pointer;
                }
                .check-li {
                    border-left: 3px solid #01b0c7;
                    background: #fafafa;

                    > p {
                        color: #01b0c7;
                    }
                }
            }
        }
        .search {
            width: 20%;
            height: 1010px;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px #dce0e6;
            .search-box {
                margin: 20px 10px 10px;
            }
            li {
                display: flex;
                justify-content: space-between;
                padding: 22px;
                height: 56px;
                background-color: #ffffff;
                border: solid 1px #dce0e6;
                p:nth-child(1) {
                    font-size: 14px;
                }
                p:nth-child(2) {
                    font-size: 14px;
                    width: 40px;
                    height: 30px;
                    background-color: #ffffff;
                    border-radius: 15px;
                    border: solid 1px #dce0e6;
                    text-align: center;
                    margin-top: -8px;
                    line-height: 30px;
                }

                &:hover {
                    border-left: solid 1px #01b0c7;
                }
                &:hover p:nth-child(1) {
                    color: #01b0c7;
                }
                &:hover p:nth-child(2) {
                    border-color: #01b0c7;
                    color: #01b0c7;
                }
            }
            .add-info {
                text-align: center;
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
                cursor: pointer;
            }
        }
        .info {
            flex: 1;
            margin-left: 10px;
            background: #fafafa;
            border-radius: 3px;
            border: solid 1px #dce0e6;
            position: relative;
            .main-info {
                background: #fafafa;
                border: solid 1px rgba(2, 31, 57, 0.1);
                border-bottom: none;
                table {
                    border: none;
                    table-layout: fixed;
                    tr:nth-child(1) {
                        height: 40px;
                    }
                    tr:last-child {
                        border: none;
                    }
                    tr {
                        border: none;
                        border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                        // height: 80px;

                        text-align: left;
                        font-size: 14px;
                        &:not(.one):hover {
                            background: #f2f2f2;
                            cursor: pointer;
                        }
                        th {
                            color: #666666;
                            border: none;
                        }
                        td {
                            border: none;
                            padding: 10px 0;
                            font-size: 12px;
                            span {
                                font-size: 14px;
                                color: #999999;
                            }
                            .equipment-title {
                                color: #0c8399;
                                font-size: 14px;
                                /*margin-bottom: 8px;*/
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
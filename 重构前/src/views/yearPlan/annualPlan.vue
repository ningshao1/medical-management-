<template>
    <div>
        <div class="content">
            <div class="nav-title">
                <div class="nav-line"></div>
                <p>
                    <span>
                        <router-link to="/index/home"
                                     style=" color: #999;cursor:pointer ">首页</router-link>
                    </span>

                    <span style="color: #333333;cursor:pointer">
                        <i style="color:#01b0c7">> </i>年度计划</span>
                </p>
            </div>
            <div class="nav-sub">
                <h2><img :src='year'
                         style="vertical-align:middle;width:20px;margin-right: 5px;" />年度计划列表</h2>
                <!-- <Button type="primary" shape="circle" class="nav-btn" @click="addAsset" v-show="limit.findIndex(e=>{return e.plPermission=='ann:add'})!=-1">新增计划</Button> -->
                <Button @click="addAsset"
                        class="kld-btn"
                        icon="plus"
                        v-show="ViewLimit('ann:add')">新增计划</Button>
            </div>

            <div class="line"></div>
            <div class="retrieval singer_center"
                 style="height:auto!important;">
                <div class="retrieval-from flex_r"
                     style="align-items: center">
                    <!-- <div style="width:24%;">
                        <Select v-model="labellist"  multiple :disabled="status"  @on-change="searchlist">
                            <Option v-for="item in labels" :value="item.id" :key="item.labelName">{{ item.labelName }}</Option>
                        </Select>
                    </div> -->
                    <Input icon="ios-search"
                           style="width:20%;cursor:pointer;"
                           placeholder="申请人查找"
                           v-model="search.proposer"
                           @keyup.native="searchlist"></Input>
                    <Select v-model="search.model1"
                            style="width:20%"
                            placeholder="计划状态"
                            @on-change="searchlist">
                        <Option v-for="item in cityList"
                                :value="item.value"
                                :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="search.model2"
                            style="width:20%"
                            placeholder="采购类型"
                            @on-change="searchlist">
                        <Option v-for="item in cityList1"
                                :value="item.value"
                                :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div class='flex_r'
                         style="width: 22%;">
                        <DatePicker :editable="false"
                                    @on-change="getStartTime"
                                    format="yyyy-MM-dd"
                                    placeholder="申请开始时间"
                                    style="width: 48%;"
                                    v-model="time3"></DatePicker>
                        <span style="line-height: 45px;font-size:14px;">至</span>
                        <DatePicker :editable="false"
                                    @on-change="getStartTime1"
                                    format="yyyy-MM-dd"
                                    placeholder="申请结束时间"
                                    style="width: 48%;"
                                    v-model="time4"></DatePicker>
                    </div>
                    <div class="retrieval-btn"
                         style="width: 16%;">
                        <Button @click="reset">重置</Button>
                        <Button class="btn-active kld-btn"
                                icon="android-search"
                                @click="searchlist"
                                v-show="limit.findIndex(e=>{return e.plPermission=='ann:query'})!=-1">检索</Button>
                    </div>
                </div>

            </div>
            <div class="main">
                <Row :gutter="10"
                     class='plan_c'>
                    <div class='c_left'>
                        <div class="main-tab">
                            <kld-search-tree placeholder="科室名称搜索">
                                <kld-tree slot="tree"
                                          ref="section-tree"
                                          :data="data1"
                                          title-key="osName"
                                          children-key="lists"
                                          highlight-current
                                          first-expanded
                                          @current-change="select_c"></kld-tree>
                            </kld-search-tree>
                            <!--<Tree :data="data1" expand='false' @on-select-change='select_c' :render='renderContent'></Tree>-->
                        </div>
                    </div>
                    <Col class='c_right'>
                    <div class="main-info">
                        <div class="info_c">
                            <Kloading v-if="spinShow"></Kloading>
                            <table class='table-stripe'
                                   width="100%"
                                   border="1"
                                   style="border-collapse:collapse;overflow:auto;">
                                <tr class="one"
                                    style="height:42px">
                                    <th>申请时间</th>
                                    <th>采购类型</th>
                                    <th>申请人</th>
                                    <th>申请科室</th>
                                    <th>状态</th>
                                </tr>
                                <tr v-for='(item,index) in list_jihua'
                                    :key='index'
                                    @click="seeinfo(index,item.id)">
                                    <td>
                                        <p class="equipment-title">{{item.ar_time}}</p>
                                    </td>
                                    <td>
                                        {{item.ar_type=="0"?"0-10万元":(item.ar_type=="1"?"10-50万元":"50万元以上")}}
                                    </td>
                                    <td>
                                        <poptip-show-info :info-id="item.u_id">{{item.uName}}</poptip-show-info>
                                    </td>
                                    <td>{{item.osName}}</td>
                                    <td class="progress">
                                        <span v-if="item.ar_plan==1"
                                              style="color:#5ba4c8">
                                            已提交
                                        </span>
                                        <span v-else>
                                            已公示
                                        </span>

                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="page">
                            <Page :total="pages"
                                  @on-change="getinfo"
                                  v-show="pages>10"></Page>
                        </div>
                    </div>
                    </Col>
                </Row>
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
import poptipShowInfo from "@common/poptip-show-info";
import KldSearchTree from "@common/kld-search-tree";
import KldTree from "@common/kld-tree";
import years from "../../img/year.svg";
export default {
    data() {
        return {
            year: years,
            status: false,
            time3: "",
            time4: "",
            labels: [],
            labellist: [],
            user_info: JSON.parse(localStorage.getItem("user_in")),
            pages: 0,
            limit: JSON.parse(localStorage.getItem("limit")),
            s: "",
            e: "",
            search: {
                model1: "",
                model2: "",
                stime: "",
                etime: "",
                proposer: "" //申请人字段
            },
            cityList: [
                {
                    value: "1",
                    label: "已提交"
                },
                {
                    value: "2",
                    label: "已公示"
                },
                {
                    value: "q",
                    label: "全部"
                }
            ],

            cityList1: [
                {
                    value: "0",
                    label: "0-10万元"
                },
                {
                    value: "1",
                    label: "10-50万元"
                },
                {
                    value: "2",
                    label: "50万元以上"
                },
                {
                    value: "q",
                    label: "全部"
                }
            ],

            data1: [],
            spinShow: true, //控制加载框
            keys: null, //树的当前点击的key

            //列表数据
            list_jihua: [],
            office_id: localStorage.getItem("user_in").osId
        };
    },
    created() {
        this.getinfo();
        this.get_os_info();
        //this.getlabel();
    },
    methods: {
        //获取医院标签接口接口
        getlabel() {
            this.axios
                .get(`labelOrgstructs/${this.user_info.osId}/list?type=${1}`)
                .then(res => {
                    this.labels = res.data;
                    this.getlabels();
                })
                .catch(error => {
                    this.$Message.warning("获取标签失败");
                });
        },

        //获取标签数据
        getlabels() {
            this.axios
                .get(`labels/${1}`)
                .then(res => {
                    this.labels.push(res.data);
                })
                .catch(error => {
                    this.$Message.warning("获取标签失败");
                });
        },
        addAsset() {
            let id = this.office_id || null;
            this.$router.push({ name: "addPlan", params: { id: "" } });
            //this.$router.push("/addPlan");
        },

        //查看信息
        seeinfo(index, id) {
            if (!this.ViewLimit("ann:query")) {
                this.$Message.warning("您没有权限查看该详情");
                return;
            }
            console.log(id);
            this.$router.push({ name: "paln-detail", params: { id: id } });
        },
        //获取树数据
        get_os_info() {
            let that = this;
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.axios
                .get(`orgstruct/findAllTree/${osid}`, {})
                .then(res => {
                    let x = res.data;
                    x.expand = true;
                    that.data1 = [x];
                    that.data1[0]["render"] = (h, { root, node, data }) => {
                        return h(
                            "span",
                            {
                                style: {
                                    display: "inline-block",
                                    width: "100%",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                },
                                on: {
                                    click: () => {
                                        this.select_c([data]);
                                        this.keys = node.nodeKey;
                                    }
                                }
                            },
                            [
                                h("span", [
                                    h("Icon", {
                                        props: {
                                            type: "android-folder"
                                        },
                                        style: {
                                            fontSize: "16px",
                                            marginRight: "3px"
                                            //color:'#459ca2'
                                        }
                                    }),
                                    h("span", {
                                        style: {
                                            padding: "0 8px",
                                            "border-radius": "3px"
                                        },
                                        domProps: {
                                            innerHTML: data.title
                                        },
                                        attrs: {
                                            class: "ivu-tree-title"
                                        },
                                        class: {
                                            "ivu-tree-title-selected":
                                                this.keys == data.nodeKey
                                        }
                                    })
                                ]),
                                h("span", {
                                    style: {
                                        display: "inline-block",
                                        float: "right",
                                        marginRight: "32px"
                                    }
                                })
                            ]
                        );
                    };
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //搜索数据
        searchlist() {
            this.spinShow = true;
            // let key = document.querySelector(".ivu-select-input").value;
            this.axios
                .post(
                    `annualplan/annualplanList`,

                    {
                        limit: 10,
                        offset: 0,
                        params: {
                            // keyword: key,
                            startTime: this.search.stime.slice(0, 10),
                            endTime: this.search.etime.slice(0, 10),
                            plan:
                                this.search.model1 !== "q"
                                    ? this.search.model1
                                    : "",
                            type:
                                this.search.model2 !== "q"
                                    ? this.search.model2
                                    : "",
                            username: this.search.proposer
                        }
                    }
                )
                .then(res => {
                    this.list_jihua = res.data.data;
                    this.spinShow = false;
                    this.pages = res.data.recordsTotal;
                })
                .catch(error => {
                    console.log(error);
                    this.$Message.warning("没有查到相关数据");
                    this.spinShow = false;
                });
        },
        //开始时间
        getStartTime(data) {
            this.search.stime = data;
            this.getinfo();
        },
        //结束时间
        getStartTime1(data) {
            this.search.etime = data;
            this.getinfo();
        },

        //重置信息
        reset() {
            this.labellist = [];
            this.time3 = "";
            this.time4 = "";
            this.search = {
                model1: "",
                model2: "",
                stime: "",
                etime: ""
                // people: ""
            };
            this.$refs["section-tree"].setCurrentKey(null);
            this.getinfo();
        },

        // 获取列表数据
        getinfo(page = 1) {
            this.spinShow = true;
            let line = (page - 1) * 10;
            this.axios
                .post(`annualplan/annualplanList`, {
                    limit: 10,
                    offset: line,
                    params: {
                        startTime: this.search.stime,
                        endTime: this.search.etime,
                        plan: this.search.model1,
                        type: this.search.model2,
                        labelIds: this.labellist,
                        username: this.search.proposer,
                        osid: this.office_id
                    }
                })
                .then(res => {
                    this.list_jihua = res.data.data;
                    this.pages = res.data.recordsTotal;
                    this.spinShow = false;
                })
                .catch(error => {
                    this.spinShow = false;
                });
        },
        select_c(e) {
            this.spinShow = true;
            this.office_id = e ? e.id : "";
            this.getinfo();
        },
        //iview 树状图图标显示
        renderContent(h, { root, node, data }) {
            return h(
                "span",
                {
                    style: {
                        display: "inline-block",
                        width: "100%",
                        cursor: "pointer",
                        fontSize: "14px"
                    },
                    on: {
                        click: () => {
                            this.select_c([data]);
                            this.keys = node.nodeKey;
                        }
                    }
                },
                [
                    h("span", [
                        h("Icon", {
                            props: {
                                type: "android-folder-open"
                            },
                            style: {
                                marginRight: "3px",
                                fontSize: "16px"
                                //color:'#cce2ea'
                            }
                        }),
                        h("span", {
                            style: {
                                padding: "0 8px",
                                "border-radius": "3px"
                            },
                            domProps: {
                                innerHTML: data.title
                            },
                            attrs: {
                                class: "ivu-tree-title"
                            },
                            class: {
                                "ivu-tree-title-selected":
                                    this.keys == data.nodeKey
                            }
                        })
                    ]),
                    h("span", {
                        style: {
                            display: "inline-block",
                            float: "right",
                            marginRight: "32px",
                            fontSize: "14px"
                            //background:'red'
                        }
                    })
                ]
            );
        }
    },
    components: {
        Kloading,
        KldTree,
        KldSearchTree,
        poptipShowInfo
    }
};
</script>

<style scoped lang="less">
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        margin-top: 14px;
        .nav-line {
            height: 16px;
            width: 4px;
            background-color: #76bdc1;
            display: inline-block;
        }
        > p {
            margin-left: 6px;
            display: inline-block;
            font-size: 14px;
            color: #999999;
            position: relative;
            top: -3px;
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
            width: 95px;
            height: 40px;
            background-color: #22a1b9;
            //border-radius: 22px;
            font-size: 12px;
            border: solid 1px #0c8399;
        }
    }

    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .retrieval {
        height: 146px;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        padding: 20px;
        margin-top: 20px;
        .retrieval-from {
            .inp {
                height: 45px;
            }
        }

        .retrieval-btn {
            //margin-top: 20px;
            text-align: center;
            .ivu-btn {
                width: 72px;
                height: 38px;
            }
            .btn-active {
                margin-left: 20px;
                background-color: #22a1b9;
                color: #fff;
            }
        }
    }

    .main {
        margin-top: 20px;
        .main-tab {
            background: #fafafa;
            border: solid 1px rgba(2, 31, 57, 0.1);
            overflow: auto;
            padding: 20px;
            box-sizing: border-box;
            height: 600px;
            .tab-input {
                padding-left: 20px;
                padding-right: 20px;
            }
            .tab-line {
                height: 1px;
                background: rgba(2, 31, 57, 0.1);
                margin-top: 10px;
            }
            .nav-list {
                margin-top: 25px;
                li {
                    margin-left: 10px;
                    font-size: 14px;
                    color: #333333;
                    margin-bottom: 20px;
                    padding-left: 20px;
                    &:hover {
                        height: 21px;
                        background-color: #d9e9ef;
                        border-radius: 3px;
                    }
                }
            }
        }

        .main-info {
            background: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            height: 600px;
            box-sizing: border-box;
            overflow: hidden;
            position: relative;
            padding-bottom: 60px;
            .info_c {
                height: 100%;
                overflow: auto;
                position: relative;
            }
            table {
                border: none;
                tr:nth-child(1) {
                    height: 40px;
                }
                tr:last-child {
                    border: none;
                }
                tr {
                    border: none;
                    border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                    padding: 10px 0;
                    text-align: center;
                    font-size: 14px;

                    &:not(.one):hover {
                        background: #f2f2f2;
                        cursor: pointer;
                    }
                    th {
                        color: #666666;
                        border: none;
                        width: 20%;
                    }
                    td {
                        padding: 10px 0;
                        border: none;
                        width: 20%;
                        span {
                            font-size: 14px;
                            color: #999999;
                        }
                        .equipment-title {
                            font-size: 16px;
                        }
                    }

                    .progress {
                        span {
                            display: inline-block;
                            color: #8fc31f;
                            text-align: center;
                        }
                    }
                }
            }
            .page {
                margin-top: 20px;
                text-align: center;
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
}

.plan_c {
    display: flex;
    flex-direction: row;
    .c_left {
        flex: none;
        width: 20% !important;
    }
    .c_right {
        flex: 1;
        height: 600px;
    }
}
</style>
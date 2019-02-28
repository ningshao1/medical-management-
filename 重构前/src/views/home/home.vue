<template>
    <div>
        <div class="content">

            <div class="nav-title">
                <div class="nav-line"></div>
                <p style="cursor:pointer">首页</p>
            </div>
            <h2><img :src='homgSvg'
                     style="vertical-align:middle;width: 25px;margin-right: 5px;" />控制台</h2>
            <div class="line"></div>
            <div class="main">
                <div class="top">
                    <div v-if="ViewLimit('fr:list')"
                         class="equipment"
                         style="padding:0px;background:#fafafa">
                        <Kloading v-if="spinShow"></Kloading>
                        <table class="table-stripe"
                               width="100%"
                               border="1"
                               style="border-collapse:collapse;cursor: pointer;">
                            <tr style="height:42px;">
                                <th style="padding-left:40px;">设备名称</th>
                                <th>设备信息</th>
                                <th>工程师</th>
                                <th>报单时间</th>
                                <th>工单状态</th>
                            </tr>
                            <tr v-for="(items,index) in info"
                                :key="index"
                                @click="details(index)"
                                ref="bgcolor"
                                @mouseover="over(index)"
                                @mouseout="out(index)">
                                <td style="padding-left:40px; width: 25%;">
                                    <p class="equipment-title">{{items.assetName}}</p>
                                    <Button type="ghost"
                                            shape="circle"
                                            size="small"
                                            v-for="(i ,n) in items.labels"
                                            :key="n"
                                            v-show='i.labelName!==""&&i.labelName!==null'
                                            style="margin-right:10px;border-color:#ccc;color:#666666;margin-bottom: 5px;">{{i.labelName}}</Button>
                                </td>
                                <td style="width:20%">
                                    <span style="color:#666666;font-size: 12px;">型号：{{items.assetClass}}</span><br>
                                    <span style="color:#666666;font-size: 12px;">品牌：{{items.brandName}}</span>
                                </td>
                                <td style="width:20%">{{items.type!=0?items.userName:"暂无"}}</td>
                                <td style="width:20%">{{items.reportDate}}</td>
                                <td v-show="singer3"
                                    style="width:20%">
                                    <p class="active">{{items.type==0?"待接单":(items.type==1?"维修中":(items.type==2?"待验收 ":"已完修"))}}</p>
                                </td>
                                <td v-show="!singer3">
                                    <p class="active">{{items.type==0?"已报单":(items.type==1?"维修中":(items.type==2?"待验收 ":"已完修"))}}</p>
                                </td>
                            </tr>

                        </table>
                        <div class="whole"
                             @click="checkList"
                             style="margin-bottom:20px;margin-right: 15px">
                            <p>查看全部列表</p>
                            <img src="./image/whole.png"
                                 alt=""
                                 style="width:17px;height:17px">
                        </div>
                    </div>
                    <div class="report"
                         v-if="reportData"
                         style="background:#fafafa">
                        <h3>数据报表</h3>
                        <div class="report-line"></div>
                        <ul>
                            <li>
                                <p class="report-title">采购论证报表</p>
                                <div class="report-time"><img src="./image/time.png"
                                         alt="">2017-11-20</div>
                            </li>
                            <li>
                                <p class="report-title">采购论证报表</p>
                                <div class="report-time"><img src="./image/time.png"
                                         alt="">2017-11-20</div>
                            </li>
                            <li>
                                <p class="report-title">采购论证报表</p>
                                <div class="report-time"><img src="./image/time.png"
                                         alt="">2017-11-20</div>
                            </li>
                            <li>
                                <p class="report-title">采购论证报表</p>
                                <div class="report-time"><img src="./image/time.png"
                                         alt="">2017-11-20</div>
                            </li>
                        </ul>
                        <div class="whole">
                            <p>查看更多</p>
                            <img src="./image/whole.png"
                                 alt=""
                                 style="width:17px;height:17px">
                        </div>
                    </div>
                </div>

                <div class="task-list"
                     style="background:#fafafa">
                    <Row :gutter="20">
                        <Col v-if="ViewLimit('pm:one:task') || ViewLimit('pm:two:task') || ViewLimit('pm:three:task')"
                             span="6">
                        <task title='保养任务'>
                            <div slot="btn">
                                <Row :gutter="16">
                                    <Col span="12">
                                    <Button>制定任务</Button>
                                    </Col>
                                    <Col span="12">
                                    <Button>执行任务</Button>
                                    </Col>
                                </Row>
                            </div>
                        </task>
                        </Col>
                        <Col v-if="ViewLimit('pm:adverseevent')"
                             span="6">
                        <div class="task-echart"
                             style="background:#fafafa">
                            <div class="task-head">
                                <div class="task-title">
                                    <div class="vertical"></div>
                                    <p>不良事件</p>
                                </div>

                                <div class="task-whole">
                                    <p>查看更多</p>
                                    <img src="./image/whole.png"
                                         alt="">
                                </div>
                            </div>
                            <div class='echart_info'>
                                暂无数据
                            </div>

                        </div>

                        </Col>
                        <Col v-if="ViewLimit('pm:measurement')"
                             span="6">
                        <task title='计量任务'>
                            <div slot="btnList">
                                <Row :gutter="8">
                                    <Col span="8">
                                    <Button>制定任务</Button>
                                    </Col>
                                    <Col span="8">
                                    <Button>执行任务</Button>
                                    </Col>
                                    <Col span="8">
                                    <Button>验收任务</Button>
                                    </Col>
                                </Row>
                            </div>
                        </task>
                        </Col>
                        <Col v-if="ViewLimit('pm:inspection:task')"
                             span="6">
                        <task>
                            <div slot="btn">
                                <Row :gutter="16">
                                    <Col span="12">
                                    <Button>制定任务</Button>
                                    </Col>
                                    <Col span="12">
                                    <Button>上传报告</Button>
                                    </Col>
                                </Row>
                            </div>
                        </task>
                        </Col>
                    </Row>

                    <div class="file"
                         style="background:#fafafa"
                         v-if="ViewLimit('excel:list')">
                        <div class="file-title"
                             style=" margin-top:0px; margin-bottom:10px">
                            常用文档下载
                            <div @click="checkDocument">
                                <span style="color: #01b0c7;font-size: 14px;margin-right: 11px; cursor: pointer;">查看更多</span>
                                <img src="./image/whole.png"
                                     alt=""
                                     style="width:15px;height:15px;cursor: pointer;">
                            </div>
                        </div>
                        <div class="file-line"></div>
                        <ul class="file-list"
                            style="cursor:pointer">
                            <li v-for="(item,index) in imgData"
                                :key="index"
                                @click="download(index)">
                                <img :src="item"
                                     alt=""
                                     style="width: 64px;" />
                                <p>下载</p>
                            </li>

                        </ul>
                        <ul class="file-msg">
                            <li v-for="(item,index) in newData"
                                :key="index">{{item.fileName}}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="copy">
                Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>

    </div>
</template>

<script>
import task from "../.././components/task";
import Kloading from "../../common/loading/loading";
var homgSvg = require("../../img//home.svg");
export default {
    components: {
        task,
        Kloading
    },
    data() {
        return {
            reportData: false,
            singer3: true,
            info: [],
            user_info: "",
            declarationId: "",
            documentData: "",
            newData: [],
            documentId: "",
            filename: "",
            filenameData: [],
            imgUrl: require("./image/word.png"),
            spinShow: true,
            power: "",
            imgData: [],
            homgSvg: homgSvg //标题图标
        };
    },
    computed: {
        doneTodosCount() {
            return this.$store.state.list + "前端";
        }
    },
    created() {
        this.homeList();
        this.query();
    },
    methods: {
        checkList() {
            this.$router.push({ name: "singer-center" });
        },
        //控制台报单数据渲染
        homeList() {
            this.user_info = JSON.parse(localStorage.getItem("user_in"));
            let uid = this.user_info.id;
            this.power = JSON.parse(localStorage.getItem("user_in"));
            let powerRoles = this.power.roles;
            powerRoles.forEach(items => {
                if (items.srName == "CHIEF" || items.srName == "ENGINEER") {
                    this.axios
                        .post("/faultReport/list", {
                            limit: 10,
                            offset: 0,
                            params: {
                                userId: uid
                            }
                        })
                        .then(res => {
                            this.spinShow = false;

                            this.info = res.data.data.slice(0, 4);
                        })
                        .catch(err => {
                            this.spinShow = false;
                        });
                } else if (items.srName == "DOCTOR") {
                    this.singer3 = false;
                    this.axios
                        .post("/faultReport/list", {
                            limit: 10,
                            offset: 0,
                            params: {
                                userId: uid
                            }
                        })
                        .then(res => {
                            this.spinShow = false;

                            this.info = res.data.data.slice(0, 4);
                        })
                        .catch(err => {
                            this.spinShow = false;
                        });
                }
            });
        },
        over(index) {
            this.$refs.bgcolor[index].style.background = "#f2f2f2";
        },
        out(index) {
            // this.$refs.bgcolor[index].style.background = "#fff";
            this.$refs.bgcolor[index].style.background = "#fafafa";
        },
        //每个设备进行查看
        details(index) {
            this.$router.push({
                name: "singer-detail",
                query: { id: this.info[index].id }
            });
        },
        //常用文档查看更多
        checkDocument() {
            this.$router.push({ path: "/index/formManage" });
        },
        //获取文档页面数据
        query() {
            let oid = JSON.parse(localStorage.getItem("user_in")).osId;
            let that = this;

            this.axios
                .post("/fileUplod/filelist", {
                    limit: 8,
                    offset: 0,
                    params: {
                        osid: oid
                    }
                })
                .then(res => {
                    this.documentData = res.data.data;

                    this.documentData.forEach(element => {
                        if (element.type == 1) this.newData.push(element);
                    });

                    this.newData.forEach(elem => {
                        this.filename = elem.fileName.substring(
                            elem.fileName.lastIndexOf(".") + 1
                        );
                        this.filenameData.push(this.filename);
                    });
                    this.filenameData.forEach(e => {
                        if (e == "docx" || e == "doc") {
                            this.imgUrl = require("./image/word.png");
                            this.imgData.push(this.imgUrl);
                            // that="./image/word.png"
                        } else if (e == "xls" || e == "xlsx") {
                            this.imgUrl = require("./image/excel.png");
                            this.imgData.push(this.imgUrl);
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //下载文档
        download(index) {
            this.documentId = this.newData[index].id;

            let id = this.documentId;

            this.axios
                .get(`fileUplod/${id}`)
                .then(res => {
                    this.$Message.success("下载成功");
                })
                .catch(err => {
                    console.log(err);
                });
        }
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
            font-size: 12px;
            color: #999999;
            position: relative;
            top: -3px;
        }
    }
    h2 {
        font-weight: normal;
        color: #333333;
        font-size: 16px;
        margin-top: 2px;
    }
    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .main {
        margin-top: 20px;
        padding-bottom: 50px;
        .top {
            display: flex;
            justify-content: space-between;
            .equipment {
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                padding: 20px;
                padding-top: none;
                width: 100%;
                position: relative;
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
                        height: 52px;
                        text-align: left;
                        font-size: 14px;
                        th {
                            color: #666666;
                            border: none;
                        }
                        td {
                            border: none;
                            padding: 8px 0;
                            span {
                                font-size: 12px;
                                color: #999999;
                            }
                            .equipment-title {
                                color: #0c8399;
                                font-size: 14px;
                                margin-bottom: 8px;
                            }
                            .active {
                                color: #5ba4c8;
                            }
                        }
                    }
                }
            }
            .report {
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                padding: 22px;
                padding-top: none;
                width: 19%;
                h3 {
                    color: #666666;
                    font-size: 14px;
                    font-weight: normal;
                }
                .report-line {
                    background: rgba(2, 31, 57, 0.1);
                    height: 1px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                }
                li {
                    height: 65px;
                    margin-bottom: 10px;
                    background-color: #ffffff;
                    border-radius: 3px;
                    border: solid 1px rgba(2, 31, 57, 0.1);
                    border-left: 4px solid #76bdc1;
                    padding-left: 16px;
                    .report-title {
                        margin-top: 10px;
                        font-size: 14px;
                        color: #333333;
                    }
                    .report-time {
                        margin-top: 5px;
                        color: #cccccc;
                        font-size: 14px;
                        img {
                            display: inline-block;
                            margin-right: 10px;
                            position: relative;
                            top: 3px;
                        }
                    }
                }
            }
        }

        .task-list {
            margin-top: 20px;
            .ivu-btn {
                width: 100%;
                height: 44px;
                background-color: #22a1b9;
                color: #ffffff;
            }
        }
        .task-echart {
            .echart_info {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            position: relative;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            padding: 20px;
            height: 300px;
            background-color: #ffffff;
            .task-head {
                display: flex;
                justify-content: space-between;
                .task-title {
                    display: flex;
                    .vertical {
                        width: 4px;
                        height: 30px;
                        background-color: #76bdc1;
                        color: #333333;
                    }
                    > p {
                        margin-left: 12px;
                        font-size: 14px;
                        line-height: 30px;
                    }
                }
                .task-whole {
                    display: flex;
                    align-items: center;
                    > p {
                        color: #01b0c7;
                        font-size: 12px;
                        margin-right: 11px;
                        line-height: 30px;
                    }
                    img {
                        width: 14px;
                        height: 14px;
                    }
                }
            }
            .amount {
                margin-top: 27px;
                height: 105px;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                text-align: center;
                .amout-num {
                    margin-top: 28px;
                    font-size: 18px;
                    color: #333333;
                }
                .amout-active {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #999999;
                }
            }
            .plan {
                margin-top: 20px;
                font-style: 14px;
                color: #333333;
            }
            .plan-circle {
                margin-top: 20px;
                width: 90px;
                height: 90px;
                margin: 0 auto;
            }
            .amount-data {
                margin-top: 40px;
                ul {
                    display: flex;
                    justify-content: flex-end;
                    li {
                        font-size: 14px;
                        color: #333333;
                        margin-left: 20px;
                        line-height: 20px;
                        border-bottom: 3px solid #5ba4c8;
                    }
                }
            }
            .task-line {
                height: 1px;
                background: rgba(2, 31, 57, 0.1);
                margin-top: 10px;
                margin-bottom: 20px;
            }
        }
        .file {
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            margin-top: 10px;
            padding: 10px 20px;
            .file-title {
                margin-top: 10px;
                font-size: 14px;
                color: #666666;
                margin-bottom: 18px;
                display: flex;
                justify-content: space-between;
            }
            .file-line {
                height: 1px;
                background: rgba(2, 31, 57, 0.1);
                margin-bottom: 10px;
            }
            .file-list {
                display: flex;
                text-align: center;
                li {
                    width: 102px;
                    height: 120px;
                    border-radius: 3px;
                    border: solid 1px #dcdcdc;
                    margin-right: 20px;
                    padding-top: 26px;
                    position: relative;
                    &:hover {
                        border: solid 1px #22a1b9;
                    }
                    &:hover p {
                        display: block;
                    }
                    p {
                        position: absolute;
                        bottom: 0;
                        height: 30px;
                        background-color: rgba(2, 31, 57, 0.45);
                        border-radius: 0px 0px 2px 2px;
                        opacity: 0.45;
                        color: #ffffff;
                        font-size: 14px;
                        line-height: 30px;
                        width: 100%;
                        display: none;
                        cursor: pointer;
                    }
                }
            }
            .file-msg {
                display: flex;
                text-align: center;
                font-size: 12px;
                margin-top: 10px;
                li {
                    word-break: break-all;
                    width: 102px;
                    margin-right: 20px;
                    color: #666666;
                }
            }
        }
    }
}

.ivu-btn-ghost {
    color: #ccc;
}
.whole {
    display: flex;
    justify-content: flex-end;
    > p {
        color: #01b0c7;
        font-size: 14px;
        margin-right: 11px;
        cursor: pointer;
    }
}
</style>
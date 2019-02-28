<template>
    <div>
        <div class="content">
            <div class="main">
                <Row :gutter="10">
                    <div style="padding:0 30px 20px 30px; background:#fafafa">
                        <!-- <h3>基础信息</h3>
                        <span></span>
                        <div class="line"></div>
                        <div class="details" style="background:#fafafa">
                            <div class="details-title">
                                <p class="title" style="margin-left: 3px;">资产名称：{{infos.assetName}}</p>
                                <p class="bload" style="width:600px">
                                    <span style="display:block;text-align:left;width:49%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-left:5px;">
                                        <span style="width:60px;">资产编码：</span>
                                        <span>{{infos.assetCode | UpCose }}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                                        <span style="width:60px;">品牌名称：</span>
                                        <span>{{infos.brandName}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-left:5px;">
                                        <span style="width:60px;">资产型号：</span>
                                        <span>{{infos.assetClass}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                                        <span style="width:60px;">类别名称：</span>
                                        <span>{{infos.assertTypeName}}{{breatheTypes[infos.breatheType]}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-left:5px;">
                                        <span style="width:60px;">设备SN号：</span>
                                        <span>{{infos.assetSN}}</span>

                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">
                                        <span style="width:60px;">编码类别：</span>
                                        <span>{{infos.assertTypeCode}}</span>

                                    </span>
                                </p>
                                <Button type="ghost" shape="circle" size="small" v-for="(item,index) in infos.labels" :key="index" style="margin-top:10px;margin-right:10px;width:100px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" v-show="item.labelName!=null&&item.labelName!=''">{{item.labelName}}</Button>
                            </div>
                            <div class="details-contract">
                                <div class="contract" style="cursor:pointer" v-if="infos.contractCode" @click='jump(infos.contractId)'>
                                    <div class="complete">已完善</div>
                                    <p>查看合同</p>
                                    <img src="../../image/asset.png" alt="">
                                </div>
                                <div class="contract" @click="modal7=true" style="cursor:pointer" v-else>
                                    <p>关联合同</p>
                                    <img src="../../image/asset.png" alt="">
                                </div>
                                <div class="code">
                                    <img :src="infos.qrCode?'data:image/png;base64,'+infos.qrCode:''" alt="">
                                </div>
                            </div>
                        </div> -->
                        <h3>维修信息</h3>
                        <div class="line"></div>
                        <div class="tab" style="background:#fafafa">

                            <table class="table-stripe" width="100%" border="1" style="border-collapse:collapse;background:#fafafa">
                                <colgroup>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                    <col>
                                </colgroup>
                                <thead>
                                    <tr class="one" style="height:38px;background:#fafafa; border-bottom: solid 1px rgba(2, 31, 57, 0.1);">
                                        <th style="padding-left:40px;">设备名称</th>
                                        <th>设备信息</th>
                                        <th>所属科室</th>
                                        <th>分类</th>
                                        <th>报单时间</th>
                                        <th>工程师</th>
                                        <th>进程</th>
                                    </tr>
                                </thead>

                                <tbody v-if="infolist.length>0">
                                    <tr v-for="(item,index) in infolist" :key="index" @click="jump_(item.id)">
                                        <td style="padding-left:40px;width:20%;">
                                            <p class="equipment-title">{{item.assetName}}</p>
                                            <Button type="ghost" shape="circle" size="small" v-for="(btn,index) in infolist.labels" :key="index">{{item.labelName}}</Button>
                                        </td>
                                        <td style="width: 14%;">
                                            <span>型号：{{item.assetClass}}</span><br>
                                            <span>品牌：{{item.brandName}}</span>
                                        </td>
                                        <td style="width: 10%;">{{item.osName}}</td>
                                        <td style="width: 28%;">{{item.typeName}}</td>
                                        <td>{{$store.state.localeDate(item.reportDate)}}</td>
                                        <td>
                                            <template v-if="item.userName">
                                                <poptip-show-info :info-id="item.userId">
                                                    {{item.userName}}
                                                </poptip-show-info>
                                            </template>
                                            <template v-else>
                                                "暂无"
                                            </template>
                                        </td>
                                        <td>
                                            <!-- <p class="active">{{item.type=="0"?"已报单":(item.type=="1"?"维修中":(item.type=="2"?"待验收":(item.type=="3"?"已完修":"转交中")) )}}</p> -->
                                            <p class="active">{{fliterType(item.type)}}</p>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td colspan="7" style="text-align:center">暂无数据</td>
                                    </tr>
                                </tbody>

                            </table>
                            <div class="page">
                                <Page :total="pages" @on-change="getlist" v-show="pages>10"></Page>
                            </div>
                        </div>
                    </div>

                </Row>
            </div>

        </div>
    </div>
</template>

<script>
var keshi = require("../../../../img/keshi.svg");
var femlie = require("../../../../img/femlie.svg");
import pop from "@common/prompt/prompt";
import ImageView from "@common/imageView/ImageView";
import confirm from "@common/kld-confirm/index.js";
import poptipShowInfo from "@common/poptip-show-info";
export default {
    props: {
        loaded: {
            type: Function
        }
    },
    data() {
        return {
            label: h => {
                return h("div", [
                    h("img", {
                        domProps: {
                            src: keshi
                        },
                        style: {
                            verticalAlign: "middle",
                            width: "15px",
                            marginRight: "5px",
                            marginBottom: "5px"
                        }
                    }),
                    h("span", "科室列表")
                ]);
            },
            labelss: h => {
                return h("div", [
                    h("img", {
                        domProps: {
                            src: femlie
                        },
                        style: {
                            verticalAlign: "middle",
                            width: "15px",
                            marginRight: "5px",
                            marginBottom: "5px"
                        }
                    }),
                    h("span", "分类列表")
                ]);
            },
            user_info: this.$store.state.user_in,
            office_id: this.$store.state.user_in.osId, //默认科室
            assertType_id: "",
            data1: [],
            pagees: 0,
            relation: true,
            infos: {
                //设备图片
                photos: []
            },
            infolist: "",
            pages: 0,
            modal7: false,
            contractlist: [],
            pagess: "",
            num: 0,
            infot: "",
            tab_index: "1",
            numDetail: [],
            typecodes: "", //打印的内容
            breatheTypes: {
                1: "",
                2: "(无创呼吸机)",
                3: "(有创呼吸机)"
            }
        };
    },
    computed: {
        info() {
            return this.$route.params.id;
        },
        ci() {
            return `维修记录(${this.num})次`;
        }
    },
    created() {
        this.getinfo();
        this.getlist();
    },
    // watch: {
    //     $route: "goBack"
    // },
    components: {
        pop,
        ImageView,
        poptipShowInfo
    },
    methods: {
        fliterType(type) {
            console.log(type);
            let types = {
                0: "待接单",
                1: "维修中",
                2: "待验收",
                3: "已完修",
                4: "转交中",
                5: "已撤回"
            };
            return types[type] || "";
        },
        searchlable(index) {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.axios

                .post(
                    `/contracts/${osid}/list`,

                    {
                        limit: 8,
                        offset: 0,
                        params: {
                            contractType: index
                        }
                    }
                )
                .then(res => {
                    this.contractlist = res.data.data;
                    this.pagees = res.data.recordsTotal;
                    this.spinShow = false;
                })
                .catch(error => {
                    this.$Message.error("获取列表信息错误");
                    this.spinShow = false;
                });
        },
        goBack() {
            this.$router.push({
                name: "asset-config",
                params: { id: this.info }
            });
        },
        back() {
            this.$router.go(-1);
        },
        //获取数据
        getinfo() {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.$axios
                .get(`assets/${osid}/${this.info}`, {})
                .then(res => {
                    if (typeof res.data.assetCode == "string") {
                        this.typecodes = res.data.assetCode.toUpperCase();
                    }

                    // this.infos = res.data;
                    this.infos = this.$route.query.num;
                    if (this.infos == null) {
                        this.infos = res.data;

                        res.data.purchaseAmount == 0
                            ? (this.infos.purchaseAmount = "")
                            : (this.infos.purchaseAmount =
                                  res.data.purchaseAmount);
                        this.num = res.data.repairCount
                            ? res.data.repairCount
                            : 0;
                    } else {
                        this.infos = this.$route.query.num;
                    }
                    this.loaded();
                })
                .catch(error => {
                    this.loaded();
                });
        },
        // //获取维修数据
        getlist(page = 1) {
            let line = (page - 1) * 10;
            this.axios
                .post(`faultReport/faultReportByAsId`, {
                    limit: 10,
                    offset: line,
                    params: {
                        assetId: this.info
                    }
                })
                .then(res => {
                    this.infolist = res.data.data;
                    this.pages = res.data.recordsTotal;
                    this.numDetail = this.infolist;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //点击合同跳转
        jump(id) {
            if (this.infos.contractCode == null) {
                this.$Message.warning("请先关联合同，在进行查看");
                return;
            }
            this.$router.push({
                name: 'contract-detail',
                query: {id}
            });
        },
        //点击跳转到报单详情
        jump_(id) {
            this.$router.push({ name: "singer-detail", query: { id } });
        }
    },
    filters: {
        UpCose: function(value) {
            if (typeof value == "string") {
                return value.toUpperCase();
            }
        }
    }
};
</script>

<style scoped lang="less">
.content {
    height: 100%;
    background: #fafafa;
    min-height: 500px;
}
.jichu {
    display: flex;
    justify-content: space-between;
}
.color1 {
    color: #495060 !important;
}
.bload {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    > span {
        > span:nth-of-type(1) {
            font-weight: 550;
        }
    }
}
.bload span {
    line-height: 30px;
}
.content-c {
    display: flex;
    .search {
        width: 270px;
        height: 500px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px #dce0e6;
        border-top: none;

        li {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            padding: 22px;
            height: 56px;
            background-color: #ffffff;
            border: solid 1px #dce0e6;
            &:hover {
                background: #f4f4f4;
            }
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
    }
    .info {
        margin-left: 10px;
        width: 950px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px #dce0e6;
    }
}
.content {
    // padding-left: 40px;
    // padding-right: 40px;
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
    .nav-sub {
        h2 {
            font-weight: normal;
            color: #333333;
            font-size: 16px;
            margin-top: 1px;
            line-height: 40px;
        }
    }

    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .main {
        background: #fafafa;
        .ivu-tabs {
            margin: 0;
        }
        h3 {
            font-size: 16px;
            font-weight: normal;
            color: #f2740c;
            margin-top: 20px;
        }
        .details {
            display: flex;
            justify-content: space-between;
            padding-top: 20px;
            margin-bottom: 30px;
            .details-code {
                font-size: 14px;
                color: #666;
                margin-bottom: 15px;
            }
            .title {
                font-size: 18px;
                color: #0c8399;
                margin-bottom: 10px;
            }
            .details-contract {
                display: flex;
                .contract {
                    font-size: 12px;
                    width: 80px;
                    height: 100px;
                    background-color: #ffffff;
                    border-radius: 3px;
                    border: solid 1px rgba(2, 31, 57, 0.1);
                    padding-top: 23px;
                    text-align: center;
                    position: relative;
                    .complete {
                        position: absolute;
                        width: 36px;
                        top: 0;
                        left: 0;
                        text-align: center;
                        background-color: #01b0c7;
                        color: #fff;
                        height: 16px;
                    }
                    img {
                        display: inline-block;
                        text-align: center;
                        margin-top: 15px;
                    }
                }
                .code {
                    width: 100px;
                    height: 100px;
                    background-color: #ffffff;
                    border-radius: 3px;
                    border: solid 1px rgba(2, 31, 57, 0.1);
                    margin-left: 10px;
                    text-align: center;
                    img {
                        width: 90px;
                        height: 90px;
                        margin-top: 5px;
                    }
                }
            }
        }
        .details-info {
            display: flex;
            justify-content: space-between;
            .info-l {
                height: 430px;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                padding: 20px;
                width: 39%;

                .info-count {
                    margin-top: 20px;

                    .tlt {
                        font-size: 14px;
                        color: #999999;
                        margin-bottom: 14px;
                    }
                }
                .count-cont {
                    display: flex;
                    text-align: center;
                    justify-content: space-between;
                    p {
                        font-size: 14px;
                        color: #999999;
                    }
                    .count-l {
                        width: 49%;
                        height: 80px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.1);
                        display: flex;
                        flex-flow: column wrap;
                        justify-content: center;

                        p:nth-child(1) {
                            font-size: 18px;
                            color: #333333;
                        }
                    }
                    .count-r {
                        width: 49%;
                        height: 80px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.1);
                        display: flex;
                        flex-flow: column wrap;
                        justify-content: center;
                        p:nth-child(1) {
                            color: #333333;
                            font-size: 18px;
                        }
                    }
                }
            }
            .info-r {
                height: 430px;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                padding: 20px;
                width: 60%;
                .noinfo {
                    text-align: center;
                    margin-top: 180px;
                }
            }
        }
        .purchase {
            height: 250px;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            margin-top: 20px;
            padding: 20px;
            margin-bottom: 10px;
        }
        .showImgs {
            width: 100%;
            min-height: 100px;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            margin-top: 20px;
            padding: 20px;
            margin-bottom: 10px;
            .imgs-wrap {
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                .single-img {
                    width: 70px;
                    height: 70px;
                    margin: 5px 10px 5px 0;
                    border-radius: 4px;
                    position: relative;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    &:hover {
                        .img-view {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                    .img-view {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: none;
                        font-size: 40px;
                        color: #fafafa;
                        cursor: pointer;
                        background-color: rgba(0, 0, 0, 0.3);
                    }
                }
            }
            .no-img {
                width: 100%;
                height: 150px;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .tab {
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 30px;

        position: relative;
        left: 1px;
        table {
            border: none;
            // tr:nth-child(1) {
            //     height: 40px;
            //     border-bottom: solid 1px rgba(2, 31, 57, 0.1);
            // }
            tr:last-child {
                border: none;
            }
            tr {
                border: none;
                border-bottom: solid 1px rgba(2, 31, 57, 0.1);
                height: 60px;
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
                    span {
                        font-size: 14px;
                        color: #999999;
                    }
                    .equipment-title {
                        color: #0c8399;
                        font-size: 16px;
                        margin-bottom: 13px;
                    }
                    .active {
                        color: #5ba4c8;
                    }
                }
            }
        }
        .page {
            text-align: center;
        }
    }
}
</style>
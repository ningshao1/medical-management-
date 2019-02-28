<template>
    <div>
        <div class="content">
            <div class="main">
                <Row :gutter="10">
                    <div style="padding:0 30px;background: #fafafa;">
                        <h3 class="jichu">基础信息
                            <span style="color: #01b0c7;cursor:pointer" @click="goBack">修改基础信息</span>
                        </h3>

                        <div class="line"></div>
                        <div class="details">
                            <div class="details-title">
                                <p class="title" style="margin-left: 3px;">资产名称：{{infos.assetName}}</p>
                                <!-- <p class="details-code" style="font-size:12px;">
                                        <span style="font-weight:550;font-size:12px;">资产编码：</span><span>{{infos.assetCode | UpCose }}</span></p> -->
                                <!-- <p class="bload" style="width:600px"> -->

                                <!-- <p class="bload">品牌名称：{{infos.brandName}}
                                        <span>|</span>资产型号：{{infos.assetClass}}
                                        <span>|</span> 类别名称：{{infos.assertTypeName}}
                                        <span>|</span>设备SN号：{{infos.assetSN}}</p> -->
                                <p class="bload" style="width:800px">
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px;">
                                        <span style="width:68px;display:inline-block;">资产编码：</span>
                                        <span>{{infos.assetCode | UpCose }}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                                        <span style="width:68px;display:inline-block;">品牌名称：</span>
                                        <span>{{infos.brandName}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px;">
                                        <span style="width:68px;display:inline-block;">资产型号：</span>
                                        <span>{{infos.assetClass}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                                        <span style="width:68px;display:inline-block;">类别名称：</span>
                                        <span :title="infos.assertTypeName+breatheTypes[infos.breatheType]">{{infos.assertTypeName}}{{breatheTypes[infos.breatheType]}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px;">
                                        <span style="width:68px;display:inline-block;">设备SN号：</span>
                                        <span>{{infos.assetSN}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                                        <span style="width:68px;display:inline-block;">编码类别：</span>
                                        <span>{{infos.assertTypeCode}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px;">
                                        <span style="width:68px;display:inline-block;">现有编码：</span>
                                        <span>{{infos.oldAssetCode}}</span>
                                    </span>
                                    <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px;">
                                        <span style="width:90px;display:inline-block;">设备注册证号：</span>
                                        <span :title='infos.registration'>{{infos.registration}}</span>
                                    </span>
                                     <span style="display:block;text-align:left;width:49%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px;" v-for="(v,i) of typeList" :key="i">
                                        <span style="width:68px;display:inline-block;">{{numberToLocale(i+1)}}级分类：</span>
                                        <span :title='v.typeName'>
                                            <template v-if="v.typeCode">[{{v.typeCode}}]</template>{{v.typeName}}</span>
                                    </span>
                                </p>
                                <Button type="ghost" shape="circle" size="small" v-for="(item,index) in infos.labels" :key="index" style="margin-top:10px;margin-right:10px;width:100px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" v-show="item.labelName!=null&&item.labelName!=''">{{item.labelName}}</Button>
                            </div>
                            <div class="details-contract">
                                <div class="contract" style="cursor:pointer" v-if="infos.contractCode" @click="Injump(infos.contractId)">
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
                        </div>
                        <div class="details-info">

                            <div class="info-l" style="background:#fafafa">
                                <div class="task-head">
                                    <div class="task-title">
                                        <div class="vertical"></div>
                                        <p>使用信息</p>
                                    </div>

                                </div>
                                <div class="info-content">
                                    <ul>
                                        <li>
                                            <span class="color1">所属科室：</span>
                                            {{infos.osName}}
                                        </li>
                                        <li>
                                            <span class="color1">领用时间：</span>
                                            {{infos.collarTime}}
                                        <li>
                                            <span class="color1">使用年限：</span>
                                            {{infos.durableYears}}
                                        </li>
                                        <li class="user-name">
                                            <span class="color1">管理人：</span>

                                            <poptip-show-info :info-id="infos.userId">{{infos.userName}}</poptip-show-info>

                                        </li>
                                        <li class="user-name">
                                            <span class="color1">责任人：</span>

                                            <poptip-show-info :info-id="infos.responsibleId">{{infos.responsibleName }}</poptip-show-info>

                                        </li>
                                        <li>
                                            <span class="color1">安装地点：</span>

                                            {{infos.installSectionName }}

                                        </li>
                                        <li>
                                            <span class="color1">使用时间(月)：</span>

                                            {{infos.useMonth }}

                                        </li>
                                    </ul>
                                </div>
                                <div class="line"></div>
                                <div class="info-count">
                                    <div class="task-head" style="margin-bottom: 10px;">
                                        <div class="task-title">
                                            <div class="vertical"></div>
                                            <p class="tlt,color1">维修信息统计：</p>
                                        </div>

                                        <div class="task-whole">
                                            <p style="margin-left:20px" @click="jump(3)">查看更多</p>
                                            <img src="../../image/whole.png" alt="">
                                        </div>
                                    </div>

                                    <div class="count-cont">
                                        <div class="count-l" style="background:#fafafa">
                                            <p>{{infos.repairCount}}</p>
                                            <p v-if="infos.repairCount" class="color1">总维修次数（次）</p>
                                            <p v-else class="color1">暂无维修统计</p>
                                        </div>
                                        <div class="count-r" style="background:#fafafa">
                                            <p>{{infos.repairPrice!==null?Math.round(infos.repairPrice*100)/100:null}}</p>
                                            <p v-if="infos.repairPrice!==null" class="color1">总维修费用（元）</p>
                                            <p v-else class="color1">暂无维修费用</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="info-r" style="background:#fafafa">
                                <div class="task-head" style="background:#fafafa">
                                    <div class="task-title">
                                        <div class="vertical"></div>
                                        <p>质控信息</p>
                                    </div>

                                    <div class="task-whole" style="align-items:center">
                                        <img src="../../image/falsh.png" alt="">
                                        <p style="margin-left:20px">查看更多</p>
                                        <img src="../../image/whole.png" alt="">

                                    </div>

                                </div>
                                <div class="noinfo"> 暂未检测到质控系统接口</div>
                            </div>

                        </div>

                        <div class="showImgs">
                            <div class="task-head">
                                <div class="task-title">
                                    <div class="vertical"></div>
                                    <p>设备图片</p>
                                </div>
                            </div>
                            <ImageView :showStyle="{'background-color':'transparent'}" :imgUrlList="infos.photos?infos.photos:[]"></ImageView>
                        </div>
                        <!-- <div class="purchase" style="background:#fafafa" v-if="ViewLimit('con:list')&&ViewLimit('ass:edit')">
                            <div class="task-head">
                                <div class="task-title">
                                    <div class="vertical"></div>
                                    <p>采购信息</p>
                                </div>

                                <div class="task-whole" @click="Injump(infos.contractId)">
                                    <p style="margin-left:20px">查看更多</p>
                                    <img src="../../image/whole.png" alt="">
                                </div>
                            </div>
                            <div class="purchase-info" v-if="infos.contractCode">
                                <ul>
                                    <li>
                                        <span class="color1">合同编号：</span>
                                        <span>{{infos.contractCode}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">供应商：</span>
                                        <span>{{infos.supplierName}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">采购金额：</span>
                                        <span>{{infos.purchaseAmount}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">供应商联系方式：</span>
                                        <span>{{infos.supplierContact}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">设备现值：</span>
                                        <span></span>
                                    </li>
                                    <li>
                                        <span class="color1">生产厂商：</span>
                                        <span>{{infos.manufactorName}}</span>
                                    </li>
                                    <li>
                                        <span class="color1"> 过保日期：</span>
                                        <span>{{infos.assetWarrntyDate}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">生产厂商联系方式：</span>
                                        <span>{{infos.manufactorPhone}}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="purchase-info" v-else v-show="relation">
                                <p class="info">合同信息尚未关联，请前往
                                    <span style="color: #01b0c7;cursor:pointer" @click="modal7=true;">关联合同</span>
                                </p>
                            </div>
                            <div class="purchase-info" v-show="infot">

                                <ul>
                                    <li>
                                        <span class="color1">合同编号：</span>
                                        <span>{{infot.contractCode}}</span>
                                    </li>
                                    <li>
                                        <span style="margin-right:75px" class="color1">供应商：</span>
                                        <span>{{infot.supplierName}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">采购金额：</span>
                                        <span>{{infot.purchaseAmount}}</span>
                                    </li>
                                    <li>
                                        <span style="margin-right: 19px;" class="color1">供应商联系方式：</span>
                                        <span>{{infot.supplierContact}}</span>
                                    </li>
                                    <li>
                                        <span class="color1">设备现值：</span>
                                        <span></span>
                                    </li>
                                    <li>
                                        <span style="margin-right:62px;" class="color1">生产厂商：</span>
                                        <span>{{infot.manufactorName}}1111</span>
                                    </li>
                                    <li>
                                        <span class="color1">过保日期：</span>
                                        <span>{{infot.assetWarrntyDate}}</span>
                                    </li>
                                    <li>
                                        <span style="margin-right: 7px;" class="color1">生产厂商联系方式：</span>
                                        <span>{{infot.manufactorPhone}}1111</span>
                                    </li>
                                </ul>
                            </div>

                        </div> -->
                        <div class="asset-footer" style="background:#fafafa">
                            <div class="retrieval-btn">
                                <Button @click="back">返回</Button>
                                <Button @click="delAsset" style="background-color:#e7485a;color:#fff;margin-left:10px;" v-if="ViewLimit('ass:del')">删除</Button>
                                <Button @click="goBack" style="background-color:#22a1b9;color:#fff;margin-left:10px;" v-if="ViewLimit('ass:edit')">编辑</Button>
                                <Button @click="$refs['print-type'].typeShow=true" style="background-color:#22a1b9;color:#fff;margin-left:10px;">打印</Button>
                            </div>
                        </div>
                    </div>

                </Row>
            </div>

        </div>
        <Modal class='kld-asset-detail-addContract-modal' v-model="modal7" title="选择合同" class-name="kld-asset-detail-addContract" width="1260">
            <div class='content-c'>
                <div class="search">

                    <ul>
                        <li @click="searchlable()">
                            <p>全部合同</p>

                        </li>
                        <li @click="searchlable(2)">
                            <p>采购合同</p>

                        </li>
                        <li @click="searchlable(1)">
                            <p>维保合同</p>

                        </li>
                        <li @click="searchlable(3)">
                            <p>维修合同</p>

                        </li>
                        <li @click="searchlable(4)">
                            <p>其它</p>

                        </li>
                    </ul>
                </div>
                <div class="info">
                    <div class="main-info ">
                        <RadioGroup v-model="contractChecked.id" style="width:100%;">
                            <table width="100%" border="1" style="border-collapse:collapse;table-layout:fixed">
                                <tr class="one">
                                    <th style="width:10%">选择</th>
                                    <th style="width:40%">合同信息</th>
                                    <th style="width:30%">供应商相关信息</th>
                                    <th style="width:10%">签订日期</th>
                                    <th style="width:10%">过保日期</th>

                                </tr>
                                <tr v-for="(item,index) of contractlist" :key="index" @click='toogleSelected(item)'>
                                    <td>
                                        <Radio :label="item.id" style="width:10px;">
                                            <span></span>
                                        </Radio>
                                    </td>
                                    <td>
                                        <p>{{item.contractId}}</p>
                                        <p class="equipment-title">{{item.contractName}}</p>
                                        <Button type="ghost" shape="circle" v-for="btn in item.labels" :key="btn.id">{{btn.labelName}}</Button>

                                    </td>
                                    <td>
                                        <p>{{item.supplierName}}</p>
                                        <span>{{item.supplierContactor}}</span><br>
                                        <span>{{item.supplierContact}}</span>
                                    </td>

                                    <td>

                                    </td>
                                    <td>
                                        <p> {{item.signDate}}</p>

                                    </td>
                                </tr>
                                <tr v-if="!contractlist.length">
                                    <td colspan="5" style='text-align:center;'>
                                        暂无合同
                                    </td>
                                </tr>

                            </table>
                        </RadioGroup>
                        <div class="page">

                            <Page :total="pagees" @on-change="contractinfo" v-show="pagees>8"></Page>
                        </div>
                    </div>
                </div>

            </div>
            <div slot="close"></div>
            <div slot="footer">
                <Button class="kld-btn-default" @click="modal7=false">取消</Button>
                <Button class="kld-btn" @click="hanleSeeinfos">确定</Button>
            </div>
        </Modal>

        <pop :msginfo='del_info' @pro_ok='prints'></pop>
        <print-type ref="print-type" :JumpID='$route.params.id'></print-type>
    </div>

</template>

<script>
var keshi = require("../../../../img/keshi.svg");
var femlie = require("../../../../img/femlie.svg");
import pop from "@common/prompt/prompt";
import ImageView from "@common/imageView/ImageView";
import confirm from "@common/kld-confirm/index.js";
import poptipShowInfo from "@common/poptip-show-info";
import printType from "../../common/option-print-type/index";
import numberToLocale from '@common/numberToLocale';
export default {
    props: {
        loaded: {
            type: Function
        },
        jump: {
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
            contractChecked: {
                id: "",
                contractName: ""
            },
            contractChecked_mark: {},
            pagess: "",
            num: 0,
            infot: "",
            tab_index: "1",
            numDetail: [],
            //打印弹窗信息
            del_info: {
                title: "打印",
                okText: "打印",
                name: "是否打印该资产？",
                modal2: false
            },
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
        },
        typeList(){
            if(!(this.infos&&this.infos.typeParents)){
                return []
            }
            return this.infos.typeParents.reverse();
        }
    },
    created() {
        this.getinfo();
        this.contractinfo();
    },

    components: {
        pop,
        ImageView,
        poptipShowInfo,
        [printType.name]: printType
    },
    methods: {
        numberToLocale,
        searchlable(index) {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.contractChecked = {
                id: "",
                contractName: ""
            };
            this.$axios

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
                    this.$nextTick(() => {
                        this.contractChecked = this.contractChecked_mark;
                    });
                })
                .catch(error => {
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
        hanleSeeinfos() {
            if (!this.contractChecked.id) {
                return this.$Message.warning("请选择合同！");
            }
            this.seeinfos(this.contractChecked);
        },
        toogleSelected({ id, contractName }) {
            this.contractChecked = {
                id,
                contractName
            };
            this.contractChecked_mark = {
                id,
                contractName
            };
        },
        seeinfos({ id, contractName }) {
            this.$axios
                .put("assets/assetAndContract", {
                    contractId: id,
                    id: this.info,
                    contractName
                })
                .then(res => {
                    location.reload();
                })
                .catch(error => {
                    this.modal7 = false;
                });
        },
        //合同列表数据
        contractinfo(page = 1) {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            let line = (page - 1) * 8;
            this.$axios
                .post(
                    `/contracts/${osid}/list`,

                    {
                        limit: 8,
                        offset: line,
                        params: {}
                    }
                )
                .then(res => {
                    this.contractlist = res.data.data;
                    this.pagees = res.data.recordsTotal;
                    this.spinShow = false;
                })
                .catch(error => {
                    this.spinShow = false;
                });
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

        //点击合同跳转
        Injump(id) {
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
        },
        //点击打印按钮
        // click_print() {
        //     if ("ActiveXObject" in window) {
        //         this.del_info.modal2 = true;
        //     } else {
        //         this.$Message.info("对不起,打印功能只提供给IE浏览器");
        //     }
        // },
        //打印资产
        prints() {
            window.prints(this.typecodes);
        },
        delAsset() {
            confirm({
                title: "提示",
                content: "是否确定删除该资产",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$axios
                        .delete(
                            `/assets/${this.$store.state.user_in.osId}/${
                                this.$route.params.id
                            }`
                        )
                        .then(res => {
                            this.$Message.success("删除成功");
                            this.$router.go(-1);
                        });
                },
                cancel: () => {}
            });
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
    font-size: 14px;
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
        // box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        border: solid 1px #dce0e6;
        .main-info {
            background-color: #ffffff;
            // box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
            border-radius: 3px;
            // border: solid 1px rgba(2, 31, 57, 0.1);
            padding: 20px;
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
                    height: 80px;
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
                    }
                }
            }
            .page {
                margin-top: 20px;
                text-align: center;
            }
        }
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
            tr:nth-child(1) {
                height: 40px;
            }
            tr:last-child {
                border: none;
            }
            tr {
                border: none;
                border: solid 1px rgba(2, 31, 57, 0.1);
                height: 80px;
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
            font-size: 16px;
        }
    }
    .task-whole {
        display: flex;
        align-items: end;
        cursor: pointer;
        > p {
            color: #01b0c7;
            font-size: 14px;
            margin-right: 11px;
        }
        img {
            width: 17px;
            height: 17px;
        }
    }
}
.info-content {
    margin-top: 20px;
    height: 185px;
    > ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        li {
            width: 50%;
            margin-bottom: 20px;
            font-size: 14px;
            color: #333333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            span {
                display: inline-block;
                font-size: 14px;
                // margin-right: 40px;
                color: #333333;
            }
            span:nth-child(1) {
                color: #999999;
                font-weight: 550;
            }
        }
        /deep/.user-name {
            display: flex;
            > div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
.kld-asset-detail-addContract-modal {
    /deep/.kld-asset-detail-addContract {
        .ivu-modal-footer {
            background-color: #fff;
        }
    }
}
.purchase-info {
    ul {
        display: flex;
        flex-wrap: wrap;
        li {
            span:nth-of-type(1) {
                width: 160px;
            }
        }
    }
    .info {
        text-align: center;
        margin: 50px;
    }

    li {
        width: 50%;
        margin-top: 20px;
        span {
            display: inline-block;
            font-size: 14px;
            //margin-right: 40px;
            color: #333333;
        }
        span:nth-child(1) {
            color: #999999;
            font-weight: 550;
        }
    }
}
</style>
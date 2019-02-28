<template>
    <div class="add-acceptance-three">
        <div class='three-tree'>
            <kld-search-tree placeholder="科室名称搜索">
                <kld-tree slot="tree"
                          :current.sync="osid"
                          @current-change="getData()"
                          :data="sectionTreeData"
                          title-key="osName"
                          children-key="lists"
                          highlight-current
                          first-expanded></kld-tree>
            </kld-search-tree>
        </div>
        <div class="three-list">
            <div class="three-asset">
                <table class='three-asset-table table-stripe'
                       style="table-layout:fixed;border-collapse:collapse"
                       border="1">
                    <tr>
                        <th>申请时间</th>
                        <th>采购类型</th>
                        <th>申请人</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="(v,i) of yearPlanList"
                        style="cursor:pointer;"
                        :key="'yearPlanList'+i"
                        @click="relation(v.id)">
                        <td>{{v.ar_time}}</td>
                        <td class="textEllipsis">{{v.ar_type|purchaseType('hidden')}} </td>
                        <td class="textEllipsis">{{v.uName}}</td>
                        <td class="textEllipsis"
                            :style="yearPlanId==v.id?'color:green;':''">{{yearPlanId==v.id?'已关联':'选择关联'}}</td>
                    </tr>
                </table>
                <div class='acceptance-tree-page'>
                    <kld-page :current="currentPage"
                              @on-change="getData"
                              :total="yearPlanTotal"
                              :pageSize='limit'></kld-Page>
                </div>
                <!-- <Button @click="skip">跳过</Button>
                <Button @click="next">下一步</Button> -->
            </div>
        </div>

        <Modal title="采购计划"
               v-model="modal10"
               class-name="vertical-center-modal three-step-modal"
               @on-ok="doPurchase">
            <div class="three-step-modal-content">
                <div>
                    <type title="采购类型"></type>
                    <div style="text-indent:15px;">
                        {{yearPlanDetail.ar_type|purchaseType('hidden')}}
                    </div>
                </div>
                <div>
                    <type title="基础信息"></type>
                    <div class="basic-information">
                        <div class='basic-information-block'>
                            <p>申请科室</p>
                            <Input disabled
                                   :value="yearPlanDetail.osName"
                                   class='basic-information-input'></Input>
                        </div>
                        <div class='basic-information-block'>
                            <p>申请时间</p>
                            <Input disabled
                                   :value="yearPlanDetail.ar_time"
                                   class='basic-information-input'></Input>
                        </div>
                        <div class='basic-information-block'>
                            <p>科室电话</p>
                            <Input disabled
                                   :value="yearPlanDetail.osPhone"
                                   class='basic-information-input'></Input>
                        </div>
                    </div>
                </div>
                <div>
                    <type title="设备采购信息"></type>
                    <div class="three-asset modal-div">
                        <RadioGroup v-model="apId">
                            <table id='modal-table'
                                   class='three-asset-table table-stripe'
                                   style="table-layout:fixed;border-collapse:collapse"
                                   border="1">
                                <tr>
                                    <th>序号</th>
                                    <th>设备名称</th>
                                    <th>数量</th>
                                    <th>预算单价</th>
                                    <th>意向品牌（多选）</th>
                                    <th>备注</th>

                                </tr>
                                <template v-if="yearPlanDetail.annualplanPurchases">

                                    <tr v-for="(v,i) of yearPlanDetail.annualplanPurchases"
                                        style="cursor:pointer;"
                                        :key="i"
                                        @click="doSelect(v.id,v.type!=2,v.relevanceNumber==v.openNumber)">
                                        <td>
                                            <Radio :label="v.id"
                                                   :disabled="v.type!=2||v.relevanceNumber==v.openNumber">
                                                <span>{{(i+1+"").padStart(2,"0")}}</span>
                                            </Radio>
                                        </td>
                                        <td class="textEllipsis">{{v.ap_name}} </td>
                                        <td class="textEllipsis">{{v.ap_number}}</td>
                                        <td class="textEllipsis">{{v.ap_money}}</td>
                                        <td class="textEllipsis">{{v.ap_brand}}</td>
                                        <td class="textEllipsis">{{v.ap_note}}</td>
                                    </tr>

                                </template>
                            </table>
                        </RadioGroup>
                        <div class='acceptance-tree-page'>
                            <kld-page :current="d_currentPage"
                                      @on-change="d_getData"
                                      :pageSize="d_limit"
                                      :total="d_total"></kld-Page>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import kldConfirm from "@common/kld-confirm";
import page from "@common/page/page";
import type from "../../../QualityControl/adverseEvent/reportAdverseEvent/type";
import Ptype from "./API.js";
import KldTree from "@common/kld-tree";
import KldSearchTree from "@common/kld-search-tree";
export default {
    name: "step3",
    data() {
        return {
            list: null,
            modal10: false,
            currentYearPlanId: "",

            yearPlanList: [],
            yearPlanTotal: 0,
            yearPlanDetail: {
                annualplanPurchases: []
            },
            currentPage: 1,
            osid: "",
            limit: 10,

            d_currentPage: 1,
            d_limit: 5,
            d_total: 0,
            isPurchase: false,

            apId: "", //当前选中的id
            determinedId: "", //确认要关联的id
            yearPlanId: "",
            sectionTreeData: []
        };
    },
    filters: {
        purchaseType(value, type = "view") {
            if (Ptype[value]) {
                return Ptype[value][type];
            } else {
                return "";
            }
        }
    },
    created() {
        this.getOriginData();
        this.getSectionData();
    },
    props: {
        Nasset: ""
    },
    methods: {
        getSectionData() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionTreeData = [data];
                });
        },
        getOriginData() {
            this.getData();
        },
        getData(page = 1) {
            this.currentPage = page;
            this.$axios
                .post(`/annualplan/annualplanList`, {
                    limit: this.limit,
                    offset: this.limit * (this.currentPage - 1),
                    params: {
                        plan: 2,
                        osid: this.osid
                    }
                })
                .then(res => {
                    // console.log(res);
                    this.yearPlanList = res.data.data;
                    this.yearPlanTotal = res.data.recordsTotal;
                });
        },
        d_getData(page = 1) {
            this.d_currentPage = page;
            let apId = this.apId;
            this.apId = "";

            this.$axios
                .post(`/annualplan/getAnnualplan/${this.currentYearPlanId}`, {
                    // id,
                    limit: this.d_limit,
                    offset: this.d_limit * (this.d_currentPage - 1),
                    params: {}
                })
                .then(res => {
                    this.modal10 = true;
                    this.yearPlanDetail = res.data;
                    this.d_total = res.data.count;
                    // setTimeout(()=>{
                    //     this.apId=apId;
                    // },200)
                    this.$nextTick(() => {
                        this.apId = apId;
                    });
                });
        },
        relation(id) {
            this.currentYearPlanId = id;
            this.apId = this.isPurchase ? this.determinedId : "";
            this.d_getData();
        },
        doSelect(id, isReject,isUpperLimit) {
            //没有被拒绝且没有到达上限
            if (!isReject&&!isUpperLimit) {
                if (this.apId === id) {
                    this.apId = "";
                    return;
                }

                this.apId = id;
                return;
            }
            //采购计划被拒绝
            if (isReject){
                this.$Message.warning("该采购条例已被拒绝,无法选择关联！");
                return;
            }
            //关联达到上限
            if(isUpperLimit){
                this.$Message.warning("该年度计划关联资产数已达上限，无法选择关联！");
                return;
            }
        },
        //确认要关联
        doPurchase() {
            //TODO
            if (!this.apId && this.yearPlanId === this.currentYearPlanId) {
                this.yearPlanId = "";
            }
            this.isPurchase = this.apId || this.yearPlanId ? true : false;
            if (this.isPurchase && this.apId) {
                this.determinedId = this.apId;
            }

            if (
                this.yearPlanDetail.annualplanPurchases.findIndex(
                    v => v.id == this.apId
                ) != -1
            ) {
                this.yearPlanId = this.currentYearPlanId;
            }
        },
        clickTree(e) {
            this.osid = e[0].id;
            this.getData();
        },
        //点击保存下一步
        next(cb) {
            if (this.isPurchase) {
                kldConfirm({
                    title: "提示",
                    content: "确认保存采购计划关联",
                    maskClosable: false, //是否允许点击遮罩关闭 默认:false
                    okText: "确定", //确认按钮文本  默认:确认
                    cancelText: "取消", //确认取消文本  默认:取消
                    ok: () => {
                        //当点击了确认按钮时
                        this.$axios
                            .post(`/assetacceptance/saveAnnualPlan`, {
                                assetId: this.Nasset.NassetId,
                                apId: this.determinedId
                            })
                            .then(res => {
                                this.$Message.success("采购计划关联成功！");
                                if (cb) {
                                    cb();
                                }
                            });
                    },
                    cancel: () => {
                        //取消按钮同上
                        console.log("cancel");
                    }
                });
            } else {
                this.$Message.warning(
                    "您没有关联采购计划，如需跳过请点击跳过按钮！"
                );
            }
        },
        //跳过年度计划关联
        skip(cb) {
            kldConfirm({
                title: "提示",
                content: this.isPurchase
                    ? "您已选择关联了一个采购计划，确认跳过？"
                    : "确认跳过？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    //当点击了确认按钮时
                    this.$axios
                        .post(
                            `/assetacceptance/skip/${this.Nasset.NassetId ||
                                ""}`
                        )
                        .then(
                            res => {
                                this.$Message.success("已跳过采购计划关联！");
                                this.$router.go(-1);
                            },
                            error => {
                                this.$Message.error(
                                    "采购计划关联跳过失败，请检查您的网络！"
                                );
                            }
                        );
                },
                cancel: () => {
                    //取消按钮同上
                    console.log("cancel");
                }
            });
        }
    },
    components: {
        [page.name]: page,
        type,
        KldTree,
        KldSearchTree
    }
};
</script>
<style lang="less" scoped>
//通用样式
.border {
    border: 1px solid #e2e2e2;
}
.three-asset {
    .three-asset-table {
        border: none;
        width: 100%;
        > tr {
            text-align: center;
            border-bottom: 1px solid #e2e2e2;
            > th {
                width: 25%;
                padding: 15px 10px;
                font-size: 13px;
                color: #666;
                font-weight: 600;
                border: none;
            }

            > td {
                font-size: 13px;
                color: #666;
                font-size: 13px;
                padding: 15px 10px;
                border: none;
            }
            > td:nth-of-type(4) {
                color: #5ba4c8;
                font-size: 13px;
                cursor: pointer;
            }
        }
    }
    .acceptance-tree-page {
        text-align: center;
        padding-top: 12px;
        background: #fafafa;
        margin-bottom: 10px;
    }
}
//--------
.add-acceptance-three {
    display: flex;
    min-height: 800px;
    padding-top: 20px;
    margin-bottom: 10px;
    .three-tree {
        width: 20%;
        max-width: 300px;
        min-width: 200px;
        flex: 1;
        margin-right: 20px;
        padding: 10px;
        height: 780px;
        .border();
        > div {
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
    .three-list {
        flex: 1;
        .border();
    }
}
/deep/.three-step-modal {
    .ivu-modal {
        width: 800px !important;
    }
    .ivu-modal-content {
        background: #fafafa;
    }
    .three-step-modal-content {
        background-color: #fafafa;
    }

    .basic-information {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 10px;
        .basic-information-block {
            width: 100%;
            margin: 0 10px;
            > p {
                color: #000000;
                font-size: 13px;
                margin-bottom: 5px;
            }
            .basic-information-input {
                width: 100%;
            }
        }
    }
    .modal-div {
        background: #fff;
        #modal-table {
            background: #fff;
            margin-top: 10px;
            tr {
                > td,
                th {
                    background: #fff;
                }
                th:nth-of-type(1),
                th:nth-of-type(3),
                th:nth-of-type(4) {
                    width: 10%;
                }
                th:nth-of-type(2) {
                    width: 20%;
                }
                th:nth-of-type(5) {
                    width: 30%;
                }
                th:nth-of-type(6) {
                    width: 20%;
                }
                td {
                    color: #666;
                }
            }
        }
    }
}
</style>

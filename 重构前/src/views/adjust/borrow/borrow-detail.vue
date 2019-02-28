<template>
    <div class="borrow-detail">
        <div>
            <div class="detail-type">
                <kld-type title="基础信息"></kld-type>
                <div class="asset-check">
                    <a href="javascript:;">查看资产借用历史</a>
                </div>
            </div>
            <div class="basics-info">
                <div>
                    <p class="asset-name">
                        设备名称：{{info.aName}}
                    </p>
                    <div class="asset-info">
                        <div>
                            设备编码：{{info.assetCode}}
                        </div>
                        <div>
                            设备序列号：{{info.assetSN}}
                        </div>
                        <div>
                            设备品牌：{{info.brandName}}
                        </div>
                        <div>
                            设 备 型 号 ：{{info.assetClass}}
                        </div>
                        <div>
                            所属科室：{{info.ratifyOsName}}
                        </div>
                        <div>
                            院 内 分 类 ：{{info.typeName}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="detail-type">
                <kld-type v-if="!((ruleOs===3&&info.returnType<1)||(ruleOs===1&&info.returnType<1))" title="设备借用详情"></kld-type>
                <div class="basics-info asset-info" v-if="info.returnType>0">
                    <div class="notarize-info">
                        请确认以下信息：
                    </div>
                    <div class="asset-info">
                        <div>
                            设备已归还至【{{info.ratifyOsName}}】
                        </div>
                        <div>
                            归还时间：{{info.returnTime}}
                        </div>
                        <div>
                            使用时长：{{info.hours}}
                        </div>
                        <div>
                            借用费用：{{info.charge}}
                        </div>
                    </div>
                </div>
                <div class="borrow-comment" v-if="!((ruleOs===3&&info.returnType<1)||(ruleOs===1&&info.returnType<1))">
                    <p class="comment" style="margin-top:8px;">归还备注
                    </p>
                    <div class="comment-input">
                        <Input type="textarea" :rows="5" placeholder="请填写备注信息" :maxlength='2000' v-model="returnNote" :disabled='!(ruleOs===2&&info.returnType===0)'></Input>
                        <span class='word-number'>{{returnNote.length}}/2000</span>
                    </div>
                </div>
                <div class="borrow-comment Item" v-if="(ruleOs===3&&info.returnType>1)||(ruleOs===1&&info.returnType>0)||(ruleOs===2&&info.returnType>1)">
                    <p class="comment ">验收项
                        <span>*</span>
                    </p>
                    <div>
                        <div class="item-block">
                            <span>开关机是否正常：</span>
                            <RadioGroup v-model="rule.rulesOne">
                                <Radio :label="0" :disabled='!(ruleOs===1&&info.returnType===1)'>
                                    <span class="item-normal">正常</span>
                                </Radio>
                                <Radio :label="1" :disabled='!(ruleOs===1&&info.returnType===1)'>
                                    <span class="item-normal">不正常</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div class="item-block">
                            <span>设备功能是否正常：</span>
                            <RadioGroup v-model="rule.rulesTwo">
                                <Radio :label="0" :disabled='!(ruleOs===1&&info.returnType===1)'>
                                    <span class="item-normal">正常</span>
                                </Radio>
                                <Radio :label="1" :disabled='!(ruleOs===1&&info.returnType===1)'>
                                    <span class="item-normal">不正常</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div class="item-block">
                            <span>借出设备附件是否齐全：</span>
                            <RadioGroup v-model="rule.rulesThree">
                                <Radio :label="0" :disabled='!(ruleOs===1&&info.returnType===1)'>
                                    <span class="item-normal">正常</span>
                                </Radio>
                                <Radio :label="1" :disabled='!(ruleOs===1&&info.returnType===1)'>
                                    <span class="item-normal">不正常</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <p class="comment" style="margin-top:8px;">验收备注
                    </p>
                    <div class="comment-input">
                        <Input v-model="acceptanceNote" type="textarea" :rows="5" placeholder="请填写备注信息" :maxlength='2000' :disabled='!(ruleOs===1&&info.returnType===1)'></Input>
                        <span class='word-number'>{{acceptanceNote.length}}/2000</span>
                    </div>
                </div>

            </div>
        </div>
        <!-- 设备借用状态 -->
        <div>
            <kld-type title="设备借用状态"></kld-type>
            <div class="use-state">

                <div class="state-block state-active" v-if="info.returnType>0">
                    <i></i>
                    <div class="block-info">
                        <p>已归还</p>
                    </div>
                </div>
                <div class="state-block" :class="info.returnType===0?'state-active':''">
                    <i></i>
                    <div class="block-info">
                        <p>借用中</p>
                    </div>
                </div>
                <div class="state-block">
                    <i></i>
                    <div class="block-info">
                        <p>设备已借入</p>

                    </div>
                </div>
                <div class="state-block">
                    <i></i>
                    <div class="block-info">
                        <p>{{info.disposeOsName}}调剂 {{info.ratifyOsName}}【{{info.aName}}】响应借用申请 {{info.ratifyTime}}</p>
                        <p>处理人：{{info.ratifyName}} {{info.disposeOsName}}</p>
                    </div>
                </div>
                <div class="state-block">
                    <i></i>
                    <div class="block-info">
                        <p>申请【{{info.assetName}}】设备借用 {{info.createTime}} </p>
                        <p>申请人{{info.createName}} {{info.createOsName}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="borrow-btn">
            <div class="btn-content">
                <Button @click="cancel" class="btn-foot btn-cancel">取消</Button>
                <div v-if='!(ruleOs===3||info.returnType>1)'>
                    <Button v-if="ruleOs===2&&info.returnType<1&&ViewLimit('borrow:return')" class="btn-foot btn-confirm" @click="postData">确认归还</Button>
                    <Button v-if="ruleOs===1&&info.returnType===1&&ViewLimit('borrow:acceptance')" class="btn-foot btn-confirm" @click="postData">确认验收</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import type from "./../../QualityControl/adverseEvent/reportAdverseEvent/type.vue";
import confirm from "@common/kld-confirm/index";
import moment from "moment";
export default {
    data() {
        return {
            list: null,
            info: {},
            rule: {
                rulesOne: 0,
                rulesTwo: 0,
                rulesThree: 0
            },
            returnNote: "",
            acceptanceNote: "",
            ruleOs: 3
        };
    },
    components: {
        kldType: type
    },
    created() {
        this.getDetail();
        this.prototype = moment;
    },
    methods: {
        getDetail() {
            this.$axios
                .get(
                    `/assetBorrow/getAssetBorrow/${this.$route.query.id}/${
                        this.$route.query.assetId
                    }`
                )
                .then(res => {
                    this.info = res.data;
                    this.info["createTime"] = moment(
                        this.info["createTime"]
                    ).format("YYYY-MM-DD HH:mm");
                    this.info["ratifyTime"] = moment(
                        this.info["ratifyTime"]
                    ).format("YYYY-MM-DD HH:mm");
                    if (
                        res.data.returnNote !== undefined &&
                        this.info.returnNote !== null
                    ) {
                        this.returnNote = res.data.returnNote;
                    }
                    if (
                        this.info.acceptanceNote !== undefined &&
                        this.info.acceptanceNote !== null
                    ) {
                        this.acceptanceNote = this.info.acceptanceNote;
                    }
                    if (
                        this.info.rulesOne !== undefined &&
                        this.info.rulesOne !== null
                    ) {
                        const { rulesOne, rulesTwo, rulesThree } = res.data;
                        this.rule = { rulesOne, rulesTwo, rulesThree };
                    }
                    //判断 自身和借出借入科室的关系
                    let groupId = this.$store.state.user_in.groupId;
                    if (res.data.ratifyOsId === groupId) {
                        this.ruleOs = 1; //和借出科室相同
                    } else if (res.data.createOsId === groupId) {
                        this.ruleOs = 2; //和借入科室相同
                    } else {
                        this.ruleOs = 3; //都不相同
                    }
                    if (
                        res.data.returnTime !== null ||
                        res.data.returnTime !== undefined
                    ) {
                        this.info["returnTime"] = moment(
                            this.info["returnTime"]
                        ).format("YYYY-MM-DD HH:mm");
                    }
                    this.info["hours"] =
                        Math.floor(res.data.hours / 60) +
                        "小时" +
                        res.data.hours % 60 +
                        "分";
                    if (
                        res.data.charge === null ||
                        res.data.charge === undefined
                    ) {
                        this.info["charge"] = "";
                    } else if (res.data.charge === "0") {
                        this.info["charge"] = "无偿";
                    } else {
                        this.info["charge"] = `￥${res.data.charge}`;
                    }

                });
        },
        ruleStep() {
            let self = this.$store.state.user_in.groupId;
            // if(self)
        },
        postData() {
            if (this.info.returnType === 1) {
                confirm({
                    title: "提示",
                    content: "是否确定验收该设备？",
                    maskClosable: true, //是否允许点击遮罩关闭 默认:false
                    okText: "确定", //确认按钮文本  默认:确认
                    cancelText: "取消", //确认取消文本  默认:取消
                    ok: () => {
                        this.$axios
                            .put(
                                `/assetBorrow/updateAssetBorrowByAcceptance/${
                                    this.$route.query.id
                                }/${this.$route.query.assetId}`,
                                {
                                    ...this.rule,
                                    acceptanceNote: this.acceptanceNote
                                }
                            )
                            .then(res => {
                                this.$Message.success("验收成功");

                                this.$router.go(-1);
                            });
                    },
                    cancel() {
                        //取消按钮同上
                        console.log("cancel");
                    }
                });
            } else if (this.info.returnType === 0) {
                confirm({
                    title: "提示",
                    content: "是否确定归还该设备？",
                    maskClosable: true, //是否允许点击遮罩关闭 默认:false
                    okText: "确定", //确认按钮文本  默认:确认
                    cancelText: "取消", //确认取消文本  默认:取消
                    ok: () => {
                        this.$axios
                            .put(
                                `/assetBorrow/updateAssetBorrowByNote/${
                                    this.$route.query.id
                                }/${this.$route.query.assetId}?note=${
                                    this.returnNote
                                }`,
                                {
                                    brId: this.$route.query.id,
                                    id: this.$route.query.assetId,
                                    note: this.returnNote
                                }
                            )
                            .then(({ data }) => {
                                this.$Message.success("归还成功");
                                this.$router.go(-1);
                            });
                    }
                });
            }
        },
        cancel() {
            confirm({
                title: "提示",
                content: "确定返回列表？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "返回", //确认取消文本  默认:取消
                ok: () => {
                    this.$router.go(-1);
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import url("./borrow-detail");
</style>

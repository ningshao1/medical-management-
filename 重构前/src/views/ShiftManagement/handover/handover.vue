<template>
    <div class="handover-wrap container-fluid">
        <div class='type-title'>
            交接信息
        </div>
        <!-- 交班单 -->
        <div class="input-group" v-if="checkPage.handover">
            <div>
                <p>
                    交班人：
                </p>
                <poptip-show-info :info-id="userInfo.id" style="width:100%;">
                    <Input disabled :value="userInfo.name" class="single-input" />
                </poptip-show-info>
            </div>
            <div>
                <p>
                    科室：
                </p>
                <Input disabled :value="userInfo.osName" class="single-input" />
            </div>
            <div>
                <Form ref="handoverValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:100%">
                    <FormItem label="接班人：" prop="successorId">
                        <poptip-show-info :info-id="formValidate.successorId" style="width:100%;">
                            <Select class="single-input" v-model="formValidate.successorId" width="100%">
                                <Option v-for="(v,i) of turnOnDuty" :key="'turnOnDuty'+i" :value="v.userId">{{v.userName}}</Option>
                            </Select>
                        </poptip-show-info>
                    </FormItem>
                </Form>
            </div>
        </div>
        <!-- 接班单 -->
        <div class="input-group" v-else>
            <div v-for="(v,i) of this.shiftInfos" :key="'shiftInfos'+i">
                <p>
                    {{v.title}}：
                </p>
                <Input :value="v.info" class="single-input" disabled />
            </div>
        </div>





        <div class='type-title'>
            设备信息
        </div>

        <div class="asset-info-wrap">
            <table class="info-table">
                <thead>
                    <tr>
                        <th :style="myColumn[0]">序号</th>
                        <th :style="myColumn[1]">设备名称 <span style="color:#ff8a47">*</span></th>
                        <th :style="myColumn[2]">设备编码</th>
                        <th :style="myColumn[3]">设备品牌</th>
                        <th :style="myColumn[4]">设备分类</th>
                        <th :style="myColumn[5]">备注<span style="color:#aaa;font-size:12px;">(每项限100字)</span></th>
                        <th :style="checkPage.handover?'width:10%;':'width:1%'" class="clearFix" >
                            <span v-if="checkPage.handover">操作</span>
                            <Icon class="flexible" :type="!tableBodyShow?'chevron-down':'chevron-up'" @click.native="doFlexible"></Icon>
                        </th>
                    </tr>
                </thead>
            </table>
            <div ref="hide-show" style="position:relative;">

                <div class="table-body">

                    <table class="info-table">
                        <!-- 交班单 -->
                        <tbody v-if="checkPage.handover">
                            <tr v-for="(v,i) of checkedList" :key="'checkedList'+i">
                                <td :style="myColumn[0]">{{(""+(i+1)).padStart(3,"0")}}</td>
                                <td :style="myColumn[1]">
                                {{v.assetName}}
                                </td>
                                <td :style="myColumn[2]">
                                    {{v.assetCode}}
                                </td>
                                <td :style="myColumn[3]">
                                    {{v.brandName}}
                                </td>
                                <td :style="myColumn[4]">
                                {{v.typeName}}
                                </td>
                                <td :style="myColumn[5]">
                                    <Input v-model="v.remark" :maxlength="100" @on-change="addRemark($event,v.id)" />
                                </td>
                                <td :style="checkPage.handover?'width:10%;':'width:1%'">
                                    <!-- <span @click="doTrash(v.id)" class="trash-info">移除</span> -->
                                    <Button  @click="doTrash(v.id)" type="error">
                                        移除
                                    </Button>
                                </td>
                            </tr>
                        </tbody> 

                        <!-- 接班单&交接班详情 -->
                        <tbody v-else>
                            <tr v-for="(v,i) of checkedList" :key="'checkedList'+i">
                                <td :style="myColumn[0]">{{(""+(i+1)).padStart(3,"0")}}</td>
                                <td :style="myColumn[1]">
                                {{v.assetName}}
                                </td>
                                <td :style="myColumn[2]">
                                    {{v.assetCode}}
                                </td>
                                <td :style="myColumn[3]">
                                    {{v.assetBrandName}}
                                </td>
                                <td :style="myColumn[4]">
                                {{v.assertTypeName}}
                                </td>
                                <td :style="myColumn[5]">
                                    <!-- <Input v-model="v.remark" @on-change="addRemark($event,v.id,v.remark)" /> -->
                                    {{v.handRemark||'一切正常'}}
                                </td>
                                <td :style="checkPage.handover?'width:10%;':'width:1%'">
                                    <!-- <span @click="doTrash(v.id)" class="trash-info">移除</span> -->
                                </td>
                            </tr>
                        </tbody> 
                    </table>
                </div>
                <p class="little-tip" v-if="checkedList.length===0&&checkPage.handover">暂未填写设备信息，请点击“添加”按钮添加信息。</p>
            </div>


            <div class="asset-info-footer" v-if="checkPage.handover" @click="doAdd">
                <span  >+ 添加</span>
            </div>
        </div>

        <div class='type-title'>
            {{checkPage.handover?'上传图片':'图片'}}
        </div>
        <div class="upload-img-wrap" v-if="checkPage.handover">
            <CUpload :fileList="imglist" :maxCount="'infinity'"></CUpload>
            <p><Icon style="color:#f2740c;font-size:14px;" type="ios-information"></Icon> 支持上传3M以内的图片</p>
        </div>
        <div class="upload-img-wrap" v-else>
            <imageView :showStyle="{border:'1px dashed #bfbfbf','background-color':'#ffffff'}" :imgUrlList="SOInfo.imageUrls?SOInfo.imageUrls:[]"></imageView>
        </div>



        <div class="footer-submit">
            <Button class="kld-btn" type="ghost"  @click="goBack">{{checkPage.handover?'取消':'返回'}}</Button>
            <Button class="kld-btn" type='primary' @click="doSubmit" v-if="checkPage.handover">确认</Button>
            <!-- 确认接单 -->
            <Button class="kld-btn" type='primary' @click="doSO" v-if="checkPage.successionOrders">确认</Button>
        </div>

        <!-- 选择资产信息 -->
        <Modal 
            v-model="addAsset" 
            title="选择设备（可多选）"
            :styles="addAssetStyle"
            @on-ok="doAddList(true)"
            >
            <div class="SM-asset-list-wrap">
                <div>
                    <Input v-model="keyword" style="width:300px;margin-right:10px;" @input.native="inputChange" @compositionstart.native="isInput=false" @compositionend.native="compositionend" placeholder="请输入 设备名称/设备编码/设备型号" /> 
                    <Button type="primary" @click="getAssetList">检索</Button> 
                </div>
                <table class="SM-asset-list table-stripe">
                    <thead>
                        <tr>
                            <th style="width:10%">
                                <Checkbox :value="isChangeAll" @on-change="changeAll"></Checkbox>全选
                            </th>
                            <th style="width:18%">设备名称</th>
                            <th style="width:18%">设备编码</th>
                            <th style="width:18%">设备型号</th>
                            <th style="width:18%">设备品牌</th>
                            <th style="width:18%">设备分类</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(v,i) of assetList" :key="'assetList'+i" @click="easySelect(i)">
                            <td>
                                <Checkbox   v-model="v.checked"></Checkbox>
                            </td>
                            <td>{{v.assetName}}</td>
                            <td>{{v.assetCode}}</td>
                            <td>{{v.typeName}}</td>
                            <td>{{v.brandName}}</td>
                            <td>{{v.assetClass}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="page-wrap">
                    <myPage :total="recordsTotal" :current="currentPage" :pageSize="limit" @on-change="pageChange"></myPage>
                </div>

            </div>

        </Modal>

        
        

    </div>
</template>

<script>
import { shiftInfo } from "./API.js";
import CUpload from "@common/C-Upload/C-upload.vue";
import myPage from "@common/page/page.vue";
import imageView from "@common/imageView/ImageView.vue";
import kldConfirm from "@common/kld-confirm";
import poptipShowInfo from "@common/poptip-show-info";

export default {
    data() {
        return {
            //用户信息
            userInfo: this.$store.state.user_in,
            //接班
            turnOnDuty: [],
            formValidate: {
                successorId: ""
            },
            ruleValidate: {
                successorId: [
                    {
                        required: true,
                        message: "接班人为必选项！",
                        trigger: "blur"
                    }
                ]
            },
            //接班人ID

            tableBodyShow: true,

            //选择设备模态是否显示
            addAsset: false,

            addAssetStyle: {
                width: "1200px"
            },
            //
            myColumn: [
                "width:10%",
                "width:15%",
                "width:15%",
                "width:10%",
                "width:15%",
                "width:25%"
            ],

            //接收到的数据
            assetList: [],
            //所有选中的设备
            checkedListTotal: [],
            //用于展示的所有数据
            showListTotal: [],
            //全选
            isChangeAll: false,
            //模糊查询关键字
            keyword: "",
            //是否是中文输入法
            isInput: true,

            //总条数
            recordsTotal: 0,
            //当前分页数
            currentPage: 1,
            limit: 10,
            offset: 0,
            imglist: [],

            //接班单信息
            SOInfo: {
                assets: [],
                departmentName: "",
                successorName: "",
                imageUrls: [],
                watchkeeperName: ""
            }

            //交接班详情
        };
    },
    computed: {
        //选中的列表
        checkedList() {
            switch (this.$route.name) {
                case "handover":
                    return this.showListTotal.filter(v => v.checked);
                case "successionOrders":
                    return this.SOInfo.assets;
                case "shiftDetail":
                    return this.SOInfo.assets;
            }
        },
        //检查页面
        checkPage() {
            return {
                handover: this.$route.name === "handover",
                successionOrders: this.$route.name === "successionOrders",
                shiftDetail: this.$route.name === "shiftDetail"
            };
        },
        //交接信息
        shiftInfos() {
            return shiftInfo[this.$route.name].call(this);
        }
    },
    created() {
        this.getOriginData();
    },
    methods: {
        //分页变化
        pageChange(page) {
            this.doAddList();
            this.currentPage = page;
            this.offset = (page - 1) * this.limit;
            this.getAssetList(true);
        },
        //keyword变化
        inputChange(e) {
            if (this.isInput) {
                this.getAssetList();
            }
        },
        compositionend() {
            this.isInput = true;
            this.getAssetList();
        },
        //获得初始信息
        getOriginData() {
            if (this.checkPage.handover) {
                //获得当前用户所在科室其他员工信息
                this.$axios.get("/shiftChange/getAllUser").then(res => {
                    this.turnOnDuty = res.data.filter(v => {
                        return v.userId != this.userInfo.id;
                    });
                });
                this.getAssetList();
            } else if (this.checkPage.shiftDetail) {
                this.$axios
                    .get(`/shiftChange/query/${this.$route.query.id}`)
                    .then(res => {
                        this.SOInfo = res.data;
                    });
            } else if (this.checkPage.successionOrders) {
                this.$axios
                    .get(`/shiftChange/queryHandInfo/${this.$route.query.id}`)
                    .then(res => {
                        this.SOInfo = res.data;
                    });
            }
        },
        //获得
        //获得资产列表
        getAssetList(isPageChange = false) {
            if (!isPageChange) {
                this.offset = 0;
                this.currentPage = 1;
            }

            //获得资产列表
            this.$axios
                .post(`/assets/${this.userInfo.osId}/list`, {
                    limit: this.limit,
                    offset: this.offset,
                    params: {
                        departmentId: this.userInfo.osId,
                        keyword: this.keyword
                    }
                })
                .then(res => {
                    this.recordsTotal = res.data.recordsTotal;
                    this.assetList = res.data.data.map(v => {
                        v.checked = false;
                        return v;
                    });
                    this.assetListFormat();
                });
        },

        //列表同步format
        assetListFormat() {
            this.assetList = this.assetList.map(v => {
                let index = this.checkedListTotal.findIndex(
                    value => value.id === v.id
                );
                v.checked =
                    index === -1 ? false : this.checkedListTotal[index].checked;
                return v;
            });
            this.checkAll();
        },
        //点击添加按钮
        doAdd() {
            (this.keyword = ""), this.getAssetList(); //待定
            // this.assetListFormat();
            this.addAsset = true;
        },
        //移除按钮
        doTrash(id) {
            kldConfirm({
                title: "警告",
                content: "确认移除该项设备信息？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.checkedListTotal[
                        this.checkedListTotal.findIndex(v => v.id === id)
                    ].checked = false;
                    this.checkedListTotal[
                        this.checkedListTotal.findIndex(v => v.id === id)
                    ].remark =
                        "";
                    this.showListTotal = JSON.parse(
                        JSON.stringify(this.checkedListTotal)
                    );
                }
            });
        },
        //添加备注
        addRemark(e, id) {
            this.checkedListTotal[
                this.checkedListTotal.findIndex(v => v.id === id)
            ].remark =
                e.target.value;
        },
        //伸缩按钮
        doFlexible() {
            this.tableBodyShow = !this.tableBodyShow;
            $(this.$refs["hide-show"]).slideToggle();
        },
        //全选全不选
        changeAll(checked) {
            this.isChangeAll = checked;
            this.assetList.map(v => {
                v.checked = checked;
                return v;
            });
        },
        easySelect(i) {
            this.assetList[i].checked = !this.assetList[i].checked;
            this.checkAll();
        },
        //检查全选
        checkAll() {
            this.isChangeAll =
                this.assetList.filter(v => v.checked).length === this.limit;
        },
        //模态确定按钮
        doAddList(data = false) {
            this.assetList.forEach(v => {
                let index = this.checkedListTotal.findIndex(
                    value => value.id == v.id
                );
                if (index === -1) {
                    this.checkedListTotal.push({ ...v });
                } else {
                    this.checkedListTotal[index].checked = v.checked;
                }
            });
            if (data) {
                this.showListTotal = JSON.parse(
                    JSON.stringify(this.checkedListTotal)
                );
            }
        },
        //上传图片
        uploadImg(imglist, type) {
            let config = {
                headers: { "Content-Type": "multipart/form-data" }
            };
            return Promise.all(
                imglist.filter(img => img.type).map(img => {
                    let data = new FormData();
                    data.append("file", img);
                    return this.$axios.post(
                        `/photo/${
                            this.$store.state.user_in.osId
                        }/${type}/upload`,
                        data,
                        config
                    );
                })
            );
        },
        //上传数据格式化
        checkedDataFormat(data) {
            let handRemark = {};
            data.forEach(v => {
                handRemark[v.id] = v.remark || "";
            });
            return handRemark;
        },
        //返回
        goBack() {
            if (this.checkPage.handover) {
                kldConfirm({
                    title: "提示",
                    content: "离开本页面后您填写所有信息不会保存，确认离开？",
                    maskClosable: false, //是否允许点击遮罩关闭 默认:false
                    ok: () => {
                        //当点击了确认按钮时
                        this.$router.go(-1);
                    },
                    cancel: () => {
                        //取消按钮同上
                        console.log("cancel");
                    }
                });
                return;
            }
            this.$router.go(-1);
        },
        //确认提交交班单
        submitHandOver() {
            this.uploadImg(this.imglist, 10)
                .then(
                    res => {
                        console.log(res.map(v => v.data));
                        return this.$axios.post("/shiftChange/hand", {
                            departmentId: this.userInfo.groupId,
                            watchkeeperId: this.userInfo.id,
                            successorId: this.formValidate.successorId,
                            imageUrls: res.map(v => v.data),
                            handRemark: JSON.stringify(
                                this.checkedDataFormat(this.checkedList)
                            )
                        });
                    },
                    error => {
                        this.$Message.error("图片上传失败！");
                    }
                )
                .then(
                    res => {
                        this.$Message.success("交班成功！");
                        this.$router.go(-1);
                    },
                    error => {
                        this.$Message.error("交班失败，请检查您的网络！");
                    }
                );
        },
        //提交交接单
        doSubmit() {
            // if(this.checkedList.length===0){
            //     this.$Message.warning('交班单需要至少添加一项设备信息！');
            //     return ;
            // }

            this.$refs.handoverValidate.validate(valid => {
                if (this.checkedList.length === 0) {
                    this.$Message.warning("交班单需要至少添加一项设备信息！");
                    return;
                }
                if (valid) {
                    kldConfirm({
                        title: "确认提交",
                        content: "确认交班后，马上有同事来接班",
                        maskClosable: false, //是否允许点击遮罩关闭 默认:false
                        okText: "是", //确认按钮文本  默认:确认
                        cancelText: "否", //确认取消文本  默认:取消
                        ok: () => {
                            //当点击了确认按钮时
                            this.submitHandOver();
                        }
                    });
                }
            });
        },
        //确认接单
        doSO() {
            kldConfirm({
                title: "交接班确认",
                content: "已检查完所有交接信息，确认接班",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "是", //确认按钮文本  默认:确认
                cancelText: "否", //确认取消文本  默认:取消
                ok: () => {
                    //当点击了确认按钮时
                    this.$axios
                        .put(`/shiftChange/receive`, {
                            shiftChangeId: this.$route.query.id
                        })
                        .then(
                            res => {
                                this.$Message.success("接班成功");
                                this.$router.go(-1);
                            },
                            error => {
                                this.$Message.error(
                                    "接班失败，请检查您的网络！"
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
        CUpload,
        myPage,
        imageView,
        poptipShowInfo
    }
};
</script>

<style lang="less" scoped>
.handover-wrap {
    @paddingBottom: 80px;
    padding: 0 20px @paddingBottom;
    position: relative;
    background-color: #ffffff;
    .type-title {
        width: 100%;
        height: 50px;
        line-height: 50px;

        font-size: 16px;
        color: #f2740c;
        border-bottom: 1px solid rgba(2, 31, 57, 0.15);
    }
    .input-group {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        // height: 35px;
        margin-top: 30px;
        > div {
            margin-bottom: 20px;
            width: 100%/3;
            display: flex;
            > p {
                width: 70px;
                line-height: 35px;
            }
            > .single-input {
                flex-grow: 1;
            }
        }
        @inputPadding: 20px;
        > div:nth-child(3n + 1) {
            padding-right: @inputPadding;
        }
        > div:nth-child(3n + 2) {
            padding: 0 @inputPadding / 2;
        }
        > div:nth-child(3n) {
            padding-left: @inputPadding;
        }
    }
    /*设备信息*/
    .asset-info-wrap {
        overflow: auto;
        position: relative;
        background-color: #ffffff;
        max-height: 1000px;
        border-radius: 3px;
        margin: 20px 0;
        transition: max-height 1s linear;
        font-size: 0;
        // padding: 0 0 200px;
        .info-table {
            table-layout: fixed;
            width: 95%;
            margin: 5px auto 0;
            border-collapse: collapse;
            font-size: 14px;
            text-align: left;
            th {
                text-align: center;
                height: 50px;
                border-bottom: 1px solid #eee;
                .flexible {
                    cursor: pointer;
                    float: right;
                    margin-top: 5px;
                }
            }
            tr {
                text-align: center;
            }
            td {
                height: 50px;
                border-bottom: 1px solid #eee;
                padding: 0 5px;
                white-space: normal;
                word-break: break-all;
                .trash-info {
                    color: #5ba4c8;
                    cursor: pointer;
                }
            }
            tr:nth-child(2n) {
                background-color: #fafafa;
            }
            tr:nth-child(2n + 1) {
                background-color: #fefefe;
            }
        }
        .table-body {
            max-height: 800px;
            width: 95%;
            margin: 0 auto 30px;
            overflow: auto;
            .info-table {
                width: 100%;
                margin: 0;
            }
        }
        .little-tip {
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: #f2740c;
            margin-bottom: 20px;
        }
        .asset-info-footer {
            width: 100%;
            height: 50px;
            background-color: rgba(2, 31, 57, 0.15);
            border-radius: 5px;
            background-color: #22a1b9;
            border: 1px solid #0c8399;
            line-height: 50px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
    }
    .upload-img-wrap {
        margin: 20px 0 30px;
    }

    .footer-submit {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: @paddingBottom;
        background-color: rgba(2, 31, 57, 0.15);
        border-radius: 0px 0px 3px 3px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .ivu-btn {
            margin-right: 30px;
        }
        .ivu-btn-ghost {
            width: 75px;
            background-color: #e3e3e3;
            border: solid 1px #999999;
            color: #666666;
        }
    }
}
.SM-asset-list-wrap {
    width: 100%;

    .SM-asset-list {
        width: 100%;
        text-align: left;
        margin: 5px auto 30px;
        border-collapse: collapse;
        font-size: 14px;
        tbody {
            tr {
                cursor: pointer;
            }
        }
        th {
            height: 50px;
            border-bottom: 1px solid #eee;
        }
        td {
            height: 50px;
            border-bottom: 1px solid #eee;
            padding: 0 5px;
        }
    }
    .page-wrap {
        display: flex;
        justify-content: center;
    }
}
</style>

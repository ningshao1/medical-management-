<template>
    <div class="addDetail">
        <Modal :title="'计量详情'" :styles="{width:'1060px',transform:'translate(0px, 0px)'}" v-model="show.add">
            <Form :model="formValidate" :rules="ruleValidate" ref="formValidate">
                <div class="modal-body">
                    <Type title="计量信息"></Type>
                    <ul>
                        <li>
                            <p>
                                <span style="color:#ed3f14">*</span>计量设备类型</p>
                            <FormItem prop="mrState">
                                <Select v-model="formValidate.mrState" :disabled="true">
                                    <Option v-for="(item,i) in mdType" :value="item.value" :key='i'>{{item.label}}</Option>
                                </Select>
                            </FormItem>

                            <!-- <div class="single-detail textEllipsis">{{everyData.mrState==1?'高值计量设备':"低值计量设备"}}</div> -->
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14" v-if="routeName">*</span>计量类型</p>
                            <!-- <div class="single-detail textEllipsis">{{everyData.mtType==0?"强检":everyData.mtType==1?"非强检":"院内计量"}}</div> -->
                            <FormItem prop="mtType">
                                <Select v-model="formValidate.mtType" :disabled='$route.name==="normalEM-detail"?true:false'>
                                    <Option v-for="(item,i) in mtTypes" :value="item.value" :key='i'>{{item.label}}</Option>
                                </Select>
                            </FormItem>
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14" v-if="routeName">*</span>执行人</p>
                            <FormItem prop="mrExecuteName">
                                <Input v-model="formValidate.mrExecuteName" placeholder="请输入执行人"></Input>
                            </FormItem>
                            <!-- <div class="single-detail textEllipsis">{{everyData.mrExecuteName}}</div> -->
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14">*</span>检定机构</p>
                            <!-- <div class="single-detail textEllipsis">{{everyData.organisationName}}</div> -->
                            <FormItem prop="mId">
                                <Select v-model="formValidate.mId">
                                    <Option v-for='(item,i) in orgList' :key='i' :value='item.id'>{{item.organisationName}}</Option>
                                </Select>
                            </FormItem>
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14">*</span>计量时间</p>
                            <FormItem prop="executionTime">
                                <!-- <div class="single-detail textEllipsis">{{everyData.executionTime}}</div> -->
                                <DatePicker :editable="false" v-model="tempTime" @on-change='getTime' type="date" placeholder="" style="width: 100%"></DatePicker>
                            </FormItem>
                        </li>
                        <!-- <li>
                            <p>计量周期</p>
                            <div>
                                <FormItem prop="executionTime">
                                    <Input placeholder="请输入计量周期">
                                    <span slot="append">月</span>
                                </FormItem>
                                </Input>
                            </div>
                        </li> -->
                        <li>
                            <p>计量费用</p>
                            <FormItem prop="mrMoney">
                                <div>
                                    <Input placeholder="请输入计量费用" v-model="formValidate.mrMoney">
                                    <span slot="append">元</span>
                                    </Input>
                                </div>
                            </FormItem>
                        </li>
                        <li>
                            <p>所耗工时</p>
                            <div>
                                <FormItem prop="mrWorkhours">
                                    <!-- {{everyData.mrWorkhours}} -->
                                    <Input placeholder="请输入所耗工时" v-model="formValidate.mrWorkhours">
                                    <span slot="append">小时</span>
                                    </Input>
                                </FormItem>

                            </div>
                        </li>
                    </ul>
                    <Type title="计量结果"></Type>
                    <ul>
                        <li>
                            <p>
                                <span style="color:#ed3f14" v-if="routeName">*</span>批准人</p>
                            <FormItem prop="mrChargeName">
                                <!-- <div class="single-detail textEllipsis">{{everyData.mrChargeName}}</div> -->
                                <Input placeholder="请输入批准人" v-model="formValidate.mrChargeName"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14" v-if="routeName">*</span>校准员</p>
                            <FormItem prop="mrCheckName">
                                <!-- <div class="single-detail textEllipsis">{{everyData.mrCheckName}}</div> -->
                                <Input placeholder="请输入校准员" v-model="formValidate.mrCheckName"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14" v-if="routeName">*</span>核验员</p>
                            <FormItem prop="mrAuditName">
                                <!-- <div class="single-detail textEllipsis">{{everyData.mrAuditName}}</div> -->
                                <Input placeholder="请输入核验员" v-model="formValidate.mrAuditName"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14" v-if="routeName&&this.formValidate.mrResult==='0'">*</span>证书编号</p>
                            <FormItem prop="mrCode">
                                <!-- <div class="single-detail textEllipsis">{{everyData.mrCode}}</div> -->
                                <Input :disabled='formValidate.mrResult==1' placeholder="请输入证书编号" v-model="formValidate.mrCode"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <p>
                                <span style="color:#ed3f14">*</span>计量结果</p>
                            <FormItem prop="mrResult">
                                <!-- <div class="single-detail textEllipsis">{{everyData.mrResult==0?"合格":"不合格"}}</div> -->
                                <RadioGroup v-model="formValidate.mrResult">
                                    <Radio label="0">合格</Radio>
                                    <Radio label="1">不合格</Radio>
                                </RadioGroup>
                            </FormItem>
                        </li>
                    </ul>
                    <div style="border:none">
                        <p style="font-size: 14px;color: #000;padding: 12px 0;">
                            合格证书
                            
                            <span class="file-size">(单个文件需要小于3M,最多五张)</span>
                        </p>
                        <FormItem prop="photos_" v-if="formValidate.mrResult==0">
                            <upload v-model="photos_" :accept="['image/jpg','image/png', 'image/gif','image/jpeg']" @error-file-size='fileSize' :maxSize='3*1024*1024'></upload>
                        </FormItem>
                    </div>
                </div>

            </Form>
            <div slot="footer">
                <Button class="back" size="large" @click="show.add=false">返 回</Button>
                <Button type="primary" size="large" @click="handleSubmit('formValidate')">确 定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import upload from "@common/kld-img-upload/kld-img-upload";
import Type from "../../adverseEvent/reportAdverseEvent/type";
export default {
    props: {
        mtId: {},
        show: {
            type: Object,
            default() {
                return { add: false };
            }
        },
        RecordID: {
            default: null
        },
        type: {},
        mtIDs: {
            default: null
        }
    },
    data() {
        return {
            orgList: [], //机构列表,
            formValidate: {
                mrState: this.$route.name == "normalEM-detail" ? 1 : 0,
                mtType: null,
                mrExecuteName: "",
                executionTime: "",
                mrMoney: "",
                mrWorkhours: "",
                mrChargeName: "",
                mrCheckName: "",
                mrAuditName: "",
                mrCode: "",
                mrResult: "0",
                mrType: 0,
                photos_: [],
                mId: ""
            },
            photos_: [],
            //
            mdType: [
                {
                    value: 0,
                    label: "低值设备"
                },
                {
                    value: 1,
                    label: "正常设备"
                }
            ],

            mtTypes: [
                {
                    value: 0,
                    label: "强检类"
                },
                {
                    value: 1,
                    label: "非强检类"
                },
                // {
                //     value: 2,
                //     label: "院内计量类"
                // }
            ],
            ruleValidate: {
                mrState: [
                    {
                        required: true,
                        message: "请选择计量设备类型"
                    }
                ],
                mtType: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === "" && this.routeName) {
                                callback(new Error("请选择计量类型"));
                            }
                            callback();
                        }
                    }
                ],
                mrExecuteName: [
                    {
                        validator: (rule, value, callback) => {
                            if (
                                (value === "" || value === null) &&
                                this.routeName
                            ) {
                                callback(new Error("请输入执行人"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],

                mId: [
                    {
                        required: true,
                        pattern: /.+/,
                        message: "请选择检定机构"
                    }
                ],
                executionTime: [
                    {
                        required: true,
                        message: "请选择计量时间"
                    }
                ],
                mrMoney: [
                    {
                        required: false,
                        message: "请输入计量费用",
                        trigger: "blur"
                    },
                    {
                        pattern: /^\d*$/,
                        message: "该选项请填写数字",
                        trigger: "blur"
                    }
                ],
                mrWorkhours: [
                    {
                        required: false,
                        message: "请输入所耗工时",
                        trigger: "blur"
                    },
                    {
                        pattern: /^\d*$/,
                        message: "该选项请填写数字",
                        trigger: "blur"
                    }
                ],
                mrChargeName: [
                    {
                        required: this.routeName,
                        message: "请输入批准人",
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                (value === "" || value === null) &&
                                this.routeName
                            ) {
                                callback(new Error("请输入批准人"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                mrCheckName: [
                    {
                        required: this.routeName,
                        message: "请输入校准员",
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                (value === "" || value === null) &&
                                this.routeName
                            ) {
                                callback(new Error("请输入校准员"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                mrAuditName: [
                    {
                        required: this.routeName,
                        message: "请输入核验员",
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                (value === "" || value === null) &&
                                this.routeName
                            ) {
                                callback(new Error("请输入核验员"));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                mrCode: [
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                this.formValidate.mrResult == "0" &&
                                value === "" &&
                                this.routeName
                            ) {
                                callback(new Error("请输入证书编号"));
                            }
                            callback();
                        }
                    }
                ],
                mrResult: [
                    {
                        required: true,
                        message: "请选择计量结果"
                    }
                ]
                // photos_: [
                //     {
                //         validator: (rule, value, callback) => {
                //             if (
                //                 this.formValidate.mrResult == "0" &&
                //                 value == "" &&
                //                 this.routeName
                //             ) {
                //                 callback(new Error("请上传图片"));
                //             }
                //             callback();
                //         }
                //     }
                // ]
            },
            tempTime: "" //用于重置时间
        };
    },
    watch: {
        "formValidate.mrResult": {
            handler() {
                if (this.formValidate.mrResult == 1) {
                    this.formValidate.mrCode = "";
                    this.photos_ = [];
                }
            }
        },
        photos_() {
            this.formValidate.photos_ = this.photos_;
        },
        type: {
            handler(mtType) {
                this.formValidate.mtType = mtType;
            },
            immediate: true
        }
    },
    created() {
        console.log(this.$route);
        this.getorg();
    },
    components: {
        Type,
        upload
    },
    computed: {
        user() {
            return this.$store.state.user_in;
        },
        routeName() {
            return this.$route.name == "normalEM-detail" ? true : false; //正常是true 低值是false
        }
    },
    methods: {
        //获取机构
        getorg() {
            this.$axios
                .get(`/measurement/getlist/${this.$store.state.user_in.osId}`, {
                    params: {
                        type: 2
                    }
                })
                .then(res => {
                    this.orgList = res.data;
                });
        },
        //获取计量时间
        getTime(time) {
            console.log(time);
            this.formValidate.executionTime = time;
        },
        //上传计量信息
        postRecord() {
            let url, mh, option;
            if (this.RecordID !== null) {
                url = `/measurementTask/updateRecord/${this.RecordID}`;
                mh = "put";
            } else {
                if (!this.routeName) {
                    url = "/measurementTask/saveLowRecord";
                } else {
                    url = `/measurementTask/saveRecord`;
                }

                mh = "post";
            }
            if (this.$route.name == "normalEM-detail") {
                option = {
                    ...this.formValidate,
                    mtId: this.mtIDs,
                    mrState:undefined
                };
            } else {
                option = {
                    ...this.formValidate,
                    mtId: this.mtId,
                    assetId: this.$route.query.id,
                   mrState:undefined
                };
            }
            delete option["photos_"];
            this.$axios[mh](url, option).then(res => {
                this.show.add = false;
                this.$Message.success("计量信息添加成功");
                this.$emit("addSuccess");
                this.$refs["formValidate"].resetFields();
                if (this.$route.name == "normalEM-detail") {
                    console.log(this.type);

                    this.formValidate.mtType = this.type;
                }
                this.tempTime = "";
                this.photos_ = [];
            });
        },
        //确定事件
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.formValidate.mrResult == 0) {
                        this.files();
                    } else {
                        this.postRecord();
                    }
                } else {
                }
            });
        },
        files() {
            const config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            Promise.all(
                this.photos_.map(img => {
                    const data = new FormData();
                    data.append("file", img);

                    return this.$axios.post(
                        `/photo/${this.user.osId}/5/upload`,
                        data,
                        config
                    );
                })
            )
                .then(
                    allRes => {
                        const photos = allRes.map(res => res.data);
                        let url, mh, option;

                        if (this.RecordID !== null) {
                            url = `/measurementTask/updateRecord/${
                                this.RecordID
                            }`;
                            mh = "put";
                        } else {
                            if (!this.routeName) {
                                url = "/measurementTask/saveLowRecord";
                            } else {
                                url = `/measurementTask/saveRecord`;
                            }

                            mh = "post";
                        }
                        if (this.$route.name == "normalEM-detail") {
                            option = {
                                ...this.formValidate,
                                mtId: this.mtIDs,
                                photos,
                                mrState:undefined
                            };
                        } else {
                            option = {
                                ...this.formValidate,
                                mtId: this.mtId,
                                photos,
                                assetId: this.$route.query.id,
                                mrState:undefined
                            };
                        }
                        delete option["photos_"];
                        return this.$axios[mh](url, option).then(res => {
                            this.show.add = false;
                            this.$refs["formValidate"].resetFields();
                            if (this.$route.name == "normalEM-detail") {
                                this.formValidate.mtType = this.type;
                            }
                            this.tempTime = "";
                            this.photos_ = [];
                            this.$emit("addSuccess");
                        });
                    },
                    error => {
                        this.$Message.warning("图片上传失败");
                        return Promise.reject(error);
                    }
                )
                .then(() => {
                    this.$Message.success("计量信息添加成功");
                });
        },
        //当大于设置图片大小触发的函数
        fileSize() {
            this.$Message.warning("请上传小于3M的图片");
        }
    }
};
</script>
<style lang="less" scoped>
@import url("./EMD");
.modal-body {
    /deep/.ivu-form-item-error-tip {
        padding-top: 2px;
    }
    > ul {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        p {
            font-size: 14px;
            color: #000000;
            padding: 12px 0;
        }
        > li {
            width: 100%/3;
            @padding: 1%;
            &:nth-child(3n + 1) {
                padding-right: @padding;
            }
            &:nth-child(3n + 2) {
                padding: 0 @padding / 2;
            }
            &:nth-child(3n) {
                padding-left: @padding;
            }
            // padding-right:5%;
            .single-detail {
                @height: 40px;
                position: relative;
                height: @height;
                line-height: @height;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px #c8ced3;
                padding-left: 10px;
                div {
                    width: @height - 2;
                    border-left: solid 1px #c8ced3;
                    position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background-color: #f5f6fa;
                    border-radius: 3px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                > span {
                }
            }
        }
    }
    .certificate {
        p {
            font-size: 14px;
            color: #000000;
            padding: 12px 0;
        }
        div {
            width: 100%;
            height: 106px;
            background-color: #ffffff;
            border-radius: 2px;
            border: dashed 1px #ccd2d7;
            display: flex;
            align-items: center;
            padding-left: 10px;
            img {
                width: 60px;
                height: 60px;
                border-radius: 2px;
            }
        }
    }
}
.back {
    background-color: #a9a8a9;
    color: #fff;
    padding: 7px 20px;
}
.file-size {
    color: #999;
    font-size: 12px;
}
</style>


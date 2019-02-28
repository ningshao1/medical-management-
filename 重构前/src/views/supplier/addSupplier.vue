<template>
    <div style="padding-bottom:100px;">
        <div class="content" @click="boxShow1=false">
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
                        <router-link to="/index/supplier" style=" color: #999 ">供应商管理</router-link>
                    </li>
                    <li style="cursor:pointer">
                        <span>></span>
                        新增供应商
                    </li>
                </ul>
            </div>
            <div class="nav-sub">
                <h2> <img src="../../img//addSUP.svg" alt="" style="width:20px;margin-right:5px;cursor: pointer;vertical-align: middle;">新增供应商</h2>
            </div>
            <div class="line"></div>
            <div style="">

                <div class="supplier">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                        <div class="supplier-list">
                            <ul>
                                <li>
                                    <p>供应商分类选择：
                                        <span>*</span>
                                    </p>
                                    <FormItem>
                                        <Select placeholder='供应商分类选择' id="supplier-select" v-model="formValidate.classType">
                                            <Option value='0'>设备供应商</Option>
                                            <Option value='1'>保养供应商</Option>
                                            <Option value='2'>计量机构</Option>
                                        </Select>
                                    </FormItem>
                                </li>

                                <li>
                                    <p>供应商名称：
                                        <span>*</span>
                                    </p>
                                    <FormItem prop="supplierName">
                                        <Input :maxlength="100" type="text" placeholder="请输入供应商名称" v-model="formValidate.supplierName"></Input>
                                    </FormItem>
                                </li>
                                <li>
                                    <p>联系人：
                                        <span>*</span>
                                    </p>
                                    <FormItem prop="supplierContactName">
                                        <Input type="text" placeholder="请输入联系人： " v-model="formValidate.supplierContactName"></Input>
                                    </FormItem>
                                </li>

                                <li>
                                    <p>联系电话号码：
                                        <span>*</span>
                                    </p>
                                    <FormItem prop="supplierPhone">
                                        <!-- <Input type="text" placeholder="请输入联系方式 " v-model="formValidate.supplierPhone"></Input> -->
                                        <kld-input-number type="text" :isTel='true' placeholder="请输入联系方式 " v-model="formValidate.supplierPhone"></kld-input-number>
                                    </FormItem>
                                </li>
                                <li>
                                </li>
                                <li style="width: 100%">
                                    <p>供应商地址：</p>
                                    <!-- <Input type="text" placeholder="请输入供应商地址：" v-model="model1"></Input> -->

                                    <Cascader :data="data" v-model="model1" placeholder="请输入供应商地址：" :load-data="loadData" @on-change='get_a' style="width:30%;display:inline-block" clearable></Cascader>
                                    <input type="text" placeholder="详细地址" style="position: relative;top:2px;width:68%" v-model="addressDetail"></input>
                                </li>

                                <li style="width: 100%">
                                    <p>添加标签：
                                        <i>（每台设备最多添加5个标签）</i>
                                    </p>
                                    <div class="lable-content">
                                        <input type="text" style=" cursor: pointer;" @click.stop="boxShow=true;boxShow1=true" class="labebtn" v-model="addinfo">
                                        <div class="lable-list">
                                            <div class="asset-lable" v-for="(item,index) in btnlist" :key="index" v-show='item.labelName!==""&&item.labelName!==null'>{{item.labelName}}
                                                <span><img src="./image/close.png" alt="" @click="hidebtn(index)"></span>
                                            </div>
                                        </div>
                                        <img src="./image/down.png" alt="" class="lable-down">
                                    </div>
                                    <div class="label-box" v-show="boxShow1" style=" display:flex;flex-wrap: wrap;">
                                        <div class="box-label" v-for="(item,index) in btninfo" @click="addbtns(index)" :key="index">{{item.labelName}}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="contract-up">
                            <span class='bx-title'> 营业执照：</span>
                            <span style="color: #f2740c;" v-if='formValidate.classType==="0"'>
                                *（拖拽图片到该区域，完成上传；或点击）
                            </span>
                        </div>
                        <FormItem prop="resPhoto">
                            <CUpload :fileList="formValidate.resPhoto"></CUpload>
                        </FormItem>
                        <div class="contract-up">
                            <span class='bx-title'> 医疗器械经营许可证：</span>
                            <span style="color: #f2740c;" v-if='formValidate.classType==="0"'>
                                *（拖拽图片到该区域，完成上传；或点击）
                            </span>
                        </div>
                        <FormItem prop="resPhoto1">
                            <CUpload :fileList="formValidate.resPhoto1"></CUpload>
                        </FormItem>
                        <div style="color:red" v-show="photo1"> 医疗器械经营许可证图片必须上传</div>
                        <div style="margin-top:20px;">
                            <p style="margin-bottom:20px">医疗器械经营许可证到期时间：
                                <span style="color:#f2740c" v-if='formValidate.classType==="0"'>*</span>
                            </p>
                            <FormItem prop="datas">
                                <DatePicker :placement='"top-start"' :editable="false" placeholder="请输入签订日期" style="width: 50%;margin-top:12px" @on-change="getStartTime" format="yyyy-MM-dd" v-model="formValidate.datas"></DatePicker>
                            </FormItem>

                        </div>
                    </Form>

                </div>
                <div class="asset-footer">
                    <div class="retrieval-btn">
                        <Button @click="del_info.modal2 = true">取消</Button>
                        <Button :loading="submitLoading" class="btn-active" @click="handleSubmit('formValidate')">确定</Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="copy">
            Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
        </div>
        <promt :msginfo='del_info' @pro_ok="back"></promt>
        <promt :msginfo='del_info1' @pro_ok="delimg"></promt>
        <promt :msginfo='del_info2' @pro_ok="delimgs"></promt>
    </div>
</template>

<script>
import promt from "../../common/prompt/prompt";
import CUpload from "@common/C-Upload/C-upload";
import { uploadImg } from "@common/C-Upload/uploadImgAPI.js";
import kldInputNumber from "@common/kld-input-number";
export default {
    data() {
        return {
            submitLoading: false,
            indimg: "",
            eimg: "",
            indimg1: "",
            eimg1: "",
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要退出当前编辑页面",
                modal2: false
            },
            del_info1: {
                title: "提示",
                okText: "确认",
                name: "是否要删除当前图片",
                modal2: false
            },
            del_info2: {
                title: "提示",
                okText: "确认",
                name: "是否要删除当前图片",
                modal2: false
            },
            time: "",
            up: false,
            photo: false,
            photo1: false,

            addressDetail: "",
            btnid: [],
            values: "",
            btninfo: [],
            btnlist: [],
            boxShow1: "",
            addinfo: "",
            next_: false,
            information: "",
            region: ["", "", ""],
            formValidate: {
                classType: "0",
                supplierName: "",
                supplierContactName: "",
                supplierPhone: "",
                datas: "",
                resPhoto: [], //营业执照
                resPhoto1: []
            },

            data: [
                {
                    value: "beijing",
                    label: "北京",
                    children: [],
                    loading: false
                },
                {
                    value: "hangzhou",
                    label: "杭州",
                    children: [],
                    loading: false
                }
            ],
            model1: [],
            boxShow: false,
            idinfo: [],
            info: []
        };
    },

    computed: {
        imgsrc() {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            let img = `${this.upfile_}/photo/${osid}/2/upload?login-token=${
                JSON.parse(localStorage.getItem("token")).token
            }`;
            return img;
        },
        imgsrc1() {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            let img = `${this.upfile_}/photo/${osid}/4/upload?login-token=${
                JSON.parse(localStorage.getItem("token")).token
            }`;
            return img;
        },
        ruleValidate() {
            const that = this;
            return {
                supplierName: [
                    {
                        required: true,
                        message: "供应商名称为必填字段",
                        trigger: "blur"
                    }
                ],
                supplierContactName: [
                    {
                        required: true,
                        message: "联系人为必填字段",
                        trigger: "blur"
                    }
                ],
                supplierPhone: {
                    required: true,
                    message: "联系方式为必填字段",
                    trigger: "blur"
                },
                resPhoto: {
                    validator(rule, value, callback) {
                        console.log(that.formValidate);
                        if (that.formValidate.classType === "0") {
                            if (value instanceof Array) {
                                if (value.length === 0) {
                                    callback(new Error("请上传营业执照"));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                resPhoto1: {
                    validator(rule, value, callback) {
                        console.log(that.formValidate);
                        if (that.formValidate.classType === "0") {
                            if (value instanceof Array) {
                                if (value.length === 0) {
                                    callback(new Error("请上传营业执照"));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                datas: {
                    validator(rule, value, callback) {
                        if (that.formValidate.classType === "0") {
                            if (value === "") {
                                callback(
                                    new Error(
                                        "医疗器械经营许可证到期时间为必填项"
                                    )
                                );
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                }
            };
        }
    },

    created() {
        this.getlabel();
        this.get_province();
    },
    methods: {
        back() {
            sessionStorage.setItem(
                "suuplierinfo",
                JSON.stringify(this.formValidate)
            );
            this.$router.go(-1);
        },
        loadData(item, callback) {
            item.loading = true;
            if (item.type == 1) {
                this.axios
                    .get(`address/provinceList/${item.value}`)
                    .then(res => {
                        res.data.forEach(items => {
                            item.children.push({
                                value: items.value,
                                label: items.label,
                                loading: false,
                                children: [],
                                type: items.type
                            });
                        });
                        item.loading = false;
                        callback();
                    });
            } else if (item.type == 2) {
                this.axios
                    .get(`address/provinceList/{provinceid}/${item.value}`)
                    .then(res => {
                        res.data.forEach(items => {
                            item.children.push({
                                value: items.value,
                                label: items.label
                            });
                        });
                        item.loading = false;
                        callback();
                    });
            } else if (item.type == 3) {
                // return;
            }
        },
        //获取省信息
        get_province() {
            this.axios.get(`address/provinceList`).then(res => {
                this.data = res.data.map(provide => {
                    const result = {
                        value: provide.value,
                        label: provide.label,
                        type: provide.type,
                        loading: false,
                        children: []
                    };

                    //当为台湾省||香港||澳门时没有子地区
                    if (
                        provide.value === 710000 ||
                        provide.value === 810000 ||
                        provide.value === 820000
                    ) {
                        delete result.children;
                        delete result.loading;
                    }
                    return result;
                });
            });
        },
        //获取值
        get_a(e, p) {
            this.region = e;
        },

        //添加标签
        addbtn() {
            this.axios
                .post(`labels`, {
                    labelName: this.addinfo.slice(0, 5),
                    labelType: 4
                })
                .then(res => {
                    this.getlabel();
                    this.addinfo = "";
                    this.boxShow = false;
                    this.boxShow1 = true;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //获取标签列表
        getlabel() {
            this.axios
                .post(`labels/list/${4}`, {})
                .then(res => {
                    this.btninfo = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        //删除图标
        hidebtn(index) {
            this.btnlist.splice(index, 1);
        },

        //添加图标
        addbtns(index) {
            if (this.btnlist.length > 4) {
                this.$Message.warning("最多只能添加5个标签");
                return;
            } else {
                this.btnlist.push({
                    labelName: this.btninfo[index].labelName,
                    id: this.btninfo[index].id
                });
            }

            var hash = {};
            this.btnlist = this.btnlist.reduce(function(item, next) {
                hash[next.labelName]
                    ? ""
                    : (hash[next.labelName] = true && item.push(next));
                return item;
            }, []);
        },
        up_succ(e) {
            this.photo = false;
            this.$Message.success("文件上传成功");
            this.next_ = true;
            this.formValidate.resPhoto.push(e);
        },
        up_error(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        rm_(e, index) {
            this.del_info1.modal2 = true;
            this.indimg = index;
            this.eimg = e.response;
        },
        delimg() {
            this.axios
                .delete(`/photo/delete?url=${this.eimg}`)
                .then(res => {
                    this.next_ = false;
                    this.formValidate.resPhoto.splice(this.indimg, 1);
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    cosnole.log(error);
                });
        },
        up_succ1(e) {
            this.photo1 = false;
            this.$Message.success("文件上传成功");
            this.next_ = true;
            this.formValidate.resPhoto1.push(e);
        },
        up_error1(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        rm_1(e, index) {
            this.del_info2.modal2 = true;
            this.indimg1 = index;
            this.eimg1 = e.response;
        },
        delimgs() {
            this.axios
                .delete(`/photo/delete?url=${this.eimg1}`)
                .then(res => {
                    this.next_ = false;
                    this.formValidate.resPhoto1.splice(this.indimg1, 1);
                    this.$Message.success("文件删除成功");
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    console.log(error);
                });
        },
        //获取签订日期
        getStartTime(data) {
            if (this.formValidate.datas) {
                this.up = false;
                this.time = data;
            }
        },

        //新增供应商验证
        handleSubmit(name) {
            for (let i = 0; i < this.btnlist.length; i++) {
                if (this.btnlist[i].id != null) {
                    this.btnid.push(this.btnlist[i].id);
                }
            }
            let info = Array.from(new Set(this.btnid));
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            sessionStorage.setItem(
                "suuplierinfo",
                JSON.stringify(this.formValidate)
            );

            this.$refs[name].validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    Promise.all([
                        uploadImg.call(this, this.formValidate.resPhoto, 3),
                        uploadImg.call(this, this.formValidate.resPhoto1, 4)
                    ])
                        .then(res => {
                            let businessPhotos = res[0].map(v => v.data);
                            let licensePhotos = res[1].map(v => v.data);
                            let url = "/supplier";
                            if (this.formValidate.classType === "1") {
                                url = "/measurement/savaMaintain";
                            } else if (this.formValidate.classType === "2") {
                                url = "/measurement/saveMeasurement";
                            }
                            return this.$axios.post(url, {
                                provinceid: this.region[0],
                                cityid: this.region[1],
                                areaid: this.region[2],
                                businessPhotos,
                                licenseDate: this.time,
                                licensePhotos,
                                supplierContactName: this.formValidate
                                    .supplierContactName,
                                supplierName: this.formValidate.supplierName,
                                supplierPhone: this.formValidate.supplierPhone,
                                labelIds: info.slice(0, 5),
                                osID: osid,
                                addressDetail: this.addressDetail,
                                type: this.formValidate.classType
                            });
                        })
                        .then(res => {
                            this.$Message.info("新增数据成功");
                            // this.$router.push("/index/supplier");
                            this.$router.go(-1);
                        })
                        .finally(() => (this.submitLoading = false));
                } else {
                    // this.$Message.warning("Fail!");
                }
            });
        }
    },
    components: {
        promt,
        CUpload,
        kldInputNumber
    }
};
</script>

<style scoped lang='less'>
::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
.imgs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 120px;
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
        h2 {
            font-weight: normal;
            color: #333333;
            font-size: 16px;
            margin-top: 1px;
            line-height: 30px;
        }
    }
    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .supplier {
        background-color: #fafafa;
        // box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 20px;
        padding: 20px 30px;
        .supplier-list {
            > ul {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                > li {
                    width: 49%;
                    margin-bottom: 20px;
                    p {
                        font-size: 14px;
                        margin-bottom: 20px;
                        color: #000000;
                        span {
                            color: #f2740c;
                        }
                        i {
                            font-style: normal;
                            color: #999999;
                        }
                    }
                    input {
                        height: 50px;
                        width: 100%;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        padding-left: 20px;
                    }
                    input:disabled {
                        background-color: #f5f6fa;
                    }
                    .lable-content {
                        position: relative;
                        cursor: pointer;
                        .lable-list {
                            position: absolute;
                            top: 8px;
                            left: 10px;
                            .asset-lable {
                                height: 36px;
                                background-color: #76bdc1;
                                border-radius: 18px;
                                border: solid 1px #0c8399;
                                margin-right: 10px;
                                padding-left: 15px;
                                font-size: 14px;
                                line-height: 36px;
                                color: #ffffff;
                                display: inline-block;
                                span {
                                    width: 30px;
                                    height: 30px;
                                    background-color: rgba(69, 133, 137, 0.5);
                                    opacity: 0.5;
                                    display: inline-block;
                                    border-radius: 50%;
                                    text-align: center;
                                    margin-left: 6px;
                                    position: relative;
                                    top: 2px;
                                }
                            }
                        }
                        .lable-down {
                            position: absolute;
                            right: 10px;
                            top: 15px;
                        }
                    }
                    .label-box {
                        //height: 110px;
                        padding: 8px 0;
                        background-color: #f5f6fa;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.1);
                        padding-left: 10px;
                        display: flex;

                        .box-label {
                            width: 70px;
                            height: 36px;
                            background-color: #76bdc1;
                            border-radius: 18px;
                            border: solid 1px #0c8399;
                            color: #fff;
                            line-height: 36px;
                            margin-right: 10px;
                            text-align: center;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
    .contract-up {
        margin-top: 20px;
        margin-bottom: 20px;
    }
}
/deep/#supplier-select {
    li {
        width: 100%;
    }
    .ivu-select-selected-value {
        line-height: 45px;
    }
}
</style>
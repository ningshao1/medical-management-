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
                    <li v-if="!$route.query.status" style="cursor:pointer">
                        <span>></span>
                        供应商详情
                    </li>
                    <li v-else style="cursor:pointer">
                        <span>></span>
                        编辑供应商
                    </li>
                </ul>
            </div>
            <div class="nav-sub">
                <h2 v-if="$route.query.status"> 编辑供应商</h2>
                <h2 v-else>供应商详情</h2>
            </div>
            <div class="line"></div>
            <div style="">

                <div class="supplier">
                    <Form :model="infos" :rules="infosRules" label-position="top" ref="infos-form">
                        <div class="supplier-list">
                            <ul>
                                <li>
                                    <FormItem label="供应商分类选择：" prop="type">
                                        <Select placeholder='供应商分类选择' id="supplier-select" v-model="infos.type" :disabled='$route.query.status=="true"||$route.query.status==true?false:true'>
                                            <Option :value='0'>设备供应商</Option>
                                            <Option :value='1'>保养供应商</Option>
                                            <Option :value='2'>计量机构</Option>
                                        </Select>
                                    </FormItem>
                                </li>
                                <li>
                                    <FormItem label="供应商名称：" prop="supplierName">
                                        <Input type="text" v-model="infos.supplierName" :disabled="status"></Input>
                                    </FormItem>
                                </li>
                                <li>
                                    <FormItem label="联系人：" prop="supplierContactName">
                                        <Input type="text" v-model="infos.supplierContactName" :disabled="status"></Input>
                                    </FormItem>
                                </li>
                                <li>
                                    <FormItem label="联系电话号码：" prop="supplierPhone">
                                        <Input v-model="infos.supplierPhone" :disabled="status" @blur="numKey" @on-keyup="infos.supplierPhone=infos.supplierPhone.replace(/[^\d]/g,'')"></Input>
                                    </FormItem>
                                </li>
                                <li style="width: 100%">
                                    <p>供应商地址：</p>
                                    <Cascader :data="data" v-model="model1" :placeholder="adress" :load-data="loadData" @on-change='get_a' style="width:30%;display:inline-block" v-if="$route.query.status" clearable></Cascader>
                                    <input type="text" style="width:30%;display:inline-block" v-model="adress" :disabled="status" v-else>
                                    <!-- <Cascader :data="data" v-model="model1" placeholder="请输入供应商地址：" :load-data="loadData" @on-change='get_a' style="width:30%;display:inline-block"></Cascader> -->
                                    <input type="text" style="margin-top:20px;width:68%" :disabled="status" v-model="infos.addressDetail"></input>
                                </li>

                                <li style="width: 100%" v-if="$route.query.status">
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
                                        <div class="box-label" v-for="(item,index) in btninfo" @click="addbtns(index)" :key="index">{{item.labelName}}
                                        </div>
                                    </div>
                                </li>
                                <li style="width: 100%" v-else>
                                    <p>供应商标签</p>
                                    <div class="lable-content">
                                        <input type="text" style=" cursor: pointer;" class="labebtn" disabled>
                                        <div class="lable-list">
                                            <div class="asset-lable" v-for="(item,index) in infos.labels" :key="index" v-show='item.labelName!=""&&item.labelName!=null'>{{item.labelName}}

                                            </div>
                                        </div>

                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div v-if="$route.query.status">
                            <FormItem prop="businessPhotos" style="margin-top: 26px;">
                                <span class="contract-up" slot="label">
                                    <span class='bx-title'> 营业执照：</span>
                                    <span style="color:#f2740c">
                                        <span>（拖拽图片到该区域，完成上传；或点击）</span>
                                    </span>
                                </span>
                                <CUpload :fileList="infos.businessPhotos" :imgURLs="businessShowPhotos"></CUpload>
                            </FormItem>
                        </div>

                        <div v-else>
                            <div class="contract-up">
                                <span class='bx-title'> 营业执照：</span>
                            </div>
                            <ImageView :imgUrlList="businessShowPhotos" :showStyle="showStyle"></ImageView>
                        </div>

                        <div v-if="$route.query.status">
                            <FormItem prop="licensePhotos" style="margin-top: 26px;">
                                <span class="contract-up" slot="label">
                                    <span class='bx-title'> 医疗器械经营许可证：</span>
                                    <span style="color:#f2740c">
                                        <span>（拖拽图片到该区域，完成上传；或点击）</span>
                                    </span>
                                </span>
                                <CUpload :fileList="infos.licensePhotos" :imgURLs="licenseShowPhotos"></CUpload>
                            </FormItem>
                        </div>
                        <div v-else>

                            <div class="contract-up">
                                <span class='bx-title'> 医疗器械经营许可证：</span>
                            </div>
                            <ImageView :imgUrlList="licenseShowPhotos" :showStyle="showStyle"></ImageView>
                            <div>
                            </div>

                        </div>
                        <FormItem label="医疗器械经营许可证到期时间：" prop="licenseDate" style="margin-top: 20px; padding-bottom: 20px;">
                            <DatePicker :editable="false" style="width: 50%;margin-top:12px" format="yyyy-MM-dd" :value="infos.licenseDate" :disabled="status" @on-change="infos.licenseDate = $event"></DatePicker>
                        </FormItem>
                    </Form>
                </div>
                <div id="mo" v-show="show">
                    <span class="close" @click="close">×</span>
                    <img id="moimg">
                </div>
                <div class="asset-footer">
                    <div class="retrieval-btn">
                        <Button @click="del_info.modal2=true" v-if="$route.query.status">取消</Button>
                        <Button @click="back" v-if="!$route.query.status">返回</Button>
                        <Button :loading="submitLoading" class="btn-active" @click="editinfo" v-show="$route.query.status">保存</Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="copy">
            Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
        </div>
        <promt :msginfo='del_info' @pro_ok="back"></promt>
        <promt :msginfo='del_info1' @pro_ok="closett"></promt>
        <promt :msginfo='del_info2' @pro_ok="closet"></promt>
    </div>
</template>

<script>
import promt from "../../common/prompt/prompt";
import ImageView from "@common/imageView/ImageView";
import CUpload from "@common/C-Upload/C-upload";
import { uploadImg } from "@common/C-Upload/uploadImgAPI.js";

export default {
    data() {
        return {
            submitLoading: false,
            showStyle: {
                "background-color": "#f5f6fa",
                "border-radius": "3px",
                border: "1px solid rgba(2,31,57,.2)"
            },
            imgindexs: "",
            imgindex: "",
            labellist: [],
            show: "",
            resPhoto: [],
            resPhoto1: [],
            addinfo: "",
            btnid: [],
            btninfo: [],
            btnlist: [],
            boxShow1: "",
            boxShow: false,
            model1: [],
            region: ["", "", ""],
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要退出当前编辑页",
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
            time: "",
            infos: {
                supplierName: "",
                supplierContactName: "",
                supplierPhone: "",
                addressDetail: "",
                licenseDate: "",
                businessPhotos: [],
                licensePhotos: []
            },
            infosRules: {
                type: {
                    required: true,
                    message: "供应商名称为必填字段"
                },
                supplierName: {
                    required: true,
                    message: "供应商名称为必填字段"
                },
                supplierContactName: {
                    required: true,
                    message: "联系人为必填字段"
                },
                supplierPhone: [
                    {
                        required: true,
                        message: "联系电话号码为必填字段"
                    }
                ],
                businessPhotos: {
                    validator: (rule, value, callback) => {
                        if (
                            this.infos.type === 0 &&
                            value.length === 0 &&
                            this.resPhoto.length === 0
                        ) {
                            callback(new Error("营业执照图片必须上传"));
                        } else {
                            callback();
                        }
                    }
                },
                licensePhotos: {
                    validator: (rule, value, callback) => {
                        if (
                            this.infos.type === 0 &&
                            value.length === 0 &&
                            this.resPhoto1.length === 0
                        ) {
                            callback(
                                new Error("医疗器械经营许可证图片必须上传")
                            );
                        } else {
                            callback();
                        }
                    }
                },
                licenseDate: {
                    validator: (rule, value, callback) => {
                        if (this.infos.type === 0 && value === "") {
                            callback(
                                new Error(
                                    "医疗器械经营许可证到期时间为必填字段"
                                )
                            );
                        } else {
                            callback();
                        }
                    }
                }
            },
            businessShowPhotos: [],
            licenseShowPhotos: [],
            id: JSON.parse(localStorage.getItem("supplierid"))
        };
    },
    watch: {
        "infos.type"() {
            this.$nextTick(() =>
                this.$refs["infos-form"].validateField("licenseDate")
            );
        },
        "infos.businessPhotos"() {
            this.$nextTick(() =>
                this.$refs["infos-form"].validateField("businessPhotos")
            );
        },
        "infos.licensePhotos"() {
            this.$nextTick(() =>
                this.$refs["infos-form"].validateField("licensePhotos")
            );
        }
    },
    computed: {
        adress() {
            return this.infos.province
                ? this.infos.province + this.infos.city + this.infos.area
                : "";
        },
        status() {
            return this.$route.query.status ? false : true;
        },
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
        }
    },
    created() {
        this.getinfo();
        this.get_province();
        this.getlabel();
    },
    components: {
        promt,
        ImageView,
        CUpload
    },
    methods: {
        delimg(index) {
            this.imgindex = index;
            this.del_info1.modal2 = true;
        },
        delimgs(index) {
            this.imgindexs = index;
            this.del_info2.modal2 = true;
        },
        numKey() {
            if (
                this.formValidate.supplierPhone < 0 ||
                !/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
                    this.formValidate.supplierPhone
                )
            ) {
                this.formValidate.supplierPhone = "";
                this.$Message.warning("请填写正确的手机号码");
            }
        },
        closet(index) {
            this.resPhoto.splice(this.imgindex, 1);
        },
        closett(index) {
            this.resPhoto1.splice(this.imgindexs, 1);
        },
        up_err(e) {
            this.$Message.warning("上传的图片已大于3M");
        },
        up_err1(e) {
            this.$Message.warning("上传的图片已大于3M");
        },
        up_succ(e) {
            this.$Message.success("文件上传成功");
            this.next_ = true;
            this.resPhoto.push(e);
        },
        // 点击预览图片
        amplification(index) {
            this.show = true;
            var moimg = document.getElementById("moimg");
            var now = document.getElementsByClassName("imgs");
            moimg.src = now[index].src;
        },
        close() {
            this.show = false;
        },
        up_error(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        rm_(e, index) {
            this.axios
                .delete(`/photo/delete?url=${e.response}`)
                .then(res => {
                    this.next_ = false;
                    this.resPhoto.splice(index, 1);
                    this.$Message.success("文件删除成功");
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    cosnole.log(error);
                });
        },

        up_succ1(e) {
            this.$Message.success("文件上传成功");
            this.next_ = true;
            this.resPhoto1.push(e);
        },
        up_error1(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        rm_1(e, index) {
            this.axios
                .delete(`/photo/delete?url=${e.response}`)
                .then(res => {
                    this.next_ = false;
                    this.resPhoto1.splice(index, 1);
                    this.$Message.success("文件删除成功");
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    cosnole.log(error);
                });
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
                    this.$Message.info("新增数据成功");
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
                return;
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
        getStartTime(date) {
            this.time = date;
        },
        back() {
            this.$router.go(-1);
        },

        //获取供应商信息
        getinfo() {
            this.axios
                .get(`/supplier/${this.id}`)
                .then(res => {
                    // this.supplierlist = res.data.data;

                    this.infos = res.data;
                    console.log(res.data.businessPhotos);
                    this.infos.businessPhotos = res.data.businessPhotos;
                    this.businessShowPhotos = res.data.businessPhotos.map(
                        v => this.upfile_ + v.photoUrl
                    );
                    this.infos.licensePhotos = res.data.licensePhotos;
                    this.licenseShowPhotos = res.data.licensePhotos.map(
                        v => this.upfile_ + v.photoUrl
                    );
                    this.btnlist = res.data.labels;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        //修改数据
        editinfo(name) {
            for (let i = 0; i < this.btnlist.length; i++) {
                if (this.btnlist[i].id != null) {
                    this.btnid.push(this.btnlist[i].id);
                }
            }
            let infott = Array.from(new Set(this.btnid));
            let btns = [];

            this.btnlist.forEach(res => {
                btns.push(res.labelId);
            });

            let infottt = infott.concat(btns);
            let info = [];
            for (var i = 0; i < infottt.length; i++) {
                if (typeof infottt[i] != "undefined") {
                    info.push(infottt[i]);
                }
            }

            let osid = JSON.parse(localStorage.getItem("user_in")).osId;

            this.$refs["infos-form"].validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    Promise.all([
                        uploadImg.call(this, this.infos.businessPhotos, 3),
                        uploadImg.call(this, this.infos.licensePhotos, 4)
                    ])
                        .then(
                            res => {
                                let businessPhotos = [
                                    ...this.infos.businessPhotos.filter(
                                        img => img.photoUrl
                                    ),
                                    ...res[0].map(v => v.data)
                                ];
                                let licensePhotos = [
                                    ...this.infos.licensePhotos.filter(
                                        img => img.photoUrl
                                    ),
                                    ...res[1].map(v => v.data)
                                ];
                                return this.axios.put(`/supplier`, {
                                    supplierName: this.infos.supplierName,
                                    supplierContactName: this.infos
                                        .supplierContactName,
                                    supplierPhone: this.infos.supplierPhone,
                                    addressDetail: this.infos.addressDetail,
                                    provinceid: this.region[0],
                                    cityid: this.region[1],
                                    areaid: this.region[2],
                                    businessPhotos,
                                    licenseDate: this.infos.licenseDate,
                                    licensePhotos,
                                    labelIds: info.length > 0 ? info : btns,
                                    osID: osid,
                                    id: this.id,
                                    type: this.infos.type
                                });
                            },
                            error => {}
                        )
                        .then(res => {
                            this.$Message.info("修改信息成功");
                            this.getinfo();
                            this.$router.push("supplier");
                        })
                        .finally(() => (this.submitLoading = false));
                }
            });
            // if (
            //     this.resPhoto.length == 0 &&
            //     this.infos.businessPhotos.length == 0
            // ) {
            //     this.$Message.warning("营业执照图片必须上传");
            //     return;
            // }
            //
            // if (
            //     this.resPhoto1.length == 0 &&
            //     this.infos.licensePhotos.length == 0
            // ) {
            //     this.$Message.warning("医疗器械经营许可证图片必须上传");
            //     return;
            // }
        }
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

.img-boxs {
    display: inline-block;
    text-align: left;
    position: relative;
    .closet {
        font-size: 30px;
        font-weight: bold;
        color: #ccc;
        position: absolute;
        top: -12px;
        right: 4px;
    }
}

.imgs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100px;
    cursor: pointer;
}

#mo {
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0px;
    left: 0px;
    z-index: 10;
}

.close {
    font-size: 40px;
    font-weight: bold;
    position: absolute;
    top: 20px;
    right: 14%;
    color: #f1f1f1;
}

.close:hover,
.close:focus {
    color: #bbb;
    cursor: pointer;
}

#moimg {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    //width: 50%;
    max-width: 750px;
    //cursor: pointer;
}

.img-box {
    height: 80px;
    border: 1px dashed #ccc;
    display: flex;
    align-items: center;
    img {
        height: 45px;
        display: inline-block;
        margin-left: 10px;
        margin-top: 10px;
    }
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
            margin-top: 8px;
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
                        margin-bottom: 10px;
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
                                //width: 90px;
                                min-width: 80px;
                                background-color: #76bdc1;
                                border-radius: 18px;
                                border: solid 1px #0c8399;
                                margin-right: 10px;
                                padding: 0 15px;
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
                        padding-bottom: 10px;
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
                            margin-top: 10px;
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

#supplier-select {
    li {
        width: 100%;
    }
    /deep/ .ivu-select-selected-value {
        line-height: 45px;
        color: #545454;
    }
}
</style>
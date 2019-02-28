<template>
    <div class="cemd-wrap container-fluid">
        <Form ref="EM-form" :model="EMform" :rules="EMrule">
            <div class="container  detail-wrap">
                <Type :title="'基础信息'"></Type>
                <ul>
                    <li>
                        <!-- <p>设备名称:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="设备名称" prop="assetName">
                                <Input type="text" v-model="EMform.assetName" placeholder="请填写设备名称" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>设备型号:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="设备型号" prop="alClass">
                                <Input type="text" v-model="EMform.alClass" placeholder="请填写设备型号" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>设备序列号:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="设备序列号" prop="alOldCode">
                                <Input type="text" v-model="EMform.alOldCode" placeholder="请填写设备序列号" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>设备数量:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="数量：" prop="alNumber">
                                <Input type="text" v-model="EMform.alNumber" placeholder="请填写设备数量" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>所属科室:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="所属科室" prop="alOsId">
                                <kld-tree-select
                                    v-model="EMform.alOsId"
                                    :data="sectionList"
                                    first-expanded
                                    clearable
                                    filterable
                                ></kld-tree-select>
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>设备厂家:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="设备厂家" prop="alBrand">
                                <Input type="text" v-model="EMform.alBrand" placeholder="请填写设备厂家" />
                            </FormItem>
                        </div>
                    </li>
                </ul>
                <Type :title="'计量信息'"></Type>
                <ul>
                    <!-- <li>
                        <div class="input-wrap row">
                            <FormItem label="计量设备类型" prop="mrState">
                                <Select v-model="EMform.mrState" disabled>
                                    <Option :value="0">低值计量设备</Option>
                                    <Option :value="1">正常计量设备</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </li> -->
                    <li>
                        <!-- <p>计量类型:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="计量类型" prop="mtType">
                                <Select v-model="EMform.mtType">
                                    <Option :value="0">强检类</Option>
                                    <Option :value="1">非强检类</Option>
                                    <!-- <Option :value="2">院内计量类</Option> -->
                                </Select>
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>检定机构:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="检定机构" prop="mId">
                                <Select v-model="EMform.mId">
                                    <Option v-for="(v,i) of mtypes" :key="'types'+i" :value="v.id">{{v.organisationName}}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>计量时间:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="计量时间" prop="executionTime">
                                <DatePicker :editable="false" @on-change="date=>EMform.executionTime=date" v-model="EMform.executionTime" type="date" placeholder="请选择计量时间" style="width: 100%"></DatePicker>
                            </FormItem>
                        </div>
                    </li>
                    <li>

                        <div class="input-wrap row">
                            <FormItem label="计量周期：" prop="mtCycle">
                                <i-input type="text" v-model="EMform.mtCycle" placeholder="请填写计量周期">
                                   <span slot='append'>
                                       月
                                   </span>
                                </i-input>
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>计量费用:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="计量费用" prop="mrMoney">
                                <Input type="text" placeholder="请填写计量费用" v-model="EMform.mrMoney">
                                <span slot="append">元</span>
                                </Input>
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>所耗工时:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="所耗工时" prop="mrWorkhours">
                                <Input type="text" placeholder="请填写所耗工时" v-model="EMform.mrWorkhours">
                                <span slot="append">小时</span>
                                </Input>
                            </FormItem>
                        </div>
                    </li>
                </ul>
                <Type :title="'计量结果'"></Type>
                <ul>
                    <li>
                        <!-- <p>批准人:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="批准人" prop="mrChargeName">
                                <Input type="text" placeholder="请填写批准人" v-model="EMform.mrChargeName" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>校准员:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="校准员" prop="mrCheckName">
                                <Input type="text" placeholder="请填写校准员" v-model="EMform.mrCheckName" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>核检员:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="核检员" prop="mrAuditName">
                                <Input type="text" placeholder="请填写核检员" v-model="EMform.mrAuditName" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>证书编号:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="证书编号" prop="mrCode">
                                <Input type="text" placeholder="请填写证书编号" v-model="EMform.mrCode" />
                            </FormItem>
                        </div>
                    </li>
                    <li>
                        <!-- <p>计量结果:</p> -->
                        <div class="input-wrap row">
                            <FormItem label="计量结果" prop="mrResult">
                                <br>
                                <RadioGroup v-model="EMform.mrResult">
                                    <Radio :label="0">
                                        <span>合格</span>
                                    </Radio>
                                    <Radio :label="1">
                                        <span>不合格</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </div>
                    </li>
                </ul>
                <div>
                    <FormItem label="合格证书" prop="photos">
                        <br>
                        <c-upload :fileList="EMform.photos" :maxCount="'infinity'" :maxSize="3*1024" :accept="['image/jpeg','image/jpg','image/png']"></c-upload>
                    </FormItem>
                </div>

            </div>
            <div class="footer container-fluid">
                <FormItem>
                    <Button type="default" @click="exitAdd">取消</Button>
                    <Button type="primary" :loading="submiting" @click="EMSubmit('EM-form')">提交</Button>
                </FormItem>

            </div>
        </Form>

    </div>
</template>

<script>
    import Confirm from "@common/kld-confirm";
    import CUpload from "@common/C-Upload/C-upload";
    import KldTreeSelect from '@common/kld-tree-select';
    import Type from "../../adverseEvent/reportAdverseEvent/type";
    import transformTreeData from "@common/transformSectionTreeData";
    import EMform from "./API";

    export default {
    name: "add-low-EM",
    data() {
        return {
            EMform: EMform.EMform.call(this),
            EMrule: EMform.EMrule,
            user_in: this.$store.state.user_in,
            sectionList: [],

            deviceType: [
                {
                    value: "big",
                    label: "大"
                },
                {
                    value: "bigs",
                    label: "小"
                }
            ],
            mtypes: [],
            submiting: false
        };
    },
    methods: {
        EMSubmit(name) {
            this.$refs[name].validate(valid => {
                // debugger
                if (valid) {
                    this.submiting = true;
                    let postData = {
                        mrMoney: +this.EMform.mrMoney,
                        // photos:this.EMform.photos,
                        executionTime:
                            typeof this.EMform.executionTime === "string"
                                ? this.EMform.executionTime
                                : this.$store.state.localeDate(
                                      this.EMform.executionTime
                                  ),
                        mrWorkhours: +this.EMform.mrWorkhours,
                        mrResult: this.EMform.mrResult,
                        mrChargeName: this.EMform.mrChargeName,
                        mrExecuteName: this.EMform.mrExecuteName,
                        mrCheckName: this.EMform.mrCheckName,
                        mrAuditName: this.EMform.mrAuditName,
                        mrNote: this.EMform.mrNote,
                        mrCode: this.EMform.mrCode,
                        mrType: this.EMform.mrType,
                        // mrState: this.EMform.mrState,
                        mId: this.EMform.mId,
                        mtType: this.EMform.mtType,
                        alBrand: this.EMform.alBrand,
                        assetName: this.EMform.assetName,
                        alOldCode: this.EMform.alOldCode,
                        alClass: this.EMform.alClass,
                        alOsId: this.EMform.alOsId,
                        alNumber:+this.EMform.alNumber,
                        mtCycle:+this.EMform.mtCycle
                    };
                    let config = {
                        headers: { "Content-Type": "multipart/form-data" }
                    };

                    Promise.all(
                        this.EMform.photos.map(img => {
                            let data = new FormData();
                            data.append("file", img);
                            return this.$axios.post(
                                `/photo/${this.user_in.osId}/5/upload`,
                                data,
                                config
                            );
                        })
                    )
                        .then(
                            res => {
                                postData.photos = res.map(v => v.data);
                                return this.$axios.post(
                                    "/measurementTask/saveLowRecord",
                                    postData
                                );
                            },
                            error => {
                                this.$Message.warning("图片上传失败");
                                this.submiting = false;
                            }
                        )
                        .then(
                            res => {
                                this.$Message.success("新增低值计量信息成功!");
                                this.submiting = false;
                                this.$router.push({
                                    name: "low-value-EM"
                                });
                            },
                            error => {
                                this.submiting = false;
                            }
                        );
                } else {
                    this.$Message.warning("请填写所有必填字段!");
                }
            });
        },
        getSection() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionList = transformTreeData(data);
                });
        },
        //获得检定机构
        getmid() {
            this.$axios
                .get(`/measurement/getlist/${this.$store.state.user_in.osId}`, {
                    params: {
                        type: 2
                    }
                })
                .then(res => {
                    this.mtypes = res.data;
                });
        },
        getDate() {
            this.getSection();
            this.getmid();
        },
        //点击取消按钮
        exitAdd() {
            let this_ = this;
            Confirm({
                title: "提示",
                content: "是否取消低值计量设备新增",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok() {
                    //当点击了确认按钮时
                    this_.$router.go(-1);
                }
            });
        }
    },
    created() {
        this.getDate();
    },

    components: {
        Type,
        CUpload,
        KldTreeSelect
    }
};
</script>

<style lang="less">
.cemd-wrap {
    .kld-tree-select{
        .kld-input{
            height: 32px;
        }
        .ivu-icon{
            line-height: 32px;
            height: 32px;
        }
    }
    background-color: #fafafa;
    border-radius: 3px;
    padding-top: 1px;
    .detail-wrap {
        margin-top: 20px;
        margin-bottom: 20px;
        > ul {
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            > li {
                width: 100%/3;
                @padding: 3%;
                margin: 5px 0;
                &:nth-child(3n + 1) {
                    padding-right: @padding;
                }
                &:nth-child(3n + 2) {
                    padding: 0 @padding / 2;
                }
                &:nth-child(3n) {
                    padding-left: @padding;
                }
                // >p {
                //   line-height: 60px;
                //   font-size: 14px;
                //   color: #000000;
                // }
                .CEMD {
                    display: block;
                    div {
                        display: block;
                    }

                    .ivu-poptip-body {
                        height: 300px;
                        overflow: auto;
                        width: 300px;
                    }
                }
            }
        }
    }
    .footer {
        height: 80px;
        background-color: rgba(210, 210, 210, 0.5);
        border-radius: 0px 0px 3px 3px;
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        .ivu-btn {
            width: 75px;
            margin-right: 30px;
        }
        .ivu-btn-default {
            background-color: #a9a8a9;
            color: #fff;
        }
    }
    .ivu-form-item {
        .ivu-form-item-label {
            font-size: 12px;
            color: #000000;
        }
    }
}
</style>

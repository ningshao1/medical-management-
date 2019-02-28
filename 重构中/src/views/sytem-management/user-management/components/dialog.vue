<template>
    <el-dialog title="用户信息"
               :visible.sync="visible"
               custom-class="user-dialog">
        <div>
            <el-form :model="data"
                     class="user-form"
                     :rules='formRule'
                     ref="user-form">
                <el-row :gutter="20">
                    <div>
                        <kld-card title='基础信息'
                                  noHeadIcon>
                            <div>
                                <el-col :span="12">
                                    <el-form-item label="姓名"
                                                  prop='name'>
                                        <el-input placeholder="请输入姓名"
                                                  v-model="data.name">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="手机号"
                                                  prop='loginName'>
                                        <el-input placeholder="请输入手机号"
                                                  v-model="data.loginName">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label='detail?"新":""+"密码"'
                                                  prop='loginPwd'>
                                        <el-input placeholder="请输入密码"
                                                  v-model="data.loginPwd">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="确认密码"
                                                  prop='verifyPwd'>
                                        <el-input placeholder="请确认密码"
                                                  v-model="data.verifyPwd">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="所属科室"
                                                  prop=''>
                                        <el-input disabled
                                                  v-model="data.osName">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                        </kld-card>
                    </div>
                    <div>
                        <kld-card title='操作设置'
                                  noHeadIcon>
                            <el-col :span="12">
                                <el-form-item label="设置负责人"
                                              prop=''>
                                    <div class="reset">
                                        <el-checkbox label="设为本科室设备负责人"
                                                     v-model="responsible"
                                                     @change='responsibleHandler($event,0)'></el-checkbox>
                                        <el-checkbox label="设为本科室设备管理人"
                                                     v-model="administration"
                                                     @change='responsibleHandler($event,1)'></el-checkbox>
                                    </div>

                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="选择角色"
                                              prop='roleId'>
                                    <el-radio-group class="reset"
                                                    v-model="data.roleId">
                                        <el-radio class="user-radio"
                                                  v-for='(item,index) in permission'
                                                  :key='index'
                                                  :label="item.id">
                                            {{item.srDesc}}
                                        </el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="账号绑定"
                                              prop='bandingPhoneFlag'>
                                    <el-switch class="reset"
                                               active-text="启用账号与设备绑定"
                                               v-model="data.bandingPhoneFlag">

                                    </el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12"
                                    v-if="detail">
                                <el-form-item label="绑定信息"
                                              prop=''>
                                    <div class="reset"> 暂无信息</div>
                                </el-form-item>
                            </el-col>
                        </kld-card>
                    </div>

                </el-row>
            </el-form>
            <div class="dialog-btn">
                <el-button size="mini"
                           type="default"
                           @click="cancel">取消</el-button>
                <el-button size="mini"
                           @click="ensure">确定</el-button>

            </div>
        </div>
    </el-dialog>
</template>

<script>
import kldCard from "@/components/KldCard";
import { confirm } from "@/element-ui";
export default {
    name: "userDialog",
    props: {
        dialogData: {
            type: Object
        },
        value: {
            type: Boolean,
            default: true
        },
        osId: {
            type: String
        },
        detail: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            form: {},
            permission: [],
            formRule: {
                name: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ],
                loginName: [
                    {
                        required: true,
                        message: "该项为必填项"
                    }
                ],
                loginPwd: [
                    {
                        required: true,
                        message: "该项为必填项"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (
                                value.match(
                                    /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
                                )
                            ) {
                                callback();
                            } else {
                                callback(
                                    new Error(
                                        "密码需要不小于6位数，要有数字和字母组合而成 "
                                    )
                                );
                            }
                        }
                    }
                ],
                verifyPwd: [
                    {
                        required: true,
                        message: "该项为必填项"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value === this.data.loginPwd) {
                                callback();
                            } else {
                                callback(new Error("密码输入与上次输入不相同"));
                            }
                        }
                    }
                ]
            },
            responsible: false,
            administration: false,
            Responsibility: null
        };
    },
    components: {
        [kldCard.name]: kldCard
    },
    computed: {
        data: {
            set(val) {
                this.$emit("update:dialogData", val);
            },
            get() {
                return this.dialogData;
            }
        },
        visible: {
            set(val) {
                this.$emit("input", val);
            },
            get() {
                return this.value;
            }
        },
        hospitalId() {
            return this.$store.state.userInfo.osId;
        }
    },
    watch: {
        value(val) {
            if (val) this.getResponsibility();
            else {
                this.$refs["user-form"].resetFields();
            }
        }
    },
    created() {
        this.getRoleData();
    },
    methods: {
        async getRoleData() {
            const { data } = await this.$axios.post(
                `roles/${this.$store.state.userInfo.osId}/list`
            );
            this.permission = data;
        },
        async getResponsibility() {
            const { data } = await this.$axios.post(
                `/users/checkOsId/${this.osId}`
            );
            if (data && data instanceof Object) {
                this.Responsibility = data;
                this.responsible = Boolean(
                    data.responsible && data.responsible === this.data.id
                );
                this.administration = Boolean(
                    data.user && data.user === this.data.id
                );
            }
        },
        responsibleHandler(event, place) {
            let title = "";
            const classify = place ? "userName" : "responsibleName";
            const classifyName = place ? "管理人" : "负责人";
            if (event) {
                if (
                    this.Responsibility instanceof Object &&
                    this.Responsibility
                ) {
                    //判断是否获取到了这个信息
                    title = `当前科室已有${
                        this.Responsibility[classify]
                    }${classifyName}，是否更改为当前用户`;
                } else {
                    title = "是否设置当前用户作为" + classifyName;
                }
            } else {
                title = `是否取消当前用户作为${classifyName}`;
            }

            confirm({
                title: "提示",
                content: title,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: async () => {},
                cancel: () => {
                    if (place) this.administration = !event;
                    else this.responsible = !event;
                }
            });
        },
        cancel() {
            this.visible = false;
        },
        async ensure() {
            if (!this.detail) await this.addUserPOst();
        },
        async addUserPOst() {
            this.$refs["user-form"].validate(async v => {
                if (!v) return;
                const url = `users/${this.hospitalId}/${this.osId}/${
                    this.responsible ? 1 : 0
                }/${this.administration ? 1 : 0}`;

                await this.$axios.post(url, {
                    ...this.data,
                    bandingPhoneFlag: this.data.bandingPhoneFlag ? 1 : 0,
                    phone: this.data.loginName,
                    verifyPwd: undefined,
                    id: undefined
                    // name: this.popInfo.name,
                    // loginName: this.popInfo.phone,
                    // loginPwd: this.popInfo.newpw,
                    // roleId: this.popInfo.srid,
                    // // roleIds: [this.popInfo.srid],
                    // phone: this.popInfo.phone,
                    // memo: this.popInfo.memo,
                    // bandingPhoneFlag: this.onlyUserSwitchData ? 1 : 0
                });
            });
        }
    }
};
</script>

<style scoped lang="less">
/deep/.user-dialog {
    .kld-card__body {
        overflow: hidden;
        padding-bottom: 0px !important;
    }
    .el-dialog__body {
        padding-top: 10px;
    }
    .kld-card__header {
        height: 40px !important;
    }
}
.reset {
    display: inline-block;
    width: 100%;
    overflow: hidden;
}
.user-form {
    .el-form-item {
        margin-bottom: 15px;
        // height: 73px;
    }
}
/deep/.user-radio {
    margin: 5px 8px;
    .el-radio__label {
        padding-left: 5px;
    }
}
.dialog-btn {
    display: flex;
    justify-content: flex-end;
}
</style>

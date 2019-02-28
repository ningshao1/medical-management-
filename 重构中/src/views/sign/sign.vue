<template>
    <div class="kld-sign">
        <div class="sign-shade">
            <div class="sign-modal center"
                 :style="{width:width+'px',height:height+'px'}">
                <div class="modal-bg">
                    <img src="./image/sign-log.png"
                         alt=""
                         class="kld-logo"
                         :style="modalStyle">
                    <div class="bg-title">
                        恺立达，医学装备管理后台引领者
                    </div>
                </div>
                <div class="modal-input">
                    <div class="modal-info center">
                        <p class="info-title"><span>欢迎登录</span></p>
                        <el-form :model="userInfo"
                                 :rules='userRule'
                                 ref="signForm"
                                 status-icon
                                 class="sign-Form">
                            <el-form-item prop="username"
                                          :required='true'
                                          ref='user-form-item'>
                                <div :class="{'info-user':true,'info-input':true,'focus':userOnfocus}">
                                    <i class="kld-icon-user"></i>
                                    <input type="text"
                                           placeholder="用户名"
                                           @focus="userOnfocus=true"
                                           @blur='userBlurHandler'
                                           autofocus
                                           name="username"
                                           v-model.number="userInfo.username">

                                </div>
                            </el-form-item>
                            <el-form-item prop="password"
                                          :required="true"
                                          ref="pwd-form-item">
                                <div :class="{'info-pwd':true,'info-input':true,'focus':pwdOnfocus}">
                                    <i class="kld-icon-key"></i>

                                    <input type="password"
                                           placeholder="密码"
                                           @focus="pwdOnfocus=true"
                                           @blur='pwdBlurHandler'
                                           v-model="userInfo.password"
                                           name="password"
                                           @keyup.enter='getUserAll'>

                                </div>
                            </el-form-item>
                        </el-form>
                        <div>
                            <el-button class="sign-btn"
                                       @click="getUserAll"
                                       :loading='signLoading'>登录</el-button>
                        </div>
                    </div>
                    <div class="info-copyright">
                        Copyright © {{new Date().getFullYear()}}南京恺立达医院管理有限公司
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { mapMutations } from "vuex";
export default {
    data() {
        return {
            userOnfocus: false,
            pwdOnfocus: false,
            userInfo: {
                username: "",
                password: ""
            },
            userRule: {
                username: [
                    {
                        required: true,
                        message: "手机号为必填项"
                    },
                    {
                        type: "number",
                        message: "手机号必须为数字"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (/^1\d{10}$/.test(value)) {
                                callback();
                            } else {
                                callback(new Error("请输入正确的手机号"));
                            }
                        }
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "密码为必填项"
                    }
                ]
            },
            signLoading: false
        };
    },
    created() {
        this.$parent;
    },
    computed: {
        width() {
            return (1390 / 1920) * document.body.clientWidth;
        },
        height() {
            return (751 / 1080) * document.body.clientHeight;
        },
        modalStyle() {
            return {
                width:
                    this.width > 1447.73
                        ? (210 / 1390) * 1447.73 + "px"
                        : (210 / 1390) * this.width + "px"
            };
        }
    },
    methods: {
        getUserAll() {
            this.$refs["signForm"].validate(async valid => {
                if (!valid) return;
                try {
                    this.signLoading = true;
                    await this.getToken();
                    await this.getUserInfo();
                    const data = await this.getLimit();
                    this.signLoading = false;
                    this.$router.replace({ name: "home" });
                } catch (error) {
                    this.signLoading = false;
                }
            });
        },
        getToken() {
            return this.$axios
                .post(
                    `/sys/login/restful`,
                    qs.stringify({
                        ...this.userInfo,
                        agent: 0
                    }),
                    {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "Content-Type":
                                "application/x-www-form-urlencoded;charset=UTF-8"
                        }
                    }
                )
                .then(res => {
                    this.setToken(res.data);
                })
                .catch(({ response: { data: { code, message } } }) => {
                    if (code == 401) this.$message.warning(message);
                });
        },
        getUserInfo() {
            return this.$axios.get("/users/current", {}).then(({ data }) => {
                const user = data;
                user.control = true;
                // this.$store.commit("setUserIn", user_);
                this.setUserInfo(user);
            });
        },
        getLimit() {
            return this.$axios
                .get(`permissions/allPermissionsByUser`)
                .then(({ data }) => {
                    if (data === null || data.length === 0) {
                        this.$Message.warning("该用户所在的角色没有任何权限");
                        return;
                    }
                    const limit = {};
                    data.map(v => {
                        limit[v.plPermission] = v;
                    });
                    this.setLimit(limit);
                    return limit;
                });
        },
        userBlurHandler() {
            this.userOnfocus = false;
            this.dispatch(this.$refs["user-form-item"], "el.form.blur", [
                this.userInfo.username
            ]);
        },
        pwdBlurHandler() {
            this.pwdOnfocus = false;
            this.dispatch(this.$refs["pwd-form-item"], "el.form.blur", [
                this.userInfo.password
            ]);
        },
        dispatch(ref, eventName, params) {
            ref.$emit(eventName, params);
        },
        ...mapMutations(["setToken", "setUserInfo", "setLimit"])
    },
    components: {
        // [Form.name]: Form,
        // [FormItem.name]: FormItem
    }
};
</script>

<style scoped lang="less">
@singColor: #4b74e0;
input:-webkit-autofill {
    //浏览器 自动填充黄色问题
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}
.kld-sign {
    height: 100%;
    background: url("./image/背景模糊.png") no-repeat center center;
    background-size: cover;
    position: relative;
    .sign-shade {
        background: rgba(30, 50, 170, 65%);
        width: 100%;
        height: 100%;
        .kld-logo {
            width: 210px;
            margin: 20px;
        }
        .sign-modal {
            box-shadow: 0px 0px 60px 0px rgba(8, 14, 70, 0.65);
            background: #19358f;
            max-width: 1447.73px;
            min-width: 1080px;
            max-height: 781px;
            display: flex;
            position: relative;
            .modal-bg {
                width: 68%;
                height: 100%;
                background: url("./image/清晰图.png") no-repeat center center;
                background-size: cover;
                position: relative;
                .bg-title {
                    color: #ffffff;
                    font-size: 26px;
                    position: absolute;
                    right: 30px;
                    bottom: 120px;
                }
            }
            .modal-input {
                width: 32%;
                background: #fff;
                height: 100%;
                padding: 0 45px;
                position: relative;

                .modal-info {
                    width: 80%;
                    .info-title {
                        text-align: center;
                        margin: 0;
                        margin-bottom: 40px;
                        > span {
                            color: rgba(0, 0, 0, 0.85);
                            font-size: 30px;
                            display: inline-block;
                            padding-bottom: 10px;
                            border-bottom: 4px solid @singColor;
                        }
                    }
                    .info-input {
                        padding: 20px 0;
                        border-bottom: solid 2px #e9e9e9;
                        display: flex;
                        position: relative;
                        &.focus {
                            border-bottom: solid 2px @singColor;
                            i {
                                color: @singColor;
                            }
                            input {
                                color: @singColor;
                                &:-webkit-autofill {
                                    //浏览器 自动填充黄色问题
                                    color: @singColor!important;
                                    -webkit-text-fill-color: @singColor!important;
                                }
                                &::-webkit-input-placeholder {
                                    color: @singColor!important;
                                }
                            }
                        }

                        input {
                            height: 32px;
                            width: 100%;
                            border: none;
                            outline: none;
                            font-size: 20px;
                            padding: 0 30px;
                            color: rgba(0, 0, 0, 0.85);
                            letter-spacing: 2px;
                        }
                        > i {
                            font-size: 30px;
                            color: #999;
                        }
                    }
                }
                .sign-btn {
                    margin: 30px 0;
                    width: 100%;
                    height: 46px;
                    letter-spacing: 4px;
                    color: #ffffff;
                    font-size: 20px;
                    overflow: hidden;
                }
                .info-copyright {
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 14px;
                    text-align: center;
                    position: absolute;
                    bottom: 10px;
                    width: 100%;
                    left: 0;
                }
            }
        }
    }
    /deep/.sign-Form {
        .el-form-item__error {
            font-size: 14px;
        }
    }
}
</style>

<template>
    <div class="kld-sign">
        <header>
            <img src="./image/sign-logo.png1.png"
                 alt="">
            <span v-show="isFormal">V1.0</span>
            <span v-show="!isFormal">{{version}}</span>
        </header>
        <main>
            <p>医学装备信息化管理系统</p>
            <section>
                <i-form :model='formData'
                        :rules='formRule'
                        ref='kld-form'>

                    <div class="sign-title">
                        <img src="./image/login.png"
                             alt="">
                        <span>密码登录</span>
                    </div>
                    <div class="sign-input">
                        <img src="./image/role.png"
                             alt=""
                             class="role-icon">
                        <form-item prop='username'>
                            <kld-input-number class="kld-number-input"
                                              :precision='0'
                                              placeholder='请输入手机号'
                                              name="username"
                                              v-model="formData.username">
                            </kld-input-number>
                        </form-item>

                    </div>
                    <div class="sign-input">
                        <img src="./image/password.png"
                             alt=""
                             class="role-icon">
                        <form-item prop='password'>
                            <i-input class="kld-number-input kld-input"
                                     placeholder='请输入密码'
                                     v-model="formData.password"
                                     type="password"
                                     name="password"
                                     @keyup.native.enter='signHandler'>
                            </i-input>
                        </form-item>

                    </div>
                    <div class="checkbox-pwd">
                        <i-checkbox size='large'
                                    v-model="remember"><span>记住密码</span>
                        </i-checkbox>
                        <toggle-ip v-if="RUN_ENV==='java'"></toggle-ip>
                    </div>
                    <i-button class="btn"
                              @click="signHandler"
                              :loading='btnLoading'>登录
                        <img src="./image/button-arrow.png"
                             alt="">
                    </i-button>
                </i-form>

            </section>
        </main>
    </div>
</template>
<script>
import toggleIp from "./toggle-ip";
import remoteAddress from "@common/Address";
import inputNumber from "@common/kld-input-number";
import qs from "qs";
import broswer from "@common/kld-broswer";
export default {
    data() {
        return {
            isFormal: remoteAddress === "http://47.97.191.60:8080/",
            version: KLD_VERSION,
            formData: {
                username: "",
                password: ""
            },
            formRule: {
                username: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "手机号为必填项"
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
                        trigger: "blur",
                        message: "密码为必填项"
                    }
                ]
            },
            remember: false,
            btnLoading: false,
            RUN_ENV
        };
    },
    components: {
        [inputNumber.name]: inputNumber,
        toggleIp
    },
    methods: {
        signHandler() {
            if (
                broswer.broswer !== "Chrome" &&
                broswer.broswer !== "Firefox" &&
                broswer.broswer !== "Safari"
            ) {
                this.$Message.warning("请使用谷歌或者火狐浏览器访问本系统");
                return;
            }
            this.$refs["kld-form"].validate(async validate => {
                console.log(validate);
                if (!validate) return;
                await this.getToken();
                await this.getUser();
                await this.getLimit();
            });
        },
        getToken() {
            const config = {
                method: "post",
                url: "/sys/login/restful",
                data: qs.stringify({
                    um: undefined,
                    pw: undefined,
                    ...this.formData,
                    agent: 0
                }),
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8"
                }
            };
            this.btnLoading = true;
            return this.$axios(config)
                .then(({ data }) => {
                    localStorage.setItem("token", JSON.stringify(data));
                    this.$store.commit("setToken", data);
                    if (this.remember) {
                        localStorage.setItem(
                            "user_info",
                            JSON.stringify(this.formData)
                        );
                    } else {
                        localStorage.removeItem("user_info");
                    }
                })
                .catch(({ response }) => {
                    if (response && response.status === 401) {
                        this.$Message.warning(response.data.message);
                    }
                    return Promise.reject();
                })
                .finally(() => {
                    this.btnLoading = false;
                });
        },
        getUser(token) {
            return this.$axios.get("/users/current", {}).then(({ data }) => {
                const user_ = data;
                user_.control = true;
                this.$store.commit("setUserIn", user_);
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
                    this.$store.commit("setLimit", data);
                    this.$router.replace("/index/home");
                });
        }
    },
    created() {
        document.title = "医学装备信息化管理系统-登录 恺立达";
        if (localStorage.getItem("user_info")) {
            const data = JSON.parse(localStorage.getItem("user_info"));
            this.formData = {
                username: data.username || data.um,
                password: data.password || data.pw
            };
            this.remember = true;
        }
    }
};
</script>

<style lang="less" scoped>
.kld-sign {
    background: url("./bg.png");
    height: 100vh;
    background-size: cover;
    position: relative;
    header {
        height: 70px;
        background-color: rgba(24, 62, 92, 0.35);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        > img {
            width: 154px;
        }
        > span {
            color: #fff;
            font-size: 16px;
        }
    }
    main {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        > p {
            margin-top: 37px;
            text-align: center;
            font-size: 30px;
            color: #021f39;
        }
        > section {
            margin-top: 43px;
            width: 380px;
            height: 357px;
            background-color: hsla(0, 0%, 100%, 0.75);
            box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.26);
            opacity: 0.75;
            position: relative;
            padding: 30px 50px;
            .sign-title {
                display: flex;
                align-items: center;
                > img {
                    height: 39px;
                }
                > span {
                    font-size: 22px;
                    color: #333;
                    margin-left: 8px;
                }
            }
            .sign-input {
                position: relative;
                margin-top: 20px;
                > img {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 10px;
                }
                /deep/.kld-number-input {
                    background-color: hsla(0, 0%, 100%, 0.3);
                    input {
                        padding-left: 35px;
                        font-size: 14px;
                        background: transparent;
                        border: 1px solid #999;
                        color: #000;
                        &::placeholder {
                            padding-left: 5px;
                            font-size: 14px;
                        }
                    }
                }
            }
            .checkbox-pwd {
                margin-top: 20px;
                span {
                    margin-left: 8px;
                    font-size: 14px;
                }
            }
            .btn {
                margin-top: 15px;
                width: 150px;
                height: 46px;
                background-color: #22a1b9;
                border-radius: 3px;
                border: solid 1px #0c8399;
                font-size: 16px;
                color: #ffffff;
                text-align: left;
                padding-left: 27px;
                position: relative;
                cursor: pointer;
                &:hover {
                    background-color: #0b778b;
                }
                img {
                    position: absolute;
                    right: 16px;
                    top: 16px;
                }
            }
        }
    }
}
</style>


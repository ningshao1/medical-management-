<template>
    <div class="kld-sign">
        <header>
            <img src="./image/sign-log.png"
                 alt="">
            <span>v1.0</span>
        </header>

        <main class="sign-info">
            <p>
                医学装备信息化管理系统
            </p>
            <div class="sign-modal">
                <el-form ref="form">
                    <div class="sign-title">
                        <img src="./image/login.png"
                             alt="">
                        <span>
                            密码登录
                        </span>
                    </div>
                    <el-form-item>
                        <input placeholder="请输入手机号"
                               class="phone input">
                    </el-form-item>
                    <el-form-item>
                        <input placeholder="请输入密码"
                               class="password input">
                    </el-form-item>
                </el-form>

                <el-checkbox label="记住密码"></el-checkbox>
                <div>
                    <el-button size="suit"
                               class="sign-button">登录 <img src="./image/button-arrow.png"
                             class="icon"
                             alt="">
                    </el-button>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    created() {},
    methods: {},
    components: {}
};
</script>

<style scoped lang="less">
.kld-sign {
    height: 100%;
    background: url("./image/bg.png") no-repeat center center;
    background-size: cover;
    position: relative;
    header {
        height: 50px;
        background-color: rgba(24, 62, 92, 0.35);
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;

        img {
            width: 110px;
        }
        span {
            color: #fff;
            font-size: 16px;
        }
    }
    .sign-info {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -229px 0 0 -190px;
        > p {
            padding: 30px 0;
            margin: 0;
            text-align: center;
            font-size: 30px;
            color: #021f39;
        }
        .sign-modal {
            width: 380px;
            height: 357px;
            background-color: hsla(0, 0%, 100%, 0.75);
            box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.26);
            position: relative;
            padding: 30px 50px;
            opacity: 0.7;
            .sign-title {
                display: flex;
                align-items: center;
                padding-bottom: 20px;
                > img {
                    height: 35px;
                }
                > span {
                    font-size: 20px;
                    color: #333;
                    margin-left: 8px;
                }
            }
            .input {
                padding-left: 30px;
                background: transparent;
                border: 1px solid #999;
                outline: none;
                height: 40px;
                width: 100%;
            }
            /deep/.sign-button {
                margin-top: 30px;
                padding: 10px 20px;
                
                span {
                    display: flex;
                    align-items: center;
                    .icon {
                        margin-left: 30px;
                    }
                }
            }
        }
    }
}
</style>

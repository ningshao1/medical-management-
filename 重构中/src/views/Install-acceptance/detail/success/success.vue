<template>
    <div class="install-success">
        <div class="post-success">
            <div class="check">

            </div>
            <p>
                提交成功
            </p>
            <!-- <div class="title">
                巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉
            </div> -->
            <el-button @click="jump">返回列表</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "installSuccess",
    data() {
        return {};
    },
    components: {},
    created() {},
    methods: {
        jump() {
            this.$router.replace({ name: "install-list" });
        }
    }
};
</script>

<style scoped lang="less">
.install-success {
    background: #fff;
}
.post-success {
    text-align: center;
    padding: 200px 0;
    p {
        color: #000;
        font-size: 25px;
        margin: 20px 0;
    }
    .title {
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 10px;
    }
}
.check {
    position: relative;
    display: inline-block;
    width: 66px;
    height: 66px;
    background: #4bbb8b;
    border-radius: 50%;
}
.check::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 40%;
    width: 50%;
    height: 25%;
    border: 4px solid #fff;
    border-radius: 1px;
    border-top: none;
    border-right: none;
    background: transparent;
    transform: translate(-50%, -50%) rotate(-45deg);
}
</style>

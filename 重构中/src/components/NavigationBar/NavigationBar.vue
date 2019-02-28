<template>
    <div class="navigation-bar flex justify-content-between align-items-center">
        <div class="kld-logo">
            <img src="@/assets/logo.svg"
                 alt="">
        </div>
        <scroll-bar suppress-scroll-y
                    class="nav-items flex justify-content-between">
            <router-link v-for="item in navItems"
                         v-if="item.visible"
                         :to="item.to"
                         :key="item.title"
                         class="nav-item flex-shrink-0"
                         active-class="active">
                <img :src="item.image"
                     alt="">
                <p>{{item.title}}</p>
            </router-link>
        </scroll-bar>

        <div @click="logout"
             class="user">
            <p>{{userName}}</p>
            <img src="./images/user-active.png"
                 alt="">
        </div>
        <!-- <div class="progress kld-progress"
             style="display:none">
            <div></div>
        </div> -->
    </div>
</template>

<script>
import ScrollBar from "@/components/ScrollBar";

export default {
    name: "navigation-bar",
    components: {
        ScrollBar
    },
    computed: {
        navItems() {
            return [
                {
                    title: "首页",
                    image: require("./images/home.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "预置工作",
                    image: require("./images/预置工作@2x.png"),
                    to: { name: "preset-works" },
                    visible: true
                },
                {
                    title: "年度计划",
                    image: require("./images/年度计划@2x.png"),
                    to: { name: "annual-plan" },
                    visible: true
                },
                {
                    title: "资产目录",
                    image: require("./images/资产目录@2x.png"),
                    to: { name: "asset-home" },
                    visible: true
                },
                {
                    title: "报单中心",
                    image: require("./images/报单中心@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "折旧报废",
                    image: require("./images/折旧报废@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "质量控制",
                    image: require("./images/质量控制@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "物联管理",
                    image: require("./images/设备物联@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "智慧盘点",
                    image: require("./images/智慧盘点@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "设备调剂",
                    image: require("./images/设备调剂@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "效益分析",
                    image: require("./images/效益分析@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "交接班管理",
                    image: require("./images/交接班管理@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "表单管理",
                    image: require("./images/表单管理@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "数据统计",
                    image: require("./images/数据统计@2x.png"),
                    to: { name: "home" },
                    visible: true
                },
                {
                    title: "系统管理",
                    image: require("./images/系统管理@2x.png"),
                    to: { name: "system" },
                    visible: true
                }
            ];
        },
        userName() {
            try {
                return this.$store.state.userInfo.name;
            } catch {
                return "未登录";
            }
        }
    },
    methods: {
        async logout() {
            try {
                await this.$confirm({
                    content: "确认退出登录？"
                });
                this.$store.commit("logout");
            } catch {}
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/var";

.navigation-bar {
    width: 100%;
    /*height: 84px;*/
    height: 4.375vw;
    max-height: 84px;
    padding-left: 24px;
    background-color: $nav-bar-background-color;
    color: #b3b8c3;
    position: relative;
    .kld-logo {
        width: 144px;
        height: 50px;
        margin-right: 50px;
        > img {
            width: 100%;
            height: 100%;
        }
    }
    /*.nav-items{*/
    /*!*height: 100%;*!*/
    /*}*/
    .nav-item {
        width: 100px;
        height: 100%;
        border-bottom: 4px solid transparent;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        color: #b3b8c3;
        padding: 0.75vw 0 0.36vw;
        line-height: 1;
        > img {
            width: 24px;
            height: 24px;
            opacity: 0.7;
        }

        &.active,
        &:hover {
            color: #fff;
            border-color: $color-primary;
            background-color: $color-primary-light;
            > img {
                opacity: 1;
            }
        }
    }

    .user {
        @extend .nav-item;
        width: 190px;
        padding: 0 24px;
        border-left: 1px solid rgba(#fafafa, 0.18) !important;
        flex-direction: row;
        cursor: pointer;
    }
}
</style>
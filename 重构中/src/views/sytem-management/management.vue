<template>
    <div>
        <portal to='menu'>
            <div class="asset-details-side-menu-wrap">
                <kld-menu :menu="menu"
                          :default-active="$route.name"
                          :max-level='1'
                          :menu-item-class="'asset-details-menu-item'"
                          class="asset-details-side-menu kld-menu"
                          @select='routeJump'
                          ref="system-menu">
                </kld-menu>

            </div>
        </portal>
        <div class="side-content">
            <router-view></router-view>
        </div>
        <portal to='tips'>
            <p class="title">系统管理操作说明</p>

            <div class="management-content">
                <div>
                    1、资产卡片展示单台资产全生命周期的记录信息，可使用左侧导航进行模块切换查看；
                </div>
                <div>
                    2、使用手机APP扫描资产二维码后，可在手机端进行相应操作；

                </div>
                <div>
                    3、首页的【打印全部】功能提供资产卡片全部模块的综合性打印。如需要单独模块打印，可进入对应模块进行打印操作；

                </div>
                <div>
                    4、当设备处于需要报废的阶段，可使用【申请报废】功能进行报废申请。

                </div>
            </div>

        </portal>
    </div>
</template>

<script>
import KldMenu from "@c/KldMenu";
import route from "./route.js";
import { Portal } from "portal-vue";
export default {
    data() {
        return {
            menu: route[0].children
        };
    },
    components: {
        [KldMenu.name]: KldMenu,
        Portal
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            const menu = this.$refs["system-menu"]._menu;

            if (menu[0]) {
                const find = menu.find(v => v.name === this.$route.name);

                if (!find) {
                    this.$router.replace({ name: menu[0].name });
                }
            } else this.$message.warning("系统管理暂无任何权限，请重新配置");
        });
    },
    methods: {
        routeJump(routeName, routeMatch, menuItem) {
            this.$router.replace({ name: routeName });
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";
.title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    margin-bottom: 10px;
}
.management-content {
    div {
        margin-bottom: 10px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
    }
}
.asset-details-side-menu-wrap {
    width: 240px;
    height: 100%;
    background-color: #fff;
    > .asset-details-side-menu {
        border-right: none;
    }

    /deep/.asset-details-menu-item.el-menu-item {
        border-left: 2px solid transparent;

        &.is-active {
            border-left: 2px solid $--color-primary;
            background-color: $body-background-color;
        }
    }
}
.asset-details-wrap {
    display: flex;
    $wrap-width: 24px;
    > .side-content {
        max-height: 70vh;
        overflow: hidden;
        flex: 1;
    }
}
</style>

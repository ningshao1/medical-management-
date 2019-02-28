<template>
    <div class="asset-details-wrap">
        <portal to='menu'>

            <div class="asset-details-side-menu-wrap">

                <kld-menu
                    :menu="menu"
                    :default-active="$route.name"
                    :max-level='1'
                    :menu-item-class="'asset-details-menu-item'"
                    @select="routeJump"
                    class="asset-details-side-menu kld-menu"
                >
                </kld-menu>

            </div>
        </portal>
        <div class="side-content">
            <keep-alive :include="include">
                <router-view :keep-alive-include='keepAliveInclude'></router-view>
            </keep-alive>
        </div>

    </div>
</template>
<script>
import KldMenu from "@c/KldMenu";
import route from "./route.js";
import { Portal } from "portal-vue";
import { baseMixin } from "./mixin.js";
export default {
    name: "asset-details",
    components: { KldMenu, Portal },
    mixins: [baseMixin],
    props: {},
    data() {
        return {
            menu: route[0].children,
            includeSet: new Set(),
            includeSetTemp: 0
        };
    },
    computed: {
        include() {
            let x = this.includeSetTemp;
            return [...this.includeSet];
        }
    },
    created() {
        this.getRepairList();
    },
    methods: {
        routeJump(routeName, routeMatch, menuItem) {
            this.$router.replace({ name: routeName });
        },
        keepAliveInclude(componentName, isKeepAlive = true) {
            if (isKeepAlive) {
                this.includeSet.add(componentName);
                this.includeSetTemp++;
            } else {
                this.includeSet.delete(componentName);
                this.includeSetTemp++;
            }
        },
        async getRepairList() {
            const {
                data: { data }
            } = await this.$axios.post(`/faultReport/faultReportByAsId`, {
                limit: 1,
                offset: 0,
                params: {
                    assetId: this.id
                }
            });
            // if (data.length && data[0].type == "1") {
            //     this.redDOt.maintenance = true;
            // }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";
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
        flex: 1;
    }
}
</style>
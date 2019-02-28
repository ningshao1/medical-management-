<template>
    <page-wrap no-title>
        <div class="IoT-wrap flex">
            <div style="width: 300px;">
                <kld-nav title="物联管理"
                         :items="routes"
                         router
                         class="full-height"
                         style="min-height: 80vh"
                ></kld-nav>
            </div>
            <div style="width: calc(100% - 300px);">
                <page-wrap class="pl-20" no-breadcrumb>
                    <router-view></router-view>
                </page-wrap>
            </div>
        </div>
    </page-wrap>
</template>

<style lang="less" scoped>
.IoT-wrap {

}
</style>

<script>
import {PageWrap} from "@/components";
import KldNav from "@/views/adjust/common/kld-nav";
import route from "./route";

export default {
    name: "IoT-wrap",
    components: {
        PageWrap,
        KldNav
    },

    computed: {
        routes() {
            return route[0].children.map(({ name, meta: { label } }) => ({
                title: label,
                to: { name }
            }));
        }
    },

    beforeRouteEnter(to, from, next) {
        if (to.name === "IoT-manage") {
            next(vm => {
                vm.$router.push(vm.routes[0].to);
            });
        } else {
            next();
        }
    },

    watch: {
        $route: {
            immediate: true,
            async handler({ name }) {
                if (name === "IoT-manage") {
                    if (!this.routes) {
                        await this.$nextTick();
                    }
                    const firstRoute = this.routes[0];

                    if (firstRoute) {
                        this.$router.push(firstRoute.to);
                    }
                }
            }
        }
    }
};
</script>
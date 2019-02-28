<template>
    <keep-alive :include="keepAliveInclude">
        <router-view></router-view>
    </keep-alive>
</template>

<script>
import keepAliveIncludes from "./API.js";//所有需要被缓存的页面
export default {
    name: "cache-page",
    abstract:true,
    data() {
        return {
            keepAliveInclude: [],
            keepAliveRoute: null, //需要缓存的路由中间值
            timer: null,
        };
    },
    watch: {
        $route(to, from) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                let temp = keepAliveIncludes.find(v => v.to === to.name);
                //进入待缓存目标组件->生成缓存数组
                if (temp) {
                    this.creatCacheArray(temp, to);
                    return;
                }

                //进入待缓存目标组件后续未进入待缓存目标组件的条件组件->清空缓存数组
                if (
                    this.keepAliveRoute &&
                    !this.keepAliveRoute.next.includes(to.name)
                ) {
                    this.keepAliveInclude = [];
                    this.keepAliveRoute = null;
                }
            }, 100);
        }
    },
    created() {
        let temp = keepAliveIncludes.find(v => v.to === this.$route.name);
        if (temp) {
            this.creatCacheArray(temp, this.$route);
        }
    },
    methods: {
        creatCacheArray(cacheRoute, route) {
            this.keepAliveRoute = cacheRoute;
            this.keepAliveInclude = route.matched.map(
                ({
                    components: {
                        default: { name }
                    }
                }) => name
            );
        }
    }
};
</script>


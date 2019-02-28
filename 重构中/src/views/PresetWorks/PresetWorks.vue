<template>
    <div class="preset-works">
        <Portal to="menu">
            <el-menu class="full-height kld-menu" style="width: 240px;" router :default-active="defaultActiveRouteName">
                <el-menu-item v-for="route in routes" :route="{name: route.name}" :index="route.name" :key="route.name">{{route.meta.label}}</el-menu-item>
            </el-menu>
        </Portal>
        <router-view></router-view>
    </div>
</template>

<script>
    import {Portal} from '@/components';
    import routes from './route';
    export default {
        name: "preset-works",
        components: {
            Portal
        },
        computed: {
            routes() {
                return routes[0].children;
            },
            currentRouteName() {
                return this.$route.name;
            },
            defaultActiveRouteName() {
                const
                    {routes} = this,
                    route = this.$route.matched.find(
                        route => routes.some(
                            ({name}) => name === route.name
                        )
                    );

                if (route) {
                    return route.name;
                }
            },
        },

        watch: {
            $route: {
                handler({name}) {
                    if (name === 'preset-works') {
                        this.$router.push({
                            name: this.routes[0].name
                        });
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .preset-works {

    }
</style>
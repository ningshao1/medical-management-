<template>
    <div class="bread-crumb flex justify-content-between align-items-center">
        <div class="bread-crumb-items flex flex-shrink-0">
            <template v-for="(route, index) in routes">
                <template v-for="isLast in [index === routes.length - 1]">
                    <router-link
                            :to="{name: route.name}"
                            :class="{'text-primary': isLast}"
                            class="bread-crumb-item"
                            :key="route.name"
                    >{{route.label}}</router-link>
                    <span v-if="! isLast" class="text-secondary px-6">/</span>
                </template>
            </template>
        </div>
        <PortalTarget
                name="breadcrumb"
                multiple
                class="flex align-items-center full-height"
        ></PortalTarget>
    </div>
</template>

<script>
    import {PortalTarget} from '@/plugins/portal-vue';

    export default {
        name: "bread-crumb",
        components: {PortalTarget},
        computed: {
            routes() {
                return [
                    {
                        name: 'home',
                        label: '首页',
                    }
                ].concat(
                    this.$route.matched
                        .map(
                            ({name, meta}) => ({name, ...meta})
                        )
                        .filter(
                            ({name, breadcrumbHide}) => name !== 'home' && ! breadcrumbHide
                        )
                );
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    .bread-crumb {
        line-height: 1;
        border-bottom: 1px solid $border-color-base;
        background-color: #fff;
        padding: 0 24px;

        height: 2.625vw;
        max-height: 51px;

        .bread-crumb-items{
            font-size: 12px;
        }
        .bread-crumb-item{
            color: $color-text-secondary;
        }
    }
</style>
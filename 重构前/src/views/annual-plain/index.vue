<template>
    <page-wrap>
        <keep-alive include="annual-plain-list">
            <router-view></router-view>
        </keep-alive>
    </page-wrap>
</template>
<script>
    import {PageWrap} from '@/components';
    export default {
        components: {
            PageWrap
        }
    };
</script>
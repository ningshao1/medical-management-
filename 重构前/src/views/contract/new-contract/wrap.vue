<template>
    <page-wrap>
        <keep-alive include="contract-list">
            <router-view></router-view>
        </keep-alive>
    </page-wrap>
</template>

<script>
    import {PageWrap} from '@/components';
    export default {
        name: "contract-wrap",
        components: {PageWrap}
    }
</script>
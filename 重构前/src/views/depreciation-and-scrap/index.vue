<template>
    <page-wrap>
        <router-view></router-view>
    </page-wrap>
</template>
<script>
    import {PageWrap} from '@/components';
    export default {
        name: 'depreciation-and-scrap-wrap',
        components: {PageWrap},
    };
</script>
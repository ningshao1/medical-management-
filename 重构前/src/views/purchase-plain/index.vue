<template>
    <page-wrap>
        <keep-alive include="purchase-plain-list">
            <router-view></router-view>
        </keep-alive>
    </page-wrap>
</template>
<script>
    import {PageWrap} from '@/components';

    export default {
        name: 'purchase-plain',
        components: {PageWrap}
    };
</script>
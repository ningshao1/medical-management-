<template>
    <page-wrap>
        <keep-alive include="emergency-list">
            <router-view></router-view>
        </keep-alive>
    </page-wrap>
</template>
<script>
    import {PageWrap} from '@/components';
    export default {
        name:'emergency-index',
        components: {PageWrap}
    };
</script>
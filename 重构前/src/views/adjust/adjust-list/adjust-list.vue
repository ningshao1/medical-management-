<template>
    <div class="adjust-list">
        <kld-nav
                title="设备调剂"
                :items="routerList"
                router
        ></kld-nav>
        <div class="adjust-view">
            <kld-title :label="$route.meta.label" :container="false" :imgUrl="$route.meta.imgUrl"></kld-title>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import kldTitle from '@common/kld-title/kld-title.vue';
import KldNav from '../common/kld-nav';
import {routerList} from '../API.js';

export default {
    computed:{
        routerList() {
            return routerList;
        },
    },
    components:{
        kldTitle,
        KldNav
    }
};
</script>
<style lang="less" scoped>
.adjust-list {
    display: flex;
    flex-direction: row;
    min-height: 800px;
    margin-top: 20px;
    .kld-nav{
        max-width: 270px;
        min-width: 100px;
        width: 20%;
        margin-right: 15px;
        flex-shrink: 0;
    }
    .adjust-view {
        width: calc(~'80% - 15px');
        min-width: calc(~'100% - 285px');
        max-width: calc(~'100% - 100px');
    }
}
</style>


<template>
    <div class="test-page-wrap">
        <div :class="{'menu-grid':true, 'is-collapse':!isCollapse}">
            <kld-menu :default-active="$route.name"
                      :collapse="isCollapse"
                      router
                      @select="selectHandle"
                      :menu="menu">
            </kld-menu>
        </div>
        <div class="content-grid">
            <router-view></router-view>
        </div>
        <Cascader></Cascader>
    </div>
</template>
<script>
import KldMenu from "@c/KldMenu";
import {Cascader} from 'element-ui';
import route from "./route.js";
export default {
    name: "test-page",
    components: {
        KldMenu,
        Cascader
    },
    props: {},
    data() {
        return {
            menu: route[0],
            isCollapse: false
        };
    },
    computed: {
        _menu() {
            return;
        }
    },
    created() {
        // console.log(this.$route);
    },
    methods: {
        selectHandle(...arg) {
            // console.log(...arg);
        }
    }
};
</script>
<style lang="less" scoped>
.test-page-wrap {
    width: 100%;
    display: flex;
    .menu-grid {
        flex-shrink: 0;
    }
    .content-grid {
        flex: 1;
    }
    .is-collapse {
        width: 200px;
    }
}
</style>
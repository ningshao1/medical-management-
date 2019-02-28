<template>
    <div class="index full-width">
        <navigation-bar></navigation-bar>
        <bread-crumb></bread-crumb>
        <page-wrap>
            <router-view></router-view>
        </page-wrap>
        <!--<Portal to="breadcrumb">-->
            <!--<div style="height: 100%; background-color:red; width: 100px;"></div>-->
            <!--&lt;!&ndash;<el-button>breadcrumb</el-button>&ndash;&gt;-->
        <!--</Portal>-->
        <!--<Portal to="title">-->
            <!--<el-button>title</el-button>-->
        <!--</Portal>-->
        <!--<Portal to="tips">-->
            <!--tips-->
        <!--</Portal>-->
        <!--<Portal to="menu">-->
            <!--<div style="width: 300px;height: 100%; background-color: #fff;">menu</div>-->
        <!--</Portal>-->
        <!--<Portal to="action">-->
            <!--<div style="text-align: right;" class="full-width">-->
                <!--<el-button size="large">action</el-button>-->
            <!--</div>-->
        <!--</Portal>-->
    </div>
</template>

<script>
import { NavigationBar, BreadCrumb, Portal, PageWrap } from "@/components";
export default {
    name: "index",
    components: {
        NavigationBar,
        BreadCrumb,
        Portal,
        PageWrap
    }
};
</script>

<style lang="scss" scoped>
.index {
}
</style>
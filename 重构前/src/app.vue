<template>
    <div id="app"
         style="width:100%;height:100%">

        <router-view v-if="isRouterAlive&&reload"></router-view>
        <!-- <router-view ></router-view> -->

    </div>
</template>
<script>
export default {
    data() {
        return {
            isRouterAlive: true,
            reload: true
        };
    },
    provide() {
        return {
            routerReload: this.routerReload
        };
    },
    created() {
        this.$store.commit("initReload", this.doReload);
    },
    // mounted() {
    //     Motal拖拽
    //     this.$nextTick(() => {
    //         $(function() {
    //             let clientX = 0;
    //             let clientY = 0;
    //             let moveX = 0;
    //             let moveY = 0;
    //             let tempY = 0;
    //             let tempX = 0;
    //             let tagetName = "";
    //             let target = "";
    //             function moveMotal(e) {
    //                 moveX = e.clientX - clientX; //移动的距离
    //                 moveY = e.clientY - clientY;
    //                 let finallyX =
    //                     parseInt(tempX + moveX) % 2
    //                         ? parseInt(tempX + moveX) + 1
    //                         : parseInt(tempX + moveX);
    //                 let finallyY =
    //                     parseInt(tempY + moveY) % 2
    //                         ? parseInt(tempY + moveY) + 1
    //                         : parseInt(tempY + moveY);
    //                 $(this)
    //                     .find(".ivu-modal-content")
    //                     .css({
    //                         transform: `translate(${finallyX}px,${finallyY}px)`
    //                     });
    //             }
    //             $(document).on(
    //                 {
    //                     mousedown(e) {
    //                         if (target !== this) {
    //                             target = this;
    //                             tempY = 0;
    //                             tempX = 0;
    //                         }
    //                         tagetName = e.target.className;
    //                         if (
    //                             tagetName !== "ivu-modal-header" &&
    //                             tagetName !== "ivu-modal-header-inner"
    //                         ) {
    //                             return;
    //                         }
    //                         clientX = e.clientX; //获取按压鼠标时候鼠标的位置
    //                         clientY = e.clientY;
    //                         $(this).on("mousemove", function(events) {
    //                             moveMotal.call(this, events);
    //                         });
    //                     },
    //                     mouseup() {
    //                         if (
    //                             tagetName !== "ivu-modal-header" &&
    //                             tagetName !== "ivu-modal-header-inner"
    //                         ) {
    //                             return;
    //                         }
    //                         var arr = $(this)
    //                             .find(".ivu-modal-content")
    //                             .css("transform")
    //                             .replace(/[^0-9\-,]/g, "")
    //                             .split(",");
    //                         tempX = arr[4] - 0; //记录释放前的偏移值
    //                         tempY = arr[5] - 0;
    //                         $(this).off("mousemove");
    //                     }
    //                 },
    //                 ".ivu-modal-wrap"
    //             );
    //         });
    //     });
    // },
    computed: {
        isRouterAlive2() {
            return this.$store.state.routerActive;
        }
    },
    methods: {
        routerReload() {
            this.isRouterAlive = false;
            this.$nextTick(function() {
                this.isRouterAlive = true;
            });
        },
        doReload() {
            this.reload = false;
            this.$nextTick(function() {
                this.reload = true;
            });
        }
    }
};
</script>
<style lang="less">
@import url("../base.less");
#app {
    min-width: 1080px;
}
</style>

<template>
    <div class="single-wrap">
        <title-floor :title="title"></title-floor>
        <div class="content-floor">
            <slot></slot>
        </div>

    </div>
</template>
<script>
import titleFloor from "./title-floor.vue";
export default {
    name: "single-wrap",
    components: { titleFloor },
    props: {
        title: String
    }
};
</script>
<style lang="less" scoped>
.single-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    @title-height: 46px;
    @content-height: calc(100% - @title-height);
    .content-floor {
        height: @content-height;
        width: 100%;
    }
}
</style>



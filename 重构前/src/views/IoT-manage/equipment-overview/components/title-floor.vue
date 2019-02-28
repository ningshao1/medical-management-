<template>
    <div class="title-floor">
        <span>
            {{title}}
        </span>
    </div>
</template>

<script>
export default {
    name: "title-floor",
    props: {
        title: String
    }
};
</script>
<style lang="less" scoped>
.title-floor {
    width: 100%;
    height: 46px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.78);
    padding-left: 20px;
    line-height: 46px;
    border-bottom: 1px solid #c8ced3;
}
</style>


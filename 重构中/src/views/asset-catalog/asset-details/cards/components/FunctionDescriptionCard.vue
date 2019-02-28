<template>
    <div
        class="function-description-card-wrap full-width"
        v-pre
    >
        <div class="card-header">
            资产卡片功能说明
        </div>
        <div class="card-body">
            <p>
                1、资产卡片展示单台资产全生命周期的记录信息，可使用左侧导航进行模块切换查看；
            </p>
            <p>
                2、使用手机APP扫描资产二维码后，可在手机端进行相应操作；
            </p>
            <p>
                3、首页的【打印全部】功能提供资产卡片全部模块的综合性打印。如需要单独模块打印，可进入对应模块进行打印操作；
            </p>
            <p>
                4、当设备处于需要报废的阶段，可使用【申请报废】功能进行报废申请。
            </p>

        </div>
    </div>
</template>
<script>
export default {
    name: "function-description-card",
    components: {},
    props: {},
    data() {
        return {};
    },
    computed: {},
    created() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.function-description-card-wrap {
    padding: 20px;
    .card-header{
        font-size: 16px;
        color:#020e0f;
        height:30px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.18);
    }
    .card-body{
        font-size: 14px;
        line-height:24px;
        color:#666666;
    }
}
</style>
<template>
    <div class="form-structure">
        <div class="form-left">
            <slot name='form-left'></slot>
        </div>
        <div class="form-right"
             :style='styles'>
            <slot name='form-right'></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "form-structure",
    props: {
        styles: {
            type: Object
        }
    },
    data() {
        return {};
    },
    components: {},
    created() {},
    methods: {}
};
</script>

<style scoped lang="less">
.form-structure {
    display: flex;
    > div {
        overflow: hidden;
    }
    > .form-left {
        margin-right: 10px;
        flex: 1;
        height: 100%;
    }
    > .form-right {
        margin-left: 10px;
        width: 408px;
        height: 100%;
    }
}
</style>

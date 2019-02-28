<template>
    <div class="asset-purchase-record-wrap">
        {{$route.meta.label}}
    </div>
</template>
<script>
import mixin from '../../mixin.js';
export default {
    name: "asset-purchase-record",
    mixins:[mixin],
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
.asset-purchase-record-wrap {
}
</style>
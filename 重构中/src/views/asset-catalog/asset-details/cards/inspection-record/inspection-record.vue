<template>
    <div class="asset-inspection-record-wrap">
        {{$route.meta.label}}
    </div>
</template>
<script>
import mixin from '../../mixin.js';
export default {
    name: "asset-inspection-record",
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
.asset-inspection-record-wrap {
}
</style>
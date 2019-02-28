<template>
    <div class="adverse-event-record-wrap">
        {{$route.meta.label}}
    </div>
</template>
<script>
import mixin from '../../mixin.js';
export default {
    name: "adverse-event-record",
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
.adverse-event-record-wrap {
}
</style>
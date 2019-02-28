<template>
    <div
        class="full-width label-icon-wrap"
        v-ellipsis-tooltip='labels.map(({labelName})=>labelName).join(",")'
    >
        <label
            v-for="(v,i) of labels" 
            :key="i"
            class="asset-label-cell"
        >
            {{v.labelName}}
        </label>
    </div>
</template>
<script>
export default {
    name: "label-icon",
    components: {},
    props: {
        labels: {
            default: []
        }
    },
    data() {
        return {};
    },
    computed: {},
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";
.label-icon-wrap {
    .asset-label-cell {
        font-size: 12px;
        border: 1px solid #{$--border-color-base};
        padding: 2px;
        color: #8c8c8c;
        & + .asset-label-cell {
            margin-left: 6px;
        }
    }
}
</style>
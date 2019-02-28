<template>
    <select-tag
            v-model="selectedTags"
            class="select-supplier-tag"
            :data="tags"
            label-key="labelName"
            :max="5"
    ></select-tag>
</template>

<script>
    import {SelectTag} from '@/components';
    export default {
        name: "select-supplier-tag",
        components: {
            SelectTag
        },
        props: {
            value: {},
        },
        data() {
            return {
                tags: []
            };
        },
        computed: {
            selectedTags: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                }
            }
        },
        created() {
            this.getTags();
        },
        methods: {
            async getTags() {
                const {data} = await this.$axios.post('/labels/list/4');
                this.tags = data;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .select-supplier-tag {

    }
</style>
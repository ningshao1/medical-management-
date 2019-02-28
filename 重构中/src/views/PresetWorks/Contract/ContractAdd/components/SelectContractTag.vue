<template>
    <select-tag
            class="select-contract-tag"
            v-model="valueProxy"
            :data="tags"
            label-key="labelName"
            :max="5"
    ></select-tag>
</template>

<script>
    import {SelectTag} from '@/components';

    export default {
        name: "select-contract-tag",
        components: {
            SelectTag
        },
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                tags: []
            };
        },
        computed: {
            valueProxy: {
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
                const {data} = await this.$axios.post('/labels/list/3');
                this.tags = data;
            }
        }
    }
</script>
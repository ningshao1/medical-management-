<template>
    <div class="select-tag" v-clickoutside="closeDropdown">
        <div class="selected-tag">
            <Tag v-for="(tag, index) in valueProxy" :key="tag[valueKey]" @close="del(index)">{{tag[labelKey]}}</Tag>
            <Tag @click="openDropdown" type="primary" class="add-btn">
                <i class="el-icon-plus"></i>
            </Tag>
        </div>
        <transition name="el-zoom-in-top">
            <div v-show="dropdownVisible" class="select-tag-dropdown">
                <Tag
                        v-for="tag in data"
                        :key="tag[valueKey]"
                        @click="add(tag)"
                        :type="values.includes(tag[valueKey]) ? 'primary' : undefined"
                >{{tag[labelKey]}}</Tag>
            </div>
        </transition>
    </div>
</template>

<script>
    import Tag from './Tag';
    import {FormControl} from '@/mixins';
    export default {
        name: "select-tag",
        mixins: [FormControl],
        components: {
            Tag
        },
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            valueKey: {
                type: String,
                default: 'id'
            },
            labelKey: {
                type: String,
                default: 'label'
            },
            objectMode: {
                type: Boolean,
                default: false
            },
            max: {
                type: Number,
                default: Infinity
            },
        },
        data() {
            return {
                dropdownVisible: false,
                selectedTag: []
            };
        },
        computed: {
            valueProxy: {
                get() {
                    const {value} = this;

                    if (this.objectMode) {
                        return value;
                    } else {
                        const {dataValues, data, valueKey, labelKey} = this;

                        return value.map(
                            id => {
                                const index = dataValues.indexOf(id);
                                if (index > -1) {
                                    return data[index];
                                } else {
                                    return {
                                        [valueKey]: id,
                                        [labelKey]: id
                                    }
                                }
                            }
                        );
                    }
                },
                set(value) {
                    const {valueKey} = this;

                    this.isInternalChange = true;
                    this.$emit('input', this.objectMode ? value : value.map(
                        tag => tag[valueKey]
                    ));
                }
            },
            dataValues() {
                const {valueKey} = this;
                return this.data.map(
                    tag => tag[valueKey]
                );
            },
            values() {
                const {valueKey} = this;
                return this.valueProxy.map(
                    tag => tag[valueKey]
                );
            },
        },
        watch: {
            selectedTag(selectedTag) {
                this.valueProxy = [...selectedTag];
            },
            valueProxy: {
                immediate: true,
                handler(value) {
                    if (this.isInternalChange) {
                        this.isInternalChange = false;
                    } else {
                        this.selectedTag = [...value];
                    }
                }
            },
        },
        methods: {
            openDropdown() {
                this.dropdownVisible = true;
            },
            closeDropdown() {
                this.dropdownVisible = false;
                this.emitFormItemBlur();
            },
            async add(tag) {
                const {values} = this;
                if (values.length < this.max && !values.includes(tag[this.valueKey])) {
                    this.selectedTag.push(tag);
                    await this.$nextTick();
                    this.emitFormItemChange();
                }
            },
            async del(index) {
                this.selectedTag.splice(index, 1);
                await this.$nextTick();
                this.emitFormItemChange();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    @import "~@/styles/mixins";
    .select-tag {
        position: relative;
        @at-root {
            .selected-tag,.select-tag-dropdown{
                padding: 5px;
                >.kld-tag{
                    margin: 5px;
                }
            }
        }

        >.selected-tag{
            background-color: mix(#000, #fff, 3%);
            border: 1px solid $border-color-base;
            @at-root {
                @include form-item-error() {
                    .selected-tag{
                        border-color: $color-error;
                    }
                }
            }
        }
        >.select-tag-dropdown{
            position: absolute;
            z-index: 100;
            width: 100%;
            left: 0;
            top: 100%;
            margin-top: 4px;
            background-color: #fff;
            border: 1px solid $border-color-base;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
    }

</style>
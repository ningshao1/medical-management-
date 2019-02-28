<template>
    <div class="kld-table-wrap">
        <div class="kld-table-wrap-header flex justify-content-between align-items-center mb-10">
            <div class="kld-table-wrap-header-custom">
                <slot name="header"></slot>
            </div>
            <div class="kld-table-wrap-control flex">
                <div>
                    <slot name="search">
                        <el-input
                                v-if="! searchHide"
                                :value="search"
                                @input="updateSearch"
                                placeholder="搜索关键字"
                                suffix-icon="el-icon-search"
                                style="width: 200px;"
                        ></el-input>
                    </slot>
                </div>
                <button-search-advanced v-if="searchAdvancedSlots" :value="searchAdvancedExpanded" @input="updateSearchExpanded"></button-search-advanced>
                <el-button v-if="! freshHide" @click="fresh" type="icon" icon="el-icon-refresh"></el-button>
                <el-button v-if="! settingsHide" @click="settings" type="icon" icon="el-icon-setting"></el-button>
            </div>
        </div>
        <template v-if="searchAdvancedSlots">
            <div v-show="searchAdvancedExpanded" class="kld-table-wrap-search-advanced">
                <slot name="search-advanced"></slot>
                <div :style="{paddingLeft: searchFormLabelWidth}">
                    <el-button @click="updateSearchedItems" size="mini">检索</el-button>
                </div>
            </div>
            <div v-if="searchedItems.length > 0" :class="{'mt-0': ! searchAdvancedExpanded}" class="kld-table-wrap-searched-items flex align-items-center">
                <span v-if="isDef(numberMatched)" class="flex-shrink-0 mr-20">
                    检索结果<span class="text-info">{{numberMatched}}</span>条匹配
                </span>
                <div class="items-wrap flex-grow-1">
                    <el-button
                            v-for="item in searchedItems"
                            type="default"
                            size="suit"
                            :key="item.prop"
                            class="searched-item"
                    >
                        <span class="text-secondary">{{item.label}}:</span>
                        <span class="text-primary pl-8 pr-8">{{item.displayValue}}</span>
                        <a @click="resetField(item)" class="text-regular" href="javascript:">
                            <i class="el-icon-close"></i>
                        </a>
                    </el-button>
                    <a @click="resetFields" href="javascript:">清除</a>
                </div>
            </div>
        </template>
        <div class="kld-table-wrap-body mt-10">
            <slot></slot>
        </div>
        <div v-if="$slots.footer" class="kld-table-wrap-footer flex align-items-center">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    import findComponent from './findComponent';
    import ButtonSearchAdvanced from './ButtonSearchAdvanced';
    import {isDef} from '@/utils';

    const defaultControlsLabels = [
        {name: 'ElSelect', key: 'selectedLabel'},
        {name: 'tree-select', key: 'searchLabel'},
        {name: 'radio-buttons', key: 'currentLabel'},
    ];
    const getComponentName = component => component.$options.name;

    export default {
        name: "kld-table-wrap",
        components: {
            ButtonSearchAdvanced
        },
        props: {
            numberMatched: {
                type: Number
            },
            search: String,
            searchPlaceholder: {
                type: String,
                default: '搜索关键字'
            },
            searchExpanded: {
                type: Boolean,
                default: false,
            },
            controlLabels: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                searchAdvancedExpanded: false,
                searchForm: null,
                searchFormItems: [],
                searchFormItemsProxy: []
            };
        },

        mounted() {
            this.searchForm = findComponent(this.searchAdvancedSlots, 'ElForm');
            this.updateSearchFormItems();
            if (this.searchForm) {
                this.searchForm.$on('el.form.addField', this.updateSearchFormItems);
                this.searchForm.$on('el.form.removeField', this.updateSearchFormItems);
            }
        },

        computed: {
            searchHide() {
                return ! this.$listeners['update:search'];
            },
            settingsHide() {
                return ! this.$listeners['settings'];
            },
            freshHide() {
                return ! this.$listeners['fresh'];
            },

            searchAdvancedSlots() {
                return this.$slots['search-advanced'];
            },

            searchedItems() {
                const {searchFormItemsProxy: items} = this;

                return items.filter(
                    ({currentValue, initialValue}) => currentValue !== initialValue
                );
            },

            searchFormLabelWidth() {
                const {searchForm} = this;

                return searchForm ? searchForm.labelWidth : '0';
            },
            searchFormData() {
                const {searchForm} = this;

                return searchForm ? searchForm.model : {};
            },
            controlLabelsMap() {
                return this.controlLabels.concat(defaultControlsLabels).reduce(
                    (map, control) => {
                        map[control.name] = control.key;
                        return map;
                    },
                    {}
                );
            },
            controlLabelsNames() {
                return Object.keys(this.controlLabelsMap);
            }
        },

        watch: {
            searchedItems(items) {
                const
                    init = this.searchFormItemsProxy.reduce(
                        (result, item) => {
                            result[item.prop] = item.initialValue;
                            return result;
                        },
                        {}
                    ),
                    confirm = items.reduce(
                        (result, item) => {
                            result[item.prop] = item.currentValue;
                            return result;
                        },
                        {}
                    );



                this.$emit('search-advanced', {
                    ...this.searchFormData,
                    ...init,
                    ...confirm
                });
            },
            searchExpanded: {
                immediate: true,
                handler(value) {
                    this.searchAdvancedExpanded = value;
                }
            }
        },

        methods: {
            isDef,
            //更新所有存在的搜索项，无论有没有选择
            updateSearchFormItems() {
                const {searchForm} = this;

                this.searchFormItems = searchForm ? searchForm.fields : [];
            },

            //更新已确认搜索的项
            async updateSearchedItems() {
                try {
                    const {searchForm} = this;

                    if (searchForm) {
                        await searchForm.validate();
                    }

                    const
                        searchFormItemsProxy = this.searchFormItemsProxy = this.searchFormItems.map(
                            item => {
                                const {label, prop, initialValue, fieldValue} = item;
                                let displayValue = '',
                                    instance = findComponent(item.$children, this.controlLabelsNames);
                                if (instance) {
                                    displayValue = instance[this.controlLabelsMap[getComponentName(instance)]];
                                } else {
                                    displayValue = fieldValue;
                                }
                                return {
                                    label: typeof label === 'string' ? label.trim().replace(/[:：]$/, '') : '',
                                    prop,
                                    initialValue,
                                    currentValue: fieldValue,
                                    displayValue,
                                    component: item
                                };
                            }
                        );

                } catch (err) {
                    if (err) {
                        console.error(err);
                    }
                }
            },

            resetField(item) {
                item.component.resetField();
                item.currentValue = item.initialValue;
            },

            resetFields() {
                for (const item of this.searchedItems) {
                    this.resetField(item);
                }
            },

            fresh() {
                this.$emit('fresh');
            },
            settings() {
                this.$emit('settings');
            },

            updateSearch(value) {
                this.$emit('update:search', value);
            },
            updateSearchExpanded(value) {
                this.searchAdvancedExpanded = value;
                this.$emit('update:searchExpanded', value);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    
    .kld-table-wrap {
        &-header{

        }
        &-control{
            >*{
                margin-left: 10px;
            }
        }
        &-search-advanced{
            padding: 16px 26px;
            border: 1px solid $border-color-base;
            background-color: $--table-row-hover-background;
        }
        &-searched-items{
            margin-top: -1px;
            /*padding: 10px 26px;*/
            padding: 5px 26px - 5px;
            border-style: solid;
            border-color: $color-primary;
            border-width: 1px 0;
            background-color: $color-primary-light;
            .items-wrap>.searched-item{
                padding-top: 7px;
                padding-bottom: 7px;
                margin: 5px;
            }
        }
        &-body{

        }
        &-footer{
            height: 60px;
            padding: 0 20px;
            background-color: rgba(0, 0, 0, 0.03);
        }
    }
</style>
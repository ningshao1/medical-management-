<template>
    <el-select v-model="valueProxy" v-bind="$attrs" :value-key="valueKey" class="kld-select-table">
        <el-option v-if="hasData" value="" disabled>
            <div class="flex" :style="rowStyles">
                <div
                        v-for="(th, index) in thead"
                        :class="columnsStyles[index].width ? 'flex-shrink-0' : 'flex-grow-lazy-1'"
                        :style="columnsStyles[index]"
                        :key="index"
                >
                    <NodeRender
                            :render="th"
                    ></NodeRender>
                </div>
            </div>
        </el-option>
        <template v-if="hasData">
            <el-option
                    v-for="(row, index) in data"
                    :label="row[labelKey]"
                    :value="row"
            >
                <div class="flex" :style="rowStyles">
                    <div
                            v-for="(td, i) in tbody"
                            :class="columnsStyles[i].width ? 'flex-shrink-0' : 'flex-grow-lazy-1'"
                            :style="columnsStyles[i]"
                            :key="i"
                    >
                        <NodeRender :node="td({row, index})"></NodeRender>
                    </div>
                </div>
            </el-option>
        </template>
        <el-option v-else value="no-data-text" disabled class="text-center">
            暂无数据
        </el-option>
        <div v-if="hasData && hasPage" class="text-center pt-6">
            <el-pagination
                    :total="total"
                    :current-page.sync="currentPageProxy"
                    :page-size="pageSize"
                    @current-change="$emit('current-change', $event)"
                    layout="prev, pager, next, total"
            ></el-pagination>
        </div>

        <el-option class="none" :value="valueProxy" :label="currentLabel"></el-option>


        <slot slot="prefix" name="prefix"></slot>
    </el-select>
</template>

<script type="text/jsx">
    import {VNode, createTextVNode, isDef} from '@/utils';
    const NodeRender = {
        name: 'NodeRender',
        functional: true,
        props: {
            render: Function,
            node: [Array, VNode]
        },
        render(h, {props: {render, node}}) {
            return render ? render(h) : node;
        }
    };

    export default {
        name: "kld-select-table",
        components: {
            NodeRender
        },
        props: {
            value: {},
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            columns: {
                type: Array,
                default() {
                    return [];
                }
            },
            gutter: {
                type: Number,
                default: 10,
            },
            labelKey: [String, Number],
            valueKey: {
                type: [String, Number],
                default: 'id'
            },

            /*Page*/
            currentPage: Number,
            total: Number,
            pageSize: Number,
            /****************/
            label: String,
            width: String,
            objectMode: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                currentLabel: this.label
            }
        },

        computed: {
            valueProxy: {
                get() {
                    return this.objectMode ? this.value : {
                        [this.valueKey]: this.value
                    };
                },
                set(value) {
                    if (! this.objectMode) {
                        this.currentLabel = value[this.labelKey];
                        value = value[this.valueKey];
                    }
                    this.$emit('input', value);
                }
            },
            thead() {
                return this.columns.map(
                    ({title}) => typeof title === 'function' ? title : () => createTextVNode(title)
                );
            },
            tbody() {
                return this.columns.map(
                    ({slot, render, key}) => {
                        if (typeof slot === 'string' && this.$scopedSlots[slot]) {
                            return data => this.$scopedSlots[slot](data);
                        } else if (typeof render === 'function') {
                            return data => render(this.$createElement, data);
                        } else {
                            return ({row}) => createTextVNode(row[key]);
                        }
                    }
                );
            },
            rowStyles() {
                return {
                    margin: `0 -${this.gutterPixel}`,
                    width: this.width
                }
            },
            columnsStyles() {
                return this.columns.map(
                    ({width}) => {
                        return {
                            width: width || 0,
                            padding: `0 ${this.gutterPixel}`
                        };
                    }
                );
            },
            hasData() {
                return this.data.length > 0;
            },
            hasPage() {
                return [this.total, this.currentPage, this.pageSize].every(isDef);
            },
            gutterPixel() {
                return `${this.gutter / 2}px`;
            },
            currentPageProxy: {
                get() {
                    return this.currentPage;
                },
                set(value) {
                    this.$emit('update:currentPage', value);
                }
            }
        },
        watch: {
            valueProxy(value) {
                if (this.objectMode) {
                    this.currentLabel = value ? value[this.labelKey] : null;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .kld-select-table {

    }
</style>
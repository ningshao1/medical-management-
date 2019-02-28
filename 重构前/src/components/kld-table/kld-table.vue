<template>
    <Table
            class="kld-table"
            :class="tableClasses"
            v-bind="bind"
            v-on="listeners"
    ></Table>
</template>

<style lang="less" scoped>
    @border-style: 1px solid #dddee1;
    .kld-table {
        border-left: @border-style;
        border-top: @border-style;
        /deep/.ivu-table{
            background-color: transparent;
            tr:not(.ivu-table-row-hover){
                >td{
                    background-color: transparent;
                }
            }
            &.ivu-table-stripe{
                .ivu-table-body,.ivu-table-fixed-body{
                    tr:nth-child(2n):not(.ivu-table-row-hover)>td{
                        background-color: #f3f3f3;
                    }
                }
            }
        }
        &.wrap-border-none{
            border: none;
            /deep/.ivu-table{
                &::after,&::before{
                    display: none;
                }
            }
        }
    }
</style>

<script>
    export default {
        name: "kld-table",
        props: {
            columns: {
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
            rowKey: {
                type: [String, Symbol],
                default: 'id'
            },
            visibleColumns: {
                type: Array
            },
            selected: {
                type: Array,
                default() {
                    return [];
                }
            },
            wrapBorder: Boolean
        },

        computed: {
            columnsProxy() {
                const {columns, visibleColumns} = this;

                if (Array.isArray(visibleColumns)) {
                    return columns.filter(({key}) => visibleColumns.includes(key));
                } else {
                    return columns;
                }
            },

            tableClasses() {
                return {
                    'wrap-border-none': ! this.wrapBorder
                }
            },

            needSelectedSync() {
                return Boolean(
                    this.listeners['update:selected']
                );
            },

            dataProxy() {
                const {data, rowKey, selected} = this;
                if (this.needSelectedSync) {
                    for (const item of data) {
                        const {[rowKey]: itemKeyValue} = item;

                        item._checked = Boolean(
                            selected.find(
                                ({[rowKey]: keyValue}) => keyValue === itemKeyValue
                            )
                        );
                    }
                }
                return data;
            },

            bind() {
                return {
                    ...this.$attrs,
                    data: this.dataProxy,
                    columns: this.columnsProxy
                }
            },
            listeners() {
                let isSelectCancel = false;

                return {
                    ...this.$listeners,
                    'on-select': (selection, row) => {
                        this.$emit('update:selected', this.selected.concat(row));
                        this.$emit('on-select', ...arguments);
                    },
                    'on-select-cancel': (selection, {[this.rowKey]: rowKeyValue}) => {
                        const {rowKey, selected} = this,
                            index = selected.findIndex(
                                item => item[rowKey] === rowKeyValue
                            );

                        if (index !== -1) {
                            const value = [...selected];
                            value.splice(index, 1);

                            this.$emit('update:selected', value);

                            isSelectCancel = true;
                        }

                        this.$emit('on-select-cancel', ...arguments);
                    },
                    'on-select-all': selection => {
                        const {rowKey} = this,
                            selected = [...this.selected];
                        for (const row of selection) {
                            const {[rowKey]: rowKeyValue} = row;

                            if (
                                ! selected.some(
                                    item => item[rowKey] === rowKeyValue
                                )
                            ) {
                                selected.push(row);
                            }
                        }

                        this.$emit('update:selected', selected);
                        this.$emit('on-select-all', ...arguments);
                    },
                    'on-selection-change': selection => {
                        if (selection.length === 0 && ! isSelectCancel) {
                            const {rowKey} = this,
                                selected = [...this.selected];

                            for (const row of this.dataProxy) {
                                const {[rowKey]: rowKeyValue} = row,

                                    index = selected.findIndex(
                                        item => item[rowKey] === rowKeyValue
                                    );

                                if (index !== -1) {
                                    selected.splice(index, 1);
                                }
                            }

                            this.$emit('update:selected', selected);
                        } else {
                            isSelectCancel = false;
                        }

                        this.$emit('on-selection-change', ...arguments);
                    }
                };
            }
        }
    }
</script>
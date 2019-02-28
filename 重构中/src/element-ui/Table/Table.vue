<script type="text/jsx">
    import ElTable from 'element-ui/lib/table';

    //修改table-store的原型方法
    {
        const
            storePrototype = ElTable.data().store.__proto__,
            {updateColumns} = storePrototype;

        storePrototype.updateColumns = function () {
            const {table: {visibleColumns}} = this;

            if (Array.isArray(visibleColumns)) {
                const {states: {_columns}} = this;

                this.states._columns = _columns.filter(
                    ({columnKey}) => columnKey === undefined || visibleColumns.includes(columnKey)
                );

                updateColumns.call(this);

                this.states._columns = _columns;
            } else {
                updateColumns.call(this);
            }
        };
    }

    export default {
        name: "ElTable",
        extends: ElTable,
        props: {
            selected: {
                type: Array,
                default() {
                    return [];
                }
            },

            visibleColumns: {
                type: Array
            }
        },

        created() {
            this.$on('selection-change', (selection) => {
                this._internalUpdateSelected = true;
                this.$emit('update:selected', selection);
            });
        },

        watch: {
            visibleColumns() {
                this.store.updateColumns();
                // this.doLayout();
                this.debouncedUpdateLayout();
            },
            selected: {
                async handler(selected) {
                    if (this._internalUpdateSelected) {
                        this._internalUpdateSelected = false;
                    } else {
                        this.store.states.selection = selected;
                        if (! this.$refs.tableHeader) {
                            await this.$nextTick();
                        }
                        this.store.commit('setData', this.data);
                    }
                },
                immediate: true
            }
        }
    }
</script>

<style lang="scss">
    @import "~@/styles/var";
    @import "~element-ui/packages/theme-chalk/src/table";
    @import "~element-ui/packages/theme-chalk/src/table-column";
    @include b(table) {
        @include e(header) {
            border: 1px solid $--table-border-color;
            border-bottom: 0;
        }

        th{
            padding: 7px 0;
            font-weight: normal;
        }
        td{
            padding: 9px 0;
        }

        @include m(large) {
            td{
                height: 66px;
            }
        }
    }
</style>
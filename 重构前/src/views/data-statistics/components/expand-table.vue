<template>
    <div>
        <kld-table
                :data="data"
                :columns="tableColumns"
                :selected.sync="tableSelected"
                :row-key="rowKey"
                class="expand-table show-select-all"
        ></kld-table>
        <div :class="{'has-select-all': selectable}" class="table-footer flex align-items-center">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script type="text/jsx">
    import {KldTable} from '@/components';
    export default {
        name: "expand-table",
        components: {
            KldTable
        },
        props: {
            selected: {
                type: Array
            },
            rowKey: {},
            selectable: {
                type: Boolean,
                default: false
            },
            data: {
                type: Array,
                default() {
                    return [
                        // {
                        //     // title: '未完成', //
                        //     title(h) {
                        //         return <span class="kld-success">未完成</span>;
                        //     },
                        //     expandColumns: [
                        //         {
                        //             title: "序号",
                        //             render() {
                        //                 return <span>1</span>;
                        //             }
                        //         }
                        //     ],
                        //     expandData: [
                        //         {}
                        //     ]
                        // }
                    ];
                }
            }
        },
        computed: {
            tableColumns() {
                const columns = [
                    {
                        type: 'selection',
                        width: 60
                    },
                    {
                        type: 'expand',
                        width: 30,
                        render(h, {row: {expandColumns, expandData}}) {
                            return (
                                <KldTable
                                    data={expandData}
                                    columns={expandColumns}
                                    disabled-hover
                                    height="300"
                                    class="internal-table"
                                ></KldTable>
                            );
                        }
                    },
                    {
                        render(h, {row: {title}}) {
                            return <div>{typeof title === 'function' ? title(h) : title}</div>;
                        }
                    }
                ];

                if (! this.selectable) {
                    columns.shift();
                }

                return columns;
            },

            tableSelected: {
                get() {
                    return this.selected;
                },
                set(v) {
                    this.$emit('update:selected', v);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @deep: ~'/deep/>.ivu-table';

    .expand-table {
        &.show-select-all{
            overflow: visible;
            @{deep}{
                overflow: visible;
                position: relative;
                >.ivu-table-header{
                    overflow: visible;
                    th{
                        display: none;
                        border-bottom: none;
                        height: 0;
                        &:first-of-type{
                            overflow: visible;
                            display: table-cell;
                            div{
                                position: absolute;
                                left: 0;
                                bottom: -48px;
                                z-index: 1;
                            }
                        }
                    }
                }
            }
        }
        /deep/.ivu-table-expanded-cell{
            padding: 0 0 0 91px;
        }

        /deep/.internal-table{
            .ivu-table-tbody{
                tr{
                    background: rgb(239, 239, 239);
                }
            }
        }
    }
    .table-footer{
        height: 80px;
        padding: 0 20px 0 20px;
        background-color: rgba(208, 208, 208, 0.5);
        &.has-select-all{
            padding-left: 61px;
        }
    }
</style>
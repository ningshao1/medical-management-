<template>
    <div :class="{
        'simple-table-warp':true,
        'simple-stripe-table-warp':stripe
        }">
        <table class="table-item">
            <thead>
                <tr>
                    <th v-for="(column,index) of columns"
                        :style='{width:column.width,height:thHeight,"text-align":column.align||"left"}'
                        :key='index'>
                        <div :style="column.thStyle">
                            {{column.label}}
                        </div>
                    </th>
                </tr>

            </thead>
            <tbody>
                <tr v-for="(row,i) of data"
                    @click.stop="rowInClick(row)"
                    :class='{"current-asset":row.id===currentKey,
                        "hover-height-light-row":hoverHeightLight
                    }'
                    :key='i'>
                    <td v-for="(column,index) of columns"
                        :key='index'
                        :style='_tdStyle'>
                        <div class="cell-wrap" :style="column.style||{}">

                            <slot :name="column.key"
                                  :index="i"
                                  :row="row"
                                  :column="column">

                                <div v-ellipsis-tooltip="row[column.key]"
                                     :style='{width:"100%",height:"100%","text-align":column.align||"left","line-height":tdHeight}'>
                                    {{row[column.key]}}
                                </div>
                            </slot>
                        </div>
                    </td>
                </tr>
            </tbody>

        </table>
        <div class="no-data-view"
             :style='{height:tdHeight,"line-height":tdHeight}'
             v-if="!data.length&&!loading">
            暂无数据
        </div>
        <kld-loading v-if="loading"></kld-loading>
    </div>
</template>

<script>
import kldLoading from "@common/loading/loading.vue";
export default {
    name: "simple-table",
    components: { kldLoading },
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
        currentKey: {
            default: ""
        },
        loading: {
            type: Boolean,
            default: false
        },
        heights: {
            type: Object,
            default() {
                return {};
            }
        },
        tdStyle:{
            type:Object,
            default(){
                return {}
            }
        },
        stripe: {
            type: Boolean,
            default: true
        },
        hoverHeightLight:{
            type: Boolean,
            default: true
        }
    },
    computed: {
        thHeight() {
            return this.heights.th || "43px";
        },
        tdHeight() {
            return this.heights.td || "43px";
        },
        _tdStyle(){
            return {height:this.tdHeight,...this.tdStyle}
        }
    },
    data() {
        return {};
    },
    methods: {
        rowInClick(row) {
            this.$emit("row-in-click", row);
        }
    }
};
</script>
<style lang="less" scoped>
.simple-table-warp {
    width: 100%;
    padding: 15px 20px;
    position: relative;
    &.simple-stripe-table-warp {
        .table-item {
            &.ivu-table {
                background-color: transparent;
            }
            tbody {
                tr:nth-child(2n) {
                    td {
                        background-color: #fafafa;
                    }
                }
                tr:nth-child(2n + 1) {
                    td {
                        background-color: #f8f8f9;
                    }
                }
            }
        }
    }
    .table-item {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        .cell-wrap {
            width: 100%;
            height: 100%;
        }
        td,
        th {
            border-bottom: 1px solid #dddee1;
            height: 43px;
            font-size: 14px;
            padding: 0 8px;
        }
        th{
            // background-color:#eaeaea;
        }
        td {
            cursor: pointer;
            transition: 0.3s ease-in-out;
        }
        .hover-height-light-row:hover {
            td {
                background-color: rgba(84, 183, 248, 0.3) !important;
            }
        }
        tr.current-asset {
            td {
                background-color: rgb(20, 156, 248);
                color: white;
            }
        }
    }
    .no-data-view {
        width: 100%;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #dddee1;
    }
}
</style>


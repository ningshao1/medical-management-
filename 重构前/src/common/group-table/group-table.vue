<template>
    <div class="group-table-wrap">
        <div class="table-head">
            <div v-for="(column,i) of collapseColumns"
                 :key="column.key"
                 :style="column | headerStyle"
                 class="head-col">
                <template v-if="!column.headRender">{{column.title}}</template>
                <cell v-else
                      :render="column.headRender"></cell>
            </div>
        </div>
        <template v-if="!isLoading">
            <Collapse accordion
                      v-model="pageNumber"
                      class="group-table-collapse">
                <template v-if="groupDatas.length > 0">
                    <Panel v-for="({row,callbackArg,tableData},i) of groupDatas"
                           :key="'groupDatas'+i"
                           :name="i+1+''">
                        <div class="table-row-wrap">
                            <div class="table-content">
                                <Icon class="check-open"
                                      :type="pageNumber[0]==i+1?'minus':'plus'"></Icon>
                                <div class="cells-wrap">
                                    <div v-for="(column,index) of  collapseColumns"
                                         :key="index"
                                         :style="column|cellStyle"
                                         class="cell-box">
                                        <template v-if="column.render">
                                            <cell :render="column.render"
                                                  :column="column"
                                                  :row="row"
                                                  :index="i"></cell>
                                        </template>
                                        <template v-else>
                                            <template v-if="column.poptip">
                                                <Poptip trigger="hover"
                                                        :content="row[column.key]"
                                                        placement="bottom-start"
                                                        class="poptip-area">
                                                    <span class="poptip-area-content">{{row[column.key]}}</span>
                                                </Poptip>
                                            </template>
                                            <template v-else>{{row[column.key]}}</template>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div slot="content">
                            <kld-custom-table class="i-table-stripe"
                                   :columns="tableData.columns"
                                   :data="tableData.data"
                                   :show-header="false"
                                   @on-row-click="skip(callbackArg)"></kld-custom-table>
                        </div>
                    </Panel>
                </template>
                <Panel v-else
                       style="text-align: center;">暂无信息</Panel>
            </Collapse>
        </template>
        <template v-else>
            <div style="width:100%;height:300px;position:relative">
                <Spin fix>
                    <Icon type="load-c"
                          size="18"
                          class="demo-spin-icon-load"></Icon>
                    <div>加载中...</div>
                </Spin>
            </div>
        </template>
    </div>
</template>

<script>
import cell from "./cell";
import kldCustomTable from '@common/kld-custom-table';

export default {
    components: { cell, kldCustomTable},
    data() {
        return {
            pageNumber: ["1"]
        };
    },
    watch: {
        pageNum(data) {
            this.pageNumber = data;
        }
    },

    props: {
        pageNum: {
            type: Array,
            default() {
                return ["1"];
            }
        },
        isLoading: {
            type: Boolean,
            default: true
        },
        collapseColumns: {
            default() {
                return [];
            }
        },

        //所有表格数据 []
        groupDatas: {
            type: Array,
            default: () => []
        },
        //是否开启折叠板的手风琴模式
        accordion: {
            default: true
        }
    },
    filters: {
        headerStyle(column) {
            return Object.assign({ width: column.width }, column.headStyle);
        },
        cellStyle(column) {
            return Object.assign({ width: column.width }, column.style);
        }
    },
    methods: {
        skip(callbackArg) {
            if (this.groupDatas.length > 0) {
                this.$emit("on-table-click", callbackArg);
                //组件的自定义事件 会传传出表格信息
            }
        }
    }
};
</script>


<style lang="less" scoped>
.group-table-wrap {
    width: 100%;
    @width1: 29%;
    @width2: 22%;
    @width4: 29%;
    @width5: 5%;
    .table-head {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 50px;
        .head-col {
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            color: #666666;
        }
    }
    /deep/.group-table-collapse {
        border-left: 0;
        border-right: 0;
        border-radius: 0;
        .ivu-collapse-header {
            @height: 60px;
            padding: 0 50px !important;
            background-color: #fafafa;
            height: @height !important;
            line-height: @height !important;
            > .ivu-icon {
                display: none;
            }

            .table-row-wrap {
                width: 100%;
                .table-content {
                    display: flex;
                    position: relative;
                    justify-content: space-between;
                    //展开样式
                    .check-open {
                        display: inline-block;
                        position: absolute;
                        font-size: 20px;
                        line-height: @height;
                        height: @height;
                        left: -35px;
                        color: #d0d0d0;
                    }
                    .cells-wrap {
                        width: 100%;
                        height: @height;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .cell-box {
                            height: @height;
                            font-size: 14px;
                            /deep/.poptip-area {
                                width: 100%;
                                font-size: 14px;
                                position: relative;
                                .ivu-poptip-rel {
                                    width: 95%;
                                    display: block;
                                    .poptip-area-content {
                                        width: 89%;
                                        display: block;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        color: #666666;
                                    }
                                }
                                .ivu-poptip-popper {
                                    width: 100%;
                                    .ivu-poptip-content {
                                        width: 80%;
                                        .ivu-poptip-body-content-inner {
                                            white-space: normal;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .ivu-collapse-content {
            background-color: #fafafa;
            padding: 0 20px;
            overflow: visible;
            .ivu-collapse-content-box {
                padding: 0;
                .ivu-table {
                    &:before,
                    &:after {
                        display: none;
                    }
                    tbody > tr:last-of-type {
                        td {
                            border-bottom: 0;
                        }
                    }
                }
            }
        }
    }

}
</style>









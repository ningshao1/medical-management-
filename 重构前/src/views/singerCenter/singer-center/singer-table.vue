<template>
    <simple-table class="singer-table-wrap"
                  :columns="singerListInfo.columns"
                  :data="singerListInfo.data"
                  :heights='{td:"60px",th:"60px"}'
                  v-on="$listeners"
                  :tdStyle='{
                      "font-size":"12px"
                  }'
                  :loading="singerListInfo.loading">

        <div class="asset-item-wrap asset-name-wrap"
             slot='assetName'
             slot-scope="{row,column}">
            <div class="asset-name"
                 v-ellipsis-tooltip="row[column.key]">
                {{row[column.key]}}
            </div>
            <div class="asset-labels"
                 v-if="row.labels&&row.labels.filter(v=>v).length">
                <Button type="ghost"
                        shape="circle"
                        size="small"
                        v-for="(v,i) of truncate(row.labels.filter(v=>v),2)"
                        :key="i">{{v.labelName}}</Button>
                <span v-if="row.labels.length>2">...</span>
            </div>
        </div>
        <div class="asset-item-wrap asset-info-wrap"
             slot='assetInfo'
             slot-scope="{row,column}">
            <div>
                <span>
                型号：
                </span>
                <span class="asset-info-content" v-ellipsis-tooltip='row.assetClass'>

                {{row.assetClass||"--"}}
                </span>
                
            </div>
            <div>
                <span>
品牌：
                </span>
                <span class="asset-info-content" v-ellipsis-tooltip='row.assetClass'>

                {{row.brandName||"--"}}
                </span>
            </div>

        </div>
        <div class="asset-item-wrap"
             slot='reportDate'
             slot-scope="{row,column}"
             style="line-height:60px;">
            {{row.reportDate?$store.state.localeDate(row.reportDate):"--"}}

        </div>
        <div class="asset-item-wrap"
             slot='finishTime'
             slot-scope="{row,column}"
             style="line-height:60px;">
            {{row.finishTime?$store.state.localeDate(row.finishTime):"--"}}
        </div>
        <div class="asset-item-wrap"
             slot='userName'
             slot-scope="{row,column}"
             style="line-height:60px;">
            <div v-if="row.userName"
                  style="color:#01b0c7;width:100%" v-ellipsis-tooltip="row[column.key]">
                  <poptip-show-info :info-id="row.userId">

                    {{row.userName}}
                  </poptip-show-info>
            </div>
            <span v-else>
                暂无
            </span>
        </div>
        <div class="asset-item-wrap"
             slot='type'
             slot-scope="{row,column}"
             style="line-height:60px;color:rgb(91, 164, 200);">
            {{fliterType(row.type)}}
        </div>
    </simple-table>
</template>


<script>
import simpleTable from "@common/simple-table";
import poptipShowInfo from "@common/poptip-show-info";

export default {
    name: "singer-table",
    components: {
        simpleTable,
        poptipShowInfo
    },
    data() {
        return {};
    },
    props: {
        singerListInfo: {
            type: Object
        }
    },
    methods: {
        fliterType(type) {
            let types = {
                0: "待接单",
                1: "维修中",
                2: "待验收",
                3: "已完修",
                4: "转交中",
                5: "已撤回"
            };
            return types[type] || "";
        },
        truncate(list, max = 3) {
            let len = list.length;
            if (len <= max) {
                return list;
            }
            return list.slice(0, max);
        }
    }
};
</script>
<style lang="less">
.singer-table-wrap {
    .asset-item-wrap {
        width: 100%;
        height: 100%;
        &.asset-name-wrap {
            display: flex;
            flex-flow: column;
            justify-content: center;

            .asset-name {
                width: 100%;
                color: #0c8399;
                font-size: 14px;
            }
            .asset-labels {
                > .ivu-btn {
                    margin-right: 3px;
                }
            }
        }
        &.asset-info-wrap {
            display: flex;
            flex-flow: column;
            justify-content: center;

            >div{
                width: 100%;
                display: flex;
                align-items: center;
                >span{
                    display: inline-block;
                    &.asset-info-content{
                        width:calc(100% - 40px);
                    }
                }
            }
        }
    }
}
</style>



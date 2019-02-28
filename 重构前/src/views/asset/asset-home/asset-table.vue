<template>
    <div class="asset-table-wrap">
        <simple-table :columns='columns'
                      :loading='loading'
                      class="asset-table"
                      :tdStyle="{
                          'font-size':'12px',
                      }"
                      :heights="{th:'52px',td:'78px'}"
                      v-on='$listeners'
                      :data='data'>
            <div class="asset-name-wrap"
                 slot="assetName"
                 slot-scope="{row,column,index}">
                <div class="asset-name-status">
                    <span class="asset-name"
                          v-ellipsis-tooltip='row.assetName'>{{row.assetName}}</span>
                    <asset-icon :icon='row'
                                :iconKey="'used'">
                    </asset-icon>
                    <asset-icon :icon='row'
                                :iconKey="'eventType'">
                    </asset-icon>
                    <asset-icon :icon='row'
                                :iconKey="'assetWarrntyDate'">
                    </asset-icon>
                    <asset-icon :icon='row'
                                :iconKey="'pictureStatus'">
                    </asset-icon>

                </div>
                <div class="asset-label-wrap"
                     v-if="labelsFamm(row.labels).length">
                    <i-button type="ghost"
                              shape="circle"
                              size='small'
                              v-for="(v,i) of labelsFamm(row.labels)"
                              :key="i">
                        {{v.labelName}}
                    </i-button>
                </div>
            </div>
            <div class="asset-info-wrap"
                 slot="assetInfo"
                 slot-scope="{row,column,index}">
                <div>
                    <span>

                        型号：
                    </span>
                    <span v-ellipsis-tooltip='row.assetClass'
                          class="info-content">
                        {{row.assetClass||'--'}}
                    </span>
                </div>
                <div>
                    <span>

                        品牌：
                    </span>
                    <span v-ellipsis-tooltip='row.brandName'
                          class="info-content">
                        {{row.brandName||'--'}}
                    </span>
                </div>
            </div>
            <div class="asset-typeName-wrap"
                 slot="typeName"
                 slot-scope="{row,column,index}"
                 
                 >
                <div v-ellipsis-tooltip='row.typeName' v-if="row.typeName">
                    {{row.typeName}}
                </div>
                <div v-else
                      style="color:#f16543;">暂未关联分类</div>

            </div>
            <div class="asset-contract-wrap"
                 slot='contractId'
                 slot-scope="{row,column,index}">
                <template v-if="row.contractId">

                    <Avatar :style="contractStyle"
                            size='small'>合</Avatar>
                    <Avatar :style="contractStyle"
                            size='small'>供</Avatar>
                </template>
            </div>

        </simple-table>
    </div>
</template>
<script>
import assetIcon from "./asset-icon.vue";
import simpleTable from "@common/simple-table";
export default {
    name: "asset-table",
    components: { simpleTable, assetIcon },
    props: {
        loading: Boolean,
        columns: Array,
        data: Array
    },
    data() {
        return {};
    },
    computed: {
        contractStyle() {
            return {
                backgroundColor: "rgba(91, 164, 200, 0.2)",
                color: "#5ba4c8",
                opacity: 0.6
            };
        }
    },
    methods: {
        labelsFamm(labels) {
            return (labels && labels.filter(v => v)) || [];
        }
    }
};
</script>

<style lang="less" scoped>
.asset-table-wrap {
    width: 100%;
    margin-bottom: 15px;
    .asset-table {
        padding: 1px 3px;
        .publicStyle() {
            width: 100%;
            height: 100%;
        }
        .asset-name-wrap {
            .publicStyle();
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 40px;
            .asset-name-status {
                display: flex;
                align-items: center;
                padding: 3px 0;
                .asset-name {
                    display: inline-block;
                    font-size: 14px;
                    color: #0c8399;
                    max-width: calc(100% - 70px);
                }
            }
            .asset-label-wrap {
                padding: 3px 0;
                .ivu-btn {
                    margin-right: 3px;
                }
            }
        }
        .asset-info-wrap {
            .publicStyle();
            display: flex;
            flex-direction: column;
            justify-content: center;
            > div {
                display: flex;
                align-items: center;
                .info-content {
                    display: inline-block;
                    width: calc(100% - 40px);
                }
            }
        }
        .asset-typeName-wrap {
            .publicStyle();
            display: flex;
            align-items: center;
            >div{
                
                width: 100%;
            }
        }
        .asset-contract-wrap {
            .publicStyle();
            display: flex;
            align-items: center;
            .ivu-avatar {
                margin: 3px;
            }
        }
    }
}
</style>


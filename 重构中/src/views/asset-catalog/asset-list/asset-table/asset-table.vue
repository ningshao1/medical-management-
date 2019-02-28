<template>
    <el-table
        size="large"
        :data='assetTable'
        class="asset-table-wrap"
        v-on='$listeners'
    >
        <el-table-column
            property='assetName'
            label="设备名称"
        >
            <div
                slot-scope="{row,column}"
                class="asset-name-col full-width"
            >
                <div
                    class='full-width'
                    v-ellipsis-tooltip='row.assetName'
                >
                    {{row.assetName}}
                </div>
                <template v-if="row.labels.length">
                    <lable-icon :labels='row.labels'></lable-icon>
                </template>
            </div>

        </el-table-column>
        <el-table-column
            property='assetInfo'
            label="设备信息"
        >
            <template slot-scope="{row,column}">
                <div class='full-width'>
                    <asset-info
                        title="型号："
                        :content="row.assetClass"
                    ></asset-info>
                    <asset-info
                        title="品牌："
                        :content="row.brandName"
                    ></asset-info>
                </div>
            </template>

        </el-table-column>

        <el-table-column
            property='osName'
            label="所属科室"
        >
            <template slot-scope="{row,column}">
                <div
                    class='full-width'
                    v-ellipsis-tooltip='row[column.property]'
                >
                    {{row[column.property]||'--'}}
                </div>
            </template>

        </el-table-column>

        <el-table-column
            property='typeName'
            label="分类"
        >
            <template slot-scope="{row,column}">
                <template v-if="row[column.property]">
                    <div
                        class='full-width'
                        v-ellipsis-tooltip='row[column.property]'
                    >
                        {{row[column.property]}}
                    </div>
                </template>
                <template v-else>
                    <div
                        class="full-width"
                        style="color:rgb(241, 101, 67);"
                    >
                        {{'暂未关联分类'}}
                    </div>
                </template>
            </template>
        </el-table-column>
        <el-table-column
            property='contractId'
            label="信息完善"
            width="150px"
        >

            <template slot-scope="{row,column}">
                <template v-if="row[column.property]">
                    <contract-info-icon></contract-info-icon>
                </template>

            </template>

        </el-table-column>
        <el-table-column
            property='used'
            label="状态"
            width="150px"
        >

            <template slot-scope="{row,column}">
                {{row[column.property]|switchUsed(useds)}}

            </template>

        </el-table-column>
    </el-table>
</template>
<script>
import LableIcon from "./label-icon.vue";
import AssetInfo from "./asset-info.vue";
import ContractInfoIcon from "./contract-info-icon.vue";
export default {
    name: "asset-table",
    components: { LableIcon, AssetInfo, ContractInfoIcon },
    props: {
        assetTable: {
            default: []
        }
    },
    data() {
        return {
            useds: ["闲置", "在用", undefined, "备用机", "待用"]
        };
    },
    computed: {},
    created() {},
    filters: {
        switchUsed(value, useds) {
            return useds[value] || "--";
        }
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";
.asset-table-wrap {
}
</style>
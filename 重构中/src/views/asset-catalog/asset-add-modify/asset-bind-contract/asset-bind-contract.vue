<template>
    <div class="asset-bind-contract-wrap">
        <kld-card
            no-head-icon
            title="合同关联"
        >
            <el-row :gutter="20">
                <el-col
                    :span="12"
                    :lg="6"
                >
                    <el-form-item
                        label="关联合同"
                        prop="contractId"
                    >
                        <asset-contract
                            v-model="cardItems.contractId"
                            :name.sync="cardItems.contractName"
                            placeholder="请选择合同"
                            read-only
                        ></asset-contract>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="12"
                    :lg="6"
                >
                    <el-form-item
                        label="过保日期"
                        prop="assetWarrntyDate"
                    >
                        <el-date-picker
                            :editable='false'
                            clearable
                            value-format="yyyy-MM-dd"
                            v-model="cardItems.assetWarrntyDate"
                            placeholder='请选择过保日期'
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="12"
                    :lg="6"
                >
                    <el-form-item
                        label="设备原值"
                        prop="purchaseMount"
                    >
                        <el-input
                            v-model="cardItems.purchaseMount"
                            :disabled='purchaseMountDisabled'
                            placeholder="请输入设备原值"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </kld-card>
    </div>
</template>
<script>
import mixin from "../mixin.js";
import AssetContract from "./asset-contract.vue";

export default {
    name: "asset-bind-contract",
    components: { AssetContract },
    mixins: [mixin],
    props: {},
    data() {
        return {};
    },
    computed: {
        purchaseMountDisabled() {
            return !this.isAdd && this.originAssetItems.purchaseMount != "0";
        }
    },
    created() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.asset-bind-contract-wrap {
}
</style>
<template>
    <el-button
        plain
        class="contract-btn-wrap"
        @click='clickHandler'
    >
        {{btnText}}
        <asset-contract-dialog
            :value="selectedNode"
            :visible.sync="show"
            :query-selected="querySelected"
        ></asset-contract-dialog>
    </el-button>
</template>
<script>
import AssetContractDialog from "@/views/asset-catalog/asset-add-modify/asset-bind-contract/asset-contract-dialog.vue";
import { baseMixin } from "../../mixin.js";
export default {
    name: "contract-btn",
    components: { AssetContractDialog },
    mixins: [baseMixin],
    props: {
        value: {
            default: ""
        }
    },
    data() {
        return {
            show: false
        };
    },
    computed: {
        selectedNode() {
            return {
                id: this.contractId,
                contractName: ""
            };
        },
        clickHandler() {
            return this.contractId ? this.viewContract : this.chooseContract;
        },
        contractId: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        },
        btnText() {
            return this.contractId ? "查看合同" : "关联合同";
        }
    },
    created() {},
    methods: {
        async querySelected({ id, contractName }) {
            if (!id) {
                return this.$message.warning("请先选择合同！");
            }

            await this.$axios.put("assets/assetAndContract", {
                contractId: id,
                id: this.id
            });
            this.contractId = id;
            this.show = false;
            this.$message.success("资产已成功关联合同。");
        },
        viewContract() {
            this.$router.push({
                name: "contract-detail",
                query: { id: this.contractId }
            });
        },
        chooseContract() {
            this.show = true;
        }
    }
};
</script>
<style lang="less" scoped>
.contract-btn-wrap {
}
</style>
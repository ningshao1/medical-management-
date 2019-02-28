<template>
    <div class="asset-contract-wrap">
        <el-input
            v-model="contractName"
            v-bind="$attrs"
            readonly
        ></el-input>
        <el-button
            class="asset-contract-btn"
            @click="viewContractTable"
             v-bind="$attrs"
        >
            选择合同
        </el-button>
        <asset-contract-dialog
            :visible.sync="visible"
            :value="selectedNode"
            :query-selected="querySelected"
        ></asset-contract-dialog>
    </div>
</template>
<script>
import { baseMixin } from "../mixin.js";
import assetContractDialog from "./asset-contract-dialog.vue";
export default {
    name: "asset-contract",
    components: { assetContractDialog },
    mixins: [baseMixin],
    props: {
        value: {
            default: ""
        },
        name: {
            default: ""
        }
    },
    data() {
        return {
            visible: false
        };
    },
    computed: {
        contractId: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        },
        contractName: {
            get() {
                return this.name;
            },
            set(val) {
                this.$emit("update:name", val);
            }
        },
        selectedNode() {
            return {
                id: this.contractId,
                contractName: this.contractName
            };
        }
    },
    created() {},
    methods: {
        viewContractTable() {
            this.visible = true;
        },
        querySelected(node) {
            console.log(node);
            const { id, contractName } = node;
            this.contractId = id || "";
            this.contractName = contractName || "";
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/var.scss";
.asset-contract-wrap {
    display: inline-block;
    width: 100%;
    padding-right: 103px;
    position: relative;
    .asset-contract-btn {
        position: absolute;
        right: 0;
        bottom: 0;
    }
}
</style>
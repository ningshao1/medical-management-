<template>
    <Tree class="kld-tree" ref="kldTree" @on-select-change='selectChange' :data="treeData" @on-check-change="treeCheckChange" :show-checkbox="showCheckbox" :multiple="multiple"></Tree>
</template>

<style lang="less" scoped>
.kld-tree {
}
</style>

<script>
import prData from "../transformSectionTreeData/index";
export default {
    name: "kld-tree",
    props: {
        value: {},
        showCheckbox: Boolean,
        multiple: Boolean,
        basis: {
            type: String, //每个节点都要有一个唯一值，比如id，这个唯一值作为判断依据
            default: "id"
        }
    },
    data() {
        return {
            treeChecked: [],
            treeData: [],
            triggerIsSelf: false
        };
    },
    created() {
        this.getList();
    },
    watch: {
        value: {
            handler() {
                !this.triggerIsSelf && this.updateTreeData();
                this.triggerIsSelf = false;
            },
            deep: true
        },
        data: {
            handler() {
                this.updateTreeData();
            },
            deep: true
        }
    },
    methods: {
        treeCheckChange(checkedNodes) {
            const checked = [];

            this.triggerIsSelf = true;

            for (const item of checkedNodes) {
                if (!item.children) {
                    checked.push(item);
                }
            }

            this.treeChecked = checked;
            this.$emit("input", [...checked]);
        },

        updateTreeData() {
            this.treeData = JSON.parse(JSON.stringify(this.data));
            this.filterTreeData(this.treeData, this.value);
        },

        filterTreeData(treeData, checkNodes) {
            const nodeKey = this.basis;

            let hasChecked = false;

            for (const checkNode of checkNodes) {
                for (const treeNode of treeData) {
                    if (treeNode.children && treeNode.children.length > 0) {
                        this.filterTreeData(treeNode.children, [checkNode]) &&
                            (hasChecked = treeNode.expand = true);
                    } else if (treeNode[nodeKey] === checkNode[nodeKey]) {
                        hasChecked = treeNode.checked = true;
                        break;
                    }
                }
            }

            return hasChecked;
        },
        getList() {
            this.axios
                .get(`/assetTypes/typeAllTree`)
                .then(res => {
                    res.data=this.$countryTreeSort(res.data);
                    this.treeData = prData(res.data, "typeName");
                })
                .catch(error => {
                    if (error.code == "403") {
                        this.$Message.warning(
                            "对不起，您没有权限获取设备分类列表"
                        );
                    }
                });
        },
        selectChange(e) {
            this.$emit("on-select-change", e);
        }
    }
};
</script>
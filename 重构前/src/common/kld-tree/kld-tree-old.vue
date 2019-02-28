<template>
    <Tree
            class="kld-tree"
            ref="kldTree"
            :data="treeData"
            :render="treeRender"
    ></Tree>
</template>

<style lang="less" scoped>
    .kld-tree {
        /deep/.tree-node{
            display: inline-flex;
            padding: 2px 4px;
            font-size: 14px;
            >span{
                cursor: pointer;
            }
        }
    }
</style>

<script>
    export default {
        name: "kld-tree",
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            data: {
                type: Array,
                default: []
            },
            basis: {
                type: String,  //每个节点都要有一个唯一值，比如id，这个唯一值作为判断依据
                default: 'id'
            }
        },
        data() {
            return {
                treeChecked: [],
                treeData: [],
                triggerIsSelf: false
            };
        },
        watch: {
            value: {
                handler() {
                    ! this.triggerIsSelf && this.updateTreeData();
                    this.triggerIsSelf = false;
                },
                deep: true
            },
            data: {
                handler() {
                    this.updateTreeData();
                    // this.$nextTick(() => {
                    //     this.triggerIsSelf = true;
                    //     this.$emit('input', this.$refs.kldTree.getCheckedNodes());
                    // });
                }/*,
                deep: true*/
            }
        },
        methods: {
            treeCheckChange(checkedNodes) {
                const checked = [];

                this.triggerIsSelf = true;

                for (const item of checkedNodes) {
                    if (! item.children) {
                        checked.push(item);
                    }
                }

                this.treeChecked = checked;
                this.$emit('input', [...checked]);
            },

            updateTreeData() {
                const treeData = JSON.parse(JSON.stringify(this.data));

                this.filterTreeData(treeData, this.value);

                this.treeData = treeData;
            },


            filterTreeData(treeData, checkNodes) {
                const nodeKey = this.basis;

                let hasChecked = false;

                for (const checkNode of checkNodes) {
                    for (const treeNode of treeData) {
                        if (treeNode.children && treeNode.children.length > 0) {
                            if (this.filterTreeData(treeNode.children, [checkNode])) {
                                hasChecked = true;
                                this.$set(treeNode, 'expand', hasChecked);
                                this.$set(treeNode, '_checked', hasChecked);
                            }
                        } else if (
                            treeNode[nodeKey] === checkNode[nodeKey]
                        ) {
                            this.$set(treeNode, '_checked', hasChecked = true);
                            break;
                        } else if (treeNode._checked === undefined) {
                            this.$set(treeNode, '_checked', false);
                        }
                    }
                }

                return hasChecked;
            },

            setNodeChecked(node, value) {
                const changed = this.setNodeChildrenChecked(node, value);
                this.setNodeParentChecked(node, value);
                return changed;
            },

            //设置节点和其子节点的的_checked值 返回所有被修改_checked值的最末级节点的数组
            setNodeChildrenChecked(node, value) {
                let changed = [];

                if (! node._disabled && node._checked !== value) {
                    if (node.children && node.children.length > 0) {
                        for (const child of node.children) {
                            changed = changed.concat(this.setNodeChecked(child, value));
                        }
                    } else {
                        changed.push(node);
                    }

                    this.$set(node, '_checked', value);
                }

                return changed;
            },

            //设置父节点的_checked值
            setNodeParentChecked(node, value) {
                const parentKey = this.$refs.kldTree.flatState[node.nodeKey].parent;

                if (parentKey !== undefined) {
                    const parentNode = this.$refs.kldTree.flatState[parentKey].node;

                    if (
                        ! parentNode._disabled &&
                        value !== parentNode._checked &&
                        (value || ! parentNode.children.some(child => child._disabled ? false : child._checked))
                    ) {
                        this.$set(parentNode, '_checked', value);
                        this.setNodeParentChecked(parentNode, value);
                    }
                }
            },

            //树的render函数
            treeRender(h, {node: {parent: parentNodeKey}, data: node}) {
                return h(
                    'div',
                    {class: 'tree-node'},
                    [
                        h(
                            'Checkbox',
                            {
                                props: {
                                    value: node._checked,
                                    disabled: node._disabled
                                },
                                on: {
                                    input: value => {
                                        const changedNodes = this.setNodeChecked(node, value),
                                            key = this.basis,
                                            result = [...this.value];

                                        for (const node of changedNodes) {
                                            const index = result.findIndex(checked => checked[key] === node[key]);
                                            if (value) {
                                                if (index === -1) {
                                                    result.push(node);
                                                }
                                            } else {
                                                if (index !== -1) {
                                                    result.splice(index, 1);
                                                }
                                            }
                                        }

                                        this.triggerIsSelf = true;
                                        this.$emit('input', result);
                                    }
                                }
                            }
                        ),
                        h(
                            'span',
                            {
                                on: {
                                    click: () => {
                                        //点击标题的时候展开子节点
                                        if (node.children && node.children.length > 0) {
                                            this.$set(node, 'expand', ! node.expand);
                                        }
                                    }
                                }
                            },
                            node.title
                        )
                    ]
                );
            }
        }
    }
</script>
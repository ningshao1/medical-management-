<template>
    <el-tree class="kld-tree"
             ref="tree"
             :data="data"
             :show-checkbox="showCheckbox"
             :node-key="nodeKey"
             :props="nodeSettings"
             :filter-node-method="filterNodeMethod"
             :render-content="titleRender"
             :highlight-current="highlightCurrent"
             :default-expanded-keys="defaultExpandedKeys"
             @check="nodeCheckHandler"
             @current-change="currentChange"
             :draggable='draggable'
             :allow-drag='allowDrag'
             :allow-drop="allowDrop"
             @node-drag-start="nodeDragStart"
             @node-drag-enter="nodeDragEnter"
             @node-drag-leave="nodeDragLeave"
             @node-drag-over="nodeDragOver"
             @node-drag-end='nodeDragEnd'
             @node-drop='nodeDrop'></el-tree>
</template>

<style lang="less" scoped>
    @kld-green: #22a1b9;
    .kld-tree {
        background-color: transparent;

        /deep/ .el-tree-node__content {
            height: auto;
        }

        /deep/ .node-title {
            font-size: 14px;
            padding: 0 10px;
            border-radius: 4px;
            line-height: 26px;
            /*width: 100%;*/
            flex-grow: 1;

            &.searched {
                background-color: #d9e9ef;
            }

            &.searched-current {
                background-color: @kld-green;
                color: #fff;
            }
        }

        &.el-tree--highlight-current
        /deep/ .el-tree-node.is-current
        > .el-tree-node__content {
            /*background-color: @kld-green;*/
            background-color: #d9eaff;
        }

        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
        /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: @kld-green;
            border-color: @kld-green;
        }

        /deep/ .el-checkbox__input.is-focus .el-checkbox__inner,
        /deep/ .el-checkbox__inner:hover {
            border-color: @kld-green;
        }
    }
</style>

<script>
    import ElTree from "../element-components/el-custom-tree";
    import pinyinMatch from "../pinyin-match";
    import $ from "jquery";

    export default {
        name: "kld-tree",
        components: {ElTree},
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            },
            highlightCurrent: {
                //高亮当前选中的节点
                type: Boolean,
                default: false
            },
            showCheckbox: {
                //显现checkbox 可v-model双向绑定
                type: Boolean,
                default: false
            },

            //value返回的是key还是node
            valueType: {
                type: String,
                default: "key" // | 'node'
            },

            includeHalfChecked: {
                type: Boolean,
                default: false
            },

            disables: {
                type: Array,
                default() {
                    return [];
                }
            },
            //value是否仅返回叶子节点
            onlyLeaf: {
                type: Boolean,
                default: false
            },

            data: {
                type: Array,
                default() {
                    return [];
                }
            },

            titleKey: {
                type: [String, Function],
                default: "title"
            },

            childrenKey: {
                type: String,
                default: "children"
            },

            //节点的唯一标识
            nodeKey: {
                type: String,
                default: "id"
            },

            filterNodeMethod: {},

            scrollWrap: {
                type: [Element, $]
            },
            defaultExpandedKeys: {
                type: Array
            },

            firstExpanded: {
                //默认展开第一个节点
                type: Boolean,
                default: false
            },

            current: {
                // type: [String, Number, Object]
            },
            draggable: {
                type: Boolean,
                default: false
            },
            allowDrag: {},
            allowDrop: {}
        },
        data() {
            return {
                treeChecked: [],
                treeData: [],
                triggerIsSelf: false,
                searchData: {
                    value: "",
                    searched: [],
                    index: 0,
                    current: null
                },

                $scrollWrap: null,

                currentNode: null
            };
        },
        computed: {
            nodeSettings() {
                return {
                    label: this.titleKey,
                    children: this.childrenKey
                    // disabled: this.disabledKey
                };
            },

            firstNodeKey() {
                const {
                    data: [firstData]
                } = this;
                if (firstData) {
                    return firstData[this.nodeKey];
                }
            }
        },
        watch: {
            value: {
                handler(value) {
                    if (this.triggerIsSelf) {
                        this.triggerIsSelf = false;
                    } else {
                        this.updateTreeChecked(value);
                    }
                },
                deep: true
            },
            data: {
                immediate: true,
                handler(data) {
                    if (data && data.length > 0) {
                        this.$nextTick(() => {
                            this.updateTreeChecked();
                            this.updateTreeCurrent();
                            this.setDisables(this.disables);
                            if (this.firstExpanded) {
                                this.setFirstExpanded();
                            }
                        });
                    }
                }
            },
            // "searchData.current"() {
            //     //todo 可能有潜在的性能问题
            //     this.expandShowNode(this.searchData.current);
            //     this.$nextTick(this.scrollToSearchCurrent);
            // },
            disables(disables) {
                this.setDisables(disables);
            },
            scrollWrap: {
                immediate: true,
                handler(scrollWrap) {
                    if (scrollWrap) {
                        this.$scrollWrap = scrollWrap;
                    } else {
                        this.$nextTick(() => {
                            for (
                                let el = this.$el;
                                el instanceof Element;
                                el = el.parentNode
                            ) {
                                const {overflow} = getComputedStyle(el);
                                if (overflow === "auto" || overflow === "scroll") {
                                    this.$scrollWrap = el;
                                    return;
                                }
                            }

                            this.$scrollWrap =
                                document.body || document.documentElement;
                        });
                    }
                }
            },

            current: {
                immediate: true,
                async handler(current) {
                    this.updateTreeCurrent(current);
                }
            }
        },

        methods: {
            titleRender(h, allData) {
                const {node, data} = allData,
                    {$scopedSlots} = this,
                    classList = ["node-title", "is-focusable"];

                let childrenNode = null;

                if (this.searchData.current === node) {
                    classList.push("searched-current");
                } else if (data.searched) {
                    classList.push("searched");
                }

                if ($scopedSlots.default) {
                    const $default = $scopedSlots.default(allData);
                    childrenNode = Array.isArray($default) ? $default : [$default];
                } else {
                    childrenNode = node.label;
                }

                return h(
                    "span",
                    {
                        class: classList
                    },
                    childrenNode
                );
            },

            async updateTreeCurrent(current = this.current) {
                if (!this.$refs.tree) {
                    await this.$nextTick();
                }

                if (this.currentNode !== this.getNode(current)) {
                    if (this.valueType === "node") {
                        this.setCurrentNode(current);
                    } else {
                        this.setCurrentKey(current);
                    }
                }
            },

            updateTreeChecked(value = this.value) {
                if (this.onlyLeaf) {
                    this[
                        this.valueType === "key"
                            ? "setCheckedKeys"
                            : "setCheckedNodes"
                        ](value);
                } else {
                    //todo 在支持返回非叶子节点的时候 使用上面的方法回显有异常 下面的方式暂时解决 可能会有性能问题 等待验证
                    this.setCheckedNodes([]);
                    for (const data of value) {
                        this.setChecked(data, true);
                        this.nodeCheckHandler();
                    }
                }
            },

            nodeCheckHandler() {
                this.triggerIsSelf = true;

                if (this.valueType === "key") {
                    const value = this.getCheckedKeys(this.onlyLeaf);
                    if (this.includeHalfChecked) {
                        this.$emit(
                            "input",
                            value.concat(this.getHalfCheckedKeys())
                        );
                    } else {
                        this.$emit("input", value);
                    }
                } else {
                    this.$emit(
                        "input",
                        this.getCheckedNodes(this.onlyLeaf, this.includeHalfChecked)
                    );
                }
            },
            setChecked(...arg) {
                this.$refs["tree"].setChecked(...arg);
            },

            getCheckedKeys(...arg) {
                return this.$refs["tree"].getCheckedKeys(...arg);
            },
            getCheckedNodes(...arg) {
                return this.$refs["tree"].getCheckedNodes(...arg);
            },

            getHalfCheckedKeys() {
                return this.$refs["tree"].getHalfCheckedKeys();
            },

            setCheckedKeys(...arg) {
                this.$refs["tree"].setCheckedKeys(...arg);
            },
            setCheckedNodes(...arg) {
                this.$refs["tree"].setCheckedNodes(...arg);
            },

            filter(...arg) {
                this.$refs["tree"].filter(...arg);
            },

            getFilterNodes(validator) {
                const {nodesMap} = this.$refs["tree"].store,
                    result = [];

                for (const [, node] of Object.entries(nodesMap)) {
                    if (validator(node)) {
                        result.push(node);
                    }
                }
                return result;
            },

            setExpand(data, value = false) {
                const node = this.getNode(data);
                if (node) {
                    node.expanded = value;
                    // this.$set(node, 'expanded', value);
                }
            },

            clearExpands() {
                this.getFilterNodes(node => {
                    if (node.expanded) {
                        node.expanded = false;
                    }
                });
            },

            clearDisables() {
                this.getFilterNodes(node => {
                    if (node.data.disabled) {
                        node.data.disabled = false;
                    }
                });
            },

            setDisables(disables, onlyLeaf = false) {
                if (this.data.length > 0) {
                    this.clearDisables();
                    for (const disable of disables) {
                        const node = this.getNode(disable);
                        if (node) {
                            this.$set(node.data, "disabled", true);
                            if (!onlyLeaf) {
                                Promise.resolve().then(() => {
                                    let {parent} = node;
                                    while (
                                        parent &&
                                        !parent.data.disabled &&
                                        parent.childNodes.every(
                                            ({data: {disabled}}) => disabled
                                        )
                                        ) {
                                        this.$set(parent.data, "disabled", true);
                                        parent = parent.parent;
                                    }
                                });
                            }
                        }
                    }
                }
            },

            search(value) {
                const searchData = this.searchData,
                    searched = (searchData.searched = this.getFilterNodes(node => {
                        node.expanded = false;
                        return this.$set(
                            node.data,
                            "searched",
                            value ? pinyinMatch(node.label, value) : false
                            // value ? node.label.indexOf(value) !== -1 : false
                        );
                    }));

                if (this.firstExpanded) {
                    this.setFirstExpanded();
                }

                if (searched.length === 0) {
                    searchData.current = null;
                    this.scrollTo(0);
                    return {
                        current: 0,
                        total: 0,
                        searched
                    };
                } else {
                    return this.searchSetCurrentNode(0);
                }
            },

            searchSetCurrentNode(index) {
                const {searchData} = this,
                    {searched} = searchData,
                    total = searched.length;

                searchData.index = index;
                if ((searchData.current = searched[index])) {
                    this.expandShowNode(searchData.current);
                }

                this.$nextTick(() => {
                    this.scrollToSearchCurrent();
                });

                return {
                    current: total === 0 ? 0 : index + 1,
                    total,
                    searched
                };
            },

            searchNext() {
                const {searchData} = this;
                let index = 0;

                if (searchData.index < searchData.searched.length - 1) {
                    index = searchData.index + 1;
                }

                return this.searchSetCurrentNode(index);
            },

            searchPrev() {
                const {searchData} = this;
                let index = 0;

                if (searchData.index > 0) {
                    index = searchData.searched.length - 1;
                } else {
                    index = searchData.index - 1;
                }

                return this.searchSetCurrentNode(index);
            },

            expandShowNode(node) {
                let parent = node ? node.parent : null;

                this.clearExpands();

                while (parent) {
                    parent.expanded = true;
                    parent = parent.parent;
                }
            },
            scrollToSearchCurrent() {
                const $this = $(this.$el),
                    $searchedCurrent = $this.find(".searched-current");

                if ($searchedCurrent.length === 0) {
                    this.scrollTo(0);
                } else {
                    const style = document.createElement("style");
                    style.setAttribute("type", "text/css");
                    style.innerText =
                        ".el-tree-node__children{transition: none !important}";
                    document.head.appendChild(style);

                    setTimeout(() => {
                        this.scrollTo(
                            $searchedCurrent.offset().top - $this.offset().top
                        );
                        document.head.removeChild(style);
                    });
                }
            },

            scrollTo(top) {
                const $scrollWrap = $(this.$scrollWrap);

                $scrollWrap.scrollTop(top);
            },

            currentChange(data, node) {
                if (node === this.currentNode) {
                    return;
                }

                if (node) {
                    const {valueType} = this;

                    if (this.firstExpanded && node.key === this.firstNodeKey) {
                        this.$nextTick(() => (node.expanded = true));
                    }

                    if (this.disables.includes(node.key)) {
                        this.setCurrentNode(this.currentNode);
                        return;
                    }

                    this.$emit(
                        "update:current", valueType === "node" ? node : node.key
                    );
                } else {
                    this.$emit("update:current", null);
                }

                this.currentNode = node;

                this.$emit("current-change", ...arguments);
            },

            nodeDragStart(...arg) {
                //add by ck
                this.$emit("node-drag-start", ...arg);
            },
            nodeDragEnter(...arg) {
                //add by ck
                this.$emit("node-drag-enter", ...arg);
            },
            nodeDragLeave(...arg) {
                //add by ck
                this.$emit("node-drag-leave", ...arg);
            },
            nodeDragOver(...arg) {
                //add by ck
                this.$emit("node-drag-over", ...arg);
            },
            nodeDragEnd(...arg) {
                //add by ck
                this.$emit("node-drag-end", ...arg);
            },
            nodeDrop(...arg) {
                //add by ck
                this.$emit("node-drop", ...arg);
            },

            getCurrentKey() {
                return this.$refs["tree"].getCurrentKey();
            },
            getCurrentNode() {
                return this.$refs["tree"].getCurrentNode();
            },
            setCurrentKey(key) {
                if (key === null) {
                    this.$refs["tree"].setCurrentKey(null);
                    this.currentChange(null, null);
                } else {
                    this.setCurrentNode(this.getNode(key));
                }

                this.$nextTick(() => {
                    $(this.$el)
                        .find(".searched-current")
                        .parent()
                        .parent()
                        // .addClass("is-current")
                        .focus();
                });
            },
            setCurrentNode(node) {
                if (node) {
                    this.$refs["tree"].setCurrentNode(node.data);
                    this.currentChange(node && node.data, node);
                } else {
                    this.setCurrentKey(null);
                }
            },

            getNode(data) {
                if (data === null) {
                    return null;
                } else {
                    return this.$refs["tree"].getNode(data);
                }
            },

            setFirstExpanded() {
                if (this.firstNodeKey) {
                    this.setExpand(this.firstNodeKey, true);
                }
            }
        }
    };
</script>
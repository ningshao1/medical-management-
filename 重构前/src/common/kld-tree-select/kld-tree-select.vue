<template>
    <Dropdown placement="bottom"
              trigger="custom"
              :visible="dropdownVisible"
              class="kld-tree-select">
        <i-input ref="input"
                 class="kld-input"
                 :class="{'no-pointer-events': disabled}"
                 :placeholder="placeholder"
                 v-model="currentTitle"
                 :readonly="inputReadonly"
                 :icon="inputIcon"
                 @mouseenter.native="inputMouseEnterHandler"
                 @mouseleave.native="inputMouseLeaveHandler"
                 @click.native="inputClickHandler"
                 @input="searchMethod"
                 @on-keydown.enter="searchNext"
                 @on-click="selectClearHandler"
                 @on-focus="inputClickHandler"
                 :disabled="disabled"></i-input>

        <kld-tree ref="tree"
                  @current-change="treeSelect"
                  :data="data"
                  :title-key="titleKey"
                  :children-key="childrenKey"
                  :node-key="nodeKey"
                  :value-type="valueType"
                  highlight-current
                  slot="list"
                  :first-expanded="firstExpanded"
                  :disables="disables"
        ></kld-tree>
    </Dropdown>
</template>

<style lang="less" scoped>
.kld-tree-select {
    width: 100%;
    position: relative;
    /deep/.ivu-dropdown-rel {
        width: 100%;
    }
    /deep/.ivu-select-dropdown {
        width: 100%;
        max-height: 240px;
        overflow: auto;
    }
}
.pointer-none {
    pointer-events: none;
}
</style>

<script>
import KldTree from "@common/kld-tree";

export default {
    name: "kld-tree-select",
    components: {
        KldTree
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        value: {},
        valueType: {
            type: String,
            default: "key"
        },
        nodeKey: {
            type: String,
            default: "id"
        },
        titleKey: {
            type: String
        },
        childrenKey: {
            type: String
        },
        placeholder: {
            type: String
        },

        filterable: {
            type: Boolean,
            default: false
        },

        clearable: {
            type: Boolean,
            default: false
        },
        firstExpanded: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: "arrow-down-b"
        },
        leafOnly: {
            type: Boolean,
            default: false
        },
        saveCache: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        disables: {
            type:Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            currentNode: null,
            triggerIsSelf: true,
            dropdownVisible: false,
            inputMouseEnter: false,
            currentTitle: "",
            cacheValue: undefined
        };
    },
    computed: {
        // watchValueAndData() {//delete by ck
        //     return JSON.stringify(this.data) + this.value;
        // },
        // currentTitle() { delete by ck
        //     const {currentNode} = this;
        //     return currentNode ? currentNode.label : '';
        // },
        inputReadonly() {
            return !this.filterable;
        },
        allowClear() {
            return this.clearable && this.inputMouseEnter && this.value;
        },
        inputIcon() {
            if (this.allowClear) {
                return "ios-close";
            } else {
                return this.icon;
            }
        }
    },
    watch: {
        // watchValueAndData: {//delete by ck
        //     handler() {
        //         if (this.triggerIsSelf) {
        //             this.triggerIsSelf = false;
        //         } else {
        //             this.$nextTick(() => {
        //                 this.currentNode = this.getNode(this.value);
        //             });
        //         }
        //     },
        //     immediate: true
        // },
        value: {
            //add by ck
            handler(newValue) {
                this.triggerIsSelf = newValue === this.cacheValue; //判断是否是组件内部改变value值
                this.$nextTick(() => {
                    this.currentNode = this.getNode(newValue);
                });
            }
        },
        data() {
            this.$nextTick(() => {
                this.currentNode = this.getNode(this.value);
            });
        },
        currentNode: {
            //modify by ck
            handler(node, oldNode) {
                let tempNode;
                if (node) {
                    tempNode = {
                        value: this.valueType === "node" ? node : node.key,
                        key: node.key,
                        label: node.label
                    };
                } else {
                    tempNode = {
                        value: this.valueType === "node" ? null : "",
                        key: null,
                        label: ""
                    };
                }

                this.cacheValue = tempNode.value; //必须先给cacheValue赋值 再同步value 否者triggerIsSelf将会不准确
                this.$emit("node-click", node ? node.data : null, node);
                this.$emit("input", tempNode.value);

                if (this.triggerIsSelf && oldNode && !node) {
                    //当由内部取消选中（有值=>无值）时
                    this.$emit("select-change", null, null);
                }
                if (!this.triggerIsSelf || !node) {
                    //外部改变value时 或者  取消选中时  调用kld-tree 内部选中方法
                    this.setCurrentKey(tempNode.key);

                    this.triggerIsSelf = true;
                }
                this.currentTitle = tempNode.label;
            }
        }
    },
    methods: {
        treeSelect(data, node) {
            //modify by ck
            if (node) {
                if (!this.leafOnly || !node.childNodes.length) {
                    //是否只能选择最末级节点
                    if (this.triggerIsSelf) {
                        this.$emit("select-change", data, node);
                    }
                    this.currentNode = node;
                    this.setMenuVisible(false);
                }
            } else {
                this.currentNode = null;
            }
        },

        inputMouseEnterHandler() {
            this.inputMouseEnter = true;
        },
        inputMouseLeaveHandler() {
            this.inputMouseEnter = false;
        },
        inputClickHandler() {
            // this.searchMethod(this.currentTitle); //add by ck

            this.setMenuVisible(true);
        },

        //点击select之外的地方隐藏menu
        clickOtherHandler() {
            const path = event.composedPath();
            if (!path.includes(this.$refs.input.$el)) {
                this.setMenuVisible(false);
                if (this.saveCache) {
                    if (this.currentNode) {
                        this.currentTitle = this.currentNode.label;
                    } else {
                        this.currentTitle = "";
                    }
                }
            }
        },

        searchMethod(value) {
            if (value === "" && !this.saveCache) {
                this.currentNode = null;
            }

            this.$refs.tree.search(value);
        },
        searchNext() {
            this.$refs.tree.searchNext();
        },

        setMenuVisible(visible) {
            this.dropdownVisible = visible;
        },

        getNode(data) {
            return this.$refs.tree.getNode(data);
        },

        setCurrentKey(key) {
            this.$refs.tree.setCurrentKey(key);
        },

        selectClearHandler() {
            event.stopPropagation(); //TODO阻止事件冒泡 视需求酌情改变
            if (this.allowClear) {
                this.currentNode = null;
                this.searchMethod("");
            }
        }
    },

    created() {
        document.addEventListener("click", this.clickOtherHandler);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.clickOtherHandler);
    }
};
</script>
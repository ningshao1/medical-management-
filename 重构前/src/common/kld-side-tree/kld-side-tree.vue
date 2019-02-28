<template>
    <div
        :class='{
        "kld-side-tree":true,
        "kld-side-input-tree":showInput
        }'
        v-clickoutside="clickoutside"
    >

        <i-input
            v-if="showInput"
            :class='{
                     "kld-input": largeInput,
                     "side-input":true
                     }'
            :disabled="disabled"
            v-model='searchLabel'
            :readonly="readonly"
            :style="inputStyle"
            :icon="inputIcon"
            :placeholder="placeholder"
            :clearable='clearable'
            @on-click="inputIconClick"
            @on-change="inputChange"
            @on-keydown='keyboardOperation'
            @on-focus='inputFocus'
        >
            <slot
                name="prepend"
                slot="prepend"
            ></slot>
            <slot
                name="append"
                slot="append"
            ></slot>

        </i-input>
        <el-tree
            v-bind="$attrs"
            v-on="treeListeners"
            :props='elTreeProps'
            :data="data"
            :node-key="nodeKey"
            :class="`el-tree-body ${treeClassName}`"
            :highlight-current='false'
            :default-expanded-keys="_defaultExpandedKeys"
            ref="el-tree"
            slot="list"
        >
            <span
                slot-scope="{node,data}"
                :class='{
                            "side-tree-item-node":true,
                            "is-selected":node.key===currentKey,
                            "is-searched":searchedKeys.includes(node.key),
                            "is-focused":node.key===focusedKey
                          }'
            >
                <slot
                    name="tree-item"
                    :node="node"
                    :data="data"
                >
                    <span class="side-tree-item">
                        {{codePrefix&&data[prefixKey]?`[${data[prefixKey]}]`:''}}
                        {{node.label}}
                    </span>
                </slot>
            </span>
        </el-tree>
    </div>
</template>

<script>
import elTree from "@common/element-components/el-custom-tree/index.js";
import pinyin_match from "@common/pinyin-match";
export default {
    name: "kld-side-tree",
    components: { elTree },
    props: {
        value: {
            default: ""
        },
        /*iview-Input props*/
        disabled: {
            type: [Boolean],
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [String, Number],
            default: ""
        },
        inputIcon: String,
        clearable: {
            type: Boolean,
            default: true
        },
        showInput: {
            type: Boolean,
            default: false
        },
        largeInput: {
            type: Boolean,
            default: true
        },
        inputStyle: {
            type: Object,
            default() {
                return {};
            }
        },
        /*el-tree  props*/
        props: {
            type: Object,
            default() {
                return {
                    label: "typeName",
                    children: "lists"
                };
            }
        },
        //重新点击已选中项可以取消选中
        cancelable: {
            type: Boolean,
            default: false
        },
        //是否为国家分类加上编码前缀
        codePrefix: {
            type: Boolean,
            default: false
        },
        prefixKey: {
            type: String,
            default: "typeCode"
        },
        //tree_data
        data: {
            default() {
                return [];
            }
        },
        //树主体class
        treeClassName: {
            default: ""
        },
        //主键属性
        nodeKey: {
            type: String,
            default: "id"
        },
        //只返回子节点值
        leafOnly: {
            type: Boolean,
            default: false
        },
        //只是搜索子节点
        searchLeaf: {
            type: Boolean,
            default: false
        },
        //展开至叶子节点
        expandLeaf: {
            type: Boolean,
            default: false
        },
        filterMethod: Function,
        //开启拼音匹配
        pinyinMatch: {
            type: Boolean,
            default: true
        },
        //首行展开
        firstExpand: {
            type: Boolean,
            default: false
        },
        /**
         * 禁止选择项
         * 需要node-key
         */
        banSelect: {
            type: Array,
            default() {
                return [];
            }
        },
        defaultExpandedKeys: {
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            BASE_CLASS: ".side-tree-item-node",
            SELECTED_CLASS: ".is-selected",
            SEARCHED_CLASS: ".is-searched",
            FOCUS_CLASS: ".is-focused",
            // visible: false,
            searchLabel: "",
            //   currentLabel: "",
            currentKey: "",
            searchedKeys: [],
            focusedKeyIndex: 0,

            currentNode: null,
            isImmediateSet: false,
            immediateItems: [{}],
            isClearIconClick: false,
            modelTimer: null
            // allNodesList:[],
        };
    },
    computed: {
        $tree() {
            return this.$refs["el-tree"];
        },
        _defaultExpandedKeys() {
            if (this.defaultExpandedKeys.length) {
                return this.defaultExpandedKeys;
            } else {
                return this.firstExpand && this.firstKey ? [this.firstKey] : [];
            }
        },
        firstKey() {
            const [firstNode] = this.data;
            return firstNode ? firstNode[this.nodeKey] : "";
        },
        allNodesList() {
            return this.$tree && this.$tree.store && this.$tree.store.nodesMap
                ? Object.values(this.$tree.store.nodesMap)
                : [];
        },
        focusedKey() {
            return this.searchedKeys[this.focusedKeyIndex] || "";
        },
        elTreeProps() {
            return {
                label: "typeName",
                children: "lists",
                ...this.props
            };
        },
        treeListeners: function() {
            var vm = this;
            // `Object.assign` 将所有的对象合并为一个新对象
            return Object.assign(
                {},
                // 我们从父级添加所有的监听器
                this.$listeners,
                // 然后我们添加自定义监听器，
                // 或覆写一些监听器的行为
                {
                    // 这里确保组件配合 `v-model` 的工作
                    "current-change": function(...arg) {
                        vm.currentChange(...arg);
                    }
                }
            );
        },
        _filterMethod() {
            return this.filterMethod || this.defaultFilter;
        }
    },
    methods: {
        clickoutside() {
            if (this.searchedKeys.length) {
                //TODO
                this.searchedKeys = [];
            }
            // this.initTree();
        },
        inputFocus(e) {
            this.inputChange(e);
        },
        inputIconClick(...arg) {
            this.$emit("input-icon-click", ...arg);
        },
        inputChange(e) {
            if (!this.data.length) {
                this.scrollToSelected();
                return;
            }
            let {
                target: { value }
            } = e;
            value = value.trim().toLowerCase();
            this.filter(value);
        },
        scrollToSelected() {
            if (this.currentKey) {
                // debugger
                this.expandAllParents(this.currentNode);
                this.$nextTick(() => {
                    let selectedDom = this.$tree.$el.querySelector(
                        this.SELECTED_CLASS
                    );
                    this.checkScroll(selectedDom);
                });
            }
        },
        initExpand() {
            let i = this.allNodesList.length;
            for (; i--; ) {
                this.allNodesList[
                    i
                ].expanded = this._defaultExpandedKeys.includes(
                    this.allNodesList[i].key
                );
            }
        },
        initTree() {
            if (this.currentKey) {
                this.scrollToSelected();
            } else {
                this.initExpand();
            }
        },

        filter(value) {
            if (!value) {
                this.searchedKeys = [];

                return;
            }
            this.searchedKeys = this.allNodesList
                .filter(node => {
                    // debugger
                    return this._filterMethod(value, node);
                })
                .map(node => node.key);
        },
        defaultFilter(value, node) {
            return this.searchLeaf
                ? !node.childNodes.length
                    ? node.label.includes(value)
                        ? true
                        : this.pinyinMatch && pinyin_match(node.label, value)
                    : false
                : node.label.includes(value)
                ? true
                : this.pinyinMatch && pinyin_match(node.label, value);
        },
        keyboardOperation(e) {
            if (!this.data.length) {
                return;
            }
            let { keyCode, shiftKey } = e;
            if (keyCode === 40) {
                if (this.focusedKey) {
                    this.elTreeFocus(this.FOCUS_CLASS, this.focusedKey);
                    return;
                }
                if (this.currentKey) {
                    this.elTreeFocus(this.SELECTED_CLASS, this.currentKey);
                    return;
                }
                this.elTreeFocus(this.BASE_CLASS, this.firstKey);
            }
            if (keyCode === 13) {
                if (!this.searchedKeys.length) {
                    return;
                }

                this.focusedKeyIndex = shiftKey
                    ? (--this.focusedKeyIndex + this.searchedKeys.length) %
                      this.searchedKeys.length
                    : ++this.focusedKeyIndex % this.searchedKeys.length;
            }
        },
        elTreeFocus(selector, nodeKey) {
            let node = this.$tree.getNode(nodeKey);
            this.expandAllParents(node);
            this.$nextTick(() => {
                let dom = this.$tree.$el.querySelector(selector);
                // debugger
                while (
                    !(
                        (dom = dom.parentNode).getAttribute("role") ===
                        "treeitem"
                    )
                ); //focus获得鼠标操作
                dom.focus();
            });
        },
        currentChange(data, node, selectTrigger = true) {
            this.$tree.setCurrentKey(this.currentKey || null);

            if (!node) {
                return;
            }

            if (
                this.firstExpand &&
                !this.defaultExpandedKeys.length &&
                node.key === this.firstKey
            ) {
                this.$nextTick(() => {
                    node.expanded = true;
                });
            }
            //点击触发
            if (this.cancelable && selectTrigger) {
                if (this.currentKey && this.currentKey === node.key) {
                    this.reset();
                    return;
                }
            }
            if (this.expandLeaf) {
                this.$nextTick(() => {
                    if (
                        this.firstExpand &&
                        !this.defaultExpandedKeys.length &&
                        node.key === this.firstKey
                    ) {
                        return;
                    }
                    if (!node.isLeaf && node.expanded) {
                        this.expandAllChildren(node);
                    }
                });
            }
            if (
                selectTrigger &&
                this.banSelect.length &&
                this.banSelect.includes(node.key)
            ) {
                return;
            }
            if (this.leafOnly) {
                if (node.childNodes && node.childNodes.length) {
                    return;
                }
                this.querySelect(node);
            } else {
                this.querySelect(node);
            }
        },
        querySelect(node) {
            this.currentKey = node.key;
            this.$tree.setCurrentKey(this.currentKey);
            this.searchedKeys = [];
            this.$emit("input", this.currentKey);
            this.$emit("current-change", node && node.data, node);
        },
        setCurrent(key) {
            // debugger
            let node = this.$tree.getNode(key);
            if (!node) {
                this.reset();
                return;
            }
            this.expandAllParents(node);
            this.$nextTick(() => {
                this.$tree.setCurrentKey(key);
                this.currentChange(node && node.data, node, false);
            });
        },
        checkScroll(dom, delay = 450) {
            if (!dom.offsetTop) {
                //此时都没有获得实际高故等待其展开后跳转
                setTimeout(() => {
                    this.checkScroll(dom);
                }, delay);
                return;
            }
            this.scrollView(dom);
        },
        scrollView(dom) {
            //滚轮定位
            if (dom) {
                let nodeDomTop = dom.offsetTop;
                let scrollDom = this.$tree.$el;
                if (
                    nodeDomTop > scrollDom.scrollTop &&
                    nodeDomTop + 30 <
                        scrollDom.scrollTop +
                            scrollDom.getBoundingClientRect().height
                ) {
                    //当在视图内时不需要定位
                    return;
                }
                // debugger
                scrollDom.scrollTop = nodeDomTop - 20;
            }
        },
        expandAllParents(node) {
            while (node && (node = node.parent)) {
                node.expanded = true;
            }
        },
        expandAllNode(expanded = false) {
            let len = this.allNodesList.length;
            for (let i = len; i--; ) {
                this.allNodesList[i].expanded = expanded;
            }
        },
        expandAllChildren(node) {
            while (node.childNodes.length && (node = node.childNodes[0])) {
                node.expanded = true;
            }
        },
        reset() {
            this.currentKey = "";
            this.$tree.setCurrentKey(null);
            this.$emit("input", this.currentKey);
            this.$emit("current-change", null, null);
            this.searchLabel = "";
            this.searchedKeys = [];
        },
        isDefined(item) {
            return item !== undefined && item !== null;
        },
        valueChange(val) {
            clearTimeout(this.modelTimer);
            if (!this.data.length || !this.$refs["el-tree"]) {
                this.modelTimer = setTimeout(() => {
                    this.valueChange(val);
                }, 500);
                return;
            }
            this.currentKey = val;
            this.setCurrent(this.currentKey);
        }
    },
    watch: {
        value: {
            handler(val) {
                val = this.isDefined(val) ? val : "";
                if (val === this.currentKey) {
                    return;
                }
                this.valueChange(val);
            },
            immediate: true
        },
        currentKey(val) {
            this.currentNode = this.$tree.getNode(val);
        },
        searchedKeys(val) {
            this.focusedKeyIndex = 0;
        },
        focusedKey(val) {
            if (!val) {
                return;
            }
            this.expandAllParents(this.$tree.getNode(val));
            this.$nextTick(() => {
                let focusDom = this.$tree.$el.querySelector(this.FOCUS_CLASS);
                this.checkScroll(focusDom);
            });
        }
    }
};
</script>
<style lang='less' scoped>
.kld-side-tree {
    height: 100%;
    &.kld-side-input-tree {
        padding-top: 50px;
        position: relative;
    }

    /deep/.el-tree-body {
        width: 100%;
        position: relative;
        height: 100%;
        overflow: auto;
        background-color: transparent;
        .el-tree-node {
            > .el-tree-node__children {
                overflow: visible;
            }
            &:focus > .el-tree-node__content {
                background-color: #dbdcdf;
            }
            &.is-current {
                > .el-tree-node__content {
                    background-color: #74b2f9;
                }
            }
        }
    }
    /deep/.side-input {
        position: absolute;
        top: 0;
        left: 0;

        > .ivu-icon-ios-close {
            display: none;
        }
        &:hover {
            > .ivu-icon-ios-close {
                display: inline-block;
            }
        }
    }
    .side-tree-item-node {
        display: inline-block;
        padding: 0 2px;
        border-radius: 3px;
        height: 100%;
        font-size: 14px;

        .side-tree-item {
            display: flex;
            height: 100%;
            align-items: center;
        }
        &.is-searched {
            background-color: rgba(39, 201, 231, 0.27);
        }
        &.is-selected {
            // background-color: #27c9e7;
        }
        &.is-focused {
            background-color: rgba(38, 218, 246, 0.8);
        }
    }
}
</style>
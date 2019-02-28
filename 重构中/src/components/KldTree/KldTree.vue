<template>
    <el-tree
        v-bind="$attrs"
        v-on="treeListeners"
        :props='elTreeProps'
        :data="data"
        :node-key="nodeKey"
        :class="`kld-tree-wrap ${treeClassName}`"
        :highlight-current='false'
        :default-expanded-keys="_defaultExpandedKeys"
        ref="kld-tree"
        @mousewheel.native="handlerMousewheel"
    >
        <span
            slot-scope="{node,data}"
            :class='{
                "kld-tree-item-node":true,
                "is-selected":node.key===currentKey,
                "is-searched":searchedKeys.includes(node.key),
                "is-focused":node.key===focusedKey
            }'
        >
            <span class="kld-tree-item">

                <span class="item-pre-icon">
                    <template v-if="prefixIcon==='expand'">
                        <template v-if="node.isLeaf">
                            <i class="kld-icon-file"></i>
                        </template>
                        <template v-else-if="node.expanded">
                            <i class="kld-icon-folder-open"></i>
                        </template>
                        <template v-else>
                            <i class="kld-icon-folder"></i>
                        </template>
                    </template>
                    <template v-else-if="prefixIcon">
                        <i :class="prefixIcon"></i>
                    </template>
                </span>
                <span class="kld-tree-prefix">
                    {{codePrefix&&data[prefixKey]?`[${data[prefixKey]}]`:''}}
                </span>
                <slot
                    name="tree-item"
                    :node="node"
                    :data="data"
                >
                    {{node.label}}
                </slot>
            </span>
        </span>
    </el-tree>
</template>

<script>
import pinyin_match from "@/utils/pinyin-match";
export default {
    name: "kld-tree",
    props: {
        value: {
            //node-key
            default: ""
        },
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
        //prefix图标
        prefixIcon: {
            type: [Boolean, String],
            default: "expand"
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
        //展开所有搜索匹配项
        expandFilter: {
            type: Boolean,
            default: true
        },
        //自定义搜索方法
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
            BASE_CLASS: ".kld-tree-item-node",
            SELECTED_CLASS: ".is-selected",
            SEARCHED_CLASS: ".is-searched",
            FOCUS_CLASS: ".is-focused",
            currentKey: null,
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
            return this.$refs["kld-tree"];
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
        scrollToSelected() {
            if (this.isDefined(this.currentKey)) {
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
            if (this.isDefined(this.currentKey)) {
                this.scrollToSelected();
            } else {
                this.initExpand();
            }
        },

        filter(value) {
            if (!this.data.length) {
                this.scrollToSelected();
                return [];
            }
            if (!value) {
                this.searchedKeys = [];

                return [];
            }
            const searchedNode = this.allNodesList.filter(node => {
                // debugger
                return (
                    this._filterMethod(value, node) &&
                    (!this.expandFilter || !this.expandAllParents(node))
                );
            });
            this.searchedKeys = searchedNode.map(node => node.key);
            return searchedNode;
        },
        defaultFilter(value, node) {
            // return (//TODO
            //     (!this.searchLeaf || !node.childNodes.length) &&
            //     (node.label.includes(value) ||
            //         (this.pinyinMatch && pinyin_match(node.label, value)))
            // );
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
                if (this.isDefined(this.currentKey)) {
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
            let node = this.getNode(nodeKey);
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
        handlerMousewheel(e) {
            const {
                wheelDeltaY,
                currentTarget: { scrollTop, clientHeight, scrollHeight }
            } = e;
            if (
                (e.wheelDeltaY > 0 && scrollTop === 0) ||
                (e.wheelDeltaY < 0 &&
                    scrollTop + clientHeight >= scrollHeight - 1)
            ) {
                e.preventDefault();
            }
        },
        currentChange(data, node, selectTrigger = true) {
            this.$tree.setCurrentKey(this.currentKey);

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
                if (
                    this.isDefined(this.currentKey) &&
                    this.currentKey === node.key
                ) {
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
            let node = this.getNode(key);
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
            this.currentKey = null;
            this.$tree.setCurrentKey(null);
            this.$emit("input", this.currentKey);
            this.$emit("current-change", null, null);
            this.searchLabel = "";
            this.searchedKeys = [];
        },
        isDefined(item) {
            return item !== undefined && item !== null;
        },
        isEmpty(item) {
            return item === "" || item === undefined || item === null;
        },
        waitMounted(val) {
            clearTimeout(this.modelTimer);
            if (!this.data.length || !this.$refs["kld-tree"]) {
                this.modelTimer = setTimeout(() => {
                    this.waitMounted(val);
                }, 500);
                return;
            }
            this.currentKey = val;
            this.setCurrent(this.currentKey);
        },
        valueChange(val) {
            val = this.isDefined(val) ? val : null;
            if (val === this.currentKey) {
                this.searchedKeys = [];
                return;
            }
            this.waitMounted(val);
        },
        getNode(val) {
            if (!this.isDefined(val)) {
                return null;
            }
            return this.$tree.getNode(val);
        }
    },
    watch: {
        value: {
            handler(val) {
                this.valueChange(val);
            },
            immediate: true
        },
        currentKey(val) {
            this.currentNode = this.getNode(val);
        },
        searchedKeys(val) {
            this.focusedKeyIndex = 0;
        },
        focusedKey(val) {
            if (!val) {
                return;
            }
            this.expandAllParents(this.getNode(val));
            this.$nextTick(() => {
                let focusDom = this.$tree.$el.querySelector(this.FOCUS_CLASS);
                this.checkScroll(focusDom);
            });
        }
    }
};
</script>
<style lang='scss' scoped>
@import "@/styles/var.scss";

.kld-tree-wrap {
    width: 100%;
    position: relative;
    height: 100%;
    overflow: auto;
    background-color: transparent;
    /deep/.el-tree-node {
        > .el-tree-node__children {
            overflow: visible;
        }
        &:focus > .el-tree-node__content {
            background-color: #dbdcdf;
        }
        &.is-current {
            > .el-tree-node__content {
                background-color: #ebf1ff;
                .kld-tree-label {
                    color: $color-primary;
                }
            }
        }
    }
}

.kld-tree-item-node {
    display: inline-block;
    padding: 0 2px;
    border-radius: 3px;
    height: 100%;
    font-size: 14px;

    .kld-tree-item {
        display: flex;
        height: 100%;
        align-items: center;
        .item-pre-icon {
            padding-right: 3px;
        }
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
</style>
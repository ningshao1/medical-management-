<template>
  <div class='kld-dropdown-tree'
       v-clickoutside="clickoutside">
    <i-input class="kld-input dropdown-input"
             :disabled="disabled"
             v-model='searchLabel'
             :readonly="readonly"
             :icon="!disabled&&searchLabel?'ios-close':null"
             :placeholder="placeholder"
             @on-click="inputIconClick"
             @on-change="inputChange"
             @on-keydown='inputKeydown'
             @on-focus='inputFocus'>
      <slot name="prepend"
            slot="prepend"></slot>
      <slot name="append"
            slot="append"></slot>

    </i-input>
    <transition name="slide-up">
      <el-tree v-show='visible'
               v-bind="$attrs"
               v-on="treeListeners"
               :props='elTreeProps'
               :data="data"
               :node-key="nodeKey"
               :class="`el-tree-body ${treeClassName}`"
               :highlight-current='false'
               :default-expanded-keys="_defaultExpandedKeys"
               ref="el-tree">
        <span slot-scope="{node,data}"
              :class='{
                            "dropdown-tree-item-node":true,
                            "is-selected":node.key===currentKey,
                            "is-searched":searchedKeys.includes(node.key),
                            "is-focused":node.key===focusedKey
                          }'>
          <slot name="tree-item"
                :node="node"
                :data="data">
            <span class="dropdown-tree-item">
              {{codePrefix&&data[prefixKey]?`[${data[prefixKey]}]`:''}}
              {{node.label}}
            </span>
          </slot>
        </span>
      </el-tree>
    </transition>
  </div>
</template>

<script>
import elTree from "@common/element-components/el-custom-tree/index.js";
import pinyin_match from "@common/pinyin-match";
export default {
    name: "kld-dropdown-tree",
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
            BASE_CLASS: ".dropdown-tree-item-node",
            SELECTED_CLASS: ".is-selected",
            SEARCHED_CLASS: ".is-searched",
            FOCUS_CLASS: ".is-focused",
            visible: false,
            searchLabel: "",
            currentLabel: "",
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
        }
    },
    methods: {
        clickoutside() {
            this.visible = false;
            if (this.currentKey) {
                this.searchLabel = this.currentLabel;
            } else {
                this.reset(false, true);
            }
        },
        inputFocus() {
            this.visible = true;
        },
        inputIconClick() {
            this.reset(true);
        },
        inputChange(e) {
            if (!this.data.length) {
                return;
            }
            let {
                target: { value }
            } = e;
            value = value.trim().toLowerCase();
            if (!value) {
                this.searchedKeys = [];
                return;
            }
            this.searchedKeys = this.allNodesList
                .filter(node => {
                    // debugger
                    return this.searchLeaf
                        ? !node.childNodes.length
                            ? node.label.includes(value)
                                ? true
                                : this.pinyinMatch &&
                                  pinyin_match(node.label, value)
                            : false
                        : node.label.includes(value)
                            ? true
                            : this.pinyinMatch &&
                              pinyin_match(node.label, value);
                })
                .map(node => node.key);
        },
        inputKeydown(e) {
            if (!this.data.length || !this.visible) {
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
            this.searchLabel = node.label;
            this.currentLabel = node.label;
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
        expandAllChildren(node) {
            // console.log(node)
            while (node.childNodes.length && (node = node.childNodes[0])) {
                node.expanded = true;
            }
        },
        reset(isClearIconClick = false, clickoutside = false) {
            this.isClearIconClick = isClearIconClick;
            if (!clickoutside) {
                this.currentKey = "";
                this.$tree.setCurrentKey(null);
                this.$emit("input", this.currentKey);
                this.$emit("current-change", null, null);
            }
            this.searchLabel = "";
            this.currentLabel = "";
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
            if (!this.isClearIconClick) {
                this.visible = false;
            } else {
                this.isClearIconClick = false;
            }
        },
        visible(val) {
            if (!val) {
                //关闭模态框清除搜索项
                this.searchedKeys = [];
            } else if (this.currentKey) {
                this.expandAllParents(this.currentNode);
                this.$nextTick(() => {
                    let selectedDom = this.$tree.$el.querySelector(
                        this.SELECTED_CLASS
                    );
                    this.checkScroll(selectedDom);
                });
            }
        },
        searchedKeys(val) {
            this.focusedKeyIndex = 0;
        },
        focusedKey(val) {
            if (!val) {
                this.$tree.$el.scrollTop = 0;
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
.kld-dropdown-tree {
    /deep/.el-tree-body {
        width: 100%;
        max-height: 300px;
        overflow: auto;
        margin-top: 4px;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: 10000;
        background-color: #fff;
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
    /deep/.dropdown-input {
        > .ivu-icon-ios-close {
            display: none;
        }
        &:hover {
            > .ivu-icon-ios-close {
                display: inline-block;
            }
        }
    }
    .dropdown-tree-item-node {
        display: inline-block;
        padding: 0 2px;
        border-radius: 3px;
        height: 100%;
        font-size: 14px;

        .dropdown-tree-item {
            display: flex;
            height: 100%;
            align-items: center;
        }
        &.is-searched {
            background-color: rgba(39, 201, 231, 0.27);
        }
        &.is-selected {
            // background-color: #27c9e7;
            // color: #fff;
        }
        &.is-focused {
            background-color: rgba(38, 218, 246, 0.8);
        }
    }
}
</style>
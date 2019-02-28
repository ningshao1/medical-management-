<template>
    <div
        class="tree-select-wrap"
        v-clickoutside="clickoutside"
    >
        <el-input
            :class='{
                "kld-input": largeInput,
                "side-input":true
            }'
            :disabled="disabled"
            v-model='searchLabel'
            :readonly="readonly"
            :style="inputStyle"
            :placeholder="placeholder"
            :clearable='clearable'
            @keydown.native='keyboardOperation'
            @focus='inputFocus'
            @clear="inputClear"
        >

            <slot
                name="prepend"
                slot="prepend"
            ></slot>
            <slot
                name="append"
                slot="append"
            ></slot>

            <slot
                name="prefix"
                slot="prefix"
            ></slot>
            <slot
                name="suffix"
                slot="suffix"
            ></slot>

        </el-input>
        <transition name="el-zoom-in-top">
            <div
                v-show="visible"
                class="el-autocomplete-suggestion slide-up-tree"
            >

                <kld-tree
                    v-bind="$attrs"
                    :data="data"
                    v-model="currentKey"
                    v-on="treeListeners"
                    ref="kld-tree"
                >
                    <template
                        slot='tree-item'
                        slot-scope="{node,data}"
                    >
                        <slot
                            name="tree-item"
                            :node="node"
                            :data="data"
                        >
                            {{node.label}}
                        </slot>
                    </template>
                </kld-tree>
            </div>
        </transition>

    </div>
</template>
<script>
import KldTree from "../KldTree";
export default {
    name: "tree-select",
    components: { KldTree },
    props: {
        largeInput: {
            default: false
        },
        disabled: {
            default: false
        },
        value: {
            default: null,
            visible: false
        },
        readonly: {
            default: false
        },
        placeholder: {
            default: ""
        },
        clearable: {
            default: true
        },
        inputStyle: {
            default() {
                return {};
            }
        },
        //是否在input获得焦点时模糊匹配
        filterOnFocus: Boolean,
        data: {
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            currentLabel: "",
            searchLabel: "",
            visible: false,
            triggerByClear: false
        };
    },
    watch: {
        searchLabel(val) {
            this.inputChange(val + "");
        }
    },
    computed: {
        currentKey: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        },
        $tree() {
            return this.$refs["kld-tree"];
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
    created() {},
    methods: {
        inputChange(value) {
            return this.$tree.filter(value.trim().toLowerCase());
        },
        clickoutside() {
            this.visible = false;
            this.searchLabel = this.currentLabel;
        },
        keyboardOperation(e) {
            this.$tree.keyboardOperation(e);
        },
        inputFocus() {
            this.visible = true;
            this.$tree.scrollToSelected();
            this.inputChange(this.filterOnFocus ? this.currentLabel : "");
        },
        currentChange(data, node) {
            this.$emit("current-change", data, node);
            this.visible = this.visible && this.triggerByClear;
            this.triggerByClear = false;
            if (!node) {
                this.currentLabel = "";
                this.searchLabel = "";
                return;
            }
            const { label } = node;
            this.currentLabel = label;
            this.searchLabel = label;
        },
        inputClear() {
            this.triggerByClear = true;
            this.currentKey = null;
        }
    }
};
</script>
<style lang="less" scoped>
.tree-select-wrap {
    position: relative;
    .slide-up-tree {
        width: 100%;
        height: 300px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: 10000;
        background-color: #fff;
    }
}
</style>
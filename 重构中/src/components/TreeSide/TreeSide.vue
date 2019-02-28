<template>
    <div
        :class="{
            'tree-side-wrap':true,
            'kld-side-input-tree':showInput
        }"
        v-clickoutside="clickoutside"
    >
        <el-autocomplete
            v-if="showInput"
            :class='{
                "kld-input": largeInput,
                "side-input":true
            }'
            :trigger-on-focus="!!searchLabel"
            :disabled="disabled"
            v-model='searchLabel'
            :readonly="readonly"
            :style="inputStyle"
            :placeholder="placeholder"
            :clearable='clearable'
            :fetch-suggestions="querySearch"
            @focus='inputFocus'
            @select="handleSelect"
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
            <template slot-scope="{ item }">
                <slot :item='item'>
                    <div class="name">{{ item.value }}</div>
                </slot>
            </template>
        </el-autocomplete>
        <kld-tree
            v-bind="$attrs"
            :data="data"
            v-model="currentKey"
            v-on="$listeners"
            ref="kld-tree"
        >
            <template
                slot='tree-item'
                slot-scope="{node,data}"
            >
                <span class="kld-tree-label">
                    <slot
                        name="tree-item"
                        :node="node"
                        :data="data"
                    >
                        {{node.label}}
                    </slot>
                </span>
            </template>
        </kld-tree>
    </div>
</template>
<script>
import KldTree from "../KldTree";
export default {
    name: "tree-side",
    components: { KldTree },
    props: {
        value: {
            default: null
        },
        data: {
            default() {
                return [];
            }
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
        }
    },
    data() {
        return {
            searchLabel: ""
        };
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
        }
    },
    created() {},
    methods: {
        clickoutside() {
            if (this.$tree.searchedKeys.length) {
                //TODO
                this.$tree.searchedKeys = [];
            }
        },
        inputFocus(e) {
            let {
                target: { value }
            } = e;
            this.inputChange(value);
        },
        inputChange(value) {
            return this.$tree.filter(value.trim().toLowerCase());
        },
        querySearch(queryString, cb) {
            this.$nextTick(() => {
                const list = this.inputChange(queryString).map(
                    ({ key, label }) => ({ value: label, key })
                );
                cb(list);
            });
        },
        handleSelect({ key }) {
            this.$tree.valueChange(key);
            setTimeout(() => {
                this.$tree.scrollToSelected();
            }, 300);
        }
    }
};
</script>
<style lang="less" scoped>
.tree-side-wrap {
    height: 100%;
    &.kld-side-input-tree {
        padding-top: 50px;
        position: relative;
    }
    /deep/.side-input {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;

        &:hover {
            > .ivu-icon-ios-close {
                display: inline-block;
            }
        }
    }
}
</style>
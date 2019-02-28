<template>
    <div class="kld-search-tree">
        <div class="select-wrap" :class="selectWrapClass" :style="selectWrapStyles">
            <Select
                    :class="selectClass"
                    :style="selectStyles"
                    class="search-select"
                    ref="select"
                    :placeholder="placeholder"
                    filterable
                    remote
                    clearable
                    :remote-method="searchMethod"
                    :loading="treeSearchLoading"
                    @input="searchChange"
            >
                <Option v-for="{label, key} in treeSearched" :key="key" :value="key">{{label}}</Option>
            </Select>
        </div>
        <div class="tree-wrap" ref="tree-wrap" :class="treeWrapClass" :style="treeWrapStyles">
            <slot name="tree">
                <p class="kld-search-tree-tip">暂无数据</p>
            </slot>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .kld-search-tree {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .kld-search-tree-tip{
            text-align: center;
            font-size: 14px;
        }
        .select-wrap{
            flex-shrink: 0;
            flex-grow: 0;
            padding: 10px;
        }
        .search-select{
            width: 100%;
        }

        .tree-wrap{
            flex-grow: 1;
            overflow: auto;
            flex-basis: 100%;
        }
    }
</style>

<script>
    import KldTree from '../kld-tree';
    import findTreeComponent from './find-tree-componet';

    export default {
        name: "kld-search-tree",
        props: {
            placeholder: {
                type: String
            },
            selectWrapStyles: {
                type: [Object, String, Array]
            },
            selectStyles: {
                type: [Object, String, Array]
            },
            selectWrapClass: {
                type: [Object, String, Array]
            },
            selectClass: {
                type: [Object, String, Array]
            },
            treeWrapClass: {
                type: [Object, String, Array]
            },
            treeWrapStyles: {
                type: [Object, String, Array]
            }
        },
        components: {
            KldTree
        },
        data() {
            return {
                treeSearchLoading: false,
                treeSearched: []
            };
        },
        computed: {
            $tree() {
                return findTreeComponent(this.$slots.tree);
            }
        },
        methods: {
            searchChange(value) {
                const {$tree} = this;

                if (value) {
                    const index = this.treeSearched.findIndex(
                        ({ key }) => key === value
                    );

                    $tree.searchSetCurrentNode(index);

                    $tree.setCurrentKey(value);
                } else {
                    $tree.setCurrentKey(null);
                }
            },
            searchMethod(value) {
                const {$tree} = this;

                if (value === "") {
                    this.clearSearch();
                }

                const result = $tree.search(value);

                this.treeSearched = result.searched;

                this.treeSearchLoading = true;

                this.$nextTick(() => {
                    this.treeSearchLoading = false;
                });
            },

            clearSearch() {
                this.$refs["select"].clearSingleSelect();
            }
            // computedTreeWrapHeight() {
            //     const $wrap = this.$el,
            //         $treeWrap = this.$refs['tree-wrap'],
            //
            //         treeWrapOffsetTop = $treeWrap.getBoundingClientRect().top - $wrap.getBoundingClientRect().top,
            //         $wrapHeight = $wrap.clientHeight;
            // }
        }
    }
</script>
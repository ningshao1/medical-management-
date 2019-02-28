<template>
    <el-tree
        :data="treeDataFormat(sync?data:JSON.parse(JSON.stringify(data)))" 
        :highlight-current='true' 
        :default-expanded-keys='defaultExpandedKeys' 
        :node-key="nodeKey" 
        @node-click="nodeClick"
        :render-content="renderContent?renderContent:folder?folderRender:null"
    ></el-tree>
</template>
<script>
import elTree from "@common/element-components/el-tree";
export default {
    name: "sys-el-tree",
    components: { elTree },
    // data(){
    //     return {
    //         keys:''
    //     }
    // },
    props: {
        data: {
            type: [Array],
            default() {
                return [];
            }
        },
        defaultExpandedKeys: {
            type: [Array],
            default() {
                return [1];
            }
        },
        nodeKey: {
            type: [String],
            default: "nodeKey"
        },
        renderContent:{
            type:[Function]
        },
        folder:{
            type:[Boolean],
            default:false
        },
        sync:{
            type:[Boolean],
            default:false
        }

        
    },
    methods: {
        nodeClick(data, node, store) {
            console.log(data,node,store)
            this.$emit("node-click",data, node, store);
        },
        treeDataFormat(treeList, labelName = "osName") {
            let nodeKey = 0;
            return (function format(treeList, labelName) {
                return treeList.map(v => {
                    nodeKey++;
                    if (v.lists instanceof Array && v.lists.length > 0) {
                        return {
                            ...v,
                            nodeKey,
                            label: v[labelName],
                            children: format(v.lists, labelName),
                            lists: undefined
                        };
                    } else {
                        return {
                            ...v,
                            nodeKey,
                            label: v[labelName]
                        };
                    }
                });
            })(treeList, labelName);
        },
        folderRender(h, { store, node, data }) {
            return h(
                "span",
                {
                    style: {
                        display: "inline-block",
                        width: "100%",
                        cursor: "pointer",
                        fontSize: "14px"
                    },
                    on: {
                        click: () => {
                            // console.log(data,node,store);
                            // console.log(node);
                            // console.log(store);
                            this.nodeClick(data,node,store);
                            if (data.children !== undefined) {
                                this.$set(data, "expand", true);
                            }
                        }
                    }
                },
                [
                    h("span", [
                        h("Icon", {
                            props: {
                                //type: "android-folder"
                                type:
                                //    data.children instanceof Array&&data.children.length>0
                                // data.nodeKey!=1
                                !node.expanded
                                        ? "android-folder-open"
                                        : "android-folder"
                            },
                            style: {
                                marginRight: "3px",
                                fontSize: "16px"
                                //color:'#cce2ea'
                            }
                        }),
                        h("span", {
                            style: {
                                padding: "0 8px",
                                "border-radius": "3px"
                            },
                            domProps: {
                                innerHTML: data.label
                            },
                            // 'el-tree-node__content'
                            // attrs: {
                            //     class: "ivu-tree-title"
                            // },
                            // class: {
                            //     "ivu-tree-title-selected":
                            //         this.keys == data.nodeKey
                            // }
                        })
                    ]),
                    h("span", {
                        style: {
                            display: "inline-block",
                            float: "right",
                            marginRight: "32px",
                            fontSize: "14px"
                            //background:'red'
                        }
                    })
                ]
            );
        }
    }
};
</script>
<style lang="less" scoped>
.el-tree {
    background-color: transparent;
    /deep/.el-tree-node.is-current > .el-tree-node__content {
        background-color: #d5e8fc;
    }
    /deep/.el-tree-node>.el-tree-node__children{
        overflow: visible;
    }
}
</style>



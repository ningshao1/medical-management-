<template>
    <div class='k_tree'>
        <div class='search' style="text-align:center" v-if="search">
            <Input icon="ios-search-strong" placeholder=请输入科室名 style="width: 100%" v-model="keyword" ></Input>
        </div>
        <Tree :data="data1" @on-select-change='select_c' :render="renderContent"></Tree>
    </div>
</template>
<script>
import dispose from "../transformSectionTreeData/index"; //处理树状数据
import searchTree from "../searchTree/index";

export default {
    name:'OS-Tree',
    props: {
        search: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            keyword: "",
            list: null,
            user_in: JSON.parse(localStorage.getItem("user_in")),
            data1: [],
            keys: null, //用于记录点击的树
            tempData: null
        };
    },
    methods: {
        select_c(e) {
            this.$emit("clickTree", e);
        },
        get_office() {},
        //获取初始化信息
        get_os_info() {
            let that = this;
            this.spanshow = true;
            this.$axios
                .get(`orgstruct/findAllTree/${that.user_in.osId}`, {})
                .then(res => {
                    let x = res.data;
                    x.expand = true;
                    // that.data1 = that.jx([x]);
                    that.data1 = dispose(x);
                    that.tempData = JSON.parse(JSON.stringify(that.data1));
                    this.rootIcon(that.data1);
                })

        },
        //iview 树状图图标显示
        renderContent(h, { root, node, data }) {
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
                            this.select_c([data]);
                            this.keys = node.nodeKey;
                        }
                    }
                },
                [
                    h("span", [
                        h("Icon", {
                            props: {
                                type: "android-folder-open"
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
                                innerHTML: data.title
                            },
                            attrs: {
                                class: "ivu-tree-title"
                            },
                            class: {
                                "ivu-tree-title-selected":
                                    this.keys == data.nodeKey
                            }
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
        },
        rootIcon(data_) {
            data_[0]["render"] = (h, { root, node, data }) => {
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
                                this.select_c([data]);
                                this.keys = node.nodeKey;
                            }
                        }
                    },
                    [
                        h("span", [
                            h("Icon", {
                                props: {
                                    type: "android-folder"
                                },
                                style: {
                                    fontSize: "16px",
                                    marginRight: "3px"
                                    //color:'#459ca2'
                                }
                            }),
                            h("span", {
                                style: {
                                    padding: "0 8px",
                                    "border-radius": "3px"
                                },
                                domProps: {
                                    innerHTML: data.title
                                },
                                attrs: {
                                    class: "ivu-tree-title"
                                },
                                class: {
                                    "ivu-tree-title-selected":
                                        this.keys == data.nodeKey
                                }
                            })
                        ]),
                        h("span", {
                            style: {
                                display: "inline-block",
                                float: "right",
                                marginRight: "32px"
                            }
                        })
                    ]
                );
            };
        }
    },
    created() {
        this.get_os_info();
    },
    watch: {
        keyword(value) {
            this.data1 = searchTree(this.tempData, value);
            console.log(this.data1)
            if (this.data1.length&&(value === ""||this.data1[0].osParentid=="-1")) {
                this.rootIcon(this.data1);
            }
        }
    }
};
</script>
<style scoped>
.k_tree {
    /* background: rgb(250, 250, 250); */
}
</style>

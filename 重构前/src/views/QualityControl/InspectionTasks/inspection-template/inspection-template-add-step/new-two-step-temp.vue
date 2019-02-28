<template>
    <div style="padding:0 30px;position:relative;" class="new-two-step-temp-wrap">

        <div class="temp_title">
            巡检设备分类
        </div>
        <div class="category">
            <div class="categoryLeft">
                <Select :remote='true' :remote-method='remoteMethod' class='search-select' v-model="selectedId" clearable @on-change="changeSelect" placeholder="请输入设备分类" filterable :loading="remoteloading">
                    <Option v-for="(v,i) of remoteLists" :value="v.data.id" :key='v.id' >{{v.data.label}}</Option>
                </Select>

                <div class='title'>设备分类（置灰选项为已经关联模板的分类）</div>
                <div class='categoryScroll' ref="category-scroll">
                    <div style="padding:8px 10px;position:relative;">
                        <kld-tree ref='tree' class="category-left-tree" :data='treeData' show-checkbox :node-key='"id"' @current-change="handleSelect" @check-change="handleCheck" :highlight-current='true'>
                            <span :class='{"custom-tree-node":true,["custom-tree-node-"+data.id]:true}' slot-scope="{node,data}">
                                <span :class="{'custom-tree-node-disabled':node.disabled}">{{data.label}}</span>
                            </span>
                        </kld-tree>
                        <kld-loading v-if="treeLoading"></kld-loading>
                    </div>
                </div>
            </div>
            <div class="categoryRight">
                <div class='r_title'>
                    所选设备分类
                </div>
                <div style="border: 1px solid #c8ced3;border-top:none;height:403px; overflow: auto">
                    <table class="table-stripe" width="100%" border="0" style="border-collapse: collapse;">
                        <tr>
                            <th style="width:30%">序号</th>
                            <th style="width:70%">设备分类</th>
                        </tr>
                        <tr v-for="(item,i) in content" :key='i'>
                            <td>{{(i+1+'').padStart(3,"0")}}</td>
                            <td class="textEllipsis">{{item.typeName}} </td>
                        </tr>

                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import kldTree from "@common/element-components/el-custom-tree";
import kldLoading from "@common/loading/loading.vue";
import numberToLocale from "@common/numberToLocale";
import pinyinMatch  from '@common/pinyin-match';
export default {
    name: "new-two-step-temp",
    data() {
        return {
            //检查项
            content: [],
            treeData: [],

            relationList: [], //所有模板已关联的国家分类
            disabledList: [], //应该禁止选择的分类
            treeLoading: true,
            levelCount: 0, //总层数
            bottomLevel: 0, //最底层层数
            remoteLists: [],
            remoteloading: false,
            selectedId:'',
        };
    },
    components: {
        kldTree,
        kldLoading
    },
    created() {
        this.getRelations().then(res => {
            this.getCountryTree();
        });
    },
    props: {
        originChecked: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {
        treeCom() {
            return this.$refs["tree"];
        },
        isAddPage() {
            return this.$route.name === "inspection-template-add";
        },
        originCheckedIds() {
            if (this.originChecked.length) {
                return (function checkedListFormat(data, list = []) {
                    data.forEach(v => {
                        if (v.lists) {
                            checkedListFormat(v.lists, list);
                        } else {
                            list.push(v.id);
                        }
                    });
                    return list;
                })(this.originChecked);
            } else {
                return [];
            }
        }
    },
    methods: {
        changeSelect(nodeKey) {
            //选中的nodeId
            if (!nodeKey) {
                return;
            }
            this.treeCom.setCurrentKey(nodeKey);
            let selectedNode = this.treeCom.getNode(nodeKey);
            this.$nextTick(() => {
                while ((selectedNode = selectedNode.parent)) {//将父级都展开
                    selectedNode.expanded = true;
                }


                this.$nextTick(() => {
                    this.scrollView(nodeKey);
                    
                });
            });
        },
        scrollView(nodeKey){//滚轮定位
            this.$forceUpdate();
            this.$nextTick(() => {
                let nodeDom = this.treeCom.$el.querySelector(
                    ".custom-tree-node-" + nodeKey
                );

                let treeitem=nodeDom;
                while(!((treeitem=treeitem.parentNode).getAttribute('role')==='treeitem'));//focus获得鼠标操作
                treeitem.focus();

                if (nodeDom) {
                    let nodeDomTop = nodeDom.offsetTop;
                    let categoryScrollDom=this.$refs["category-scroll"];
                    if(nodeDomTop>categoryScrollDom.scrollTop&&(nodeDomTop+30)<(categoryScrollDom.scrollTop+categoryScrollDom.getBoundingClientRect().height)){//当在视图内时不需要定位
                        return;
                    }
                    setTimeout(() => {
                        categoryScrollDom.scrollTop = nodeDomTop-20;
                    }, 500);
                }
            });
        },
        remoteMethod(value) {
            this.remoteloading = true;
            setTimeout(() => {
                
                this.remoteLists = value //搜索框没有值就为空数组
                    ? this.filterMothod(
                          this.treeCom.store.nodesMap,
                          ({ data }) => {
                              return (
                                  (data.label.includes(value)||
                                  !!pinyinMatch(data.label,value))
                                //   && !data.disabled//TOdo如果需要在搜索结果中剔除禁选选项可以打开注释
                              ); 
                          }
                      )
                    : [];
                this.$nextTick(() => {
                    this.remoteloading = false;
                });
            }, 50);
        },
        filterMothod(nodesMap, fn) {
            let searched = [];
            for (let i in nodesMap) {
                if (fn(nodesMap[i])) {
                    searched.push(nodesMap[i]);
                }
            }
            return searched;
        },
        getRelations() {
            return this.$axios
                .get(
                    `/inspectionModel/isExistsModelByAssetType/${
                        this.$store.state.user_in.osId
                    }`
                )
                .then(res => {
                    if (res.data.length > 0) {
                        this.relationList = res.data.map(v => v.assetTypeId);
                    }
                });
        },
        getCountryTree() {
            // this.treeLoading=true;
            this.$store
                .dispatch("loadCountryTree")
                .then(res => {
                    //todo待定
                    if (!(res.data && res.data.length)) {
                        this.treeData = [];
                        return;
                    }
                    if (this.isAddPage) {
                        this.treeData = this.checkDisabled(
                            this.treeFormat(res.data, this.relationList)
                        );
                    } else {
                        this.relationList = this.relationList.filter(
                            id => !this.originCheckedIds.includes(id)
                        );
                        this.treeData = this.checkDisabled(
                            this.treeFormat(res.data, this.relationList)
                        );

                        this.treeCom.setCheckedKeys(this.originCheckedIds);
                        this.$nextTick(() => {
                            this.content = this.treeCom.getCheckedNodes(true);
                            this.$emit("getCheck", this.content);
                        });
                    }
                })
                .finally(res => {
                    this.treeLoading = false;
                });
        },
        treeFormat(list, disabledList, level = 0) {
            level++;
            return list.map(node => {
                this.levelCount =
                    this.levelCount > level ? this.levelCount : level;
                this.bottomLevel = this.levelCount;
                let label = `${numberToLocale(node.typeLevel)}级分类 ${
                    node.typeName
                }`;
                let lists = null;
                let disabled = disabledList.includes(node.id);
                if (node.lists && node.lists.length) {
                    let children = this.treeFormat(
                        node.lists,
                        disabledList,
                        level
                    );
                    return {
                        ...node,
                        lists,
                        label,
                        children,
                        level
                    };
                } else {
                    return {
                        ...node,
                        lists,
                        label,
                        disabled,
                        level
                    };
                }
            });
        },
        checkDisabled(treeList) {
            while (--this.levelCount) {
                let level = this.levelCount;
                (function isDisabled(list, level) {
                    list.forEach(v => {
                        if (v.children && v.level <= level) {
                            if (v.level === level) {
                                v.disabled = v.children.every(
                                    item => item.disabled
                                );
                            }
                            isDisabled(v.children, level);
                        }
                    });
                })(treeList, level);
            }
            return treeList;
        },
        handleCheck() {
            this.content = this.treeCom.getCheckedNodes(true);
            this.$emit("getCheck", this.content);
        },
        handleSelect(data,node){
            this.selectedId=node?node.key:'';
        }
    }
};
</script>
<style lang="less" scoped>
.temp_title {
    font-size: 14px;
    font-weight: normal;
    line-height: 40px;
    font-stretch: normal;
    color: #f2740c;
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 15px;
    //background-color: #e2e2e2;
}
.Pcategory {
    width: 800px;
}
.new-two-step-temp-wrap {
    position: relative;
    /deep/.search-select {
        position: absolute;
        top: -52px;
        right: 0px;
        width: 251px;
        .ivu-select-dropdown {
            max-height: 350px;
        }
    }
}
.category {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 450px;
    //左边部分
    .categoryLeft {
        position: relative;
        width: 25%;
        margin-right: 15px;
        box-sizing: border-box;

        // overflow: hidden;
        border-radius: 3px;
        border: solid 1px #c8ced3;
        .categoryScroll {
            overflow-y: auto;
            height: calc(~"100% - 52px");
            /deep/.category-left-tree {
                background-color: transparent;
                .custom-tree-node {
                    font-size: 14px;
                }
                .el-tree-node:focus>.el-tree-node__content{
                    background: #d5e8fc;
                }
                .el-tree-node.is-current > .el-tree-node__content {
                    background-color: #22a1b9;
                }
                .el-tree-node.is-current:focus > .el-tree-node__content {
                    background-color: #22a1b9;
                }
            }
        }

        > .title {
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            padding: 15px 15px;
            border-bottom: solid 1px #c8ced3;
        }
        > a {
            display: block;
            cursor: default;
            text-align: center;
            line-height: 40px;
            p {
                cursor: pointer;
                display: inline-block;
                > span {
                    color: #78bbc0;
                    font-size: 14px;
                    cursor: pointer;
                }
                span:nth-of-type(1) {
                    font-size: 20px;
                }
            }
        }
    }
    .categoryRight {
        width: 75%;
        box-sizing: border-box;
        height: 100%;
        .r_title {
            border-radius: 3px 3px 0px 0px;
            border: solid 1px #c8ced3;
            color: #666666;
            font-size: 14px;
            padding: 12px 8px;
            font-weight: 600;
        }
        table {
            table-layout: fixed;
            border: none;
            tr {
                border: none;
                border-bottom: 1px solid rgba(2, 31, 57, 0.1);
                text-align: left;
                font-size: 14px;
                td:nth-of-type(1),
                th:nth-of-type(1) {
                    padding-left: 20px;
                }
                td,
                th {
                    border: none;
                    padding: 13px 0;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
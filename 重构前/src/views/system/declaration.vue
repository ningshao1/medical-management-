<template>
    <div class="declaration-content">
        <div class="content-title">
            <h2>报单分配管理</h2>
            <div class="line"></div>
        </div>

        <div class="position-to-title">
            <Select clearable @input="searchChange" placeholder="请输入科室名称" filterable remote :remote-method="departmentTreeSearch" :loading="treeSearchLoading" ref="search-select">
                <Option v-for="{label, key} in departmentSearchOptions" :key="key" :value="key">{{label}}</Option>
            </Select>
        </div>
        <div class="content-box">
            <div class="content-list">
                <h2>工程师列表</h2>
                <div style="padding:8px 8px;">
                    <Input v-model="seachKey" icon="ios-search" style="cursor:pointer;" placeholder="关键词查找" id='dec_search'></Input>
                </div>
                <div class="list-info" style="height:530px;">
                    <ul>
                        <li v-for="(item,index) in engineer_list" :data-id='item.id' @click='show_ke($event,index,item.id)' :key='index' :class='{click_li:e_index==index}'>
                            <poptip-show-info :info-id="item.id">
                                <p>{{item.name}}</p>
                            </poptip-show-info>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="content-info">
                <Loading v-if="spinShow"></Loading>
                <h2>分配科室</h2>
                <!-- <div class="search-box">
                    <Input icon="ios-search" placeholder="搜索科室名称"></Input>
                </div> -->
                <div class="content-tree">
                    <div>
                        <kld-tree include-half-checked :data='data2' show-checkbox v-model='checkTreeData' highlight-current ref="kld-tree" :default-expanded-keys="departmentTreeExpandKeys" titleKey='osName' childrenKey='lists'></kld-tree>
                        <!-- <Tree ref="tree" :data="data2" @on-check-change='select_c'></Tree> -->
                    </div>
                </div>
                <div class="tree-btn">
                    <!-- <p>备注：凡该页面有任何修改，“确认”按钮高亮可点击，如没有任何修改，按钮置灰不可点</p> -->
                    <div class="retrieval-btn">
                        <Button :loading='spinShow' class="btn-active" @click='post_ji' v-show='engineer_list.length>0'>确定</Button>
                        <Button class='cancel' @click='del_info.modal2=true;' v-show='engineer_list.length>0'>取消</Button>
                    </div>
                </div>
            </div>

        </div>
        <pop :msginfo='del_info' @pro_ok='cancel_'></pop>
    </div>

</template>

<script>
import pop from "../../common/prompt/prompt";
import poptipShowInfo from "@common/poptip-show-info";
import KldTree from "@common/kld-tree";
export default {
    data() {
        return {
            engineer_list: [],
            user_in: JSON.parse(localStorage.getItem("user_in")),
            data2: [],
            engineer_id: null,
            office_info: null,
            limit: JSON.parse(localStorage.getItem("limit")),
            e_index: 0,
            eng_info: [], //储存工程师科室信息
            spinShow: false,
            seachKey: "",
            //取消框
            del_info: {
                title: "取消",
                okText: "确定",
                name: "是否确定取消？",
                modal2: false
            },

            treeSearchLoading: false,
            departmentSearchOptions: [],
            checkTreeData: [],
            checkpostData: []
        };
    },
    created() {
        this.get_engineer()
            .then(this.get_os_info)
            .then(this.get_os);
    },
    methods: {
        departmentTreeSearch(value) {
            if (value === "") {
                this.$refs["search-select"].clearSingleSelect();
            }
            const result = this.$refs["kld-tree"].search(value);
            this.departmentSearchOptions = result.searched;
            this.treeSearchLoading = true;

            this.$nextTick(() => {
                if (value === "") {
                    this.$refs["kld-tree"].setExpand(this.data2[0], true);
                }
                this.treeSearchLoading = false;
            });
        },

        //判断响应数据状态
        checkStatus(error, type) {
            if (error.status) {
                switch (error.status) {
                    case 404:
                        this.$Message.error(`${type}:error`);
                        break;
                }
            }
        },

        searchChange(value) {
            const { $refs: { "kld-tree": $tree } } = this;

            if (value) {
                const index = this.departmentSearchOptions.findIndex(
                    ({ key }) => key === value
                );

                $tree.searchSetCurrentNode(index);

                $tree.setCurrentKey(value);
            } else {
                $tree.setCurrentKey(null);
            }
        },
        // departmentTreeSearch(value) {
        //     this.treeSearchLoading = true;

        //     if (value) {
        //         this.departmentSearchOptions = this.$refs[
        //             "tree"
        //         ].flatState.filter(({ node: { title } }) =>
        //             title.includes(value)
        //         );
        //     } else {
        //         this.departmentSearchOptions = [];
        //     }

        //     this.$nextTick(() => {
        //         this.treeSearchLoading = false;
        //     });
        // },

        //获取工程师列表
        get_engineer() {
            const that = this;
            let url;
            return new Promise((resolve, rej) => {
                if (this.seachKey) {
                    url = `orgstruct/getEngineers/${this.user_in.osId}?name=${
                        this.seachKey
                    }`;
                } else {
                    url = `orgstruct/getEngineers/${this.user_in.osId}`;
                }
                this.axios.get(url).then(res => {
                    let arr = res.data.filter(e => {
                        return e != null;
                    });
                    that.engineer_list = arr;
                    if (arr.length > 0) {
                        that.engineer_id = arr[0].id;
                    }

                    resolve();
                });
            });
        },
        //获取工程师所在科室的信息
        get_os() {
            this.spinShow = true;
            return this.axios
                .get(`/engineerAllots/${this.engineer_id}/engineerAllots`)
                .then(res => {
                    this.eng_info = res.data;
                    this.spinShow = false;
                    this.checkTreeData = this.eng_info.map(v => {
                        return v.workGoupId;
                    });
                })
                .catch(error => {
                    this.spinShow = false;
                    console.log(error);
                });
        },
        //获取机构信息
        get_os_info() {
            this.spinShow = true;
            let that = this;
            return this.axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(res => {
                    that.data2 = [res.data];
                    this.spinShow = false;
                })
                .catch(error => {
                    this.spinShow = false;
                    console.log(error);
                });
        },
        //点击确定
        post_ji() {
            const that = this;
            if (
                this.limit.findIndex(e => {
                    return e.plPermission == "fr:add";
                }) == -1
            ) {
                that.$Message.error("对不起您没有权限");
                return;
            }
            if (this.office_info === null) {
                this.$Message.warning("请先修改再提交");
                return;
            }

            this.spinShow = true;
            this.$axios
                .post(`engineerAllots`, this.checkpostData)
                .then(res => {
                    that.$Message.success("提交成功");
                })
                .finally(() => {
                    this.spinShow = false;
                });
        },
        //点击弹窗取消
        cancel_() {
            this.get_os_info();
        },
        select_c(e) {
            const that = this;
            let info = [];
            for (let i = 0; i < e.length; i++) {
                info.push({
                    workGoupId: e[i].id,
                    osId: JSON.parse(localStorage.getItem("user_in")).osId,
                    engineerId: that.engineer_id,
                    creatorId: JSON.parse(localStorage.getItem("user_in")).id
                });
            }
            this.office_info = info;
        },
        //工程师列表点击
        show_ke(e, index, id) {
            this.engineer_id = id;
            this.e_index = index;
            this.get_os().then(() => {
                return this.get_os_info();
            });
        },

        //树状数据处理
        // jx(OldData) {
        //     let disposeData = (data = OldData) => {
        //         let result = [];
        //         if (data instanceof Array) {
        //             data.map(v => {
        //                 const { lists: children, osName: title } = v;
        //                 delete v["lists"];
        //                 let checked = false;
        //                 if (this.eng_info instanceof Array) {
        //                     checked =
        //                         this.eng_info.findIndex(
        //                             node => v.id === node.workGoupId
        //                         ) !== -1;
        //                 }
        //                 const newNode = {
        //                     ...v,
        //                     title,
        //                     checked
        //                 };
        //                 if (children && children.length > 0) {
        //                     newNode.children = disposeData(children);
        //                 }
        //                 result.push(newNode);
        //             });
        //         } else if (data instanceof Object) {
        //             const { lists: children, osName: title } = data;
        //             delete data["lists"];
        //             let checked = false;
        //             if (this.eng_info instanceof Array) {
        //                 checked =
        //                     this.eng_info.findIndex(
        //                         node => data.id === node.workGoupId
        //                     ) !== -1;
        //             }
        //             const newNode = {
        //                 ...data,
        //                 title,
        //                 checked
        //             };
        //             if (children && children.length > 0) {
        //                 newNode.children = disposeData(children);
        //             }
        //             result.push(newNode);
        //         }
        //         return result;
        //     };
        //     disposeData();
        // },
        transformSectionTreeData(
            rawTreeData,
            titleField = "osName",
            childrenKey = "lists"
        ) {
            const result = [];

            if (rawTreeData instanceof Array) {
                for (const rawNode of rawTreeData) {
                    const {
                        [childrenKey]: children,
                        [titleField]: title
                    } = rawNode;

                    delete rawNode[childrenKey];
                    let checked = false;
                    if (this.eng_info instanceof Array) {
                        if (children === null) {
                            checked =
                                this.eng_info.findIndex(
                                    node => rawNode.id === node.workGoupId
                                ) !== -1;
                        }
                    }
                    const node = {
                        ...rawNode,
                        title,
                        checked,
                        checked_: checked
                    };

                    if (children && children.length > 0) {
                        node.children = this.transformSectionTreeData(
                            children,
                            titleField,
                            childrenKey
                        );
                    }

                    result.push(node);
                }
            } else if (typeof rawTreeData === "object") {
                const {
                    [childrenKey]: children,
                    [titleField]: title
                } = rawTreeData;

                delete rawTreeData[childrenKey];
                let checked = false;
                if (this.eng_info instanceof Array) {
                    if (children === null) {
                        checked =
                            this.eng_info.findIndex(
                                node => rawTreeData.id === node.workGoupId
                            ) !== -1;
                    }
                }
                const node = {
                    ...rawTreeData,
                    expand: true,
                    title,
                    checked,
                    checked_: checked
                };

                if (children && children.length > 0) {
                    node.children = this.transformSectionTreeData(
                        children,
                        titleField,
                        childrenKey
                    );
                }

                result.push(node);
            } else {
                throw new Error("参数必须是数组或者对象");
            }

            return result;
        },
        //获取选择数据
        getSelectData() {
            let temp = [];
            let tempData = JSON.parse(JSON.stringify(this.data2));
            let Data_ = (data = tempData) => {
                if (data instanceof Array) {
                    data.map(v => {
                        if (v.checked === true || v.indeterminate === true) {
                            temp.push({
                                creatorId: this.$store.state.user_in.id,
                                engineerId: this.engineer_id,
                                osId: this.$store.state.user_in.osId,
                                workGoupId: v.id
                            });
                            if (v.children && v.children.length > 0) {
                                Data_(v.children);
                            }
                        }
                    });
                }
            };
            Data_();
            return temp;
        }
    },
    watch: {
        seachKey() {
            this.get_engineer();
        },
        checkTreeData(val) {
            let info = [];
            for (let i = 0; i < val.length; i++) {
                info.push({
                    workGoupId: val[i],
                    osId: JSON.parse(localStorage.getItem("user_in")).osId,
                    engineerId: this.engineer_id,
                    creatorId: JSON.parse(localStorage.getItem("user_in")).id
                });
            }
            this.checkpostData = info;
            this.office_info = info;
        }
    },
    components: {
        pop,
        poptipShowInfo,
        [KldTree.name]: KldTree
    },
    computed: {
        departmentTreeExpandKeys() {
            if (this.data2[0]) {
                return [this.data2[0].id];
            }
        }
    }
};
</script>

<style scoped lang='less'>
.declaration-content {
    .content-title {
        h2 {
            font-size: 20px;
            font-weight: normal;
            color: #333333;
        }
    }
    .content-box {
        height: 645px;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px #dce0e6;
        display: flex;
        h2 {
            padding-top: 20px;
            padding-left: 20px;
            font-size: 15px;
            font-weight: 600;
            color: #333333;
            height: 55px;
            border-bottom: solid 1px #dce0e6;
        }
        .search-box {
            margin: 20px 10px 10px;
        }
        .content-list {
            width: 20%;
            border-right: solid 1px #dce0e6;
            display: flex;
            flex-direction: column;

            .list-info {
                overflow-y: auto;
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: 22px;
                    height: 56px;

                    background-color: #fafafa;
                    //background-color: #f5f6fa;
                    border-bottom: solid 1px #dce0e6;
                    cursor: pointer;
                    p:nth-child(1) {
                        font-size: 14px;
                    }
                    p:nth-child(2) {
                        font-size: 14px;
                        width: 40px;
                        height: 30px;
                        background-color: #ffffff;
                        border-radius: 15px;
                        border: solid 1px #dce0e6;
                        text-align: center;
                        margin-top: -8px;
                        line-height: 30px;
                    }

                    &:hover {
                        background-color: #e5e5ea;
                    }
                }
                .click_li {
                    background-color: #f5f6fa !important;
                    border-left: solid 3px #01b0c7;
                    p:nth-child(1) {
                        //color: #01b0c7;
                        color: #495060;
                    }
                    p:nth-child(2) {
                        border-color: #01b0c7;
                        color: #01b0c7;
                    }
                }
            }
        }
        .content-info {
            position: relative;
            width: 80%;
            .content-tree {
                padding: 10px;
                height: 494px;
                overflow: auto;
                background-color: #fafafa;
                border-radius: 3px;
                border: solid 1px #dce0e6;
                margin: 10px 10px 10px;
                position: relative;
            }
            .tree-btn {
                height: 50px;
                background-color: #f5f6fa;
                border-radius: 0px 0px 3px 3px;
                position: absolute;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: flex-end;
                width: 100%;
                // p {
                //     font-size: 14px;
                //     color: #eb6100;
                //     margin-left: 50px;
                //     line-height: 50px;
                // }
            }
            .retrieval-btn {
                margin-right: 20px;
                line-height: 50px;
                button {
                    margin: 0 8px;
                }
                .btn-active {
                    background-color: #22a1b9;
                    color: #ffffff;
                }
            }
        }
    }
}

.line {
    height: 1px;
    background-color: #ccd2d7;
    margin-top: 10px;
    margin-bottom: 20px;
}
// .content-box .ivu-input{
//     height: 40px;
// }
// .content-box .ivu-input-icon{
//     height: 40px;
// }
.declaration-content {
    position: relative;
}
.position-to-title {
    width: 300px;
    right: 0;
    position: absolute;
    top: 54px;
}
</style>
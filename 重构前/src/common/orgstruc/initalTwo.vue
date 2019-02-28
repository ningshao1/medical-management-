<template>
    <div class='inital_two department-manage department-manage-extra' style='position:relative;height: 665px;background:#fafafa;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <!-- 标题 -->
        <div class="search">
            <Select @on-change="searchChange" filterable remote :remote-method="departmentTreeSearch" class="kld-select" :loading="search.loading" placeholder="科室名称" clearable ref="search-select">
                <Option v-for="opt in search.result" :label="opt.label" :value="opt.key" :key="opt.key"></Option>
            </Select>
            <Icon type="ios-search" class='search-icon'></Icon>
        </div>

        <i-button @click="setHead" class="set-head-btn kld-btn" :disabled="! departmentTag.length">设置负责人</i-button>
        <div class="two_title"></div>
        <div class='two_content'>
            <div class='content_right'>

                <div class='c_title'>科室列表：</div>
                <div class='content_nei'>
                    <div class='nei_left' style="position: relative;">
                        <div v-if="checkLimit('system:decline')" class="order-switch">
                            <span>
                                设置科室序列
                            </span>
                            <i-switch v-model="isOrder"></i-switch>
                        </div>
                        <Loading v-if="treeLoading"></Loading>
                        <div class="new-kld-tree-wrap">
                            <kld-tree v-model="board.checkedList" class="department-tree-wrap" :data="elTreeData" show-checkbox :default-expanded-keys='[osId]' ref="section-el-tree" @current-change="elTreeClick" value-type="node" title-key="osName" :draggable="isOrder&&checkLimit('system:decline')" :allow-drop='allowDrop' @node-drag-end='nodeDragEnd' @node-drag-over='nodeDragOver'>
                                <span class="custom-tree-node" slot-scope="{ data }" :title="isOrder&&checkLimit('system:decline')?'拖拽以调整科室序列':''">
                                    <span class="tree-node-info">

                                        <span>{{data.label}}</span>
                                        <img class="custom-tree-node-icon" v-if="data.responsibleStatus===1" :src="require('./设置负责人@2x.png')">
                                    </span>
                                    <Tag class="tree-node-order" :color="orderColors[data.osLevel]" v-if="isOrder&&checkLimit('system:decline')">{{data.position}}</Tag>
                                </span>
                            </kld-tree>
                        </div>
                    </div>
                    <div class="nei_right" style="overflow:auto;">
                        <Loading v-if='spanshow'></Loading>
                        <Table class='i-table-stripe section-table' border :columns="columns7" :data="data6"></Table>
                        <div class='office-page'>
                            <Page @on-change='paging($event)' :total='allData.length' :current.sync='page.current' :page-size='10'></Page>
                        </div>
                        <div class='right_add' @click='add_ke' v-if='ViewLimit("sys:org:add")'>
                            <div class="add_block">
                                <span>
                                    <span style="font-size:20px;">+</span>
                                    <span>新增科室</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹窗 -->
        <div class="two_m">
            <Modal v-model="tc_info.modal1" :title="tc_info.title" class-name="two_tan" @on-ok='change_os' :loading='tc_info.loading'>
                <div class='content_t'>
                    <div class='one_info'>
                        <div class='info_h'>科室名称：
                            <span style="color: #f2740c;">*</span>
                        </div>
                        <div class='one_tu'><input class='info_z' type="text" placeholder="请正确输入科室名称" v-model="tc_info.ke_name"></div>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>科室级别：</div>
                        <div class='one_tu'>
                            <Select v-model="tc_info.model1" style="width:390px;height:50px;" disabled>
                                <Option v-for="item in tc_info.cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </div>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>科室电话：</div>
                        <div class='one_tu'><input class='info_z' type="text" placeholder="请输入科室电话" v-model="tc_info.tel_"></div>
                    </div>
                </div>
                <div class="set-key-department">
                    <Checkbox :true-value='1' :false-value='0' v-model="tc_info.osStatus">将该科室设置为重点科室</Checkbox>
                </div>
            </Modal>
        </div>
        <Modal title='设置科室负责人' :width='600' class="department-manage-extra-modal" v-model='board.show' @on-visible-change='onVisibleChange'>
            <div class="board-content-wrap">
                <div class="checked-departments">
                    <div class="checked-departments-title">
                        已选科室：
                    </div>
                    <div class="checked-departments-content">
                        <Tag class="single-department" v-for="v of departmentTag" :key="v.id" color="blue" closable @on-close="handleClose(v)">
                            {{v.label}}
                        </Tag>
                    </div>
                </div>
                <div class="select-principal">
                    <i-form ref='head-form' :model='headModel' :rules='headRules'>
                        <i-row :gutter='5'>
                            <i-col :span='12'>
                                <form-item label="选择设备负责人：" prop='responsible' >
                                    <Select v-model="headModel.responsible" filterable label-in-value @on-change="responsibleChange">
                                        <Option :value="v.id" v-for="v of board.responsibleList" :label="v.name" :key='v.id'></Option>
                                        <Option :value='""' :label="'暂无可选设备负责人'" v-if='!board.responsibleList.length'></Option>
                                    </Select>
                                </form-item>
                            </i-col>
                            <i-col :span='12'>
                                <form-item label="选择科室管理人：" prop='user'>
                                    <Select v-model="headModel.user" filterable label-in-value @on-change="userChange">
                                        <Option :value="v.id" v-for="v of board.userList" :label="v.name" :key='v.id'></Option>
                                        <Option :value='""' :label="'暂无可选科室管理人'" v-if='!board.userList.length'></Option>
                                    </Select>
                                </form-item>
                            </i-col>
                        </i-row>
                    </i-form>
                </div>
            </div>
            <div slot='footer'>
                <i-button class="kld-btn-default" @click="board.show=false">取消</i-button>
                <i-button class="kld-btn" @click='queryConfirm'>确认</i-button>
            </div>

        </Modal>
        <pop :msginfo='del_info' @pro_ok='remove(del_e)'></pop>
    </div>
</template>
<style  scoped lang="less">
@import "./initalTwo.less";
.inital_two {
    position: relative;
}
.search {
    width: 300px;
    position: absolute;
    right: 0;
    top: -70px;
}
.department-manage-extra {
    .department-tree-wrap {
        .custom-tree-node {
            font-size: 14px;
            display: flex;
            align-items: center;
            .el-tree-node__content {
                position: relative;
            }
            .tree-node-info {
                .custom-tree-node-icon {
                    width: 16px;
                    margin-left: 3px;
                }
            }
            @length: 20px;
            .tree-node-order {
                position: absolute;
                right: 8px;
            }
        }
        .node-title {
            padding: 0;
        }
    }
    .set-head-btn {
        position: absolute;
        top: -68px;
        right: 335px;
    }
}
.department-manage-extra-modal {
    /deep/.board-content-wrap {
        padding-bottom: 20px;
        .checked-departments {
            .checked-departments-title{
                font-size: 14px;
            }
            .checked-departments-content {
                padding: 5px;
                border: 1px solid rgb(220, 224, 230);
                border-radius: 4px;
                max-height: 200px;
                overflow: auto;
                margin-right: 5px;
            }
        }
        .select-principal{
            margin-top:15px;
            /deep/.ivu-form-item-label{
                font-size: 14px;
            }
        }
    }
}
</style>

<script>
import pop from "../prompt/prompt";
import elTree from "@common/element-components/el-tree";
import KldTree from "@common/kld-tree";
export default {
    data() {
        return {
            search: {
                triggerIsTree: false,
                result: "",
                loading: false
            },

            board: {
                show: false,
                userList: [],
                responsibleList: [],
                checkedList: []
            },
            headModel: {
                user: "",
                userName: "",
                responsible: "",
                responsibleName: ""
            },
            headRules: {
                user: { required: true, message: "请选择科室管理人" },
                responsible: { required: true, message: "请选择设备负责人" }
            },
            allData: [],
            //树状图数据
            data1: [],
            elTreeData: [],
            allElTreeNode: [],
            treeLoading: false,
            page: {
                total: 10,
                current: 1
            },
            orderColors: ["blue", "green", "yellow", "red", "#EF6AFF"],
            //   列表数据
            columns7: [
                {
                    title: "科室名称",
                    key: "name"
                },
                {
                    title: "级别",
                    key: "osLevel"
                },
                {
                    title: "科室电话",
                    key: "tel_"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 150,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            this.ViewLimit("sys:org:edit")
                                ? h(
                                      "span",
                                      {
                                          props: {
                                              type: "primary",
                                              size: "small"
                                          },
                                          style: {
                                              marginRight: "5px",
                                              fontSize: "14px",
                                              color: "#5ba4c8",
                                              cursor: "pointer"
                                          },
                                          on: {
                                              click: () => {
                                                  this.show(params);
                                              }
                                          }
                                      },
                                      "修改"
                                  )
                                : null,
                            this.ViewLimit("sys:org:del")
                                ? h(
                                      "span",
                                      {
                                          props: {
                                              type: "error",
                                              size: "small"
                                          },
                                          style: {
                                              marginRight: "5px",
                                              fontSize: "14px",
                                              color: "#5ba4c8",
                                              cursor: "pointer"
                                          },
                                          on: {
                                              click: () => {
                                                  this.removes(params);
                                              }
                                          }
                                      },
                                      "删除"
                                  )
                                : null
                        ]);
                    }
                }
            ],
            ke_id: null,
            data6: [],
            os_INFO_: {
                osShortname: "",
                osPhone: "",
                osAddress: "",
                os_id: ""
            },
            //弹窗下拉框数据
            tc_info: {
                //弹窗显示
                modal1: false,
                ke_name: "",
                cityList: [
                    {
                        value: "11",
                        label: "11"
                    }
                ],
                tel_: null,
                model1: "",
                rowId: null,
                title: "",
                loading: true,
                nodeData: {},
                osStatus: 0
            },
            //删除框
            del_info: {
                title: "删除科室",
                okText: "删除",
                name: "是否删除该科室？",
                modal2: false
            },
            user_in: JSON.parse(localStorage.getItem("user_in")),
            hospital_name: "医院",
            del_e: "",
            spanshow: false,
            os_change_name: "", //点击修改的时候储存的科室名用于判断是否修改了
            os_change_phone: "",
            os_change_osStatus: 0,

            oldPosition: 0, //排序前后的位置
            position: 0,
            isOrder: false //是否开启排序
        };
    },
    // created() {
    //     this.get_os_info().then(res => {
    //         this.select_c([
    //             {
    //                 id: res.data.id,
    //                 osLevel: res.data.osLevel
    //             }
    //         ]);
    //     });
    // },

    //el
    computed: {
        headForm() {
            return this.$refs["head-form"];
        },
        sectionElTree() {
            return this.$refs["section-el-tree"];
        },
        osId() {
            return this.$store.state.user_in.osId;
        },

        departmentTag() {
            return this.board.checkedList.filter(({ id }) => {
                return id !== this.osId;
            });
        }
    },
    watch: {
        "tc_info.ke_name": {
            handler(value) {
                let newValue = this.trCnToEn(value);
                
                if (newValue !== this.tc_info.ke_name) {
                    this.tc_info.ke_name = newValue;
                }
            }
        }
    },
    created() {
        this.get_os_info().then(res => {
            let elTreeCom = this.$refs["section-el-tree"];
            elTreeCom.setCurrentKey(this.osId);
            this.elTreeClick({
                id: res.data.id,
                osLevel: res.data.osLevel
            });
        });
    },
    methods: {
        allowDrop(draggingNode, dropNode, type) {
            return (
                draggingNode.data.osParentid === dropNode.data.osParentid &&
                (type === "prev" || type === "next")
            );
        },
        nodeDragOver(draggingNode, dropNode, event) {
            if (draggingNode.data.osParentid === dropNode.data.osParentid) {
                event.dataTransfer.dropEffect = "move";
            }
        },
        nodeDragEnd(draggingNode, dropNode, type, event) {
            if (!dropNode) {
                return;
            }
            let types = {
                before: "prev",
                inner: "inner",
                after: "next",
                none: "none"
            };
            type = types[type];
            if (this.allowDrop(draggingNode, dropNode, type)) {
                this.oldPosition = draggingNode.data.position;
                if (draggingNode.data.position > dropNode.data.position) {
                    //确定排序后的的位置
                    this.position =
                        type === "prev"
                            ? dropNode.data.position
                            : dropNode.data.position + 1;
                } else {
                    this.position =
                        type === "prev"
                            ? dropNode.data.position - 1
                            : dropNode.data.position;
                }

                this.treeLoading = true;
                this.$axios
                    .put(`/orgstruct/sequenceDecline`, {
                        id: draggingNode.data.id,
                        parentId: draggingNode.data.osParentid,
                        position: this.position,
                        oldPosition: this.oldPosition
                    })
                    .then(
                        res => {
                            dropNode.parent.childNodes.map(node => {
                                let position = node.data.position;
                                if (
                                    this.position > this.oldPosition &&
                                    position <= this.position &&
                                    position >= this.oldPosition
                                ) {
                                    node.data.position =
                                        position === this.oldPosition
                                            ? this.position
                                            : position - 1;
                                }
                                if (
                                    this.position < this.oldPosition &&
                                    position >= this.position &&
                                    position <= this.oldPosition
                                ) {
                                    node.data.position =
                                        position === this.oldPosition
                                            ? this.position
                                            : position + 1;
                                }
                                return node;
                            });
                        },
                        error => {
                            //失败后重新请求数据
                            this.get_os_info();
                        }
                    )
                    .finally(() => {
                        this.treeLoading = false;
                    });
            }
        },

        departmentTreeSearch(value) {
            if (value === "") {
                this.$refs["search-select"].clearSingleSelect();
            }

            const result = this.$refs["section-el-tree"].search(value);

            this.search.result = result.searched;

            this.search.loading = true;

            this.$nextTick(() => {
                if (value === "") {
                    this.$refs["section-el-tree"].setExpand(this.osId, true);
                }
                this.search.loading = false;
            });
        },

        searchChange(value) {
            const {
                $refs: { "section-el-tree": $tree }
            } = this;

            if (value) {
                const index = this.search.result.findIndex(
                    ({ key }) => key === value
                );

                $tree.searchSetCurrentNode(index);

                $tree.setCurrentKey(value);
            } else {
                $tree.setCurrentKey(null);
            }
        },

        onVisibleChange(status) {
            if (status) {
            } else {
                this.headForm.resetFields();
            }
        },
        queryConfirm() {
            this.headForm.validate(valid => {
                if (valid) {
                    this.$axios
                        .put(`/orgstruct/updateOrgstructResponsible`, {
                            osIds: this.departmentTag.map(v => v.id),
                            responsible: this.headModel.responsible,
                            responsibleName: this.headModel.responsibleName,
                            userName: this.headModel.userName,
                            user: this.headModel.user
                        })
                        .then(res => {
                            this.board.show = false;
                            this.$nextTick(() => {
                                this.$Message.success("成功设置管理/负责人！");
                                this.get_os_info();
                            });
                        });
                }
            });
        },
        setHead() {
            this.getManagers();
            this.board.show = true;
        },
        // elCheck(data, node) {
        //     this.board.checkedList = this.sectionElTree.getCheckedNodes();
        // },
        //获得负责人/管理人
        getManagers() {
            // let requestBody =qs.stringify({
            //     sectionIds: this.board.checkedList.map(v => v.id)
            // }) ;
            let requestBody = this.departmentTag.map(v => v.id);
            let getDirector = this.$axios.post(
                `/users/getDirector`,
                requestBody
            );
            let getNurse = this.$axios.post(`/users/getNurse`, requestBody);
            Promise.all([getDirector, getNurse]).then(
                ([responsibleRes, userRes]) => {
                    this.board.userList = userRes.data || [];
                    this.board.responsibleList = responsibleRes.data || [];
                    this.$nextTick(() => {
                        if (this.board.userList.length === 1) {
                            this.headModel.user = this.board.userList[0].id;
                        }
                        if (this.board.responsibleList.length === 1) {
                            this.headModel.responsible = this.board.responsibleList[0].id;
                        }
                    });
                }
            );
        },
        responsibleChange(value) {
            this.headModel.responsibleName = value.label;
        },
        userChange(value) {
            this.headModel.userName = value.label;
        },
        handleClose(node) {
            const {
                    board: { checkedList }
                } = this,
                index = checkedList.findIndex(item => item === node);

            if (index !== -1) {
                checkedList.splice(index, 1);
            }

            this.$nextTick(() => {
                if (!this.departmentTag.length) {
                    this.board.show = false;
                    return;
                }
                this.getManagers();
            });
        },

        //获取机构信息
        // get_os_info() {
        //     let that = this;
        //     return this.axios
        //         .get(`orgstruct/findAllTree/${this.user_in.osId}`, {})
        //         .then(res => {
        //             let x = res.data;
        //             x.expand = true;
        //             that.data1 = that.jx([x]);
        //             return res;
        //         });
        // },

        //el
        get_os_info() {
            this.treeLoading = true;
            return this.axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`, {})
                .then(res => {
                    this.elTreeData = this.treeDataFormat([res.data]);
                    this.allElTreeNode = this.getAllNode(
                        JSON.parse(JSON.stringify(this.elTreeData))
                    );
                    return res;
                })
                .finally(() => {
                    this.treeLoading = false;
                });
        },
        treeDataFormat(treeList, labelName = "osName") {
            // let nodeKey = 0;
            return (function format(treeList, labelName) {
                return treeList.map(v => {
                    // nodeKey++;
                    if (v.lists instanceof Array && v.lists.length > 0) {
                        return {
                            ...v,
                            // nodeKey,
                            label: v[labelName],
                            children: format(v.lists, labelName),
                            lists: undefined
                        };
                    } else {
                        return {
                            ...v,
                            // nodeKey,
                            label: v[labelName]
                        };
                    }
                });
            })(treeList, labelName);
        },
        getAllNode(treeList, children = "children") {
            let array = [];
            for (let i = 0; i < treeList.length; i++) {
                if (treeList[i]) {
                    array.push(treeList[i]);
                }
                if (treeList[i][children] && treeList[i][children].length > 0) {
                    let final = this.getAllNode(
                        treeList[i][children],
                        children
                    );
                    array = array.concat(final);
                }
            }
            return array;
        },
        //点击树节点触发的事件
        // select_c(e) {
        //     if (e.length > 0) {
        //         this.nodeData = e[0];
        //         this.spanshow = true;
        //         this.ke_id = e[0].id;
        //         let array = [];
        //         this.axios
        //             .get(`orgstruct/findAll/${e[0].id}`)
        //             .then(res => {
        //                 res.data.forEach((item, i) => {
        //                     array.push({
        //                         osParentid: item.osParentid,
        //                         name: item.osName,
        //                         osLevel: item.osLevel,
        //                         id: item.id,
        //                         tel_: item.osPhone,
        //                         osStatus: item.osStatus
        //                     });
        //                 });
        //                 this.allData = array;
        //                 this.paging(1);
        //                 this.spanshow = false;
        //             })
        //             .catch(() => {
        //                 this.spanshow = false;
        //             });
        //     }
        // },
        elTreeClick(data, node, store, clickTree = true) {
            if (data) {
                if (clickTree) {
                    //重置搜索框内容
                    this.search.triggerIsTree = true;
                    // this.clearSearchSelect();
                    // this.search.result=[];//重置上次搜索记录
                    this.$nextTick(() => (this.search.triggerIsTree = false));
                }
                this.nodeData = data;
                this.spanshow = true;
                this.ke_id = data.id;
                let array = [];
                this.axios
                    .get(`orgstruct/findAll/${data.id}`)
                    .then(res => {
                        res.data.forEach((item, i) => {
                            array.push({
                                osParentid: item.osParentid,
                                name: item.osName,
                                osLevel: item.osLevel,
                                id: item.id,
                                tel_: item.osPhone,
                                osStatus: item.osStatus
                            });
                        });
                        this.allData = array;
                        this.paging(1);
                        this.spanshow = false;
                    })
                    .catch(() => {
                        this.spanshow = false;
                    });
            }
        },
        //  //点击修改数据返回给弹窗
        show(e) {
            if (!this.checkLimit("sys:org:edit")) {
                that.$Message.warning("对不起您没有权限");
                return;
            }
            this.os_change_name = e.row.name == null ? "" : e.row.name;
            this.os_change_phone = e.row.tel_ == null ? "" : e.row.tel_;
            this.os_change_osStatus = e.row.osStatus ? e.row.osStatus : 0;
            this.tc_info.modal1 = true;

            this.tc_info.osStatus = e.row.osStatus;
            this.tc_info.title = "修改科室";
            this.tc_info.ke_name = e.row.name;
            this.tc_info.cityList = [
                {
                    value: e.row.osLevel,
                    label: e.row.osLevel
                }
            ];
            this.tc_info.model1 = e.row.osLevel;
            this.tc_info.rowId = e.row.id;
            this.tc_info.rowIndex = e.index;
            this.tc_info.tel_ = e.row.tel_;
            this.tc_info.add = false;
            this.tc_info.osParentid = e.row.osParentid;
        },
        //点击删除提示
        removes(e) {
            if (!this.checkLimit("sys:org:del")) {
                that.$Message.warning("对不起您没有权限");
                return;
            }
            this.del_info.modal2 = true;
            this.del_e = e;
        },
        remove(e) {
            let that = this;
            this.axios
                .delete(`orgstruct/${e.row.id}`)
                .then(res => {
                    console.log(res);
                    that.data6.splice(e.index, 1);
                    this.$Message.success("删除成功");
                    that.get_os_info();
                })
                .catch(error => {
                    if (error.code == "400") {
                        this.$Message.warning(error.message);
                    } else {
                        this.$Message.warning("科室删除失败");
                    }
                });
        },
        //修改科室名称接口调用
        change_os() {
            clearTimeout(timer);
            var timer = setTimeout(() => {
                const that = this;
                this.tc_info.loading = false;
                setTimeout(() => {
                    this.tc_info.loading = true;
                });
                if (this.tc_info.ke_name == "") {
                    this.$Message.warning("请填写科室名称");
                    return;
                }

                if (this.tc_info.add) {
                    this.add_keshi();
                } else {
                    // this.$axios.put(`/orgstruct/setOrgstrucyStatus/${that.tc_info.rowId}`)
                    //     .then(res=>{
                    //         console.log(res);

                    //     })

                    if (
                        that.tc_info.ke_name == this.os_change_name &&
                        that.tc_info.tel_ == this.os_change_phone &&
                        that.tc_info.osStatus == this.os_change_osStatus
                    ) {
                        this.tc_info.modal1 = false;
                        return;
                    }
                    this.$axios
                        .put("orgstruct", {
                            id: that.tc_info.rowId,
                            osName: that.tc_info.ke_name.trim(),
                            osPhone: that.tc_info.tel_,
                            osParentid: that.tc_info.osParentid,
                            osStatus: that.tc_info.osStatus
                        })
                        .then(res => {
                            this.$Message.success("科室信息修改成功");
                            this.tc_info.modal1 = false;
                            this.get_os_info();
                            this.data6[
                                this.tc_info.rowIndex
                            ].name = this.tc_info.ke_name;
                            this.data6[
                                this.tc_info.rowIndex
                            ].tel_ = this.tc_info.tel_;
                            this.data6[
                                this.tc_info.rowIndex
                            ].osStatus = this.tc_info.osStatus;
                        });
                }
            }, 100);
        },
        //添加科室
        add_ke() {
            if (!this.checkLimit("sys:org:add")) {
                that.$Message.warning("对不起您没有权限");
                return;
            }

            this.$nextTick(() => {
                this.tc_info.osStatus = 0;
            });

            if (this.data6.length) {
                this.tc_info = {
                    modal1: true,
                    ke_name: "",
                    cityList: [
                        {
                            value: "",
                            label: ""
                        }
                    ],
                    model1: "",
                    rowId: null,
                    title: "添加科室",
                    add: true,
                    tel_: null,
                    loading: true
                };

                this.tc_info.cityList[0].label = this.tc_info.model1 = this.tc_info.cityList[0].value =
                    this.nodeData.osLevel + 1;
                //   this.tc_info.rowId = this.data6[max_level].id;
            } else {
                this.$Message.warning("请选择科室在进行添加");
            }
        },
        //添加科室接口调用
        add_keshi() {
            let that = this;
            this.$axios
                .post("orgstruct", {
                    osParentid: this.ke_id,
                    osName: that.tc_info.ke_name.trim(),
                    osPhone: that.tc_info.tel_,
                    osStatus: that.tc_info.osStatus
                })
                .then(res => {
                    console.log(res);
                    that.get_os_info();
                    this.tc_info.modal1 = false;
                    that.$Message.success("添加科室成功");
                    let temp = {
                        id: res.data.id,
                        name: res.data.osName,
                        osLevel: res.data.osLevel,
                        tel_: res.data.osPhone,
                        osParentid: res.data.osParentid
                    };
                    this.allData.splice((this.page.current - 1) * 10, 0, temp);
                    this.paging(this.page.current);
                });
        },
        //修改机构信息
        xiu_os() {
            this.axios
                .put("orgstruct/updateType", {
                    id: this.os_INFO_.os_id,
                    osPhone: this.os_INFO_.osPhone,
                    osAddress: this.os_INFO_.osAddress,
                    osShortname: this.os_INFO_.osShortname
                })
                .then(res => {})
                .catch(error => {
                    this.$Message.warning("机构信息修改失败");
                });
        },
        jx(data) {
            const that = this;
            if (data instanceof Array) {
                var l = new Array();

                for (let n in data) {
                    var each = data[n];

                    if (each instanceof Object) {
                        var a = new Object();
                        a["expand"] = true;
                        for (let k in each) {
                            var v = each[k];

                            if (v instanceof Array) {
                                k == "lists"
                                    ? (a["children"] = that.jx(v))
                                    : (a[k] = that.jx(v));
                            } else {
                                switch (k) {
                                    case "id":
                                        a["id"] = v;
                                        break;
                                    case "osName":
                                        a["title"] = v;
                                        break;
                                    case "osLevel":
                                        a["osLevel"] = v;
                                        break;
                                    case "osPhone":
                                        a["tel_"] = v;
                                }
                                if (each["expand"] == true) {
                                    a["expand"] = true;
                                } else {
                                    a["expand"] = false;
                                }
                            }
                        }
                        l.push(a);
                    } else if (each instanceof Array) {
                        that.jx(each);
                    } else {
                        switch (each) {
                            case "id":
                                a["id"] = v;
                                break;
                            case "osName":
                                a["title"] = v;
                                break;
                            case "osLevel":
                                a["osLevel"] = v;
                                break;
                            case "osPhone":
                                a["tel_"] = v;
                        }
                        if (each["expand"] == true) {
                            a["expand"] = true;
                        } else {
                            a["expand"] = false;
                        }
                    }
                }
                return l;
            } else if (data instanceof Object) {
                var a = new Object();
                for (let k in data) {
                    var v = data[k];
                    if (v instanceof Array) {
                        k == "lists"
                            ? (a["children"] = that.jx(v))
                            : (a[k] = that.jx(v));
                    } else {
                        switch (v) {
                            case "id":
                                a["id"] = v;
                                break;
                            case "osName":
                                a["title"] = v;
                                break;
                            case "osLevel":
                                a["osLevel"] = v;
                                break;
                            case "osPhone":
                                a["tel_"] = v;
                        }
                        if (each["expand"] == true) {
                            a["expand"] = true;
                        } else {
                            a["expand"] = false;
                        }
                    }
                }
                return a;
            } else {
                return a;
            }
        },
        up_() {
            this.xiu_os();
        },
        //分页方法
        paging(current = 1) {
            this.data6 = this.allData.slice(
                (current - 1) * 10,
                (current - 1) * 10 + 10
            );
        },

        treeClick({ target }) {
            if (target.classList.contains("ivu-tree-title")) {
                this.search.triggerIsTree = true;
                this.clearSearchSelect();
                this.$nextTick(() => (this.search.triggerIsTree = false));
            }
        },
        clearSearchSelect() {
            this.$refs["search-select"].clearSingleSelect();
        },

        searchMethod(query) {
            const { search } = this;
            search.loading = true;
            if (query === "") {
                this.clearSearchSelect();
            } else {
                // const { flatState } = this.$refs["section-tree"];

                search.result = this.allElTreeNode.filter(
                    ({ label }) => label.indexOf(query) !== -1
                );
            }
            this.$nextTick(() => (search.loading = false));
        }
    },
    components: {
        pop,
        elTree,
        KldTree
    }
};
</script>

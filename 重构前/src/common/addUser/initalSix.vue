<template>
    <div class='inital_two' style='position:relative;height: 665px;background:#fafafa;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <div class='two_content' style="padding-top:20px;">
            <div class='content_right'>
                <div class='c_title' style="padding: 0 15px;">科室列表：
                </div>
                <div class='content_nei'>
                    <div class='nei_left'>
                        <div>
                            <Tree :data="TreeData" @on-select-change='clickTree' :render="renderContent"></Tree>
                        </div>
                    </div>
                    <div class="nei_right">
                        <Loading v-if='spanshow' class="loading_"></Loading>
                        <div style="position: relative;" class='scroll_top'>
                            <Table border :columns="columns7" :data="formData"></Table>
                            <div class='right_add' v-if='ViewLimit("sys:user:add")'>
                                <div class="add_block" @click='add_user'>
                                    <span>
                                        <span style="font-size:20px;">+</span>
                                        <span>新增用户</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- 弹窗 -->
        <div class="two_m">
            <Modal v-model="popInfo.popshow" :title="popInfo.title" class-name="six_tan ivu-modal-wrap">
                <Form ref="popInfo" :model="popInfo" :rules="rulePopInfo">
                    <div>
                        <div class="six_box">
                            <div class="six_z flex_r">
                                <div class="box_h">
                                    <div class="h_title">姓名：
                                        <span style="color: #f2740c;">*</span>
                                    </div>
                                    <FormItem prop="name">
                                        <Input type="text" placeholder="请输入姓名" v-model="popInfo.name"></Input>
                                    </FormItem>
                                </div>
                                <div class="box_h">
                                    <div class="h_title">登录名：
                                        <span style="color: #f2740c;">*</span>
                                    </div>
                                    <FormItem prop="loginName">
                                        <Input type="text" placeholder="请输入登录名" v-model="popInfo.loginName" :disabled='popInfo.disabled'></Input>
                                    </FormItem>
                                </div>
                            </div>
                            <div class="six_z flex_r">
                                <div class="box_h">
                                    <div class="h_title">
                                        <span v-show='popInfo.disabled==true'>新</span>密码：
                                        <span style="color: #f2740c;" v-show='popInfo.disabled!==true'>*</span>
                                    </div>
                                    <div>
                                        <FormItem prop="newpw">
                                            <Input type="password" placeholder="请输入密码" v-model='popInfo.newpw'></Input>
                                        </FormItem>
                                        <!-- <img @mousedown='show_ming(1)' :src="six_tan.input_one.img" alt="" @mouseup='show_mi(1)'> -->
                                    </div>
                                </div>
                                <div class="box_h">
                                    <div class="h_title">确认密码：
                                        <span style="color: #f2740c;" v-show='popInfo.disabled!==true'>*</span>
                                    </div>
                                    <div>
                                        <FormItem prop="newpws">
                                            <Input type="password" placeholder="请再次输入密码" v-model='popInfo.newpws'></Input>
                                        </FormItem>
                                        <!-- <img :src="six_tan.input_two.img" alt="" @mousedown='show_ming(2)' @mouseup='show_mi(2)'> -->
                                    </div>
                                </div>
                            </div>
                            <div class="six_z flex_r">
                                <div class="box_h">
                                    <div class="h_title">手机号：
                                        <span style="color: #f2740c;">*</span>
                                    </div>
                                    <div>
                                        <FormItem prop="phone">
                                            <Input type="text" placeholder="请输入手机号" v-model='popInfo.phone'></Input>
                                        </FormItem>

                                    </div>
                                </div>
                            </div>

                            <div class='ks_box'>
                                <div class="ks_name">所属科室</div>
                                <div class='ks_block'>{{popInfo.osName}}</div>
                            </div>
                            <div class='xz_radio'>
                                <div class='xz_jiao'>
                                    选择角色：
                                    <span style="color: #f2740c;">*</span>
                                </div>
                                <FormItem prop="srid">
                                    <RadioGroup v-model="popInfo.srid">
                                        <Radio v-for='(item,index) in permission' :key='index' :label="item.id">{{item.srDesc}}</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </div>
                        </div>
                    </div>
                </Form>
                <div slot="footer">
                    <div>
                        <Button @click="cancel" class='kld-btn-default'>取消</Button>
                        <Button @click="affirm" class='kld-btn'>确定</Button>
                    </div>
                </div>
            </Modal>
        </div>
    </div>
</template>
<style  scoped lang="less">
@import "./initalSix.less";
</style>
<script>
import ChangeTreeData from "@common/transformSectionTreeData/index";
import confirm from "@common/kld-confirm/index";
export default {
    data() {
        return {
            TreeData: [],
            keys: "",
            formData: [],
            columns7: [
                {
                    title: "姓名",
                    key: "name"
                },
                {
                    title: "登录名",
                    key: "logName"
                },
                {
                    title: "所属科室",
                    key: "osName"
                },
                {
                    title: "角色",
                    key: "srDesc"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 150,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            this.ViewLimit("sys:user:edit")
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
                                                  this.amend(params);
                                              }
                                          }
                                      },
                                      "修改"
                                  )
                                : null,
                            this.ViewLimit("sys:user:del")
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
                                                  this.remove(params);
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
            nodeData: {
                children: {}
            }, //点击节点储存的信息
            popInfo: {
                popshow: false,
                title: "添加用户",
                name: "",
                loginName: "",
                disabled: false,
                newpw: null,
                newpws: null,
                phone: null,
                osName: null,
                offices: null,
                srid: null
            }, //弹窗信息
            rulePopInfo: {
                name: {
                    required: true,
                    message: "姓名为必填项"
                    // validator(rule, value, callback) {
                    //     alert(1);
                    //     if (value === "" || value === null) {
                    //         callback(new Error("姓名为必填"));
                    //     } else {
                    //         callback();
                    //     }
                    // }
                },
                loginName: {
                    required: true,
                    message: "登录名为必填项"
                },
                newpw: {
                    validator: (rule, value, callback) => {
                        if (!this.popInfo.disabled) {
                            if (value !== "" && value !== null) {
                                console.log(value.match(/^[\w]{6,12}$/));
                                if (!value.match(/^[\w]{6,12}$/)) {
                                    callback(
                                        new Error(
                                            "密码只能为6-20个字母、数字、下划线"
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            } else {
                                callback(new Error("密码为必填项"));
                            }
                        } else {
                            callback();
                        }
                    }
                },
                newpws: {
                    validator: (rule, value, callback) => {
                        if (!this.popInfo.disabled) {
                            if (value !== this.popInfo.newpw) {
                                callback(new Error("确认密码与新密码不同"));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                },
                phone: {
                    validator: (rule, value, callback) => {
                        if (value !== "" && value !== null) {
                            if (
                                !/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
                                    value
                                )
                            ) {
                                callback(new Error("请输入正确的手机号"));
                            } else {
                                callback();
                            }
                        } else {
                            callback(new Error("手机号为必填项"));
                        }
                    }
                },
                srid: {
                    required: true,
                    message: "角色为必选项"
                }
            },
            spanshow: false,
            permission: [], //角色列表
            userInfo_: {}
        };
    },
    created() {
        this.getTreeData();
        this.get_q();
    },
    computed: {
        userInfo() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        getTreeData() {
            this.$axios
                .get(`orgstruct/findAllTree/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    this.TreeData = ChangeTreeData(data);
                    this.TreeData[0]["render"] = (h, { root, node, data }) => {
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
                                        this.clickTree([data]);
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
                });
        },
        clickTree([node]) {
            if (node) {
                console.log(node);
                this.nodeData = node;
                this.popInfo.osName = node.osName;
                this.getFormData(node.id);
            }
        },
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
                            this.clickTree([data]);
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
        getFormData(id) {
            this.spanshow = true;
            this.$axios
                .get(`orgstruct/findUsers/${id}`)
                .then(({ data }) => {
                    this.formData = data;
                    this.spanshow = false;
                })
                .catch(() => {
                    this.spanshow = false;
                });
        },
        //获取角色
        get_q() {
            this.$axios.post(`roles/${this.userInfo.osId}/list`).then(res => {
                this.permission = res.data;
            });
        },
        //添加用户
        add_user() {
            if (this.nodeData.children) {
                this.$Message.warning("请选择末级科室");
                return;
            }
            this.$refs["popInfo"].resetFields();
            this.popInfo.disabled = false;
            this.popInfo.popshow = true;
        },
        //修改用户
        amend(node) {
            console.log(node);
            this.userInfo_ = node;
            this.popInfo.disabled = true;
            const { name, osName, phone } = node.row;
            Object.assign(this.popInfo, { name, osName, phone });
            this.popInfo.popshow = true;
            this.popInfo.loginName = node.row.logName;
            this.popInfo.srid = node.row.srId;
        },
        remove(e) {
            confirm({
                title: "提示",
                content: "是否确定删除该用户",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$axios
                        .delete(
                            `users/${this.userInfo.osId}/${this.nodeData.id}/${
                                e.row.id
                            }`
                        )
                        .then(res => {
                            this.$Message.success("用户删除成功");
                            this.formData.splice(e.index, 1);
                        });
                }
            });
        },
        //取消按钮
        cancel() {
            this.popInfo.popshow = false;
            this.$refs["popInfo"].resetFields();
        },
        affirm() {
            //确定按钮
            this.$refs["popInfo"].validate(valid => {
                if (valid) {
                    if (this.popInfo.disabled) {
                        this.$axios
                            .put(
                                `users/${this.userInfo.osId}/${
                                    this.nodeData.id
                                }/${this.userInfo_.row.id}`,
                                {
                                    loginName: this.popInfo.loginName,
                                    loginPwd: this.popInfo.newpw,
                                    name: this.popInfo.name,
                                    roleIds: [this.popInfo.srid],
                                    phone: this.popInfo.phone
                                }
                            )
                            .then(res => {
                                this.$Message.success("用户修改成功");
                                this.getFormData(this.nodeData.id);
                                this.$refs["popInfo"].resetFields();
                                this.popInfo.popshow = false;
                            });
                    } else {
                        this.$axios
                            .post(
                                `users/${this.userInfo.osId}/${
                                    this.nodeData.id
                                }`,
                                {
                                    name: this.popInfo.name,
                                    loginName: this.popInfo.loginName,
                                    loginPwd: this.popInfo.newpw,
                                    roleIds: [this.popInfo.srid],
                                    phone: this.popInfo.phone
                                }
                            )
                            .then(res => {
                                this.$Message.success("用户添加成功");
                                this.getFormData(this.nodeData.id);
                                this.$refs["popInfo"].resetFields();
                                this.popInfo.popshow = false;
                            });
                    }
                }
            });
        }
    }
};
// export default {
//     data() {
//         return {
//             user_in: JSON.parse(localStorage.getItem("user_in")),
//             limit: JSON.parse(localStorage.getItem("limit")),
//             //树状图数据
//             data1: [],
//             //   列表数据
//             columns7: [
//                 {
//                     title: "姓名",
//                     key: "name"
//                 },
//                 {
//                     title: "登录名",
//                     key: "logName"
//                 },
//                 {
//                     title: "所属科室",
//                     key: "osName"
//                 },
//                 {
//                     title: "操作",
//                     key: "action",
//                     width: 150,
//                     align: "center",
//                     render: (h, params) => {
//                         return h("div", [
//                             this.ViewLimit("sys:user:edit")
//                                 ? h(
//                                       "span",
//                                       {
//                                           props: {
//                                               type: "primary",
//                                               size: "small"
//                                           },
//                                           style: {
//                                               marginRight: "5px",
//                                               fontSize: "14px",
//                                               color: "#5ba4c8",
//                                               cursor: "pointer"
//                                           },
//                                           on: {
//                                               click: () => {
//                                                   this.show(params);
//                                               }
//                                           }
//                                       },
//                                       "修改"
//                                   )
//                                 : null,
//                             this.ViewLimit("sys:user:del")
//                                 ? h(
//                                       "span",
//                                       {
//                                           props: {
//                                               type: "error",
//                                               size: "small"
//                                           },
//                                           style: {
//                                               marginRight: "5px",
//                                               fontSize: "14px",
//                                               color: "#5ba4c8",
//                                               cursor: "pointer"
//                                           },
//                                           on: {
//                                               click: () => {
//                                                   this.removes(params);
//                                               }
//                                           }
//                                       },
//                                       "删除"
//                                   )
//                                 : null
//                         ]);
//                     }
//                 }
//             ],
//             data6: [],
//             //弹窗下拉框数据
//             tc_info: {
//                 //弹窗显示
//                 modal1: false,
//                 name: "",
//                 logName: "",
//                 osName: "",
//                 rowId: null,
//                 title: "",
//                 newpw: null,
//                 newpws: null,
//                 loading: true,
//                 permission: null,
//                 srid: null,
//                 disabled: null,
//                 offices: null,
//                 osLevels: null,
//                 clickid: null,
//                 phone: null
//             },
//             //删除框
//             del_info: {
//                 title: "删除用户",
//                 okText: "删除",
//                 name: "是否删除该用户？",
//                 modal2: false
//             },
//             six_tan: {
//                 input_one: {
//                     img: "src/img/close.png",
//                     type: "password"
//                 },
//                 input_two: {
//                     img: "src/img/close.png",
//                     type: "password"
//                 }
//             },
//             del_e: "",
//             select_name: "", //储存点击树状图科室的名字
//             spanshow: false,
//             keys: null
//         };
//     },
//     created() {
//         this.get_os_info();
//         this.get_q();
//     },
//     methods: {
//         //点击修改按钮事件

//         show(e) {
//             this.tc_info.newpw = this.tc_info.newpws = null;
//             let that = this;
//             that.axios
//                 .get(`users/${that.user_in.osId}/${e.row.groupid}/${e.row.id}`)
//                 .then(res => {
//                     this.tc_info.modal1 = true;
//                     let quanx = [];
//                     let pai = res.data.roles;
//                     if (pai.length == 1) {
//                         quanx = pai;
//                     } else if (pai.length > 1) {
//                         quanx = pai.sort((a, b) => {
//                             if (a.srName == "CHIEF") {
//                                 a.srNames = 3;
//                             } else if (a.srName == "ENGINEER") {
//                                 a.srNames = 2;
//                             } else if (a.srName == "DOCTOR") {
//                                 a.srNames = 1;
//                             }
//                             if (b.srName == "CHIEF") {
//                                 b.srNames = 3;
//                             } else if (b.srName == "ENGINEER") {
//                                 b.srNames = 2;
//                             } else if (b.srName == "DOCTOR") {
//                                 b.srNames = 1;
//                             }
//                             return b.srNames - a.srNames;
//                         });
//                     } else if (pai.length == 0) {
//                         quanx = [
//                             {
//                                 id: null
//                             }
//                         ];
//                     }
//                     this.tc_info.disabled = true;
//                     this.tc_info.title = "修改用户"; //回显的标题
//                     this.tc_info.name = res.data.name; //回显的名字
//                     this.tc_info.loginName = res.data.loginName; //回显的登录名
//                     this.tc_info.groupid = e.row.groupid;
//                     this.tc_info.id = res.data.id;
//                     this.tc_info.srid = quanx[0].id;
//                     this.tc_info.loading = true;
//                     this.tc_info.osName = e.row.osName; //回显的科室名字
//                     this.tc_info.phone = res.data.phone; //回显的手机号名字
//                 })
//                 .catch(error => {});
//         },
//         remove(e) {
//             let that = this;
//             this.axios
//                 .delete(
//                     `users/${that.user_in.osId}/${e.row.groupid}/${e.row.id}`
//                 )
//                 .then(res => {
//                     that.$Message.success("用户删除成功");
//                     this.data6.splice(e.index, 1);
//                 })
//                 .catch(error => {
//                     if (error.code == "403") {
//                         that.$Message.warning("对不起，您没有删除权限");
//                         return;
//                     }
//                     if (error.code == "400") {
//                         that.$Message.warning(error.message);
//                     } else {
//                         that.$Message.warning("对不起，用户删除失败");
//                     }
//                 });
//         },

//         //获取初始化信息
// get_os_info() {
//     let that = this;
//     this.spanshow = true;
//     this.axios
//         .get(`orgstruct/findAllTree/${that.user_in.osId}`, {})
//         .then(res => {
//             let x = res.data;
//             x.expand = true;
//             that.data1 = treeData(x);
//             that.data1[0]["render"] = (h, { root, node, data }) => {
//                 return h(
//                     "span",
//                     {
//                         style: {
//                             display: "inline-block",
//                             width: "100%",
//                             cursor: "pointer",
//                             fontSize: "14px"
//                         },
//                         on: {
//                             click: () => {
//                                 this.select_c([data]);
//                                 this.keys = node.nodeKey;
//                             }
//                         }
//                     },
//                     [
//                         h("span", [
//                             h("Icon", {
//                                 props: {
//                                     type: "android-folder"
//                                 },
//                                 style: {
//                                     fontSize: "16px",
//                                     marginRight: "3px"
//                                     //color:'#459ca2'
//                                 }
//                             }),
//                             h("span", {
//                                 style: {
//                                     padding: "0 8px",
//                                     "border-radius": "3px"
//                                 },
//                                 domProps: {
//                                     innerHTML: data.title
//                                 },
//                                 attrs: {
//                                     class: "ivu-tree-title"
//                                 },
//                                 class: {
//                                     "ivu-tree-title-selected":
//                                         this.keys == data.nodeKey
//                                 }
//                             })
//                         ]),
//                         h("span", {
//                             style: {
//                                 display: "inline-block",
//                                 float: "right",
//                                 marginRight: "32px"
//                             }
//                         })
//                     ]
//                 );
//             };
//             this.spanshow = false;
//         })
//         .catch(error => {
//             if (error.code == 400) {
//                 this.$Message.warning(error.message);
//             } else {
//                 this.$Message.warning("科室信息获取失败,刷新后重试");
//             }
//             this.spanshow = false;
//         });
// },
//         //鼠标点击节点按钮后触发的事件
//         select_c(e) {
//             this.$nextTick(() => {
//                 this.tc_info.clickid = e[0].id;
//                 this.tc_info.offices = e[0].title;
//                 this.tc_info.osLevels = e[0].osLevel;
//                 //console.log(document.querySelector(".scroll_top").scrollHeight);
//                 //console.log(e)
//                 let array = [];
//                 if (e.length == 0) {
//                     //this.$Message.warning('点击失败，请重新点击')
//                     return;
//                 }
//                 this.spanshow = true;
//                 this.axios
//                     .get(`orgstruct/findUsers/${e[0].id}`)
//                     .then(res => {
//                         if (!res.data.length) {
//                             this.$Message.warning("该科室没有成员");
//                             this.data6 = [];
//                             this.spanshow = false;
//                             return;
//                         }
//                         res.data.forEach((item, i) => {
//                             array.push({
//                                 name: item.name,
//                                 logName: item.logName,
//                                 osName: item.osName,
//                                 id: item.id,
//                                 groupid: item.osid,
//                                 phone: item.phone
//                             });
//                         });
//                         this.data6 = array;
//                         this.spanshow = false;
//                     })
//                     .catch(error => {
//                         this.spanshow = false;
//                         this.$Message.warning("科室成员获取失败");
//                     });
//             });
//         },
//         Puser_info() {
//             let that = this;
//             this.tc_info.loading = false;
//             setTimeout(() => {
//                 this.tc_info.loading = true;
//             });
//             if (this.tc_info.name == null || this.tc_info.name.trim() == "") {
//                 this.$Message.warning("请输入姓名");
//                 return;
//             }
//             if (this.tc_info.newpw !== this.tc_info.newpws) {
//                 this.$Message.warning("两次密码输入不一致，请重新输入");
//                 this.tc_info.newpw = this.tc_info.newpws = "";
//                 return;
//             }
//             if (
//                 this.tc_info.loginName == "" ||
//                 this.tc_info.loginName == null
//             ) {
//                 this.$Message.warning("请填写登录名");
//                 return;
//             }
//             if (this.tc_info.loginName.match(/[\x01-\xFF]*/) == false) {
//                 this.$Message.warning("登录名不能为中文");
//                 return;
//             }
//             if (
//                 this.tc_info.srid == null ||
//                 this.tc_info.srid.length == 0 ||
//                 this.tc_info.srid[0] == null
//             ) {
//                 this.$Message.warning("请选择角色信息");
//                 return;
//             }
//             if (this.tc_info.phone == null || this.tc_info.phone == "") {
//                 this.$Message.warning("请输入手机号");
//                 return;
//             }
//             //this.tc_info.loading = false;
//             if (this.tc_info.disabled) {
//                 if (this.tc_info.newpw !== null && this.tc_info.newpw !== "") {
//                     if (!/^(\w){6,20}$/.exec(this.tc_info.newpw)) {
//                         this.$Message.warning(
//                             "密码只能为6-20个字母、数字、下划线"
//                         );
//                         return;
//                     }
//                 }
//                 if (
//                     !/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(
//                         this.tc_info.phone
//                     )
//                 ) {
//                     console.log(this.tc_info.phone);
//                     this.$Message.warning("请输入正确的手机号");
//                     return;
//                 }
//                 that.axios
//                     .put(
//                         `users/${that.user_in.osId}/${that.tc_info.groupid}/${
//                             that.tc_info.id
//                         }`,
//                         {
//                             loginName: that.tc_info.loginName,
//                             loginPwd: that.tc_info.newpw,
//                             name: that.tc_info.name,
//                             roleIds: [that.tc_info.srid],
//                             phone: that.tc_info.phone
//                         }
//                     )
//                     .then(res => {
//                         this.data6[
//                             this.data6.findIndex(e => {
//                                 return e.id == res.data.id;
//                             })
//                         ].name =
//                             res.data.name;
//                         that.tc_info.modal1 = false;
//                         this.$Message.success("用户修改成功");
//                         that.get_os_info();
//                         that.get_q();
//                     })
//                     .catch(error => {
//                         if (error.code == "400") {
//                             this.$Message.warning(error.message);
//                         }
//                     });
//             } else {
//                 if (this.tc_info.newpw == null || this.tc_info.newpw == "") {
//                     this.$Message.warning("请填写密码");
//                     return;
//                 }
//                 if (!/^(\w){6,20}$/.exec(this.tc_info.newpw)) {
//                     this.$Message.warning("密码只能为6-20个字母、数字、下划线");
//                     return;
//                 }
//                 this.add_U();
//             }
//         },
//         //获取角色
//         get_q() {
//             this.axios
//                 .post(`roles/${this.user_in.osId}/list`)
//                 .then(res => {
//                     this.tc_info.permission = res.data;
//                 })
//                 .catch(error => {
//                     if (error.code == 400) {
//                         this.$Message.warning(error.message);
//                     } else {
//                         this.$Message.warning("角色列表获取失败");
//                     }
//                 });
//         },
//         //添加用户
//         add_user() {
//             if (
//                 this.limit.findIndex(e => {
//                     return e.plPermission == "sys:user:add";
//                 }) == -1
//             ) {
//                 that.$Message.warning("对不起您没有权限");
//                 return;
//             }
//             if (
//                 this.tc_info.osLevels == 0 ||
//                 this.tc_info.osLevels == "" ||
//                 this.tc_info.osLevels == undefined ||
//                 this.tc_info.osLevels == null
//             ) {
//                 this.$Message.warning("请选择某个科室在添加用户");
//                 return;
//             }
//             this.tc_info.modal1 = true;
//             this.tc_info.disabled = false;
//             this.tc_info.title = "添加用户";
//             this.tc_info.phone = this.tc_info.name = this.tc_info.loginName = this.tc_info.newpw = this.tc_info.newpws = this.tc_info.srid =
//                 "";
//         },
//         //添加用户接口
//         add_U() {
//             let that = this;
//             this.axios
//                 .post(`users/${that.user_in.osId}/${that.tc_info.clickid}`, {
//                     name: that.tc_info.name,
//                     loginName: that.tc_info.loginName,
//                     loginPwd: that.tc_info.newpw,
//                     roleIds: [that.tc_info.srid],
//                     phone: that.tc_info.phone
//                 })
//                 .then(res => {
//                     that.tc_info.modal1 = false;
//                     console.log(res);
//                     this.data6.unshift({
//                         name: res.data.name,
//                         id: res.data.id,
//                         logName: res.data.loginName,
//                         osName: this.tc_info.offices,
//                         groupid: res.data.groupId,
//                         phone: res.data.phone
//                     });
//                     that.get_os_info();
//                     that.get_q();
//                     this.$Message.success("添加用户成功");
//                 })
//                 .catch(error => {
//                     if (error.code == 400) {
//                         this.$Message.warning(error.message);
//                     } else {
//                         this.$Message.warning("添加用户失败");
//                     }
//                 });
//         },
//         //点击删除跳出删除弹窗
//         removes(e) {
//             if (
//                 this.limit.findIndex(e => {
//                     return e.plPermission == "sys:user:del";
//                 }) == -1
//             ) {
//                 that.$Message.warning("对不起您没有权限");
//                 return;
//             }
//             this.del_info.modal2 = true;
//             this.del_e = e;
//         },
//         //树状数据处理
//         jx(data) {
//             const that = this;
//             if (data instanceof Array) {
//                 var l = new Array();

//                 for (let n in data) {
//                     var each = data[n];

//                     if (each instanceof Object) {
//                         var a = new Object();
//                         a["expand"] = true;
//                         for (let k in each) {
//                             var v = each[k];

//                             if (v instanceof Array) {
//                                 k == "lists"
//                                     ? (a["children"] = that.jx(v))
//                                     : (a[k] = that.jx(v));
//                             } else {
//                                 switch (k) {
//                                     case "id":
//                                         a["id"] = v;
//                                         break;
//                                     case "osName":
//                                         a["title"] = v;
//                                         break;
//                                     case "osLevel":
//                                         a["osLevel"] = v;
//                                         break;
//                                 }
//                                 if (each["expand"] == true) {
//                                     a["expand"] = true;
//                                 } else {
//                                     a["expand"] = false;
//                                 }
//                             }
//                         }
//                         l.push(a);
//                     } else if (each instanceof Array) {
//                         that.jx(each);
//                     } else {
//                         switch (each) {
//                             case "id":
//                                 a["id"] = v;
//                                 break;
//                             case "osName":
//                                 a["title"] = v;
//                                 break;
//                             case "osLevel":
//                                 a["osLevel"] = v;
//                                 break;
//                         }
//                         if (each["expand"] == true) {
//                             a["expand"] = true;
//                         } else {
//                             a["expand"] = false;
//                         }
//                     }
//                 }
//                 return l;
//             } else if (data instanceof Object) {
//                 var a = new Object();
//                 for (let k in data) {
//                     var v = data[k];
//                     if (v instanceof Array) {
//                         k == "lists"
//                             ? (a["children"] = that.jx(v))
//                             : (a[k] = that.jx(v));
//                     } else {
//                         switch (v) {
//                             case "id":
//                                 a["id"] = v;
//                                 break;
//                             case "osName":
//                                 a["title"] = v;
//                                 break;
//                             case "osLevel":
//                                 a["osLevel"] = v;
//                                 break;
//                         }
//                         if (each["expand"] == true) {
//                             a["expand"] = true;
//                         } else {
//                             a["expand"] = false;
//                         }
//                     }
//                 }
//                 return a;
//             } else {
//                 return a;
//             }
//         },
//         //密码明文功能
//         show_ming(e) {
//             if (e == 1) {
//                 this.six_tan.input_one.img = "src/img/open.png";
//                 this.six_tan.input_one.type = "text";
//             } else if (e == 2) {
//                 this.six_tan.input_two.img = "src/img/open.png";
//                 this.six_tan.input_two.type = "text";
//             }
//         },
//         show_mi(e) {
//             if (e == 1) {
//                 this.six_tan.input_one = {
//                     img: "src/img/close.png",
//                     type: "password"
//                 };
//             } else if (e == 2) {
//                 this.six_tan.input_two = {
//                     img: "src/img/close.png",
//                     type: "password"

//                 };
//             }
//         },
//         //iview 树状图图标显示
//         renderContent(h, { root, node, data }) {
//             return h(
//                 "span",
//                 {
//                     style: {
//                         display: "inline-block",
//                         width: "100%",
//                         cursor: "pointer",
//                         fontSize: "14px"
//                     },
//                     on: {
//                         click: () => {
//                             this.select_c([data]);
//                             this.keys = node.nodeKey;
//                         }
//                     }
//                 },
//                 [
//                     h("span", [
//                         h("Icon", {
//                             props: {
//                                 type: "android-folder-open"
//                             },
//                             style: {
//                                 marginRight: "3px",
//                                 fontSize: "16px"
//                                 //color:'#cce2ea'
//                             }
//                         }),
//                         h("span", {
//                             style: {
//                                 padding: "0 8px",
//                                 "border-radius": "3px"
//                             },
//                             domProps: {
//                                 innerHTML: data.title
//                             },
//                             attrs: {
//                                 class: "ivu-tree-title"
//                             },
//                             class: {
//                                 "ivu-tree-title-selected":
//                                     this.keys == data.nodeKey
//                             }
//                         })
//                     ]),
//                     h("span", {
//                         style: {
//                             display: "inline-block",
//                             float: "right",
//                             marginRight: "32px",
//                             fontSize: "14px"
//                             //background:'red'
//                         }
//                     })
//                 ]
//             );
//         }
//     },
//     components: {
//         pop
//     }
// };
</script>

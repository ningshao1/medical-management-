<template>
    <div class='inital_two' style='position:relative;height: 665px;background:#fff;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <!-- 标题 -->
        <div class="two_title">
            <div class='title_content'>
                <div>最后，请给各个科室设置对应用户来完成本次设置操作
                    <span style="color: #999999;">（系统内置默认三种角色：医生、工程师、科长）</span>
                </div>
            </div>
        </div>
        <div class='two_content'>
            <!-- <div class='content_left'>
              <div>
                                  <div class='one_info'>
                    <div class='info_h'>医院全称：</div>
                    <span class='info_z' style='background-color: #f5f6fa;line-height: 50px;'>南京大学医学院附属鼓楼医院</span>
                </div>
               <div class='one_info'>
                    <div class='info_h'>联系人：</div>
                   <div class='one_tu'><input placeholder="请输入软件使用联系人"  class='info_z' type="password"></div>
                </div>
                  <div class='one_info'>
                    <div class='info_h'>联系方式：</div>
                   <div class='one_tu'><input placeholder="请输入软件使用人联系方式（手机或座机号码）" class='info_z' type="text"></div>
                </div>
                    <div class='one_info'>
                    <div class='info_h'>医院地址：</div>
                   <div class='one_tu'><textarea placeholder="请输入医院详细地址" style="height:100px;" class='info_z' type="text"></textarea></div>
                </div>
              </div>
          </div> -->
            <div class='content_right'>
                <div class='c_title'>系统内置科室列表：
                    <span>（点击科室列表可在右侧进行修改或新增操作）</span>
                </div>
                <div class='content_nei'>
                    <div class='nei_left'>
                        <div>
                            <Tree :data="data1" @on-select-change='select_c'></Tree>
                        </div>
                    </div>
                    <div class="nei_right">
                        <Table class='i-table-stripe' border :columns="columns7" :data="data6"></Table>
                        <div class='right_add' @click='show'>
                            <div class="add_block" @click='add_user'>
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
            <Modal :loading='tc_info.loading' v-model="tc_info.modal1" :title="tc_info.title" class-name="six_tan" @on-ok="Puser_info">
                <div>
                    <div class="six_box">
                        <div class="six_z flex_r">
                            <div class="box_h">
                                <div class="h_title">姓名:</div>
                                <input type="text" placeholder="请输入姓名" v-model="tc_info.name">
                            </div>
                            <div class="box_h">
                                <div class="h_title">登录名：</div>
                                <Input type="text" placeholder="请输入登录名" v-model="tc_info.loginName" :disabled='tc_info.disabled'></Input>
                            </div>
                        </div>
                        <div class="six_z flex_r">
                            <div class="box_h">
                                <div class="h_title">密码：</div>
                                <div>
                                    <input :type="six_tan.input_one.type" placeholder="请输入密码" v-model='tc_info.newpw'>
                                    <img @mousedown='show_ming(1)' :src="six_tan.input_one.img" alt="" @mouseup='show_mi(1)'>
                                </div>
                            </div>
                            <div class="box_h">
                                <div class="h_title">确认密码：</div>
                                <div>
                                    <input :type="six_tan.input_two.type" placeholder="请再次输入密码" v-model='tc_info.newpws'>
                                    <img :src="six_tan.input_two.img" alt="" @mousedown='show_ming(2)' @mouseup='show_mi(2)'>
                                </div>
                            </div>
                        </div>

                        <div class='ks_box'>
                            <div class="ks_name">所属科室</div>
                            <div class='ks_block' v-show="tc_info.disabled">{{tc_info.osName}}</div>
                            <div class='ks_block' v-show="!tc_info.disabled">{{tc_info.offices}}</div>

                        </div>
                        <div class='xz_radio'>
                            <div class='xz_jiao'>
                                选择角色：
                            </div>
                            <form action="">
                                <RadioGroup v-model="tc_info.srid">
                                    <Radio v-for='(item,index) in tc_info.permission' :key='index' :label="item.id">{{item.srDesc}}</Radio>
                                </RadioGroup>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>

        <div>
            <span class='one_prv' @click='prv'>
                <span>&lt;&lt;</span>
                <span class='one_right'>上一步</span>
            </span>
            <span class='one_next' @click='down'>
                <span>下一步</span>
                <span class='one_right'>>></span>
            </span>
        </div>
    </div>
</template>
<style  scoped lang="less">
@import "./initalSix.less";
</style>

<script>
export default {
    data() {
        return {
            user_in: JSON.parse(localStorage.getItem("user_in")),

            //树状图数据
            data1: [],
            //   列表数据
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
                    title: "操作",
                    key: "action",
                    width: 150,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
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
                            ),
                            h(
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
                        ]);
                    }
                }
            ],
            data6: [],
            //弹窗下拉框数据
            tc_info: {
                //弹窗显示
                modal1: false,
                name: "",
                logName: "",
                osName: "",
                rowId: null,
                title: "",
                newpw: null,
                newpws: null,
                loading: true,
                permission: null,
                srid: null,
                disabled: null,
                offices: null,
                osLevels: null,
                clickid: null
            },
            six_tan: {
                input_one: {
                    img: "src/img/close.png",
                    type: "password"
                },
                input_two: {
                    img: "src/img/close.png",
                    type: "password"
                }
            }
        };
    },
    created() {
        this.get_os_info();
        this.get_q();
    },
    methods: {
        //点击修改按钮事件
        show(e) {
            let that = this;
            console.log(e);
            that.axios
                .get(
                    `users/${that.user_in.osId}/${e.row.groupid}/${
                        e.row.id
                    }`
                )
                .then(res => {
                    console.log(res);
                    this.tc_info.modal1 = true;
                    let quanx = [];
                    let pai = res.data.roles;
                    if (pai.length == 1) {
                        quanx = pai;
                    } else {
                        quanx = pai.sort((a, b) => {
                            if (a.srName == "CHIEF") {
                                a.srNames = 3;
                            } else if (a.srName == "ENGINEER") {
                                a.srNames = 2;
                            } else if (a.srName == "DOCTOR") {
                                a.srNames = 1;
                            }
                            if (b.srName == "CHIEF") {
                                b.srNames = 3;
                            } else if (b.srName == "ENGINEER") {
                                b.srNames = 2;
                            } else if (b.srName == "DOCTOR") {
                                b.srNames = 1;
                            }
                            return b.srNames - a.srNames;
                        });
                    }
                    this.tc_info.disabled = true;
                    this.tc_info.title = "修改用户";
                    this.tc_info.name = res.data.name;
                    this.tc_info.loginName = res.data.loginName;
                    this.tc_info.groupid = e.row.groupid;
                    this.tc_info.id = res.data.id;
                    this.tc_info.srid = quanx[0].id;
                    this.tc_info.loading = true;
                    this.tc_info.osName = e.row.osName;
                    //this.tc_info.permission=
                    //permission: pro
                    // this.tc_info = {
                    //     modal1: true,
                    //     title: "修改用户",
                    //     name: res.data.name,
                    //     loginName: res.data.loginName,
                    //     groupid: e.row.groupid,
                    //     id: res.data.id,
                    //     srid: quanx[0].id,
                    //     loading: true,
                    //     permission: pro
                    // };
                })
                .catch(error => {});
        },
        remove(e) {
            let that = this;
            this.axios
                .delete(
                    `users/${that.user_in.osId}/${e.row.groupid}/${
                        e.row.id
                    }`
                )
                .then(res => {
                    that.$Message.success("用户删除成功");
                    this.data6.splice(e.index, 1);
                })
                .catch(error => {
                    if (error.code == "403") {
                        that.$Message.error("对不起，您没有删除权限");
                        return;
                    }
                    that.$Message.error("对不起，用户删除失败");
                });
        },

        //获取初始化信息
        get_os_info() {
            let that = this;
            this.$axios
                .get(`orgstruct/findAllTree/${that.user_in.osId}`, {})
                .then(res => {
                    let x = res.data;
                    x.expand = true;
                    that.data1 = that.jx([x]);
                })
        },
        //鼠标点击节点按钮后触发的事件
        select_c(e) {
            this.tc_info.clickid = e[0].id;
            this.tc_info.offices = e[0].title;
            this.tc_info.osLevels = e[0].osLevel;
            //console.log(e)
            let array = [];
            if (e.length == 0) {
                //this.$Message.warning('点击失败，请重新点击')
                return;
            }

            this.axios
                .get(`/orgstruct/findUsers/${e[0].id}`)
                .then(res => {
                    console.log(res);
                    if (!res.data.length) {
                        this.$Message.warning("该科室没有成员");
                        this.data6 = [];
                        return;
                    }
                    res.data.forEach((item, i) => {
                        array.push({
                            name: item.name,
                            logName: item.logName,
                            osName: item.osName,
                            id: item.id,
                            groupid: item.osid
                        });
                    });
                    this.data6 = array;
                })
                .catch(error => {
                    this.$Message.warning("科室成员获取失败");
                });
        },
        Puser_info() {
            let that = this;
            setTimeout(() => {
                that.tc_info.loading = false;
            });
            if (this.tc_info.newpw !== this.tc_info.newpws) {
                this.$Message.warning("两次密码输入不一致，请重新输入");
                this.tc_info.newpw = this.tc_info.newpws = "";
                return;
            }
            if (!/^(\w){6,20}$/.exec(this.tc_info.newpw)) {
                this.$Message.warning("密码只能为6-20个字母、数字、下划线");
                return;
            }
            this.tc_info.loading = false;
            if (this.tc_info.disabled) {
                that.axios
                    .put(
                        `users/${that.user_in.osId}/${
                            that.tc_info.groupid
                        }/${that.tc_info.id}`,
                        {
                            loginName: that.tc_info.loginName,
                            loginPwd: that.tc_info.newpw,
                            name: that.tc_info.name,
                            roleIds: [that.tc_info.srid]
                        }
                    )
                    .then(res => {
                        that.tc_info.modal1 = false;
                        that.get_os_info();
                        that.get_q();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                this.add_U();
            }
        },
        //获取角色
        get_q() {
            this.axios
                .post(`roles/${this.user_in.osId}/list`)
                .then(res => {
                    console.log(res);
                    this.tc_info.permission = res.data;
                })
                .catch(error => {
                    this.$Message.warning("角色列表获取失败");
                });
        },
        //添加用户
        add_user() {
            if (
                this.tc_info.osLevels == 0 ||
                this.tc_info.osLevels == "" ||
                this.tc_info.osLevels == undefined ||
                this.tc_info.osLevels == null
            ) {
                this.$Message.warning("请选择某个科室在添加用户");
                return;
            }
            this.tc_info.modal1 = true;
            this.tc_info.disabled = false;
            this.tc_info.title = "添加用户";
            this.tc_info.name = this.tc_info.loginName = this.tc_info.newpw = this.tc_info.newpws = this.tc_info.srid =
                "";
        },
        //添加用户接口
        add_U() {
            let that = this;
            this.axios
                .post(
                    `users/${that.user_in.osId}/${that.tc_info.clickid}`,
                    {
                        name: that.tc_info.name,
                        loginName: that.tc_info.loginName,
                        loginPwd: that.tc_info.newpw,
                        roleIds: [that.tc_info.srid]
                    }
                )
                .then(res => {
                    that.tc_info.modal1 = false;
                    that.get_os_info();
                    that.get_q();
                })
                .catch(error => {
                    this.$Message.warning("添加用户失败");
                });
        },
        prv() {
            this.$router.push("/initial/five");
        },
        down() {
            this.$router.push("/initial/seven");
        },
        //树状数据处理
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
        //密码明文功能
        show_ming(e) {
            if (e == 1) {
                this.six_tan.input_one.img = "src/img/open.png";
                this.six_tan.input_one.type = "text";
            } else if (e == 2) {
                this.six_tan.input_two.img = "src/img/open.png";
                this.six_tan.input_two.type = "text";
            }
        },
        show_mi(e) {
            if (e == 1) {
                this.six_tan.input_one = {
                    img: "src/img/close.png",
                    type: "password"
                };
            } else if (e == 2) {
                this.six_tan.input_two = {
                    img: "src/img/close.png",
                    type: "password"
                };
            }
        }
    }
};
</script>

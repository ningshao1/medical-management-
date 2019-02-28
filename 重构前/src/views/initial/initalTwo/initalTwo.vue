<template>
    <div class='inital_two' style='position:relative;height: 665px;background:#fff;box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.15);'>
        <!-- 标题 -->
        <div class="two_title">
            <div class='title_content'>
                <div>请继续完善一些信息</div>
            </div>
        </div>
        <div class='two_content'>
            <div class='content_left'>
                <div>
                    <div class='one_info'>
                        <div class='info_h'>医院全称：</div>
                        <span class='info_z' style='background-color: #f5f6fa;line-height: 50px;'>{{hospital_name}}</span>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>联系人：</div>
                        <div class='one_tu'><input placeholder="请输入软件使用联系人" class='info_z' type="text" v-model="os_INFO_.osShortname"></div>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>联系方式：</div>
                        <div class='one_tu'><input placeholder="请输入软件使用人联系方式（手机或座机号码）" class='info_z' type="text" v-model="os_INFO_.osPhone"></div>
                    </div>
                    <div class='one_info'>
                        <div class='info_h'>医院地址：</div>
                        <div class='one_tu'>
                            <textarea placeholder="请输入医院详细地址" style="height:100px;" class='info_z' type="text" v-model="os_INFO_.osAddress"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class='content_right'>
                <div class='c_title'>系统内置科室列表：
                    <span>（点击科室列表可在右侧进行修改或新增操作）</span>
                </div>
                <div class='content_nei'>
                    <div class='nei_left'>
                        <div>
                            <Tree :data="data1"  @on-select-change='select_c'></Tree>
                        </div>
                    </div>
                    <div class="nei_right" style="overflow:auto">
                        <Table class='i-table-stripe' border :columns="columns7" :data="data6"></Table>
                        <div class='right_add' @click='add_ke'>
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
            <Modal v-model="tc_info.modal1" :title="tc_info.title" class-name="two_tan" @on-ok='change_os'>
                <div class='content_t'>
                    <div class='one_info'>
                        <div class='info_h'>科室名称：</div>
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

                </div>

            </Modal>
        </div>

        <div>
            <span class='one_prv' @click="back_">
                <span>&lt;&lt;</span>
                <span class='one_right'>上一步</span>
            </span>
            <span class='one_next' @click='up_'>
                <span>下一步</span>
                <span class='one_right'>>></span>
            </span>
        </div>
    </div>
</template>
<style  scoped lang="less">
@import "./initalTwo.less";
</style>

<script>
export default {
    data() {
        return {
            //树状图数据
            data1: [],
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
                model1: "",
                rowId: null,
                title: ""
            },
            user_in: JSON.parse(localStorage.getItem("user_in")),
            hospital_name: "医院"
        };
    },
    created() {
        this.get_os_info();
        //this.$Message.warning('This is a warning tip');
    },
    methods: {
        //获取机构信息
        get_os_info() {
            let that = this;
            this.axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`, {})
                .then(res => {
                    let x=res.data
                    x.expand=true
                 that.data1=that.jx([x])
                    
                    // let array1 = [];
                    // let y_id;
                    // res.data.forEach((item, i) => {
                    //     if (item.osParentid == -1) {
                    //         this.hospital_name = item.osName;
                    //         y_id = item.id;
                    //         that.os_INFO_.osShortname = item.osShortname;
                    //         that.os_INFO_.osPhone = item.osPhone;
                    //         that.os_INFO_.osAddress = item.osAddress;
                    //         that.os_INFO_.os_id = item.id;
                    //     } else {
                    //         array1.push({
                    //             title: item.osName,
                    //             expand: false,
                    //             id: item.id,
                    //             osLevel: item.osLevel,
                    //             children: []
                    //         });
                    //     }
                    // });
                    // console.log(array1);
                    // this.data1 = [
                    //     {
                    //         title: this.hospital_name,
                    //         id: y_id,
                    //         osLevel: 0,
                    //         loading: false,
                    //         expand: true,
                    //         children: array1
                    //     }
                    // ];
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //返回上一步
        back_() {
            this.$router.push({ path: "/initial/one" });
        },
        //点击树节点触发的事件
        select_c(e) {
            //console.log(e);
            let array = [];
            this.axios.get(`/orgstruct/findAll/${e[0].id}`).then(res => {
                res.data.forEach((item, i) => {
                    array.push({
                        name: item.osName,
                        osLevel: item.osLevel,
                        id: item.id
                    });
                });
                this.data6 = array;
                console.log(array);
            });
        },
        //  //点击修改数据返回给弹窗
        show(e) {
            this.tc_info.modal1 = true;
            this.tc_info.title = "修改科室";
            console.log(e);
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
            this.tc_info.add = false;
        },
        remove(e) {
            console.log(e);
            let that = this;
            this.axios
                .delete(`/orgstruct/${e.row.id}`)
                .then(res => {
                    console.log(res);
                    that.data6.splice(e.index, 1);
                    this.$Message.success("删除成功");
                    that.get_os_info();
                })
                .catch(error => {
                    if (error.code == "400") {
                        this.$Message.warning(error.message);
                    }
                });
        },
        //修改科室名称接口调用
        change_os() {
            const that = this;
            if (this.tc_info.add) {
                this.add_keshi();
            } else {
                this.$axios
                    .put("/orgstruct", {
                        id: that.tc_info.rowId,
                        osName: that.tc_info.ke_name
                    })
                    .then(res => {
                        this.$Message.success("科室信息修改成功");
                        this.get_os_info();
                        this.data6[
                            this.tc_info.rowIndex
                        ].name = this.tc_info.ke_name;
                    })
            }
        },
        //添加科室
        add_ke() {
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
                    add: true
                };
                let max_level = 100000;
                for (let i = 0; i < this.data6.length; i++) {
                    if (max_level > this.data6[i].osLevel) {
                        max_level = this.data6[i].osLevel;
                        this.tc_info.cityList[0].label = this.tc_info.model1 = this.tc_info.cityList[0].value =
                            max_level + 1;
                        this.tc_info.rowId = this.data6[i].id;
                    }
                }
            } else {
                this.$Message.warning("请选择科室在进行添加");
            }
        },
        //添加科室接口调用
        add_keshi() {
            let that = this;
            this.axios
                .post("/orgstruct", {
                    id: this.tc_info.rowId,
                    osName: that.tc_info.ke_name
                })
                .then(res => {
                    console.log(res);
                    that.get_os_info();
                    that.data6 = [];
                    // that.data6.push({
                    //     name: that.tc_info.ke_name,
                    //     osLevel: that.tc_info.model1
                    // });
                })
                .catch(error => {
                    console.log(error);
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
                .then(res => {
                    this.$router.push("/initial/three");
                })
                .catch(error => {
                    this.$Message.warning("机构信息修改失败");
                });
        },
        jx(data) {
            const that=this;
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
                        k == "lists" ? (a["children"] = that.jx(v)) : (a[k] = that.jx(v));
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
        up_() {
            this.xiu_os();
        }
    }
};
</script>

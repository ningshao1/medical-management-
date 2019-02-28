<template>
    <div style="position: relative;">
        <div class="seach-name">
            <Select
                v-model="bandingPhoneFlag"
                style="width:200px;margin-right:8px"
            >
                <Option
                    :value="'null'"
                    :key="null"
                >全部</Option>
                <Option
                    :value="1"
                    :key="1"
                >已绑定设备用户</Option>
                <Option
                    :value="0"
                    :key="0"
                >未绑定设备用户</Option>
            </Select>
            <span
                class="build-title"
                v-if="ViewLimit('sys:user:all')"
            >
                启用账号与设备绑定
            </span>
            <Switch
                size='large'
                v-if="ViewLimit('sys:user:all')"
                v-model="switchData"
                class="kld-Switch"
                @on-change='changeSwitch'
            >
            </Switch>

            <Input
                v-model="SearchKey"
                icon='ios-search'
                placeholder="用户名/手机号"
                class="searchKey-input"
            ></Input>
            <!-- <transition name="slide-up">
                 <div ref='check-asset-list' class="check-asset-list">
                     <ul ref="asset-ul">
                       <li :ref='`asset-li-${i}`' v-for="(item,i) in listData" class="ivu-select-item" :key='i' @click="checkList(item,i)" :class="{'focus-li':i===focusIndex,'click-li':i===clickIndex}">{{item}}</li>
                      </ul>
                     </div>
            </transition> -->
        </div>
        <div class="content-title">
            <h2>用户管理</h2>
            <div class="line"></div>
        </div>
        <div>
            <div
                class='inital_two'
                style='position:relative;height: 665px;background:#fafafa;'
            >
                <div
                    class='two_content'
                    style="padding-top:20px;"
                >
                    <div class='content_right'>
                        <div
                            class='c_title'
                            style="padding: 0 15px;"
                        >科室列表：
                        </div>
                        <div class='content_nei'>
                            <div
                                class='nei_left'
                                ref="el-tree"
                                @scroll="scrollEvent(totalData)"
                            >
                                <div>
                                    <!-- <Tree :data="TreeData" @on-select-change='clickTree' :render="renderContent"></Tree> -->
                                    <div class="section-select">
                                        <Select
                                            clearable
                                            @input="searchChange"
                                            placeholder="请输入科室名称"
                                            filterable
                                            remote
                                            :remote-method="departmentTreeSearch"
                                            :loading="treeSearchLoading"
                                            ref="search-select"
                                        >
                                            <Option
                                                v-for="{label, key} in departmentTreeSearched"
                                                :key="key"
                                                :value="key"
                                            >{{label}}</Option>
                                        </Select>
                                    </div>
                                    <div class="section-tree">
                                        <kld-tree
                                            :data='elTreeData'
                                            highlight-current
                                            ref="kld-tree"
                                            @current-change="clickElTree"
                                            :default-expanded-keys="departmentTreeExpandKeys"
                                            :titleKey='"osName"'
                                            childrenKey='lists'
                                        ></kld-tree>
                                    </div>
                                    <!-- <el-tree :data='elTreeData' :folder="true" @node-click='clickElTree'></el-tree> -->
                                    <div
                                        style="padding-top:30px;position: relative;"
                                        v-if="treeLoading"
                                    >
                                        <Loading></Loading>
                                    </div>
                                </div>
                            </div>
                            <div class="nei_right">
                                <Loading
                                    v-if='spanshow'
                                    class="loading_"
                                ></Loading>
                                <div
                                    style="position: relative;"
                                    class='scroll_top'
                                >
                                    <Table
                                        border
                                        :columns="columns7"
                                        :data="formData"
                                    ></Table>
                                    <div class="user-page">
                                        <Page
                                            @on-change='clickPage'
                                            :current.sync='page.current'
                                            :total='page.total'
                                        ></Page>
                                    </div>
                                    <div
                                        class='right_add'
                                        v-if='ViewLimit("sys:user:add")'
                                    >
                                        <div
                                            class="add_block"
                                            @click='add_user'
                                        >
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
                    <Modal
                        v-model="popInfo.popshow"
                        :title="popInfo.title"
                        class-name="six_tan ivu-modal-wrap"
                    >
                        <div
                            class="info-switch"
                            v-if="ViewLimit('sys:user:single')"
                        >
                            <span class="build-title">
                                启用账号与设备绑定
                            </span>
                            <Switch
                                size='large'
                                v-model="onlyUserSwitchData"
                                class="kld-Switch"
                                @on-change='onlyUserSwitch'
                            >
                            </Switch>
                        </div>
                        <Form
                            ref="popInfo"
                            :model="popInfo"
                            :rules="rulePopInfo"
                        >
                            <div>
                                <div class="six_box addUser_">
                                    <div class="six_z flex_r">
                                        <div class="box_h">
                                            <div class="h_title">姓名：
                                                <span style="color: #f2740c;">*</span>
                                            </div>
                                            <FormItem prop="name">
                                                <Input
                                                    type="text"
                                                    placeholder="请输入姓名"
                                                    v-model="popInfo.name"
                                                    :disabled='popInfo.disabled'
                                                ></Input>
                                            </FormItem>
                                        </div>
                                        <div class="box_h">
                                            <div class="h_title">手机号：
                                                <span style="color: #f2740c;">*</span>
                                            </div>
                                            <div>
                                                <FormItem prop="phone">
                                                    <Input
                                                        @on-blur="examine(1)"
                                                        type="text"
                                                        placeholder="请输入手机号"
                                                        v-model='popInfo.phone'
                                                    ></Input>
                                                </FormItem>
                                            </div>
                                        </div>
                                        <!-- <div class="box_h">
                                            <div class="h_title">登录名：
                                                <span style="color: #f2740c;">*</span>
                                            </div>
                                            <FormItem prop="loginName">
                                                <Input @on-blur='examine(2)' type="text" placeholder="请输入登录名" v-model="popInfo.loginName" :disabled='popInfo.disabled'></Input>
                                            </FormItem>
                                        </div> -->
                                    </div>
                                    <div class="six_z flex_r">
                                        <div class="box_h">
                                            <div class="h_title">
                                                <span v-show='popInfo.disabled==true'>新</span>密码：
                                                <span
                                                    style="color: #f2740c;"
                                                    v-show='popInfo.disabled!==true'
                                                >*</span>
                                            </div>
                                            <div>
                                                <FormItem prop="newpw">
                                                    <Input
                                                        type="password"
                                                        placeholder="请输入密码"
                                                        v-model='popInfo.newpw'
                                                    ></Input>
                                                </FormItem>
                                                <!-- <img @mousedown='show_ming(1)' :src="six_tan.input_one.img" alt="" @mouseup='show_mi(1)'> -->
                                            </div>
                                        </div>
                                        <div class="box_h">
                                            <div class="h_title">确认密码：
                                                <span
                                                    style="color: #f2740c;"
                                                    v-show='popInfo.disabled!==true'
                                                >*</span>
                                            </div>
                                            <div>
                                                <FormItem prop="newpws">
                                                    <Input
                                                        type="password"
                                                        placeholder="请再次输入密码"
                                                        v-model='popInfo.newpws'
                                                    ></Input>
                                                </FormItem>
                                                <!-- <img :src="six_tan.input_two.img" alt="" @mousedown='show_ming(2)' @mouseup='show_mi(2)'> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="six_z flex_r">

                                        <div class="box_h">
                                            <div class="h_title">备注：
                                                <!--<span style="color: #f2740c;">*</span>-->
                                            </div>
                                            <div>
                                                <FormItem prop="memo">
                                                    <Input
                                                        @on-blur="examine(1)"
                                                        type="text"
                                                        placeholder="请输入备注"
                                                        v-model='popInfo.memo'
                                                    ></Input>
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div class="user-position-wrap">
                                            <Checkbox
                                                v-model='userPosition.responsibleType'
                                                @on-change="changeUserPosition($event,'responsibleType')"
                                                :true-value='1'
                                                :false-value='2'
                                                style="width:50%"
                                            >
                                                设为本科室设备负责人
                                            </Checkbox>
                                            <Checkbox
                                                v-model='userPosition.administrationType'
                                                @on-change="changeUserPosition($event,'administrationType')"
                                                :true-value='1'
                                                :false-value='2'
                                                style="width:50%"
                                            >
                                                设为本科室设备管理人
                                            </Checkbox>
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
                                                <Radio
                                                    v-for='(item,index) in permission'
                                                    :key='index'
                                                    :disabled="popInfo.disabled"
                                                    :label="item.id"
                                                >{{item.srDesc}}</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </div>
                                    <div
                                        class="build-asset"
                                        v-if='popInfo.disabled'
                                    >
                                        <span>已绑定设备：</span>
                                        <span>{{mobleModel?mobleModel:'暂无绑定设备'}}</span>
                                        <Button
                                            v-if="mobleModel&&ViewLimit('sys:user:reset')"
                                            class="kld-btn asset-btn"
                                            size='small'
                                            @click="resetBuild"
                                        >设备重置</Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                        <div slot="footer">
                            <div>
                                <Button
                                    @click="cancel"
                                    class='kld-btn-default'
                                >取消</Button>
                                <Button
                                    @click="affirm"
                                    class='kld-btn'
                                >确定</Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import ChangeTreeData from "@common/transformSectionTreeData/index";
import confirm from "@common/kld-confirm/index";
import page from "@common/page/page.vue";
import elTree from "@common/sys-el-tree";
import loading from "@common/loading/loading";
import KldTree from "@common/kld-tree";
import kldConfirm from "@/common/kld-confirm";
class ConfirmBody {
    constructor(
        positionName,
        positionMark,
        positionerNameMark,
        personIdMark,
        status,
        currentUserId,
        currentOsName,
        vm
    ) {
        this.positionName = positionName; //职位名称
        this.positionMark = positionMark; //职位选中状态属性名
        this.personName = vm.userPosition[positionerNameMark]; //当前已任职人名字属性名
        this.personId = vm.userPosition[personIdMark]; //当前已任职人ID属性名
        this.vm = vm; //外部环境
        this.isPicked = status === 1;
        this.currentUserId = currentUserId;
        this.currentOsName = currentOsName;

        this.configStatus = false; //取消 后的状态
    }
    queryConfig() {
        // debugger
        this.vm.userPosition[this.positionMark] = this.configStatus ? 1 : 2;
    }
    getContent() {
        return this.isPosition()
            ? `确认卸任${this.currentOsName}${this.positionName}：${
                  this.personName
              }?`
            : `${this.currentOsName}已有${this.positionName}：${
                  this.personName
              },确认替换？`;
    }
    //修改的是否是任职者
    isPosition() {
        return this.personId === this.currentUserId;
    }
    queryConfirm() {
        kldConfirm({
            title: "提示",
            content: this.getContent(),
            maskClosable: false,
            okText: "是",
            cancelText: "否",
            ok: () => {},
            cancel: () => {
                this.queryConfig();
            },
            closable: false
        });
    }
    queryAnalyse() {
        let isPosition = this.isPosition();
        //修改在任者
        if (isPosition) {
            if (!this.isPicked) {
                //卸任
                this.configStatus = true;
                return true;
            }
            return false;
        }
        //修改非在任者
        if (!this.personId) {
            //无在任者
            return false;
        }
        if (this.isPicked) {
            //任职
            this.configStatus = false;
            return true;
        }
        return false;
    }
}
export default {
    data() {
        return {
            //   listData: ["11", 222, 33],
            //   focusIndex: -1,
            //   clickIndex: -1,
            SearchKey: "",
            page: {
                total: 10,
                current: 1
            },
            userPosition: {
                responsibleType: 2, //1为是2为否//负责人
                administrationType: 2 //管理人
            },
            TreeData: [],
            elTreeData: [],
            treeLoading: false,
            keys: "",
            formData: [],
            columns7: [
                {
                    title: "姓名",
                    key: "name"
                },
                {
                    title: "手机号",
                    key: "phone"
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
                srid: null,
                memo: null
            }, //弹窗信息
            rulePopInfo: {
                name: {
                    required: true,
                    message: "姓名为必填项"
                },
                loginName: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value === "" || value === null) {
                            callback(new Error("登录名为必填项"));
                        } else {
                            if (!value.match(/^[0-9a-zA-Z_]{3,15}$/)) {
                                callback(
                                    new Error(
                                        "登录名只能为3-15个字母、数字、下划线"
                                    )
                                );
                            } else {
                                callback();
                            }
                        }
                    }
                },
                newpw: {
                    validator: (rule, value, callback) => {
                        if (!this.popInfo.disabled) {
                            if (value !== "" && value !== null) {
                                console.log(value.match(/^[\w]{6,12}$/));
                                if (
                                    !value.match(
                                        /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "密码需要大于6位数，要有数字和字母组合而成 "
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            } else {
                                callback(new Error("密码为必填项"));
                            }
                        } else {
                            if (value === null) {
                                callback();
                            } else {
                                if (
                                    !value.match(
                                        /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
                                    )
                                ) {
                                    callback(
                                        new Error(
                                            "密码需要大于6位数，要有数字和字母组合而成 "
                                        )
                                    );
                                } else {
                                    callback();
                                }
                            }
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
                            if (value === null) {
                                callback();
                            } else {
                                if (value !== this.popInfo.newpw) {
                                    callback(new Error("确认密码与新密码不同"));
                                } else {
                                    callback();
                                }
                            }
                        }
                    }
                },
                phone: {
                    validator: (rule, value, callback) => {
                        if (value !== "" && value !== null) {
                            if (
                                !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
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
                // memo: {
                //     required: true,
                //     message: "备注为必选项"
                // }
            },
            totalData: { lists: [] },
            spanshow: false,
            permission: [], //角色列表
            userInfo_: { row: { id: "" } },
            scroll: {
                timer: "", //防抖参数
                number: 0
            },
            switchData: false,
            mobleModel: "",
            onlyUserSwitchData: false,
            bandingPhoneFlag: "null",

            departmentTreeSearched: [],
            treeSearchLoading: false,
            departmentSearchOptions: []
        };
    },
    created() {
        this.getTreeData();
        this.get_q();
        this.getFormData(this.$store.state.user_in.osId);
        this.echoSwitch();
    },
    computed: {
        userInfo() {
            return this.$store.state.user_in;
        },
        departmentTreeExpandKeys() {
            if (this.elTreeData[0]) {
                return [this.elTreeData[0].id];
            }
        }
    },
    methods: {
        departmentTreeSearch(value) {
            if (value === "") {
                this.$refs["search-select"].clearSingleSelect();
            }

            const result = this.$refs["kld-tree"].search(value);

            this.departmentTreeSearched = result.searched;

            this.treeSearchLoading = true;

            this.$nextTick(() => {
                if (value === "") {
                    this.$refs["kld-tree"].setExpand(this.elTreeData[0], true);
                }
                this.treeSearchLoading = false;
            });
        },

        searchChange(value) {
            const {
                $refs: { "kld-tree": $tree }
            } = this;

            if (value) {
                const index = this.departmentTreeSearched.findIndex(
                    ({ key }) => key === value
                );

                $tree.searchSetCurrentNode(index);

                $tree.setCurrentKey(value);
            } else {
                $tree.setCurrentKey(null);
            }
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

        getTreeData() {
            this.treeLoading = true;
            this.$axios
                .get(`orgstruct/findAllTree/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    // this.totalData = JSON.parse(JSON.stringify(data));
                    // if (data.lists instanceof Array && data.lists.length < 30) {
                    //     this.elTreeData = [data];
                    // } else if (
                    //     data.lists instanceof Array &&
                    //     data.lists.length >= 30
                    // ) {
                    //     let temp = JSON.parse(JSON.stringify(data));
                    //     temp.lists = this.partitionData();
                    //     this.elTreeData = [temp];
                    //     console.log(this.totalData);
                    // } else {
                    //     this.elTreeData = [data];
                    // }
                    //this.TreeData = ChangeTreeData(data);
                    this.elTreeData = [data];
                    // console.log(this.elTreeData);
                })
                .finally(() => {
                    this.treeLoading = false;
                });
        },
        scrollEvent(oldData) {
            if (
                oldData.lists instanceof Array &&
                oldData.lists.length >= 30 &&
                this.scroll.number < oldData.lists.length
            ) {
                clearTimeout(this.scroll.timer);
                console.log(oldData);
                this.scroll.timer = setTimeout(() => {
                    var scrollTop = this.$refs["el-tree"].scrollTop; //页面上卷的高度
                    var wholeHeight = this.$refs["el-tree"].scrollHeight; //页面底部到顶部的距离
                    var divHeight = this.$refs["el-tree"].clientHeight; //页面可视区域的高度
                    if (scrollTop + divHeight >= wholeHeight - 50) {
                        this.scroll.number += 30;
                        this.elTreeData[0].lists.push(
                            ...this.partitionData(undefined, this.scroll.number)
                        );
                    }
                }, 300);
            }
        },
        //数据分割方法
        partitionData(oldData = this.totalData, number = 0) {
            return oldData.lists.slice(number, number + 30);
        },
        clickTree([node]) {
            if (node) {
                if (node.id === this.nodeData.id) {
                    this.page.current = 1;
                }
                this.nodeData = node;
                this.popInfo.osName = node.osName;
                this.page.current = 1;
                this.getFormData(node.id);
            }
        },
        clickElTree(node) {
            if (node) {
                if (node.id === this.$store.state.user_in.osId) {
                    let rootNode = this.$refs["kld-tree"].getNode(node.id);
                    this.$nextTick(() => {
                        rootNode.expanded = true;
                    });
                }
                if (node.id === this.nodeData.id) {
                    this.page.current = 1;
                }
                this.nodeData = node;
                this.popInfo.osName = node.osName;
                this.page.current = 1;
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
                            console.log(data);
                            console.log(node);
                            console.log(root);
                            this.clickTree([data]);
                            if (data.children !== undefined) {
                                this.$set(data, "expand", true);
                            }
                            this.keys = node.nodeKey;
                        }
                    }
                },
                [
                    h("span", [
                        h("Icon", {
                            props: {
                                //type: "android-folder"
                                type:
                                    node.nodeKey !== 0
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
                .post(`/orgstruct/getUsersBySectionId/${id}`, {
                    limit: 10,
                    offset: (this.page.current - 1) * 10,
                    params: {
                        keyword: this.SearchKey,
                        bandingPhoneFlag:
                            this.bandingPhoneFlag === "null"
                                ? null
                                : this.bandingPhoneFlag
                    }
                })
                .then(({ data }) => {
                    this.formData = data.data;
                    this.page.total = data.recordsTotal;
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
        //查询科室下用户负责人情况
        queryDepartmentStatus(depId, userId = "none") {
            this.userPosition = {
                responsibleType: 2,
                administrationType: 2
            };
            this.$axios.post(`/users/checkOsId/${depId}`).then(({ data }) => {
                console.log(data);
                if (!data) {
                    this.userPosition = {
                        responsibleType: 2,
                        administrationType: 2
                    };
                    return;
                }
                this.userPosition = {
                    responsibleType: userId === data.responsible ? 1 : 2,
                    administrationType: userId === data.user ? 1 : 2,
                    ...data
                };
            });
        },

        //添加用户
        add_user() {
            if (
                !this.nodeData.id ||
                this.nodeData.id === this.$store.state.user_in.osId
            ) {
                this.$Message.warning("请选择科室");
                return;
            }
            this.userInfo_ = { row: { id: "", osName: this.popInfo.osName } };
            this.$refs["popInfo"].resetFields();
            this.popInfo.title = "添加用户";
            this.popInfo.disabled = false;
            this.queryDepartmentStatus(this.nodeData.id);
            this.popInfo.popshow = true;
        },
        //修改用户
        amend(node) {
            this.popInfo.title = "修改用户信息";
            this.userInfo_ = node;
            this.popInfo.disabled = true;
            const { name, osName, phone, memo } = node.row;
            Object.assign(this.popInfo, { name, osName, phone, memo });
            this.queryDepartmentStatus(node.row.osid, node.row.id); //查询科室下用户负责人情况
            this.popInfo.popshow = true;

            this.popInfo.loginName = node.row.logName;
            this.popInfo.srid = node.row.srId;
            this.onlyUserSwitchData = node.row.bandingPhoneFlag === 1;
            this.mobleModel = node.row.mobleModel;
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

        changeUserPosition(status, type) {
            const {
                row: { id: currentUserId, osName: currentOsName }
            } = this.userInfo_;
            debugger
            const publicData = [status, currentUserId, currentOsName];

            let userTypes = {
                responsibleType: [
                    "负责人",
                    "responsibleType",
                    "responsibleName",
                    "responsible",
                    ...publicData
                ],
                administrationType: [
                    "管理人",
                    "administrationType",
                    "userName",
                    "user",
                    ...publicData
                ]
            };

            let confirmInfo = new ConfirmBody(...userTypes[type], this);
            if (confirmInfo.queryAnalyse()) {
                confirmInfo.queryConfirm();
            }
        },

        affirm() {
            //确定按钮
            this.$refs["popInfo"].validate(valid => {
                if (valid) {
                    if (this.popInfo.disabled) {
                        this.$axios
                            .put(
                                `users/${this.userInfo.osId}/${
                                    this.userInfo_.row.osid
                                }/${this.userInfo_.row.id}/${
                                    this.userPosition.responsibleType
                                }/${this.userPosition.administrationType}`,
                                {
                                    loginName: this.popInfo.phone,
                                    loginPwd: this.popInfo.newpw,
                                    name: this.popInfo.name,
                                    roleIds: [this.popInfo.srid],
                                    phone: this.popInfo.phone,
                                    memo: this.popInfo.memo
                                }
                            )
                            .then(res => {
                                this.$Message.success("用户修改成功");
                                if (this.nodeData.id === undefined) {
                                    this.getFormData(
                                        this.$store.state.user_in.osId
                                    );
                                } else {
                                    this.getFormData(this.nodeData.id);
                                }

                                this.$refs["popInfo"].resetFields();
                                this.popInfo.popshow = false;
                            });
                    } else {
                        this.$axios
                            .post(
                                `users/${this.userInfo.osId}/${
                                    this.nodeData.id
                                }/${this.userPosition.responsibleType}/${
                                    this.userPosition.administrationType
                                }`,
                                {
                                    name: this.popInfo.name,
                                    loginName: this.popInfo.phone,
                                    loginPwd: this.popInfo.newpw,
                                    roleId: this.popInfo.srid,
                                    // roleIds: [this.popInfo.srid],
                                    phone: this.popInfo.phone,
                                    memo: this.popInfo.memo,
                                    bandingPhoneFlag: this.onlyUserSwitchData
                                        ? 1
                                        : 0
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
        },
        //检查手机号是否存在
        examine(judge) {
            let tempObj;
            if (judge === 1) {
                if (this.popInfo.phone === "" || this.popInfo.phone === null) {
                    return;
                }
                tempObj = {
                    phoneNumber: this.popInfo.phone
                };
            } else {
                if (
                    this.popInfo.loginName === "" ||
                    this.popInfo.loginName === null
                ) {
                    return;
                }
                tempObj = {
                    loginName: this.popInfo.loginName
                };
            }
            if (
                this.popInfo.disabled &&
                this.popInfo.phone === this.userInfo_.row.phone
            ) {
                return;
            }
            this.$axios.post(`/users/check`, tempObj).then(({ data }) => {
                if (data === "1") {
                    if (judge === 1) {
                        this.$Message.warning("手机号已存在，请更换");
                    } else {
                        this.$Message.warning("登录账名已存在，请更换");
                    }
                }
            });
        },
        clickPage() {
            if (this.nodeData.id === undefined) {
                this.getFormData(this.$store.state.user_in.osId);
            } else {
                this.getFormData(this.nodeData.id);
            }
        },
        //回显总开关
        echoSwitch() {
            if (!this.checkLimit("sys:user:all")) {
                return;
            }
            this.$axios
                .get(`/banding/queryHospBandingStatus`)
                .then(({ data }) => {
                    if (data - 0 === "1") {
                        this.switchData = false;
                    } else {
                        this.switchData = true;
                    }
                });
        },
        //总开关
        changeSwitch(val) {
            const title = val
                ? "启动账号绑定后，每个账号只能在一台设备上登录，无法进行账号切换，数据更加安全，此项仅在移动端生效，是否启动绑定？"
                : "关闭账号绑定后，所有账号将可以在任意设备上进行登录，可能会造成数据泄露，是否确定取消设备与账号绑定？";

            confirm({
                title: "提示",
                content: title,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$axios
                        .put(`/banding/all`, {
                            hospId: this.userInfo.osId,
                            status: val ? 1 : 0
                        })
                        .then(({ data }) => {
                            if (data === "200") {
                                console.log(this.nodeData);
                                this.$Message.success("修改成功");
                                if (this.nodeData.id === undefined) {
                                    this.getFormData(
                                        this.$store.state.user_in.osId
                                    );
                                } else {
                                    this.getFormData(this.nodeData.id);
                                }
                            }
                        });
                },
                cancel: () => {
                    this.switchData = !val;
                }
            });
        },
        //单独用户开关
        onlyUserSwitch(val) {
            const title = val
                ? "启动账号绑定后，该账号只能在一台设备上登录，无法进行账号切换，数据更加安全，此项仅在移动端生效，是否启动绑定？"
                : "关闭账号绑定后，该账号将可以在任意设备上进行登录，可能会造成数据泄露，是否确定取消设备与账号绑定？";

            confirm({
                title: "提示",
                content: title,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    if (!this.popInfo.disabled) {
                        return;
                    }
                    this.$axios
                        .put(`/banding/part`, {
                            userIds: [this.userInfo_.row.id],
                            status: val ? 1 : 0
                        })
                        .then(({ data }) => {
                            if (data === "200") {
                                this.$Message.success("修改成功");
                                this.userInfo_.row.bandingPhoneFlag = val
                                    ? 1
                                    : 0;
                            }
                        });
                },
                cancel: () => {
                    this.onlyUserSwitchData = !val;
                }
            });
        },
        resetBuild() {
            const title = `设备重置将解锁此账号与当前设备的绑定，是否确定将设备绑定进行重置？`;
            confirm({
                title: "提示",
                content: title,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    this.$axios
                        .put(`/banding/rebanding/${this.userInfo_.row.id}`)
                        .then(({ data }) => {
                            if (data === "200") {
                                this.$Message.success("重置成功");
                                this.userInfo_.row.mobleModel = null;
                                this.mobleModel = null;
                            }
                        });
                },
                cancel: () => {}
            });
        }
    },
    watch: {
        SearchKey() {
            if (this.nodeData.id === undefined) {
                this.getFormData(this.$store.state.user_in.osId);
            } else {
                this.getFormData(this.nodeData.id);
            }
            this.page.current = 1;
        },

        bandingPhoneFlag() {
            this.page.current = 1;
            this.getFormData(this.$store.state.user_in.osId);
        }
    },
    components: {
        [page.name]: page,
        elTree,
        loading,
        [KldTree.name]: KldTree
    }
};
</script>
<style scoped lang='less'>
@import "../../common/addUser/initalSix";
.mode {
    display: flex;
    margin: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
        width: 49%;
        margin-bottom: 10px;
        p {
            font-size: 14px;
            margin-bottom: 20px;
            color: #000000;
            span {
                color: #f2740c;
            }
        }
        .pass {
            position: relative;
            img {
                position: absolute;
                right: 22px;
                top: 16px;
            }
        }
        input {
            height: 50px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.2);
            padding-left: 20px;
            &:disabled {
                background-color: #f5f6fa;
            }
        }
    }
}
.administration-content {
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
            font-size: 14px;
            font-weight: normal;
            color: #333333;
            height: 55px;
            border-bottom: solid 1px rgba(2, 31, 57, 0.2);
        }
        .search-box {
            margin: 20px 10px 10px;
        }
        .content-list {
            width: 20%;
            border-right: solid 1px rgba(2, 31, 57, 0.2);
        }
        .content-info {
            width: 80%;
            .administration-tab {
                margin: 20px;
                padding: 20px;
                height: 547px;
                background-color: #fafafa;
                border-radius: 3px;
                border: solid 1px #dce0e6;
                .add-administration {
                    height: 40px;
                    background-color: #f5f6fa;
                    border-radius: 2px;
                    border: solid 1px #dcdcdc;
                    font-size: 14px;
                    color: #01b0c7;
                    line-height: 40px;
                    margin-top: 10px;
                    text-align: center;
                    span {
                        cursor: pointer;
                    }
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
.addUser_ {
    .box_h {
        margin-bottom: 10px;
    }
    .user-position-wrap {
        display: flex;
        width: 392px;
        align-items: center;
        /deep/.ivu-checkbox-wrapper {
            font-size: 14px;
        }
    }
}
.user-page {
    text-align: center;
    padding: 8px 0;
    padding-top: 12px;
}
.seach-name {
    position: absolute;
    width: 80%;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    > .build-title {
        //width: 200px;
        margin: 0 8px;
    }
    .kld-Switch {
        width: 60px;
        // margin: 0 10px;
        margin-right: 50px;
    }
    .searchKey-input {
        max-width: 250px;
    }
}
.check-asset-list {
    position: absolute;
    top: 100%;
    opacity: 1;
    background: #fff;
    width: 100%;
    z-index: 1;
    border: 1px solid #e2e2e2;
    > ul {
        max-height: 200px;
        overflow: auto;
        li:not(.click-li) {
            &:hover {
                background: #f3f3f3;
            }
        }
    }
}
.focus-li {
    background: #f3f3f3;
}
.click-li {
    color: #fff;
    background: rgba(45, 140, 240, 0.9);
}
.build-asset {
    padding: 10px 0;
    font-size: 13px;
}
.info-switch {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .build-title {
        margin-right: 10px;
    }
}
.asset-btn {
    padding: 0 10px;
    height: 35px;
    margin: 0 5px;
}
.section-select {
    padding: 5px 3px;
    padding-right: 8px;
    padding-bottom: 10px;
}
.section-tree {
    overflow: auto;
    height: 550px;
}
</style>
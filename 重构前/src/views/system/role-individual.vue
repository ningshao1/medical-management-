<template>
    <div class="role-manage">
        <div class="title">角色与权限</div>
        <div class="tabs kld-box-effect">
            <div class="tabs-left">
                <div class="tabs-title">角色列表</div>
                <div class="tabs-wrap" :style="{maxHeight: allowAddRole ? '549px' : '590px'}">
                    <div v-for="(role, index) in roleList" @click="roleClick(role)" :key="index" :title="role.srDesc" :class="{active: currentRole === role}" class="tabs-item">
                        <div class="title">{{role.srDesc}}</div>
                        <Icon v-if="allowDelRole && role.isDelete === 0" @click.native.stop="delRole(role)" class="control" type="android-close" size="18"></Icon>
                    </div>
                </div>
                <div v-if="allowAddRole" class="add-role-wrap">
                    <a @click="addRole" href="JavaScript:" class="add-role">新增角色+</a>
                </div>
            </div>
            <div class="tabs-middle-left">
                <div class='tabs-title-wrap'>
                    <div class="tabs-title">
                        <span>用户列表</span>
                    </div>
                    <!-- <div v-if="true" class="associated-user-wrap">
                        <a @click="associatedUser" href="JavaScript:void(0)" class="add-role">关联用户+</a>
                    </div> -->
                </div>
                <div class="user-filter-wrap">
                    <i-input clearable class="user-filter" v-model="nameKeyword" placeholder="输入用户关键字筛选"></i-input>
                </div>
                <Loading v-if="usersLoading"></Loading>
                <div class="tabs-wrap" :style="{maxHeight: allowAddRole ? '549px' : '590px'}">
                    <div v-for="(user, index) in (!nameKeyword?userList:filterUserList)" @click="userClick(user)" :key="user.id||index" :class="{active: currentUserId === user.id}" class="tabs-item">
                        <div class="title">{{user.name}}</div>
                    </div>
                </div>
                <!-- <div class="tabs-wrap" :style="{maxHeight: allowAddRole ? '549px' : '590px'}">
                    <div v-for="(role, index) in roleList" @click="roleClick(role)" :key="index" :title="role.srDesc" :class="{active: currentRole === role}" class="tabs-item">
                        <div class="title">{{role.srDesc}}</div>
                        <Icon v-if="allowDelRole && role.isDelete === 0" @click.native.stop="delRole(role)" class="control" type="android-close" size="18"></Icon>
                    </div>
                </div> -->
            </div>
            <div class="tabs-right">
                <div class="tabs-right-top">
                    <div class="position-title-wrap">
                        <div class="position-title">
                            角色职位
                        </div>
                        <div class="add-position">
                            <Button @click="addPosition" icon="plus-round">
                                新增职位
                            </Button>
                        </div>
                    </div>
                    <div class='position-info'>
                        <div class="position-radio-wrap">

                            <RadioGroup class="position-radio" v-model="currentPosition" @on-change="updatePosition" type='button'>
                                <template v-for="(v,i) of positions">
                                    <Radio class="single-position-wrap" :disabled="!currentUserId" :label='v.id' :key='i'>
                                        {{v.name}}
                                        <Icon class="delete-position-icon" type="close-circled" @click.native.prevent.stop="deletePosition(v)" :key='i' v-if='v.customStatus===1'></Icon>
                                    </Radio>
                                </template>
                            </RadioGroup>
                        </div>
                        <Loading v-if="positionLoading"></Loading>
                    </div>
                </div>
                <div class="tabs-right-left">
                    <div class="tabs-title" v-if="currentUserId">用户权限菜单</div>
                    <div class="tabs-title" v-else>角色权限菜单</div>
                    <div class="tabs-wrap-short permission-tree">
                        <Loading v-if="permissionTreeLoading"></Loading>
                        <Tree :render="permissionTreeRender" :data="permissionTreeData"></Tree>
                    </div>
                </div>
                <div class="tabs-right-right">
                    <div class="tabs-title" v-if="currentUserId">用户权限列表</div>
                    <div class="tabs-title" v-else>角色权限列表</div>
                    <div class="tabs-wrap-custom" style="max-height: 540px;">
                        <table v-if="currentTreeNode && currentTreeNode.noChildren.length > 0" class="permission-table">
                            <thead>
                                <tr>
                                    <th>选择</th>
                                    <th>权限</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(node, index) in currentTreeNode.noChildren" @click="permissionTableRowClick(node)" :key="index">
                                    <td>
                                        <Checkbox class="no-pointer-events" :value="node._checked"></Checkbox>
                                    </td>
                                    <td>{{node.plName}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="allowSubmitPermission" class="submit-btn-wrap">
                        <Button @click="userPermissionSubmit" :loading="submitLoading" class="kld-btn" v-if="currentUserId">保存</Button>
                        <Button @click="rolePermissionSubmit" :loading="submitLoading" class="kld-btn" v-else>保存</Button>
                    </div>
                </div>
            </div>
        </div>

        <Modal v-if="allowAddRole" v-model="addRoleModalShow" class-name="vertical-center-modal" title="新增角色" @on-visible-change="addRoleModalVisibleChange">
            <Form style="margin-bottom: 10px;" :label-width="80" :model="addRoleFormData" ref="add-role-form" class="add-role-modal" :rules="addRoleFormRules">
                <FormItem label="角色名：" prop="srDesc" class="kld-form-item">
                    <i-input @on-keydown.enter="addRoleModalConfirm" ref="add-role-input" v-model.trim="addRoleFormData.srDesc" :maxlength="100" placeholder="请输入角色名" class="kld-input"></i-input>
                </FormItem>
            </Form>
            <div class="add-role-modal-footer" slot="footer">
                <Button @click="addRoleModalCancel" class="kld-btn-default">取消</Button>
                <Button @click="addRoleModalConfirm" class="kld-btn">确认</Button>
            </div>
        </Modal>

        <Modal v-model="addPositionShow" class-name="vertical-center-modal" title="新增职位" @on-visible-change="addPositionModalVisibleChange">
            <Form style="margin-bottom: 10px;" :label-width="90" :model="addPositionFormData" ref="add-position-form" class="add-role-modal" :rules="addPositionFormRules">
                <FormItem label="职位名称：" prop="name" class="kld-form-item">
                    <i-input @on-keydown.enter="addPositionModalConfirm" ref="add-position-input" v-model.trim="addPositionFormData.name" :maxlength="8" placeholder="请输入职位名称" class="kld-input"></i-input>
                </FormItem>
            </Form>
            <div class="add-role-modal-footer" slot="footer">
                <Button @click="addPositionModalCancel" class="kld-btn-default">取消</Button>
                <Button @click="addPositionModalConfirm" class="kld-btn">确认</Button>
            </div>
        </Modal>

    </div>
</template>

<style lang="less" scoped>
@border-style: 1px solid rgba(2, 31, 57, 0.1);
.role-manage {
    > .title {
        font-size: 20px;
        padding-bottom: 14px;
        border-bottom: 1px solid #ccd2d7;
        color: #333;
        margin-bottom: 16px;
    }
}

.tabs {
    display: flex;
    padding: 0;
    color: #333;
    position: relative;
    height: 644px;
    // .tabs-title-wrap{
    //     position: relative;
    //     // .associated-user-wrap{
    //     //     position: absolute;
    //     //     width:100%;
    //     //     height: 100%;
    //     //     top:0;
    //     //     left: 0;
    //     //     padding: 16px;
    //     //     text-align: right;

    //     // }
    // }
    .tabs-title,
    .tabs-item {
        padding: 16px;
        font-size: 14px;
        border-bottom: @border-style;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .control {
            flex-shrink: 0;
            cursor: pointer;
            color: #999;
        }
    }

    .tabs-title {
        font-weight: bold;
    }

    .tabs-item {
        position: relative;
        cursor: pointer;
        &.active {
            color: #01b0c7;
            &:before {
                content: "";
                display: block;
                position: absolute;
                left: 0;
                top: 0;
                border-left: 3px solid;
                height: 100%;
            }
        }
    }

    .tabs-wrap {
        max-height: 590px;
        overflow: auto;
        &-short {
            max-height: 480px;
            overflow: auto;
        }
    }
    .tabs-wrap-custom {
        max-height: 590px;
    }
    @left: 22%;
    @rights-count: 3;
    @rights: (100%-@left) / @rights-count;
    .tabs-left {
        width: @left;
        border-right: @border-style;
        /*.tabs-wrap{*/
        /*max-height: 549px;*/
        /*}*/
    }

    .tabs-middle-left {
        position: relative;
        width: @rights;
        border-right: @border-style;
        .user-filter-wrap {
            .user-filter {
            }
        }
    }
    .tabs-middle {
        width: @rights;
        /*flex-grow: 1;*/
        border-right: @border-style;
    }
    .tabs-right {
        width: @rights*2;
        display: flex;
        flex-wrap: wrap;
        .tabs-right-top {
            width: 100%;
            height: 100px;
            position: relative;
            // display: flex;
            // align-items: center;
            border-bottom: 1px solid rgba(2, 31, 57, 0.1);
            // justify-content: space-between;
            // padding: 0 20px;
            .position-title-wrap {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 5px 20px;
                border-bottom: 1px solid rgba(2, 31, 57, 0.1);
            }
            .position-title {
                width: 56px;
                font-size: 14px;
                font-weight: 700;
                flex-shrink: 0;
            }
            .position-info {
                width: 100%;
                height: calc(~"100% - 42px");
                position: relative;
                .position-radio-wrap {
                    width: 100%;
                    padding: 2px 5px;
                    overflow: auto;
                    margin:10px 0 0 0;
                    .position-radio {
                        white-space: nowrap;
                    }
                }
                .single-position-wrap {
                    display: inline-block;
                    position: relative;
                        padding: 0 20px 0 10px;
                    // padding: 10px ;
                    //     border:1px solid #dddee1;
                    //     border-radius: 4px;
                    .delete-position-icon {
                        // width: 20px;
                        // height: 20px;
                        padding: 3px 1px;
                        font-size: 15px;
                        position: absolute;
                        text-align: right;
                        top: 0;
                        right: 0;
                        cursor: pointer;
                        display: none;
                    }
                    &:hover .delete-position-icon{
                        display: inline-block;
                    }
                }
            }
            .add-position {
            }
        }
        @height: 644px - 100px;
        .tabs-right-left {
            width: 50%;
            height: @height;
            /*flex-grow: 1;*/
            border-right: @border-style;
        }
        .tabs-right-right {
            width: 50%;
            overflow: auto;
            height: @height - 70px;
            border-bottom: 1px solid rgba(2, 31, 57, 0.1);
        }
    }

    .submit-btn-wrap {
        position: absolute;
        height: 50px;
        bottom: 0px;
        right: 10px;
        .kld-btn {
            height: 32px;
        }
    }
}

.add-role-wrap {
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    .add-role {
        color: #9abf9a;
    }
}
.associated-user-wrap {
    // text-align: center;
    // padding: 10px 0;
    font-size: 14px;
    .add-role {
        color: #9abf9a;
    }
}
.add-role-modal-footer {
    text-align: center;
}
.permission-tree {
    padding: 20px;
    position: relative;
}
.permission-table {
    width: 100%;
    font-size: 14px;
    border-collapse: collapse;
    td,
    th {
        padding: 10px 0;
        text-align: center;
        &:first-of-type {
            width: 30%;
        }
        &:last-of-type {
            width: 70%;
        }
    }
    tr {
        cursor: pointer;
        border-bottom: @border-style;
    }
}

/deep/.permission-tree-node-wrap {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 4px;
    border-radius: 3px;
    line-height: 1.2;
    font-size: 0;
    &.selected {
        background-color: #d5e8fc;
    }
    .permission-tree-title {
        padding-left: 8px;
        font-size: 14px;
    }
}
</style>

<script>
import kldConfirm from "@common/kld-confirm";
import testLimit from "@common/test-limit";

const transformTreeData = (data, checked, parentNode) => {
    let result = [];
    for (const node of data) {
        const index = checked.findIndex(({ id }) => id === node.id);

        if ((node._checked = index !== -1)) {
            checked.splice(index, 1);
        }

        node.title = node.plName;
        node.parentNode = parentNode;
        node.children = [];
        node.noChildren = [];

        if (parentNode && node.plType === 2) {
            parentNode.noChildren.push(node);
        } else if (node.child && node.child.length > 0) {
            node.children = transformTreeData(node.child, checked, node);
            result.push(node);
        } else {
            result.push(node);
        }
    }

    return result;
};
export default {
    name: "role-manage",
    data() {
        const user_in = this.$store.state.user_in;

        return {
            submitLoading: false,

            autoCancels: ["预置工作", "折旧报废", "系统管理", "设备调剂"],

            allowAddRole: testLimit("sys:role:add"),
            allowDelRole:  testLimit("sys:role:del"),
            allowSubmitPermission:  testLimit("sys:role:edit"),

            permissionTreeData: [],
            permissionTreeRawData: [],

            roleList: [],
            currentRole: null,

            userList: [],

            currentUserId: null,
            //当前用户权限是否是自定义
            currentUserIsCustom: null,

            currentRolePermission: [],
            currentPosition: null,
            lastPosition:null,
            positions: [],

            customUsers: {},

            currentTreeNode: null,
            permissionTreeLoading: false,
            usersLoading:false,
            positionLoading: false,

            addRoleModalShow: false,
            addPositionShow: false,
            nameKeyword: "",

            addRoleFormData: {
                srDesc: "",
                srType: "1",
                srSort: "0",
                updateId: user_in.id,
                srName: "DOCTOR",
                osId: user_in.osId,
                creatorId: user_in.id
            },
            addPositionFormData: {
                name: ""
            },
            addRoleFormRules: {
                srDesc: [
                    {
                        required: true,
                        message: "角色名为必填",
                        trigger: "change"
                    }
                ]
            },
            addPositionFormRules: {
                name: [
                    {
                        required: true,
                        message: "职位名为必填",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        },
        filterUserList() {
            if (!this.nameKeyword) {
                return [];
            }
            return this.userList.filter(v => {
                return (
                    v.id.match(this.nameKeyword) ||
                    v.name.match(this.nameKeyword)
                );
            });
        }
    },
    watch: {
        currentRole() {
            this.currentTreeNode = null;
        },
        currentUserId() {
            this.currentTreeNode = null;
        },
        currentPosition(newP,oldP){
            this.lastPosition=oldP;
        }
    },
    created() {
        Promise.all([this.getPermissionTree(), this.getRoleList()]).then(() => {
            if (this.permissionTreeData.length === 0) {
                return this.initRoleVisible();
            }
        });
    },
    methods: {
        //获取权限树
        getPermissionTree() {
            return this.$axios.get("/permissions/all").then(({ data }) => {
                // this.permissionTreeData = JSON.parse(JSON.stringify(
                //
                // ));
                this.permissionTreeRawData = data;

                // this.permissionTreeRawData = [{
                //     plName: '菜单权限',
                //     child: data,
                //     expand: true
                // }]
            });
        },

        //获取角色列表
        getRoleList() {
            return this.$axios
                .post(`/roles/${this.user_in.osId}/list`)
                .then(({ data }) => {
                    this.roleList = data;
                })
                .then(this.initRoleVisible);
        },

        //初始化显示的角色
        initRoleVisible() {
            this.getUsers((this.currentRole = this.roleList[0]).id);
            this.getRolePosition((this.currentRole = this.roleList[0]).id);
            return this.getRolePermission(
                (this.currentRole = this.roleList[0]).id
            );
        },

        //获取单个角色的所有权限
        getRolePermission(roleId = this.currentRole.id) {
            this.permissionTreeLoading = true;
            return this.$axios
                .get(`/permissions`, {
                    params: {
                        roleId
                    }
                })
                .then(({ data }) => {
                    this.currentRolePermission = data;
                    this.setRolePermission(data);
                })
                .finally(() => (this.permissionTreeLoading = false));
        },
        //获取单个角色的职位设置
        getRolePosition(roleId = this.currentRole.id) {
            this.positionLoading = true;
            return this.$axios
                .get(`/position/${roleId}`)
                .then(({ data }) => {
                    this.positions = data;
                })
                .finally(() => (this.positionLoading = false));
        },

        //获取单个角色下的用户的职位设置
        getUserPosition(userId = this.currentUserId) {
            this.currentPosition = "";
            this.positionLoading = true;
            this.$axios
                .get(`/users/getPositionByUserId/${userId}`)
                .then(({ data }) => {
                    this.currentPosition = this.positions.find(
                        v => v.id === data.positionId
                    ).id;
                })
                .finally(() => (this.positionLoading = false));
        },
        //获取该角色下所有已关联用户
        getUsers(roleId = this.currentRole.id) {
            this.usersLoading=true;
            this.$axios.get(`/roles/${roleId}`)
                .then(res => {
                    this.userList = res.data || [];
                })
                .finally(()=>{
                    this.usersLoading=false;

                });
        },

        //获取某角色下单个用户的所有权限
        getUserPermission({ userId, permission }) {
            if (permission) {
                this.permissionTreeLoading = true;
                return this.$axios
                    .get(`/permissions/listByUserId?userId=${userId}`)
                    .then(({ data }) => {
                        this.setRolePermission(data);
                    })
                    .finally(res => {
                        this.permissionTreeLoading = false;
                    });
            }
        },

        setRolePermission(permission) {
            if (permission[0] && typeof permission[0] === "string") {
                permission = permission.map(id => ({ id }));
            }
            this.permissionTreeData = transformTreeData(
                JSON.parse(JSON.stringify(this.permissionTreeRawData)),
                JSON.parse(JSON.stringify(permission))
            );
        },

        //角色被点击时
        roleClick(role) {
            if (this.currentRole === role) {
                if (this.currentUserId) {
                    this.getRolePermission(role.id);
                    this.getUsers(role.id);
                }
            }
            this.currentPosition = "";
            this.currentUserId = null;
            if (this.currentRole !== role) {
                this.currentRole = role;
                this.customUsers = {};
                this.getRolePermission(role.id);
                this.getUsers(role.id);
                this.getRolePosition(role.id);
            }
        },
        //用户被点击时
        userClick(user) {
            if (this.currentUserId === user.id) {
                return;
            }
            this.currentUserIsCustom = user.permission;

            if (this.currentUserId) {
                this.saveCustomUsers();
            }

            this.getUserPosition(user.id);
            this.$nextTick(() => {
                // if (!this.currentUserId) {
                //     let contrast = this.contrastRolePermission();
                //     console.log(contrast)
                //     if (
                //         contrast.savePermissionIds.length ||
                //         contrast.deletePermissionIds.length
                //     ) {
                //         this.getUserPermission({ ...user, userId: user.id });

                //         return;
                //     }
                // }
                this.currentUserId = user.id;
                if (this.customUsers[this.currentUserId]) {
                    //判断是否获取过用户权限
                    this.setRolePermission(
                        this.customUsers[this.currentUserId]
                    );
                    return;
                }
                if (this.currentUserIsCustom) {
                    //判断是否是自定义用户

                    this.getUserPermission({ ...user, userId: user.id });
                } else {
                    // console.log(this.currentRolePermission)
                    this.setRolePermission(this.currentRolePermission);
                }
            });
        },
        deletePosition(positionInfo) {
            // event.stopPropagation();
            kldConfirm({
                content: `确认删除职位:${positionInfo.name}？`,
                ok: () => {
                    this.queryDeletePosition(positionInfo);
                }
            });
        },
        queryDeletePosition(positionInfo) {
            this.$axios
                .delete(
                    `/position/deletePosition/${positionInfo.roleId}/${
                        positionInfo.id
                    }`
                )
                .then(res => {
                    // console.log(res.data);
                    this.getRolePosition(positionInfo.roleId).then(res => {
                        this.getUserPosition(this.currentUserId);
                    });
                    this.$Message.success("删除职位成功！");
                });
        },
        //存储customUser信息；
        saveCustomUsers() {
            console.log(this.permissionTreeData);
            let temp = this.getAllCheckedIds(this.permissionTreeData);
            if (this.customUsers[this.currentUserId]) {
                this.customUsers[this.currentUserId] = temp;
            } else {
                // console.log(1)
                this.$set(this.customUsers, this.currentUserId, temp);
                this.$forceUpdate();
            }
        },

        //添加角色按钮
        addRole() {
            this.addRoleModalShow = true;
            this.$nextTick(() => this.$refs["add-role-input"].focus());
        },

        //添加角色用户职位按钮
        addPosition() {
            this.addPositionShow = true;
            this.$nextTick(() => this.$refs["add-position-input"].focus());
        },

        updatePosition(positionId) {
            this.$axios
                .post(`/users/updatePosition`, {
                    id: this.currentUserId,
                    positionId
                })
                .then(
                    res => {
                        this.$Message.success("成功修改用户职位！");
                    },
                    error=>{
                        this.currentPosition=this.lastPosition;
                    }
                )
        },

        // //关联用户按钮
        // associatedUser(){
        //     this.associatedUserModalShow=true;
        // },

        addRoleModalConfirm() {
            this.$refs["add-role-form"].validate(valid => {
                if (valid) {
                    this.$axios
                        .post(
                            `roles/${this.user_in.osId}`,
                            this.addRoleFormData
                        )
                        .then(() => {
                            this.$Message.success("新增角色成功");
                            this.addRoleModalShow = false;
                            this.getRoleList();
                        });
                }
            });
        },
        addRoleModalCancel() {
            this.addRoleModalShow = false;
        },

        addPositionModalConfirm() {
            this.$refs["add-position-form"].validate(valid => {
                if (valid) {
                    this.$axios
                        .post(`/position`, {
                            roleId: this.currentRole.id,
                            name: this.addPositionFormData.name
                        })
                        .then(res => {
                            this.$Message.success("成功新增职位！");
                            this.addPositionShow = false;
                            this.getRolePosition();
                        });
                }
            });
        },
        addPositionModalCancel() {
            this.addPositionShow = false;
        },

        addRoleModalVisibleChange(visible) {
            if (visible) {
                this.$refs["add-role-form"].resetFields();
            }
        },
        addPositionModalVisibleChange(visible) {
            if (visible) {
                this.$refs["add-position-form"].resetFields();
            }
        },

        //删除角色按钮
        delRole({ id }) {
            kldConfirm({
                content: "确认删除此角色",
                ok: () => {
                    this.$axios
                        .delete(`/roles/${this.user_in.osId}/${id}`)
                        .then(() => {
                            this.$Message.success("删除角色成功");
                            this.getRoleList();
                        });
                }
            });
        },

        permissionTableRowClick(row) {
            this.setParentNodeChecked(
                row.parentNode,
                (row._checked = !row._checked)
            );
        },

        setParentNodeChecked(parentNode, value) {
            if (value) {
                this.setParentNodeCheckedTrue(parentNode);
            } else {
                this.setParentNodeCheckedFalse(parentNode);
            }
        },
        setParentNodeCheckedTrue(parentNode) {
            if (parentNode) {
                parentNode._checked = true;
                this.setParentNodeCheckedTrue(parentNode.parentNode);
            }
        },

        setParentNodeCheckedFalse(parentNode) {
            if (parentNode && this.autoCancels.includes(parentNode.title)) {
                const childrenHasChecked = parentNode.children.some(
                        ({ _checked }) => _checked
                    ),
                    noChildrenHasChecked = parentNode.noChildren.some(
                        ({ _checked }) => _checked
                    );
                if (!childrenHasChecked && !noChildrenHasChecked) {
                    parentNode._checked = false;
                    this.setParentNodeCheckedFalse(parentNode.parentNode);
                }
            }
        },

        setChildrenChecked(children, value) {
            if (Array.isArray(children)) {
                for (const item of children) {
                    item._checked = value;
                    this.setChildrenChecked(item.children, value);
                    this.setChildrenChecked(item.noChildren, value);
                }
            }
        },

        //获取所有已选择的权限 返回[...id]
        getAllCheckedIds(data) {
            let result = [];

            for (const {
                _checked: checked,
                id,
                children,
                noChildren
            } of data) {
                if (checked && id) {
                    result.push(id);
                }

                if (children && children.length) {
                    result = result.concat(this.getAllCheckedIds(children));
                }

                if (noChildren && noChildren.length) {
                    result = result.concat(this.getAllCheckedIds(noChildren));
                }
            }

            return result;
        },
        // //角色权限提交
        // rolePermissionSubmit() {
        //     const id = this.currentRole.id,
        //         osId = this.user_in.osId;

        //     this.submitLoading = true;
        //     return this.$axios
        //         .put(`roles/${osId}/${id}`, {
        //             id,
        //             osId,
        //             updateId: this.user_in.id,
        //             permissionIds: this.getAllCheckedIds(
        //                 this.permissionTreeData
        //             )
        //         })
        //         .then(() => {
        //             this.$Message.success("恭喜您，权限修改成功，请重新登录");
        //         })
        //         .finally(() => (this.submitLoading = false));
        // },
        //角色权限提交
        rolePermissionSubmit() {
            this.submitLoading = true;
            // console.log(this.currentRolePermission.map(v => v.id),this.contrastRolePermission());
            return this.$axios
                .put(
                    `/roles/updateRoleAndPermission`,
                    this.contrastRolePermission()
                )
                .then(() => {
                    this.$Message.success("恭喜您，权限修改成功，请重新登录");
                    this.getRolePermission(this.currentRole.id);
                    this.customUsers = {};
                })
                .finally(() => (this.submitLoading = false));
            // return this.$axios
            //     .put(`roles/${osId}/${id}`, {
            //         id,
            //         osId,
            //         updateId: this.user_in.id,
            //         permissionIds: this.getAllCheckedIds(
            //             this.permissionTreeData
            //         )
            //     })
            //     .then(() => {
            //         this.$Message.success("恭喜您，权限修改成功，请重新登录");
            //     })
            //     .finally(() => (this.submitLoading = false));
        },

        contrastRolePermission() {
            let current = this.getAllCheckedIds(this.permissionTreeData),
                origin = this.currentRolePermission.map(v => v.id),
                savePermissionIds = [],
                deletePermissionIds = [];
            current.forEach(C => {
                if (!origin.find(O => O === C)) {
                    savePermissionIds.push(C);
                }
            });
            origin.forEach(O => {
                if (!current.find(C => O === C)) {
                    deletePermissionIds.push(O);
                }
            });
            return {
                savePermissionIds,
                deletePermissionIds,
                roleId: this.currentRole.id
            };
        },
        //用户权限提交
        userPermissionSubmit() {
            this.saveCustomUsers();
            console.log(this.customUsers);
            this.submitLoading = true;
            return this.$axios
                .post(`/users/saveUserPermission`, {
                    userId: Object.keys(this.customUsers),
                    savePermission: this.customUsers
                })
                .then(() => {
                    this.$Message.success("恭喜您，权限修改成功，请重新登录");
                })
                .finally(() => (this.submitLoading = false));
        },

        //权限树render函数
        permissionTreeRender(h, { data }) {
            return h(
                "div",
                {
                    class: `permission-tree-node-wrap ${
                        this.currentTreeNode === data ? "selected" : ""
                    }`,
                    on: {
                        //权限树被点击
                        click: () => {
                            this.currentTreeNode = data;
                            if (data.children.length > 0) {
                                this.$set(data, "expand", !data.expand);
                            }
                        }
                    }
                },
                [
                    h("Checkbox", {
                        props: {
                            value: data._checked,
                            size: "large"
                        },
                        on: {
                            input: value => {
                                data._checked = value;

                                this.setChildrenChecked(data.children, value);
                                this.setChildrenChecked(data.noChildren, value);

                                this.setParentNodeChecked(
                                    data.parentNode,
                                    value
                                );
                            }
                        },
                        nativeOn: {
                            click(event) {
                                event.stopPropagation();
                            }
                        }
                    }),

                    h(
                        "span",
                        {
                            class: "permission-tree-title"
                        },
                        data.title
                    )
                ]
            );
        }
    }
};
</script>
<template>
    <div class="user-management"
         v-load='loading'>
        <div class="tree">
            <p class="title">科室列表</p>
            <el-input class="user-input"
                      placeholder="请输入关键词"></el-input>
            <kld-tree :data='data'
                      :props="defaultProps"
                      nodeKey="id"
                      firstExpand
                      ref='kld-tree'
                      class="kld-tree"
                      v-model="treeId"></kld-tree>
        </div>
        <div class="table">
            <kld-table-wrap @fresh='getTableData'
                            @search-advanced='mergeSearch'
                            :search.sync="search.keyword"
                            class="user-wrap"
                            searchExpanded>
                <template slot="header">
                    <div class="search-header">
                        <el-button size="mini"
                                   @click="addUser">新增用户</el-button>
                        <el-switch v-model="allSwitch"
                                   active-text="启用账号与设备绑定"
                                   v-if='checkLimit("sys:user:all")'
                                   @change='changeAllSwitch'>
                        </el-switch>
                    </div>
                </template>
                <el-form slot="search-advanced"
                         label-width="85px"
                         label-position="left"
                         :model="search">
                    <el-row :gutter="20">
                        <el-col :span="isWidth?8:12">
                            <el-form-item label="绑定情况："
                                          prop="bandingPhoneFlag">
                                <el-select placeholder="请选择"
                                           v-model="search.bandingPhoneFlag">
                                    <el-option :value="null"
                                               label='全部'>
                                    </el-option>
                                    <el-option :value="1"
                                               label='已绑定设备用户'>

                                    </el-option>
                                    <el-option :value="0"
                                               label='未绑定设备用户'>

                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </kld-table-wrap>
            <el-table :data="tableData">
                <el-table-column v-for="col in columns"
                                 :prop="col.key"
                                 :key="col.key"
                                 :label="col.title"
                                 :width="col.width">

                </el-table-column>
                <el-table-column label="操作"
                                 width="150">
                    <template slot-scope='{row,$index}'>
                        <a href="javascript:;"
                           style="margin-right:5px;"
                           @click="alterUser(row,$index)">修改</a>
                        <a href="javascript:;"
                           @click="delUser(row,$index)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="text-right pt-10"
                           :current-page.sync="page.current"
                           :total="page.total"
                           :page-size="page.size"
                           @current-change="getTableData">
            </el-pagination>
        </div>
        <user-dialog :dialogData='userDialoginfo'
                     v-model="showDialog"
                     :osId='dialogOsId'></user-dialog>
    </div>
</template>

<script>
import tree from "@c/KldTree";
import { TableWrap } from "@/components";
import { confirm } from "@/element-ui";
import dialog from "./components/dialog.vue";
export default {
    data() {
        return {
            defaultProps: {
                children: "lists",
                label: "osName"
            },
            tableData: [],
            data: [],
            columns: [
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
                }
            ],
            page: {
                total: 10,
                current: 1,
                size: 10
            },
            search: {
                keyword: null,
                bandingPhoneFlag: null
            },
            loading: false,
            allSwitch: false,
            isWidth: false,
            treeId: null,
            userDialoginfo: {
                id: "",
                name: "",
                loginName: "",
                loginPwd: "",
                verifyPwd: "",
                roleId: "",
                memo: "",
                bandingPhoneFlag: false
            },
            showDialog: false,
            dialogOsId: ""
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.isWidth = document.body.clientWidth > 1920;
        });
    },
    components: {
        [tree.name]: tree,
        [TableWrap.name]: TableWrap,
        [dialog.name]: dialog
    },
    computed: {
        osId() {
            return this.$store.state.userInfo.osId;
        }
    },
    async created() {
        this.echoSwitch();
        await this.getOsData();
        await this.getTableData();
    },
    methods: {
        async getOsData() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.data = [data];
        },
        async getTableData() {
            const params = {
                limit: this.page.size,
                offset: (this.page.current - 1) * this.page.size,
                params: this.search
            };
            try {
                this.loading = true;
                const Id = this.treeId || this.osId;
                const { data } = await this.$axios.post(
                    `/orgstruct/getUsersBySectionId/${Id}`,
                    params
                );
                this.tableData = data.data;
                this.page.total = data.recordsTotal;
            } finally {
                this.loading = false;
            }
        },

        mergeSearch(data) {
            this.getTableData();
        },
        //回显总开关
        async echoSwitch() {
            const { data } = await this.$axios.get(
                `/banding/queryHospBandingStatus`
            );
            this.allSwitch = Number(data) !== 1;
        },
        //总开关
        changeAllSwitch(val) {
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
                            hospId: this.osId,
                            status: val ? 1 : 0
                        })
                        .then(
                            ({ data }) => {
                                if (data === "200") {
                                    this.$message.success("修改成功");
                                    this.getTableData();
                                }
                            },
                            error => {
                                this.allSwitch = !val;
                            }
                        );
                },
                cancel: () => {
                    this.allSwitch = !val;
                }
            });
        },
        addUser() {
            if (!this.treeId) {
                this.$message.warning("请选择科室在进行添加");
                return;
            }
            this.dialogOsId = this.treeId || this.osId;
            this.showDialog = true;
        },
        //修改点击
        alterUser(row, $index) {
            this.dialogOsId = row.osid;
            const userDialoginfo = this.userDialoginfo;
            userDialoginfo.loginName = row.logName;
            userDialoginfo.roleId = row.srId;
            userDialoginfo.osName = row.osName;
            userDialoginfo.bandingPhoneFlag =
                row.bandingPhoneFlag === 1 ? true : false;
            userDialoginfo.id = row.id;
            userDialoginfo.mobleModel = row.mobleModel;
            userDialoginfo.name = row.name;
            this.showDialog = true;
        },
        //删除用户
        delUser(row, $index) {
            console.log(row);
            confirm({
                title: "提示",
                content: "是否确定删除该用户",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: async () => {
                    await this.$axios.delete(
                        `users/${this.osId}/${row.osid}/${row.id}`
                    );
                    this.$message.success("用户删除成功");
                    this.tableData.splice($index, 1);
                }
            });
        }
    },
    watch: {
        "search.keyword"() {
            this.getTableData();
        },
        treeId() {
            this.getTableData();
        }
    }
};
</script>

<style scoped lang="scss">
.user-management {
    background: #fff;
    display: flex;
    .tree {
        padding: 20px;
        width: 300px;
        display: inline-block;
        overflow: hidden;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        .title {
            font-size: 14px;
            font-weight: 600;
            padding-bottom: 10px;
        }
        .user-input {
            padding-bottom: 10px;
        }
    }
    .table {
        width: calc(100% - 300px);
        display: inline-block;
        flex: 1;
        min-width: 0;
        padding: 20px;
    }
    .kld-tree {
        max-height: calc(70vh - 100px);
    }
    .search-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
/deep/.user-wrap {
    .el-input {
        width: 160px !important;
    }
    .kld-table-wrap-header-custom {
        width: calc(100% - 330px);
    }
}
</style>

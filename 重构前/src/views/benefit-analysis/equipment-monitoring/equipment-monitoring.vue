<template>
    <div class='equipment-monitoring-wrap'>
        <div class="search-bar">
            <i-row>
                <i-col :span='5'>
                    <i-input class="kld-input"
                             v-model="search.keyworld"
                             placeholder="请输入设备名称"></i-input>
                </i-col>
            </i-row>

        </div>
        <div class="list-wrap">
            <div class="select-trees-bar">
                <kld-side-tree v-model="search.departmentId"
                               placeholder="科室搜索"
                               show-input
                               :loading='departmentLoading'
                               :props="{label:'osName'}"
                               :data="departmentList"
                               first-expand></kld-side-tree>

            </div>
            <div class="monitoring-equipment-list">
                <template v-if='deviceList.length'>

                    <!-- <template v-for="(device,i) of Array.from({length:50}).fill(deviceList[0])"> -->
                    <template v-for="(device,i) of deviceList">

                        <Card class="monitor-card-wrap"
                              :key='i'
                              @click.native='monitorOnClick(device)'>
                            <p slot="title"
                               class="card-title">
                                <span class="title-content"
                                      v-ellipsis-tooltip="'CT室（本部院区）'">
                                    CT室（本部院区）
                                </span>
                            </p>
                            <div class="card-content">
                                <div v-if="device.status===2"
                                     class="card-content-default card-content-online">

                                    <Icon type="ios-videocam"
                                          class="monitor-icon"></Icon>
                                    <div class="monitor-status">
                                        在线
                                    </div>
                                </div>
                                <div v-else
                                     class="card-content-default card-content-outline">
                                    <Icon type="ios-videocam"
                                          class="monitor-icon"></Icon>
                                    <div class="monitor-status">
                                        离线
                                    </div>
                                </div>

                            </div>

                        </Card>
                    </template>
                </template>
            </div>

        </div>

        <monitor-window :monitorInfo='currentMonitor'
                        :showMonitor.sync="showMonitor"></monitor-window>
    </div>
</template>
<script>
import kldSideTree from "@common/kld-side-tree";
import simpleTable from "@common/simple-table";
import kldPage from "@common/page";
import axios from "@/libs/monitor-axios";
import md5 from "md5";
import uuid from "uuid/v1";
import monitorWindow from "./monitor-window";
export default {
    name: "equipment-monitoring",
    components: { kldSideTree, simpleTable, kldPage, monitorWindow },
    data() {
        return {
            page: {
                current: 1,
                total: 0,
                size: 10
            },
            search: {
                keyworld: "",
                departmentId: this.$store.state.user_in.osId,
                assetTypeId: ""
            },
            departmentList: [],
            assetTypeList: [],
            departmentLoading: true,
            typeLoading: true,
            listLoading: false,
            cancelToken: null,

            deviceList: [],
            currentMonitor: null,
            showMonitor: false
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.monitorInit();
        this.init();
    },
    watch: {
        search: {
            handler(val) {
                this.loadList();
            },
            deep: true
        }
    },
    methods: {
        init() {
            this.loadDepartmentTree();
            this.loadTypeTree();
        },
        async loadDepartmentTree() {
            this.departmentLoading = true;
            try {
                const { data } = await this.$store.dispatch(
                    "loadDepartmentTree"
                );
                this.departmentList = [data];
            } finally {
                this.departmentLoading = false;
            }
        },
        async loadTypeTree() {
            this.typeLoading = false;
            try {
                const { data } = await this.$store.dispatch("loadCountryTree");
                this.assetTypeList = data;
            } finally {
                this.typeLoading = false;
            }
        },
        async loadList(page = 1) {
            if (this.cancelToken) {
                this.cancelToken();
            }
            this.listLoading = true;
            try {
                this.page.current = page;
                let url = "";
                let requestBody = {
                    limit: this.page.size,
                    offset: this.page.size * (this.page.current - 1),
                    params: {}
                };
                let config = {
                    cancelToken: new this.$axios.CancelToken(c => {
                        // executor 函数接收一个 cancel 函数作为参数
                        info.cancelToken = c;
                    })
                };
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(url, requestBody, config);
                this.listData = data;
                this.page.total = recordsTotal;
            } finally {
                this.listLoading = false;
            }
        },

        //摄像头账号初始化
        async monitorInit() {
            this.listLoading = true;
            try {
                //账户登陆
                const {
                    username,
                    access_token,
                    state
                } = await this.$store.dispatch("loginMonitorAccount", {
                    username: "yyg",
                    password: "99999999"
                });

                const {
                    data: { device_info }
                } = await this.getGroupDeviceAction(0, {
                    username,
                    access_token,
                    state
                });
                this.deviceList = device_info;
            } finally {
                this.listLoading = false;
            }
        },

        //获取设备列表
        getGroupDeviceAction(id = 0, { username, access_token, state }) {
            return axios.post(`GetGroupDeviceAction.php`, {
                username,
                access_token,
                state,
                id
            });
        },
        monitorOnClick(row) {
            if(row.status!==2){
                return this.$Message.warning("该监控已离线！")
            }
            this.currentMonitor = row;
            this.showMonitor = true;
        },

        //账号登出
        signOut({ username, access_token, state }) {
            return axios.post(`LoginoutAction.php`, {
                username,
                access_token,
                state
            });
        }
    }
};
</script>
<style lang="less" scoped>
.equipment-monitoring-wrap {
    .wrap-border() {
        border: 1px solid #dddee1;
        border-radius: 3px;
    }
    > .search-bar {
        padding: 20px 20px 5px;
        border-radius: 3px;
        background-color: rgb(250, 250, 250);
        border: 1px solid #dddee1;
        > .ivu-row {
            margin-bottom: 15px;
        }
    }
    > .list-wrap {
        display: flex;
        height: 800px;
        margin-top: 20px;
        @width: 300px;
        @height: 100%;
        @cell: 20px;

        .select-trees-bar {
            .wrap-border();
            height: @height;
            width: @width;
            // .select-trees {
            //     height: 100%;
            //     /deep/.ivu-tabs-content {
            //         @baseHeight: 55px;
            //         @gap: 10px;
            //         height: calc(100% - (@baseHeight + @gap));
            //         margin-top: @gap;
            //     }
            // }
        }
        .monitoring-equipment-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            .wrap-border();
            height: @height;
            padding: 20px 30px;
            width: calc(100% - @width - @cell);
            margin-left: @cell;
            overflow: auto;
            /deep/.monitor-card-wrap {
                cursor: pointer;
                width: 300px;
                margin-bottom: 20px;
                transition: background-color 0.1s linear;
                &:hover {
                    background-color: #e2e2e180;
                }
                .card-title {
                    width: 100%;
                    .title-content {
                        width: 100%;
                        text-align: center;
                        display: inline-block;
                    }
                }
                .card-content {
                    height: 100px;
                    .card-content-default {
                        width: 100%;
                        height: 100%;
                        @online: darken(#19be6b, 10%);
                        @outline: #bbbec4;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        .monitor-icon {
                            font-size: 55px;
                        }
                        .monitor-status {
                            font-size: 12px;
                        }
                        .status-color(@color) {
                            .monitor-icon {
                                color: @color;
                            }
                            .monitor-status {
                                color: @color;
                            }
                        }

                        &.card-content-online {
                            .status-color(@online);
                            &:active {
                                .monitor-icon {
                                    color: darken(@online, 10%);
                                }
                            }
                        }
                        &.card-content-outline {
                            .status-color(@outline);
                        }
                    }
                }
            }
        }
    }
}
</style>



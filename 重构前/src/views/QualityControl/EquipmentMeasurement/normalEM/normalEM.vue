<template>
    <div class="em-wrap container-fluid" id='container-fluid'>
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <Input v-model.trim="search.keyword" placeholder="设备名称" style="width:250px;margin-right:15px;" icon="android-search" />
                    </i-col>
                    <!--<i-col>-->
                    <!--<Select v-model="search.mrType" style="width:250px" placeholder="设备状态">-->
                    <!--<Option v-for="item in state" :value="item.value+''" :key="item.value">{{ item.label }}</Option>-->
                    <!--</Select>-->
                    <!--</i-col>-->
                    <i-col>
                    </i-col>
                    <i-col>
                        <DatePicker :editable="false" @on-change='StartTime' v-model="ShowTime.StartTime" format="yyyy-MM-dd" type="date" placeholder="检测时间" style="width: 250px"></DatePicker>
                    </i-col>
                    <span style="line-height: 44px;">至</span>
                    <i-col>
                        <DatePicker :editable="false" @on-change='EndTime' v-model="ShowTime.EndTime" format="yyyy-MM-dd" type="date" placeholder="检测时间" style="width: 250px"></DatePicker>
                    </i-col>
                    <i-col>
                        <Button class="kld-btn" @click="getList" icon="android-search">检索</Button>
                    </i-col>
                    <!--<i-col>-->
                    <!--<Button class="kld-btn" @click="btnReset" icon="android-search">重置</Button>-->
                    <!--</i-col>-->
                </Row>
            </div>
        </div>
        <div class="ael-list-wrap">
            <!-- 左侧科室树 -->
            <div class="ael-list-tree">
                <kld-search-tree placeholder="科室名称搜索">
                    <kld-tree
                            slot="tree"
                            :current.sync="search.orgstructId"
                            :data="treeData"
                            title-key="osName"
                            children-key="lists"
                            highlight-current
                            first-expanded
                    ></kld-tree>
                </kld-search-tree>
            </div>
            <!-- 右侧列表 -->
            <div class="ael-list">
                <div class="table" v-if="true">
                    <Tabs type="card" @on-click='clickTabs'>
                        <TabPane label="全部">
                            <template v-if="!isLoading">
                                <Table class='i-table-stripe' @on-row-click='RowClick' :columns="listColumns" :data='AllData' :no-data-text="'暂无数据'"></Table>
                            </template>
                            <template v-else>
                                <div style="width:100%;height:500px;position:relative">
                                    <Spin fix>
                                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                            <div :style="{
                                width:'100%',
                                display:'flex',
                                'justify-content':'center'
                            }">
                                <Page style="margin-top:10px;" v-model="page" @on-change='Allpage' :total='page.Allpage.total' :current='page.Allpage.current'></Page>
                            </div>

                        </TabPane>
                        <TabPane label="强检类">
                            <template v-if="!isLoading">
                                <Table class='i-table-stripe' @on-row-click='RowClick' :columns="listColumns" :data='coerceData' :no-data-text="'暂无数据'"></Table>
                            </template>
                            <template v-else>
                                <div style="width:100%;height:500px;position:relative">
                                    <Spin fix>
                                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                            <div :style="{
                                width:'100%',
                                display:'flex',
                                'justify-content':'center'
                            }">
                                <Page style="margin-top:10px;" @on-change='Coercepage' :total='page.Coercepage.total' :current='page.Coercepage.current'></Page>
                            </div>
                        </TabPane>
                        <TabPane label="非强检类">
                            <template v-if="!isLoading">
                                <Table class='i-table-stripe' @on-row-click='RowClick' :columns="listColumns" :data='NoCoerceData' :no-data-text="'暂无数据'"></Table>
                            </template>
                            <template v-else>
                                <div style="width:100%;height:500px;position:relative">
                                    <Spin fix>
                                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                            <div :style="{
                                width:'100%',
                                display:'flex',
                                'justify-content':'center'
                            }">
                                <Page style="margin-top:10px;" @on-change='NoCoercepage' :total='page.NoCoercepage.total' :current='page.NoCoercepage.current'></Page>
                            </div>
                        </TabPane>
                        <TabPane label="院内计量" v-if="false">
                            <template v-if="!isLoading">
                                <Table class='i-table-stripe' @on-row-click='RowClick' :columns="listColumns" :data='HospitalData' :no-data-text="'暂无数据'"></Table>
                            </template>
                            <template v-else>
                                <div style="width:100%;height:500px;position:relative">
                                    <Spin fix>
                                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                            <div :style="{
                                width:'100%',
                                display:'flex',
                                'justify-content':'center'
                            }">
                                <Page style="margin-top:10px;" @on-change='Hospitalpage' :total='page.Hospitalpage.total' :current='page.Hospitalpage.current'></Page>
                            </div>
                        </TabPane>
                        <!-- <TabPane label="未计量">
                            <Table @on-row-click='RowClick' :columns="listColumns" :no-data-text="'暂无数据'"></Table>
                            <div :style="{
                                width:'100%',
                                display:'flex',
                                'justify-content':'center'
                            }">
                                <Page style="margin-top:10px;"></Page>
                            </div>
                        </TabPane> -->
                    </Tabs>

                </div>
                <div class="loading-page" v-else>
                    <Spin fix>
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中</div>
                    </Spin>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import KldTree from '@common/kld-tree';
import KldSearchTree from '@common/kld-search-tree';
export default {
    name:'normal-EM',
    components: {
        KldTree,
        KldSearchTree
    },
    data() {
        return {
            isLoading: true,
            treeData: [], //树的数据
            searchKey: "",
            listColumns: [
                {
                    title: "设备编码",
                    key: "assetCode",
                    render: (h, params) => {
                        return h(
                            "div",
                            {},
                            params.row.assetCode.constructor.name === "String"
                                ? params.row.assetCode.toUpperCase()
                                : ""
                        );
                    }
                },
                {
                    title: "设备名称",
                    key: "assetName"
                },
                {
                    title: "所属科室",
                    key: "osName"
                },
                {
                    title: "计量类型",
                    key: "mtName"
                },

                {
                    title: "上次计量时间",
                    key: "startTime"
                },
                {
                    title: "下次计量时间",
                    key: "nextTime"
                },
                {
                    title: "周期",
                    key: "mtCycle",
                    render: (h, params) => {
                        return h(
                            "div",
                            {},
                            params.row.mtCycle === "" ||
                            params.row.mtCycle === null
                                ? ""
                                : params.row.mtCycle + "月"
                        );
                    }
                }
            ],
            AllData: [], //全部数据
            coerceData: [], //强检数据
            NoCoerceData: [], //非强检数据
            HospitalData: [], //院内数据
            TabsIndex: 0,
            search: {
                keyword: "",
                startTime: "",
                endTime: "",
                orgstructId: "",
                mtType: ""
            },
            ShowTime: {
                startTime: "",
                endTime: ""
            },
            page: {
                Allpage: {
                    current: 1,
                    total: 10
                },
                Coercepage: {
                    current: 1,
                    total: 10
                },
                NoCoercepage: {
                    current: 1,
                    total: 10
                },
                Hospitalpage: {
                    current: 1,
                    total: 10
                }
            }
        };
    },
    created() {
        this.get_os_info();
        this.getList();
    },
    watch: {
        search: {
            handler() {
                if (this.search.endTime != null && this.search.endTime != "") {
                    if (
                        new Date(this.search.endTime) <
                        new Date(this.search.startTime)
                    ) {
                        this.$Message.warning("开始时间不得大于结束时间");
                        return;
                    }
                }
                if (this.TabsIndex == 0) {
                    this.page.Allpage.current = 1;
                } else if (this.TabsIndex == 1) {
                    this.page.Coercepage.current = 1;
                } else if (this.TabsIndex == 2) {
                    this.page.NoCoercepage.current = 1;
                } else if (this.TabsIndex == 3) {
                    this.page.Hospitalpage.current = 1;
                }
                this.isLoading = true;
                this.getList();
            },
            deep: true
        },
        searchKey() {
            this.searchTree();
        }
    },
    methods: {
        //重置按钮
        // btnReset() {
        //     this.search = {
        //         keyword: "",
        //         startTime: "",
        //         endTime: "",
        //         orgstructId: "",
        //         mtType: ""
        //     };
        //     this.ShowTime = {
        //         startTime: "",
        //         endTime: ""
        //     };
        // },
        //获得树节点信息
        getTreeInfo([data]) {
            this.search.orgstructId = data.id;
        },
        //获取树数据
        get_os_info() {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            this.axios
                .get(`orgstruct/findAllTree/${osid}`)
                .then(res => {
                    this.treeData = [res.data];
                })
                .catch(error => {});
        },
        //获取列表
        getList() {
            let params = {
                keyword: this.search.keyword,
                mtType: this.search.mtType + "",
                orgstructId: this.search.orgstructId,
                startTime: this.search.startTime,
                endTime: this.search.endTime,
                type: 0
            };
            let offset = 0;
            if (this.TabsIndex == 0) {
                offset = (this.page.Allpage.current - 1) * 10;
            } else if (this.TabsIndex == 1) {
                offset = (this.page.Coercepage.current - 1) * 10;
            } else if (this.TabsIndex == 2) {
                offset = (this.page.NoCoercepage.current - 1) * 10;
            } else if (this.TabsIndex == 3) {
                offset = (this.page.Hospitalpage.current - 1) * 10;
            }
            this.$axios
                .post(`/measurementTask/listAsset`, {
                    limit: 10,
                    offset: offset,
                    params: {
                        ...params,
                        mtType: params.mtType === "" ? null : params.mtType
                    }
                })
                .then(res => {
                    this.isLoading = false;
                    let temp = res.data.data;
                    if (temp instanceof Array) {
                        temp.map(el => {
                            if (el.mtType == 0) {
                                el.mtName = "强检";
                            } else if (el.mtType == 1) {
                                el.mtName = "非强检";
                            } else if (el.mtType == 2) {
                                el.mtName = "院内计量";
                            }
                        });
                    }
                    //实现按需赋值
                    if (this.TabsIndex == 0) {
                        this.AllData = temp;
                        this.page.Allpage.total = res.data.recordsTotal;
                    } else if (this.TabsIndex == 1) {
                        this.coerceData = temp;
                        this.page.Coercepage.total = res.data.recordsTotal;
                    } else if (this.TabsIndex == 2) {
                        this.NoCoerceData = temp;
                        this.page.NoCoercepage.total = res.data.recordsTotal;
                    } else if (this.TabsIndex == 3) {
                        this.HospitalData = temp;
                        this.page.Hospitalpage.total = res.data.recordsTotal;
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                });
        },
        //点击标签页
        clickTabs(e) {
            this.TabsIndex = e;
            //当标签页内有数据的时候切换tab页不请求
            if (this.TabsIndex == 0) {
                this.search.mtType = "";
                if (this.AllData.length > 0) {
                    return;
                }
            } else if (this.TabsIndex == 1) {
                this.search.mtType = 0;
                if (this.coerceData.length > 0) {
                    return;
                }
            } else if (this.TabsIndex == 2) {
                this.search.mtType = 1;
                if (this.NoCoerceData.length > 0) {
                    return;
                }
            } else if (this.TabsIndex == 3) {
                this.search.mtType = 2;
                if (this.HospitalData.length > 0) {
                    return;
                }
            }
            this.getList();
        },
        //选择时间事件
        StartTime(e) {
            this.search.startTime = e;
        },
        EndTime(e) {
            this.search.endTime = e;
        },
        //------每个标签页的page的事件----------------
        Allpage(e) {
            this.isLoading = true;
            this.page.Allpage.current = e;
            this.getList();
        },
        Coercepage(e) {
            this.isLoading = true;
            this.page.Coercepage.current = e;
            this.getList();
        },
        NoCoercepage(e) {
            this.isLoading = true;
            this.page.NoCoercepage.current = e;
            this.getList();
        },
        Hospitalpage(e) {
            this.isLoading = true;
            this.page.Hospitalpage.current = e;
            this.getList();
        },
        //列表点击事件
        RowClick(e) {
            if (this.ViewLimit("pm:adverseevent:query")) {
                this.$router.push({
                    name: "normalEM-detail",
                    query: {
                        id: e.assetId
                    }
                });
            } else {
                this.$Message.warning("您没有查看权限");
            }
        },
    }
};
</script>

<style lang="less" scoped>
.em-wrap {
    .constraint-search {
        height: 86px;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .ael-list-wrap {
        @wrapWidth: 20.5%;
        @wrapHeight: 882px;
        @wrapSpace: 1%;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .ael-list-tree {
            width: @wrapWidth;
            height: @wrapHeight;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            .select-tree {
                height: @wrapHeight - 57px;
                // background-color:#fafafa;
                overflow: auto;
            }
            .name-search {
                height: 55px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 1px solid #ccd2d7;
            }
            .select-tree {
                width: 90%;
                margin: 0 auto;
            }
        }
        .ael-list {
            width: 100% - @wrapSpace - @wrapWidth;
            height: @wrapHeight;
            position: relative;

            background-color: #fafafa;
            // border-radius: 3px;
            // border: solid 1px rgba(2, 31, 57, 0.1);
            .table {
                width: 100%;
                height: 100%;
            }
            .loading-page {
                width: 100%;
                height: 100%;
                .demo-spin-icon-load {
                    animation: ani-demo-spin 1s linear infinite;
                }
                @keyframes ani-demo-spin {
                    from {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(180deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            }
        }
    }
}
</style>

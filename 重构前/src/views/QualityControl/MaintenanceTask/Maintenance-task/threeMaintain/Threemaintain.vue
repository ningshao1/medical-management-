<template>
    <div class="Maintenance-template-list">
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <Input v-model.trim="keyword" placeholder="关键字/上传人" style="width:300px;margin-right:15px;" icon="android-search" />
                    </i-col>
                    <i-col>
                        <!--<Poptip :width="280" class="section-tree" trigger="click" placement="bottom" v-model="visible">-->
                            <!--<i-input :icon="!visible?'arrow-down-b':'arrow-up-b'" v-model="section_.name" class="kld-input" placeholder="选择科室"></i-input>-->
                            <!--<div slot="content">-->
                                <!--<osTree @on-select-change="selectSection"></osTree>-->
                            <!--</div>-->
                        <!--</Poptip>-->
                        <kld-tree-select
                                style="width: 280px;"
                                v-model="section_.Id"
                                :data="sectionList"
                                title-key="osName"
                                children-key="lists"
                                placeholder="选择科室"
                                filterable
                                clearable
                                first-expanded
                        ></kld-tree-select>
                    </i-col>
                    <i-col>
                        <!--<Poptip :width="280" class="section-tree" trigger="click" placement="bottom" v-model="visible_">-->
                            <!--<i-input :icon="!visible_?'arrow-down-b':'arrow-up-b'" v-model="asset_.name" class="kld-input" placeholder="设备分类"></i-input>-->
                            <!--<div slot="content">-->
                                <!--&lt;!&ndash; <assetTree @on-select-change="selectAsset"></assetTree> &ndash;&gt;-->
                                <!--<Tree :data='treeData' @on-select-change="selectAsset"></Tree>-->
                            <!--</div>-->
                        <!--</Poptip>-->
                        <kld-tree-select
                                style="width: 280px;"
                                v-model="asset_.Id"
                                :data="treeData"
                                title-key="typeName"
                                children-key="lists"
                                placeholder="设备分类"
                                filterable
                                clearable
                        ></kld-tree-select>
                    </i-col>
                    <i-col>
                        <DatePicker :options='startOpt' :value='time.StartTime' :editable="false" @on-change='time.StartTime=$event' format="yyyy-MM-dd" type="date" placeholder="选择开始时间" style="width: 200px"></DatePicker>
                    </i-col>
                    <i-col>
                        <DatePicker :options='endOpt' :value='time.EndTime' :editable="false" @on-change='time.EndTime=$event' format="yyyy-MM-dd" type="date" placeholder="选择结束时间" style="width: 200px"></DatePicker>
                    </i-col>
                    <i-col>
                        <Button class="kld-btn" @click='getList' icon="android-search">检索</Button>
                        <Button class="kld-btn" @click='MainReset'>重置</Button>
                    </i-col>
                </Row>
            </div>
        </div>

        <div class="Maintenance-template-table-wrap kld-box-effect">
            <Loading v-if="isLoading"></Loading>
            <div>
                <table class="Maintenance-template-table table-stripe" style="table-layout:fixed;">
                    <thead>
                        <tr>
                            <th class="textEllipsis" style="width:15%">序号</th>
                            <th class="textEllipsis" style="width:15%">设备名称</th>
                            <th class="textEllipsis" style="width:15%">设备序列号</th>
                            <th style="width:15%">设备信息</th>
                            <th>设备分类</th>
                            <th>所属科室</th>
                            <th>上传人</th>
                            <th>上传时间</th>
                        </tr>
                    </thead>

                    <template v-if='!isLoading'>
                        <tbody>
                            <tr v-for='(item,i) in list' :key='i' @click="jump(item.assetId)">
                                <td style="width:15%" class="textEllipsis">{{(page.current-1)*10+i+1}}</td>
                                <td style="width:15%">
                                    <p class="textEllipsis" style="color: #0c8399;">{{item.assetName}}</p>
                                </td>
                                <td style="width:15%" class="textEllipsis">{{item.assetSN}}</td>
                                <td>
                                    <div>
                                        <span>型号：</span>
                                        <span>{{item.assetClass}}</span>
                                    </div>
                                    <div>
                                        <span>品牌：</span>
                                        <span>{{item.brandName}}</span>
                                    </div>
                                </td>
                                <td>{{item.assetTypeName}}</td>
                                <td>{{item.departmentName}}</td>
                                <td>{{item.uploadName}}</td>
                                <td>{{item.uploadTime}}</td>
                            </tr>
                            <tr v-if='list.length<=0'>
                                <td colspan="24">暂无信息</td>
                            </tr>
                        </tbody>
                    </template>
                    <!-- loading -->
                </table>
                <div class="table-page">
                    <kld-page :current.sync="page.current" :total="page.total" :page-size="10" @on-change='changePage'></kld-page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import kldPage from "../../../../../common/page/page.vue";
    import osTree from "@common/section-tree/kld-tree.vue";
    import poptipShowInfo from "@common/poptip-show-info";
    import KldTreeSelect from '@common/kld-tree-select';

    export default {
    components: {
        kldPage,
        osTree,
        KldTreeSelect,
        poptipShowInfo
    },
    data() {
        return {
            sectionList: [],
            treeData: [],
            isLoading: true,
            page: {
                current: 1,
                total: 10
            },
            section_: {
                //检索的科室信息
                name: null,
                Id: null
            },
            asset_: {
                //检索的科室信息
                name: null,
                Id: null
            },
            //搜索时间
            time: {
                StartTime: null,
                EndTime: null
            },
            ShowTime: {
                StartTime: "",
                EndTime: ""
            },
            keyword: null,
            list: [],
            visible: false,
            visible_: false,
            startOpt: {
                disabledDate: date => {
                    if (
                        this.time.EndTime !== "" &&
                        this.time.EndTime !== null
                    ) {
                        return (
                            date &&
                            date.valueOf() >
                                new Date(this.time.EndTime).valueOf()
                        );
                    }
                }
            },
            endOpt: {
                disabledDate: date => {
                    if (
                        this.time.StartTime !== "" &&
                        this.time.StartTime !== null
                    ) {
                        return (
                            date &&
                            date.valueOf() <
                                new Date(
                                    this.time.StartTime + " 00:00:00"
                                ).valueOf()
                        );
                    }
                }
            }
        };
    },
    created() {
        this.getList();
        this.getTree();
        this.getSection();
    },
    watch: {
        "section_.name"(val) {
            if (val === "") {
                this.section_.Id = null;
            }
        },
        "section_.Id"(val) {
            this.page.current = 1;
            this.getList();
        },
        "asset_.name"(val) {
            if (val === "") {
                this.asset_.Id = null;
            }
        },
        "asset_.Id"(val) {
            this.page.current = 1;
            this.getList();
        },
        time: {
            handler() {
                this.getList();
                this.page.current = 1;
            },
            deep: true
        },
        keyword() {
            this.page.current = 1;
            this.getList();
        }
    },
    methods: {
        getSection() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionList = [data];
                });
        },
        //获取保养列表
        getList() {
            this.$axios
                .post(`/pmMaintenance/getThreeLog`, {
                    limit: 10,
                    offset: (this.page.current - 1) * 10,
                    params: {
                        keyword: this.keyword,
                        departmentId: this.section_.Id,
                        startTime: this.time.StartTime,
                        endTime: this.time.EndTime,
                        typeId: this.asset_.Id
                    }
                })
                .then(res => {
                    this.isLoading = false;
                    this.list = res.data.data;
                    this.page.total = res.data.recordsTotal;
                })
                .catch(error => {
                    this.isLoading = false;
                });
        },
        //选择科室
        selectSection([node]) {
            this.section_.name = node.osName;
            this.section_.Id = node.id;
            this.visible = false;
        },
        //选择设备
        selectAsset([node]) {
            console.log(node);
            this.asset_.name = node.title;
            this.asset_.Id = node.id;
            this.visible_ = false;
        },
        StartTime(e) {
            // let temp = e.split("-").join("") - 0; //时间转换成Number
            // this.time.StartTime = temp;
        },
        EndTime(e) {
            // let temp = e.split("-").join("") - 0;
            // this.time.EndTime = temp;
        },
        //page改变触发
        changePage(e) {
            this.isLoading = true;
            this.page.current = e;
            this.getList();
        },
        MainReset() {
            this.keyword = "";
            this.section_ = {
                name: null,
                Id: null
            };
            this.time = {
                StartTime: null,
                EndTime: null
            };
            this.page.current = 1;
            this.asset_ = {
                name: null,
                Id: null
            };
        },
        jump(id) {
            if (this.ViewLimit("pm:three:task:query")) {
                this.$router.push({
                    name: "ThreeMaintenanceDetails",
                    query: { id: id }
                });
            } else {
                this.$Message.warning("您没有权限查看详情！");
            }
        },
        //获取院内分类树
        getTree() {
            this.$axios
                .get('/assetTypes/typeAllTree')
                .then(res => {
                    this.treeData = res.data;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.Maintenance-template-list {
    font-size: 14px;
    .search {
        display: flex;
        .kld-input {
            margin-right: 20px;
            width: 280px;
        }
    }
    .Maintenance-template-table-wrap {
        padding: 0 30px;
        position: relative;
    }
    .Maintenance-template-table {
        width: 100%;
        border-collapse: collapse;
        colgroup {
            col:last-of-type {
                width: 100px;
            }
        }
        tr {
            border-bottom: 1px solid #e2e2e2;
            font-size: 13px;
            color: #666666;
            cursor: pointer;
            th {
                width: 10%;
            }
        }
        td,
        th {
            text-align: left;
            padding: 15px 10px;
            &:last-of-type {
                text-align: center;
            }
        }
    }
    .table-page {
        padding: 30px 0;
        text-align: center;
    }
}
</style>
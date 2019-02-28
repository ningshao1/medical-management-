<template>
    <div class="ael-wrap container-fluid">
        <Button v-if="testLimit('pm:adverseevent:upload')" class="kld-btn report" @click="reportEvent" icon="plus">
            上报不良事件
        </Button>
        <!-- 检索栏 -->
        <div class="constraint-search row">
            <Form :model="searchData" ref="search-form">
                <Row type="flex" :gutter="20">
                    <i-col>
                        <FormItem prop="aeConseQuence">
                            <Select v-model="searchData.aeConseQuence" class="kld-select" placeholder="事件后果">
                                <Option :value="''">全部</Option>
                                <Option :value="1">死亡</Option>
                                <Option :value="2">危及生命</Option>
                                <Option :value="3">机体功能结构永久性损伤</Option>
                                <Option :value="4">可能导致机体功能机构永久性损伤</Option>
                                <Option :value="5">需要内、外科治疗避免上述永久损伤</Option>
                                <Option :value="6">其它</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <FormItem prop="aeReportStatus">
                            <Select v-model="searchData.aeReportStatus" class="kld-select" placeholder="事件报告状态">
                                <Option :value="''">全部</Option>
                                <Option :value="1">已通知使用单位</Option>
                                <Option :value="2">已通知生产企业</Option>
                                <Option :value="3">已通知经营企业</Option>
                                <Option :value="4">已通知药监部门</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col>
                        <Row>
                            <i-col span="11">
                                <FormItem prop="startTime">
                                    <DatePicker :editable="false" :value="searchData.startTime" @on-change="searchData.startTime = $event" class="kld-date-picker" type="date" placeholder="上报时间开始"></DatePicker>
                                </FormItem>
                            </i-col>
                            <i-col span="2" style="text-align: center; line-height: 44px;">
                                至
                            </i-col>
                            <i-col span="11">
                                <FormItem prop="endTime">
                                    <DatePicker :editable="false" :value="searchData.endTime" @on-change="searchData.endTime = $event" class="kld-date-picker" type="date" placeholder="上报时间结束"></DatePicker>
                                </FormItem>
                            </i-col>
                        </Row>
                    </i-col>
                    <i-col>
                        <Button @click="startSearch" class="kld-btn doSearch" icon="android-search">检索</Button>
                        <Button @click="resetSearch" class="kld-btn-default" style="margin-left: 6px;">重置</Button>
                    </i-col>
                </Row>
            </Form>
        </div>

        <div class="ael-list-wrap">
            <!-- 左侧科室树 -->
            <div class="ael-list-tree kld-box-effect">
                <!--<i-input @input="startSearchTree" class="kld-input" icon="ios-search-strong" placeholder="设备分类搜索"></i-input>-->
                <!--<Tree @on-selected="sectionTreeClick" :data="treeData" ref="section-tree"></Tree>-->
                <kld-search-tree placeholder="分类名称搜索">
                    <kld-tree
                            slot="tree"
                            :current.sync="searchData.assertTypeId"
                            :data="treeData"
                            title-key="typeName"
                            children-key="lists"
                            highlight-current
                    ></kld-tree>
                </kld-search-tree>
            </div>
            <!-- 右侧列表 -->
            <div class="ael-list">
                <div class="table">
                    <Loading v-if="isLoading"></Loading>
                    <Table class='i-table-stripe' @on-row-click='jump' :columns="listColumns" disabled-hover :data="adverseList" :no-data-text="'暂无不良事件'"></Table>
                    <div class="table-page">
                        <Page :current.sync="pageData.current" :page-size="pageData.pageSize" :total="pageData.total" @on-change="pageChange"></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/jsx">
    import Page from "@common/page/page";
    import testLimit from '@common/test-limit';
    import moment from 'moment';
    import KldTree from '@common/kld-tree';
    import KldSearchTree from '@common/kld-search-tree';

    export default {
    data() {
        return {
            isLoading: true,
            adverseList: [],
            listColumns: [
                {
                    title: "设备编码",
                    key: "assetCode",
                    render: (h, {row: {assetCode}}) => <p class="text-uppercase">{assetCode}</p>
                },
                {
                    title:'设备名称',
                    key:'assetName',
                    render:(h,params) => {
                        return h('span',{
                            style: {
                                "font-size": "14px",
                                "color": "#0c8399",
                            }
                        }, params.row[params.column.key])
                    }
                },
                {
                    title: "设备型号",
                    key: "assetClass"
                },
                {
                    title: "设备分类",
                    key: "typeName"
                },
                {
                    title: "所属科室",
                    key: "osName"
                },
                {
                    title: "上报人",
                    key: "creatorName"
                },
                {
                    title: "上报时间",
                    key: "aeReportDate"
                }
            ],
            treeData: [],
            treeDataCache: [],

            searchStartTime: "",
            searchEndTime: "",

            searchTreeValue: "",
            searchData: {
                aeConseQuence: "",
                aeReportStatus: "",
                startTime: "",
                endTime: "",
                assertTypeId: ""
            },
            pageData: {
                current: 1,
                pageSize: 10,
                total: 0
            },

            allowDetails: testLimit('pm:adverseevent:query'),

            treeLastNode: null
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    watch: {
        searchData: {
            deep: true,
            handler() {

                this.validSearchTime() && this.startSearch();
            }
        }
    },
    created() {
        this.getAdverseList();
        this.getAssetType();
    },
    methods: {
        getAdverseList() {
            const data = {
                offset: (this.pageData.current - 1) * 10,
                limit: this.pageData.pageSize,
                params: this.searchData
            };

            return this.$axios
                .post(`/adverseEvent/${this.user_in.osId}/list`, data)
                .then(({ data: { recordsTotal, data } }) => {
                    this.isLoading = false;
                    this.pageData.total = recordsTotal;
                    this.adverseList = data;
                })
                .catch(error => {
                    this.isLoading = false;
                });
        },

        getAssetType() {
            this.$axios
                .get('/assetTypes/typeAllTree')
                .then(({ data }) => {
                    this.treeData = data;
                });
        },

        //分页变化时
        pageChange() {
            this.isLoading = true;
            this.getAdverseList();
        },

        //开始搜索
        startSearch() {
            this.isLoading = true;
            this.pageData.current = 1;
            this.getAdverseList();
        },

        resetSearch() {
            this.$refs['search-form'].resetFields();
            this.searchData.assertTypeId = "";
        },
        //验证搜索时间
        validSearchTime() {
            let {startTime, endTime} = this.searchData;
            if (startTime && endTime) {
                startTime = moment(startTime, 'YYYY-MM-DD').toDate().getTime();
                endTime = moment(endTime, 'YYYY-MM-DD').toDate().getTime();

                if (startTime > endTime) {
                    this.$Message.warning('开始时间不能超过结束时间');
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },


        //跳转到上报不良事件
        reportEvent() {
            this.$router.push({ name: "report-adverse-event" });
        },
        //跳转到不良详情
        jump(e) {
            if (this.allowDetails) {
                this.$router.push({
                    name: "adverseEventDetail",
                    query: {
                        id: e.id
                    }
                });
            }
        },

        testLimit
    },
    components: {
        Page,KldTree,KldSearchTree
    }
};
</script>

<style lang="less" scoped>
.ael-wrap {
    position: relative;
    .report {
        position: absolute;
        top: -68px;
        right: 0;
    }
    .constraint-search {
        .kld-select{
            width: 300px;
        }
        .kld-date-picker{
            width: 200px;
        }
    }
    /deep/.ivu-table {
        background-color: transparent;
        th{
            height: 48px;
        }
        td {
            background-color: transparent;
            height: 72px;
        }
    }
    .ael-list-wrap {
        @wrapWidth: 20.5%;
        @wrapHeight: 882px;
        @wrapSpace: 1%;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .ael-list-tree {
            padding: 5px;
            width: @wrapWidth;
            height: @wrapHeight;
            .ivu-tabs-tabpane {
                height: @wrapHeight - 55px;
                background-color: #fafafa;
                overflow: auto;
            }
        }
        .ael-list {
            width: 100% - @wrapSpace - @wrapWidth;
            height: @wrapHeight;
            position: relative;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            .table {
                width: 100%;
                height: 100%;
            }
            .table-page {
                padding: 40px 0;
                text-align: center;
            }
        }
    }
}
</style>

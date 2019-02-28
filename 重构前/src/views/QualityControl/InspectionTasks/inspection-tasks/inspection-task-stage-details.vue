<template>
    <div class="inspection-task-stage-details">
        <ul class="stage-details-header kld-box-effect">
            <li>
                <span class="label-top">执行期数：</span>
                <span class="kld-success">第{{numToLocale(query.periods)}}期</span>
            </li>
            <li>
                <span class="label-top">周期：</span>
                <span class="kld-success">{{query.startTime}} 至 {{query.endTime}}</span>
            </li>
            <li>
                <span class="label-top">执行人：</span>
                <poptip-show-info :info-id="query.executorId">
                    <span class="kld-success">{{query.executorName}}</span>
                </poptip-show-info>
            </li>
            <li>
                <span class="label-top">执行时间段：</span>
                <span class="kld-success">{{query.executeStartTime}} 至 {{query.executeEndTime}}</span>
            </li>
            <li>
                <kld-tag v-if="query.status == 0" type="default">未开始</kld-tag>
                <kld-tag v-else-if="query.status == 1" type="warning">执行中</kld-tag>
                <kld-tag v-else-if="query.status == 2" type="success">已完成</kld-tag>
                <kld-tag v-else-if="query.status == 3" type="purple">未完成</kld-tag>
                <kld-tag v-else-if="query.status == 4" type="error">逾期</kld-tag>
            </li>
        </ul>
        <div class="stage-details-list kld-box-effect">
            <p class="title">所含设备</p>
            <div class="device-wrap">
                <div class="search">
                    <Form :model="searchData">
                        <Row :gutter="20" type="flex">
                            <i-col>
                                <i-input v-model="searchData.assetName" class="kld-input" placeholder="设备名称"></i-input>
                            </i-col>
                            <i-col>
                                <i-input v-model="searchData.assetCode" class="kld-input" placeholder="设备编码"></i-input>
                            </i-col>
                            <i-col>
                                <i-input v-model="searchData.assetClass" class="kld-input" placeholder="设备型号"></i-input>
                            </i-col>
                            <i-col>
                                <Button @click="startSearch" class="kld-btn">检索</Button>
                            </i-col>
                        </Row>
                    </Form>
                </div>
                <div class="list-wrap">
                    <div class="section-list flex-shrink-0">
                        <p class="section-title">科室列表</p>
                        <div class="section-tree">
                            <Tree @on-selected="sectionTreeClick" :data="sectionTree" ref="section-tree"></Tree>
                        </div>
                    </div>
                    <div class="device-list">
                        <kld-table :data="deviceList" :columns="tableColumns"></kld-table>
                        <div class="page">
                            <kld-page @on-change="pageChange" :total="pageData.total" :page-size="pageData.pageSize" :current.sync="pageData.current"></kld-page>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal
                v-model="reportModalShow"
                :width="940"
                title="巡检内容详情"
                class-name="vertical-center-modal"
        >
            <div v-if="logTypeList.length > 0" class="report-modal">
                <div class="tabs">
                    <div class="tabs-title">巡检类别</div>
                    <div class="tabs-wrap">
                        <div v-for="(type, index) in logTypeList" :class="{active: currentLogsType === type}" @click="clickLogType(type)" :key="index" class="tabs-item">{{type.name}}</div>
                    </div>
                </div>
                <div v-if="currentLogsType" class="tabs-content">
                    <div v-for="(item, index) in currentLogsType.pmElementTypes" class="report-card" :key="index">
                        <div class="report-title">{{item.lName}} <span class="kld-error">({{item.pmElements.length}}个)</span></div>
                        <ul>
                            <li v-for="(element, index) in item.pmElements" :key="index">
                                <span>{{index + 1}}. {{element.eContent}}</span>
                                <span v-if="element.result == 1" class="kld-success">合格</span>
                                <span v-else-if="element.result == 2" class="kld-error">不合格</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-else style="text-align: center">暂无信息</div>
            <div slot="footer">
                <Button @click="reportModalShow = false" class="kld-btn-default">返回</Button>
            </div>
        </Modal>
    </div>
</template>

<script type="text/jsx">
    import kldTag from '@inspection-common/kld-tag.vue';
    import transformSectionTreeData from '@common/transformSectionTreeData';
    import addTreeEvent from '@inspection-common/add-tree-event';
    import {numberToLocale as numToLocale, tableRenderEllipsis} from '@/utils';
    import {TextEllipsis, KldTable, PoptipShowInfo, KldTree, KldPage} from '@/components';

    export default {
        name: "inspection-task-stage-details",
        components: {
            kldTag,
            KldTree,
            KldPage,
            PoptipShowInfo,
            KldTable
        },
        data() {
            return {
                sectionTree: [],
                reportModalShow: false,
                deviceList: [],
                searchData: {
                    assetName: '',
                    assetClass: '',
                    assetCode: '',
                    sectionId: ''
                },
                pageData: {
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                query: {
                    id: '',
                    status: '',
                    startTime: '',
                    endTime: '',
                    periods: '',
                    executeStartTime: '',
                    executeEndTime: '',
                    executorName: '',
                    sectionIds: ''
                },

                currentLogsType: null,
                logTypeList: []
            };
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            },

            tableColumns() {
                return [
                    {
                        title: '设备名称',
                        render: tableRenderEllipsis('assetName', 'kld-success')
                    },
                    {
                        title: '设备信息',
                        render(h, {row: {assetClass, brandName}}) {
                            return [
                                <TextEllipsis>型号：{assetClass || '--'}</TextEllipsis>,
                                <TextEllipsis>品牌：{brandName}</TextEllipsis>
                            ];
                        }
                    },
                    {
                        title: '设备编码',
                        key: 'assetCode'
                    },
                    {
                        title: '设备分类',
                        render: tableRenderEllipsis('typeName')
                    },
                    {
                        title: '所属科室',
                        render: tableRenderEllipsis('osName')
                    },
                    {
                        title: '过保日期',
                        key: 'assetWarrntyDate'
                    },
                    {
                        title: '操作',
                        render: (h, {row}) => {
                            if (row.status === 1) {
                                return (
                                    <a onClick={() => this.checkLogs(row)} href="javascript:">查看报告</a>
                                );
                            }
                        }
                    }
                ]
            }
        },
        watch: {
            searchData: {
                deep: true,
                handler() {
                    this.pageData.current = 1;
                    this.getDeviceList();
                }
            },
            logTypeList(list) {
                if (list && list.length) {
                    this.currentLogsType = list[0];
                } else {
                    this.currentLogsType = null;
                }
            }
        },
        created() {
            this.query = this.$route.query;
            this.getSectionTree();
            this.getDeviceList();

            this.$nextTick(() => {
                addTreeEvent('section-tree', (node) => {
                    this.searchData.sectionId = node.id;
                }, this);
            });
        },
        methods: {
            getSectionTree() {
                return this.axios.get(`/orgstruct/getTreeByChildren/${this.user_in.osId}?orgIds=${this.query.sectionIds}`)
                    .then(
                        res => {
                            this.sectionTree = this.transformSectionTreeData(res.data);
                        }
                    );
            },

            getDeviceList() {
                const data = {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * 10,
                    params: this.searchData
                };

                return this.$axios.post(`/inspectionSchedule/${this.user_in.osId}/${this.query.id}/listTask`, data)
                    .then(({data}) => {
                        this.deviceList = data.data;
                        this.pageData.total = data.recordsTotal;
                    });
            },

            getLogs(assetId) {
                return this.$axios.get(`/pmLogs/${this.query.id}/${assetId}`)
                    .then(({data}) => {
                        if (data) {
                            // this.$nextTick(()=>{

                                this.logTypeList = data.pmElementOptions;
                            // })
                            // console.log(this.logTypeList)
                        }
                    });
            },

            clickLogType(type) {
                this.currentLogsType = type;
            },

            checkLogs(device) {
                this.reportModalShow = true;
                this.getLogs(device.assetId);
            },

            //点击搜索
            startSearch() {
                this.pageData.current = 1;
                return this.getDeviceList();
            },


            //分页变化时
            pageChange() {
                this.getDeviceList();
            },

            sectionTreeClick(nodeKey) {
                const node = this.$refs['section-tree'].flatState[nodeKey].node;

                if (node.children && node.children.length > 0) {
                    this.$set(node, 'expand', ! node.expand);
                }
            },


            transformSectionTreeData,
            numToLocale
        }
    }
</script>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .inspection-task-stage-details {
        font-size: 14px;
        .stage-details-header {
            height: 80px;
            padding: 0 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            .label-top{
                color: #666666;
                display: block;
                margin-bottom: 6px;
            }
        }

        .stage-details-list{
            .title{
                line-height: 40px;
                color: @color-warning;
                border-bottom: 1px solid @border-color;
                margin-bottom: 15px;
            }
            .device-wrap{
                border: 1px solid @border-color;

            }
            .search{
                padding: 20px;
                border-bottom: 1px solid @border-color;
                .kld-input{
                    width: 300px;
                }
            }
            .list-wrap{
                padding: 20px;
                display: flex;
                .section-list,.device-list{
                    border: 1px solid @border-color;
                }
                .section-list{
                    width: 270px;
                    margin-right: 20px;
                    overflow-y: auto;
                    max-width: 869px;
                    .section-title{
                        height: 54px;
                        padding: 10px;
                        line-height: 33px;
                        border-bottom: 1px solid @border-color;
                    }
                    .section-tree{
                        padding: 10px;
                    }
                }
                .device-list{
                    flex-grow: 1;
                    .page{
                        text-align: center;
                        padding: 20px 0;
                    }
                }
            }
        }
    }
    .report-modal{

        /*overflow: hidden;*/
        height: 600px;
        display: flex;
        flex-direction: row;
        .tabs {
            flex-shrink: 0;
            margin-right: 20px;
            width: 301px;
            border-radius: 3px;
            overflow: hidden;
            border: solid 1px rgba(2, 31, 57, 0.1);
        }
        .tabs-wrap{
            height: calc(~'100% - 46px');
            overflow: auto;
        }
        .tabs-item {
            border-bottom: solid 1px rgba(2, 31, 57, 0.1);
            border-top: none;
            padding: 16px 20px;
            color: #666666;
            cursor: pointer;
            background-color: #f5f6fa;
            &.active {
                background-color: #fafafa;
                padding-left: 20 - 4px;
                border-left: 4px solid #0c8399;
            }
        }
        .tabs-title {
            background-color: #eaeaea;
            border: 0;
            border-bottom: 1px solid rgba(2, 31, 57, 0.1);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.tabs-title-child{
                padding: 12px 20px;
                background-color: #dedede;
                position: relative;
                .ivu-icon{
                    position: absolute;
                    left: 4px;
                    top: (38 - 14) / 2 px;
                }
            }
        }
        .tabs-content{
            flex-grow: 1;
            height: 100%;
            overflow: auto;
        }
        .report-title{
            background-color: #eaeaea;
            border-bottom: 1px solid @border-color;
            line-height: 40px;
            padding: 0 10px;
        }
        .report-card{
            border: 1px solid @border-color;
            flex-grow: 0;
            height: auto;
            background-color: #fff;
            border-radius: 3px;
            margin-bottom: 10px;
            &:last-of-type{
                margin-bottom: 0;
            }
        }
        ul{
            padding: 0 20px;
            margin-bottom: 10px;
            &:last-of-type{
                margin-bottom: 0;
            }
            li{
                line-height: 42px;
                border-bottom: 1px solid @border-color;
                display: flex;
                justify-content: space-between;
                &:last-of-type{
                    border-bottom: 0;
                }
            }
        }
    }
</style>
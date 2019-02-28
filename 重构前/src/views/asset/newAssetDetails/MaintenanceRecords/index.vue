<template>
    <div class="kld-box-effect">
        <div class="tabs">
            <div class="tabs-left">
                <div class="tabs-title">保养类型</div>
                <div class="tabs-wrap">
                    <div @click="changeLevel(1)" :class="{active: maintenanceLevel === 1}" class="tabs-item">
                        <span>日常保养</span>
                        <div class="badge">{{maintenanceTotal[0]}}</div>
                    </div>
                    <div @click="changeLevel(2)" :class="{active: maintenanceLevel === 2}" class="tabs-item">
                        <span>二级保养</span>
                        <div class="badge">{{maintenanceTotal[1]}}</div>
                    </div>
                    <div @click="changeLevel(3)" :class="{active: maintenanceLevel === 3}" class="tabs-item">
                        <span>三级保养</span>
                        <div class="badge">{{maintenanceTotal[2]}}</div>
                    </div>
                </div>
            </div>
            <div class="tabs-right">
                <div class="tabs-title">保养记录</div>
                <div class="table-wrap">
                    <Loading v-if="tableLoading"></Loading>
                    <Table @on-row-click="goToDetails" stripe class="records-table" :columns="recordsTableColumns" :data="recordsTableData"></Table>
                    <div class="table-page">
                        <kld-page @on-change="getRecords" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @import "../c-components/common";
    @border-color: rgba(2, 31, 57, 0.2);
    /*.inspect-records {*/
        /*position: relative;*/
    /*}*/
    .records-table{
        border-left: 0;
        border-top: 0;
        /deep/.ivu-table{
            &:before,&:after{
                display: none;
            }
            .ivu-table-body{
                tr{
                    height: 74px;
                }
            }
        }
    }
    .table-page{
        padding: 20px 0;
        text-align: center;
    }
    .tabs{
        font-size: 14px;
        display: flex;
        border: 1px solid @border-color;
        background-color: #fff;
        .tabs-wrap{
            height: 670px;
            overflow: auto;
        }
        .tabs-item{
            padding: 14px;
            position: relative;
            background-color: #f5f6fa;
            border-bottom: 1px solid @border-color;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            .badge{
                padding: 0 10px;
                border-radius: 30px;
                border: 1px solid #dce0e6;
                text-align: center;
                line-height: 30px;
                color: #a9a8a9;
                background-color: #fff;
                flex-shrink: 0;
            }
            span{
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &.active{
                background-color: #fff;
                color: #0c8399;
                .badge{
                    color: #0c8399;
                    border-color: #0c8399;
                }
                &:before{
                    position: absolute;
                    content: '';
                    display: block;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 4px;
                    background-color: #0c8399;
                }    
            }
        }
        .tabs-title{
            padding: 20px;
            background-color: #fff;
            border-bottom: 1px solid @border-color;
        }
        .tabs-left{
            width: 16%;
            border-right: 1px solid @border-color;
        }
        .tabs-right{
            width: 84%;
        }
    }
</style>

<script>
    import kldPage from '@common/page/page';
    import numToLocale from '@common/numberToLocale';
    import kldTag from '@inspection-common/kld-tag.vue';
    import moment from 'moment';
    export default {
        name: 'MaintenanceRecords',
        components: {kldPage},
        data() {
            const osId = this.$store.state.user_in.osId,
                assetId = this.$route.params.id;

            return {
                tableLoading: false,
                recordsTableAllColumns: [
                    [
                        {title: '序号', width: 120, render: (h, {index}) => h('p', ((this.pageData.current - 1) * this.pageData.pageSize + index + 1).toString().padStart(2, '0'))},
                        {title: '执行时间',  width: 200, key: 'operatTime'},
                        {title: '执行人', width: 120,key: 'operater'},
                        {title: '执行结果', render(h, {row: {type}}) {
                            let className = '',
                                text = '';

                            if (type === 0) {
                                className = 'kld-default';
                                text = '未完成';
                            } else if (type === 1) {
                                className = 'kld-success';
                                text = '完成';
                            }

                            return h('p', {class: className}, text);
                        }},
                        {title: '备注', render(h, {row: {note}}) {
                            return h('p', {attrs: {class: 'textEllipsis', title: note}}, note);
                        }}
                    ],
                    [
                        {title: '序号', width: 120, render: (h, {index}) => h('p', ((this.pageData.current - 1) * this.pageData.pageSize + index + 1).toString().padStart(2, '0'))},
                        {title: '任务名称', render(h, {row: {sName}}) {
                                return h(
                                    'p',
                                    {
                                        attrs: {
                                            class: 'kld-success textEllipsis',
                                            title: sName
                                        }
                                    },
                                    sName
                                );
                            }},
                        {title: '执行期数', render(h, {row: {periods}}) {
                                return h(
                                    'p',
                                    {
                                        class: 'kld-success'
                                    },
                                    `第${numToLocale(periods)}期`
                                );
                            }},
                        {title: '执行时间',  width: 200, render(h, {row: {executeStartTime, executeEndTime}}) {
                                return h('p', `${moment(executeStartTime).format('YYYY-MM-DD')} 至 ${moment(executeEndTime).format('YYYY-MM-DD')}`);
                            }},
                        {title: '执行人', key: 'executeName', width: 120},
                        {title: '执行状态', render: (h, {row: {status}}) => {
                                let type = '',
                                    tagText = '';
                                switch (status) {
                                    case 0 :
                                        type = 'default';
                                        tagText = '未完成';
                                        break;
                                    case 1:
                                        type = 'warning';
                                        tagText = '执行中';
                                        break;
                                    case 2:
                                        type = 'success';
                                        tagText = '已完成';
                                        break;
                                    case 3:
                                        type = 'purple';
                                        tagText = '未完成';
                                        break;
                                    case 4:
                                        type = 'error';
                                        tagText = '逾期';
                                }

                                return h(kldTag, {props: {type}}, tagText);
                            }}
                    ],
                    [
                        {title: '序号', width: 120, render: (h, {index}) => h('p', ((this.pageData.current - 1) * this.pageData.pageSize + index + 1).toString().padStart(2, '0'))},
                        {title: '保养供应商', render(h, {row: {supplierName}}) {
                            return h('p', {attrs: {class: 'textEllipsis', title: supplierName}}, supplierName);
                        }},
                        {title: '上传时间', key: 'uploadTime'},
                        {title: '执行人', key: 'uploadName'}
                    ]
                ],
                recordsTableColumns: [],
                recordsTableData: [],
                pageData: {
                    total: 0,
                    pageSize: 10,
                    current: 1
                },

                maintenanceTotal: [0, 0, 0],
                maintenanceLevel: 1,

                axiosUrls: [
                    '/assets/getLevelOneMaintenance',
                    `/maintenanceSchedule/${osId}/${assetId}/assetList`,
                    '/assets/getLevelThreeMaintenance'
                ],
                detailsRouteNames: [
                    'OneMaintenance',
                    'AllTwoTaskDetail',
                    'ThreeMaintenanceDetails'
                ]
            };
        },
        props: {
            loaded: Function
        },
        created() {
            this.init()
                .then(
                    () => typeof this.loaded === 'function' && this.loaded(),
                    () => typeof this.loaded === 'function' && this.loaded(false)
                );
        },
        computed: {
            assetId() {
                return this.$route.params.id;
            }
        },
        watch: {
            maintenanceLevel: {
                handler(level) {
                    this.recordsTableColumns = this.recordsTableAllColumns[level - 1];
                    this.pageData.current = 1;
                    this.getRecords();
                }
            }
        },
        methods: {
            init() {
                this.recordsTableColumns = this.recordsTableAllColumns[0];
                return Promise.all(
                    [
                        Promise.all(
                            this.axiosUrls.map(
                                (url, index) => this.$axios.post(url, {
                                    offset: 0,
                                    limit: 1,
                                    params: index === 1 ? {} : {id: this.assetId}
                                })
                            )
                        )
                            .then(
                                allRes => {
                                    this.maintenanceTotal = allRes.map(res => res.data.recordsTotal);
                                }
                            ),
                        this.getRecords()
                    ]
                );
            },

            getRecords() {
                const pageData = this.pageData;

                return this.$axios.post(this.axiosUrls[this.maintenanceLevel - 1], {
                    offset: (pageData.current - 1) * pageData.pageSize,
                    limit: pageData.pageSize,
                    params: this.maintenanceLevel === 2 ? {} : {id: this.assetId}
                })
                    .then(({data: {data, recordsTotal}}) => {
                        this.recordsTableData = data;
                        this.pageData.total = recordsTotal;
                    });
            },
            changeLevel(level) {
                this.maintenanceLevel = level;
            },
            goToDetails(row) {
                this.$router.push({
                    name: this.detailsRouteNames[this.maintenanceLevel - 1],
                    query: {
                        id: row.id || row.sId,
                    }
                });
            }
        }
    }
</script>
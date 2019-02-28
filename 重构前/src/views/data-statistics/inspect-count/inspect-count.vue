<template>
    <div class="inspect-count relative">
        <Loading v-if="tableLoading"></Loading>
        <div class="kld-box-effect mb-20">
            <div style="width: 300px;">
                <DatePicker
                        v-model="dateRange"
                        type="daterange"
                        range-type="month"
                        :clearable="false"
                        split-panels
                        transfer
                ></DatePicker>
            </div>
        </div>
        <display-bar :data="displayBarData"></display-bar>
        <div class="kld-box-effect mt-20 p-0">
            <expand-table
                    :data="expandTableData"
                    :selected.sync="tableSelected"
                    row-key="type"
                    :selectable="tableSelectable"
            >
                <template slot="footer">
                    <Button @click="exportExcel" type="ghost" class="btn-info">导出报表</Button>
                </template>
            </expand-table>
        </div>
    </div>
</template>

<script type="text/jsx">
    import ExpandTable from '../components/expand-table';
    import DisplayBar from '../components/display-bar';
    import {tableRenderEllipsis} from '@/utils';
    import moment from 'moment';
    export default {
        name: "inspect-count",
        components: {
            ExpandTable,
            DisplayBar
        },

        data() {
            return {
                searchData: {
                    startTime: moment().format('YYYY-MM'),
                    endTime: moment().format('YYYY-12'),
                },

                countData: {},
                undoData: [],
                overdueData: [],

                tableSelected: [],
                tableLoading: false,
                tableSelectable: true
            };
        },

        computed: {
            dateRange: {
                get() {
                    const {searchData: {startTime, endTime}} = this;
                    return [startTime, endTime].filter(Boolean);
                },
                set(value) {
                    const {searchData} = this;
                    [searchData.startTime, searchData.endTime] = value.map(
                        date => moment(date).format('YYYY-MM')
                    );
                }
            },

            hospitalId() {
                return this.$store.state.user_in.osId;
            },
            expandColumns() {
                return [
                    {
                        type: 'index',
                        width: 60,
                        title: '序号'
                    },
                    {
                        title: '计划名称',
                        render: tableRenderEllipsis('sName', 'kld-success'),
                    },
                    {
                        title: '周期',
                        width: 270,
                        render(h, {row: {periods}}) {
                            return <span>{periods}</span>;
                        }
                    },
                    {
                        title: '执行时间段',
                        width: 280,
                        render(h, {row: {executeStartTime: start, executeEndTime: end}}) {
                            return (
                                <p>
                                    执行时间段：
                                    <span class="kld-success">{moment(start).format('YYYY-MM-DD')}</span>
                                    至
                                    <span class="kld-success">{moment(end).format('YYYY-MM-DD')}</span>
                                </p>
                            );
                        }
                    },
                    {
                        title: '设备数',
                        width: 80,
                        key: 'count'
                    },
                    {
                        title: '执行人',
                        width: 120,
                        render: tableRenderEllipsis('userName')
                    }
                ];
            },

            expandTableData() {
                return [
                    {
                        title(h) {
                            return <span class="kld-success">未完成</span>;
                        },
                        type: 'undo',
                        expandData: this.undoData,
                        expandColumns: this.expandColumns
                    },

                    {
                        title(h) {
                            return <span class="kld-success">逾期</span>;
                        },
                        type: 'overdue',
                        expandData: this.overdueData,
                        expandColumns: this.expandColumns
                    }
                ]
                    .map(
                        data => {
                            if (data.expandData.length > 0) {
                                data._expanded = true;
                            }

                            return data;
                        }
                    );
            },



            displayBarValues() {
                const {countData} = this;

                return [
                    'executedCount',
                    'executedAssetCount',
                    'completedCount',
                    'noCompletedCount',
                    'completionRate',
                    'overdueCount',
                ].map(fields => countData[fields]);
            },
            displayBarNames() {
                return [
                    '当期任务数',
                    '当期设备数',
                    '已完成设备数',
                    '未完成设备数',
                    '完成率',
                    '任务逾期数',
                ];
            },
            displayBarUnits() {
                return [null, '台', '台', '台'];
            },

            displayBarData() {
                const {
                    displayBarUnits: units,
                    displayBarValues: values
                } = this;

                return this.displayBarNames.map(
                    (name, index) => ({
                        name,
                        value: values[index] || 0,
                        unit: units[index]
                    })
                );
            },

            requestURLPrepend() {
                return 'inspectionSchedule';
            }
        },

        watch: {
            searchData: {
                deep: true,
                immediate: true,
                handler() {
                    this.getData();
                }
            }
        },

        methods: {
            async getData() {
                this.tableLoading = true;
                try {
                    await Promise.all(
                        [
                            {urlAppend: 'reportFormsStatistics', thisField: 'countData'},
                            {urlAppend: 'reportFormsNoCompletedDetails', thisField: 'undoData'},
                            {urlAppend: 'reportFormsOverdueDetails', thisField: 'overdueData'}
                        ].map(
                            async ({urlAppend, thisField}) => {
                                const {data} = await this.$axios.post(`/${this.requestURLPrepend}/${this.hospitalId}/${urlAppend}`, this.searchData);
                                this[thisField] = data;
                            }
                        )
                    );

                } finally {
                    this.tableLoading = false;
                }
            },
            exportExcel() {
                const {tableSelected} = this;

                if (tableSelected.length === 0) {
                    this.$Message.warning('请选择需要下载的内容');
                } else {
                    const params = {
                        ...this.searchData,
                        noCompleted: 0,
                        overdue: 0
                    };
                    for (const {type} of tableSelected) {
                        if (type === 'undo') {
                            params.noCompleted = 1;
                        } else {
                            params.overdue = 1;
                        }
                    }
                    this.$axios.get(`/${this.requestURLPrepend}/${this.hospitalId}/exportForms`, {
                        params
                    });
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .inspect-count {
        .btn-info{
            background-color: #fff;
            height: 44px;
            width: 100px;
        }
    }
</style>
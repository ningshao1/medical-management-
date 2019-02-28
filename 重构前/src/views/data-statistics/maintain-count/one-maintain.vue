<script type="text/jsx">
    import InspectCount from '../inspect-count';
    import {tableRenderEllipsis, downloadFile} from '@/utils';
    export default {
        name: 'one-maintain',
        extends: InspectCount,
        data() {
            return {
                tableSelectable: false
            }
        },
        computed: {
            expandColumns() {
                return [
                    {
                        type: 'index',
                        width: 60,
                        title: '序号'
                    },
                    {
                        title: '科室名称',
                        render: tableRenderEllipsis('osName', 'kld-success'),
                    },
                    {
                        title: '未执行数',
                        key: 'sum'
                    },
                    {
                        title: '责任人',
                        render: tableRenderEllipsis('uName')
                    }
                ];
            },
            expandTableData() {
                return [
                    {
                        title(h) {
                            return <span class="kld-success">未完成</span>;
                        },
                        expandData: this.undoData,
                        expandColumns: this.expandColumns,
                        _expanded: true
                    }
                ]
            },


            displayBarValues() {
                const {countData} = this;

                return [
                    'osCount',
                    'assetCount',
                    'makes',
                    'notMakeSum',
                    'makesRate',
                ].map((fields, index) => {
                    const value = countData[fields];
                    return index === 4 ? `${Number(value).toFixed(2)}%` : value;
                });
            },
            displayBarNames() {
                return [
                    '当期科室数',
                    '当期设备总数',
                    '已执行数',
                    '未执行数',
                    '完成率'
                ];
            },
            displayBarUnits() {
                return [null, '台'];
            }
        },
        methods: {
            async getData() {
                this.tableLoading = true;
                try {
                    const {data: [map, list]} = await this.$axios.post('/pmMaintenance/findScheduleOneLogs', this.searchData);

                    this.countData = map;
                    this.undoData = list;
                } finally {
                    this.tableLoading = false;
                }
            },
            async exportExcel() {
                const {data} = await this.$axios.post('/pmMaintenance/downloadOneLogs', this.searchData, {responseType: 'blob'});

                downloadFile(data, '质控统计表-一级保养.xls');
            }
        }
    }
</script>
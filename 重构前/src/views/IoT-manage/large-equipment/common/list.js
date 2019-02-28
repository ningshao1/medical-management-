import emptyToNull from '@/common/empty-to-null';
import {debounce} from '@/utils';

//todo 作为全局混入
export default {
    name: 'list',
    data() {
        return {
            searchData: {},

            tableData: [],
            tableLoading: false,
            pageData: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    },

    watch: {
        searchData: {
            deep: true,
            handler: debounce(function () {
                this.pageData.current = 1;
                this.getTableData();
            }, 300, {leading: true})
        }
    },


    methods: {
        async getTableData() {
            this.tableLoading = true;
            try {

                const {pageData: {current, pageSize}} = this,
                    {data: {data, recordsTotal}} = await this.$axios.post(this.tableUrl, {
                        offset: (current - 1) * pageSize,
                        limit: pageSize,
                        params: emptyToNull(this.searchData)
                    });

                this.tableData = data;
                this.pageData.total = recordsTotal;
            } finally {
                this.tableLoading = false;
            }
        },

        resetSearch() {
            this.$refs['search-form'].resetFields();
        }
    }
}
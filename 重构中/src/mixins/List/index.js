export default {
    data() {
        return {
            search: {},
            searchAdvanced: {},
            searchInEffect: {},
            data: [],
            loading: false,
            page: {
                total: 0,
                current: 1,
                size: 10
            },
        }
    },
    watch: {
        search: {
            deep: true,
            handler(search) {
                this.mergeSearch(search);
            }
        },
    },
    created() {
        this.searchInEffect = {
            ...this.search,
            ...this.searchAdvanced
        };
        this.$watch('searchInEffect', () => {
            this.page.current = 1;
            this.getList();
        }, {deep: true});
    },
    methods: {
        async getList() {
            this.loading = true;
            try {
                const {page} = this;
                const {data: {data, recordsTotal: total}} = await this.$axios.post(this.url, {
                    offset: page.size * (page.current - 1),
                    limit: page.size,
                    params: this.searchInEffect
                });

                this.data = data;
                this.page.total = total;
            } finally {
                this.loading = false;
            }
        },
        mergeSearch(data) {
            Object.assign(this.searchInEffect, data);
        },
    }
};
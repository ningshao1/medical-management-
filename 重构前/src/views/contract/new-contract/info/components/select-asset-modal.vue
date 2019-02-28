<template>
    <Modal
        v-model="modalShow"
        title="选择设备"
        class-name="vertical-center-modal"
        width="800"
        @on-ok="modalConfirm"
    >
        <Form class="mb-10" :model="searchData" ref="search-form">
            <FormItem prop="keyword" style="width: 50%;">
                <Input v-model="searchData.keyword" class="kld-input" placeholder="请输入关键字搜索"/>
            </FormItem>
        </Form>
        <Loading v-if="tableLoading"></Loading>
        <div class="relative">
            <kld-table
                    :data="tableData"
                    :columns="tableColumns"
                    :selected.sync="selected"
                    wrap-border
                    stripe
            />
        </div>
        <kld-page
                class="mt-20"
                :current.sync="pageData.current"
                :page-size="pageData.pageSize"
                :total="pageData.total"
                @on-change="getList"
        />
    </Modal>
</template>

<style lang="less" scoped>
    .select-asset-modal {

    }
</style>

<script type="text/jsx">
    import {KldTable} from '@/components';
    import KldPage from '@/common/page';
    import emptyToNull from '@/common/empty-to-null';
    import renderEllipsis from '@/common/render-ellipsis';
    export default {
        name: "select-asset-modal",
        components: {
            KldTable,
            KldPage
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                tableData: [],
                tableLoading: false,
                searchData: {
                    departmentId: this.$store.state.user_in.osId,
                    keyword: ''
                },
                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 7
                },

                selected: []
            };
        },
        computed: {
            tableColumns() {
                return [
                    {
                        type: 'selection',
                        width: 80
                    },
                    {
                        title: '设备名称',
                        render: (h, {row: {assetName}}) => renderEllipsis(h, assetName)
                    },
                    {
                        title: '设备信息',
                        render: (h, {row: {assetClass}}) => renderEllipsis(h, assetClass)
                    },
                    {
                        title: '品牌',
                        render: (h, {row: {brandName}}) => renderEllipsis(h, brandName)
                    },
                    {
                        title: '所属科室',
                        render: (h, {row: {osName}}) => renderEllipsis(h, osName)
                    },
                    {
                        title: '过保时间',
                        key: 'assetWarrntyDate'
                    }
                ];
            },
            modalShow: {
                get() {
                    return this.show;
                },
                set(show) {
                    this.$emit('update:show', show);
                }
            },

            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },
        watch: {
            value: {
                immediate: true,
                handler(value) {
                    this.selected = [...value];
                }
            },

            searchData: {
                deep: true,
                handler() {
                    if (this.modalShow) {
                        this.pageData.current = 1;
                        this.getList();
                    }
                }
            },

            modalShow: {
                immediate: true,
                handler(show) {
                    if (show) {
                        this.pageData.current = 1;
                        this.getList();
                    } else {
                        this.resetSearch();
                        this.selected = [...this.value];
                    }
                }
            }
        },
        methods: {
            async getList() {
                this.tableLoading = true;
                try {
                    const {pageData: {current, pageSize}} = this,
                        {data: {data, recordsTotal}} = await this.$axios.post(`/assets/${this.hospitalId}/list`, {
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

            modalConfirm() {
                this.$emit('input', [...this.selected]);
            },

            resetSearch() {
                const form = this.$refs['search-form'];

                form && form.resetFields();
            }
        }
    }
</script>
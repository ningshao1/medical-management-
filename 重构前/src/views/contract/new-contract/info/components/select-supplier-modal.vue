<template>
    <Modal
        v-model="modalShow"
        title="选择供应商"
        width="800"
        @on-visible-change="modalVisibleChange"
    >
        <div class="select-supplier-modal relative">
            <Form
                    :model="searchData"
                    ref="search-form"
            >
                <FormItem prop="keyword" style="width: 50%;">
                    <i-input v-model="searchData.keyword" class="kld-input" icon="ios-search" placeholder="搜索供应商信息"></i-input>
                </FormItem>
            </Form>
            <Loading v-if="tableLoading"></Loading>
            <kld-table
                    class="mt-20"
                    :data="tableData"
                    :columns="tableColumns"
                    wrap-border
                    @on-row-click="tableClick"
            ></kld-table>
            <kld-page
                    class="pt-20"
                    :current.sync="pageData.current"
                    :total="pageData.total"
                    :page-size="pageData.pageSize"
                    @on-change="getSubpplierList"
            ></kld-page>
        </div>
        <div slot="footer"></div>
    </Modal>
</template>

<style lang="less" scoped>
    .select-supplier-modal {

    }
</style>

<script type="text/jsx">
    import emptyToNull from '@common/empty-to-null';
    import {debounce} from '@/utils';
    import {KldTable} from '@/components';
    import KldPage from '@common/page';

    export default {
        name: "select-supplier-modal",
        components: {
            KldPage,
            KldTable,
        },
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                searchData: {
                    keyword: '',
                    osId: this.$store.state.user_in.osId,
                    type: '0'
                },

                tableData: [],
                tableColumns: [
                    {
                        title: '检定单位',
                        render(h, {row: {supplierName}}) {
                            return <p className="text-ellipsis" title={supplierName}>{supplierName}</p>;
                        }
                    },
                    {
                        title: '联系人',
                        key: 'supplierContactName'
                    },
                    {
                        title: '联系方式',
                        key: 'supplierPhone'
                    }
                ],
                tableLoading: false,

                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 8
                }
            };
        },

        computed: {
            hospitalId() {
                return this.$store.state.user_in.osId;
            },

            modalShow: {
                get() {
                    return this.show;
                },
                set(value) {
                    this.$emit('update:show', value);
                }
            }
        },

        watch: {
            searchData: {
                deep: true,
                handler: debounce(function () {
                    this.pageData.current = 1;
                    if (this.modalShow) {
                        this.getSubpplierList();
                    }
                }, 200)
            }
        },

        methods: {
            async getSubpplierList() {
                this.tableLoading = true;
                try {
                    const {pageData: {current, pageSize}} = this,
                        {data: {data, recordsTotal}} = await this.$axios.post('/supplier/list', {
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

            tableClick(row) {
                this.$emit('select', row);
                this.modalShow = false;
            },

            modalVisibleChange(show) {
                if (show) {
                    this.getSubpplierList();
                } else {
                    this.$refs['search-form'].resetFields();
                }
            }
        }
    }
</script>
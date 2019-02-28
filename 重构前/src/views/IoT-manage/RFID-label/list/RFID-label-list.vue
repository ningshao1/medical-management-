<template>
    <div class="RFID-label-list">
        <div class="position-to-title">
            <Button @click="exportExcel" class="kld-btn">导出Excel</Button>
        </div>
        <div class="kld-box-effect mb-20">
            <Form :model="searchData" ref="search-form">
                <Row :gutter="20">
                    <i-col span="6">
                        <FormItem prop="keyword">
                            <Input v-model="searchData.keyword" class="kld-input" placeholder="资产编码/资产名称" />
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem prop="departmentId">
                            <kld-tree-select
                                    v-model="searchData.departmentId"
                                    :data="sectionData"
                                    placeholder="选择科室"
                                    first-expanded
                                    title-key="osName"
                                    children-key="lists"
                                    filterable
                            />
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem prop="bindingState">
                            <Select v-model="searchData.bindingState" placeholder="绑定状态" class="kld-select">
                                <Option value="">全部</Option>
                                <Option :value="1">已绑定</Option>
                                <Option :value="2">未绑定</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="kld-box-effect p-0 relative">
            <Loading v-if="tableLoading"/>
            <kld-table
                :data="tableData"
                :columns="tableColumns"
            />
            <kld-page
                class="py-20"
                :current.sync="pageData.current"
                :total="pageData.total"
                :page-size="pageData.pageSize"
                @on-change="getTableData"
            />
        </div>
    </div>
</template>

<script type="text/jsx">
    import list from '../../large-equipment/common/list';
    import {KldTable} from '@/components';
    import KldPage from '@/common/page';
    import KldTreeSelect from '@/common/kld-tree-select';
    import {Dropdown, DropdownMenu, DropdownItem, Button} from 'iview';
    import {tableRenderEllipsis} from '@/utils';
    import kldConfirm from '@/common/kld-confirm';

    export default {
        name: "RFID-label-list",
        mixins: [list],
        components: {
            KldTable,
            KldPage,
            KldTreeSelect
        },

        data() {
            return {
                searchData: {
                    keyword: '',
                    bindingState: '',
                    // departmentId: ''
                    departmentId: this.$store.state.user_in.osId
                },
                sectionData: []
            }
        },
        computed: {
            tableUrl: () => '/internetThings/tagList',
            tableColumns() {
                return [
                    {
                        title: '序号',
                        width: 80,
                        render: (h, {index}) => {
                            const {pageData: {current, pageSize}} = this;
                            return <span>{(current - 1) * pageSize + index + 1}</span>;
                        }
                    },
                    {
                        title: '资产编码',
                        render: tableRenderEllipsis('assetCode', 'text-uppercase')
                    },
                    {
                        title: '资产名称',
                        render: tableRenderEllipsis('assetName', 'kld-success')
                    },
                    {
                        title: '品牌',
                        render: tableRenderEllipsis('brandName')
                    },
                    {
                        title: '型号',
                        render: tableRenderEllipsis('assetClass')
                    },
                    {
                        title: '所属科室',
                        render: tableRenderEllipsis('departmentName')
                    },
                    {
                        title: 'RFID标签编码',
                        width: 300,
                        render: (h, {row, index}) => {
                            if (row.bindingState === 1) {
                                //todo 使用arguments会出现编译错误
                                // return tableRenderEllipsis('epc')(...arguments);
                                return tableRenderEllipsis('epc')(h, {row});
                            } else {
                                const {epc} = row,
                                    readTag = () => {
                                        this.readTag(this.tableData[index]);
                                    },
                                    bindTag = () => {
                                        this.bindTag(this.tableData[index]);
                                    };


                                return (
                                    <div class="RFID-read flex justify-content-between align-items-center">
                                        {epc ? tableRenderEllipsis('epc', 'flex-grow-1')(h, {row}) : null}
                                        <Button
                                                class="flex-shrink-0 kld-btn h-26 py-0 px-10"
                                                onClick={epc ? bindTag : readTag}
                                                loading={row._loading}
                                        >
                                            {epc ? '绑定' : '读入'}{row._loading ? '中' : ''}
                                        </Button>
                                    </div>
                                );
                            }
                        }
                    },
                    {
                        title: '绑定状态',
                        render: (h, {row}) => {
                            if (row.bindingState === 1) {
                                const handler = () => this.unbindTag(row);

                                return (
                                    <div class="flex align-items-center justify-content-between ">
                                        <span class="kld-success flex-shrink-0">已绑定</span>
                                        <Dropdown trigger="click" on-on-click={handler}>
                                            <Button class="fz-18" type="text" icon="android-more-vertical"></Button>
                                            <DropdownMenu slot="list">
                                                <DropdownItem class="kld-error">解除绑定</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                );
                            } else {
                                return <span class="kld-error">未绑定</span>;
                            }
                        }
                    }
                ];
            },
            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },

        created() {
            this.getSectionData();
            this.getTableData();
        },

        methods: {
            async getSectionData() {
                const {data} = await this.$axios.get(`/orgstruct/findAllTree/${this.hospitalId}`);
                this.sectionData = [data];
            },

            async unbindTag({tagId, assetName}) {
                kldConfirm({
                    content: `确定解绑 <span class="kld-success">${assetName}</span> 相关的标签信息？`,
                    ok: async () => {
                        await this.$axios.post('/internetThings/unBinding', [tagId]);
                        this.$Message.success('解绑成功');
                        this.getTableData();
                    }
                });
            },
            async readTag(row) {
                this.$set(row, '_loading', true);
                try {
                    const {data: {epc, tagId}} = await this.$axios.post('/internetThings/readTag', {
                        departmentId: row.departmentId
                    });

                    row.epc = epc;
                    row.tagId = tagId;
                } finally {
                    this.$set(row, '_loading', false);
                }
            },
            async bindTag(row) {
                this.$set(row, '_loading', true);
                try {
                    await this.$axios.post('/internetThings/binding', [
                        {
                            tagId: row.tagId,
                            assetId: row.assetId
                        }
                    ]);

                    this.getTableData();

                    kldConfirm({
                        content: `本院设备：<span class="kld-success">${row.assetName}</span><br/>已与RFID标签：<span class="kld-success">${row.epc}</span> 绑定成功！`,
                    });
                } finally {
                    this.$set(row, '_loading', false);
                }
            },

            exportExcel() {
                this.$axios.get('/internetThings/exportTagExcel');
            }
        }
    }
</script>

<style lang="less" scoped>
    .RFID-label-list {

        /deep/ .RFID-read{
            .kld-btn{
                line-height: 1;
            }
        }
    }
</style>
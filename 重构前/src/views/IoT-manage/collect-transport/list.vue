<template>
    <div class="collect-transport">
        <div class="position-to-title">
            <div>
                <Button @click="add" class="kld-btn">新增设备</Button>
                <Button @click="exportExcel" class="kld-btn">导出Excel</Button>
            </div>
        </div>
        <div class="kld-box-effect mb-20">
            <Form :model="searchData" ref="search-form">
                <Row :gutter="20">
                    <i-col span="6">
                        <FormItem prop="keyword">
                            <i-input
                                    class="kld-input"
                                    v-model="searchData.keyword"
                                    placeholder="资产名称/IP地址"
                            ></i-input>
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
                            ></kld-tree-select>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </div>
        <div class="kld-box-effect p-0 relative">
            <Loading v-if="tableLoading"></Loading>
            <kld-table
                :data="tableData"
                :columns="tableColumns"
            ></kld-table>
            <kld-page
                class="py-20"
                :current.sync="pageData.current"
                :total="pageData.total"
                :page-size="pageData.pageSize"
                @on-change="getTableData"
            ></kld-page>
        </div>

        <collect-asset-modal
                ref="modal"
                :type="modalType"
                :show.sync="modalShow"
                @submitted="modalSubmitted"
        ></collect-asset-modal>
    </div>
</template>

<script type="text/jsx">
    import list from '../large-equipment/common/list';
    import {KldTable, KldTreeSelect, KldPage} from '@/components';
    import {kldConfirm, tableRenderEllipsis} from '@/utils';
    import {Dropdown, DropdownMenu, DropdownItem, Button} from 'iview';
    import CollectAssetModal from './collect-asset-modal';

    export default {
        name: "collect-transport",
        mixins: [list],
        components: {
            KldTreeSelect,
            KldTable,
            KldPage,
            CollectAssetModal
        },
        data() {
            return {
                searchData: {
                    departmentId: this.$store.state.user_in.osId,
                    keyword: ''
                },

                modalType: 'add',
                modalShow: false,

                sectionData: []
            };
        },

        computed: {
            tableUrl: () => '/internetThings/listCollect',
            tableColumns() {
                return [
                    {
                        title: '序号',
                        width: 80,
                        render: (h, {index}) => {
                            const {pageData: {current, pageSize}} = this;
                            return <span>{index + 1 + (current - 1) * pageSize}</span>;
                        }
                    },
                    {
                        title: '资产名称',
                        render: tableRenderEllipsis('name', 'kld-success')
                    },
                    {
                        title: '品牌',
                        render: tableRenderEllipsis('brand')
                    },
                    {
                        title: '型号',
                        render: tableRenderEllipsis('model')
                    },
                    {
                        title: '所属科室',
                        render: tableRenderEllipsis('os_Name')
                    },
                    {
                        title: '位置',
                        render: tableRenderEllipsis('location')
                    },
                    {
                        title: 'IP地址',
                        render: tableRenderEllipsis('ip')
                    },
                    {
                        title: '绑定设备',
                        render: (h, {row}) => {
                            const handler = type => {
                                switch (type) {
                                    case 'edit':
                                        this.edit(row);
                                        break;
                                    case 'del':
                                        this.del(row);
                                }
                            };
                            return (
                                <div class="flex align-items-center justify-content-between">
                                    {row.assetId ? tableRenderEllipsis('assetName')(h, {row}) : <span>-</span>}
                                    <Dropdown on-on-click={handler} trigger="click">
                                        <Button class="fz-18" type="text" icon="android-more-vertical"></Button>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="edit">编辑</DropdownItem>
                                            {row.assetId ? null : <DropdownItem name="del" class="kld-error">删除信息</DropdownItem>}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            );
                        }
                    }
                ]
            },
            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },

        created() {
            this.getTableData();
            this.getSectionData();
        },

        methods: {
            async getSectionData() {
                const {data} = await this.$axios.get(`/orgstruct/findAllTree/${this.hospitalId}`);
                this.sectionData = [data];
            },

            add() {
                this.modalType = 'add';
                this.modalShow = true;
            },

            edit(row) {
                const data = {
                    ...row,
                    oldIp: row.ip,
                    oldDepartmentId: row.departmentId
                };
                this.setModalData(data);
                this.modalType = 'edit';
                this.modalShow = true;
            },

            del(row) {
                kldConfirm({
                    title: '删除信息',
                    content: `确定删除 <span class="kld-success">${row.name}</span> 相关的信息？`,
                    ok: async () => {
                        await this.$axios.delete('/internetThings/delCollect/', {
                            data: {ip: row.ip}
                        });
                        this.$Message.success('删除成功');
                        this.getTableData();
                    }
                });
            },


            exportExcel() {
                this.$axios.get('/internetThings/excelCollectExcel');
            },

            modalSubmitted() {
                this.getTableData();
            },

            setModalData(data) {
                this.$refs.modal.setData(data);
            }
        }
    }
</script>

<style lang="less" scoped>
    .collect-transport {

    }
</style>
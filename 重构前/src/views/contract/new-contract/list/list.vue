<template>
    <div class="contract-list">
        <div v-if="addLimit" class="position-to-title">
            <Button @click="$router.push({name: 'contract-add'})" class="kld-btn" icon="plus">新增合同</Button>
        </div>
        <div class="kld-box-effect">
            <Form :model="searchData" ref="search-form">
                <Row :gutter="20">
                    <i-col span="6">
                        <FormItem prop="keyword">
                            <i-input v-model="searchData.keyword" class="kld-input" placeholder="供应商名称/合同名称/合同编码名称"></i-input>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <Row>
                            <i-col span="10">
                                <FormItem prop="startTime">
                                    <DatePicker :value="searchData.startTime" @on-change="searchData.startTime = $event" class="kld-date-picker" placeholder="申请开始时间"></DatePicker>
                                </FormItem>
                            </i-col>
                            <i-col span="4" style="line-height: 44px;text-align: center;">至</i-col>
                            <i-col span="10">
                                <FormItem prop="endTime">
                                    <DatePicker :value="searchData.endTime" @on-change="searchData.endTime = $event" class="kld-date-picker" placeholder="申请结束时间"></DatePicker>
                                </FormItem>
                            </i-col>
                        </Row>
                    </i-col>
                    <i-col span="6">
                        <FormItem prop="contractStatus">
                            <Select v-model="searchData.contractStatus" class="kld-select" placeholder="合同状态">
                                <Option value="">全部</Option>
                                <Option value="0">正常</Option>
                                <Option value="1">废弃</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="4">
                        <div class="search-control">
                            <Button @click="resetSearch" class="kld-btn-default mr-20">重置</Button>
                            <Button @click="getList" class="kld-btn">搜索</Button>
                        </div>
                    </i-col>
                </Row>
            </Form>
        </div>
        <Row class="mt-20" :gutter="20" type="flex">
            <i-col span="6">
                <div class="kld-box-effect">
                    <kld-tree
                            :data="searchTreeData"
                            node-key="value"
                            :current.sync="searchData.contractType"
                            highlight-current
                            first-expanded
                    ></kld-tree>
                </div>
            </i-col>
            <i-col span="18">
                <div class="kld-box-effect relative p-0">
                    <Loading v-if="tableLoading"></Loading>
                    <kld-table
                            :data="tableData"
                            :columns="tableColumns"
                            :visible-columns="visibleColumns"
                            stripe
                            @on-row-click="tableClick"
                    ></kld-table>
                    <kld-page
                            :current.sync="pageData.current"
                            :total="pageData.total"
                            :page-size="pageData.pageSize"
                            @on-change="getList"
                            class="p-20"
                    ></kld-page>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<style lang="less" scoped>
    .contract-list {
        .search-control{
            display: flex;
            justify-content: center;
        }
        /deep/.ivu-table{
            th{
                font-size: 14px;
                height: 60px;
            }
            td{
                height: 74px;
                padding-top: 4px;
                padding-bottom: 4px;
            }
        }
    }
    .kld-box-effect{
        height: 100%;
    }
</style>

<script type="text/jsx">
    import KldTree from '@common/kld-tree';
    import KldPage from '@common/page';
    import {KldTable} from '@/components';
    import emptyToNull from '@common/empty-to-null';
    import moment from 'moment';
    import {Button} from 'iview';

    export default {
        name: "contract-list",
        components: {
            KldTree,
            KldPage,
            KldTable,
        },
        data() {
            return {
                tableData: [],
                tableLoading: false,
                tableColumns: [
                    {
                        title: '合同信息',
                        key: 'contractName',
                        render(h, {row: {contractName, labels}}) {
                            return (
                                <div>
                                    <p class="text-ellipsis kld-success fz-14" title={contractName}>{contractName}</p>
                                    {
                                        labels && labels.length > 0 ?
                                            <div>
                                                {labels.map(({labelName}) => <Button class="mt-4 mr-4" type="ghost" shape="circle" size="small">{labelName}</Button>)}
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            );
                        }
                    },
                    {
                        title: '供应商名称',
                        key: 'supplierName',
                        render(h, {row: {supplierName, supplierContactor, supplierContact}}) {
                            return (
                                <div class="fz-12">
                                    <p class="text-ellipsis" title={supplierName}>{supplierName}</p>
                                    <p class="kld-default">{supplierContactor}</p>
                                    <p class="kld-default">{supplierContact}</p>
                                </div>
                            );
                        }
                    },
                    {
                        title: '合同分类',
                        key: 'contractType',
                        width: 120,
                        render: (h, {row: {contractType}}) => {
                            return (
                                <span>
                                    {this.searchTreeData[0].children[contractType - 1].title}
                                </span>
                            );
                        }
                    },
                    {
                        title: '合同状态',
                        Key: 'contractStatus',
                        width: 120,
                        render(h, {row: {contractStatus}}) {
                            if (contractStatus === '0') {
                                return <span>正常</span>;
                            } else {
                                return <span class="kld-orange">废弃</span>;
                            }
                        }
                    },
                    {
                        title: '签订日期',
                        width: 120,
                        key: 'signDate'
                    },
                    {
                        title: '操作',
                        key: 'control',
                        width: 100,
                        render: (h, {row: {id, contractStatus}}) => {
                            if (contractStatus === '0') {
                                return (
                                    <router-link
                                        nativeOnClick={event => event.stopPropagation()}
                                        to={{name: "contract-edit", query: {id}}}
                                    >编辑</router-link>
                                );
                            }
                        }
                    },
                ],
                pageData: {
                    current: 1,
                    total: 0,
                    pageSize: 10
                },

                searchData: {
                    contractStatus: '',
                    contractType: '',
                    startTime: '',
                    endTime: '',
                    keyword: '',
                }
            };
        },
        computed: {
            hospitalId() {
                return this.$store.state.user_in.osId;
            },
            searchTreeData() {
                return [
                    {
                        title: '全部合同',
                        value: '',
                        children: [
                            {title: '维保合同', value: '1'},
                            {title: '采购合同', value: '2'},
                            {title: '维修合同', value: '3'},
                            {title: '其它', value: '4'}
                        ]
                    }
                ]
            },

            addLimit() {
                return this.checkLimit('con:add');
            },
            editLimit() {
                return this.checkLimit('con:edit');
            },
            detailLimit() {
                return this.checkLimit('con:query');
            },


            visibleColumns() {
                const columnKeys = this.tableColumns.map(({key}) => key);
                if (! this.editLimit) {
                    columnKeys.pop();
                }
                return columnKeys;
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getList();
            });
        },
        watch: {
            searchData: {
                deep: true,
                handler(searchData) {
                    if (this.validateTimeRange(searchData.startTime, searchData.endTime)) {
                        this.pageData.current = 1;
                        this.getList();
                    } else {
                        this.$Message.warning('开始时间不能超过结束时间');
                    }
                }
            }
        },
        methods: {
            async getList() {
                this.tableLoading = true;

                try {
                    const {pageData: {current, pageSize}} = this,
                        {data: {data, recordsTotal}} = await this.$axios.post(`/contracts/${this.hospitalId}/list`, {
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
                this.searchData.contractType = '';
            },

            tableClick({id}) {
                if (this.detailLimit) {
                    this.$router.push({
                        name: 'contract-detail',
                        query: {id}
                    });
                }
            },

            validateTimeRange(startTime, endTime) {
                if (startTime && endTime) {
                    return moment(startTime).valueOf() <= moment(endTime).valueOf();
                } else {
                    return true;
                }
            }
        }
    }
</script>
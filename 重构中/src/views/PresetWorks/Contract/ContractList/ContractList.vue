<template>
    <div class="contract-list">
        <kld-card noheader>
            <table-wrap
                    :search.sync="search.keyword"
                    @fresh="getList"
                    @search-advanced="mergeSearch"
                    @settings="tableSettings"
                    :number-matched="page.total"
                    search-expanded
            >
                <router-link slot="header" :to="{name: 'contract-add'}">
                    <el-button size="mini">新增</el-button>
                </router-link>
                <el-form
                        :model="searchAdvanced"
                        slot="search-advanced"
                        label-width="90px"
                        label-position="left"
                        :rules="searchRules"
                >
                    <el-row>
                        <el-form-item prop="contractType" label="合同类型：">
                            <radio-buttons
                                    v-model="searchAdvanced.contractType"
                                    :items="contractTypes"
                            ></radio-buttons>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="开始时间：" prop="startTime">
                                <el-date-picker
                                        v-model="searchAdvanced.startTime"
                                        placeholder="申请开始时间"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="结束时间：" prop="endTime">
                                <el-date-picker
                                    v-model="searchAdvanced.endTime"
                                    placeholder="申请结束时间"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同状态：" prop="contractStatus">
                                <el-select v-model="searchAdvanced.contractStatus">
                                    <el-option :value="null" label="全部"></el-option>
                                    <el-option value="0" label="正常"></el-option>
                                    <el-option value="1" label="废弃"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table
                        :data="data"
                        row-key="id"
                        size="large"
                        v-load="loading"
                        @row-click="rowClick"
                        :visible-columns="visibleColumns"
                >
                    <el-table-column label="合同信息" column-key="name">
                        <template slot-scope="{row: {contractName: name, labels}}">
                            <text-ellipsis class="text-primary">{{name}}</text-ellipsis>
                            <text-ellipsis :title="getLabelsTitle(labels)">
                                <kld-tag v-for="{labelId: id, labelName: name} in labels" :key="id" size="small">{{name}}</kld-tag>
                            </text-ellipsis>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商名称" column-key="sname">
                        <text-ellipsis slot-scope="{row: {supplierName: name}}" class="text-primary">
                            {{name}}
                        </text-ellipsis>
                    </el-table-column>
                    <el-table-column label="联系人" column-key="contactor">
                        <text-ellipsis slot-scope="{row: {supplierContactor: name}}">
                            {{name}}
                        </text-ellipsis>
                    </el-table-column>
                    <el-table-column label="联系方式" column-key="phone">
                        <text-ellipsis slot-scope="{row: {supplierContact: phone}}">
                            {{phone}}
                        </text-ellipsis>
                    </el-table-column>
                    <el-table-column label="合同分类" column-key="type">
                        <template slot-scope="{row: {contractType: type}}">
                            {{contractTypes[type].label}}
                        </template>
                    </el-table-column>
                    <el-table-column label="合同状态" column-key="status">
                        <template slot-scope="{row: {contractStatus: status}}">
                            <template v-if="status === '0'">正常</template>
                            <span v-else class="text-disabled">废弃</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="签订日期" prop="signDate" column-key="date"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row: {contractStatus: status, id}}">
                            <router-link
                                    v-if="status === '0'"
                                    :to="{name: 'contract-edit', query: {id}}"
                                    @click.native.stop
                            >编辑</router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </table-wrap>
            <el-pagination
                    class="text-right pt-10"
                    :current-page.sync="page.current"
                    :total="page.total"
                    :page-size="page.size"
                    @current-change="getList"
            ></el-pagination>
        </kld-card>
        <set-columns-visible
                :visible.sync="settings"
                :items="columnItems"
                v-model="visibleColumns"
        ></set-columns-visible>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import {List} from '@/mixins';
    import {TableWrap, KldCard, KldTree, TextEllipsis, SetColumnsVisible, KldTag, RadioButtons} from '@/components';
    import Tabs from '@/element-ui/Tabs';
    import TabPane from '@/element-ui/tabPane';
    export default {
        name: "contract-list",
        mixins: [List],
        components: {
            KldCard,
            KldTree,
            TableWrap,
            Tabs,
            TabPane,
            TextEllipsis,
            KldTag,
            SetColumnsVisible,
            RadioButtons
        },
        data() {
            return {
                search: {
                    keyword: null,
                },
                searchAdvanced: {
                    startTime: null,
                    endTime: null,
                    contractStatus: null,
                    contractType: null
                },
                visibleColumns: [
                    'name',
                    'sname',
                    'contactor',
                    'phone',
                    'type',
                    'status',
                    'date',
                ],
                settings: false
            }
        },

        computed: {
            columnItems() {
                return [
                    {label: '合同信息', value: 'name'},
                    {label: '供应商名称', value: 'sname'},
                    {label: '联系人', value: 'contactor'},
                    {label: '联系方式', value: 'phone'},
                    {label: '合同分类', value: 'type'},
                    {label: '合同状态', value: 'status'},
                    {label: '签订日期', value: 'date'}
                ]
            },
            contractTypeProxy: {
                get() {
                    const type = this.search.contractType;
                    return type === null ? '0' : type;
                },
                set(val) {
                    this.search.contractType = val === '0' ? null : val;
                }
            },
            url() {
                return `/contracts/${this.hospitalId}/list`;
            },
            hospitalId() {
                return this.$store.state.userInfo.osId;
            },
            searchRules() {
                return {
                    startTime: {
                        validator: (rule, start, callback) => {
                            const end = this.searchAdvanced.endTime;
                            if (
                                start && end
                                && dayjs(start).valueOf() > dayjs(end).valueOf()
                            ) {
                                callback(new Error('开始时间不能超过结束时间'));
                            } else {
                                callback();
                            }
                        }
                    }
                };
            },
            contractTypes() {
                return [
                    {label: '全部', value: null},
                    {label: '维保合同', value: '1'},
                    {label: '采购合同', value: '2'},
                    {label: '维修合同', value: '3'},
                    {label: '其它', value: '4'}
                ];
            },
        },

        created() {
            this.getList();
        },

        methods: {
            getLabelsTitle(labels) {
                return labels
                    .map(
                        ({labelName}) => labelName
                    )
                    .join('，');
            },

            rowClick({id}) {
                this.$router.push({
                    name: 'contract-detail',
                    query: {id}
                });
            },
            tableSettings() {
                this.settings = true;
            }
        }
    }
</script>
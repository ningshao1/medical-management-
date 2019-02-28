<template>
    <div class="annual-plan-list">
        <kld-card noheader>
            <table-wrap
                    :search.sync="search.searchParam"
                    @settings="tableSettings"
                    @fresh="getList"
                    @search-advanced="mergeSearch"
                    search-expanded
                    :number-matched="page.total"
            >
                <div slot="header" >
                    <el-button size="mini">新增</el-button>
                    <el-date-picker
                            v-model="search.apApplyTime"
                            type="year"
                            format="yyyy年"
                            value-format="yyyy"
                            :clearable="false"
                            :editable="false"
                            style="width: 120px;"
                            class="ml-10"
                    ></el-date-picker>
                </div>

                <el-form slot="search-advanced" label-position="left" label-width="100px" :model="searchAdvanced">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="开始时间：" prop="startTime">
                                <el-date-picker v-model="searchAdvanced.startTime" placeholder="请选择开始时间"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="结束时间：" prop="endTime">
                                <el-date-picker v-model="searchAdvanced.endTime" placeholder="请选择结束时间"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="计划状态：" prop="apApproveType">
                                <el-select v-model="searchAdvanced.apApproveType">
                                    <el-option
                                            v-for="{label, value} in planStatusOptions"
                                            :label="label"
                                            :value="value"
                                            :key="value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="采购类型：" prop="apBuyType">
                                <el-select v-model="searchAdvanced.apBuyType">
                                    <el-option
                                            v-for="{label, value} in planTypeOptions"
                                            :label="label"
                                            :value="value"
                                            :key="value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="国产/进口：" prop="apImport">
                                <el-select v-model="searchAdvanced.apImport">
                                    <el-option
                                            v-for="{label, value} in planImportOptions"
                                            :label="label"
                                            :value="value"
                                            :key="value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="选择科室：" prop="sectionId">
                                <tree-select
                                        v-model="searchAdvanced.sectionId"
                                        placeholder="选择科室"
                                        :data="departmentData"
                                        first-expand
                                        :props="treeProps"
                                ></tree-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单价起始：" prop="apAssetMoneyStart">
                                <kld-input-number v-model="searchAdvanced.apAssetMoneyStart" placeholder="单价起始">
                                    <template slot="append">万元</template>
                                </kld-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单价结束：" prop="apAssetMoneyEnd">
                                <kld-input-number v-model="searchAdvanced.apAssetMoneyEnd" placeholder="单价结束">
                                    <template slot="append">万元</template>
                                </kld-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="总价起始：" prop="apTotalPriceStart">
                                <kld-input-number v-model="searchAdvanced.apTotalPriceStart" placeholder="总价起始">
                                    <template slot="append">万元</template>
                                </kld-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="总价结束：" prop="apTotalPriceEnd">
                                <kld-input-number v-model="searchAdvanced.apTotalPriceEnd" placeholder="总价结束">
                                    <template slot="append">万元</template>
                                </kld-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <Tabs v-model="search.temporary">
                    <TabPane label="年度计划" name="0"></TabPane>
                    <TabPane label="临时计划" name="1"></TabPane>
                </Tabs>

                <el-table
                        v-load="loading"
                        :data="data"
                        row-key="apId"
                        :selected.sync="selected"
                        :visible-columns="visibleColumns"
                >
                    <el-table-column type="selection" reserve-selection></el-table-column>
                    <el-table-column type="index" :index="startIndex" label="序号"></el-table-column>
                    <el-table-column label="设备名称">
                        <text-ellipsis slot-scope="{row: {apAssetName: name}}">{{name}}</text-ellipsis>
                    </el-table-column>
                    <el-table-column label="申请科室">
                        <text-ellipsis slot-scope="{row: {osName: name}}">{{name}}</text-ellipsis>
                    </el-table-column>
                    <el-table-column label="申请ID" prop="apId" width="170px" column-key="id"></el-table-column>
                    <el-table-column label="申请时间">
                        <template slot-scope="{row: {apApplyTime: timestamp}}">{{dateFormat(timestamp)}}</template>
                    </el-table-column>
                    <el-table-column label="采购类型" column-key="type">
                        <template slot-scope="{row: {apBuyType: type}}">{{planTypeOptions[type].label}}</template>
                    </el-table-column>
                    <el-table-column label="国产/进口" column-key="import">
                        <template slot-scope="{row: {apImport: importType}}">{{planImportOptions[importType].label}}</template>
                    </el-table-column>
                    <el-table-column label="申请数量" prop="apAssetNum"></el-table-column>
                    <el-table-column label="单价(万元)">
                        <template slot-scope="{row: {apAssetMoney: money}}">{{money}}</template>
                    </el-table-column>
                    <el-table-column label="总价(万元)">
                        <template slot-scope="{row: {apTotalPrice: total}}">{{total}}</template>
                    </el-table-column>
                    <el-table-column label="状态" column-key="status">
                        <template slot-scope="{row}">
                            <span v-for="{text, color} in [getTablePlanStatus(row)]" :class="`text-${color}`">{{text}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请理由" column-key="reason">
                        <text-ellipsis slot-scope="{row: {apBuyWhy: reason}}">{{reason}}</text-ellipsis>
                    </el-table-column>
                </el-table>

                <div slot="footer" class="flex justify-content-between full-width">
                    <div>
                        <dialog-plan-settings :data="selected" @success="getList">
                            <el-button type="default">计划设置</el-button>
                        </dialog-plan-settings>
                        <el-button type="default">批量下载</el-button>
                        <el-button type="default">全部下载</el-button>
                        <el-button type="default">年度预算设置</el-button>
                        <el-button type="default">下载计划详情</el-button>
                    </div>
                    <el-pagination
                            :current-page.sync="page.current"
                            :total="page.total"
                            :page-size="page.size"
                            @current-change="getList"
                    ></el-pagination>
                </div>
            </table-wrap>
        </kld-card>
        <set-columns-visible
                v-model="visibleColumns"
                :visible.sync="settings"
                :items="configurableColumns"
        ></set-columns-visible>
    </div>
</template>

<script>
    import {
        TableWrap,
        KldCard,
        SetColumnsVisible,
        TreeSelect,
        KldInputNumber,
        TextEllipsis,
    } from '@/components';

    import insertCustomRow from './insertCustomRow';

    import {Tabs, TabPane} from '@/element-ui';
    import {List, Common, Department} from '@/mixins';
    import {download} from '@/utils';

    import dayjs from 'dayjs';
    import DialogPlanSettings from './components/DialogPlanSettings';

    export default {
        name: "annual-plan-list",
        mixins: [List, Common, Department],
        components: {
            TableWrap,
            KldCard,
            Tabs,
            TabPane,
            SetColumnsVisible,
            TreeSelect,
            KldInputNumber,
            TextEllipsis,
            DialogPlanSettings
        },
        data() {
            return {
                search: {
                    searchParam: null,
                    apApplyTime: String(new Date().getUTCFullYear()),
                    temporary: "0"
                },
                searchAdvanced: {
                    startTime: null,
                    endTime: null,
                    apBuyType: null,
                    apApproveType: null,
                    apImport: null,
                    apHosId: this.$store.state.userInfo.osId,
                    sectionId: null,
                    apAssetMoneyStart: undefined,
                    apAssetMoneyEnd: undefined,
                    apTotalPriceStart: undefined,
                    apTotalPriceEnd: undefined,
                },
                settings: false,
                visibleColumns: [
                    'id', 'type', 'import', 'status', 'reason'
                ],
                selected: [],
            };
        },
        computed: {
            url() {
                return `/annualPlanTmp/listPC`;
            },
            planStatusOptions() {
                return [
                    {label: '全部', value: null},
                    {label: '已申请', value: 1},
                    {label: '不公示', value: 2},
                    {label: '公示，暂不投票', value: 3},
                    {label: '公示，开始投票', value: 4},
                    {label: '委员会讨论(不通过)', value: 5},
                    {label: '院部讨论', value: 6},
                    {label: '院部讨论(不通过)', value: 11},
                    {label: '卫计委讨论', value: 7},
                    {label: '职工大会', value: 8},
                    {label: '完成', value: 9},
                    {label: '拒绝', value: 10},
                ];
            },
            planTypeOptions() {
                return [
                    {label: '全部', value: null},
                    {label: '0-20万', value: 1},
                    {label: '20万-50万', value: 2},
                    {label: '50万以上', value: 3},
                ];
            },
            planImportOptions() {
                return [
                    {label: '全部', value: null},
                    {label: '国产', value: 1},
                    {label: '进口', value: 2},
                ];
            },

            startIndex() {
                const {page: {current, size}} = this;
                return (current - 1) * size + 1;
            },
            treeProps() {
                return {
                    label: 'osName',
                    children: 'lists'
                }
            },
            configurableColumns() {
                return [
                    {label: '申请ID', value: 'id'},
                    {label: '采购类型', value: 'type'},
                    {label: '国产/进口', value: 'import'},
                    {label: '状态', value: 'status'},
                    {label: '申请理由', value: 'reason'},
                ];
            }
        },

        watch: {
            data() {
                this.updateCustomRow();
            },
            visibleColumns() {
                this.updateCustomRow();
            },
            searchInEffect: {
                deep: true,
                handler() {
                    this.selected = [];
                }
            }
        },

        created() {
            this.getDepartmentData();
            this.getList();
        },
        methods: {
            dateFormat(date) {
                return dayjs(date).format('YYYY-MM-DD');
            },
            tableSettings() {
                this.settings = true;
            },
            getTablePlanStatus(row) {
                let status = [
                    {},
                    {text: '已申请', color: 'blue'},
                    {text: '不公示', color: 'warning'},
                    {text: '公示，暂不投票', color: 'warning'},
                    {text: '公示，开始投票', color: 'warning'},
                    {text: '委员会讨论(未通过)', color: 'danger'},
                    ({hospitalType}) => {
                        if (hospitalType === 0) {
                            return {text: '院部讨论', color: 'info'};
                        } else if (hospitalType === 2) {
                            return {text: '院部讨论(未通过)', color: 'danger'};
                        }
                    },
                    {text: '卫计委讨论', color: 'warning'},
                    {text: '职工大会', color: 'warning'},
                    {text: '完成', color: 'success'},
                    ({unitExpertsType: type1, planningExpertsType: type2}) => {
                        const title = [type1, type2].includes(2) ? '卫计委讨论' : '职工大会';

                        return {
                            text: `${title}(未通过)`,
                            color: 'danger'
                        };
                    }
                ][row.apApproveType];

                if (typeof status === 'function') {
                    status = status(row);
                }
                return status;
            },

            async batchDownload() {
                const {selected} = this;
                if (selected.length === 0) {
                    this.$message({
                        type: 'warning',
                        message: '请选择年度计划'
                    });
                } else {
                    await this.$axios.post(`/annualPlanTmp/excelAll`);
                }
            },

            async updateCustomRow() {
                await this.$nextTick();
                insertCustomRow(1, '.el-table', {
                    textAlign: 'right'
                });
            },
            async removeCustomRow() {
                await this.$nextTick();
                insertCustomRow();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .annual-plan-list {

    }
</style>
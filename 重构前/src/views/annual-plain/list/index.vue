<template>
    <div class="annual-plain-list">
        <div class="position-to-title">
            <div>
                <Button @click="openPlainTemplateModal" class="kld-btn" v-if="checkLimit('annual:add')">新增年度计划</Button>
                <DatePicker @on-change="getExceedBudgetData" :clearable="false" format="申请年份  yyyy年" :value="searchData.apApplyTime" @input="searchData.apApplyTime = moment($event).format('YYYY')" type="year" placeholder="申请年份" class="kld-date-picker" style="width: 200px; margin-left: 4px;" :editable="false"></DatePicker>
            </div>
        </div>
        <div class="search-wrap kld-box-effect">
            <Form :model="searchData" ref="search-form">
                <div class="flex-wrap">
                    <div>
                        <Row :gutter="20">
                            <i-col span="6">
                                <FormItem prop="searchParam">
                                    <i-input v-model="searchData.searchParam" class="kld-input" placeholder="设备名称/申请ID"></i-input>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <Row :gutter="20">
                                    <i-col span="11">
                                        <FormItem prop="startTime">
                                            <DatePicker :value="searchData.startTime" @on-change="searchData.startTime = $event" class="kld-date-picker" placeholder="开始时间"></DatePicker>
                                        </FormItem>
                                    </i-col>
                                    <i-col span="2" style="text-align: center; line-height: 44px;">至</i-col>
                                    <i-col span="11">
                                        <FormItem prop="endTime">
                                            <DatePicker :value="searchData.endTime" @on-change="searchData.endTime = $event" class="kld-date-picker" placeholder="结束时间"></DatePicker>
                                        </FormItem>
                                    </i-col>
                                </Row>
                            </i-col>
                            <i-col span="6">
                                <FormItem prop="apApproveType">
                                    <Select v-model="searchData.apApproveType" class="kld-select" placeholder="计划状态">
                                        <Option value="">全部</Option>
                                        <Option :value="1">已申请</Option>
                                        <Option :value="2">不公示</Option>
                                        <Option :value="3">公示，暂不投票</Option>
                                        <Option :value="4">公示，开始投票</Option>
                                        <Option :value="5">委员会讨论(不通过)</Option>
                                        <Option :value="6">院部讨论</Option>
                                        <Option :value="11">院部讨论(不通过)</Option>
                                        <Option :value="7">卫计委讨论</Option>
                                        <Option :value="8">职工大会</Option>
                                        <Option :value="9">完成</Option>
                                        <Option :value="10">拒绝</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem prop="apBuyType">
                                    <Select v-model="searchData.apBuyType" class="kld-select" placeholder="采购类型">
                                        <Option value="">全部</Option>
                                        <Option :value="1">0-20万</Option>
                                        <Option :value="2">20万-50万</Option>
                                        <Option :value="3">50万以上</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                        </Row>
                        <Row :gutter="20" style="margin-top: 20px;">
                            <i-col span="6">
                                <FormItem prop="apImport">
                                    <Select v-model="searchData.apImport" class="kld-select" placeholder="国产/进口">
                                        <Option value="">全部</Option>
                                        <Option :value="1">国产</Option>
                                        <Option :value="2">进口</Option>
                                    </Select>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem prop="sectionId">
                                    <kld-tree-select
                                            clearable
                                            first-expanded
                                            v-model="searchData.sectionId"
                                            :data="sectionData"
                                            placeholder="选择科室"
                                            filterable
                                    ></kld-tree-select>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <Row :gutter="20">
                                    <i-col span="11">
                                        <FormItem prop="apAssetMoneyStart">
                                            <kld-input-number number v-model="searchData.apAssetMoneyStart" placeholder="单价起始">
                                                <template slot="append">万</template>
                                            </kld-input-number>
                                        </FormItem>
                                    </i-col>
                                    <i-col style="line-height: 44px; text-align: center;" span="2">至</i-col>
                                    <i-col span="11">
                                        <FormItem prop="apAssetMoneyEnd">
                                            <kld-input-number number v-model="searchData.apAssetMoneyEnd" placeholder="单价结束">
                                                <template slot="append">万</template>
                                            </kld-input-number>
                                        </FormItem>
                                    </i-col>
                                </Row>
                            </i-col>
                            <i-col span="6">
                                <Row :gutter="20">
                                    <i-col span="11">
                                        <FormItem prop="apTotalPriceStart">
                                            <kld-input-number number v-model="searchData.apTotalPriceStart" placeholder="总价起始">
                                                <template slot="append">万</template>
                                            </kld-input-number>
                                        </FormItem>
                                    </i-col>
                                    <i-col style="line-height: 44px; text-align: center;" span="2">至</i-col>
                                    <i-col span="11">
                                        <FormItem prop="apTotalPriceEnd">
                                            <kld-input-number number v-model="searchData.apTotalPriceEnd" placeholder="总价结束">
                                                <template slot="append">万</template>
                                            </kld-input-number>
                                        </FormItem>
                                    </i-col>
                                </Row>
                            </i-col>
                        </Row>
                    </div>
                    <div>
                        <Button @click="resetSearch" class="kld-btn-default">重置</Button>
                    </div>
                </div>
            </Form>
        </div>

        <Tabs type="card" class="mt-20" v-model="searchData.temporary">
            <TabPane
                    v-for="(label, index) in ['年度计划', '临时计划']"
                    :label="label"
                    :name="index.toString()"
                    :key="index"
            >
                <div class="table-wrap kld-box-effect border-none">
                    <Loading v-if="tableLoading"></Loading>
                    <kld-table
                            ref="annual-table"
                            :data="tableData"
                            :columns="tableColumns"
                            :selected.sync="tableSelected"
                            :visible-columns="visibleColumns"
                            row-key="apId"
                            @on-row-click="rowClick"
                    ></kld-table>
                    <div class="table-footer">
                        <Row type="flex" align="middle" justify="space-between">
                            <i-col>
                                <Row type="flex" align="middle" :gutter="10">
                                    <i-col style="width: 40px;"></i-col>
                                    <i-col v-if="checkLimit('annual:setup')">
                                        <Button @click="openPlainSettingsModal">计划设置</Button>
                                    </i-col>
                                    <template v-if="checkLimit('annual:excel')">
                                        <i-col>
                                            <Button @click="downloadExcel()" :loading="isDownloading">批量下载</Button>
                                        </i-col>
                                        <i-col>
                                            <Button @click="downloadExcel(true)" :loading="isAllDownloading">全部下载</Button>
                                        </i-col>
                                    </template>
                                    <i-col v-if="checkLimit('annual:budget')">
                                        <Button @click="openAnnualBudgetModal">年度预算设置</Button>
                                    </i-col>
                                    <i-col v-if="checkLimit('annual:word')">
                                        <Button @click="downWord">下载计划详情</Button>
                                    </i-col>
                                </Row>
                            </i-col>
                            <i-col>
                                <kld-page @on-change="getAnnualList" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
                            </i-col>
                        </Row>
                    </div>
                    <a @click="openCustomColumnsModal" href="javascript:" class="table-columns-filter">
                        <Icon size="26" color="#999" type="android-more-vertical"></Icon>
                    </a>
                </div>
            </TabPane>
        </Tabs>


        <Modal v-model="customColumnsModal.show" title="自定义列表项" class-name="vertical-center-modal" @on-ok="customColumnsModalConfirm">
            <CheckboxGroup v-model="customColumnsModal.cacheShowColumns" class="custom-columns-modal">
                <Row>
                    <i-col span="6">
                        <Checkbox label="申请科室" disabled size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="设备名称" disabled size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="状态" disabled size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="国产/进口" size="large"></Checkbox>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="6">
                        <Checkbox label="单价(万元)" disabled size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="申请数量" disabled size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="总价(万元)" disabled size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="申请ID" size="large"></Checkbox>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="6">
                        <Checkbox label="采购类型" size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="申请时间" size="large"></Checkbox>
                    </i-col>
                    <i-col span="6">
                        <Checkbox label="申请理由" size="large"></Checkbox>
                    </i-col>
                </Row>
            </CheckboxGroup>
        </Modal>

        <Modal v-model="annualBudgetModal.show" title="本年度总预算" class-name="vertical-center-modal">
            <Loading v-if="annualBudgetModal.loading"></Loading>
            <Form class="annual-budget" label-position="top">
                <FormItem>
                    <p slot="label">价格
                        <span style="color: #a9a8a9">(万元)</span>
                        <!--<span class="kld-error">(最大值2100000000)</span>-->
                    </p>
                    <kld-input-number @on-keydown.enter="annualBudgetModalConfirm" :max="2100000000" :min="0" v-model="annualBudgetModal.money" number placeholder="请输入2100000000以内的数值">
                        <div slot="prepend" style="width: 24px;">
                            <Icon type="social-yen" color="#666"></Icon>
                        </div>
                    </kld-input-number>
                </FormItem>
            </Form>
            <template slot="footer">
                <Button @click="annualBudgetModal.show = false" class="kld-btn-default">取消</Button>
                <Button :loading="annualBudgetModal.submitLoading" @click="annualBudgetModalConfirm" class="kld-btn">
                    确定
                </Button>
            </template>
        </Modal>

        <Modal v-model="plainTemplateModal.show" title="年度计划模板选择" class-name="vertical-center-modal" @on-ok="plainTemplateModalConfirm">
            <RadioGroup v-model="plainTemplateModal.temporary" @on-change="temporaryChange" class="full-width">
                <Row class="mb-20">
                    <i-col span="12">
                        <Radio :label="0" size="large">年度计划</Radio>
                    </i-col>
                    <i-col span="12">
                        <Radio :label="1" size="large">临时计划</Radio>
                    </i-col>
                </Row>
            </RadioGroup>
            <RadioGroup v-if="plainTemplateModal.temporary === 0" v-model="plainTemplateModal.type" class="full-width">
                <Row class="mb-20">
                    <i-col span="12">
                        <Radio label="1" size="large">0-50<!--(不含50)-->万元</Radio>
                    </i-col>
                    <i-col span="12">
                        <Radio label="2" size="large">50万-200(不含200)万元以下</Radio>
                    </i-col>
                </Row>
                <Row class="mb-20">
                    <i-col span="12">
                        <Radio label="3" size="large">200(含200)万元以上</Radio>
                    </i-col>
                </Row>
            </RadioGroup>
        </Modal>

        <Modal v-model="plainSettingsModal.show" title="计划设置" class-name="vertical-center-modal" @on-ok="plainSettingsModalConfirm">
            <RadioGroup v-model="plainSettingsModal.type" class="plain-settings-modal">
                <Row>
                    <i-col span="12">
                        <Radio :label="3" size="large">公示，暂不投票</Radio>
                    </i-col>
                    <i-col span="12">
                        <Radio :label="4" size="large">公示，开始投票</Radio>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="12">
                        <Radio :label="2" size="large">不公示</Radio>
                    </i-col>
                    <!--<i-col span="12">-->
                    <!--<Radio :label="5" size="large">关闭投票</Radio>-->
                    <!--</i-col>-->
                </Row>
            </RadioGroup>
            <template slot="footer">
                <Button @click="plainSettingsModal.show = false" class="kld-btn-default">取消</Button>
                <Button :loading="plainSettingsModal.submitLoading" @click="plainSettingsModalConfirm" class="kld-btn">
                    确定
                </Button>
            </template>
        </Modal>
        <printDown ref='prDown' style="display:none"></printDown>
        <printUp ref='prUp' style="display:none"></printUp>
    </div>
</template>

<script>
    import kldPage from "@common/page/page";
    import kldInputNumber from "@common/kld-input-number";
    import kldTreeSelect from "@common/kld-tree-select";
    import transformTreeData from "@common/transformSectionTreeData";
    import moment from "moment";
    import emptyToNull from "@common/empty-to-null";

    import {tableRenderEllipsis} from '@/utils';
    import {KldTable} from '@/components';

    import $ from "jquery";
    import printDown from "./../add-annual/detail-annual/print-details/index";
    import printUp from "./../add-annual-fifty/common/print";

    const download = (blob, filename) => {
    const link = document.createElement("a");
        link.setAttribute("download", filename);
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(URL.revokeObjectURL, 10, link.href);
    };

export default {
    name: "annual-plain-list",
    components: { kldPage, kldInputNumber, kldTreeSelect, printDown, printUp , KldTable},
    data() {
        return {
            tableLoading: false,
            tableData: [],
            tableColumns: [],

            tableSelected: [],

            searchData: {
                searchParam: "",
                apBuyType: "",
                apApproveType: "",
                apImport: "",
                apHosId: this.$store.state.user_in.osId,
                apApplyTime: new Date().getFullYear().toString(),
                sectionId: "",
                startTime: "",
                endTime: "",
                apAssetMoneyStart: "",
                apAssetMoneyEnd: "",
                apTotalPriceStart: "",
                apTotalPriceEnd: "",
                temporary: '0'
                // map: {
                //     buyType: '',
                //     id: '',
                //     applyTime: '',
                //     buyWhy: ''
                // }
            },
            searchUnset: true,

            pageData: {
                current: 1,
                pageSize: 10,
                total: 0
            },

            sectionData: [],

            isDownloading: false,
            isAllDownloading: false,

            customColumnsModal: {
                show: false,
                allColumns: [
                    {
                        type: "selection",
                        key: "selection",
                        // title: " ",
                        className: "table-checkbox",
                        width: 60
                    },
                    {
                        title: "序号",
                        key: "序号",
                        width: 66,
                        render: (h, { index }) => {
                            const { current, pageSize } = this.pageData;
                            return h(
                                "span",
                                (current - 1) * pageSize + index + 1
                            );
                        }
                    },
                    {
                        title: "设备名称",
                        key: "设备名称",
                        minWidth: 96,
                        render: tableRenderEllipsis('apAssetName')
                    },
                    {
                        title: "申请科室",
                        key: "申请科室",
                        width: 96,
                        render: tableRenderEllipsis('osName')
                    },
                    {
                        title: "申请ID",
                        key: "申请ID",
                        minWidth: 96,
                        maxWidth: 200,
                        render: tableRenderEllipsis('apId')
                    },
                    {
                        title: "申请时间",
                        key: "申请时间",
                        width: 121,
                        render(h, { row: { apApplyTime } }) {
                            return h(
                                "span",
                                moment(apApplyTime).format("YYYY-MM-DD")
                            );
                        }
                    },
                    {
                        title: "采购类型",
                        key: "采购类型",
                        width: 110,
                        render(h, { row: { apBuyType } }) {
                            let text = "";
                            switch (apBuyType) {
                                case 1:
                                    text = "0-20万";
                                    break;
                                case 2:
                                    text = "20万-50万";
                                    break;
                                case 3:
                                    text = "50万以上";
                            }
                            return h("span", text);
                        }
                    },
                    {
                        title: "国产/进口",
                        key: "国产/进口",
                        width: 100,
                        render(h, { row: { apImport } }) {
                            return h("span", apImport === 1 ? "国产" : "进口");
                        }
                    },
                    {
                        title: "申请数量",
                        width: 96,
                        key: "申请数量",
                        render: tableRenderEllipsis('apAssetNum')
                    },
                    {
                        title: "单价(万元)",
                        width: 102,
                        key: "单价(万元)",
                        render: tableRenderEllipsis('apAssetMoney')
                    },
                    {
                        title: "总价(万元)",
                        width: 102,
                        key: "总价(万元)",
                        render: tableRenderEllipsis('apTotalPrice')
                    },
                    {
                        title: "状态",
                        key: "状态",
                        width: 158,
                        render(
                            h,
                            {
                                row: {
                                    apApproveType,
                                    unitExpertsType,
                                    planningExpertsType,
                                    hospitalType
                                }
                            }
                        ) {
                            let text = "",
                                color = "";

                            switch (apApproveType) {
                                case 1:
                                    text = "已申请";
                                    color = "#2195ec";
                                    break;
                                case 2:
                                    text = "不公示";
                                    color = "#fe881a";
                                    break;
                                case 3:
                                    text = "公示，暂不投票";
                                    color = "#fe881a";
                                    break;
                                case 4:
                                    text = "公示，开始投票";
                                    color = "#fe881a";
                                    break;
                                case 5:
                                    text = "委员会讨论(未通过)";
                                    color = "#e7485a";
                                    break;
                                case 6:
                                    if (hospitalType === 0) {
                                        text = "院部讨论";
                                        color = "#0c8399";
                                    } else if (hospitalType === 2) {
                                        text = "院部讨论(未通过)";
                                        color = "#e7485a";
                                    }
                                    break;
                                case 7:
                                    text = "卫计委讨论";
                                    color = "#fe881a";
                                    break;
                                case 8:
                                    text = "职工大会";
                                    color = "#fe881a";
                                    break;
                                case 9:
                                    text = "完成";
                                    color = "#2195ec";
                                    break;
                                case 10:
                                    if (
                                        unitExpertsType === 2 ||
                                        planningExpertsType === 2
                                    ) {
                                        text = "卫计委讨论(未通过)";
                                    } else {
                                        text = "职工大会(未通过)";
                                    }
                                    color = "#e7485a";
                            }
                            return h("span", { style: { color } }, text);
                        }
                    },
                    {
                        title: "申请理由",
                        key: "申请理由",
                        minWidth: 100,
                        maxWidth: 180,
                        render: tableRenderEllipsis('apBuyWhy')
                    }
                ],
                configurableColumns: [
                    "申请科室",
                    "设备名称",
                    "状态",
                    "国产/进口",
                    "单价(万元)",
                    "申请数量",
                    "总价(万元)",
                    "申请ID",
                    "采购类型",
                    "申请时间",
                    "申请理由"
                ],
                showColumns: JSON.parse(
                    localStorage.getItem("annual-plain-list-show-columns")
                ) || [
                    "申请科室",
                    "设备名称",
                    "状态",
                    "国产/进口",
                    "单价(万元)",
                    "申请数量",
                    "总价(万元)",
                    "申请ID",
                    "采购类型",
                    "申请时间"
                ],
                cacheShowColumns: []
            },

            annualBudgetModal: {
                show: false,
                submitLoading: false,
                loading: false,
                money: ""
            },

            plainTemplateModal: {
                show: false,
                type: "1",
                temporary: 0
            },

            plainSettingsModal: {
                show: false,
                submitLoading: false,
                type: ""
            },

            exceedBudgetData: {}
        };
    },
    watch: {
        //控制table列的显示隐藏
        "customColumnsModal.showColumns": {
            handler(showColumns) {
                const {
                        allColumns,
                        configurableColumns
                    } = this.customColumnsModal,
                    tableColumns = [];
                for (const columns of allColumns) {
                    if (configurableColumns.includes(columns.title)) {
                        if (showColumns.includes(columns.title)) {
                            tableColumns.push(columns);
                        }
                    } else {
                        tableColumns.push(columns);
                    }
                }

                localStorage.setItem(
                    "annual-plain-list-show-columns",
                    JSON.stringify(showColumns)
                );
                this.tableColumns = tableColumns;
            },
            immediate: true
        },
        searchData: {
            handler(searchData) {
                if (
                    this.validateSearchDate(
                        searchData.startTime,
                        searchData.endTime
                    )
                ) {
                    this.resetAnnualList();
                } else {
                    this.$Message.warning("开始时间不能超过结束时间");
                }

                // this.searchUnset = Object.entries(searchData).every(
                //     ([key, value]) =>
                //         key === "apHosId" ||
                //         key === "apApplyTime" ||
                //         value === ""
                // );

                this.tableSelected = [];
            },
            deep: true
        },

        shouldUpdateExceedBudgetTr() {
            this.$nextTick(this.insertExceedBudgetTr);
        },
        tableData() {
            this.$nextTick(this.insertExceedBudgetTr);
        }
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        },
        shouldUpdateExceedBudgetTr() {
            return (
                this.searchUnset +
                JSON.stringify(this.tableColumns) +
                JSON.stringify(this.exceedBudgetData)
            );
        },

        visibleColumns() {
            return ['selection', '序号'].concat(this.customColumnsModal.showColumns);
        }
    },

    created() {
        this.getSectionData();
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.tableSelected = [];
            vm.getAnnualList();
            vm.getExceedBudgetData();
        });
    },

    methods: {
        moment,

        async getAnnualList() {
            this.tableLoading = true;
            const { current, pageSize } = this.pageData,
                { data: { data, recordsTotal } } = await this.$axios
                    .post("/annualPlanTmp/listPC", {
                        offset: (current - 1) * pageSize,
                        limit: pageSize,
                        params: emptyToNull(this.searchData)
                    })
                    .finally(() => (this.tableLoading = false));

            this.tableData = data;
            this.pageData.total = recordsTotal;
        },

        resetAnnualList() {
            this.pageData.current = 1;
            return this.getAnnualList();
        },

        async getSectionData() {
            const { data } = await this.$axios.get(
                `/orgstruct/findAllTree/${this.user_in.osId}`
            );
            this.sectionData = transformTreeData(data);
        },

        async getExceedBudgetData() {
            const { data } = await this.$axios.post(
                "/annualPlanTmp/getAnnualBudget",
                emptyToNull(this.searchData)
                // {
                //     hosId: this.user_in.osId,
                //     time: this.searchData.apApplyTime
                // }
            );

            this.exceedBudgetData = data;
        },

        insertExceedBudgetTr() {
            const $table = $(this.$refs["annual-table"][this.searchData.temporary].$el),
                { sum, money, count } = this.exceedBudgetData,
                { current, pageSize } = this.pageData,
                currentCount = count - (current - 1) * pageSize,
                $tbody = $table.find("tbody.ivu-table-tbody");

            $tbody.find(".exceed-budget").remove();

            if (
                count &&
                this.searchUnset &&
                currentCount > 0 &&
                currentCount <= pageSize
            ) {
                const index = currentCount - 1,
                    $tr = $('<tr class="exceed-budget"></tr>');

                $tr.html(`
                        <td colspan="${this.tableColumns.length}">
                            <div>
                                共${count}条申请，总申请${sum}万元，第${
                    count === 1 ? "" : "1-"
                }${count}条，总预算：￥${money}万元
                            </div>
                        </td>
                    `);

                $tbody
                    .children()
                    .eq(index)
                    .after($tr);
            }
        },

        rowClick({
                     apId: id,
                     planType: type,
                     apApproveType: step,
                     unitExpertsType,
                     planningExpertsType,
                     hospitalType
                 }) {
            if (type === 1) {
                let routeName = "";
                const TempRouteName=this.searchData.temporary==="1"?"short-annual":"add-annual";
                switch (step) {
                    case 0:
                        routeName = "short-annual";
                         break;
                    case 2:
                    case 3:
                    case 5:
                    case 9:
                    case 10:
                        routeName = "detail-annual";
                        break;
                    case 6:
                        if (hospitalType === 0) {
                            routeName = TempRouteName;
                        } else if (hospitalType === 2) {
                            routeName = "detail-annual";
                        }
                        break;
                    default:
                        routeName =TempRouteName;
                }

                type = type.toString();
                step = step.toString();
                unitExpertsType = unitExpertsType.toString();
                planningExpertsType = planningExpertsType.toString();
                hospitalType = hospitalType.toString();

                this.$router.push({
                    name: routeName,
                    query: {
                        id,
                        type,
                        step,
                        unitExpertsType,
                        planningExpertsType,
                        hospitalType
                    }
                });
            } else {
                type = String(type);
                this.$router.push({
                    name: "fifty-annual-details",
                    query: { id, type }
                });
            }
        },

        async downloadExcel(isAll = false) {
            if (!isAll && this.tableSelected.length === 0) {
                this.$Message.destroy();
                this.$Message.warning("请选择年度计划");
            } else {
                const column = {
                        applyId: "申请ID",
                        applyTime: "申请时间",
                        buyType: "采购类型",
                        importation: "国产/进口",
                        sectionName: "申请科室",
                        assetName: "设备名称",
                        assetNum: "申请数量",
                        assetMoney: "单价(万元)",
                        totalPrice: "总价(万元)",
                        approveType: "状态",
                        buyWhy: "申请理由"
                    },
                    loadingField = isAll ? "isAllDownloading" : "isDownloading",
                    { customColumnsModal: { showColumns } } = this;

                for (const [key, value] of Object.entries(column)) {
                    column[key] = String(showColumns.includes(value));
                }

                this[loadingField] = true;

                try {
                    const { data: blob } = await this.$axios.post(
                        `/annualPlanTmp/excel${isAll ? "All" : ""}`,
                        isAll
                            ? {
                                  years: this.searchData.apApplyTime,
                                  column
                              }
                            : {
                                  ids: this.tableSelected.map(
                                      ({ apId }) => apId
                                  ),
                                  column
                              },
                        { responseType: "blob" }
                    );
                    download(blob, "年度计划列表.xls");
                } finally {
                    this[loadingField] = false;
                }
            }
        },

        //打开
        openCustomColumnsModal() {
            this.customColumnsModal.cacheShowColumns = [
                ...this.customColumnsModal.showColumns
            ];
            this.customColumnsModal.show = true;
        },

        customColumnsModalConfirm() {
            this.customColumnsModal.showColumns = [
                ...this.customColumnsModal.cacheShowColumns
            ];
        },

        async openAnnualBudgetModal() {
            this.annualBudgetModal.show = true;
            this.annualBudgetModal.loading = true;
            const { data } = await this.$axios
                .get(
                    `/annualPlanTmp/getAnnualBudgetMoney/${this.user_in.osId}/${
                        this.searchData.apApplyTime
                    }`
                )
                .finally(() => (this.annualBudgetModal.loading = false));

            this.annualBudgetModal.money = data || "";
        },
        async annualBudgetModalConfirm() {
            const money = this.annualBudgetModal.money;
            if (money === "") {
                this.$Message.destroy();
                this.$Message.warning("请输入预算金额");
            } else {
                this.annualBudgetModal.submitLoading = true;
                await this.$axios
                    .post("/annualPlanTmp/saveAnnualBudget", {
                        hosId: this.user_in.osId,
                        time: this.searchData.apApplyTime,
                        money
                    })
                    .finally(
                        () => (this.annualBudgetModal.submitLoading = false)
                    );
                this.annualBudgetModal.show = false;
                this.$Message.success("年度预算设置成功");
                this.resetAnnualList();
                this.getExceedBudgetData();
            }
        },

        /*年度计划模板选择Modal的操作*/
        openPlainTemplateModal() {
            this.plainTemplateModal.type = "1";
            this.plainTemplateModal.temporary = 0;
            this.plainTemplateModal.show = true;
        },
        plainTemplateModalConfirm() {
            let {plainTemplateModal: {type, temporary}} = this;

            if (temporary === 1) {
                type = '0';
                this.plainTemplateModal.show = false;
            }



            let routeName = "";

            switch (type) {
                case "0":
                  routeName = "short-annual";
                  break;
                case "1":
                    routeName = "add-annual";
                    break;
                default:
                    routeName = "add-annual-fifty";
            }
            this.$router.push({
                name: routeName,
                query: {
                    type,
                    step: "0"
                }
            });
        },
        temporaryChange(value) {
            if (value === 1) {
                this.plainTemplateModalConfirm();
            }
        },
        /*****************************/

        openPlainSettingsModal() {
            this.plainSettingsModal.type = "";
            this.plainSettingsModal.show = true;
        },

        async plainSettingsModalConfirm() {
            const selected = this.tableSelected,
                type = this.plainSettingsModal.type;

            this.$Message.destroy();
            if (selected.length === 0) {
                this.$Message.warning("请选择年度计划");
            } else if (type === "") {
                this.$Message.warning("请选择年度计划状态");
            } else {
                this.plainSettingsModal.submitLoading = true;

                await this.$axios
                    .put("/annualPlanTmp/updateAnnualPlanType", {
                        approveType: type,
                        ids: selected.map(({ apId }) => apId)
                    })
                    .finally(
                        () => (this.plainSettingsModal.submitLoading = false)
                    );

                this.plainSettingsModal.show = false;
                this.$Message.success("计划设置成功");
                // this.resetAnnualList();
                this.getAnnualList();
            }
        },

        //重置搜索
        resetSearch() {
            this.$refs["search-form"].resetFields();
            this.searchData.apApplyTime = new Date().getFullYear().toString();
        },

        //验证搜索的开始时间和结束时间
        validateSearchDate(startTime, endTime) {
            if (startTime && endTime) {
                startTime = moment(startTime, "YYYY-MM-DD")
                    .toDate()
                    .getTime();
                endTime = moment(endTime, "YYYY-MM-DD")
                    .toDate()
                    .getTime();

                return startTime <= endTime;
            } else {
                return true;
            }
        },

        downWord() {
            Promise.all(
                this.tableSelected.map(v => {
                    return this.$axios.get(
                        `/annualPlanTmp/${v.apId}?type=${
                            v.planType === 3 ? 2 : v.planType
                        }`
                    );
                })
            ).then(res => {
                res.map(data => {
                    if (data.data.buyType === 1 || data.data.buyType === 2) {
                        console.log(data.data);
                        this.$refs["prDown"].print(
                            data.data,
                            `${data.data.sectionName}：${
                                data.data.assetName
                            }设备配置论证表`
                        );
                    } else {
                        this.$refs["prUp"].print(
                            data.data,
                            `${data.data.sectionName}：${
                                data.data.assetName
                            }可行性论证报告`
                        );
                        this.$refs["prDown"].print(
                            data.data,
                            `${data.data.sectionName}：${
                                data.data.assetName
                            }设备配置论证表`
                        );
                    }
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
    .search-wrap {
        .flex-wrap {
            display: flex;
            > div:first-of-type {
                flex-grow: 1;
            }
            > div:last-of-type {
                flex-shrink: 0;
                margin-left: 20px;
            }
        }
    }

    .table-wrap {
        padding: 0;
        position: relative;
        /deep/ .ivu-table {
            background-color: transparent;
            font-size: 14px;
            border-bottom: 1px solid #e9eaec;
            &::before,
            &::after {
                display: none;
            }
            table {
                width: 100% !important;
            }
            tr {
                height: 50px;
                &:last-of-type {
                    td {
                        border-bottom: 0;
                    }
                }

                &.exceed-budget {
                    td {
                        height: 54px;
                    }
                    div {
                        width: 100%;
                        height: initial;
                        background-color: #e6e6e6;
                        text-align: right;
                        line-height: 54px;
                        padding: 0 20px;
                    }
                }
            }
            th,
            td {
                background-color: transparent;
            }

            th.table-checkbox,td.table-checkbox {
                pointer-events: none;
                > .ivu-table-cell {
                    /*padding: 2px;*/
                    .ivu-checkbox {
                        pointer-events: auto;
                    }
                }
            }
            th.table-checkbox {
                /*> .ivu-table-cell {*/
                /*font-size: 0;*/
                /*padding: 0;*/
                /*position: absolute;*/
                /*bottom: -44px;*/
                /*left: 22px;*/
                /*}*/
            }
        }
        > .table-footer {
            padding: 14px 20px;
            background-color: rgba(235, 235, 235, 0.5);
            .ivu-btn {
                height: 44px;
                font-size: 14px;
                background-color: #fff;
            }
        }

        > .table-columns-filter {
            position: absolute;
            right: 0;
            top: 0;
            width: 20px;
            height: 50px;
            display: flex;
            align-items: center;
        }
    }

    .custom-columns-modal,
    .plain-template-modal,
    .plain-settings-modal {
        width: 100%;
        .ivu-row {
            margin-bottom: 30px;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
</style>
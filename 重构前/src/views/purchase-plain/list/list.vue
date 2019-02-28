<template>
    <div class="purchase-plain-list">
        <div class="position-to-title">
            <div>
                <DatePicker :clearable="false" format="申请年份  yyyy年" :value="searchData.apApplyTime" @input="searchData.apApplyTime = moment($event).format('YYYY')" type="year" placeholder="申请年份" class="kld-date-picker" style="width: 200px; margin-left: 4px;" :editable="false"></DatePicker>
            </div>
        </div>
        <div class="search-wrap kld-box-effect">
            <Form :model="searchData" ref="search-form">
                <div class="flex-wrap">
                    <div>
                        <Row :gutter="20">
                            <i-col span="6">
                                <FormItem prop="keyWord">
                                    <i-input v-model="searchData.keyWord" class="kld-input" placeholder="设备名称/申请ID"></i-input>
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
                                <FormItem prop="procurementState">
                                    <Select v-model="searchData.procurementState" class="kld-select" placeholder="计划状态">
                                        <Option value="">全部</Option>
                                        <Option :value="1">待申请</Option>
                                        <Option :value="2">已申请</Option>
                                        <Option :value="3">进口论证审批中</Option>
                                        <Option :value="4">进口论证审批不通过</Option>
                                        <Option :value="5">进口论证审批通过</Option>
                                        <Option :value="6">设备参数审批中</Option>
                                        <Option :value="7">设备参数审批不通过</Option>
                                        <Option :value="8">设备参数审批通过</Option>
                                        <Option :value="9">已公示</Option>
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
                                            title-key="osName"
                                            children-key="lists"
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
                    v-for="(label, index) in ['采购计划', '临时计划']"
                    :label="label"
                    :name="index.toString()"
                    :key="index"
            >
                <div class="table-wrap kld-box-effect bt-0">
                    <Loading v-if="tableLoading"></Loading>
                    <kld-table
                            ref="purchase-table"
                            :data="tableData"
                            :columns="tableColumns"
                            :selected.sync="tableSelected"
                            :visible-columns="visibleColumns"
                            @on-row-click="rowClick"
                    ></kld-table>
                    <div class="table-footer">
                        <Row type="flex" align="middle" justify="space-between">
                            <i-col>
                                <Row type="flex" align="middle" :gutter="10">
                                    <i-col style="width: 40px;"></i-col>
                                    <i-col v-if="approvalLimit">
                                        <Button @click="applyPurchase">申请</Button>
                                    </i-col>
                                </Row>
                            </i-col>
                            <i-col>
                                <kld-page @on-change="getPurchaseList" :current.sync="pageData.current" :total="pageData.total" :page-size="pageData.pageSize"></kld-page>
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
                    <i-col span="6">
                        <Checkbox label="开标时间" size="large"></Checkbox>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="6">
                        <Checkbox label="开标地点" size="large"></Checkbox>
                    </i-col>
                </Row>
            </CheckboxGroup>
        </Modal>
    </div>
</template>

<script type="text/jsx">
    import {tableRenderEllipsis} from '@/utils';
    import {KldTable, TextEllipsis} from '@/components';

    import kldPage from "@common/page/page";
    import kldInputNumber from "@common/kld-input-number";
    import kldTreeSelect from "@common/kld-tree-select";
    import moment from "moment";
    import emptyToNull from "@common/empty-to-null";
    import {debounce} from '@/utils';
    import $Confirm from '@common/kld-confirm';

    import $ from "jquery";

    export default {
        name: "purchase-plain-list",
        components: { kldPage, kldInputNumber, kldTreeSelect, KldTable},
        data() {
            return {
                approvalLimit: this.checkLimit('purchase:add'),

                tableLoading: false,
                tableData: [],
                tableColumns: [],

                tableSelected: [],

                searchData: {
                    keyWord: '',
                    startTime: "",
                    endTime: "",
                    procurementState: '',
                    apBuyType: '',
                    apImport: '',
                    apAssetMoneyStart: '',
                    apAssetMoneyEnd: '',
                    apTotalPriceStart: '',
                    apTotalPriceEnd: '',
                    apApplyTime: new Date().getFullYear().toString(),
                    temporary: '0'
                },

                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 0
                },

                sectionData: [],


                customColumnsModal: {
                    show: false,
                    allColumns: [
                        {
                            type: "selection",
                            key: "selection",
                            className: "table-checkbox",
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: "序号",
                            key: "序号",
                            width: 66,
                            render: (h, { index }) => {
                                const { current, pageSize } = this.pageData;
                                return <span>{(current - 1) * pageSize + index + 1}</span>;
                            }
                        },
                        {
                            title: "设备名称",
                            key: "设备名称",
                            width: 200,
                            render: tableRenderEllipsis('apAssetName')
                        },
                        {
                            title: "申请科室",
                            key: "申请科室",
                            width: 92,
                            render: tableRenderEllipsis('osName')
                        },
                        {
                            title: "申请ID",
                            key: "申请ID",
                            width: 180,
                            render: (h, { row: { purchaseId, ap_id } }) => <TextEllipsis>{purchaseId || ap_id}</TextEllipsis>
                        },
                        {
                            title: "申请时间",
                            key: "申请时间",
                            width: 121,
                            render(h, { row: { applytime, ap_apply_time } }) {
                                return <span>{moment(applytime || ap_apply_time).format("YYYY-MM-DD")}</span>;
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
                                return <span>{text}</span>;
                            }
                        },
                        {
                            title: "国产/进口",
                            key: "国产/进口",
                            width: 100,
                            render(h, { row: { apImport } }) {
                                return <span>{apImport === 2 ? "进口" : "国产"}</span>;
                            }
                        },
                        {
                            title: "申请数量",
                            key: "申请数量",
                            width: 100,
                            render: tableRenderEllipsis('apAssetNum')
                        },
                        {
                            title: "单价(万元)",
                            key: "单价(万元)",
                            width: 102,
                            render: (h, {row: {apAssetMoney}}) => <TextEllipsis>{apAssetMoney / 10000}</TextEllipsis>
                        },
                        {
                            title: "总价(万元)",
                            key: "总价(万元)",
                            width: 102,
                            render: (h, {row: {apTotalPrice}}) => <TextEllipsis>{apTotalPrice / 10000}</TextEllipsis>
                        },
                        {
                            title: "状态",
                            key: "状态",
                            width: 164,
                            render(h, {row: {pstate}}) {
                                let text = "",
                                    color = "";

                                switch (pstate) {
                                    case 1:
                                        text = "待申请";
                                        color = "#fe881a";
                                        break;
                                    case 2:
                                        text = "已申请";
                                        color = "#2195ec";
                                        break;
                                    case 3:
                                        text = "进口论证审批中";
                                        color = "#fe881a";
                                        break;
                                    case 4:
                                        text = "进口论证审批不通过";
                                        color = "#e7485a";
                                        break;
                                    case 5:
                                        text = "进口论证审批通过";
                                        color = "#2195ec";
                                        break;
                                    case 6:
                                        text = "设备参数审批中";
                                        color = "#fe881a";
                                        break;
                                    case 7:
                                        text = "设备参数审批不通过";
                                        color = "#e7485a";
                                        break;
                                    case 8:
                                        text = "设备参数审批通过";
                                        color = "#2195ec";
                                        break;
                                    case 9:
                                        text = "已公示";
                                        color = "#2195ec";
                                }
                                return <span style={{color}}>{text}</span>;
                            }
                        },
                        {
                            title: "申请理由",
                            key: "申请理由",
                            width: 200,
                            render: tableRenderEllipsis('apBuyWhy')
                        },
                        {
                            title: '开标时间',
                            key: '开标时间',
                            width: 121,
                            render: (h, {row: {bidTime: time}}) => <span>{time && moment(time).format('YYYY-MM-DD')}</span>
                        },
                        {
                            title: '开标地点',
                            key: '开标地点',
                            width: 121,
                            render: tableRenderEllipsis('bidaddress')
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
                        "申请理由",
                        "开标时间",
                        "开标地点",
                    ],
                    showColumns: JSON.parse(
                        localStorage.getItem("purchase-plain-list-show-columns")
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
                        "purchase-plain-list-show-columns",
                        JSON.stringify(showColumns)
                    );
                    this.tableColumns = tableColumns;
                },
                immediate: true
            },
            searchData: {
                handler: debounce(function (searchData) {
                    if (
                        this.validateSearchDate(
                            searchData.startTime,
                            searchData.endTime
                        )
                    ) {
                        this.resetPurchaseList();
                    } else {
                        this.$Message.warning("开始时间不能超过结束时间");
                    }

                    this.tableSelected = [];
                }, 300, {leading: true}),
                deep: true
            },

            tableData(data) {
                let insertIndex = -1;
                for (let index = 0, len = data.length; index < len; index ++) {
                    const {pstate: state} = data[index];
                    if (index === 0) {
                        if (state !== 1) {
                            break;
                        }
                    } else if (state !== 1) {
                        insertIndex = index - 1;
                        break;
                    }
                }

                this.$nextTick(() => {
                    this.insertDivider(insertIndex);
                });
            }
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            },
            visibleColumns() {
                return this.customColumnsModal.showColumns.concat(['selection', '序号']);
            }
        },

        created() {
            this.getSectionData();
        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.tableSelected = [];
                vm.getPurchaseList();
            });
        },


        methods: {
            moment,

            async getPurchaseList() {
                this.tableLoading = true;
                const { current, pageSize } = this.pageData,
                    { data: { data, recordsTotal } } = await this.$axios
                        .post("/purchase/mobileListBySectionId", {
                            offset: (current - 1) * pageSize,
                            limit: pageSize,
                            params: emptyToNull(this.searchData)
                        })
                        .finally(() => (this.tableLoading = false));

                this.tableData = data;
                this.pageData.total = recordsTotal;
            },

            resetPurchaseList() {
                this.pageData.current = 1;
                return this.getPurchaseList();
            },

            async getSectionData() {
                const { data } = await this.$axios.get(
                    `/orgstruct/findAllTree/${this.user_in.osId}`
                );
                this.sectionData = [data];
            },



            insertDivider(index) {
                const $table = $(this.$refs["purchase-table"][this.searchData.temporary].$el),
                    $tbody = $table.find("tbody.ivu-table-tbody");

                $tbody.find(".exceed-budget").remove();

                if (Number(index) >= 0) {
                    const $tr = $(`
                        <tr class="exceed-budget">
                            <td colspan="${this.tableColumns.length}">
                                <div></div>
                            </td>
                        </tr>
                    `);

                    $tbody
                        .children()
                        .eq(index)
                        .after($tr);
                }
            },

            rowClick ({pstate: state, purchaseId: id, apBuyType: type,apImport}) {//apImport add by ck
                if (state > 1) {
                    this.$router.push({
                        name: type === 1 ? 'purchase-under' : apImport=== 2 ? 'purchase-upper-import' : 'purchase-upper',
                        params: {id}
                    })
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



            applyPurchase() {
                const {tableSelected} = this,
                    {length: selectedLength} = tableSelected;

                let valid = false,
                    message = '';

                if (selectedLength === 0) {
                    message = '请选择采购计划';
                } else if (tableSelected.filter(({pstate: state}) => state !== 1).length > 0) {
                    if (selectedLength === 1) {
                        message = '该计划已申请，不可重复申请';
                    } else {
                        message = '所选的采购计划必须全部为待申请，请重新选择';
                    }
                } else {
                    valid = true;

                    if (selectedLength === 1) {
                        const [{apBuyType, apImport}] = tableSelected;
                        if (apBuyType === 1 || apImport === 1) {
                            message = `
                                申请成功！
                                请提交设备技术参数说明！
                            `;
                        } else {
                            message = `
                                申请成功！
                                请提交进口设备论证说明！
                            `;
                        }
                    } else {
                        message = '批量申请成功！';
                    }
                }


                if (valid) {
                    $Confirm({
                        content: `确认申请已选的${selectedLength}条采购计划？`,
                        ok: async () => {
                            await this.$axios.post('/purchase/updateProcurementState', tableSelected);

                            $Confirm({
                                content: message,
                                cancel: false
                            });
                            this.tableSelected = [];
                            this.getPurchaseList();
                        }
                    });
                } else {
                    $Confirm({
                        content: message,
                        cancel: false
                    });
                }
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
                    height: 30px;
                    td{
                        height: 30px;
                    }
                    div {
                        /*width: calc(~"100% + 42px");*/
                        width: 100%;
                        height: 100%;
                        background-color: #e6e6e6;
                        text-align: right;
                    }
                }
            }
            th,
            td {
                background-color: transparent;
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
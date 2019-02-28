<template>
    <div class="statistics-table">
        <div class="year">
            <DatePicker type='year'
                        :value="search.year"
                        @on-change="search.year = $event"
                        format="yyyy"
                        placeholder="选择年份">
            </DatePicker>
        </div>
        <div class="search">
            <i-row :gutter='20'>
                <i-col span='6'>
                    <i-input placeholder='名称/型号/设备序列号/品牌'
                             class="kld-input"
                             v-model="search.keyword">
                    </i-input>
                </i-col>
                <i-col span='6'>
                    <kld-tree-select v-model="search.departmentId"
                                     :data="sectionTreeData"
                                     title-key="osName"
                                     children-key="lists"
                                     placeholder="所属科室"
                                     filterable
                                     first-expanded>
                    </kld-tree-select>
                </i-col>
                <i-col span='6'>
                    <kld-tree-select v-model="search.assertTypeId"
                                     :data="assetTypeList"
                                     title-key="typeName"
                                     children-key="lists"
                                     placeholder="所属分类"
                                     filterable>
                    </kld-tree-select>
                </i-col>
                <i-col span='4'>
                    <i-select placeholder='保修状态'
                              class="kld-select"
                              v-model="search.warrantyStatus">
                        <Option :value="1">在保</Option>
                        <Option :value="2">过保</Option>
                    </i-select>
                </i-col>
                <i-col span='2'>
                    <i-button class='kld-btn'
                              @click="reset">
                        重置
                    </i-button>
                </i-col>
            </i-row>
            <br class="br">
            <i-row :gutter='20'>
                <i-col span='6'>
                    <i-select placeholder='请选择报单人'
                              class="kld-select"
                              filterable
                              ref='creator'
                              :clearable='true'
                              v-model="search.creatorId"
                              remote
                              :remote-method="searchReport"
                              :clearSingleSelect='true'
                              @on-query-change='creatorChange'>
                        <Option v-for="(option, index) in ReportFaultUser"
                                :value="option.userId"
                                :key="index">{{option.userName}}</Option>
                    </i-select>
                </i-col>
                <i-col span='6'>
                    <i-select placeholder='请选择工程师'
                              class="kld-select"
                              filterable
                              ref="Order"
                              v-model="search.userId"
                              remote
                              :remote-method="searchOrder"
                              @on-query-change='OrderChange'
                              :clearable='true'>
                        <Option v-for="(option, index) in OrderFaultUser"
                                :value="option.userId"
                                :key="index">{{option.userName}}</Option>
                    </i-select>
                </i-col>
                <i-col span='11'>
                    <DatePicker :value="search.startTime"
                                @on-change="search.startTime = $event"
                                placeholder="报单开始时间"
                                style="width:42%">
                    </DatePicker>

                    至
                    <DatePicker :value="search.endTime"
                                @on-change="search.endTime = $event"
                                placeholder="报单结束时间"
                                style="width:42%">
                    </DatePicker>
                </i-col>

            </i-row>
        </div>
        <div class="table">
            <a href="javascript:;"
               class="check-header"
               @click="modalShow">
                <Icon type="android-more-vertical"></Icon>
            </a>
            <Table :data='TableData'
                   :columns='filterColumn'
                   ref="selection"
                   v-loading='TableLoading'>
            </Table>
            <div class="page">
                <div class="page-left">
                    <i-checkbox @on-change='allSelect'
                                v-model="allSelectData"></i-checkbox>
                    <i-button class="export"
                              @click="exportTable"
                              :loading='exportTableLoading'>导出所选项</i-button>
                    <i-button class="export"
                              @click="timeStatistics">工时统计</i-button>
                    <transition name="fade">
                        <div class="page-title"
                             v-if='dataAllTime.show'> 总维修时长：<span>{{dataAllTime.allResponse}}小时</span></div>
                    </transition>
                    <transition name="fade">
                        <div class="page-title"
                             v-if='dataAllTime.show'> 总响应时长：<span>{{dataAllTime.allService}}小时</span></div>
                    </transition>

                </div>

                <page @on-change="getTableData"
                      :current.sync="page.current"
                      :page-size="page.size"
                      :total="page.total">
                </page>
            </div>
        </div>
        <i-modal v-model="modal.show"
                 title="自定义列表项"
                 @on-ok='ShowColumns'
                 :styles='{width:"600px"}'>
            <div>
                <CheckboxGroup v-model="modal.checkShowColumns"
                               class="log-columns-modal">
                    <i-row :gutter='20'>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='设备名称'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='所属科室'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='设备品牌'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='设备型号'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='保修状态'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='报单时间'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='响应时长(h)'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='维修用时(h)'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='报单人'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox disabled
                                        class="log-checkbox"
                                        size="large"
                                        label='工程师'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox class="log-checkbox"
                                        size="large"
                                        label='分类'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox class="log-checkbox"
                                        size="large"
                                        label='设备序列号'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox class="log-checkbox"
                                        size="large"
                                        label='维修开始时间'></i-checkbox>
                        </i-col>
                        <i-col span='6'>
                            <i-checkbox class="log-checkbox"
                                        size="large"
                                        label='维修结束时间'></i-checkbox>
                        </i-col>
                    </i-row>
                </CheckboxGroup>
            </div>
        </i-modal>
    </div>
</template>
<script>
import page from "@common/page/index";
import KldTreeSelect from "@common/kld-tree-select";
import moment from "moment";
import { column } from "./config";
export default {
    data() {
        const _self = this;
        return {
            TableData: [],
            column: [
                {
                    title: " ",
                    width: 40,
                    align: "left",
                    render: (h, params) => {
                        return h("Checkbox", {
                            props: {
                                value: params.row.checked
                            },
                            on: {
                                "on-change": select => {
                                    params.row.checked = select;
                                    if (select) {
                                        this.selectData.push(params.row);
                                    } else {
                                        const index = this.selectData.findIndex(
                                            v =>
                                                v.reportID ===
                                                params.row.reportID
                                        );
                                        if (index === -1) return;
                                        this.selectData.splice(index, 1);
                                    }
                                }
                            }
                        });
                    }
                },
                {
                    title: "序号",
                    key: "index",
                    align: "left",
                    width: 60,
                    render: (h, params) => {
                        return h(
                            "div",
                            (this.page.current - 1) * this.page.size +
                                params.index +
                                1
                        );
                    }
                },
                ...column
            ],

            page: {
                size: 10,
                current: 1,
                total: 10
            },
            search: {
                keyword: null,
                warrantyStatus: null,
                departmentId: null,
                startTime: null,
                endTime: null,
                userId: null,
                creatorId: null,
                year: new Date().getFullYear() + "",
                assertTypeId: null
            },
            sectionTreeData: [],
            assetTypeList: [],
            ReportFaultUser: [],
            OrderFaultUser: [],
            allSelectData: false,
            selectData: [],
            dataAllTime: {
                allResponse: 0,
                allService: 0,
                show: false
            },
            modal: {
                show: false,
                // checkShowColumns:_self.column.filter(v=>v.show===true).map(v=>v.title)
                checkShowColumns: []
            },
            exportTableLoading: false
        };
    },
    computed: {
        hosId() {
            return this.$store.state.user_in.osId;
        },
        filterColumn() {
            return this.column.filter(v => v.show !== false);
        }
    },
    components: {
        [page.name]: page,
        [KldTreeSelect.name]: KldTreeSelect
    },
    created() {
        this.getTableData();
        this.getReportFaultUserName();
        this.getOrderFaultUserName();
        this.getSectionTree();
        this.getTypeTree();
    },
    mounted() {
        this.$nextTick(() => {});
    },
    watch: {
        search: {
            deep: true,
            handler() {
                this.page.current = 1;
                this.getTableData();
            }
        }
        // "modal.checkShowColumns"(val) {
        //     this.column.map(v => {
        //         if (val.includes(v.title)) v.show = true;
        //         else v.show = false;
        //     });
        // }
    },
    methods: {
        getTableData() {
            this.TableLoading = true;
            this.$axios
                .post(`/faultReport/listFaultReportStatistical`, {
                    limit: this.page.size,
                    offset: (this.page.current - 1) * this.page.size,
                    params: { ...this.search }
                })
                .then(({ data: { data, recordsTotal } }) => {
                    let tempChecked = true;
                    data.map(v => {
                        const index = this.selectData.findIndex(
                            e => e.reportID === v.reportID
                        );
                        if (index !== -1) v.checked = true;
                        else {
                            v.checked = false;
                            tempChecked = false;
                            this.allSelectData = false;
                        }
                    });
                    if (tempChecked && data.length) {
                        this.allSelectData = true;
                    }
                    this.TableData = data;
                    this.page.total = recordsTotal;
                })
                .finally(() => {
                    this.TableLoading = false;
                    this.$forceUpdate();
                });
        },
        getReportFaultUserName(keyword = "") {
            //查询报单人
            this.$axios
                .post(`/users/getReportFaultUserName`, {
                    hosId: this.hosId,
                    keyword,
                    params: {
                        keyword
                    }
                })
                .then(({ data }) => {
                    this.ReportFaultUser = data;
                });
        },
        getOrderFaultUserName(keyword = "") {
            this.$axios
                .post(`/users/getOrderFaultUserName`, {
                    hosId: this.hosId,
                    params: {
                        keyword
                    }
                })
                .then(({ data }) => {
                    this.OrderFaultUser = data;
                });
        },
        searchReport(query) {
            this.getReportFaultUserName(query);
        },
        searchOrder(query) {
            this.getOrderFaultUserName(query);
        },
        getSectionTree() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.hosId}`)
                .then(({ data }) => {
                    this.sectionTreeData = [data];
                });
        },
        async getTypeTree() {
            const { data } = await this.$axios.get(`assetTypes/typeAllTree`);
            this.assetTypeList = data;
        },
        modalShow() {
            this.modal.checkShowColumns = this.column
                .filter(v => v.show)
                .map(v => v.title);
            this.modal.show = true;
        },
        allSelect(change) {
            if (change) {
                this.TableData.map(v => {
                    const index = this.selectData.findIndex(
                        e => v.reportID === e.reportID
                    );
                    if (index === -1) {
                        this.$set(v, "checked", true);
                        this.selectData.push(v);
                    } else {
                        this.$set(v, "checked", true);
                    }
                });
            } else {
                this.TableData.map(v => {
                    let index = this.selectData.findIndex(e => {
                        return e.reportID === v.reportID;
                    });
                    if (index === -1) {
                        this.$set(v, "checked", false);
                    }
                    this.$set(v, "checked", false);
                    this.selectData.splice(index, 1);
                });
            }
        },
        creatorChange(query) {
            if (query === "") {
                this.$refs.creator.clearSingleSelect();
            }
        },
        OrderChange(query) {
            if (query === "") {
                this.$refs.Order.clearSingleSelect();
            }
        },
        timeStatistics() {
            if (this.selectData.length === 0) {
                this.dataAllTime.show = false;

                this.$Message.warning("请勾选要统计的数据");
                return;
            }
            this.dataAllTime.show = true;
            var allResponse = 0,
                allService = 0;
            this.selectData.map(v => {
                allResponse += Number.parseFloat(
                    ((v.receiveTime - v.reportDate) / 3600000).toFixed(2)
                );
                allService += Number.parseFloat(
                    ((v.createTime - v.receiveTime) / 3600000).toFixed(2)
                );
            });
            this.dataAllTime.allResponse = allResponse.toFixed(2);
            this.dataAllTime.allService = allService.toFixed(2);
        },
        exportTable() {
            if (this.selectData.length === 0) {
                this.$Message.warning("请选择需要导出的数据");
                return;
            }
            var parameter = {};
            this.modal.checkShowColumns.map(v => {
                switch (v) {
                    case "分类":
                        parameter.typeName = v;
                        break;
                    case "设备序列号":
                        parameter.assetSN = v;
                        break;
                    case "维修开始时间":
                        parameter.receiveTime = v;

                        break;
                    case "维修结束时间":
                        parameter.createTime = v;
                        break;
                }
            });
            this.exportTableLoading = true;
            this.$axios
                .post(
                    `/faultReport/downloadFaultReportListByIds`,
                    {
                        reportIds: this.selectData.map(v => v.reportID),
                        parameter: {
                            ...parameter
                        }
                    },
                    {
                        responseType: "blob",
                        kldMeta: {
                            filename: "维修记录.xls"
                        }
                    }
                )
                .finally(() => {
                    this.exportTableLoading = false;
                });
        },
        ShowColumns() {
            this.column.map((v, i) => {
                if (i === 1 || i === 0) return;
                if (this.modal.checkShowColumns.includes(v.title))
                    v.show = true;
                else v.show = false;
            });
        },
        reset() {
            this.search = {
                keyword: null,
                warrantyStatus: null,
                departmentId: null,
                startTime: null,
                endTime: null,
                userId: null,
                creatorId: null,
                year: new Date().getFullYear() + "",
                assertTypeId: null
            };
            this.$refs.creator.clearSingleSelect();
            this.$refs.Order.clearSingleSelect();
        },
        test(a) {
            return "" || null;
        }
    }
};
</script>
<style lang="less" scoped>
.statistics-table {
    position: relative;
    .table {
        margin: 20px 0;
        background-color: #fafafa;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.18);
        position: relative;
        .check-header {
            position: absolute;
            right: 10px;
            top: 0px;
            font-size: 26px;
            color: #999;
            z-index: 1;
            &:active {
                opacity: 0.8;
            }
        }
        .page {
            margin-top: 5px;
            background-color: rgba(235, 235, 235, 0.5);
            padding: 15px 13px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .page-left {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            /deep/ div,
            button {
                margin: 0 5px;
            }
            /deep/ .export {
                height: 45px;
                width: 100px;
                color: #333333;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px #cccccc;
            }
            .page-title {
                padding-left: 30px;
                color: #333333;
                font-size: 14px;
                span {
                    color: #ff6600;
                    font-size: 24px;
                }
            }
        }
    }
    /deep/ .table {
        .ivu-table {
            th,
            td {
                background: #fafafa;
            }
        }
    }
    .search {
        padding: 15px;
        background-color: #fafafa;
        border-radius: 2px;
        border: solid 1px #c8ced3;
    }
}
.year {
    position: absolute;
    right: 0;
    top: -45px;
}
/deep/ .log-columns-modal {
    .ivu-col {
        margin: 6px 0;
    }
}
</style>

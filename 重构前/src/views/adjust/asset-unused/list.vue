<template>
    <div class="asset-unused-list">
        <div class="top-buttons">
            <Button type="primary"
                    class="borrow-button"
                    @click="doAssetChargeConfig"
                    v-if="checkPage&&ViewLimit('Idle:edit')">借用管理</Button>
            <Button type="primary"
                    class="transfer-button"
                    @click="doAssetTransfer"
                    v-if="checkPage===true?ViewLimit('Idle:section'):ViewLimit('ass:Idle:section')">设备转移</Button>
        </div>
        <div v-if="!checkPage"
             style="position: relative;">

            <div class="echarts-container">
                <kld-echarts :option="echartsOption"
                             auto-resize
                             @click='getBarInfo'></kld-echarts>
            </div>
            <div class="echarts-nodata"
                 v-if="!originData.length&&!loadChartData">
                暂无相关数据
            </div>
        </div>

        <div class="search kld-box-effect">
            <Row type="flex"
                 :gutter="20">
                <i-col class="grow">
                    <Row class="gutter"
                         type="flex"
                         :gutter="20">
                        <i-col span="8">

                            <i-input v-model.trim="searchData.keyword"
                                     placeholder="设备编码/设备名称/品牌/型号"
                                     icon="ios-search-strong"
                                     class="kld-input"></i-input>

                        </i-col>
                        <i-col span="8"
                               v-if="checkPage">

                            <Select v-model="searchData.chooseType"
                                    class="kld-select"
                                    placeholder="费用类型">
                                <Option :value="0">全部费用类型</Option>
                                <Option :value="2">有偿</Option>
                                <Option :value="1">无偿</Option>
                                <Option :value="3">未设置</Option>
                            </Select>

                        </i-col>
                        <i-col span="8">
                            <kld-dropdown-tree v-model="searchData.assetTypeId"
                                               :data="assetTypeData"
                                               :first-expand="!checkPage"
                                               :code-prefix="checkPage"
                                               placeholder="选择设备分类"></kld-dropdown-tree>
                        </i-col>
                        <i-col span="8"
                               v-if="!checkPage">
                            <kld-dropdown-tree v-model="searchData.deptId"
                                               :data="sectionTreeData"
                                               first-expand
                                               @current-change='selectSection'
                                               :props="{label:'osName'}"
                                               placeholder="选择科室"></kld-dropdown-tree>
                        </i-col>
                        <i-col span="8"
                               v-if="!checkPage">
                            <Select v-model="searchData.useType"
                                    class="kld-select"
                                    placeholder="设备使用状态">
                                <Option :value="0">全部使用状态</Option>
                                <Option :value="1">在用</Option>
                                <Option :value="3">备用</Option>
                                <Option :value="4">待用</Option>
                            </Select>
                        </i-col>

                    </Row>
                </i-col>
                <i-col class="shrink">
                    <Button @click="resetSearch"
                            class="kld-btn-default">重置</Button>
                </i-col>
            </Row>
        </div>

        <div class="c-table kld-box-shadow">

            <kldLoading v-if="!loaded"></kldLoading>
            <kld-custom-table @on-row-click="chooseUnused"
                              @on-selection-change="selectAll"
                              @on-select="selectItem"
                              @on-select-cancel="cancelItem"
                              :columns="tableColumns"
                              :data="tableData"
                              ref="asset-unused-table"></kld-custom-table>
            <div class="c-table-page">
                <kld-page @on-change="checkPage?getUnusedListData($event):getAssetByLife($event)"
                          :current.sync="pageData.current"
                          :total="pageData.total"
                          :page-size="pageData.limit"></kld-page>
            </div>
        </div>

        <Modal v-model="borrowManageShow"
               title="借用管理">
            <div class='borrow-modal'>
                <div class="borrow-radio">
                    <p class="charge">
                        费用类型
                        <span>*</span>
                    </p>
                    <RadioGroup v-model="chargeType">
                        <Radio :label="2"
                               class='compensation'>
                            <span>有偿</span>
                        </Radio>
                        <Radio :label="1"
                               @click.native="chargePrice=''">
                            <span>无偿</span>
                        </Radio>
                    </RadioGroup>
                </div>
                <div class="borrow-radio">
                    <p class="charge">
                        价格
                        <i class="price-i">（元/小时）</i>：
                        <span>*</span>
                    </p>
                    <i-input v-model="chargePrice"
                             :disabled="chargeType==1">
                        <span slot="prepend">￥</span>
                    </i-input>
                </div>
            </div>
            <div slot="footer">
                <Button style="width:75px;"
                        @click="borrowManageShow=false">取消</Button>
                <Button type="primary"
                        @click="doChargeConfig"
                        :loading="submiting.borrow">确定</Button>
            </div>
        </Modal>
        <Modal v-model="assetTransferShow"
               title="设备转移"
               width="1100px"
               class="asset-transfer-modal-wrap">
            <div class="asset-transfer-modal-content">
                <div class="left-view currency-view">
                    <h4>转移设备列表</h4>
                    <div class="asset-transfer-table">
                        <div class="t-head-wrap">
                            <table class="t-head">
                                <thead>
                                    <tr>
                                        <th>设备编码</th>
                                        <th>设备名称</th>
                                        <th>所属科室</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="t-body-wrap">
                            <table class="t-body">
                                <tbody>
                                    <tr v-for="(v,i) of transferModalData"
                                        :key="i">
                                        <td>{{v.assetCode}}</td>
                                        <td>{{v.assetName}}</td>
                                        <td>{{v.osName}}</td>
                                        <td @click="cancelTransfer(i)">{{'移除'}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="right-view currency-view">
                    <h4>目标转移科室</h4>
                    <div class="asset-transfer-departments">
                        <Trees @clickTree="departmentInfo"
                               style="width:80%;margin:0 auto;"></Trees>
                    </div>
                </div>

            </div>
            <div slot="footer">
                <Button style="width:75px;"
                        @click="assetTransferShow=false">取消</Button>
                <Button type="primary"
                        @click="doTransfer"
                        :loading="submiting.transfer">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import kldLoading from "@common/loading/loading";
import kldPage from "@common/page/page";
import kldConfirm from "@common/kld-confirm";
import Trees from "@common/trees/tree.vue";
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";

import kldCustomTable from "@common/kld-custom-table";
import KldTreeSelect from "@common/kld-tree-select";
import kldDropdownTree from "@common/kld-dropdown-tree/index";

export default {
    name: "asset-unused-list",
    components: {
        kldPage,
        Trees,
        kldLoading,
        kldDropdownTree,
        kldCustomTable,
        KldTreeSelect,
        kldEcharts
    },
    data() {
        let getAssetStatus = used => {
            let status = {
                1: { status: "在用", style: "#09b785" },
                3: { status: "备用", style: "#24baf9" },
                4: { status: "待用", style: "#e1bb6a" }
            };
            if (status[used]) {
                return status[used];
            }
            return { status: "" };
        };
        return {
            timer: null,
            submiting: {
                borrow: false,
                transfer: false
            },
            loaded: false,
            borrowManageShow: false,
            assetTransferShow: false,
            // borrowApplyShow: false,
            chargeType: 2,
            chargePrice: "",
            chargePriceUnused: "",

            assetTypeShow: false,
            assetTypeData: [],

            assetTypeName: "",

            sectionTreeData: [],
            turnOutDepartment: "",
            turnInToDepartment: "",
            sectionPoptipShow: false,

            tableColumns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                    // render:
                },
                {
                    title: "资产编码",
                    key: "assetCode",
                    //ellipsis:true,
                    width: 190

                    // render:
                },
                {
                    title: "资产名称",
                    key: "assetName",
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                                style: {
                                    color: "#0c8399"
                                }
                            },
                            this.checkPage
                                ? params.row[params.column.key]
                                : [
                                      params.row[params.column.key],
                                      h(
                                          "span",
                                          {
                                              style: {
                                                  backgroundColor: getAssetStatus(
                                                      params.row.used
                                                  ).style,
                                                  "vertical-align": "middle",
                                                  display: "inline-block",
                                                  height: "18px",
                                                  padding: "0 3px",
                                                  "text-align": "center",
                                                  "line-height": "18px",
                                                  "border-radius": "3px",
                                                  color: "#fff",
                                                  margin: "0 0 2px 6px"
                                              }
                                          },
                                          getAssetStatus(params.row.used).status
                                      )
                                  ]
                        );
                    }
                },
                {
                    title: "品牌",
                    key: "brandName",
                    // render:
                    ellipsis:true
                },
                {
                    title: "型号",
                    key: "assetClass"
                    // render:
                },
                {
                    title: "设备分类",
                    key: "typeName"
                    // render:
                },
                {
                    title: "所属科室",
                    key: "osName"
                    // render:
                }
            ],
            tableData: [],

            searchData: {
                keyword: "",
                chooseType: 0,
                assetTypeId: "",
                deptId: "",
                useType: ""
            },
            department: {
                name: ""
            },
            pageData: {
                current: 1,
                limit: 10,
                total: 0
            },
            transferModalData: [],
            chooseDepartment: false,
            chooseRightDepartment: false,

            allSelectItem: [],

            newDepartmentId: "",
            newDepartmentName: "",

            // myEcharts:null,
            xAxis: {},
            series: [],
            // resizeTimer:null,
            originData: [],

            minArrLength: 5,
            loadChartData: false,

            statusRes: [
                {
                    statusReg: /^used/,
                    status: "在用",
                    order: 1
                },
                {
                    statusReg: /^stand/,
                    status: "待用",
                    order: 2
                },
                {
                    statusReg: /^reserve/,
                    status: "备用",
                    order: 3
                }
            ],
            typeRegs: [
                {
                    typeReg: /IMV$/,
                    type: "有创",
                    order: 1
                },
                {
                    typeReg: /CPAP$/,
                    type: "无创",
                    order: 2
                },
                {
                    typeReg: /Mix$/,
                    type: "混合型",
                    order: 3
                }
            ],
            outTrigger:false
        };
    },
    watch: {
        searchData: {
            handler() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    if (this.checkPage) {
                        this.getUnusedListData();
                    } else {
                        this.getAssetByLife();
                    }
                }, 300);
            },
            deep: true
        },
        checkPage() {
            this.$store.state.reload();
        }
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        },
        unusedEl() {
            return this.$refs["asset-unused-table"];
        },
        currentPageSize() {
            let disabledLength = 0;
            if (!this.checkPage) {
                disabledLength = this.tableData.filter(v => v._disabled).length;
            }
            console.log(disabledLength);

            return this.tableData.length - disabledLength;

            // if (this.pageData.total - this.pageData.limit <= 0) {
            //     return this.pageData.total;
            // } else if (this.pageData.total % this.pageData.limit === 0) {
            //     return this.pageData.limit;
            // } else if (this.pageData.total % this.pageData.limit !== 0) {
            //     return this.pageData.current ==
            //         parseInt(this.pageData.total / this.pageData.limit) + 1
            //         ? this.pageData.total % this.pageData.limit
            //         : this.pageData.limit;
            // }
        },
        checkPage() {
            return this.$route.name === "asset-unused";
        },
        // eDom(){
        //     return this.$refs.liveUnusedBar;
        // },
        echartsOption() {
            let BCtype = this.statusRes.map(v => v.status);
            return {
                //新柱状图配置项
                color: ["#e85464", "#59b9c7", "#0194c8"],
                // color: ["#f74983", "#7ace4c", "#8a5bf6"],
                tooltip: {
                    padding: [5, 0],
                    backgroundColor: "rgba(0,0,0,0.7)",
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: params => {
                        // console.log(params)
                        let type = {};
                        let html = [];
                        params.forEach(v => {
                            // console.log(v)
                            let seriesName = v.seriesName;
                            let bc = v.data.stack;
                            if (BCtype.includes(seriesName)) {
                                return;
                            }
                            if (!type[seriesName]) {
                                type[seriesName] = {};
                            }
                            type[seriesName][bc] = v.value;
                            type[seriesName].color = v.color;
                        });
                        let row = (type, key) => {
                            return BCtype.map(v => {
                                return `<td >
                                            ${
                                                type[key][v] === undefined
                                                    ? ""
                                                    : type[key][v]
                                            }
                                        </td>`;
                            }).join("");
                        };
                        let column = () => {
                            return BCtype.map(v => {
                                return ` <th>
                                            <span class="tooltip-status">${v}</span>
                                        </th>`;
                            }).join("");
                        };
                        Object.keys(type).forEach(key => {
                            html.push(
                                `<tr>
                                    <td class="table-space"></td>
                                    <td class="single-type">
                                        <span class="tooltip-table-type" style="border-left:4px solid ${
                                            type[key].color
                                        }">${key}</span>
                                    </td>
                                    ${row(type, key)}
                                    <td class="table-space"></td>
                                </tr>`
                            );
                        });

                        return `<table  class="tooltip-table">
                                    <thead>
                                        <tr>
                                            <th class="table-space"></th>
                                            <th>
                                                <span class="table-department">类别</span>
                                                <!--<span class="table-department">${
                                                    params[0].name
                                                }</span>--!>
                                            </th>
                                            ${column()}
                                            <th class="table-space"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${html.join("")}
                                    </tbody>
                                </table>`;
                    }
                },
                legend: {
                    data: ["有创", "无创", "混合型"]
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: this.originData.length > 10 ? "17%" : "3%",
                    containLabel: true
                },
                dataZoom: [
                    {
                        type: "slider",
                        startValue: 0,
                        endValue: 9,
                        height: 30, //组件高度
                        show: this.originData.length > 10
                    }
                ],
                xAxis: this.xAxis,
                yAxis: {
                    minInterval: 1,
                    // maxInterval: 2,
                    type: "value",
                    name: "呼吸机数量",
                    max: function(value) {
                        return value.max % 2 || value.max <= 6
                            ? value.max + 1
                            : value.max + 2;
                    }
                },
                series: this.series
            };
        }
    },
    created() {
        this.getOriginData();
        if (this.checkPage) {
            this.tableColumns.push({
                //为闲置设备添加费用类型
                title: "费用类型",
                key: "charge",
                render: this.chargeRender,
                width: "100px",
                align: "center"
            });
        }
    },
    methods: {
        //点击获取柱状数据
        getBarInfo({ data }) {
            this.department.name = data.deptName;
            this.searchData.deptId = data.departmentId;
            switch (data.stack) {
                case "待用":
                    this.searchData.useType = 4;
                    break;
                case "在用":
                    this.searchData.useType = 1;
                    break;
                case "备用":
                    this.searchData.useType = 3;
                    break;
            }
            let breatheNode = this.$store.state.findNode(
                this.assetTypeData,
                node => {
                    return node.state === 2;
                },
                "lists"
            );
            if (breatheNode) {
                this.outTrigger=true;
                this.searchData.assetTypeId = breatheNode.id;
                this.assetTypeName = breatheNode.typeName;
            }
        },
        //获得所有初始数据
        getOriginData() {
            if (this.checkPage) {
                this.getUnusedListData();
            } else {
                // console.log(1)
                this.getAssetByLife();
                this.getAllUnusedAsset();
            }
            this.getAssetTypeTree();
            this.getSectionTree();
        },
        //获得闲置列表
        getUnusedListData(page = 1) {
            this.pageData.current = page;
            this.loaded = false;
            this.$axios
                .post(`/assetBorrow/listAsset`, {
                    limit: this.pageData.limit,
                    offset: this.pageData.limit * (this.pageData.current - 1),
                    params: {
                        charge:
                            this.searchData.chooseType === 0
                                ? null
                                : this.searchData.chooseType,
                        keyword: this.searchData.keyword,
                        typeId: this.searchData.assetTypeId,
                        returnType: "1"
                    }
                })
                .then(
                    res => {
                        // console.log(res.data);
                        this.pageData.total = res.data.recordsTotal;
                        this.tableData = res.data.data;
                        this.renderSelect(this.tableData);
                        this.loaded = true;
                    },
                    error => {
                        this.loaded = true;
                    }
                );
        },
        //获得生命支持类闲置列表
        getAssetByLife(page = 1) {
            // console.log(11111111111)
            this.pageData.current = page;
            this.loaded = false;
            this.$axios
                .post(`/assetBorrow/listAssetByLife`, {
                    limit: this.pageData.limit,
                    offset: this.pageData.limit * (this.pageData.current - 1),
                    params: {
                        keyword: this.searchData.keyword,
                        returnType: "1",
                        assertTypeId: this.searchData.assetTypeId,
                        deptId: this.searchData.deptId,
                        useType: this.searchData.useType || null
                    }
                })
                .then(
                    res => {
                        this.pageData.total = res.data.recordsTotal;
                        this.tableData = this.liveListFormat(res.data.data);
                        this.renderLiveSelect(this.tableData);
                        this.loaded = true;
                    },
                    error => {
                        this.loaded = true;
                    }
                );
        },
        liveListFormat(list) {
            return list.map(v => {
                return {
                    ...v,
                    _disabled: v.used !== 4
                };
            });
        },
        //获得所有呼吸机设备
        getAllUnusedAsset(deptId = this.$store.state.user_in.osId) {
            this.loadChartData = true;
            this.$axios
                .post(`/assetBorrow/breatheCount`, {
                    osId: this.$store.state.user_in.osId,
                    deptId
                })
                .then(res => {
                    this.formatEchartsData(res.data);
                })
                .finally(() => {
                    this.loadChartData = false;
                });
        },
        formatEchartsData(res) {
            // console.log(res)
            this.originData = res.filter(v => {
                return Object.keys(v.map).some(value => +v.map[value]);
            });
            this.originData = this.originData.map(v => {
                // let stack={
                //     stand:0,
                //     used:0,
                //     reserve:0
                // }
                let stand = 0,
                    used = 0,
                    reserve = 0;
                Object.keys(v.map).forEach(value => {
                    if (/^stand/.test(value)) {
                        stand += v.map[value];
                    }
                    if (/^used/.test(value)) {
                        used += v.map[value];
                    }
                    if (/^reserve/.test(value)) {
                        reserve += v.map[value];
                    }
                });
                return {
                    ...v,
                    map: {
                        ...v.map,
                        // ...stack,
                        stand,
                        used,
                        reserve
                    }
                };
            });

            // console.log(this.originData);
            // if (!this.originData.length) {
            //     return;
            // }
            let preArr = ["", "", "", "", ""];
            this.xAxis = {
                type: "category",
                name: "科室",
                // data:this.originData.map(v=>v.deptName),
                axisTick: { show: false },
                data:
                    this.originData.length >= 3
                        ? this.originData.map(v => v.deptName)
                        : (() => {
                              let arr = this.originData.map(v => v.deptName);
                              arr.push(
                                  ...preArr.splice(
                                      0,
                                      this.minArrLength - arr.length
                                  )
                              );
                              return arr;
                          })(),
                axisLabel: {
                    interval: 0, //强制显示所有的x轴坐标（类目名）
                    // rotate: 25,
                    // align:"left",
                    // lineHeight:8000,
                    formatter: (value, index) => {
                        // console.log(value)
                        let maxLength = 5;
                        let result = "";
                        if (value) {
                            value.split("").forEach((v, i) => {
                                result += !!((i + 1) % 5) ? v : v + "\n";
                            });
                        }
                        // console.log(result)
                        return result;
                    }
                }
            };

            let usedData = [
                {
                    label: "usedIMV",
                    name: "有创",
                    stack: "在用"
                },
                {
                    label: "usedCPAP",
                    name: "无创",
                    stack: "在用"
                },
                {
                    label: "usedMix",
                    name: "混合型",
                    stack: "在用"
                },
                {
                    label: "used",
                    name: "在用",
                    stack: "在用"
                }
            ];
            let standData = [
                {
                    label: "standbyIMV",
                    name: "有创",
                    stack: "待用"
                },
                {
                    label: "standbyCPAP",
                    name: "无创",
                    stack: "待用"
                },
                {
                    label: "standbyMix",
                    name: "混合型",
                    stack: "待用"
                },
                {
                    label: "stand",
                    name: "待用",
                    stack: "待用"
                }
            ];
            let reserveData = [
                {
                    label: "reserveIMV",
                    name: "有创",
                    stack: "备用"
                },
                {
                    label: "reserveCPAP",
                    name: "无创",
                    stack: "备用"
                },
                {
                    label: "reserveMix",
                    name: "混合型",
                    stack: "备用"
                },
                {
                    label: "reserve",
                    name: "备用",
                    stack: "备用"
                }
            ];
            let seriesData = [...usedData, ...standData, ...reserveData];
            let stackReg = /(^used$)|(^stand$)|(^reserve$)/; //分类正则

            let seriesformart = arr => {
                return arr.map((v, i, array) => {
                    return {
                        name: v.name,
                        type: "bar",
                        barGap: 0,
                        barMaxWidth: "50",
                        stack: v.stack,
                        label: {
                            show: stackReg.test(v.label),
                            position: "top",
                            distance: 5,
                            align: "center",
                            rotate: 0,
                            formatter: function(params) {
                                const { seriesName, data } = params;
                                // console.log(data)
                                return data.totalValue
                                    ? seriesName.split("").join("\n")
                                    : "";
                            },
                            fontSize: 12,
                            color: "#333"
                        },
                        data: this.originData.map((value, index, arr) => {
                            // console.log(value);
                            if (stackReg.test(v.label)) {
                                return {
                                    value: 0,
                                    totalValue: value.map[v.label],
                                    stack: v.stack,
                                    departmentId: value.departmentId,
                                    deptName: value.deptName
                                };
                            } else {
                                return {
                                    value: value.map[v.label],
                                    stack: v.stack,
                                    departmentId: value.departmentId,
                                    deptName: value.deptName
                                };
                            }
                        })
                    };
                });
            };
            this.series = seriesformart(seriesData);
        },

        renderSelect(arr) {
            let array = [];
            arr.forEach((v, i) => {
                this.allSelectItem.forEach(item => {
                    if (item.assetId == v.assetId) {
                        array.push(i);
                    }
                });
            });
            this.$nextTick(() => {
                array.forEach(v => {
                    this.unusedEl.toggleSelect(v);
                });
            });
        },
        renderLiveSelect(arr) {
            let array = [];
            arr.forEach((v, i) => {
                this.allSelectItem.forEach(item => {
                    if (item.assetId == v.assetId) {
                        array.push(i);
                    }
                });
            });
            this.$nextTick(() => {
                array.forEach(v => {
                    this.unusedEl.toggleSelect(v);
                });
            });
        },
        selectItem(all, single) {
            console.log("============selectItem");
            if (
                this.allSelectItem.findIndex(
                    v => v.assetId == single.assetId
                ) === -1
            ) {
                this.allSelectItem.push(single);
            }
        },
        cancelItem(all, single) {
            console.log("============cancel");
            let cancelIndex = this.allSelectItem.findIndex(
                v => v.assetId == single.assetId
            );
            if (cancelIndex < 0) {
                return;
            }
            this.allSelectItem.splice(cancelIndex, 1);
        },
        selectAll(arr) {
            console.log(arr, this.currentPageSize);
            console.log(arr.length, "======>selectAll");
            if (arr.length === 0) {
                this.tableData.forEach(v => {
                    this.cancelItem("unused", v);
                });
                return;
            }
            if (arr.length === this.currentPageSize) {
                arr.forEach(v => {
                    this.selectItem("unused", v);
                });
            }
        },

        //有偿render
        paidRender(h, params) {
            return h(
                "span",
                {
                    style: {
                        color: "#eb7784"
                    }
                },
                "￥" + params.row[params.column.key]
            );
        },
        //无偿
        freeRender(h, params) {
            return h(
                "span",
                {
                    style: {
                        color: "#01b0c7"
                    }
                },
                "无偿"
            );
        },
        //未设置
        notSetRender(h, params) {
            return h(
                "span",
                {
                    style: {
                        color: ""
                    }
                },
                "— —"
            );
        },
        //费用
        chargeRender(h, params) {
            if (
                params.row[params.column.key] === undefined ||
                params.row[params.column.key] === null
            ) {
                return this.notSetRender(h, params);
            } else if (params.row[params.column.key] === "0") {
                return this.freeRender(h, params);
            } else {
                return this.paidRender(h, params);
            }
        },

        //获得国家分类
        getAssetTypeTree() {
            this.$axios.get(`/assetTypes/typeAllTree`).then(({ data }) => {
                data = this.checkPage
                    ? data
                    : data.filter(v => {
                          return v.state === 1 || v.state === 2;
                      });
                this.assetTypeData = data;
            });
        },
        selectAssetType([node]) {
            console.log(node);

            if (node) {
                if (node.children) {
                    this.$nextTick(() => {
                        this.$set(node, "selected", false);
                    });
                    this.$set(node, "expand", !node.expand);
                    return;
                }
                this.searchData.assetTypeId = node.id;
                this.assetTypeName = node.typeName;
                this.assetTypeShow = false;
            } else {
                this.searchData.assetTypeId = "";
                this.assetTypeName = "";
                this.assetTypeShow = false;
            }
        },

        getSectionTree() {
            return this.$axios
                .get(`/orgstruct/findAllTrees/${this.user_in.osId}`)
                .then(({ data }) => {
                    // console.log(data)
                    this.sectionTreeData = [data];
                    //  transformTreeData(data);
                });
        },

        selectSection(node) {
            if(this.outTrigger){
                this.outTrigger=false;
                return 
            }
            // debugger
            if (node) {
                this.getAllUnusedAsset(node.id);
            } else {
                this.getAllUnusedAsset();
            }
        },
        deptForList(node) {
            if (node) {
                this.department.name = node.osName;
                this.searchData.deptId = node.id;
                this.department.show = false;
            } else {
                this.department.name = "";
                this.searchData.deptId = "";
                this.department.show = false;
            }
        },

        resetSearch() {
            this.searchData = {
                keyword: "",
                chooseType: 0,
                assetTypeId: "",
                deptId: ""
            };
            this.assetTypeName = "";
            this.department.name = "";
            this.pageData = {
                current: 1,
                limit: 10,
                total: 0
            };
            if (this.checkPage) {
                this.getUnusedListData();
            } else {
                this.getAssetByLife();
                this.getAllUnusedAsset();
            }
        },

        chooseUnused(row, index) {
            // console.log(row);
            if (row._disabled) {
                return;
            }
            this.unusedEl.toggleSelect(index);
        },
        departmentInfo(info) {
            console.log(info);
            this.chooseDepartment = true;
            this.chooseRightDepartment = true;
            // if (info[0].children) {
            //     this.$Message.warning("请选择最末级科室！");
            //     this.chooseRightDepartment = false;
            // } else {
                this.newDepartmentId = info[0].id;
                this.newDepartmentName = info[0].osName;
                if (
                    this.transferModalData.findIndex(
                        v => v.departmentId == info[0].id
                    ) != -1
                ) {
                    this.$Message.warning("最好不要重复选择设备原科室！");
                }
            // }
        },

        doAssetChargeConfig() {
            if (this.allSelectItem.length === 0) {
                this.$Message.warning("请先选择要设置费用类型的闲置设备！");
                return;
            }

            this.borrowManageShow = true;
        },
        doChargeConfig() {
            if (this.chargeType == 2 && this.chargePrice === "") {
                this.$Message.warning("请填写价格！");

                return;
            } else if (
                this.chargeType == 2 &&
                !/^\d+\.?\d+$|^\d+$/g.test(this.chargePrice)
            ) {
                this.$Message.warning("请填写正确格式的价格！");
                return;
            }
            // this.$axios.post('/assetBorrow/saveAssetCharge',{
            this.submiting.borrow = true;
            this.$axios
                .post("/assetBorrow/updateAssetCharge", {
                    type: this.chargeType,
                    money:
                        this.chargeType == 2
                            ? parseFloat(this.chargePrice).toFixed(2)
                            : "0",
                    assetIds: this.allSelectItem.map(v => v.assetId)
                })
                .then(
                    res => {
                        this.$Message.success("借用管理设置成功！");
                        this.submiting.borrow = false;
                        this.$store.state.reload();
                    },
                    error => {
                        this.submiting.borrow = false;
                    }
                );
        },

        doAssetTransfer() {
            if (this.allSelectItem.length === 0) {
                this.$Message.warning("请先选择要转移的闲置设备！");
                return;
            }
            this.transferModalData = JSON.parse(
                JSON.stringify(this.allSelectItem)
            );
            this.assetTransferShow = true;
        },
        cancelTransfer(i) {
            this.transferModalData.splice(i, 1);
        },

        doTransfer() {
            if (this.chooseDepartment) {
                if (this.chooseRightDepartment) {
                    kldConfirm({
                        title: "提示",
                        content: `确认将您选中的设备转移至 ${
                            this.newDepartmentName
                        }?`,
                        maskClosable: false, //是否允许点击遮罩关闭 默认:false

                        ok: () => {
                            //当点击了确认按钮时
                            this.doSubmit();
                        },
                        cancel: () => {
                            //取消按钮同上
                            console.log("cancel");
                        }
                    });

                    // this.$store.state.reload();
                } else {
                    this.$Message.warning("请选择最末级科室！");
                }
            } else {
                this.$Message.warning("请选择目标转移科室！");
            }
        },
        doSubmit() {
            let map = this.transferModalData.map(v => {
                return {
                    assetId: v.assetId,
                    oldSectionId: v.departmentId
                };
            });
            this.submiting.transfer = true;
            this.$axios
                .post(
                    `/assetBorrow/${
                        this.checkPage
                            ? "updateAssetSection"
                            : "updateAssetSectionLife"
                    }?sectionId=${this.newDepartmentId}`,
                    map
                )
                .then(res => {
                    console.log(res);
                    this.$Message.success("闲置设备申请转移成功！");
                    this.$store.state.reload();
                })
                .finally(res => {
                    this.submiting.transfer = false;
                    this.assetTransferShow = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
@import "../common/common";
.asset-transfer-modal-wrap {
    /deep/.ivu-modal-body,
    /deep/.ivu-modal-footer {
        background-color: #fafafa;
    }
    .asset-transfer-modal-content {
        width: 100%;
        position: relative;
        height: 600px;
        display: flex;
        justify-content: space-between;
        @leftViewWidth: 63%;
        @viewCell: 2%;
        .currency-view {
            height: 100%;
            h4 {
                height: 30px;
                font-size: 14px;
                line-height: 30px;
            }
            > div {
                width: 100%;
                height: 600px - 30px;
            }
        }
        .left-view {
            width: @leftViewWidth;
            .table-format {
                tr {
                    th:nth-child(4n + 1),
                    td:nth-child(4n + 1) {
                        width: 30%;
                    }
                    th:nth-child(4n + 2),
                    td:nth-child(4n + 2) {
                        width: 30%;
                    }
                    th:nth-child(4n + 3),
                    td:nth-child(4n + 3) {
                        width: 30%;
                    }
                    th:nth-child(4n),
                    td:nth-child(4n) {
                        width: 10%;
                        text-align: center;
                    }
                }
            }
            .asset-transfer-table {
                .t-head-wrap {
                    width: 100%;
                    padding: 0 2.5%;
                    background-color: #dddddd;
                    border-radius: 3px;
                    .t-head {
                        width: 100%;
                        border-collapse: collapse;
                        .table-format;
                        th {
                            height: 50px;
                            text-align: left;
                        }
                    }
                }
                .t-body-wrap {
                    padding: 0 2.5%;
                    background-color: #ffffff;
                    height: 600px - 30px - 50px;
                    border-radius: 3px;
                    .t-body {
                        width: 100%;
                        border-collapse: collapse;
                        .table-format;
                        td {
                            border-bottom: 1px solid #eeeeee;
                            height: 40px;
                            color: #666666;
                        }
                        td:nth-child(4n) {
                            cursor: pointer;
                            color: skyblue;
                        }
                    }
                }
            }
        }
        .right-view {
            width: 100%-@leftViewWidth - @viewCell;
            .asset-transfer-departments {
                overflow: auto;
                background-color: #ffffff;
            }
        }
    }
}
.asset-unused-list {
    position: relative;
    width: 100%;
    .top-buttons {
        width: 100%;
        position: absolute;
        top: -55px;
        left: 0;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        .ivu-btn {
            margin-right: 10px;
        }
    }

    .echarts-container {
        width: 100%;
        height: 250px;
        margin: 0 auto;
        // display:flex;
        // justify-content:center;
        /deep/.tooltip-table {
            border-collapse: collapse;
            width: 100%;
            tr {
                td,
                th {
                    text-align: center;
                    font-weight: normal;
                    height: 30px;
                }
                th {
                    border-bottom: 3px solid #a9a8a9;
                }
                .single-type {
                    text-align: left;
                }
                .table-space {
                    width: 15px;
                }
                .tooltip-table-type {
                    display: inline-block;
                    width: 100%;
                    padding: 0 5px 0 13px;
                    color: #d0d0d0;
                }
                .tooltip-status {
                    padding: 0 5px;
                    color: #d0d0d0;
                }
                .table-department {
                    // font-size: 16px;
                    color: #d0d0d0;
                }
            }
        }
    }
    .echarts-nodata {
        width: 100%;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #666666;
        position: absolute;
        top: 0;
        left: 0;
    }
    .kld-box-shadow {
        position: relative;
    }
}

.section-tree {
    width: 100%;
    /deep/.ivu-poptip-popper {
        width: 100%;
    }
    /deep/.ivu-poptip-rel {
        width: 100%;
    }
    /deep/.ivu-poptip-body {
        max-height: 300px;
        overflow: auto;
    }
    /deep/.ivu-poptip-body-content {
        overflow: initial;
    }
}

.borrow-modal {
    .charge {
        margin-bottom: 10px;
        .price-i {
            color: #a9a8a9;
            font-style: normal;
        }
        span {
            color: #fe881a;
        }
    }
    .compensation {
        margin-right: 30px;
    }
    .borrow-radio {
        margin-bottom: 15px;
    }
}
</style>



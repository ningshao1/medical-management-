<template>
    <div class="comprehensive-analysis-wrap">
        <div class="show-area-top">
            <div class="asset-info">
                <kld-type :title="'设备信息'"></kld-type>
                <i-row>
                    <i-col span="24"
                           class-name='asset-name'>
                        设备名称：{{basicInfo.assetName}}
                    </i-col>
                    <i-col :span="itemTitle"
                           class-name="info-title">

                        设备编码：
                    </i-col>
                    <i-col :span="12 - itemTitle"
                           class-name="info-content">
                        {{basicInfo.assetCode}}
                    </i-col>
                    <i-col :span="itemTitle"
                           class-name="info-title">
                        所属科室：
                    </i-col>
                    <i-col :span="12 - itemTitle"
                           class-name="info-content">
                        {{basicInfo.osName}}
                    </i-col>
                    <i-col :span="itemTitle"
                           class-name="info-title">
                        设备品牌：
                    </i-col>
                    <i-col :span="12 - itemTitle"
                           class-name="info-content">
                        {{basicInfo.brandName}}
                    </i-col>
                    <i-col :span="itemTitle"
                           class-name="info-title">
                        设备型号：
                    </i-col>
                    <i-col :span="12 - itemTitle"
                           class-name="info-content">
                        {{basicInfo.assetClass}}
                    </i-col>
                    <i-col :span="itemTitle"
                           class-name="info-title">
                        设备分类：
                    </i-col>
                    <i-col :span="12 - itemTitle"
                           class-name="info-content">
                        {{basicInfo.assertTypeName}}
                    </i-col>
                    <!-- <i-col :span="itemTitle"
                           class-name="info-title">
                        院内分类：
                    </i-col> -->
                    <!-- <i-col :span="12 - itemTitle"
                           class-name="info-content">
                        {{basicInfo.assetHosTypeName}}
                    </i-col> -->

                </i-row>
            </div>
            <div class="cost-supplement">
                <kld-type :title="'费用补充项'"></kld-type>
                <Button class="kld-btn join-calculation"
                        @click="joinCalculation">加入计算</Button>
                <ul class="cost-supplement-content">
                    <li>
                        <div class="types-of-fee">水 费：</div>
                        <div class="fee-input">
                            <kld-input-number v-model="customFees.waterFee"
                                              placeholder="请填写"
                                              clearable
                                              :number='true'>
                                <span slot="prepend">
                                    <Icon type="social-yen"></Icon>
                                </span>
                            </kld-input-number>
                        </div>
                    </li>
                    <li>
                        <div class="types-of-fee">电 费：</div>
                        <div class="fee-input">
                            <kld-input-number v-model="customFees.electricityFee"
                                              placeholder="请填写"
                                              clearable
                                              :number='true'>
                                <span slot="prepend">
                                    <Icon type="social-yen"></Icon>
                                </span>
                            </kld-input-number>
                        </div>

                    </li>
                    <li>
                        <div class="types-of-fee">人工费：</div>
                        <div class="fee-input">
                            <kld-input-number v-model="customFees.laborFee"
                                              placeholder="请填写"
                                              clearable
                                              :number='true'>
                                <span slot="prepend">
                                    <Icon type="social-yen"></Icon>
                                </span>
                            </kld-input-number>
                        </div>

                    </li>
                </ul>
            </div>

        </div>
        <div class="show-area-middle">
            <div class='requirement-bar'>
                <div class="calculation-items">
                    <span class="calculation-items-title">分析类别:</span>
                    <Checkbox size="large"
                              @on-change='toggleAll'
                              v-model="toggleItem"
                              style='margin-left:20px;'>全选</Checkbox>
                    <CheckboxGroup @on-change='checkItems'
                                   v-model='calculationItems'>
                        <Checkbox size="large"
                                  v-for="(v,i) of allCalculationItems"
                                  :key='i'
                                  :label="v.symbolName"
                                  :disabled="v.disabled">{{v.text}}</Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="other-items">
                    <DatePicker split-panels
                                :clearable='false'
                                class="kld-date-picker set-gutter"
                                type="daterange"
                                v-model="dateRange"
                                placeholder="选择时间范围"
                                style="width: 300px"
                                :options="extraOpt"></DatePicker>
                    <Button class="kld-btn set-gutter"
                            @click="print">打印</Button>
                </div>
            </div>
            <!-- 图标 -->
            <div class="calculation-statistics-show">
                <div class="calculation-statistics-pie"
                     style="width:100%">
                    <kld-echarts :option="pieOpt"
                                 auto-resize
                                 :loading='pieDataLoading'></kld-echarts>
                </div>
            </div>
            <div class="calculation-statistics-bar">
                <div class='calculation-statistics-wrap'>

                    <div class="calculation-statistics">
                        <span class="statistics-type statistics-type-fair"
                              v-if="this.profitStatus>=0&&this.profitStatus<0.2">持平</span>
                        <span class="statistics-type statistics-type-profit"
                              v-if="this.profitStatus>=0.2&&this.profitStatus<0.5">良好</span>
                        <span class="statistics-type statistics-type-excellent"
                              v-if="this.profitStatus>0.5">优秀</span>
                        <span class="statistics-type statistics-type-deficit"
                              v-if="this.profitStatus<0">不良</span>
                    </div>
                    <div class="calculation-IAE-wrap">

                        <div class='calculation-IAE'>
                            <span class="calculation-statistics-title">设备购入原值：{{pieDataLoading?"￥--":currencnyFormat(originData&&originData.assetCost?originData.assetCost:0)}}</span>
                        </div>
                        <div class='calculation-IAE'>
                            <span class="calculation-statistics-title">当前总收入：{{pieDataLoading?"￥--":currencnyFormat(totalIncome)}}</span>
                        </div>
                        <div class='calculation-IAE'>
                            <span class="calculation-statistics-title">成本收回：{{pieDataLoading?"￥--":currencnyFormat(costRecovery)}}</span>
                        </div>
                    </div>
                </div>
                <div class="formula-description">
                    <span class="solid-circle"></span>
                    <span class="formula-item">投资回收期 = 预计使用年限 ✖ 12 ✖ 盈亏平衡人次 / 月平均检查人次</span>
                    <span class="description-item">（投资回收期越短，表示可在较短时间内收回成本，设备经济效益越好）</span>
                </div>
            </div>
        </div>
        <div class='show-area-bottom'>
            <div class="title-head">
                就诊病人量统计
            </div>
            <div class="content-body">

                <div class="search-bar">
                    <i-row :gutter='5'
                        type='flex'>
                        <i-col :span="6">
                            <i-row :gutter='5'
                                type='flex'
                                class-name='search-item'>
                                <i-col :span="6">
                                    <Select v-model="rangeType"
                                            class="kld-select"
                                            @on-change="toggleSearch"
                                            transfer>
                                        <Option :value="'date'">日</Option>
                                        <Option :value="'month'">月</Option>
                                        <Option :value="'year'">年</Option>
                                    </Select>
                                </i-col>
                                <i-col :span="18"
                                    v-if='rangeType==="date"'>
                                    <date-picker v-model='dateInfo.date'
                                                transfer
                                                class="kld-date-picker"
                                                @on-change="searchDateNum"
                                                :options="dateRangeLimit"></date-picker>

                                </i-col>
                                <i-col :span="18"
                                    v-if='rangeType==="month"'>
                                    <Select transfer
                                            class="kld-select"
                                            v-model="monthInfo.month"
                                            @on-change="searchMonthNum">
                                        <Option v-for='num of 12'
                                                :key='num'
                                                :value="num"
                                                :disabled="num>monthInfo.currentMonth">{{num}}月份</Option>
                                    </Select>

                                </i-col>
                                <i-col :span="18"
                                    v-if='rangeType==="year"'>
                                    <date-picker disabled
                                                transfer
                                                class="kld-date-picker"
                                                placeholder="无"
                                                ></date-picker>

                                </i-col>
                            </i-row>

                        </i-col>
                        <i-col :span="18">
                            <i-row v-if='rangeType==="date"'
                                type='flex'
                                class-name='view-item'>
                                <i-col :span="7">
                                    <h4>当日病人量（例）：</h4>
                                    <span>{{countLoading?"--":dateInfo.total}}</span>

                                </i-col>
                                <i-col :span="6">
                                    <h4>峰值（例）：</h4>
                                    <span>{{countLoading?"--":dateInfo.max}}</span>
                                </i-col>
                            </i-row>
                            <i-row v-if='rangeType==="month"'
                                type='flex'
                                class-name='view-item'>
                                <i-col :span="6">
                                    <h4>月度病人量（例）：</h4>
                                    <span>{{countLoading?"--":monthInfo.total}}</span>

                                </i-col>
                                <i-col :span="6">
                                    <h4>峰值（例）：</h4>
                                    <span>{{countLoading?"--":monthInfo.max}}</span>
                                </i-col>
                                <i-col :span="6">
                                    <h4>谷值（例）：</h4>
                                    <span>{{countLoading?"--":monthInfo.min}}</span>
                                </i-col>
                            </i-row>
                            <i-row v-if='rangeType==="year"'
                                type='flex'
                                class-name='view-item'>
                                <i-col :span="6">
                                    <h4>全年病人量（例）：</h4>
                                    <span>{{countLoading?"--":yearInfo.total}}</span>

                                </i-col>
                            </i-row>

                        </i-col>
                    </i-row>

                </div>
                <div class="num-total">
                    <kld-echarts :option='numTotalBar'
                                auto-resize
                                :loading="!!countLoading"
                                :no-data='isNoData'></kld-echarts>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import kldType from "@common/kld-type/kld-type.vue";
import kldInputNumber from "@common/kld-input-number";
import kldPage from "@common/page";
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";

export default {
    name: "comprehensive-analysis",
    components: { kldType, kldInputNumber, kldPage, kldEcharts },
    data() {
        let currentDate = new Date(new Date() - 60 * 60 * 24 * 1000);
        let currentYear = currentDate.getFullYear();
        let yearStart = new Date(currentYear, 0, 1);
        let currentMonth = currentDate.getMonth();
        return {
            itemTitle: 3,
            livePR: {}, //实时阳性率
            extraOpt: {
                disabledDate(date) {
                    return date - currentDate >= 0;
                }
            },
            dateRangeLimit: {
                disabledDate(date) {
                    return date - currentDate >= 0 || yearStart - date > 0;
                }
            },
            currentYear: currentDate.getFullYear(),
            basicInfo: {
                //设备基础信息
            },
            customFees: {
                waterFee: "",
                electricityFee: "",
                laborFee: ""
            },
            toggleItem: false,
            calculationItems: [],
            allCalculationItems: [
                {
                    value: null,
                    symbolName: "inspectionCharge",
                    text: "检查费",
                    name: "检查费收入",
                    disabled: false,
                    income: true,
                    itemStyle: {
                        color: "#326b9a"
                    }
                },
                {
                    value: null,
                    symbolName: "consumablesCost",
                    text: "耗材",
                    name: "耗材收入",
                    disabled: false,
                    income: true,
                    itemStyle: {
                        color: "#387db6"
                    }
                },
                {
                    value: null,
                    symbolName: "drugCost",
                    text: "药剂",
                    name: "药剂收入",
                    disabled: false,
                    income: true,
                    itemStyle: {
                        color: "#4490ce"
                    }
                },
                {
                    value: null,
                    symbolName: "depreciationCost",
                    text: "折旧",
                    name: "折旧支出",
                    disabled: false,
                    income: false,
                    itemStyle: {
                        color: "#539ddb"
                    }
                },
                {
                    value: null,
                    symbolName: "repairCost",
                    text: "维修",
                    name: "维修支出",
                    disabled: false,
                    income: false,
                    itemStyle: {
                        color: "#62afee"
                    }
                },
                {
                    value: null,
                    symbolName: "waterFee",
                    text: "水费",
                    name: "水费支出",
                    disabled: true,
                    income: false,
                    itemStyle: {
                        color: "#7abef6"
                    }
                },
                {
                    value: null,
                    symbolName: "electricityFee",
                    text: "电费",
                    name: "电费支出",
                    disabled: true,
                    income: false,
                    itemStyle: {
                        color: "#9bd0fb"
                    }
                },
                {
                    value: null,
                    symbolName: "laborFee",
                    text: "人工费",
                    name: "人工费支出",
                    disabled: true,
                    income: false,
                    itemStyle: {
                        color: "#b7dbf9"
                    }
                }
            ],
            pieOptData: [],
            prListCol: [
                {
                    title: "诊断医师",
                    key: "doctorName"
                },
                {
                    title: "所属科室",
                    key: "unitName",
                    render: (h, { row, column, index }) => {
                        // console.log(row, column, index);
                        return h(
                            "span",
                            {
                                style: {
                                    color: "#4f9ff0"
                                }
                            },
                            row[column.key]
                        );
                    }
                },
                {
                    title: "上月累计病人量",
                    key: "peopleCount"
                },

                {
                    title: "上月总阳性率",
                    key: "positiveRate",
                    render: (h, { row, column, index }) => {
                        // const customCreate = (
                        //   h,
                        //   row,
                        //   column,
                        //   index,
                        //   options = {
                        //     backgroundColor: "green",
                        //     iconTye: "minus-round"
                        //   }
                        // ) => {
                        //   const { backgroundColor, iconTye } = options;
                        //   return h(
                        //     "Avatar",
                        //     {
                        //       props: {
                        //         size: "small"
                        //       },
                        //       style: {
                        //         backgroundColor
                        //       }
                        //     },
                        //     [
                        //       h("Icon", {
                        //         props: {
                        //           type: iconTye
                        //         }
                        //       })
                        //     ]
                        //   );
                        // };
                        return h("span", [
                            h(
                                "span",
                                Math.round((row[column.key] || 0) * 100) + "%"
                            )
                            // customCreate(h, row, column, index, {
                            //   backgroundColor: "orange",
                            //   iconTye: "android-remove"
                            // }),
                            // customCreate(h, row, column, index, {
                            //   backgroundColor: "green",
                            //   iconTye: "arrow-up-c"
                            // }),
                            // customCreate(h, row, column, index, {
                            //   backgroundColor: "red",
                            //   iconTye: "arrow-down-c"
                            // })
                        ]);
                    }
                }
            ],
            prListData: [
                {
                    doctor: "张医生",
                    department: "设备科",
                    lastMonthCount: 2333,
                    singlePR: "71%",
                    lastTotalPR: "62%"
                }
            ],

            prListPage: {
                current: 1,
                size: 10,
                total: 0
            },
            prStatisticsShow: false,
            originData: null,
            prListLoading: false,

            lineData: [],
            lineDataLoading: false,

            pieDataLoading: false,

            dateCounts: null, //判断是否与上次时间相同
            rangeType: "date", //时间范围类型分类
            dateInfo: {
                date: currentDate,
                remoteData: [],
                total: 0,
                max: 0
            },
            monthInfo: {
                month: currentMonth,
                currentMonth: currentMonth,
                remoteData: [],
                total: 0,
                max: 0,
                min: 0
            },
            yearInfo: {
                remoteData: [],
                year: currentYear,
                total: 0,
                max: 0
            },
            countLoading: 0
        };
    },
    props: {
        activePane: {},
        timeChangeCount: {}
    },
    computed: {
        dateRange: {
            get() {
                return this.$store.state.dateRange;
            },
            set(dateArray) {
                this.$store.commit("setDateRange", dateArray);
                // if(this.activePane===0){//当view视图在该tab页时触发
                this.$emit("timeChange");
                this.handleFeesRequest();
                // }
            }
        },
        costRecovery() {
            //成本收回
            let inspectionCharge = this.findItem("inspectionCharge").value || 0; //检查费
            let cost = this.allCalculationItems
                .filter(v => !v.income)
                .reduce((pre, current) => {
                    return {
                        value: +(pre.value || 0) + +(current.value || 0)
                    };
                }).value; //所有支出
            return inspectionCharge - cost; //检查费-所有支出
        },
        profitStatus() {
            //盈利状态
            return this.originData && this.originData.assetCost
                ? this.costRecovery / this.originData.assetCost
                : this.costRecovery
                    ? this.costRecovery < 0
                        ? -1
                        : 1
                    : 0; //成本收回/设备原值
        },
        totalIncome() {
            //总收入
            return this.allCalculationItems
                .filter(v => v.income)
                .reduce((pre, current) => {
                    //检查+耗材+药剂
                    return {
                        value: +(pre.value || 0) + +(current.value || 0)
                    };
                }).value;
        },
        viewPrListData() {
            let start = (this.prListPage.current - 1) * this.prListPage.size;
            let end = this.prListPage.current * this.prListPage.size;
            end = end > this.prListPage.total ? this.prListPage.total : end;
            return this.prListData.slice(start, end);
        },
        usableItems() {
            return this.allCalculationItems
                .filter(v => !v.disabled)
                .map(v => v.symbolName);
        },
        pieLegend() {
            return {
                data: this.allCalculationItems.map(v => v.name),
                selected: []
            };
        },

        pieOpt() {
            //金额charts
            let legendOpt = {
                orient: "vertical",
                right: 100,
                // top: 20,
                // bottom: 20,
                itemWidth: 30,
                itemHeight: 30,
                itemGap: 50,
                width: 400,
                top: 30,
                formatter: name => {
                    let item = this.findItem(name, "name");
                    // console.log(name,item);
                    let value = !this.isDefined(item.value)
                        ? " --"
                        : this.currencnyFormat(item.value);
                    return `${name}:${value}`;
                },
                textStyle: {
                    fontSize: 16,
                    padding: [0, 0, 0, 15]
                }
            };
            let x = 45;
            let y = x + 20;
            return {
                tooltip: {
                    trigger: "item",
                    // formatter: "{a} <br/>{b}: ￥{c} ({d}%)",
                    formatter: ({ name, value, percent }) => {
                        return `
            <span>综合分析</span>
            <br/>
            <span>${name}：<span><span>${this.currencnyFormat(
                            value
                        )}</span><span>（${percent}%）</span>
            `;
                    }
                },
                legend: [
                    // {//TODO待定
                    //     ...legendOpt,
                    //     data: [...this.pieLegend.data.slice(0, 4),'',...this.pieLegend.data.slice(4, 8)],
                    //     right: "10%"
                    // },
                    {
                        ...legendOpt,
                        data: this.pieLegend.data.slice(0, 4),
                        right: "40%"
                    },
                    {
                        ...legendOpt,
                        data: this.pieLegend.data.slice(4, 8),
                        right: "15%"
                    }
                ],
                series: [
                    {
                        name: "综合分析",
                        type: "pie",
                        center: ["20%", "50%"],
                        radius: [`${x}%`, `${y}%`],
                        label: {
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            }
                        },
                        data: this.pieOptData
                    }
                ]
            };
        },
        isNoData() {
            let dataItems = {
                date: this.dateInfo.remoteData,
                month: this.monthInfo.remoteData,
                year: this.yearInfo.remoteData
            };
            return !dataItems[this.rangeType].length && !this.countLoading;
        },
        numTotalBar() {
            // if (this.countLoading) {
            //     return {};
            // }
            // console.log(this.rangeType);
            switch (this.rangeType) {
                case "date":
                    return this.dateBar;
                case "month":
                    return this.monthBar;
                case "year":
                    return this.yearBar;
            }
        },
        dateBar() {
            return {
                color: "#3BA1F4",
                grid: {
                    left: "10",
                    right: "10",
                    bottom: "5%",
                    top: "10%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: this.dateInfo.remoteData.map(info => {
                        return info.horary.slice(-2) + ":00";
                    })
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        },
                        data: this.dateInfo.remoteData.map(
                            info => info.patientVolume
                        ),
                        type: "bar",
                        barMaxWidth: "25"
                    }
                ]
            };
        },
        monthBar() {
            return {
                color: "#3BA1F4",
                grid: {
                    left: "10",
                    right: "10",
                    bottom: "5%",
                    top: "10%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: this.monthInfo.remoteData.map(info =>
                        info.monthly.slice(-5)
                    )
                },
                yAxis: {
                    type: "value"
                },
                series: {
                    label: {
                        normal: {
                            show: true,
                            position: "top"
                        }
                    },
                    data: this.monthInfo.remoteData.map(
                        info => info.patientVolume
                    ),
                    type: "bar",
                    barMaxWidth: "25"
                }
            };
        },
        yearZIndex() {
            let zIndex = [];
            let split = 3;
            this.yearDateForamt.forEach((info, i) => {
                let index = Math.floor(i / split);
                if (!zIndex[index]) {
                    zIndex[index] = [];
                }
                zIndex[index].push(info);
            });
            return zIndex;
        },
        yearBar() {
            // let max=this.yearInfo.max*2;
            let order = ["一", "二", "三", "四"];

            return {
                color: "#3BA1F4",
                grid: {
                    left: "10",
                    right: "10",
                    bottom: "5%",
                    top: "10%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: this.yearDateForamt.map(
                            info => Number(info.annually.slice(-2)) + "月份"
                        )
                    },
                    {
                        type: "category",
                        data: this.yearZIndex.map((info, i) => {
                            return (
                                `第${order[i]}季度` +
                                "\n" +
                                info.reduce((pre, current) => {
                                    return {
                                        patientVolume:
                                            (+pre.patientVolume || 0) +
                                            (+current.patientVolume || 0)
                                    };
                                }).patientVolume
                            );
                        })
                    }
                ],
                yAxis: {
                    type: "value"
                    // max
                },
                series: [
                    {
                        color: "rgba(255, 248, 1,0.3)",
                        xAxisIndex: 1,
                        data: this.yearZIndex.map(info => {
                            return (
                                Math.max(
                                    ...info.map(v => +v.patientVolume || 0)
                                ) + 2500
                            );
                        }),
                        type: "bar",
                        silent: true,
                        barCategoryGap: "10%"
                    },
                    {
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        },
                        data: this.yearDateForamt.map(
                            info => info.patientVolume
                        ),
                        type: "bar",
                        barMaxWidth: "25"
                    }
                ]
            };
        },
        yearDateForamt() {
            let array = [];
            for (let i = 13; --i; ) {
                let annually = `${this.currentYear}-${String(i).padStart(
                    2,
                    "0"
                )}`;
                let info = this.yearInfo.remoteData.find(
                    info => info.annually === annually
                );
                array.unshift(info || { patientVolume: "0", annually });
            }
            return array;
        },
        lineOpt() {
            //实时阳性率
            return {
                title: {
                    text: "设备阳性率走势",
                    left: "50px"
                },
                tooltip: {
                    trigger: "axis",
                    formatter: "日 期：{b}<br />阳性率：{c}%"
                },
                xAxis: {
                    type: "category",
                    // boundaryGap: false,
                    data: this.lineData.map(v => v.checkMonth),
                    axisTick: {
                        // 坐标轴小标记
                        show: false // 属性show控制显示与否，默认不显示
                    }
                },
                yAxis: {
                    type: "value"
                },
                grid: {
                    left: "3%",
                    right: "2%",
                    bottom: "3%",
                    top: "25%",
                    containLabel: true
                },
                series: [
                    {
                        symbol: "circle",
                        // symbolSize: 10,
                        data: this.lineData.map(v =>
                            ((v.positiveRate || 0) * 100).toFixed(2)
                        ),
                        type: "line",
                        itemStyle: {
                            color: "#137c60"
                        },
                        lineStyle: {
                            color: "#137c60"
                        },
                        label: {
                            show: true,
                            formatter: "{c}%"
                        }
                    }
                ]
            };
        }
    },
    watch: {},
    created() {
        this.getOriginData(); //TODO接口可用后打开
    },
    methods: {
        getOriginData() {
            // if(this.activePane===0){
            this.handleFeesRequest(); //处理费用请求
            // }
            this.getPositiveRate(); //获得实时阳性率
            this.getAssetBasicInfo(); //设备基础数据
            // this.loadBenefitList(); //下半部数据//TODO暂时拿掉
            this.getTrendLine(); //阳性率走势折线图数据

            this.toggleSearch(this.rangeType);
        },
        getAssetBasicInfo() {
            let osId = this.$store.state.user_in.osId;
            let assetId = this.$route.query.id;
            this.$axios.get(`assets/${osId}/${assetId}`).then(res => {
                this.basicInfo = res.data;
            });
        },

        handleFeesRequest() {
            this.pieDataLoading = true;
            Promise.all([this.getFees(), this.getTotal()])
                .then(
                    res => {
                        if (this.setFees({ ...res[0].data, ...res[1].data })) {
                            this.toggleItem = true; //暂定 数据正确后在获得所有信息后执行
                            this.toggleAll(true);
                        }
                    },
                    error => {}
                )
                .finally(() => {
                    this.dateCounts = this.timeChangeCount;
                    this.pieDataLoading = false;
                });
        },
        getFees() {
            //获得分析类别item
            return this.$axios.post(`/cba/queryApplyInfo`, {
                assetId: this.$route.query.id,
                startDate: this.dateRange[0]
                    ? this.$store.state.localeDate(this.dateRange[0]) +
                      " 00:00:00"
                    : "",
                endDate: this.dateRange[1]
                    ? this.$store.state.localeDate(this.dateRange[1]) +
                      " 23:59:59"
                    : "",
                jxCode: true,
                hcCode: true,
                yjCode: true
            });
        },
        getTotal() {
            if (this.originData && this.originData.totalCost) {
                const { totalCost, checkDate } = this.originData;
                return Promise.resolve({ data: { totalCost, checkDate } });
            } else {
                return this.$axios.post(`/cba/queryApplyInfoTotal`, {
                    assetId: this.$route.query.id
                });
            }
        },
        setFees(data) {
            // console.log(data);
            if (Object.keys(data).length < 8) {
                return false;
            }

            this.originData = data;

            for (let i in data) {
                let temp = this.findItem(i);
                if (temp) {
                    temp.value = data[i];
                    if (!this.isDefined(data[i])) {
                        temp.disabled = true;
                    }
                }
            }
            return true;
        },
        getPositiveRate() {
            //获得实时阳性率
            this.$axios
                .post(`/cba/getPositiveRate`, {
                    assetId: this.$route.query.id
                })
                .then(res => {
                    this.livePR = res.data;
                });
        },
        async getTrendLine() {
            //获得阳性率走势图 数据
            this.lineDataLoading = true;
            const { data } = await this.$axios.post(
                `/cba/getEveryMonthPositiveRate`,
                { assetId: this.$route.query.id }
            );

            this.lineData = data;
            this.lineDataLoading = false;
        },

        getPositiveByDoctor(info) {
            //获得单个医生相对于该资产所有阳性率信息
            console.log(info);
            this.$axios.post(`/cba/getPositiveByDoctorName`, {
                doctorId: info.doctorId,
                hospId:this.$store.state.user_in.osId
            });
        },
        toggleAll(flag) {
            if (flag) {
                this.calculationItems = this.usableItems;
                let regularData = this.allCalculationItems.filter(
                    v => !v.disabled
                );
                this.pieOptData = this.allCalculationItems.map(
                    ({ value, name, itemStyle, symbolName }) => {
                        return {
                            value,
                            symbolName,
                            name,
                            itemStyle
                        };
                    }
                );
            } else {
                this.calculationItems = [];
                this.pieOptData = [
                    {
                        value: 0,
                        symbolName: "No data",
                        name: "暂无数据",
                        itemStyle: {
                            color: "#ccc"
                        }
                    }
                ];
            }
        },
        currencnyFormat(num) {
            if (!isNaN(+num)) {
                num = +num;
                // return num.toLocaleString("zh",{style:"currency",currency:'CNY'});//‘￥’在‘-’后
                return `￥${num
                    .toLocaleString("zh", {
                        style: "currency",
                        currency: "CNY"
                    })
                    .replace(/￥/g, "")}`; //‘￥’在‘-’前
            }
        },
        joinCalculation() {
            for (let i in this.customFees) {
                let value = this.customFees[i];

                let deleteIndex = this.pieOptData.findIndex(
                    v => v.symbolName === i
                );
                if (deleteIndex >= 0) {
                    this.pieOptData.splice(deleteIndex, 1);
                }
                this.calculationItems = this.calculationItems.filter(
                    v => v !== i
                );

                if (this.isNumber(value)) {
                    let item = this.findItem(i);

                    this.pieOptData.push({
                        //加入饼图
                        value,
                        symbolName: i,
                        name: item.name,
                        itemStyle: item.itemStyle
                    });
                    this.calculationItems.push(i);
                    this.findItem(i).value = value;
                    this.findItem(i).disabled = false;
                } else {
                    this.findItem(i).disabled = true;
                    this.findItem(i).value = null;
                }
            }
            this.checkItems(this.calculationItems);
        },
        checkItems(items) {
            // console.log(items);
            if (items.length === 0) {
                this.toggleItem = false;
                this.pieOptData = [
                    {
                        value: 0,
                        symbolName: "No data",
                        name: "暂无数据",
                        itemStyle: {
                            color: "#ccc"
                        }
                    }
                ];
                return;
            }
            this.toggleItem =
                items.sort().toString() === this.usableItems.sort().toString();
            this.pieOptData = this.allCalculationItems
                // .filter(v => items.includes(v.symbolName))
                .map(({ value, name, itemStyle, symbolName }) => {
                    return {
                        value: items.includes(symbolName) ? value : null,
                        symbolName,
                        name,
                        itemStyle
                    };
                });
        },

        // 效益分析下半部数据
        loadBenefitList() {
            this.prListLoading = true;
            this.$axios
                .post(`/cba/getPositiveRateListLastMonth`, {
                    assetId: this.$route.query.id
                })
                .then(res => {
                    this.prListData = res.data;
                    this.prListPage.total = this.prListData.length;
                })
                .finally(() => {
                    this.prListLoading = false;
                });
        },
        prStatisticsView() {
            this.prStatisticsShow = true;
        },

        isDefined(variable) {
            return variable !== null && variable !== undefined;
        },
        isNumber(num) {
            return num === +num;
        },
        findItem(attrValue, attrKey = ["symbolName"]) {
            return this.allCalculationItems.find(v => v[attrKey] === attrValue);
        },
        handleDaterange(dateArray) {
            this.handleFeesRequest();
            this.$store.commit("setDateRange", dateArray);
        },
        toggleSearch(type) {
            let types = {
                date: () => {
                    this.searchDateNum(this.dateInfo.date);
                },
                month: () => {
                    this.searchMonthNum(this.monthInfo.month);
                },
                year: () => {
                    this.searchYearNum(this.currentYear);
                }
            };
            types[type]();
        },
        searchYearNum(year) {
            year = String(year);
            let requestBody = {
                assetId: this.$route.query.id,
                yearDate: year
            };
            this.countLoading++;
            this.$axios
                .post(`/cba/getYearPatientVolume`, requestBody)
                .then(({ data }) => {
                    this.yearInfo.remoteData = data;
                    if (!data.length) {
                        this.yearInfo.total = 0;
                        this.yearInfo.max = 0;
                        return;
                    }
                    this.yearInfo.total = data.reduce((pre, current) => {
                        return {
                            patientVolume:
                                (+pre.patientVolume || 0) +
                                (+current.patientVolume || 0)
                        };
                    }).patientVolume;
                    this.yearInfo.max = Math.max(
                        ...data.map(info => +info.patientVolume || 0)
                    );
                })
                .finally(() => {
                    this.countLoading--;
                });
        },

        searchDateNum(date) {
            date = this.$store.state.localeDate(date);
            let requestBody = {
                assetId: this.$route.query.id,
                dayDate: date
            };
            this.countLoading++;
            this.$axios
                .post(`/cba/getHourPatientVolume`, requestBody)
                .then(({ data }) => {
                    this.dateInfo.remoteData = data;
                    if (!data.length) {
                        this.dateInfo.total = 0;
                        this.dateInfo.max = 0;
                        return;
                    }
                    this.dateInfo.total = data.reduce((pre, current) => {
                        return {
                            patientVolume:
                                (+pre.patientVolume || 0) +
                                (+current.patientVolume || 0)
                        };
                    }).patientVolume;
                    this.dateInfo.max = Math.max(
                        ...data.map(info => +info.patientVolume || 0)
                    );
                })
                .finally(() => {
                    this.countLoading--;
                });
        },
        searchMonthNum(month) {
            month = `${this.currentYear}-${String(month).padStart(2, "0")}`;
            let requestBody = {
                assetId: this.$route.query.id,
                monthDate: month
            };
            this.countLoading++;
            this.$axios
                .post(`/cba/getMonthPatientVolume`, requestBody)
                .then(({ data }) => {
                    this.monthInfo.remoteData = data;
                    if (!data.length) {
                        this.monthInfo.total = 0;
                        this.monthInfo.max = 0;
                        this.monthInfo.min = 0;
                        return;
                    }
                    this.monthInfo.total = data.reduce((pre, current) => {
                        return {
                            patientVolume:
                                (+pre.patientVolume || 0) +
                                (+current.patientVolume || 0)
                        };
                    }).patientVolume;
                    this.monthInfo.max = Math.max(
                        ...data.map(info => +info.patientVolume || 0)
                    );
                    this.monthInfo.min = Math.min(
                        ...data.map(info => +info.patientVolume || 0)
                    );
                })
                .finally(() => {
                    this.countLoading--;
                });
        },
        print() {
            const {
                allCalculationItems,
                basicInfo,
                dateRange,
                livePR,
                costRecovery,
                profitStatus,
                totalIncome,
                originData
            } = this;

            let printInfo = {
                allCalculationItems,
                basicInfo,
                dateRange: dateRange.map(date => {
                    return this.$store.state.localeDate(date);
                }),
                positiveRate: livePR.positiveRate || 0,
                analysis: {
                    costRecovery,
                    profitStatus,
                    totalIncome,
                    assetCost:
                        originData && originData.assetCost
                            ? originData.assetCost
                            : 0
                }
            };
            localStorage.setItem("printInfo", JSON.stringify(printInfo));
            this.$router.push({ name: "benefit-analysis-print" });
        }
    }
};
</script>

<style lang="less" scoped>
.comprehensive-analysis-wrap {
    width: 100%;
    position: relative;
    background-color: #fafafa;
    padding: 15px 25px 30px;
    .custom-reduis {
        border-radius: 4px;
    }
    .show-area-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .asset-info {
            background-color: #ffffff;
            padding: 0 25px 20px;
            width: 68%;
            .custom-reduis;

            .ivu-col {
                height: 40px;
                font-size: 14px;
                color: #666666;
            }
            .info-title {
                width: 75px;
            }
            .info-content {
                width: calc(~"50% - 75px");
            }
            .asset-name {
                height: 40px;
                font-size: 18px;
                color: #0c8399;
            }
        }
        .cost-supplement {
            background-color: #ffffff;
            padding: 0 25px 20px;
            width: 30%;
            position: relative;
            .custom-reduis;
            .join-calculation {
                position: absolute;
                right: 25px;
                top: 5px;
            }
            .cost-supplement-content {
                margin-top: 20px;
                > li {
                    display: flex;
                    margin-bottom: 20px;
                    align-items: center;
                    @width: 20%;
                    @height: 30px;
                    .all {
                        display: flex;
                        align-items: center;
                    }
                    .types-of-fee {
                        .all;
                        font-size: 14px;
                        color: #666666;
                        height: @height;
                        width: @width;
                    }
                    .fee-input {
                        .all;
                        // height: @height;
                        width: 100 - @width;
                        // /deep/.ivu-input{
                        //     height: 44px;;
                        // }
                    }
                }
            }
        }
    }
    .show-area-middle {
        margin-top: 16px;
        border: 1px solid #dddee1;
        border-radius: 3px;
        .requirement-bar {
            background-color: #f3f4f5;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            .calculation-items {
                display: flex;
                align-items: center;
                .calculation-items-title {
                    font-size: 14px;
                    color: #020e0f;
                    font-weight: 600;
                }
                // /deep/.ivu-checkbox-group{
                //     height:
                // }
            }
            .other-items {
                .set-gutter {
                    margin-left: 20px;
                }
            }
        }
        .calculation-statistics-show {
            width: 100%;
            display: flex;
            .calculation-statistics-pie {
                flex-shrink: 0;
                // flex-grow: 1;
                height: 350px;
                width: 550px;
            }
            .calculation-statistics-items {
                flex-grow: 1;
                padding-left: 150px;
                height: 350px;
                display: flex;
                align-items: center;
                @width: 30px;
                > ul {
                    height: 80%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    > li {
                        height: 25%;
                        display: flex;
                        align-items: center;
                    }
                }
                .item-type-color {
                    display: inline-block;
                    width: @width;
                    height: @width;
                }
                .item-type-name {
                    font-size: 16px;
                    color: #666666;
                    margin-left: 20px;
                }
            }
        }
        .calculation-statistics-bar {
            background-color: #f3f4f5;
            // height: 70px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 20px;
            .calculation-statistics-wrap {
                width: 100%;
                height: 70px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .calculation-statistics {
                    .statistics-type {
                        display: inline-block;
                        width: 72px;
                        height: 28px;
                        text-align: center;
                        line-height: 28px;
                        font-size: 14px;
                        color: #fff;
                        &-fair {
                            color: #666666;
                            background-color: #d0d0d0;
                        }
                        &-profit {
                            background-color: #ebdac4;
                            color: #d3911f;
                        }
                        &-deficit {
                            background-color: #f8c8cd;
                            color: #e7485a;
                        }
                        &-excellent {
                            background-color: #c4e6eb;
                            color: #0c8399;
                        }
                    }
                }
                .calculation-statistics-title {
                    font-size: 14px;
                    color: #666666;
                }
                .calculation-statistics-result {
                    font-size: 16px;
                    color: #fe881a;
                }
            }
            .formula-description {
                width: 100%;
                height: 70px;
                display: flex;
                align-items: center;
                border-top: 1px solid #dddee1;
                .solid-circle {
                    display: inline-block;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: #0c8399;
                    margin-right: 5px;
                }
                .formula-item{
                    color: #111;
                }
                .description-item {
                    color: #777;
                }
            }
            .calculation-IAE-wrap {
                width: calc(~"100% - 75px");
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;

                .calculation-IAE {
                    margin-left: 10px;
                }
            }
            .positive-rate {
                display: flex;
                align-items: center;
                .positive-rate-title {
                    width: 60px;
                    font-size: 14px;
                    color: #666666;
                }
            }
        }
    }

    .show-area-bottom {
        position: relative;
        margin-top: 20px;
         border: 1px solid #dddee1;
        border-radius: 3px;
        background-color: #fafafa;
        .title-head {
            width: 100%;
            height: 50px;
            font-size: 14px;
            background-color: #f3f4f5;
            padding-left: 20px;
            display: flex;
            align-items: center;
        }
        .content-body{
            width:100%;
            padding: 15px;
            .search-bar {
                padding-bottom:15px; 
                .search-item {
                    height: 100%;
                }
                .view-item {
                    height: 100%;
                    > .ivu-col {
                        display: flex;
                        align-items: center;
                        h4 {
                            font-size: 14px;
                            font-weight: 700;
                        }
                        span {
                            font-size: 14px;
                            color: #387db6;
                        }
                    }
                }
            }
            .num-total {
                width: 100%;
                height: 300px;
                background-color:#fff; 
                border-radius:3px; 
            }
        }
    }
}
</style>
<template>
    <div class="benefit-analysis-print-wrap">
        <div class="print-header">
            <span>
                <!-- 报告编号：{{'0020180822133012'}} -->
                </span>
            <span>{{this.$store.state.user_in.hosName}}</span>
        </div>
        <div class="print-container asset-name">
            {{basicInfo.assetName}}
        </div>
        <div class="print-container asset-basic-info-warp">
            <i-row class-name="asset-basic-info">
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    设备编码：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.assetCode}}
                </i-col>

                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    设备SN号：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.assetSN}}
                </i-col>

                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    所属科室：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.osName}}
                </i-col>

                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    安装地点：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.installSectionName}}
                </i-col>

                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    设备品牌：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.brandName}}
                </i-col>

                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    设备型号：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.assetClass}}
                </i-col>

                <!-- <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    院内分类：
                </i-col> -->
                <!-- <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.assetHosTypeName}}
                </i-col> -->

                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    子分类：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{basicInfo.assertTypeName}}
                </i-col>
            </i-row>

        </div>
        <div class="print-container asset-charts-info-wrap">
            <i-row>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    统计时间段：
                </i-col>
                <i-col :span="chartsInfotWidth" class-name="info-wrap">
                    {{this.dateRange[0]}} ~ {{this.dateRange[1]}}
                </i-col>
            </i-row>
            <i-row>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    分析类别：
                </i-col>
                <i-col :span="chartsInfotWidth" class-name="info-wrap analysis-types">
                    <div class="analysis-type" v-for="(v,i) of allCalculationItems" :key="i">
                        <div class="type-icon" >
                            <div class="type-icon-checked" v-if="v.value!==null">
                                <Icon type="checkmark" class="check-mark"></Icon>
                            </div>

                        </div>
                        <div class="analysis-type-name">
                           {{v.text}}
                        </div>
                    </div>
                </i-col>
            </i-row>
            <i-row>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    阳性率：
                </i-col>
                <i-col :span="chartsInfotWidth" class-name="info-wrap">
                    {{positiveRate}}
                </i-col>
            </i-row>

        </div>
        <div class="print-container charts-wrap">
            <kld-echarts :option="pieOpt"  ></kld-echarts>
        </div>
        <div class="print-container analysis-result">
            <i-row>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    设备购入原值：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{this.currencnyFormat(analysis.assetCost)}}
                </i-col>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    当前总收入：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{this.currencnyFormat(analysis.totalIncome)}}
                </i-col>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    成本收回：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{this.currencnyFormat(analysis.costRecovery)}}
                </i-col>
                <i-col :span="assetInfoTitleWidth" class-name="info-wrap text-space-between">
                    盈利状态：
                </i-col>
                <i-col :span="assetInfoContentWidth" class-name="info-wrap">
                    {{profitStatusText}}
                </i-col>
            </i-row>
        </div>
        <div  class="query-icons">
            <Button class="kld-btn-default" @click="goback">返回</Button>
            <Button class="kld-btn" @click="doPrint">打印</Button>
        </div>

    </div>
</template>

<script>
import kldEcharts from "@common/kld-echarts/kld-echarts.vue";


export default {
    name: "benefit-analysis-print",
    components: {kldEcharts },
    data() {
        return {
            assetInfoTitleWidth: 3,
            printInfo: JSON.parse(localStorage.getItem("printInfo"))
        };
    },
    created() {},
    // beforeDestroy() {
    //     window.localStorage.removeItem("printInfo");
    // },
    computed: {
        assetInfoContentWidth() {
            return 12 - this.assetInfoTitleWidth;
        },
        chartsInfotWidth() {
            return 24 - this.assetInfoTitleWidth;
        },
        pieOpt() {
            let legendOpt = {

                orient: "vertical",
                right: 40,
                // top: 20,
                // bottom: 20,
                itemWidth: 18,
                itemHeight: 18,
                itemGap: 30,
                // width: 200,
                top: 80,
                borderRadius:0,
                selectedMode:false,
                formatter: name => {
                    let item = this.findItem(name, "name");
                    // console.log(name,item);
                    let value = !this.isDefined(item.value)
                        ? " --"
                        : this.currencnyFormat(item.value);
                    return `${name}:${value}`;
                },
                textStyle: {
                    fontSize: 12,
                    padding: [0, 0, 0, 5]
                }
            };
            let concentricCircleSeries={
                name: "综合分析",
                type: "pie",
                center: ["22%", "50%"],
                data: [0],
                itemStyle:{
                    color:"#dddee1",
                },
                silent:true,
                label: {
                    normal:{
                        show:false
                    }
                },
                animation:false
            }
            let x=25;
            let y=x+15;
            return {
                title: {
                    text: "费用占比",
                    left:'17.3%',
                    top: "46%",
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 16,
                        color: "#666"
                    }
                },
                legend: [
                    {
                        ...legendOpt,
                        data: [...this.pieLegend.data.slice(0, 4),'',...this.pieLegend.data.slice(4, 8)],
                        right: "3%",
                        textStyle:{
                            // borderWidth:1,
                            // borderColor:"#000",
                            width:300,
                        }
                        
                    },
                    // {
                    //     ...legendOpt,
                    //     data: this.pieLegend.data.slice(4, 8),
                    //     right: "3%",

                    // }
                ],
                series: [
                    {
                        ...concentricCircleSeries,
                        radius: [`${y+5}%`, `${y+5.5}%`]
                    },
                    {
                        ...concentricCircleSeries,
                        radius: [`${x-5}%`, `${x-4.5}%`]
                    },
                    {
                        name: "综合分析",
                        type: "pie",
                        startAngle:0,
                        center: ["22%", "50%"],
                        radius: [`${x}%`, `${y}%`],
                        // legendHoverLink: false,
                        // hoverAnimation: false,
                        label: {
                            normal:{
                                // lineHeight:70,
                                formatter: '{b}\n {d}%\n',
                                color:"#000"
                            }
                        },
                        labelLine:{
                            lineStyle:{
                                color:"#aaa"
                            }
                        },
                        silent:true,
                        data: this.pieOptData,
                        animation:false
                    }
                ]
            };
        },
        basicInfo() {
            return this.printInfo.basicInfo;
        },
        allCalculationItems() {
            return this.printInfo.allCalculationItems;
        },
        dateRange() {
            return this.printInfo.dateRange;
        },

        OriginPositiveRate() {
            return this.printInfo.positiveRate;
        },
        positiveRate() {
            return `${(this.printInfo.positiveRate * 100).toFixed(2)}%`;
        },
        pieLegend() {
            return {
                data: this.allCalculationItems.map(v => v.name),
                selected: []
            };
        },
        pieOptData() {
            return this.allCalculationItems.map(
                ({ value, name, itemStyle, symbolName }) => {
                    return {
                        value,
                        symbolName,
                        name,
                        itemStyle
                    };
                }
            );
        },
        analysis(){
            return this.printInfo.analysis;
        },
        profitStatusText(){
            const {profitStatus}=this.analysis;
            if(profitStatus>=0.5){
                return '优秀'
            }else if(profitStatus>=0.2){
                return '良好'
            }else if(profitStatus>=0){
                return '持平'
            }else {
                return '不良'
            }
        }
    },
    methods: {
        findItem(attrValue, attrKey = ["symbolName"]) {
            return this.allCalculationItems.find(v => v[attrKey] === attrValue);
        },
        currencnyFormat(num) {
            if (!isNaN(+num)) {
                num=+num;
                // return num.toLocaleString("zh",{style:"currency",currency:'CNY'});//‘￥’在‘-’后
                return `￥${num
                    .toLocaleString("zh", {
                        style: "currency",
                        currency: "CNY"
                    })
                    .replace(/￥/g, "")}`; //‘￥’在‘-’前
            }
        },
        isDefined(variable) {
            return variable !== null && variable !== undefined;
        },
        goback(){
            this.$router.go(-1)
        },
        doPrint(){
            window.print();
        }
    }
};
</script>


<style lang="less" scoped>

.benefit-analysis-print-wrap {
    position: relative;
    width: 210mm;
    height:296mm;
    margin: 0 auto;
    @border: 1px solid #dddee1;
    padding: 15px;
    // padding-top: 15px;
    background-color: #fff;
    color: #000;
    .print-container {
        width: 100%;
        padding: 15px;
        border-bottom: @border;
    }
    .info-wrap {
        height: 25px;
        line-height: 25px;
    }
    .print-header {
        width: 100%;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 20px;
        border-bottom: @border;
        color: #7e7e81;
    }
    .asset-name {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 23px;
        margin-top: 20px;
    }
    .asset-basic-info-warp {
        .asset-basic-info {
            .asset-info {
            }
        }
    }
    .asset-charts-info-wrap {
        .analysis-types {
            display: flex;
            align-items: center;
            .analysis-type {
                height: 16px;
                display: flex;
                margin-right:15px; 
                align-items: center;
                // padding: 4px;
                @side-length: 12px;
                .type-icon {
                    width: @side-length;
                    height: @side-length;
                    background-color: #7e7e81;
                    margin: 0 3px;
                    border-radius: 2px;
                    .type-icon-checked {
                        width: 100%;
                        height: 100%;
                        background-color: #9abf9a;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 2px;
                        .check-mark {
                            color: #fff;
                        }
                    }
                }
                .analysis-type-name {
                }
            }
        }
    }
    .charts-wrap {
        width: 100%;
        height: 380px;
        padding: 15px 0;
        border-bottom: none;
    }
    .analysis-result{
        background-color: #f0f0f0;
        border-bottom: none;

    }
    .query-icons{
        height: 120px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        /deep/.ivu-btn{
            margin-right: 30px;
        }
        
    }
    @media print {
        .query-icons{
            display: none;
        }
    }
}

</style>

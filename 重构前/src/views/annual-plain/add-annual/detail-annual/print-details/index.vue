<template>
    <div class="print">

    </div>
</template>

<script>
    import "./FileSaver.js";
    import "./jquery.wordexport";

    export default {
    props: {
        data: {}
    },
    data() {
        return {
            city: ""
        };
    },
    created() {},
    methods: {
        print(datas, fileName = "年度计划") {
            this.$axios
                .get(`/orgstruct/queryHospital/${this.$store.state.user_in.osId}`)
                .then(({ data }) => {
                    if (typeof data.area === "string") {
                        this.city = data.area.endsWith("市")
                            ? data.area
                            : data.city.endsWith("市")
                                ? data.city
                                : data.province;
                    }
                    //this.prints(datas, fileName);
                })
                .finally(() => {
                    this.prints(datas, fileName);
                });
        },
        prints(data, fileName = "年度计划") {
            //   let planningExpertsTime = data.planningExpertsTime;
            //   planningExpertsTime = planningExpertsTime.split(" ");
            //   planningExpertsTime = planningExpertsTime[0];
            let planningExpertsTime =
                typeof data.planningExpertsTime === "string"
                    ? data.planningExpertsTime.split(" ")[0]
                    : "";
            let unitExpertsTime =
                typeof data.unitExpertsTime === "string"
                    ? data.unitExpertsTime.split(" ")[0]
                    : "";
            $(".print")
                .html(
                    `  <body style="tab-interval:21pt;text-justify-trim:punctuation;" class="bodys">
    <!--StartFragment-->
    <div class="Section0" style="layout-grid:15.6000pt;">
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:30.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:30.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:50.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-hansi-font-family:宋体;font-weight:bold;font-size:26.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">${
                        this.city === null ? "" : this.city
                    }公立医疗卫生机构医用仪器</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-weight:bold;font-size:26.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:50.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-hansi-font-family:宋体;font-weight:bold;font-size:26.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">设备配置论证表</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-weight:bold;font-size:26.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>

        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:黑体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p>&nbsp;</o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:黑体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p>&nbsp;</o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:黑体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p>&nbsp;</o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="text-indent:54.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="楷体_GB2312">配置单位</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:0.0000pt;">(
                    <font face="楷体_GB2312">盖章</font>
                    <font face="Times New Roman">)</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="楷体_GB2312">：</font>
                </span>
            </b>
       
                <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;"
                    <font face="楷体_GB2312">${
                        this.$store.state.user_in.hosName
                    }
                    </font> &nbsp;&nbsp;&nbsp;</span>
  
            <b>
            </b>
        </p>
        <p class=MsoNormal style="text-indent:54.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="楷体_GB2312">申</font> &nbsp;
                    <font face="楷体_GB2312">请</font> &nbsp;
                    <font face="楷体_GB2312">科</font> &nbsp;
                    <font face="楷体_GB2312">室&nbsp;&nbsp;&nbsp;：</font>
                </span>
            </b>
   
                <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="楷体_GB2312">${
                        data.sectionName
                    }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</font>
                </span>

            <b>
                <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="text-indent:54.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="楷体_GB2312">设</font> &nbsp;
                    <font face="楷体_GB2312">备</font> &nbsp;
                    <font face="楷体_GB2312">名</font> &nbsp;
                    <font face="楷体_GB2312">称&nbsp;&nbsp;&nbsp;：</font>
                </span>
            </b>
                <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">${data.assetName}</font>
                </span>
            </u>
     
                <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </u>
            <b>

            </b>
        </p>
        <p class=MsoNormal style="text-indent:54.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:40.0000pt;mso-line-height-rule:exactly;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="楷体_GB2312">填</font> &nbsp;
                    <font face="楷体_GB2312">报</font> &nbsp;
                    <font face="楷体_GB2312">日</font> &nbsp;
                    <font face="楷体_GB2312">期&nbsp;&nbsp;&nbsp;：</font>
                </span>
            </b>
        
    
                <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <font>
                        <font face="宋体">${data.applyTime.split(" ")[0]}</font>
                        

                    </font>
                </span>
      

            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <br clear=all style='page-break-before:always'>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <font face="方正黑体_GBK">表一</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-hansi-font-family:宋体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">科室医用仪器设备配置申请表</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <table class=MsoNormalTable border=0 cellspacing=0 style="border-collapse:collapse;width:455.4000pt;mso-table-layout-alt:fixed;border:none;mso-padding-alt:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;">
            <tr style="height:33.0000pt;">
                <td width=174 valign=center style="width:104.6500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">申请科室</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=584 valign=center style="width:350.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.sectionName
                        }</span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=174 valign=center style="width:104.6500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">设备名称</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=584 valign=center style="width:350.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <font face="宋体"> ${data.assetName}</font>
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=174 valign=center style="width:104.6500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">配置数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=584 valign=center style="width:350.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.assetNum
                        }
                            <font face="仿宋_GB2312">套</font>
                        </span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=174 valign=center style="width:104.6500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">国产
                            <font face="Times New Roman">/</font>
                            <font face="仿宋_GB2312">进口</font>
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=584 valign=center style="width:350.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.importation === 1
                                ? "国产"
                                : data.importation === 2 ? "进口" : ""
                        }
                        </span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=174 valign=center style="width:104.6500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预算金额</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=584 valign=center style="width:350.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            typeof data.totalPrice === "number"
                                ? data.totalPrice / 10000
                                : 0
                        }
                            <font face="仿宋_GB2312">万元</font>
                        </span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr>
                <td width=759 valign=center colspan=2 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">科室申请理由：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:25.0000pt;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;line-height:25.0000pt;">
                            <font face="宋体" style='line-height:25.0000pt;'>${
                                data.buyWhy
                            }</font>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;display: inline-block;width: 377px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科室负责人：</span>
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${
                            data.applicantName
                        }
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>

                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：
                        </span>
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.applyTime.split(" ")[0]
                        }</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
        </table>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <br clear=all style='page-break-before:always'>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <font face="方正黑体_GBK">表二</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-hansi-font-family:宋体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">医用仪器设备配置效益分析表</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <table class=MsoNormalTable border=0 cellspacing=0 style="border-collapse:collapse;width:455.4000pt;mso-table-layout-alt:fixed;border:none;mso-padding-alt:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;">
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=6 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">一、基本情况</span>
                        </b>
                        <b>
                            <span style="font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">设备名称</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=576 valign=center colspan=5 style="width:346.0000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.assetName
                        }</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:25.5000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">申请科室</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center colspan=2 style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.sectionName
                        }</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">配置数量</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.assetNum
                        }</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">国产/进口</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center colspan=2 style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.importation === 1
                                ? "国产"
                                : data.importation === 2 ? "进口" : ""
                        }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预算金额</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            typeof data.totalPrice === "number"
                                ? data.totalPrice / 10000 + "万"
                                : 0 + "万"
                        }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=6 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">二、经济效益分析</span>
                        </b>
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=209 valign=center colspan=2 style="width:125.9000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">资金来源</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=154 valign=center style="width:92.9500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.capitalSource === 1
                                ? "医院自筹"
                                : data.capitalSource === 2
                                    ? "财政拨款"
                                    : data.capitalSource === 3
                                        ? "科研经费支出"
                                        : data.capitalSource === 4
                                            ? "重点病种专项基金"
                                            : ""
                        }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:126.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">使用年限</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=183 valign=center style="width:109.8000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            ${data.durableYears}
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=209 valign=center colspan=2 style="width:125.9000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">收费标准</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=154 valign=center style="width:92.9500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            ${
                                //   typeof data.rates === "number"
                                //     ? data.rates / 10000 + "万"
                                //     : ""
                                data.rates
                            }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:126.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预计年经济收入</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=183 valign=center style="width:109.8000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            ${
                                data.rates
                                //   typeof data.rates === "number"
                                //     ? data.rates / 10000 + "万"
                                //     : ""
                            }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=209 valign=center colspan=2 style="width:125.9000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">年折旧费用</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=154 valign=center style="width:92.9500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            ${
                                data.depreciationCost
                                //   typeof data.depreciationCost ===
                                //   "number"
                                //     ? data.depreciationCost / 10000 +
                                //       "万"
                                //     : ""
                            }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:126.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">科室直接人员费用</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=183 valign=center style="width:109.8000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            ${
                                data.staffCost
                                //   typeof data.staffCost === "number"
                                //     ? data.staffCost / 10000 + "万"
                                //     : ""
                            }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=209 valign=center colspan=2 style="width:125.9000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预计年维修费用</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=154 valign=center style="width:92.9500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            ${
                                data.maintainCost
                                //   typeof data.maintainCost ===
                                //   "number"
                                //     ? data.maintainCost / 10000 +
                                //       "万"
                                //     : ""
                            }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:126.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预计年耗材费用</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=183 valign=center style="width:109.8000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.consumableCost
                            //   typeof data.consumableCost === "number"
                            //     ? data.consumableCost / 10000 + "万"
                            //     : ""
                        }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=209 valign=center colspan=2 style="width:125.9000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">年收支结余率</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=154 valign=center style="width:92.9500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.surplus !== null ? data.surplus + "%" : ""
                        }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center colspan=2 style="width:126.7500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预计成本回收期</span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=183 valign=center style="width:109.8000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.recycle !== null ? data.recycle + "年" : ""
                        }
                        </span>
                        <span style="font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=6 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">三、社会效益分析</span>
                        </b>
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=6 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;mso-layout-grid-align:none;text-autospace:none;text-align:left;line-height:25.0000pt;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${
                            data.benefitAnalysis
                        }</span>
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                                        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;text-align:left;">
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p>&nbsp;</o:p>
                            </span>
                        </b>
                    </p>
                                        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;text-align:left;">
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p>&nbsp;</o:p>
                            </span>
                        </b>
                    </p>
                                        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;text-align:left;">
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p>&nbsp;</o:p>
                            </span>
                        </b>
                    </p>
                                        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;text-align:left;">
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p>&nbsp;</o:p>
                            </span>
                        </b>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;text-align:left;">
                        <b>
                            <span style="font-family:宋体;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p>&nbsp;</o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
        </table>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <br clear=all style='page-break-before:always'>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <font face="方正黑体_GBK">表三</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-hansi-font-family:宋体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">医用仪器设备配置专家论证意见</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:黑体;font-size:10.5000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <table class=MsoNormalTable border=0 cellspacing=0 style="border-collapse:collapse;width:455.4000pt;mso-table-layout-alt:fixed;border:none;mso-padding-alt:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;">
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">一、基本情况</span>
                        </b>
                        <b>
                            <span style="font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">设备名称</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=576 valign=center colspan=3 style="width:346.0000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <font face="宋体"> ${data.assetName}</font>
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">申请科室</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">  ${
                            data.sectionName
                        }</span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">配置数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${
                            data.assetNum
                        }

                        </span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">国产
                            <font face="Times New Roman">/</font>
                            <font face="仿宋_GB2312">进口</font>
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;"> ${
                            data.importation === 1
                                ? "国产"
                                : data.importation === 2 ? "进口" : ""
                        }</span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预算金额</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">                                                               ${
                            typeof data.totalPrice === "number"
                                ? data.totalPrice / 10000 + "万"
                                : ""
                        }
                        </span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">单位现有数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">无</span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">科室现有数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">无</span>
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">二、单位专家论证意见</span>
                        </b>
                        <b>
                            <span style="font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:154.5000pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:left;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                                             <o:p>${
                                                 data.unitExpertsType === 1
                                                     ? "通过"
                                                     : data.unitExpertsType ===
                                                       2
                                                         ? "未通过"
                                                         : "&nbsp;"
                                             }</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>${
                                data.unitExpertsVote !== null
                                    ? data.unitExpertsVote
                                    : "&nbsp;"
                            }</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">专家签名：&nbsp;&nbsp;</span>
                                              <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${
                                                  data.unitExpertsName !== null
                                                      ? data.unitExpertsName
                                                      : ""
                                              }
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:266.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">日 &nbsp;期：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>                                                    <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${unitExpertsTime}
                        </span></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">三、卫计委专家论证意见</span>
                        </b>
                        <b>
                            <span style="font-family:'Times New Roman';mso-fareast-font-family
                        <b>
                            <span style="font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:154.5000pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:left;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';font-size:14.0000pt;mso-font-kerning:1.0000pt;">                        
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                                             <o:p>${
                                                 data.planningExpertsType === 1
                                                     ? "通过"
                                                     : data.planningExpertsType ===
                                                       2
                                                         ? "未通过"
                                                         : "&nbsp;"
                                             }</o:p>
                            
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>${
                                data.planningExpertsVote !== null
                                    ? data.planningExpertsVote
                                    : "&nbsp;"
                            }</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:28.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">专家签名：&nbsp;&nbsp;</span>
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${
                            data.planningExpertsName !== null
                                ? data.planningExpertsName
                                : ""
                        }
                        </span>

                    </p>
                    <p class=MsoNormal style="text-indent:266.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">日 &nbsp;期：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>
                                                    <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${planningExpertsTime}
                        </span>
                            </o:p>
                        </span>
                    </p>
                </td>
            </tr>
        </table>
        <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <br clear=all style='page-break-before:always'>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <font face="方正黑体_GBK">表四</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:方正黑体_GBK;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-hansi-font-family:宋体;font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">医用仪器设备配置相关部门意见</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:'Times New Roman';font-weight:bold;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <table class=MsoNormalTable border=0 cellspacing=0 style="border-collapse:collapse;width:455.4000pt;mso-table-layout-alt:fixed;border:none;mso-padding-alt:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;">
            <tr style="height:33.0000pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <b>
                            <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">基本情况</span>
                        </b>
                        <b>
                            <span style="font-family:'Times New Roman';mso-fareast-font-family:楷体_GB2312;font-weight:bold;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                                <o:p></o:p>
                            </span>
                        </b>
                    </p>
                </td>
            </tr>
            <tr style="height:25.4500pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">设备名称</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=576 valign=center colspan=3 style="width:346.0000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:宋体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <font face="宋体">${data.assetName}</font>
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:22.3500pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">申请科室</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">${
                            data.sectionName
                        }</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">配置数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">  ${
                            data.assetNum
                        }
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:18.5500pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">国产
                            <font face="Times New Roman">/</font>
                            <font face="仿宋_GB2312">进口</font>
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">                                                           ${
                            data.importation === 1
                                ? "国产"
                                : data.importation === 2 ? "进口" : ""
                        }</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">预算金额</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="mso-spacerun:'yes';font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">                                                               ${
                            typeof data.totalPrice === "number"
                                ? data.totalPrice / 10000 + "万"
                                : ""
                        }
                            
                        </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:22.5000pt;">
                <td width=182 valign=center style="width:109.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">单位现有数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">无</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=182 valign=center style="width:109.4500pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">科室现有数量</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
                <td width=211 valign=center style="width:127.1000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal align=center style="mso-layout-grid-align:none;text-autospace:none;text-align:center;">
                        <span style="font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">无</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:87.7500pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">医教管理部门意见：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:225.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">签字： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:87.7500pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">设备管理部门意见：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>

                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:225.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">签字： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期： &nbsp;</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:87.7500pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">财务部门管理意见：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>

                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:225.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">签字： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期： </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:87.7500pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">分管领导审核意见：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>

                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="text-indent:225.0000pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">签字： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期： </span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
            <tr style="height:87.7500pt;">
                <td width=759 valign=center colspan=4 style="width:455.4000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.7500pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.7500pt solid windowtext;border-top:none;mso-border-top-alt:0.7500pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.7500pt solid windowtext;">
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">主要领导审批意见：</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p>&nbsp;</o:p>
                        </span>
                    </p>
                    <p class=MsoNormal style="margin-left:275.2500pt;text-indent:-50.2500pt;mso-layout-grid-align:none;text-autospace:none;line-height:20.0000pt;mso-line-height-rule:exactly;">
                        <span style="mso-spacerun:'yes';font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">签字： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期： &nbsp;&nbsp;&nbsp;</span>
                        <span style="font-family:'Times New Roman';mso-fareast-font-family:仿宋_GB2312;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                            <o:p></o:p>
                        </span>
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>`
                )
                .wordExport(fileName);
        }
    }
};
</script>
<style>
p.MsoNormal,
li.MsoNormal,
div.MsoNormal {
    margin: 0cm;
    margin-bottom: 0.0001pt;
    text-align: justify;
    text-justify: inter-ideograph;
    font-size: 10.5pt;
    font-family: "Times New Roman", serif;
}
</style>

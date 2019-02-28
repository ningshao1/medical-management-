<template>
    <div class="print"></div>
</template>
<script>
import "../../../add-annual/detail-annual/print-details/FileSaver";
import "../../../add-annual/detail-annual/print-details/jquery.wordexport";
export default {
  props: {
    printData: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    print(data, fileName = "年度计划") {
      let {
        sectionResume,
        buyWhy,
        projectNecessity,
        configDemand,
        benefitAnalysis,
        configPeople,
        siteSetout,
        projectSetout,
        economicAnalysis
      } = "";
      let anMore = data.annualPlanMore;
      if (data.annualPlanMore !== null) {
        if (typeof anMore.sectionResume === "string") {
          sectionResume = data.annualPlanMore.sectionResume
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }

        if (typeof anMore.projectNecessity === "string") {
          projectNecessity = data.annualPlanMore.projectNecessity
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }
        if (typeof anMore.configDemand === "string") {
          configDemand = data.annualPlanMore.configDemand
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }
        if (typeof anMore.economicAnalysis === "string") {
          economicAnalysis = data.annualPlanMore.economicAnalysis
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }
        if (typeof anMore.configPeople === "string") {
          configPeople = data.annualPlanMore.configPeople
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }
        if (typeof anMore.siteSetout === "string") {
          siteSetout = data.annualPlanMore.siteSetout
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }
        if (typeof anMore.projectSetout === "string") {
          projectSetout = data.annualPlanMore.projectSetout
            .split("\n")
            .map(
              v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
            )
            .join("");
        }
      }
      if (typeof data.buyWhy === "string") {
        buyWhy = data.buyWhy
          .split("\n")
          .map(
            v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
          )
          .join("");
      }
      if (typeof data.benefitAnalysis === "string") {
        benefitAnalysis = data.benefitAnalysis
          .split("\n")
          .map(
            v => `<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${v}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`
          )
          .join("");
      }

      $(".print")
        .html(
          ` <body style="tab-interval:21pt;text-justify-trim:punctuation;">
    <!--StartFragment-->
    <div class="Section0" style="layout-grid:15.6000pt;">
        <p class=MsoNormal align=center style="margin-right:-20.3000pt;text-align:center;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="margin-right:-20.3000pt;text-align:center;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="margin-right:-20.3000pt;text-align:center;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <font face="黑体">关于引进</font>
            </span>
            <u>
                <span style="mso-spacerun:'yes';font-family:黑体;text-decoration:underline;text-underline:single;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="黑体">　</font>
                </span>
            </u>
            <u>
                <span style="mso-spacerun:'yes';font-family:黑体;text-decoration:underline;text-underline:single;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="黑体">${data.assetName}</font>
                </span>
            </u>
            <u>
                <span style="mso-spacerun:'yes';font-family:黑体;text-decoration:underline;text-underline:single;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="黑体">　</font>
                </span>
            </u>
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <font face="黑体">设备</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="margin-right:-20.3000pt;text-align:center;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <font face="黑体">提高学科建设水平的可行性论证报告</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
      
        <p class=MsoNormal style="margin-right:-20.3000pt;line-height:20.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:方正黑体简体;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal style="margin-right:-20.3000pt;line-height:20.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:方正黑体简体;font-size:12.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal style="text-indent:126.0000pt;mso-char-indent-count:7.0000;">
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <font face="楷体_GB2312">科室名称：${data.sectionName}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="text-indent:126.0000pt;mso-char-indent-count:7.0000;">
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <font face="楷体_GB2312">负</font>
                <font face="楷体_GB2312">责</font>
                <font face="楷体_GB2312">人：${data.applicantName}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="text-indent:126.0000pt;mso-char-indent-count:7.0000;">
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <font face="楷体_GB2312">联系电话：</font>${
                  data.sectionPhone
                }</span>
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="text-indent:126.0000pt;mso-char-indent-count:7.0000;">
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <font face="楷体_GB2312">日　　期：</font>${
                  data.applyTime.split(" ")[0]
                }</span>
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;font-size:18.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="margin-right:-20.3000pt;line-height:20.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal style="margin-right:-20.3000pt;line-height:20.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal style="margin-right:-20.3000pt;line-height:20.0000pt;mso-line-height-rule:exactly;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p>&nbsp;</o:p>
            </span>
        </p>
        <p class=MsoNormal align=center style="margin-right:3.5500pt;text-align:center;">
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <font face="黑体">${this.$store.state.user_in.hosName}</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:黑体;font-size:22.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="text-indent:21.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:'Times New Roman';line-height:150%;font-size:10.5000pt;mso-font-kerning:1.0000pt;">
                <br clear=all style='page-break-before:always'>
            </span>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">一、科室概况</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">${sectionResume?sectionResume:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}</span>
            <span
                style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">二、申请理由</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${buyWhy?buyWhy:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">三、项目必要性</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${projectNecessity?projectNecessity:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">四、设备配置要求</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${configDemand?configDemand:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">五、经济效益分析</font>
                </span>
            </b>
            <span style="mso-spacerun:'yes';font-family:楷体_GB2312;mso-hansi-font-family:宋体;mso-bidi-font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:0.0000pt;">
                <o:p></o:p>
            </span>
        </p>
        ${economicAnalysis?economicAnalysis:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">六、社会效益分析</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${benefitAnalysis?benefitAnalysis:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">七、资金预算及来源</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">拟引进设备资金总预算</font>${data.totalPrice /
                  10000}万元，资金来源情况：${
            data.capitalSource === 1
              ? "医院自筹"
              : data.capitalSource === 2
                ? "财政拨款"
                : data.capitalSource === 3
                  ? "科研经费支出"
                  : data.capitalSource === 4 ? "重点病种专项基金" : ""
          }</span>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">八、人员配备情况</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${configPeople?configPeople:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">九、场地准备情况</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${siteSetout?siteSetout:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <p class=MsoNormal style="text-indent:28.1000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <font face="宋体">十、项目建设周期</font>
                </span>
            </b>
            <b>
                <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-weight:bold;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                    <o:p></o:p>
                </span>
            </b>
        </p>
        ${projectSetout?projectSetout:`<p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">无</font>
            </span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p>`}
        <!-- <p class=MsoNormal style="text-indent:28.0000pt;mso-char-indent-count:2.0000;line-height:150%;">
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <font face="宋体">申报日期自</font>2017年07月，拟投入使用日期为2018年01月。</span>
            <span style="mso-spacerun:'yes';font-family:宋体;line-height:150%;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
                <o:p></o:p>
            </span>
        </p> -->
    </div>
</body>`
        )
        .wordExport(fileName);
    }
  }
};
</script>
<style lang="less" scoped>
</style>


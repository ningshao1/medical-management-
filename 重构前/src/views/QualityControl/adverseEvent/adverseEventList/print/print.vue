<template>
    <div class="print-chrome">
        <Button style="height: 35px;" class='goBack kld-btn ivu-btn' @click="$router.go(-1)">返回</Button>
        <div class="print-wrap">
            <h1 class="print-title">可疑医疗器械不良事件报告表</h1>
            <div class="print-head">
                <p>报告日期：
                    <span>{{detail["aeReportDate"]}}</span>
                </p>
                <p>编码：{{detail.aeCode}}</p>
            </div>
            <div class="print-head">
                <p style="width: 100%;">
                    报告来源：
                    <span :class="detail.aeReportSource==1?'print-checkbox-true':'print-checkbox'">生产企业</span>
                    <span :class="detail.aeReportSource==2?'print-checkbox-true':'print-checkbox'">经营企业</span>
                    <span :class="detail.aeReportSource==3?'print-checkbox-true':'print-checkbox'">使用单位</span>
                </p>
                <p class='textEllipsis'>单位名称：
                    <span class="fill" :title="detail.unitName">{{detail.unitName}}</span>
                </p>
            </div>
            <div class="print-head">
                <p style="width: 33%;" class="textEllipsis">联系地址：
                    <span class="fill" :title='detail.unitAddress'>{{detail.unitAddress}}</span>
                </p>
                <p style="width: 33%;" class="textEllipsis">邮编：
                    <span class="fill" :title='detail.unitZipCode'>{{detail.unitZipCode}}</span>
                </p>
                <p style="width: 33%;" class="textEllipsis">联系电话：
                    <span class="fill" :title="detail.unitPhone">{{detail.unitPhone}}</span>
                </p>
            </div>
            <div class="table-wrap">
                <table class="table-l table-stripe">
                    <tr>
                        <th colspan="3">A.患者资料</th>
                    </tr>
                    <tr>
                        <td>
                            <span>1.姓名：</span>
                            <span class="fill textEllipsis fill-align">{{detail.patientName}}</span>
                        </td>
                        <td>2.年龄：
                            <span class="fill  textEllipsis fill-align">{{detail.patientAge}}</span>
                        </td>
                        <td>出生日期：
                            <span class="fill"> {{detail.patientBirthday}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>3.性别：{{detail.patientSex==1?'男':detail.patientSex==2?'女':''}}</td>
                        <td colspan="2">患者联系电话：
                            <span style="max-width:100px" class="fill  textEllipsis fill-align" :title="detail.patientPhone">{{detail.patientPhone}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">4.预期治疗疾病或作用：{{detail.desiredResult}}</td>
                    </tr>
                    <tr>
                        <th colspan="3">B.不良事件情况</th>
                    </tr>
                    <tr>
                        <td class="print-required" rowspan="2">5.时间主要表现</td>
                        <td colspan="2">器械故障：
                            <span class="fill textEllipsis fill-align" :title="detail.aeMechanicalFailure">{{detail.aeMechanicalFailure}}</span>
                        </td>
                    </tr>
                    <tr>

                        <td colspan="2">主要伤害：
                            <span class="fill textEllipsis fill-align" :title="detail.aePrimaryLesion">{{detail.aePrimaryLesion}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">6.事件发生日期：{{detail.aeOccurrenceDate}}</td>
                    </tr>
                    <tr>
                        <td colspan="3">7.发现或知悉事件：{{detail.aeDiscoveryDate}}</td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <p style="margin-bottom: 4px">8.医疗器械实际使用场所：</p>
                            <span :class="detail.aeUsePlace==1?'print-checkbox-true':'print-checkbox'" style="margin-left: 16px;">医疗机构</span>
                            <span :class="detail.aeUsePlace==2?'print-checkbox-true':'print-checkbox'">家庭</span>
                            <span :class="detail.aeUsePlace==3?'print-checkbox-true':'print-checkbox'">其它（请注明）：{{detail.userPlaceMemo}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="event-result" colspan="3">
                            <p class="print-required">9.事件后果：</p>
                            <p :class="detail.aeConseQuence==1?'print-checkbox-true':'print-checkbox'">死亡时间：{{detail.deathDate}}</p>
                            <br>
                            <p :class="detail.aeConseQuence==2?'print-checkbox-true':'print-checkbox'">危机生命</p>
                            <br>
                            <p :class="detail.aeConseQuence==3?'print-checkbox-true':'print-checkbox'">机体功能结构永久性损伤</p>
                            <br>
                            <p :class="detail.aeConseQuence==4?'print-checkbox-true':'print-checkbox'">可能导致机体功能永久性损伤</p>
                            <br>
                            <p :class="detail.aeConseQuence==5?'print-checkbox-true':'print-checkbox'">需要内、外科治疗避免上述永久损伤</p>
                            <br>
                            <p :class="detail.aeConseQuence==6?'print-checkbox-true':'print-checkbox'">其他（在时间陈述中说明）</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="line-height: 1.4;">
                            <p class="print-required">10.事件陈述：（至少包括器械使用时间、使用目的、使 用依据、使用情况、出现的不良事件情况、对受害者影响、采取的治疗措施、器械联合使用情况）</p>
                            <p style="height: 388px" class="scroll">{{detail.aeState}}</p>
                        </td>
                    </tr>
                </table>
                <table class="table-r table-stripe">
                    <tr>
                        <th>C.医疗器械情况</th>
                    </tr>
                    <tr>

                        <td class="print-required">11.产品名称：
                            <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.productName">{{detail.productName}}</span>
                        </td>
                    </tr>
                    <tr>

                        <td>12.商品名称：
                            <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.commodityName">{{detail.commodityName}}</span>
                        </td>
                    </tr>
                    <tr>

                        <td class="print-required">13.注册证号：
                            <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.registrationNumber">{{detail.registrationNumber}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="line-height: 1.4;">

                            <p class="print-required">14.生产企业名称：
                                <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.enterpriseName">{{detail.enterpriseName}}</span>
                            </p>

                            <p style="padding-left: 32px;">生产企业地址：
                                <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.enterpriseAddress">{{detail.enterpriseAddress}}</span>
                            </p>

                            <p style="padding-left: 32px;">企业联系电话：
                                <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.enterprisePhone">{{detail.enterprisePhone}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="line-height: 1.4;">

                            <p>15.型号规格：
                                <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.productSpecification">{{detail.productSpecification}}</span>
                            </p>

                            <p style="padding-left: 24px;">产品编号：
                                <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.productCode">{{detail.productCode}}</span>
                            </p>

                            <p style="padding-left: 24px;">产品批号：
                                <span style="max-width:300px" class="fill textEllipsis fill-align" :title="detail.productBatchCode">{{detail.productBatchCode}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="line-height: 1.4;">
                            16.操作人：
                            <p :class="detail.operator==1?'print-checkbox-true':'print-checkbox'">专业人员</p>
                            <p :class="detail.operator==2?'print-checkbox-true':'print-checkbox'">非专业人员</p>
                            <p :class="detail.operator==3?'print-checkbox-true':'print-checkbox'">患者</p>
                            <p :class="detail.operator==4?'print-checkbox-true':'print-checkbox'">其他（请注明）：{{detail.operatorMome}}</p>
                        </td>
                    </tr>
                    <tr style="line-height: 1.4;">
                        <td>
                            <p>17.有效期至：{{detail.effectiveDate}}</p>
                            <p>18.生产日期：{{detail.porductDate}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>19.停用日期：{{detail.stopUseDate}}</td>
                    </tr>
                    <tr>
                        <td>20.植入日期（若植入）：{{detail.implantationDate}}</td>
                    </tr>
                    <tr>
                        <td>
                            <p>21.事件发生初步原因分析：</p>
                            <p style="height: 40px;" class="scroll">{{detail.aeAnalysis}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="print-required">22.事件初步处理情况：</p>
                            <p style="height: 40px;" class="scroll">{{detail.aeHandle}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="line-height: 1.4;">
                            <p>23.事件报告状态：</p>
                            <div>
                                <p :class="detail.aeReportStatus==1?'print-checkbox-true':'print-checkbox'">已通知使用单位</p>
                                <p :class="detail.aeReportStatus==2?'print-checkbox-true':'print-checkbox'">已通知生产企业</p>
                            </div>
                            <div>
                                <p :class="detail.aeReportStatus==3?'print-checkbox-true':'print-checkbox'">已通知经营企业</p>
                                <p :class="detail.aeReportStatus==4?'print-checkbox-true':'print-checkbox'">已通知药监部门</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>D.关联性评价</th>
                    </tr>
                    <tr>
                        <td style="line-height: 1.6;">
                            <p class="print-required">
                                24.使用医疗器械与已发生/可能发生的伤害事件之间是否具有合理的先后时间顺序？
                                <span :class="detail.timeSequence==1?'print-checkbox-true':'print-checkbox'">是</span>
                                <span :class="detail.timeSequence==2?'print-checkbox-true':'print-checkbox'">否</span>
                            </p>
                            <p class="print-required">
                                25.发生/可能发生的伤害事件是否属于所使用医疗器械可能导致的伤害类型？
                                <span :class="detail.lesionType==1?'print-checkbox-true':'print-checkbox'">是</span>
                                <span :class="detail.lesionType==2?'print-checkbox-true':'print-checkbox'">否</span>
                                <span :class="detail.lesionType==3?'print-checkbox-true':'print-checkbox'">无法确定</span>
                            </p>
                            <p class="print-required">
                                26.已发生/可能发生的伤害事件是否可以用合并用药和/或械的作用、患者病情或其他非医疗器械因素来解释？
                                <span :class="detail.deviceFactors==1?'print-checkbox-true':'print-checkbox'">是</span>
                                <span :class="detail.deviceFactors==2?'print-checkbox-true':'print-checkbox'">否</span>
                                <span :class="detail.deviceFactors==3?'print-checkbox-true':'print-checkbox'">无法确定</span>
                            </p>
                            <div>
                                <p>关联性评价结果</p>
                                <span :class="detail.evaluationResult==1?'print-checkbox-true':'print-checkbox'">很有可能</span>
                                <span :class="detail.evaluationResult==2?'print-checkbox-true':'print-checkbox'">可能有关</span>
                                <span :class="detail.evaluationResult==3?'print-checkbox-true':'print-checkbox'">可能无关</span>
                                <span :class="detail.evaluationResult==4?'print-checkbox-true':'print-checkbox'">不能确定</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <p style="margin-top: 6px;">
                报告人：
                <span :class="detail.reporter==1?'print-checkbox-true':'print-checkbox'">医师</span>
                <span :class="detail.reporter==2?'print-checkbox-true':'print-checkbox'">技师</span>
                <span :class="detail.reporter==3?'print-checkbox-true':'print-checkbox'">护士</span>
                <span :class="detail.reporter==4?'print-checkbox-true':'print-checkbox'">工程师</span>
                <span :class="detail.reporter==5?'print-checkbox-true':'print-checkbox'">其他</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            detail: {}
        };
    },
    created() {
        this.getDetail();
    },
    methods: {
        getDetail() {
            this.$axios
                .get(`/adverseEvent/${this.$route.query.id}`)
                .then(res => {
                    this.detail = res.data;
                });
        }
    }
};
</script>
 <style lang="less" scoped>
@import url("./print.less");
</style>



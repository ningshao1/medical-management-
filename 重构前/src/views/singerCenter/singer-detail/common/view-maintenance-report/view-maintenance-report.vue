<template>
    <i-button class="kld-btn"
              @click="viewReport">
        <template>
            查看维修报告
        </template>
        <Modal v-model="show"
               title="维修报告"
               width="1000px"
               :styles="{top:'20px'}"
               :mask-closable='true'
               :scrollable='false'
               class-name="view-maintenance-report-modal">
            <div class="view-maintenance-report-form-wrap">
                <kld-loading v-if="!loaded&&!reportInfo"></kld-loading>
                <i-form v-else
                        ref="view-form"
                        class="view-maintenance-report-form">
                    <div class='maintenance-report-item'>
                        <kld-type title="维修基础信息"></kld-type>
                        <form-item label="故障类型">
                            <i-input type="textarea"
                                     :autosize='autosize'
                                     disabled
                                     :value="reportInfo.fault||reportInfo.faultVote"></i-input>

                        </form-item>
                        <form-item label="故障现象">
                            <i-input type="textarea"
                                     :autosize='autosize'
                                     disabled
                                     :value="reportInfo.physicalFault||reportInfo.physicalFaultVote"></i-input>

                        </form-item>
                        <form-item label="处理方案">
                            <i-input type="textarea"
                                     :autosize='autosize'
                                     disabled
                                     :value="reportInfo.processScheme||reportInfo.processSchemeVote"></i-input>

                        </form-item>
                        <form-item label="零配件信息">
                            <div style="display:table;width:100%;">
                                <simple-table :columns="columns"
                                              :data='reportInfo.parts'
                                              class="parts-table">
                                    <div class='custom-row'
                                         slot="index"
                                         slot-scope="{index,row,column}">
                                        {{(index+1+"").padStart(2,"0")}}
                                    </div>
                                    <div class='custom-row'
                                         slot="partsMoney"
                                         slot-scope="{index,row,column}">
                                        {{numFormat(row[column.key])}}
                                    </div>
                                </simple-table>

                            </div>
                        </form-item>

                    </div>
                    <div class='maintenance-report-item'>
                        <kld-type title="发票登记"></kld-type>
                        <form-item label="发票照片">
                            <div style="display: inline-block;width:100%;">

                                <image-view :imgUrlList='reportInfo.photos||[]'></image-view>
                            </div>
                        </form-item>

                    </div>
                    <div class='maintenance-report-item'>
                        <kld-type title="备注信息"></kld-type>
                        <p style="margin:20px 0 10px;">维修总价
                            <span style="color:#a9a8a9;">（为保证设备折旧价值的计算，请填写本次维修总价，不做公开展示）</span>
                        </p>
                        <FormItem>
                            <i-input disabled
                                     :value="numFormat(reportInfo.maintenancePrice,false)">
                                <span slot="prepend">
                                    <Icon type="social-yen"></Icon>
                                </span>
                            </i-input>
                        </FormItem>
                        <FormItem label="备注信息">
                            <i-input type="textarea"
                                     :autosize='autosize'
                                     disabled
                                     :value="reportInfo.memo"></i-input>
                        </FormItem>

                    </div>

                </i-form>
            </div>

        </Modal>
    </i-button>
</template>
<script>
import kldType from "@common/kld-type";
import imageView from "@common/imageView/ImageView";
import simpleTable from "@common/simple-table";
import kldLoading from "@common/loading/loading.vue";
export default {
    name: "view-maintenance-report",
    components: {
        kldType,
        simpleTable,
        imageView,
        kldLoading
    },
    data() {
        return {
            show: false,
            reportInfo: null,
            loaded: false,
            autosize: { minRows: 3 },
            columns: [
                {
                    key: "index",
                    label: "序号",
                    width: "50px"
                },
                {
                    key: "partsName",
                    label: "配件名称"
                },
                {
                    key: "supplierName",
                    label: "供应商"
                },
                {
                    key: "partsMoney",
                    label: "单价（元）"
                },
                {
                    key: "partsNum",
                    label: "数量",
                    width: "50px"
                }
            ]
        };
    },
    computed: {
        singerId() {
            return this.$route.query.id;
        }
    },
    methods: {
        viewReport() {
            if (!this.reportInfo) {
                this.loadReport();
            }
            this.show = true;
        },
        async loadReport() {
            const { data } = await this.$axios.get(
                `/maintenanceReports/${this.singerId}`
            );
            this.reportInfo = data;
        },
        isDefined(obj) {
            return obj !== null && obj !== undefined && obj !== "";
        },
        numFormat(num, icon = true) {
            let flag = this.isDefined(num);
            return flag
                ? `${icon ? "￥" : ""}${(+num)
                      .toLocaleString("zh", {
                          style: "currency",
                          currency: "CNY"
                      })
                      .replace(/￥/g, "")}`
                : "";
        }
    }
};
</script>

<style lang="less" scoped>
/deep/.view-maintenance-report-modal {
    .view-maintenance-report-form-wrap {
        min-height: 500px;
        position: relative;
        .view-maintenance-report-form {
            .ivu-form-item {
                margin-bottom: 20px !important;
            }
            .parts-table {
                padding: 5px;
                .custom-row {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
}
</style>


<template>
    <div class="step3-wrap">
        <Form :model="formData" :rules="formRules" ref="form" label-position="top">
            <type :title="'医疗器械情况'"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="产品名称：" prop="productId">
                        <i-input @click.native="deviceModalShow = true" readonly :value="deviceName" icon="arrow-down-b" placeholder="请选择对应资产" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="商品名称：">
                        <i-input v-model="formData.commodityName" placeholder="请填写商品名称" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="注册证号：" prop="registrationNumber">
                        <i-input v-model="formData.registrationNumber" placeholder="请填写注册证号" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="生产企业名称：" prop="enterpriseName">
                        <i-input v-model="formData.enterpriseName" placeholder="请选择生产企业名称" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="生产企业地址：" prop="enterpriseAddress">
                        <i-input v-model="formData.enterpriseAddress" placeholder="生产企业地址" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="企业联系电话：" prop="enterprisePhone">
                        <i-input v-model="formData.enterprisePhone" placeholder="企业联系电话" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="规格型号：">
                        <i-input disabled :value="deviceClass" placeholder="请填写规格型号" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="产品编号：">
                        <i-input disabled :value="deviceCode" placeholder="请填写产品编号" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="产品批号：">
                        <i-input v-model="formData.productBatchCode" placeholder="请填写产品批号" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="操作人：">
                        <Select v-model="formData.operator" placeholder="请选择操作人" class="kld-select">
                            <Option :value="1">专业人员</Option>
                            <Option :value="2">非专业人员</Option>
                            <Option :value="3">患者</Option>
                            <Option :value="4">其他</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="其他操作人：">
                        <i-input v-model="formData.operatorMome" :disabled="formData.operator !== 4" placeholder="其他操作人" class="kld-input"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="有效期至：">
                        <DatePicker :editable="false" :value="formData.effectiveDate" @on-change="formData.effectiveDate = $event" placeholder="请选择有效期" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="生产日期：">
                        <DatePicker :editable="false" :value="formData.porductDate" @on-change="formData.porductDate = $event" placeholder="请选择生产日期" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="停用日期：">
                        <DatePicker :editable="false" :value="formData.stopUseDate" @on-change="formData.stopUseDate = $event" placeholder="请选择停用日期" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="植入日期（若植入）：">
                        <DatePicker :editable="false" :value="formData.implantationDate" @on-change="formData.implantationDate = $event" placeholder="请选择植入日期" class="kld-date-picker"></DatePicker>
                    </FormItem>
                </i-col>
            </Row>
            <div class="row attachment">
                <FormItem label="事件发生初步原因分析 ：">
                    <Input v-model="formData.aeAnalysis" type="textarea" placeholder="请填写事件发生初步原因分析（此处输入信息将以附件的形式打印）" :rows="6" :autosize="false" :maxlength="2000" />
                </FormItem>
                <span class="text-count">{{formData.aeAnalysis ? formData.aeAnalysis.length : 0}}/2000</span>
            </div>
            <div class="row attachment">
                <FormItem label="事件初步处理情况 ：" prop="aeHandle">
                    <Input v-model="formData.aeHandle" type="textarea" placeholder="请填写事件初步处理情况（此处输入信息将以附件的形式打印）" :rows="6" :autosize="false" :maxlength="2000" />
                </FormItem>
                <span class="text-count">{{formData.aeHandle ? formData.aeHandle.length : 0}}/2000</span>
            </div>
            <FormItem label="事件报告状态：" prop="aeReportStatus">
                <RadioGroup v-model="formData.aeReportStatus" size="large">
                    <Radio :label="1">已通知使用单位</Radio>
                    <Radio :label="2">已通知生产企业</Radio>
                    <Radio :label="3">已通知经营企业</Radio>
                    <Radio :label="4">已通知药监部门</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <Modal v-model="deviceModalShow" title="选择产品" :width="1115">
            <div class="device-modal">
                <div class="device-modal-tree">
                    <Tree @on-selected="sectionTreeClick" ref="section-tree" :data="sectionTree" @on-select-change="treeSelectChange"></Tree>
                </div>
                <div class="device-modal-list">
                    <i-input v-model="deviceSearchData.keyword" class="kld-input" placeholder="请输入关键字" icon="ios-search-strong"></i-input>
                    <Table @on-row-click="deviceRowClick" class="device-table i-table-stripe" :columns="deviceColumns" :data="deviceList"></Table>
                    <div class="device-page">
                        <kld-page :total="pageData.total" :current.sync="pageData.current" :page-size="pageData.pageSize" @on-change="getDeviceList"></kld-page>
                    </div>
                </div>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>


<script>
import type from "./type";
import kldPage from "@common/page/page.vue";
import transformTreeData from "@common/transformSectionTreeData";
export default {
    data() {
        const validatorPhone = (rule, value, callback) => {
            if (!/^[0-9]*$/.test(value)) {
                callback(new Error("请输入正确的联系电话"));
            }
            callback();
        };
        return {
            formRules: {
                productId: { required: true, message: "产品名称为必选" },
                registrationNumber: {
                    required: true,
                    message: "注册证号为必填"
                },
                enterpriseName: {
                    required: true,
                    message: "生产企业名称为必填"
                },
                enterpriseAddress: {
                    required: true,
                    message: "生产企业地址为必填"
                },
                aeHandle: { required: true, message: "事件初步处理情况为必填" },
                aeReportStatus: {
                    required: true,
                    message: "事件报告状态为必选"
                },
                enterprisePhone: {
                    validator: validatorPhone
                }
            },
            deviceModalShow: false,
            deviceList: [],
            deviceColumns: [
                { title: "设备编码", key: "assetCode" },
                { title: "设备名称", key: "assetName" },
                { title: "设备型号", key: "assetClass" },
                { title: "设备品牌", key: "brandName" }
            ],
            pageData: {
                total: 0,
                pageSize: 10,
                current: 1
            },
            sectionTree: [],
            deviceSearchData: {
                departmentId: "",
                keyword: ""
            },

            deviceName: sessionStorage.getItem('__reportAdverseEvent__deviceName__') || '',
            deviceClass: sessionStorage.getItem('__reportAdverseEvent__deviceClass__') || '',
            deviceCode: sessionStorage.getItem('__reportAdverseEvent__deviceCode__') || ''
        };
    },
    props: {
        value: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    computed: {
        formData: {
            get() {
                return this.value;
            },
            set(data) {
                this.$emit("input", data);
            }
        },
        user_in() {
            return this.$store.state.user_in;
        }
    },
    watch: {
        deviceSearchData: {
            deep: true,
            handler() {
                this.pageData.current = 1;
                this.getDeviceList();
            }
        }
    },
    created() {
        this.getDeviceList();
        this.getSectionTree();
    },
    methods: {
        validate(callback) {
            if (typeof callback === "function") {
                this.$refs.form.validate(callback);
            } else {
                this.$refs.form.validate();
            }
        },

        getDeviceList() {
            const data = {
                limit: this.pageData.pageSize,
                offset: (this.pageData.current - 1) * 10,
                params: this.deviceSearchData
            };
            return this.$axios
                .post(`assets/${this.user_in.osId}/list`, data)
                .then(({ data: { data, recordsTotal } }) => {
                    this.deviceList = data;
                    this.pageData.total = recordsTotal;
                });
        },

        getSectionTree() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionTree = transformTreeData(data);
                });
        },

        treeSelectChange([node]) {
            if (node) {
                this.deviceSearchData.departmentId = node.id;
            } else {
                this.deviceSearchData.departmentId = "";
            }
        },
        deviceRowClick(row) {
            this.formData.productId = row.id;
            this.formData.sectionId = row.departmentId;
            this.deviceName = row.assetName;
            this.deviceClass = row.assetClass;
            this.deviceCode = row.assetCode;
            this.deviceModalShow = false;

            sessionStorage.setItem('__reportAdverseEvent__deviceName__', row.assetName);
            sessionStorage.setItem('__reportAdverseEvent__deviceClass__', row.assetClass);
            sessionStorage.setItem('__reportAdverseEvent__deviceCode__', row.assetCode);
        },

        sectionTreeClick(nodeKey) {
            const node = this.$refs['section-tree'].flatState[nodeKey].node;

            if (node.children && node.children.length > 0) {
                this.$set(node, 'expand', ! node.expand);
            }
        },
    },
    components: {
        type,
        kldPage
    }
};
</script>

<style lang="less" scoped>
@import "~@inspection-common/varible";
.device-modal {
    display: flex;

    .device-modal-tree {
        border-radius: 4px;
        border: 1px solid @border-color;
        padding: 10px;
        margin-right: 20px;
        width: 300px;
        max-height: 638px;
        overflow: auto;
        background-color: #fff;
    }
    .device-modal-list {
        width: 740px;
        background-color: #fff;
        .kld-input {
            margin-bottom: 10px;
        }
        .device-table {
            border: 1px solid #e9eaec;
            border-bottom: 0;
            border-right: 0;
            /deep/.ivu-table-header th {
                background-color: #fff;
            }
        }
        .device-page {
            padding: 16px 0;
            text-align: center;
        }
    }
}

.step3-wrap {
    .kld-date-picker {
        width: 100%;
    }
    .ivu-form-item {
        margin-top: 6px;
        margin-bottom: 26px !important;
    }
    .input-half {
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        li {
            width: 49%;
            p {
                font-size: 14px;
                color: #000000;
                margin: 15px 0 10px;
            }
        }
    }

    .attachment {
        margin-top: 20px;
        position: relative;
        p {
            font-size: 14px;
            color: #000000;
            margin: 15px 0 10px;
            span {
                color: #a9a8a9;
            }
        }

        .text-count {
            position: absolute;
            bottom: 6px;
            right: 17px;
            font-size: 14px;
            color: #a9a8a9;
        }
    }
}
</style>

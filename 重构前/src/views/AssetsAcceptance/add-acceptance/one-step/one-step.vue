<template>
    <div class="step1-wrap">
        <Form label-position="top"
              ref="formValidate"
              :model="formValidate"
              :rules="formRule">
            <type title="基础信息"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="设备名称："
                              prop='assertName'>
                        <div class="add-device-name"
                             v-clickoutside.native='function(){assetName.slideShow=false}'>
                            <div class='check-asset'>资产已入库？
                                <modal-asset :osData='department.departmentData'
                                             @clickRow='checkAsset'></modal-asset>
                            </div>
                            <!-- <div v-clickoutside='ListShow=false' style="width:100%"> -->
                            <slide-table placeholder="请填写设备"
                                         v-model="formValidate.assertName"
                                         @on-change='assetNameSearch'
                                         @on-focus='assetNameFocus'
                                         :data='assetName.assetNameList'
                                         :columns='assetName.columns'
                                         :page='assetName.page'
                                         :row-key="'id'"
                                         :slideShow='assetName.slideShow'
                                         @row-in-click="getPreInfo"
                                         @page-change='assetNameChange'
                                         :loading='assetName.loading'
                                         :disabled='checkDisabled'>
                            </slide-table>
                            <!-- </div> -->
                        </div>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="型号："
                              prop="assetClass">
                        <div v-clickoutside.native='function(){assetClass.slideShow=false}'>
                            <slide-table placeholder="请填写设备型号"
                                         v-model="formValidate.assetClass"
                                         @on-change='assetClassSearch'
                                         @on-focus='assetClassFocus'
                                         :data='assetClass.assetClassList'
                                         :columns='assetName.columns'
                                         :page='assetClass.page'
                                         :row-key="'id'"
                                         :slideShow='assetClass.slideShow'
                                         @row-in-click="getPreInfo"
                                         @page-change='assetClassChange'
                                         :loading='assetClass.loading'
                                         :disabled='checkDisabled'>
                            </slide-table>
                        </div>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:98px;">
                    <FormItem label="序列号："
                              prop="assetSN">
                        <div class="assetSNClass">
                            <Input class="kld-input"
                                   type="text"
                                   placeholder="请填写序列号"
                                   v-model="formValidate.assetSN"
                                   :disabled='assetSN.SNdisabled||checkDisabled' />
                            <Button class="kld-btn"
                                    @click="ClickgetSN"
                                    :loading='assetSN.SNLoading'
                                    :disabled='checkDisabled'>随机序列号</Button>
                        </div>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="设备注册证号："
                              prop="registration">
                        <Input class="kld-input"
                               type="text"
                               placeholder="请填写设备注册证号"
                               :maxlength="50"
                               v-model="formValidate.registration"
                               :disabled='checkDisabled' />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="品牌："
                              style="z-index:99"
                              prop='assetBrandId'>
                        <div v-clickoutside.native='function(){brand.slideShow=false;formValidate.brandName=brand.name}'>
                            <slide-table placeholder="请选择品牌"
                                         v-model="formValidate.brandName"
                                         @on-change='brandSearch'
                                         @on-focus='brandFocus'
                                         :data='brand.brandList'
                                         :columns='brand.columns'
                                         :page='brand.page'
                                         :row-key="'brandId'"
                                         :slideShow='brand.slideShow'
                                         @row-in-click="brandRowClick"
                                         @page-change='brandChange'
                                         :loading='brand.loading'
                                         :disabled='checkDisabled'>
                            </slide-table>
                        </div>
                    </FormItem>
                </i-col>
                <i-col :span="country.spanLong">

                    <FormItem label="国家分类："
                              prop="assertTypeId">
                        <kld-dropdown-tree placeholder="请选择国家分类"
                                           :data='country.countryData'
                                           :leafOnly='true'
                                           v-model="formValidate.assertTypeId"
                                           @current-change='getcurrentNode'
                                           :disabled='checkDisabled'>
                            <span slot="tree-item"
                                  slot-scope="{ node, data }">
                                <span>{{ isTrue(data.typeCode)?`[${data.typeCode}]`:'' }}</span>
                                <span>{{ node.label }}</span>
                            </span>

                        </kld-dropdown-tree>
                        <!-- <Input v-model="countryName" v-if="addDisabled" disabled class="kld-input"></Input>
                        <kld-tree-select v-else :disabled='addDisabled' :filterable='true' v-model="formValidate.assertTypeId" :leafOnly='true' :data='countryList' placeholder='请选择国家分类' :node-key='"id"' empty-text='暂无国家分类' @node-click="clickAssertTypeTree" titleKey='typeName' :draggable='true'>
                        </kld-tree-select> -->
                    </FormItem>
                </i-col>
                <i-col :span="12-country.spanLong"
                       v-if="country.spanLong===6">
                    <FormItem label="呼吸机分类："
                              prop='breatheType'>
                        <RadioGroup style="heigth:30px;"
                                    v-model="formValidate.breatheType">
                            <Radio :label="2"
                                   :disabled='checkDisabled'>
                                <span>无创呼吸器</span>
                            </Radio>
                            <Radio :label="3"
                                   :disabled='checkDisabled'>
                                <span>有创呼吸器</span>
                            </Radio>
                            <Radio :label="4"
                                   :disabled='checkDisabled'>
                                <span>混合呼吸机</span>
                            </Radio>
                        </RadioGroup>

                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="安装时间："
                              prop="collarTime">
                        <DatePicker :editable="false"
                                    class="kld-date-picker"
                                    type="date"
                                    placeholder="请选择安装时间"
                                    :value='formValidate.collarTime'
                                    @on-change='installTimeChange'
                                    :disabled='checkDisabled'></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="所属科室"
                              prop="departmentId">
                        <kld-dropdown-tree placeholder="请选择所属科室"
                                           :firstExpand='true'
                                           :data='department.departmentData'
                                           v-model="formValidate.departmentId"
                                           :props='{label: "osName",children: "lists"}'
                                           @current-change='getAssetUser'
                                           :disabled='checkDisabled'>
                        </kld-dropdown-tree>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="安装地点："
                              prop='installSection'>
                        <kld-dropdown-tree placeholder="请选择安装地点"
                                           :firstExpand='true'
                                           :data='department.departmentData'
                                           v-model="formValidate.installSection"
                                           :props='{label: "osName",children: "lists"}'
                                           :disabled='checkDisabled'>
                        </kld-dropdown-tree>
                    </FormItem>
                </i-col>

                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="管理人："
                              prop="userId">
                        <Input type="text"
                               v-model="formValidate.userName"
                               placeholder="根据所属科室填充"
                               class="kld-input"
                               :disabled='true'></Input>
                    </FormItem>
                </i-col>

                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="负责人："
                              prop="responsibleId">

                        <Input placeholder="根据所属科室填充"
                               v-model="formValidate.responsibleName"
                               class="kld-input"
                               :disabled='true'></Input>
                    </FormItem>
                </i-col>

            </Row>
            <type title="关联合同"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="关联合同："
                              prop="contractId">
                        <kld-contract v-model="formValidate.contractName"
                                      @click-row='formValidate.contractId=$event'
                                      :disabled='checkDisabled'></kld-contract>
                        <!-- <Input style="cursor:pointer"
                               class="kld-input"
                               placeholder="请选择关联合同"
                               v-model="formValidate.contractId"
                               :disabled='true' /> -->
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="设备原值："
                              prop='purchaseMount'>
                        <Input class="kld-input"
                               type="text"
                               placeholder="请填写设备原值"
                               v-model="formValidate.purchaseMount"
                               :disabled='checkDisabled' />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="过保时间："
                              prop='assetWarrntyDate'>
                        <DatePicker :value='formValidate.assetWarrntyDate'
                                    @on-change='formValidate.assetWarrntyDate=$event'
                                    :editable="false"
                                    class="kld-date-picker"
                                    type="date"
                                    placeholder="请选择过保时间"
                                    :disabled='checkDisabled'></DatePicker>
                    </FormItem>
                </i-col>
            </Row>
            <type title="折旧信息"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="折旧方式："
                              prop='depreciationType'>
                        <Select class="kld-select"
                                placeholder="请选择折旧方式"
                                v-model="formValidate.depreciationType"
                                :disabled='checkDisabled'>
                            <Option :value="1"
                                    :disabled='checkDisabled'>平均年限法</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="折旧年限："
                              prop='depreciationAgeLimit'>
                        <Select class="kld-select"
                                placeholder="请选择年限"
                                v-model="formValidate.depreciationAgeLimit"
                                :disabled='checkDisabled'>
                            <Option :value="5">5年</Option>
                            <Option :value="6">6年</Option>
                            <Option :value="8">8年</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="加速折旧系数："
                              prop='speedDepreciationRate'>
                        <Input class="kld-input"
                               placeholder="请输入加速折旧系数"
                               v-model="formValidate.speedDepreciationRate"
                               :disabled='checkDisabled'>
                        <span slot="append">%</span>
                        </Input>
                    </FormItem>
                </i-col>
            </Row>
            <template v-if="isMeasure">
                <type title="计量信息"></type>
                <Row :gutter="20">
                    <i-col :span="8">
                        <FormItem label="计量类型："
                                  prop='mtType'>
                            <Select v-model="formValidate.mtType"
                                    class="kld-select"
                                    placeholder="请选择计量类型"
                                    :disabled='true'>
                                <Option v-for="item in MEA.MeaType"
                                        :value="item.id"
                                        :key="item.id"
                                        :disabled='item.id===0'>{{ item.TypeName }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col :span="8">
                        <FormItem label="上次计量时间："
                                  prop='lastTime'>
                            <DatePicker :value='formValidate.lastTime'
                                        @on-change='formValidate.lastTime=$event'
                                        :editable="false"
                                        class="kld-date-picker"
                                        type="date"
                                        placeholder="请选择上次计量时间"
                                        :disabled='checkDisabled'></DatePicker>
                        </FormItem>
                    </i-col>
                    <i-col :span="8">
                        <FormItem label="周期："
                                  prop='cycle'>
                            <Input class="kld-input"
                                   placeholder="请输入"
                                   v-model="formValidate.cycle"
                                   :disabled='checkDisabled'>
                            <span slot="append">月</span>
                            </Input>
                        </FormItem>
                    </i-col>
                </Row>
            </template>
            <type title="设备信息"></type>
            <Row :gutter="20">
                <i-col :span="24">
                    <FormItem label="设备图片："
                              prop='photos'>
                        <kld-file-upload v-model="formValidate.photos"
                                         :accept='[ ".png",".jpg","jpeg"]'
                                         :editable='!checkDisabled'
                                         :downloadable='true'> </kld-file-upload>
                    </FormItem>
                </i-col>
                <i-col :span="24">
                    <FormItem label="设备标签："
                              prop='labelIds'>
                        <Select v-model="formValidate.labelIds"
                                filterable
                                transfer
                                multiple
                                @on-change='labelChange'
                                :disabled='checkDisabled'>
                            <Option v-for="item in labelList"
                                    :value="item.id"
                                    :key="item.id">{{ item.labelName }}</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
        </Form>
    </div>
</template>
<script>
import type from "../../../QualityControl/adverseEvent/reportAdverseEvent/type.vue";
import page from "@common/page/page";
import loading from "@common/loading/loading.vue";
import kldTreeSelect from "@common/kld-tree-select";
import onStepMixins from "./common/mixins";
import sildeTable from "./common/slide-table";
import treeSelect from "@common/kld-dropdown-tree";
import CUpload from "@common/kld-file-upload/index";
import modalAsset from "./common/modal-asset";
import contract from "./common/contract";
import { FileConvert } from "@common/method/util";
export default {
    name: "step1",
    mixins: [onStepMixins],
    props: {
        Nasset: {
            type: Object
        },
        loading: {}
    },
    data() {
        return {
            formValidate: {
                hosId: this.$store.state.user_in.osId,
                assertName: "",
                assetClass: "",
                assetSN: "",
                registration: "", //设备注册证号
                assetBrandId: "",
                brandName: "",
                assertTypeId: "", //国家分类ID
                breatheType: 1, //呼吸机类别
                collarTime: "", //安装时间
                departmentId: "", //所属科室
                installSection: "", //安装地点id
                userId: "",
                userName: "",
                responsibleId: "", //责任人ID
                responsibleName: "",
                contractId: "", //合同id
                contractName: "",
                purchaseMount: "0", //原值
                assetWarrntyDate: "", //过保日期
                depreciationType: 1, //折旧类型
                depreciationAgeLimit: 5, //折旧年限
                speedDepreciationRate: "", //加速折旧系数
                mtType: null,
                lastTime: null, //上次计量时间
                cycle: null, //计量周期
                id: undefined,
                labelIds: [],
                photos: []
            },
            formRule: {
                assertName: [
                    {
                        required: true,
                        message: "资产名称为必填项",
                        trigger: ""
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5\w\!@#$%^&?*()_\.-]*$/,
                        message: "请勿使用中文标点符号！",
                        trigger: "blur"
                    },
                    { max: 100, message: "最多100个字符！" }
                ],
                assetSN: [
                    {
                        required: true,
                        message: "序列号为必填项",
                        trigger: ""
                    }
                ],

                assetBrandId: {
                    required: true,
                    message: "品牌为必选项"
                },
                // hospitalId: {
                //     required: true,
                //     message: "院内分类为必选项"
                // },
                assertTypeId: {
                    required: true,
                    message: "国家分类为必选项"
                },
                departmentId: {
                    required: true,
                    message: "安装科室为必选项"
                },
                collarTime: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value !== "" && value !== null) {
                            if (
                                this.formValidate.assetWarrntyDate !== "" &&
                                this.formValidate.assetWarrntyDate !== null
                            ) {
                                if (
                                    new Date(value) <=
                                    new Date(this.formValidate.assetWarrntyDate)
                                ) {
                                    callback();
                                } else {
                                    callback(
                                        new Error("安装时间需要小于过保日期")
                                    );
                                }
                            }
                        } else {
                            callback(new Error("安装时间需为必填项"));
                        }
                    }
                },
                userId: {
                    required: true,
                    message: "使用人为必选项"
                },
                responsibleId: {
                    required: true,
                    message: "责任人为必选项"
                },
                assetWarrntyDate: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value !== "" && value !== null) {
                            if (
                                this.formValidate.collarTime !== "" &&
                                this.formValidate.collarTime !== null
                            ) {
                                if (
                                    new Date(value) >=
                                    new Date(this.formValidate.collarTime)
                                ) {
                                    callback();
                                } else {
                                    callback(
                                        new Error("过保日期需要大于安装时间")
                                    );
                                }
                            } else {
                                callback();
                            }
                        } else {
                            callback(new Error("过保日期为必填项"));
                        }
                    }
                },
                purchaseMount: [
                    {
                        trigger: "",
                        required: true,
                        validator(rule, value, callback) {
                            if (value !== "") {
                                if (/^[0-9]+$/.test(value)) {
                                    callback();
                                } else {
                                    callback(new Error("该项只能输入数字"));
                                }
                            } else {
                                callback(new Error("该项为必填字段"));
                            }
                        }
                    }
                ],
                cycle: [
                    {
                        trigger: "",
                        validator(rule, value, callback) {
                            if (value !== "" && value !== null) {
                                if (/^\+?[1-9]\d*$/.test(value)) {
                                    callback();
                                } else {
                                    callback(
                                        new Error("该项只能输入大于0的整数")
                                    );
                                }
                            } else {
                                callback();
                            }
                        }
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.formValidate.mtType === 0) {
                                if (value === null || value === "") {
                                    callback(new Error("该项为必填项！"));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                speedDepreciationRate: [
                    {
                        trigger: "",
                        validator(rule, value, callback) {
                            if (value !== "") {
                                if (/^[0-9]+$/.test(value)) {
                                    callback();
                                } else {
                                    callback(new Error("该项只能输入数字"));
                                }
                            } else {
                                callback();
                            }
                        }
                    }
                ],

                lastTime: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.formValidate.mtType === 0) {
                                if (value === null || value === "") {
                                    callback(new Error("该项为必填项！"));
                                } else {
                                    callback();
                                }
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            },
            assetName: {
                assetNameList: [],
                loading: false,
                page: {
                    total: 10,
                    current: 1,
                    size: 10
                },
                columns: [
                    {
                        key: "assetName",
                        title: "名称",
                        width: "40%"
                    },
                    {
                        key: "assetClass",
                        title: "型号"
                    },
                    {
                        key: "brandName",
                        title: "品牌",
                        width: "40%"
                    }
                ],
                slideShow: false
            },
            assetClass: {
                assetClassList: [],
                loading: false,
                page: {
                    total: 10,
                    current: 1,
                    size: 10
                },
                slideShow: false
            },
            assetSN: {
                SNLoading: false,
                SNdisabled: false
            },
            brand: {
                name: "", //缓存作用
                brandList: [],
                loading: false,
                page: {
                    total: 10,
                    current: 1,
                    size: 10
                },
                columns: [
                    {
                        key: "brandName",
                        title: "名称",
                        width: "40%"
                    },
                    {
                        key: "manufactor",
                        title: "厂商",
                        width: "30%"
                    },
                    {
                        key: "modeCountry",
                        title: "国别",
                        width: "30%"
                    }
                ],
                slideShow: false
            },
            country: {
                spanLong: 12,
                countryData: []
            },
            department: {
                departmentData: [],
                departmentName: ""
            },
            //计量
            MEA: {
                MeaType: [
                    {
                        TypeName: "强检",
                        id: 0
                    },
                    {
                        TypeName: "非强检",
                        id: 1
                    }
                ]
            },
            labelList: [],
            checkDisabled: false
        };
    },
    components: {
        [type.name]: type,
        [page.name]: page,
        [loading.name]: loading,
        [kldTreeSelect.name]: kldTreeSelect,
        [sildeTable.name]: sildeTable,
        [treeSelect.name]: treeSelect,
        [CUpload.name]: CUpload,
        [modalAsset.name]: modalAsset,
        [contract.name]: contract
    },
    computed: {
        osId() {
            return this.$store.state.user_in.osId;
        },
        isMeasure() {
            return this.formValidate.mtType !== null;
        }
    },
    watch: {
        "formValidate.breatheType"(val) {}
    },
    created() {
        this.getcountry();
        this.getDepartment();
        this.getLabel();
    },
    methods: {
        isTrue(val) {
            return val !== "" && val !== undefined && val !== null;
        },
        //资产名称相关
        assetNameSearch() {
            this.assetName.loading = true;
            this.$axios
                .post(`/assets/getOtherByAssetName`, {
                    limit: this.assetName.page.size,
                    offset:
                        (this.assetName.page.current - 1) *
                        this.assetName.page.size,
                    params: {
                        name: this.formValidate.assertName
                    }
                })
                .then(({ data }) => {
                    this.assetName.assetNameList = data.data;
                    data.data instanceof Array && data.data.length
                        ? (this.assetName.slideShow = true)
                        : (this.assetName.slideShow = false);
                    this.assetName.page.total = data.recordsTotal;
                })
                .finally(() => {
                    this.assetName.loading = false;
                });
        },
        getPreInfo({ id }, index) {
            this.assetName.slideShow = false;
            this.assetClass.slideShow = false;
            this.$axios
                .post(`/assets/getOtherByAssetId?id=${id}`)
                .then(({ data }) => {
                    this.PreInfoFormat(data);
                });
        },
        PreInfoFormat(preData) {
            for (const i in preData) {
                if (i === "assetName") {
                    this.formValidate["assertName"] = preData[i];
                    continue;
                }
                if (this.formValidate[i] !== undefined && i !== "assetSN") {
                    if (i === "brandName") {
                        this.brand.name = preData[i];
                    }
                    this.formValidate[i] = preData[i];
                }
            }
            //呼吸机类型
            if (preData.breathe_type) {
                this.$nextTick(() => {
                    this.formValidate.breatheType = preData.breathe_type;
                });
            }
        },
        assetNameChange(current) {
            this.assetName.page.current = current;
            this.assetNameSearch();
        },
        assetNameFocus() {
            this.assetName.assetNameList.length
                ? (this.assetName.slideShow = true)
                : null;
            this.assetNameSearch();
        },
        checkAsset(rowData) {
            this.$axios
                .get(`assets/getAssetAcceptance/${rowData.id}`)
                .then(({ data }) => {
                    this.$refs["formValidate"].resetFields();
                    this.checkDisabled = true;
                    for (const i in data) {
                        if (this.formValidate[i] !== undefined) {
                            this.formValidate[i] = data[i];
                        }
                        if (i === "assetTypeId") {
                            this.formValidate["assertTypeId"] = data[i];
                        } else if (i === "assetName") {
                            this.formValidate["assertName"] = data[i];
                        } else if (i === "brandName") {
                            this.brand.name = data[i];
                        }
                    }
                    this.formValidate.labelIds = data.labels.map(
                        v => v.labelId
                    );
                    //地址转成文件方法
                    FileConvert(data.photos.map(v => v.photoUrl)).then(data => {
                        this.formValidate.photos = data;
                    });
                    //用于下一步使用的数据
                    this.Nasset["NassetId"] = data.assetId;
                    this.Nasset["sectionName"] = data.osName;
                    this.Nasset["collarTime"] = data.collarTime;
                });
        },
        //型号相关
        assetClassSearch() {
            this.assetClass.loading = true;
            this.$axios
                .post(`/assets/getOtherByAssetName`, {
                    limit: this.assetClass.page.size,
                    offset:
                        (this.assetClass.page.current - 1) *
                        this.assetClass.page.size,
                    params: {
                        name: this.formValidate.assetClass
                    }
                })
                .then(({ data }) => {
                    this.assetClass.assetClassList = data.data;
                    data.data instanceof Array && data.data.length
                        ? (this.assetClass.slideShow = true)
                        : (this.assetClass.slideShow = false);
                    this.assetClass.page.total = data.recordsTotal;
                })
                .finally(() => {
                    this.assetClass.loading = false;
                });
        },
        assetClassFocus() {
            this.assetClass.assetClassList.length
                ? (this.assetClass.slideShow = true)
                : null;
            this.assetClassSearch();
        },
        assetClassChange(current) {
            this.assetClass.page.current = current;
            this.assetClassSearch();
        },
        //随机序列号
        ClickgetSN() {
            this.assetSN.SNLoading = true;
            this.$axios
                .get(`assets/getSN`)
                .then(({ data }) => {
                    this.formValidate.assetSN = data.sn;
                    this.formValidate.id = data.assetId;
                    this.assetSN.SNdisabled = true;
                })
                .finally(res => {
                    this.assetSN.SNLoading = false;
                });
        },
        //品牌相关方法
        brandSearch() {
            this.brand.loading = true;
            this.$axios
                .post(`/assertBrandcopys/${this.osId}/list`, {
                    limit: this.brand.page.size,
                    offset:
                        (this.brand.page.current - 1) * this.brand.page.size,
                    params: {
                        keyword: this.formValidate.brandName
                    }
                })
                .then(({ data }) => {
                    this.brand.brandList = data.data;
                    data.data instanceof Array && data.data.length
                        ? (this.brand.slideShow = true)
                        : (this.brand.slideShow = false);
                    this.brand.page.total = data.recordsTotal;
                })
                .finally(() => {
                    this.brand.loading = false;
                });
        },
        brandFocus() {
            this.brand.brandList.length ? (this.brand.slideShow = true) : null;
            this.brandSearch();
        },
        brandRowClick({ brandName, brandId }) {
            this.formValidate.brandName = this.brand.name = brandName;
            this.formValidate.assetBrandId = brandId;
            this.brand.slideShow = false;
        },
        brandChange(current) {
            this.brand.page.current = current;
            this.brandSearch();
        },
        //国家分类相关
        async getcountry() {
            const data = await this.$store.dispatch("loadCountryType", true);
            this.country.countryData = data;
            // this.$axios
            //     .get(`/assetTypes/typeAllTree`)
            //     .then(({ data }) => {
            //         this.country.countryData = data;
            //     })
            //     .finally(res => {});
        },
        getcurrentNode(node) {
            console.log(this.formValidate.breatheType);
            if (node.state === 2) {
                //是否为呼吸机
                this.country.spanLong = 6;
            } else {
                this.country.spanLong = 12;
                this.formValidate.breatheType = 1;
            }
            this.formValidate.mtType = node.type;
            if (node.type === null) {
                this.formValidate.lastTime = null;
                this.formValidate.cycle = null;
            }
        },
        //安装时间
        installTimeChange(value) {
            this.formValidate.collarTime = value;
            if (this.formValidate.assetWarrntyDate) {
                return;
            }
            const time = value.split("-");
            time[0] = time[0] - 0 + 1;
            this.formValidate.assetWarrntyDate = time.join("-");
        },
        //科室相关
        getDepartment() {
            this.$axios
                .get(`orgstruct/findAllTree/${this.osId}`)
                .then(({ data }) => {
                    this.department.departmentData = [data];
                });
        },
        getAssetUser({ id, osName }) {
            this.department.departmentName = osName;
            //获得管理人和负责人
            return this.$axios
                .get(`/orgstruct/${id}/getOrgstructResponsible`)
                .then(
                    ({
                        data: { responsible, responsibleName, user, userName }
                    }) => {
                        this.formValidate.userId = user;
                        this.formValidate.responsibleId = responsible;
                        this.formValidate.userName = userName;
                        this.formValidate.responsibleName = responsibleName;
                    }
                );
        },
        //标签相关
        getLabel() {
            this.$axios.post(`labels/list/1`).then(({ data }) => {
                this.labelList = data;
            });
        },
        labelChange(labels) {
            if (labels.length > 5) {
                this.formValidate.labelIds = this.formValidate.labelIds.slice(
                    0,
                    5
                );
                this.$Message.warning("最多可选择5个设备标签！");
            }
        },
        next(callback) {
            if (this.checkDisabled) {
                this.saveData(callback);
                return;
            }
            this.addSaveDta(callback);
        },
        saveData(callback) {
            this.$axios
                .post(`/assetacceptance/save?type=2`, {
                    id: this.Nasset["NassetId"]
                })
                .then(res => {
                    callback();
                })
                .finally(() => {
                    // this.intercept = false;
                    this.loading.show = true;
                });
        },
        addSaveDta(callback) {
            Promise.all(
                this.formValidate.photos.map(e => {
                    const formData = new FormData();
                    formData.append("file", e);
                    return this.$axios.post(
                        `/photo/${this.$store.state.user_in.osId}/7/upload`,
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" }
                        }
                    );
                })
            )
                .then(res => {
                    this.$refs["formValidate"].validate(valid => {
                        if (valid) {
                            let temp = res.map(v => v.data);
                            let userName;
                            let responsibleName;

                            if (this.intercept) {
                                this.$Message.warning(
                                    "数据正在提交，请稍后再点击"
                                );
                                return;
                            }
                            this.$axios
                                .post(`/assetacceptance/save?type=1`, {
                                    ...this.formValidate,
                                    photos: temp,
                                    assetName: this.formValidate["assertName"],
                                    hospitalId: undefined,
                                    assertName: undefined,
                                    cycle:
                                        !this.isMeasure ||
                                        this.formValidate.cycle === ""
                                            ? null
                                            : this.formValidate.cycle,
                                    lastTime:
                                        !this.isMeasure ||
                                        this.formValidate.lastTime === ""
                                            ? null
                                            : this.formValidate.lastTime,
                                    mtType:
                                        !this.isMeasure ||
                                        this.formValidate.mtType === ""
                                            ? null
                                            : this.formValidate.mtType
                                })
                                .then(res => {
                                    console.log(res);
                                    this.Nasset["NassetId"] = res.data;
                                    this.Nasset[
                                        "sectionName"
                                    ] = this.department.departmentName;
                                    this.Nasset[
                                        "collarTime"
                                    ] = this.formValidate.collarTime;
                                    this.$Message.success("数据添加成功");
                                    callback();
                                })
                                .finally((data, error) => {
                                    this.intercept = false;
                                    this.loading.show = false;
                                })
                                .catch(data => {
                                    console.log(data);
                                });
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.intercept = false;
                });
        }
    }
};
</script>

<style lang="less" scoped>
.add-device-name {
    display: flex;
    justify-content: space-between;
    position: relative;
    .check-asset {
        position: absolute;
        right: 0;
        color: #666666;
        font-size: 12px;
        top: -30px;
    }
    .ivu-btn {
        margin-left: 15px;
    }
}
.step1-wrap {
    .kld-date-picker {
        width: 100%;
    }
    .ivu-form-item {
        margin-top: 6px;
        margin-bottom: 26px !important;
    }
}
/deep/.step1-wrap {
    .ivu-select-single .ivu-select-input {
        height: 100%;
    }
}

.assetSNClass {
    display: flex;
    .kld-btn {
        margin-left: 10px;
    }
}
</style>
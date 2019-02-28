<template>
    <div class="container-fuild new-add-asset-wrap">
        <Form class="row"
              ref="newAddAsset"
              :model="formValidate"
              :rules="ruleValidate">
            <div class="container base-info">
                <kld-type :title="'基本信息'"></kld-type>
                <Row>
                    <i-col span="12">
                        <FormItem label="设备名称："
                                  prop="assetName"
                                  style="position:relative;">
                            <transition name="slide-up">
                                <float-table v-model="formValidate.assetName"
                                             :data='preAssetName.assetNameList'
                                             :columns='assetNameColumns'
                                             :row-key="'id'"
                                             :keyWordRemote='{
                                                url:`/assets/getOtherByAssetName`,
                                                params:"name"
                                            }'
                                             @row-in-click="getPreInfo"
                                             @remote-ready="preRemoteReady"
                                             placeholder='请输入设备名称'>
                                </float-table>
                            </transition>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem label="型号："
                                  prop="assetClass"
                                  style="position:relative;"
                                  v-clickoutside.native='handleClassInputClickOutside'>
                            <transition name="slide-up">
                                <float-table v-model="formValidate.assetClass"
                                             :data='classAssetName.assetNameList'
                                             :columns='classColumns'
                                             :row-key="'id'"
                                             :keyWordRemote='{
                                                url:`/assets/getAssetClass`,
                                                params:"assetClass"
                                            }'
                                             @row-in-click="getPreInfo"
                                             @remote-ready="classRemoteReady"
                                             placeholder='请填写设备型号'>
                                </float-table>
                            </transition>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem label="序列号："
                                  prop="assetSN">
                            <div style="width:100%;display:inline-block;height:44px;">
                                <i-input class="kld-input"
                                         placeholder="请填写设备序列号"
                                         :disabled="isGetSN"
                                         v-model="formValidate.assetSN"
                                         style="width:calc(100% - 130px);"></i-input>
                                <i-button @click='getSN'
                                          class='kld-btn'
                                          :loading='SNLoading'>随机序列号</i-button>
                            </div>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem label="设备注册证号："
                                  prop="registration">
                            <i-input class="kld-input"
                                     :maxlength='50'
                                     placeholder="请填写设备注册证号"
                                     v-model="formValidate.registration"></i-input>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem label="品牌："
                                  prop="assetBrandId"
                                  style="position:relative;"
                                  v-clickoutside.native="handleClickOutside">
                            <i-input class="kld-input"
                                     @click.native="brandInfo.show=true"
                                     placeholder="请选择品牌"
                                     v-model="brandInfo.name"></i-input>
                            <div class="brand-list-wrap"
                                 v-show="brandInfo.show">
                                <table class="i-table-stripe">
                                    <thead>
                                        <tr>
                                            <th>名称</th>
                                            <th style="width:65%;">厂商</th>
                                            <th style="width:15%;">国别</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(v,i) of brandInfo.list"
                                            :key="i"
                                            @click="getBrandName(v)">
                                            <td>
                                                <div class='textEllipsis'
                                                     style="width:200px"
                                                     :title='v.brandName'>
                                                    {{v.brandName}}
                                                </div>
                                            </td>
                                            <td>{{v.manufactor}}</td>
                                            <td>
                                                <div class='textEllipsis'
                                                     style="width:100px"
                                                     :title='v.modeCountry'>
                                                    {{v.modeCountry}}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <kld-page :total="brandInfo.page.total"
                                          :current="brandInfo.page.current"
                                          :pageSize="brandInfo.page.limit"
                                          @on-change="getBrandList"></kld-page>
                            </div>
                        </FormItem>
                    </i-col>

                    <i-col :span="formValidate.breatheType!==1&&formValidate.breatheType!==0?6:12">
                        <FormItem label="设备分类："
                                  prop="assertTypeId">
                            <kld-dropdown-tree v-model="formValidate.assertTypeId"
                                               :data='country.list'
                                               placeholder='请选择设备分类'
                                               leaf-only
                                               code-prefix
                                               @current-change='clickOSTree'>
                            </kld-dropdown-tree>
                        </FormItem>
                    </i-col>
                    <i-col span="6"
                           v-if="formValidate.breatheType!==1&&formValidate.breatheType!==0">
                        <FormItem label="呼吸机分类："
                                  prop="breatheType"
                                  class="clearFix">
                            <RadioGroup v-model="formValidate.breatheType"
                                        style="float:left;width:100%;">
                                <Radio :label="2">
                                    <span>无创呼吸机</span>
                                </Radio>
                                <Radio :label="3">
                                    <span>有创呼吸机</span>
                                </Radio>
                                <Radio :label="4">
                                    <span>混合型呼吸机</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="设备状态："
                                  prop="used"
                                  class="clearFix">
                            <Select class="kld-select"
                                    v-model="formValidate.used"
                                    v-if="used.reload">
                                <Option v-for="(v) of usedList"
                                        :key="v.value"
                                        :value="v.value"
                                        :label="v.label"></Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="领用时间："
                                  prop="collarTime">
                            <DatePicker :editable="false"
                                        class="kld-date-picker"
                                        :disabled="!checkPage&&!!(originData.collarTime&&originData.purchaseMount!='0')"
                                        placeholder="请选择领用时间"
                                        v-model="dates.collarTime"></DatePicker>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="所属科室："
                                  prop="departmentId">
                            <kld-dropdown-tree v-model="formValidate.departmentId"
                                               :data='departmentTree'
                                               placeholder='请选择所属科室'
                                               :props='{label:"osName"}'
                                               @current-change='clickDepartmentTree'
                                               first-expand
                                               :ban-select='[$store.state.user_in.osId]'></kld-dropdown-tree>

                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem label="安装地点："
                                  prop="installSection">
                            <kld-dropdown-tree v-model="formValidate.installSection"
                                               :data='departmentTree'
                                               placeholder='请选择安装地点'
                                               :props='{label:"osName"}'
                                               @current-change='clickInstallationTree'
                                               first-expand
                                               :ban-select='[$store.state.user_in.osId]'></kld-dropdown-tree>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="现有编码："
                                  prop="oldAssetCode">
                            <i-input class="kld-input"
                                     placeholder="请填写设备现有编码"
                                     v-model="formValidate.oldAssetCode"></i-input>

                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="管理人："
                                  prop="userId"
                                  ref="user-com">
                            <poptip-show-info :info-id="formValidate.userId"
                                              width="100%">
                                <i-input :disabled="true"
                                         class="kld-input"
                                         placeholder="选择所属科室自动填充"
                                         v-model="departmentPersons.userName"></i-input>
                            </poptip-show-info>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="责任人："
                                  prop="responsibleId"
                                  ref="responsible-com">
                            <poptip-show-info :info-id="formValidate.responsibleId"
                                              width="100%">
                                <i-input :disabled="true"
                                         class="kld-input"
                                         placeholder="选择所属科室自动填充"
                                         v-model="departmentPersons.responsibleName"></i-input>
                            </poptip-show-info>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="资产标签："
                                  prop="assetLabelType">
                            <Select class="kld-select"
                                    v-model="formValidate.assetLabelType">
                                <Option :value="1">已贴</Option>
                                <Option :value="2">未贴</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                </Row>
            </div>
            <div class="container contract-association">
                <kld-type :title="'合同关联'"></kld-type>
                <Row>
                    <i-col span="12">
                        <FormItem label="关联合同："
                                  prop="contractId">
                            <div style="width:100%;display:inline-block;height:44px;">

                                <i-input class="kld-input"
                                         placeholder="请选择合同"
                                         readonly
                                         v-model="contract.name"
                                         style="width:calc(100% - 100px);"></i-input>
                                <Button class="kld-btn"
                                        @click="viewContract">选择合同</Button>
                            </div>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="设备原值："
                                  prop="purchaseMount">
                            <i-input class="kld-input"
                                     placeholder="请填写设备原值"
                                     :disabled='!checkPage&&originData.purchaseMount!="0"'
                                     ref="addAssetPurchaseMount"
                                     v-model="formValidate.purchaseMount">
                                <span slot="append">元</span>
                            </i-input>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="过保时间："
                                  prop="assetWarrntyDate">
                            <DatePicker :editable="false"
                                        class="kld-date-picker"
                                        placeholder="请选择过保时间"
                                        v-model="dates.assetWarrntyDate"></DatePicker>
                        </FormItem>
                    </i-col>
                </Row>
            </div>
            <!-- 合同弹窗 -->
            <Modal v-model="contract.show"
                   class="new-add-asset-contract-modal"
                   title="选择合同"
                   width="800px"
                   class-name="move-up-modal">
                <div class="modal-wrap">
                    <div class="kld-modal-input-wrap">

                        <i-input class="kld-modal-input"
                                 v-model="contract.search.keyword"
                                 style="width:60%;"
                                 placeholder="请输入关键字搜索"></i-input>
                    </div>
                    <div class='kld-modal-contents'>
                        <aside>
                            <ul>
                                <li v-for="(v,i) of contract.contractTypeList"
                                    :key="i"
                                    @click="searchType(v.contractType)"
                                    :class="i===contract.search.contractType?'contract-type-active':''">
                                    {{v.contractTypeName}}
                                </li>

                            </ul>

                        </aside>
                        <article>
                            <RadioGroup v-model="contract.checked.id"
                                        style="width:100%;">
                                <table class="table-stripe">
                                    <thead>
                                        <tr>
                                            <th>选择</th>
                                            <th>合同名称</th>
                                            <th>供应商名称</th>
                                            <th>签订日期</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(v,i) of contract.list"
                                            :key="i"
                                            @click="toggleCheck(v)">
                                            <td>
                                                <Radio :label="v.id"
                                                       style="width:10px;">
                                                    <span></span>
                                                </Radio>
                                            </td>
                                            <td>{{v.contractName}}</td>
                                            <td>{{v.supplierName}}</td>
                                            <td>{{v.signDate}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </RadioGroup>
                            <kld-loading v-if="tableLoading"></kld-loading>
                            <kld-page style="margin-top:10px;"
                                      :total="contract.page.total"
                                      :current="contract.page.current"
                                      :pageSize="contract.page.limit"
                                      @on-change="getContractList"></kld-page>
                        </article>
                    </div>
                </div>
                <div slot="footer">
                    <Button class="kld-btn-default"
                            @click="contract.show=false">取消</Button>
                    <Button class="kld-btn"
                            @click="queryRelate">确定</Button>
                </div>
            </Modal>

            <div class="container">
                <kld-type :title="'折旧信息'"></kld-type>
                <Row>
                    <i-col span="12">
                        <FormItem label="折旧方式："
                                  prop="depreciationType">
                            <Select class="kld-select kld-select-disabled"
                                    placeholder="请选择折旧方式"
                                    :disabled='!checkPage'
                                    v-model="formValidate.depreciationType">
                                <Option :value="0">平均年限法</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="折旧年限："
                                  prop="depreciationAgeLimit">
                            <Select class="kld-select kld-select-disabled"
                                    placeholder="请选择折旧年限"
                                    :disabled='!checkPage'
                                    v-model="formValidate.depreciationAgeLimit">
                                <Option v-for="(v,i) of [5,6,8]"
                                        :key="i"
                                        :value="v">{{v}}年</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="加速折旧系数："
                                  prop="speedDepreciationRate">
                            <i-input class="kld-input"
                                     placeholder="请填写加速折旧系数"
                                     :disabled='!checkPage'
                                     ref="addAssetSpeedDepreciationRate"
                                     v-model="formValidate.speedDepreciationRate">
                                <span slot="append">%</span>
                            </i-input>
                        </FormItem>
                    </i-col>
                </Row>

            </div>
            <div class="container"
                 v-if="isMeasure">
                <kld-type :title="'计量信息'"> </kld-type>
                <Row>
                    <i-col span="12">
                        <FormItem label="计量类型："
                                  prop="mtType">
                            <Select class="kld-select kld-select-disabled"
                                    placeholder="请选择计量类型"
                                    :disabled='true'
                                    v-model="formValidate.mtType">
                                <Option :value="0">强检</Option>
                                <Option :value="1">非强检</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span='12'>
                        <FormItem label="上次计量时间："
                                  prop="lastTime">
                            <!-- <i-input class="kld-input" placeholder="请选择上次计量时间" ></i-input> -->
                            <DatePicker :editable="false"
                                        class="kld-date-picker"
                                        :disabled='!checkMTLimit'
                                        placeholder="请选择上次计量时间"
                                        v-model="dates.lastTime"></DatePicker>
                        </FormItem>
                    </i-col>

                    <i-col span="12">
                        <FormItem label="计量周期："
                                  prop="cycle">
                            <i-input class="kld-input"
                                     placeholder="请填写计量周期"
                                     :disabled='!checkMTLimit'
                                     ref="addAssetCycle"
                                     v-model="formValidate.cycle">
                                <span slot="append">月</span>
                            </i-input>
                        </FormItem>
                    </i-col>
                </Row>

            </div>
            <div class="container">
                <kld-type :title="'设备信息'"></kld-type>
                <div class="row"
                     style="padding:0 10px;">

                    <p style="margin-bottom:10px;">设备图片：（支持上传单张3M以内的图片）</p>
                    <CUpload :fileList="assetPhotos.fileList"
                             :imgURLs="assetPhotos.imgURLs"></CUpload>
                </div>
                <Row>
                    <i-col>
                        <FormItem label="设备标签："
                                  prop="labelIds">
                            <Select class="kld-select asset-labels"
                                    multiple
                                    placeholder="请选择设备标签"
                                    :placement="'top'"
                                    v-model="formValidate.labelIds"
                                    @on-change='labelChange'>
                                <Option v-for="(v,i) of labels"
                                        :key="i"
                                        :value="v.id">{{v.labelName}}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                </Row>
            </div>

        </Form>
        <div class="footer">
            <Button class="kld-native-btn"
                    @click="goBack">取消</Button>
            <Button class="kld-native-btn"
                    type="primary"
                    @click="checkAddAsset"
                    :loading="submiting"
                    v-if="checkPage">确定</Button>
            <Button class="kld-native-btn"
                    type="primary"
                    v-else
                    :loading="submiting"
                    @click="checkConfig">确定</Button>
        </div>
    </div>
</template>

<script>
import kldPage from "@common/page/page.vue";
import kldType from "@common/kld-type/kld-type.vue";
import kldConfirm from "@common/kld-confirm";
import CUpload from "@common/C-Upload/C-upload";
import { uploadImg } from "@common/C-Upload/uploadImgAPI.js";
import poptipShowInfo from "@common/poptip-show-info";
import kldLoading from "@common/loading/loading.vue";
import floatTable from "./float-table";
import kldDropdownTree from "@common/kld-dropdown-tree/index";

export default {
    components: {
        kldType,
        kldPage,
        CUpload,
        poptipShowInfo,
        kldLoading,
        floatTable,
        kldDropdownTree
    },
    data() {
        const rightTimeValidator = (rule, value, callback) => {
            if (!value) {
                callback(new Error("该项为必填项！"));
            } else if (
                this.dates.collarTime &&
                this.dates.assetWarrntyDate &&
                this.dates.collarTime > this.dates.assetWarrntyDate
            ) {
                callback(new Error("领用时间应早于过保时间！"));
            } else {
                callback();
            }
        };
        const collarTimeValidator = (rule, value, callback) => {
            if (
                (!this.checkPage && this.originData.collarTime && !value) ||
                (this.checkPage && !value)
            ) {
                callback(new Error("该项为必填项！"));
            } else if (
                this.dates.collarTime &&
                this.dates.assetWarrntyDate &&
                this.dates.collarTime > this.dates.assetWarrntyDate
            ) {
                callback(new Error("领用时间应早于过保时间！"));
            } else {
                callback();
            }
        };
        const mtValidator = (rule, value, callback) => {
            if (!this.checkMTLimit) {
                callback();
                return;
            }
            if (value === null || value === "") {
                if (this.formValidate.mtType === 0) {
                    return callback(new Error("该项为必填项！"));
                }
                if (this.formValidate.lastTime || this.formValidate.cycle) {
                    return callback(new Error("该项为必填项！"));
                }
                if (
                    !this.checkPage &&
                    (this.originData.lastTime || this.originData.cycle)
                ) {
                    return callback(new Error("该项为必填项！"));
                }
            }

            callback();
        };
        const assetSNValidator = async (rule, value, callback) => {
            if (value === this.originData.assetSN) {
                return callback();
            }
            const { data } = await this.$axios.get(
                `/assets/checkSn?snCode=${value}`
            );
            if (data === 0) {
                return callback();
            }
            return callback("该序列号已存在，请更换新的序列号！");
        };
        return {
            tableLoading: false,
            SNLoading: false,
            assetIdBySN: null,

            submiting: false,
            configMT: false,
            dates: {
                collarTime: "",
                assetWarrntyDate: "",
                lastTime: ""
            },
            preAssetName: {
                assetNameList: []
            },
            classAssetName: {
                assetNameList: []
            },
            classPage: {
                total: 0,
                current: 1,
                size: 10
            },
            assetNameColumns: [
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
            classColumns: [
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
            formValidate: {
                //基本信息
                assetName: "",
                assetBrandId: "",
                assertTypeId: "",
                breatheType: 1, //呼吸机分类
                // assertTypeId: "",//国家分类
                collarTime: null,
                departmentId: "",
                installSection: "",
                userId: "",
                responsibleId: "",
                assetSN: "",
                oldAssetCode: "",
                assetClass: "",
                used: 1,
                registration: "",
                //合同关联
                contractId: "",
                purchaseMount: "0",
                assetWarrntyDate: "",
                //折旧信息
                depreciationType: 0,
                depreciationAgeLimit: 5,
                speedDepreciationRate: "",
                //计量信息
                lastTime: null,
                cycle: null,
                mtType: null,
                //设备信息
                labelIds: [],
                assetLabelType: 2
            },
            ruleValidate: {
                assetName: [
                    { required: true, message: "该项为必填项！" },
                    {
                        pattern: /^[\u4e00-\u9fa5\w()-]*$/,
                        message:
                            "设备名称仅支持中英文、数字、下划线、英文括号和短横线!",
                        trigger: "blur"
                    },
                    { max: 100, message: "最多100个字符！" }
                ],
                assetBrandId: {
                    required: true,
                    message: "该项为必填项！",
                    trigger: "blur"
                },
                assertTypeId: {
                    required: true,
                    message: "该项为必填项！",
                    trigger: "change"
                },
                assetSN: [
                    {
                        required: true,
                        message: "该项为必填项！",
                        trigger: "blur"
                    },
                    { validator: assetSNValidator, trigger: "blur" }
                ],
                collarTime: {
                    // required:function(){return !this.checkPage&&!!(this.originData.collarTime)},//TODO
                    required: true, //TODO
                    validator: collarTimeValidator,
                    trigger: "change"
                },
                departmentId: {
                    required: true,
                    message: "该项为必填项！",
                    trigger: "change"
                },
                userId: {
                    required: true,
                    message: "此科室暂未设置管理人，请联系管理员添加！"
                },
                responsibleId: {
                    required: true,
                    message: "此科室暂未设置负责人，请联系管理员添加！"
                },
                purchaseMount: { required: true, message: "该项为必填项！" },
                assetWarrntyDate: {
                    required: true,
                    validator: rightTimeValidator,
                    // validator: collarTimeValidator,
                    trigger: "change"
                },
                depreciationType: { required: true, message: "该项为必填项！" },
                depreciationAgeLimit: {
                    required: true,
                    message: "该项为必填项！"
                },
                lastTime: { validator: mtValidator, trigger: "change" },
                cycle: { validator: mtValidator, trigger: "change" },
                mtType: { validator: mtValidator, trigger: "change" },
                used: { required: true, message: "该项为必填项！" }
            },

            brandInfo: {
                list: [],
                name: "",
                nameRemark: "",
                show: false,
                page: {
                    limit: 10,
                    current: 1,
                    total: 0
                },
                current: null
            },
            country: {
                name: "",
                show: false,
                list: [],
                isLive: false,
                loading: false,
                type: 0
            },
            collarDepartment: {
                show: false,
                name: ""
            },
            installationLocation: {
                show: false,
                name: ""
            },
            departmentPersons: {
                // use: [],
                userName: "",
                // duty: [],
                responsibleName: ""
            },

            assetPhotos: {
                fileList: [],
                imgURLs: []
            },
            contract: {
                name: "",
                show: false,
                list: [],
                checked: {
                    id: "",
                    name: ""
                },
                doChecked: false, //是否确认关联
                page: {
                    limit: 10,
                    current: 1,
                    total: 0
                },
                search: {
                    contractStatus: 0,
                    contractType: 0,
                    keyword: "",
                    timer: undefined
                },
                contractTypeList: [
                    {
                        contractType: 0,
                        contractTypeName: "全部合同"
                    },
                    {
                        contractType: 1,
                        contractTypeName: "维保合同"
                    },
                    {
                        contractType: 2,
                        contractTypeName: "采购合同"
                    },
                    {
                        contractType: 3,
                        contractTypeName: "维修合同"
                    },
                    {
                        contractType: 4,
                        contractTypeName: "其他"
                    }
                ]
            },
            used: {
                reload: true,
                list: [
                    {
                        value: 0,
                        label: "闲置"
                    },
                    {
                        value: 1,
                        label: "在用"
                    },
                    {
                        value: 3,
                        label: "备用"
                    },
                    {
                        value: 4,
                        label: "待用"
                    }
                ]
            },

            labels: [],
            originData: {},
            MTInitStatus: true,
            isGetSN: false, //是否获得过随机SN号
            departmentTree: [],
            editInit: true
        };
    },

    computed: {
        rightDate() {
            return {
                collarTime: this.formValidate.collarTime,
                assetWarrntyDate: this.formValidate.assetWarrntyDate
            };
        },
        checkPage() {
            return this.$route.name == "add-asset";
        },
        assetId() {
            return this.$route.params.id;
        },
        checkMTLimit() {
            return this.checkPage
                ? this.checkLimit("ass:measurement:add")
                : this.checkLimit("ass:measurement:edit");
        },
        usedList() {
            return this.used.list.filter(v => {
                return this.country.isLive ? v.value !== 0 : v.value !== 4;
            });
        },
        isMeasure() {
            return this.formValidate.mtType !== null;
        }
    },
    created() {
        this.getOriginData();
        this.getDepartment();

        if (this.checkPage) {
            this.configMT = true;
        }
    },
    watch: {
        "brandInfo.name": {
            handler() {
                this.getBrandList();
            }
        },
        "contract.search.keyword": {
            handler() {
                clearTimeout(this.contract.search.timer);
                this.contract.search.timer = setTimeout(() => {
                    this.getContractList();
                }, 200);
            }
        },
        "formValidate.purchaseMount": {
            handler(newData) {
                if (!/^\d*$/.test(newData)) {
                    this.formValidate.purchaseMount = newData.replace(
                        /[^\d]/g,
                        ""
                    );
                    this.$refs.addAssetPurchaseMount.setCurrentValue(
                        this.formValidate.purchaseMount
                    );
                }
            }
        },
        "formValidate.speedDepreciationRate": {
            handler(newData) {
                if (!/^\d*$/.test(newData)) {
                    this.formValidate.speedDepreciationRate = newData.replace(
                        /[^\d|\.]/g,
                        ""
                    );
                    this.$refs.addAssetSpeedDepreciationRate.setCurrentValue(
                        this.formValidate.speedDepreciationRate
                    );
                }
            }
        },
        "formValidate.cycle": {
            handler(newData) {
                if (newData !== null) {
                    if (!/^[1-9]\d*$/.test(newData)) {
                        this.formValidate.cycle = newData.replace(
                            /^0|[^\d]/g,
                            ""
                        );
                        if (!this.$refs.addAssetCycle) return;
                        this.$refs.addAssetCycle.setCurrentValue(
                            this.formValidate.cycle
                        );
                    }
                }
            }
        },
        "dates.collarTime": {
            handler(data) {
                if (data) {
                    this.formValidate.collarTime = data
                        .toLocaleString("zh", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })
                        .replace(/\//g, "-");
                    if (!this.dates.assetWarrntyDate) {
                        this.dates.assetWarrntyDate = new Date(
                            data.getFullYear() + 1,
                            data.getMonth(),
                            data.getDate()
                        );
                        this.$nextTick(() => {
                            this.$refs["newAddAsset"].validateField(
                                "assetWarrntyDate"
                            );
                        });
                    }
                } else {
                    this.formValidate.collarTime = null;
                }
            }
        },
        "dates.assetWarrntyDate": {
            handler(data) {
                if (data) {
                    this.formValidate.assetWarrntyDate = data
                        .toLocaleString("zh", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })
                        .replace(/\//g, "-");
                } else {
                    this.formValidate.assetWarrntyDate = "";
                }
            }
        },
        "formValidate.used": {
            handler() {
                this.formValidate.used;
                // debugger;
            }
        },
        "dates.lastTime": {
            handler(data) {
                if (data) {
                    this.formValidate.lastTime = data
                        .toLocaleString("zh", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })
                        .replace(/\//g, "-");
                } else {
                    this.formValidate.lastTime = "";
                }
            }
        },
        isMeasure: {
            handler(val) {
                if (!val) {
                    this.dates.lastTime = "";
                    this.formValidate.cycle = null;
                }
            },
            immediate: true
        }
    },
    methods: {
        //获取科室树
        async getDepartment() {
            const { data } = await this.$axios.get(
                `orgstruct/findAllTree/${this.$store.state.user_in.osId}`
            );

            this.departmentTree = [data];
            this.$nextTick(() => {
                if (this.$route.params.departmentId) {
                    this.formValidate.departmentId = this.$route.params.departmentId;
                }
            });
        },

        countryTypeFilterMethod(value, data, node) {
            if (value === "") {
                return true;
            }
            for (; node; node = node.parent) {
                const { label } = node;
                if (label && label.includes(value)) {
                    return true;
                }
            }

            return false;
        },
        AddNewAsset() {
            this.addDisabled = false;
            this.$refs["formValidate"].resetFields();
        },

        async getSN() {
            //获得随机序列号
            this.SNLoading = true;
            try {
                let getUrl = this.checkPage
                    ? this.assetIdBySN
                        ? "?assetId=" + this.assetIdBySN
                        : ""
                    : "?assetId=" + this.assetId;
                const { data } = await this.$axios.get(`assets/getSN${getUrl}`);
                this.formValidate.assetSN = data.sn;
                this.assetIdBySN = data.assetId;
                this.$refs["newAddAsset"].validateField("assetSN");
            } finally {
                this.SNLoading = false;
                this.isGetSN = true;
            }
        },

        //获得初始数据
        getOriginData() {
            this.getBrandList();
            if (this.checkLimit("con:list")) {
                this.getContractList();
            }
            this.getLabels();
            this.preHandleConfigData();
        },
        //编辑页面数据预处理
        preHandleConfigData() {
            this.getDiffInfo();
            this.getCountryAssetType();
        },
        //不同模块的获取的不同参
        getDiffInfo() {
            if (!this.checkPage) {
                this.getAssetDetail();
            }
        },

        //获得编辑时数据
        async getAssetDetail() {
            const { data } = await this.$axios.get(
                `/assets/${this.$store.state.user_in.osId}/${this.assetId}`
            );

            data.photos = data.photos || [];
            let originData = JSON.parse(
                //初始值
                JSON.stringify(data, Object.keys(this.formValidate))
            );
            this.originData = data; //保存初始值

            for (let i in originData) {
                if (originData[i] === null && i !== "mtType") {
                    originData[i] = "";
                }
            }
            this.formValidate = originData;
            this.formValidate.assetLabelType =
                this.formValidate.assetLabelType || 1;

            this.formValidate.labelIds = data.labels.map(v => v.labelId);
            this.brandInfo.name = data.brandName || "";
            this.brandInfo.currentName = data.brandName || "";

            this.collarDepartment.name = data.osName || "";

            if (this.formValidate.assetWarrntyDate) {
                this.dates.assetWarrntyDate = new Date(
                    this.formValidate.assetWarrntyDate
                );
            }
            if (this.formValidate.collarTime) {
                this.dates.collarTime = new Date(this.formValidate.collarTime);
            }
            if (this.formValidate.lastTime) {
                this.dates.lastTime = new Date(this.formValidate.lastTime);
            }

            if (this.formValidate.departmentId) {
                this.getAssetUser(this.formValidate.departmentId);
            }

            if (this.formValidate.contractId) {
                this.$nextTick(() => {
                    this.contract = {
                        ...this.contract,
                        doChecked: true,
                        name: data.contractName,
                        checked: {
                            id: data.contractId,
                            name: data.contractName
                        }
                    };
                });
            }
            if (data.photos.length) {
                this.assetPhotos = {
                    fileList: data.photos,
                    imgURLs: data.photos.map(v => this.upfile_ + v.photoUrl)
                };
            }
            if (this.formValidate.installSection) {
                this.installationLocation.name = data.installSectionName;
            }
        },

        //获得品牌列表
        async getBrandList(page = 1) {
            this.brandInfo.page.current = page;
            const {
                data: { data, recordsTotal }
            } = await this.$axios.post(
                `/assertBrandcopys/${this.$store.state.user_in.osId}/list`,
                {
                    limit: this.brandInfo.page.limit,
                    offset:
                        this.brandInfo.page.limit *
                        (this.brandInfo.page.current - 1),
                    params: {
                        keyword: this.brandInfo.name
                    }
                }
            );
            this.brandInfo.list = data;
            this.brandInfo.page.total = recordsTotal;
        },
        // 获得设备(国家)分类(带强检信息)

        async getCountryAssetType() {
            this.country.list = await this.$store.dispatch(
                "loadCountryType",
                true
            );
        },

        //获得合同列表
        async getContractList(page = 1) {
            this.tableLoading = true;
            try {
                this.contract.page.current = page;
                let checkedId = this.contract.checked.id;
                this.contract.checked.id = "";
                const requestBody = {
                    limit: this.contract.page.limit,
                    offset:
                        this.contract.page.limit *
                        (this.contract.page.current - 1),
                    params: {
                        contractStatus: this.contract.search.contractStatus,
                        contractType: this.contract.search.contractType,
                        keyword: this.contract.search.keyword
                    }
                };

                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(
                    `/contracts/${this.$store.state.user_in.osId}/list`,
                    requestBody
                );
                this.contract.list = data;
                this.contract.page.total = recordsTotal;
                this.$nextTick(() => {
                    this.contract.checked.id = checkedId;
                });
            } finally {
                this.tableLoading = false;
            }
        },
        //获得标签集合
        async getLabels() {
            const { data } = await this.$axios.post(`/labels/list/1`);
            this.labels = data;
        },

        preRemoteReady(res) {
            this.preAssetName.assetNameList = res.data.data;
        },
        classRemoteReady(res) {
            this.classAssetName.assetNameList = res.data.data;
        },

        async getPreInfo(info, i) {
            this.formValidate.assetName = info.assetName;
            const { data } = await this.$axios.post(
                `/assets/getOtherByAssetId?id=${info.assetId || info.id}`
            );
            this.PreInfoFormat(data);
        },
        PreInfoFormat(preData) {
            //设备品牌
            if (preData.brandName && preData.assetBrandId) {
                this.brandInfo.name = preData.brandName;
                this.brandInfo.currentName = preData.brandName;
                this.formValidate.assetBrandId = preData.assetBrandId;
            }
            //设备型号
            if (preData.assetClass) {
                this.formValidate.assetClass = preData.assetClass;
            }
            //折旧年限
            if (preData.depreciationAgeLimit) {
                this.formValidate.depreciationAgeLimit =
                    preData.depreciationAgeLimit;
            }
            //设备注册证号
            if (preData.registration) {
                this.formValidate.registration = preData.registration;
            }
            //选择设备分类
            if (preData.assertTypeId) {
                this.formValidate.assertTypeId = preData.assertTypeId;
            }

            //选择呼吸机类型
            if (preData.breathe_type) {
                this.$nextTick(() => {
                    if (this.formValidate.assertTypeId) {
                        this.formValidate.breatheType = preData.breathe_type;
                    }
                });
            }

            //若不是该医院
            if (preData.hosId !== this.$store.state.user_in.osId) {
                return;
            }
            if (preData.labels.length) {
                this.formValidate.labelIds = preData.labels.map(v => v.labelId);
            }
        },

        checkAddAsset() {
            this.$refs.newAddAsset.validate(valid => {
                if (!valid) {
                    return this.$Message.warning("请修改错误内容后提交！");
                }
                this.addAsset();
            });
        },
        async addAsset() {
            this.submiting = true;
            try {
                const photosRes = await uploadImg.call(
                    this,
                    this.assetPhotos.fileList,
                    7
                );

                const photos = photosRes.map(v => v.data);
                const url = `/assets/${this.$store.state.user_in.osId}`;
                const requestBody = {
                    id: this.assetIdBySN || undefined,
                    hosId: this.$store.state.user_in.osId,
                    ...this.formValidate,
                    photos,
                    speedDepreciationRate:
                        this.formValidate.speedDepreciationRate || "0",
                    // assertTypeId: undefined,
                    cycle: this.checkMTLimit
                        ? +this.formValidate.cycle || null
                        : undefined,
                    lastTime: this.checkMTLimit
                        ? this.formValidate.lastTime || null
                        : undefined,
                    mtType: this.checkMTLimit
                        ? this.formValidate.mtType
                        : undefined,
                    userName: this.departmentPersons.userName,
                    responsibleName: this.departmentPersons.responsibleName,
                    lifeType: this.country.isLive ? 1 : 0
                };

                await this.$axios.post(url, requestBody);
                this.$Message.success("新增资产成功！");
                this.submiting = false;
                this.$router.go(-1);
            } finally {
                this.submiting = false;
            }
        },

        checkConfig() {
            this.$refs.newAddAsset.validate(valid => {
                if (!valid) {
                    return this.$Message.warning("请修改错误内容后提交！");
                }
                this.submitConfig();
            });
        },
        async submitConfig() {
            this.submiting = true;
            try {
                const photosRes = await uploadImg.call(
                    this,
                    this.assetPhotos.fileList,
                    7
                );
                let photos = [
                    ...photosRes.map(v => v.data),
                    ...this.assetPhotos.fileList.filter(v => !v.type)
                ];
                const url = `/assets/${this.$store.state.user_in.osId}`;
                let requestBody = {
                    ...this.formValidate,
                    id: this.assetId,
                    photos,
                    cycle: this.checkMTLimit
                        ? +this.formValidate.cycle || null
                        : undefined,
                    lastTime: this.checkMTLimit
                        ? this.formValidate.lastTime || null
                        : undefined,
                    mtType: this.checkMTLimit
                        ? this.formValidate.mtType
                        : undefined,
                    purchaseMountFlag:
                        +this.formValidate.purchaseMount !==
                        +this.originData.purchaseMount
                            ? "true"
                            : "false",
                    collarTimeFlag:
                        (this.formValidate.collarTime !==
                            this.originData.collarTime) +
                        "",
                    lifeType: this.country.isLive ? 1 : 0,
                    osName: this.collarDepartment.name,
                    assertTypeName: this.country.name,
                    brandName: this.brandInfo.name,
                    userName: this.departmentPersons.userName,
                    responsibleName: this.departmentPersons.responsibleName,
                };
                await this.$axios.put(url, requestBody);

                this.$Message.success("编辑资产成功！");
                this.submiting = false;
                this.$router.go(-1);
            } finally {
                this.submiting = false;
            }
        },

        goBack() {
            kldConfirm({
                title: "提示",
                content: "离开此页面后，所有信息将不会保留! 确认返回？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.$router.go(-1);
                }
            });
        },

        searchType(type) {
            this.contract.search.contractType = type;
            this.getContractList();
        },
        setExpand(node) {
            if (!node.isLeaf) {
                node.childNodes[0].expanded = true;
                this.setExpand(node.childNodes[0]);
            }
        },
        clickOSTree(node) {
            if (!node) {
                return;
            }
            this.country.isLive =
                node.state === 3 || node.state === 2 || node.state === 1;
            if (this.editInit) {
                this.formValidate.used = this.formValidate.used;
                this.editInit = false;
            } else {
                this.formValidate.used = 1;
            }

            this.formValidate.assertTypeId = node.id;
            this.country.name = node.typeName;
            let breatheType = this.formValidate.breatheType;

            this.formValidate.breatheType =
                node.state === 2 ? (breatheType >= 2 ? breatheType : 2) : 1;

            // debugger
            this.$nextTick(() => {
                this.formValidate.mtType = node.type;
            });
        },

        clickDepartmentTree(node) {
            this.formValidate.departmentId = node.id;
            this.collarDepartment.name = node.osName;
            this.formValidate.userId = "";
            this.formValidate.responsibleId = "";

            this.getAssetUser(node.id);
            if (!this.formValidate.installSection) {
                this.formValidate.installSection = node.id;
                this.installationLocation.name = node.osName;
            }
        },
        validateDepartmentPersons() {
            this.$nextTick(() => {
                this.$refs.newAddAsset.validateField("userId");
                this.$refs.newAddAsset.validateField("responsibleId");
            });
        },
        async getAssetUser(sectionId) {
            //获得管理人和负责人
            const { data } = await this.$axios.get(
                `/orgstruct/${sectionId}/getOrgstructResponsible`
            );
            if (!data) {
                this.formValidate.responsibleId = "";
                this.departmentPersons.responsibleName = "";
                this.formValidate.userId = "";
                this.departmentPersons.userName = "";
                this.validateDepartmentPersons();
                return;
            }
            const { responsible, responsibleName, user, userName } = data;

            this.formValidate.responsibleId = responsible || "";
            this.departmentPersons.responsibleName = responsibleName || "";

            this.departmentPersons.userName = userName || "";
            this.formValidate.userId = user || "";
            this.validateDepartmentPersons();
        },
        clickInstallationTree(node) {
            if (node.osParentid === "-1") {
            } else {
                this.formValidate.installSection = node.id;
                this.installationLocation.name = node.osName;
                this.installationLocation.show = false;
            }
        },
        //同步品牌名
        getBrandName(v) {
            this.brandInfo.currentName = v.brandName;
            this.brandInfo.name = v.brandName;
            this.formValidate.assetBrandId = v.brandId; //id=>brandId
            this.brandInfo.show = false;
            this.$refs["newAddAsset"].validateField("assetBrandId");
        },
        handleClickOutside() {
            if (this.formValidate.assetBrandId) {
                this.brandInfo.name = this.brandInfo.currentName;
            } else {
                this.brandInfo.name = "";
            }
            this.brandInfo.show = false;
        },
        handleClassInputClickOutside() {
            this.classAssetName.assetNameShow = false;
        },

        toggleCheck(v) {
            if (this.contract.checked.id === v.id) {
                this.contract.checked.id = "";
                return;
            }
            this.contract.checked.id = v.id;
            this.contract.checked.name = v.contractName;
        },

        viewContract() {
            if (!this.checkLimit("con:list")) {
                this.$Message.warning("抱歉，您没有获取合同列表权限！");
                return;
            }
            this.contract.show = true;
            if (this.contract.doChecked) {
                this.contract.checked.id = this.formValidate.contractId;
                this.contract.checked.name = this.contract.name;
            }
        },
        //确认关联
        queryRelate() {
            if (!this.contract.checked.id && !this.checkPage) {
                this.$Message.warning("请选择您要关联的合同！");
                return;
            }
            if (!this.contract.checked.id && this.checkPage) {
                this.contract.doChecked = false;
                this.formValidate.contractId = this.contract.checked.id = "";
                this.contract.name = this.contract.checked.name = "";
                this.contract.show = false;
                return;
            }
            this.contract.doChecked = true;
            this.formValidate.contractId = this.contract.checked.id;
            this.contract.name = this.contract.checked.name;
            this.contract.show = false;
        },
        labelChange(label) {
            if (label.length > 5) {
                this.formValidate.labelIds = this.formValidate.labelIds.slice(
                    0,
                    5
                );
                this.$Message.warning("最多可选择5个设备标签！");
            }
        }
        //
    }
};
</script>

<style lang="less" scoped>
.new-add-asset-wrap {
    position: relative;

    background-color: rgb(250, 250, 250);
    border-top: 1px solid rgba(2, 31, 57, 0.1);
    padding-bottom: 100px;
    .ivu-col {
        padding: 0 10px;
        margin-bottom: 20px;
        height: 78px;
    }
    .base-info {
        .ivu-col {
            padding: 0 10px;
        }
        /deep/.select-assertTypeId {
            .ivu-select-input {
                height: 100%;
            }
        }
        .asset-name-select-wrap {
            position: absolute;
            z-index: 1000;
            width: 100%;
            box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
            background-color: #fff;
            border-radius: 5px;
            padding: 4px 0;
        }
        .asset-name-select {
            margin-top: 5px;
            // max-height: 300px;
            // overflow: auto;
            > li {
                padding: 0 10px;
                @length: 30px;
                height: @length;
                line-height: @length;
                font-size: 14px;
                cursor: pointer;
                &:not(.click-li):hover {
                    background-color: #f3f3f3;
                }
            }
            .pre-selected {
                background-color: #f3f3f3;
            }
            .selected {
                background-color: rgba(45, 140, 240, 0.9);
                color: #fff;
            }
        }
        .brand-list-wrap {
            width: 100%;
            position: absolute;
            border: 0;
            z-index: 1000;
            background-color: #fafafa;
            padding-bottom: 10px;
            border-radius: 5px;
            border: 1px solid #dddee1;
            table {
                width: 100%;
                border-collapse: collapse;
                tr {
                    cursor: pointer;
                    td {
                        text-align: center;
                    }
                }
                tbody {
                    tr:nth-child(2n + 1) {
                        td {
                            background-color: #f1f1f2 !important;
                        }
                    }
                    tr:nth-child(2n) {
                        td {
                            background-color: #fafafa !important;
                        }
                    }
                }
            }
        }
    }
    .contract-association {
        .ivu-col {
            padding: 0 10px;
        }
    }
    .asset-labels {
        /deep/.ivu-tag {
            margin-top: 9px;
        }
    }

    .footer {
        height: 60px;
        position: absolute;
        width: 100%;
        left: 0px;
        bottom: 0;
        background-color: rgba(209, 209, 209, 0.5);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .ivu-btn {
            margin-right: 25px;
        }
    }
}
.new-add-asset-contract-modal {
    /deep/.ivu-modal-body {
        padding-bottom: 0;
    }
    .modal-wrap {
        width: 100%;
        height: 100%;
        .kld-modal-input-wrap {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            .kld-modal-input {
            }
        }
        .kld-modal-contents {
            min-height: 450px;
            width: 100%;
            display: flex;
            margin-top: 10px;
            aside {
                // height:100%;
                border-top: 1px solid #dddee1;
                // border-top: 1px solid #dddee1;
                width: 20%;
                // padding-top:1px;
                > ul {
                    // width: 80%;
                    height: 100%;
                    // margin-top: 10px;
                    border-right: 1px solid #dddee1;
                    li {
                        border-bottom: 1px solid #dddee1;
                        font-size: 14px;
                        color: #666;
                        padding: 10px 0 10px 10px;
                        cursor: pointer;
                        text-indent: 20px;
                        border-left: 1px solid #dddee1;
                        height: 40px;
                    }
                    .contract-type-active {
                        border-left: 5px solid #459ca2;
                        color: #459ca2;
                    }
                }
            }
            article {
                position: relative;
                width: 80%;
                table {
                    width: 100%;
                    // margin-top: 10px;
                    border-collapse: collapse;
                    border-top: 1px solid #dddee1;
                    td,
                    th {
                        border-bottom: 1px solid #dddee1;
                        text-align: center;
                    }
                    thead {
                        tr {
                            height: 40px;
                            font-size: 14px;
                        }
                    }
                    tbody {
                        tr {
                            cursor: pointer;
                            height: 40px;
                        }
                    }
                }
            }
        }
    }
    /deep/.ivu-modal-footer {
        border-top: 1px solid #dddee1;
        .kld-btn-default {
            border: solid 1px #999999;
            background-color: #a9a8a9;
        }
    }
}
.focus-li {
    background: #f3f3f3;
}
.click-li {
    color: #fff;
    background: rgba(45, 140, 240, 0.9);
}
</style>

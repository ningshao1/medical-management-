<template>
    <div class="step1-wrap"
         @click="hideTable">
        <Form label-position="top"
              ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate">
            <type title="基础信息"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="设备名称："
                              prop='assertName'>
                        <div class="add-device-name"
                             v-clickoutside.native='function(){ListShow=false}'>
                            <div class='check-asset'>资产已入库？
                                <a href="javascript:;"
                                   @click="asset.assetShow=true;">点击选择已有设备</a>
                            </div>
                            <!-- <div v-clickoutside='ListShow=false' style="width:100%"> -->
                            <Input class="kld-input "
                                   placeholder="请填写设备"
                                   v-model="formValidate.assertName"
                                   @on-change='InputselectList'
                                   :disabled='addDisabled'
                                   @on-focus='InputselectList'></Input>
                            <transition name="slide-up">
                                <div ref='check-asset-list'
                                     class="check-asset-list"
                                     v-show="ListShow&&checkListData.length>0&&formValidate.assertName!==''">
                                    <ul ref="asset-ul">
                                        <li :ref='`asset-li-${i}`'
                                            v-for="(item,i) in checkListData"
                                            class="ivu-select-item"
                                            :key='item.id'
                                            @click="checkList(item,i)"
                                            :class="{'focus-li':i===focusIndex,'click-li':i===clickIndex}">{{item.assetName}}</li>
                                    </ul>
                                    <kld-page @on-change='selectList'
                                              :total='checkListPage.total'
                                              :current.sync='checkListPage.current'
                                              :page-size='checkListPage.pageSize'></kld-page>
                                </div>
                            </transition>
                            <!-- </div> -->
                        </div>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="型号："
                              prop="assetClass">
                        <Input class="kld-input"
                               type="text"
                               placeholder="请填写型号"
                               :disabled='addDisabled'
                               v-model="formValidate.assetClass" />
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
                                   :disabled='addDisabled||SNdisabled'
                                   v-model="formValidate.assetSN" />
                            <Button class="kld-btn"
                                    @click="ClickgetSN"
                                    :loading='SNLoading'
                                    :disabled='addDisabled'>随机序列号</Button>
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
                               :disabled='addDisabled'
                               v-model="formValidate.registration" />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="品牌："
                              style="z-index:99"
                              prop='assetBrandId'>
                        <Input class="kld-input brand-Input"
                               placeholder="请选择品牌"
                               :disabled='addDisabled'
                               @on-focus.stop='brand.brandShow=true'
                               v-model="brand.brandKey"></Input>
                        <div class="one-asset modal-div band-div"
                             v-show='brand.brandShow'>
                            <table id='modal-table'
                                   class='one-asset-table table-stripe '
                                   style="table-layout:fixed;border-collapse:collapse"
                                   border="1">
                                <tr>
                                    <th style="padding:1px 10px">名称</th>
                                    <th style="padding:1px 10px">厂商</th>
                                    <th style="padding:1px 10px">国别</th>

                                </tr>
                                <tr v-for='(item,i) in brand.brandList'
                                    :key='i+(+new Date())'
                                    @click="clickBrand(item)">
                                    <td style="padding:1px 5px"
                                        class="textEllipsis">{{item.brandName}} </td>
                                    <td style="padding:1px 5px"
                                        class="textEllipsis">{{item.manufactor}}</td>
                                    <td style="padding:1px 5px"
                                        class="textEllipsis">{{item.modeCountry}}</td>
                                </tr>
                            </table>
                            <div class='acceptance-tree-page'>
                                <kld-page :total='brand.brandPage.total'
                                          :current.sync='brand.brandPage.current'
                                          @on-change='getbrand'></kld-Page>
                            </div>
                        </div>
                    </FormItem>
                </i-col>
                <i-col :span="long">

                    <FormItem label="国家分类："
                              prop="assertTypeId">
                        <Input v-model="countryName"
                               v-if="addDisabled"
                               disabled
                               class="kld-input"></Input>
                        <kld-tree-select v-else
                                         :disabled='addDisabled'
                                         :filterable='true'
                                         v-model="formValidate.assertTypeId"
                                         :leafOnly='true'
                                         :data='countryList'
                                         placeholder='请选择国家分类'
                                         :node-key='"id"'
                                         empty-text='暂无国家分类'
                                         @node-click="clickAssertTypeTree"
                                         titleKey='typeName'
                                         :draggable='true'>
                        </kld-tree-select>
                    </FormItem>
                </i-col>
                <i-col :span="12-long"
                       v-if="long!==12">
                    <FormItem label="呼吸机分类："
                              prop='breatheType'>
                        <RadioGroup v-model="formValidate.breatheType"
                                    style="heigth:30px;">
                            <Radio :label="2"
                                   :disabled='addDisabled'>
                                <span>无创呼吸器</span>
                            </Radio>
                            <Radio :label="3"
                                   :disabled='addDisabled'>
                                <span>有创呼吸器</span>
                            </Radio>
                            <Radio :label="4"
                                   :disabled='addDisabled'>
                                <span>混合呼吸机</span>
                            </Radio>
                        </RadioGroup>

                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="安装时间："
                              prop="collarTime">
                        <DatePicker :value='formValidate.collarTime'
                                    :disabled='addDisabled'
                                    :editable="false"
                                    class="kld-date-picker"
                                    type="date"
                                    placeholder="请选择安装时间"
                                    @on-change='collar'></DatePicker>
                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="所属科室"
                              prop="departmentId">
                        <Input v-if="addDisabled"
                               type="text"
                               disabled
                               placeholder="请选择所属科室"
                               class="kld-input"
                               v-model="department.departmentName"></Input>
                        <Poptip v-else
                                style="width:100%"
                                class="kld-section-tree "
                                trigger="click"
                                placement="bottom"
                                v-model="department.departmentPop">
                            <Input type="text"
                                   disabled
                                   placeholder="请选择所属科室"
                                   class="kld-input acc-input-disabled"
                                   v-model="department.departmentName"></Input>
                            <div slot="content">
                                <OS-Tree search
                                         @clickTree='clickSection($event,1)'></OS-Tree>
                            </div>
                        </Poptip>

                    </FormItem>
                </i-col>
                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="安装地点：">
                        <Input v-if="addDisabled"
                               type="text"
                               disabled
                               placeholder="请选择安装地点"
                               class="kld-input"
                               v-model="installSection.name"></Input>
                        <Poptip v-else
                                style="width:100%"
                                class="kld-section-tree "
                                trigger="click"
                                placement="bottom"
                                v-model="installSection.pop">
                            <Input type="text"
                                   disabled
                                   placeholder="请选择安装地点"
                                   class="kld-input acc-input-disabled"
                                   v-model="installSection.name"></Input>
                            <div slot="content">
                                <OS-Tree search
                                         @clickTree='clickSection'></OS-Tree>
                            </div>
                        </Poptip>

                    </FormItem>
                </i-col>

                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="管理人："
                              prop="userId">
                        <Input v-if="addDisabled"
                               type="text"
                               :disabled='addDisabled'
                               placeholder="请选择使用人"
                               class="kld-input"
                               v-model="userName"></Input>
                        <Input v-else
                               type="text"
                               :disabled='addDisabled'
                               placeholder="请选择使用人"
                               class="kld-input"
                               v-model="userName"></Input>
                    </FormItem>
                </i-col>

                <i-col :span="12"
                       style="height:100px;">
                    <FormItem label="负责人："
                              prop="responsibleId">
                        <Input v-if="addDisabled"
                               type="text"
                               :disabled='addDisabled'
                               placeholder="请选择负责人"
                               class="kld-input"
                               v-model="responsibleName"></Input>
                        <Input v-else
                               type="text"
                               :disabled='addDisabled'
                               placeholder="请选择负责人"
                               class="kld-input"
                               v-model="responsibleName"></Input>
                    </FormItem>
                </i-col>

            </Row>
            <type title="关联合同"></type>
            <Row :gutter="20">
                <i-col :span="12">
                    <FormItem label="关联合同："
                              prop="contractId">
                        <Input style="cursor:pointer"
                               :class="addDisabled===false?'acc-input-disabled':''"
                               class="kld-input"
                               @click.native="addDisabled===false?contract.contractShow=true:''"
                               type="text"
                               placeholder="请选择关联合同"
                               disabled
                               v-model="contract.contractName" />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="设备原值："
                              prop='purchaseMount'>
                        <Input class="kld-input"
                               type="text"
                               placeholder="请填写设备原值"
                               :disabled='addDisabled'
                               v-model="formValidate.purchaseMount" />
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="过保时间："
                              prop='assetWarrntyDate'>
                        <DatePicker :disabled='addDisabled'
                                    :value='formValidate.assetWarrntyDate'
                                    :editable="false"
                                    class="kld-date-picker"
                                    type="date"
                                    placeholder="请选择过保时间"
                                    @on-change='formValidate.assetWarrntyDate=$event'></DatePicker>
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
                                :disabled='addDisabled'
                                v-model="formValidate.depreciationType">
                            <Option :value="1">平均年限法</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col :span="12">
                    <FormItem label="折旧年限："
                              prop='depreciationAgeLimit'>
                        <Select class="kld-select"
                                placeholder="请选择年限"
                                :disabled='addDisabled'
                                v-model="formValidate.depreciationAgeLimit">
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
                               :disabled='addDisabled'
                               placeholder="请输入加速折旧系数"
                               v-model="formValidate.speedDepreciationRate">
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
                                <Option v-for="item in MeaType"
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
                                        :disabled='addDisabled||checkMT'
                                        :editable="false"
                                        class="kld-date-picker"
                                        type="date"
                                        placeholder="请选择上次计量时间"
                                        @on-change='formValidate.lastTime=$event'></DatePicker>
                        </FormItem>
                    </i-col>
                    <i-col :span="8">
                        <FormItem label="周期："
                                  prop='cycle'>
                            <Input class="kld-input"
                                   placeholder="请输入"
                                   :disabled='addDisabled||checkMT'
                                   v-model="formValidate.cycle">
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
                        <showIMG :imgUrlList='formValidate.photos'
                                 v-if='addDisabled'></showIMG>
                        <kld-upImg v-else
                                   :fileList="formValidate.photos"
                                   :maxCount="5"
                                   :accept="['image/jpeg','image/jpg','image/png']"></kld-upImg>
                    </FormItem>
                </i-col>
                <i-col :span="24">
                    <FormItem label="设备标签："
                              prop='labelIds'>
                        <Select v-model="formValidate.labelIds"
                                filterable
                                multiple
                                :disabled='addDisabled'
                                @on-change='labelChange'>
                            <Option v-for="item in labelList"
                                    :value="item.id"
                                    :key="item.id">{{ item.labelName }}</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
        </Form>

        <Modal title="选择资产"
               v-model="asset.assetShow"
               class-name="vertical-center-modal one-step-modal move-up-modal">
            <div class="one-step-modal-content">
                <div class='one-step-tree asset-tree'>
                    <div>
                        <OS-Tree search
                                 @clickTree='clickAssetTree'></OS-Tree>
                    </div>
                </div>
                <div class='one-step-table'>
                    <div>
                        <Input icon="ios-search-strong"
                               placeholder="请输入设备名称"
                               style="width: 100%;"
                               class="kld-input"
                               v-model="asset.keyword"></Input>
                    </div>
                    <div class="one-asset modal-div">
                        <table id='modal-table'
                               class='one-asset-table table-stripe '
                               style="table-layout:fixed;border-collapse:collapse"
                               border="1">
                            <tr>
                                <th>设备编码</th>
                                <th>设备名称</th>
                                <th>设备型号</th>
                                <th>设备品牌</th>
                            </tr>
                            <tr v-for='(item,i) in asset.assetList'
                                :key='i'
                                @click='getAsset(item.id)'>
                                <td class="textEllipsis">{{item.assetCode}} </td>
                                <td class="textEllipsis">{{item.assetName}}</td>
                                <td class="textEllipsis">{{item.assetClass}}</td>
                                <td class="textEllipsis">{{item.brandName}}</td>
                            </tr>
                        </table>
                        <div class='acceptance-tree-page'>
                            <kld-page :total='asset.assetPage.total'
                                      :current.sync='asset.assetPage.current'
                                      @on-change='getAseetList'></kld-Page>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        <Modal title="选择合同"
               v-model="contract.contractShow"
               class-name="vertical-center-modal one-step-modal contract-Modal">
            <div class="one-step-modal-content">
                <div class='one-step-tree'>
                    <div>
                        <ul class="typeList">
                            <li v-for='(item,i) in contract.contractType'
                                :key='i'
                                :class="contract.index===i?'click-li':''"
                                @click="contract.index=i;contract.page.current=1;getContract()">
                                <p>{{item}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class='one-step-table'>
                    <div>
                        <Input class="kld-input on-step-search"
                               placeholder="请输入关键词"
                               v-model="contract.keyword"
                               icon='ios-search-strong'></Input>

                    </div>
                    <div class="one-asset modal-div">
                        <RadioGroup v-model="formValidate.contractId"
                                    vertical>
                            <table id='modal-table'
                                   class='one-asset-table table-stripe '
                                   style="table-layout:fixed;border-collapse:collapse"
                                   border="1">
                                <tr>
                                    <th>选择</th>
                                    <th>合同名称</th>
                                    <th>供应商名称</th>
                                    <th>签订日期</th>

                                </tr>
                                <tr v-for='(item,i) in contract.contractList'
                                    :key='i'
                                    @click='ContractTr(item)'>
                                    <td class="textEllipsis on-step-td">
                                        <Radio :label='item.id'
                                               class="on-step-radio">
                                            <span></span>
                                        </Radio>
                                    </td>
                                    <td class="textEllipsis">{{item.contractName}}</td>
                                    <td class="textEllipsis">{{item.supplierName}}</td>
                                    <td class="textEllipsis">{{item.signDate}}</td>
                                </tr>
                            </table>
                        </RadioGroup>
                        <div class='acceptance-tree-page'>
                            <kld-page :total='contract.page.total'
                                      :current.sync='contract.page.current'
                                      @on-change='getContract'></kld-Page>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>


<script>
import type from "../../../QualityControl/adverseEvent/reportAdverseEvent/type.vue";
import tree from "@common/trees/tree";
import page from "@common/page/page";
import transformTreeData from "@common/transformSectionTreeData";
import upImg from "@common/C-Upload/C-upload";
import showIMG from "@common/imageView/ImageView";
import poptipShowInfo from "@common/poptip-show-info";
import elTree from "@common/element-components/el-tree";
import kldLoading from "@common/loading/loading.vue";
import kldTree from "@common/kld-tree-select";
export default {
    props: {
        Nasset: {
            type: Object
        },
        loading: {}
    },
    name: "step1",
    components: {
        type,
        [tree.name]: tree,
        [page.name]: page,
        [upImg.name]: upImg,
        showIMG,
        poptipShowInfo,
        elTree,
        kldLoading,
        [kldTree.name]: kldTree
    },
    computed: {
        checkMT() {
            return !this.checkLimit("ass:measurement:add");
        },
        isMeasure() {
            return this.formValidate.mtType !== null;
        }
    },
    data() {
        return {
            intercept: false, //用于拦截频繁提交
            addDisabled: false, //控制是否为disabled
            TypeDisabled: false,
            focusIndex: -1,
            clickIndex: -1,
            long: 12,
            ListShow: false,
            checkListData: [],
            checkListPage: {
                total: 10,
                current: 1,
                pageSize: 10
            },
            brand: {
                //品牌
                brandKey: "",
                brandShow: false,
                brandList: [],
                brandPage: {
                    total: 10,
                    current: 1
                }
            },
            asset: {
                assetShow: false,
                keyword: "",
                assetList: [],
                assetId: "",
                departmentId: "", //科室ID
                assetPage: {
                    total: 10,
                    current: 1
                }
            },
            MeaType: [
                {
                    TypeName: "强检",
                    id: 0
                },
                {
                    TypeName: "非强检",
                    id: 1
                }
            ],
            countryList: [], //国家分类
            countryData: null,
            countryName: "",
            countryShow: false,
            countryLoading: false,
            department: {
                departmentName: "",
                departmentPop: false
            }, //安装科室
            installSection: {
                name: "",
                pop: false
            },
            useList: [], //使用人和责任人列表
            userName: "",
            responsibleName: "",
            contract: {
                //合同弹窗
                contractShow: false,
                contractName: "",
                index: 0,
                contractType: [
                    "全部合同",
                    "维保合同",
                    "采购合同",
                    "维修合同",
                    "其它"
                ],
                page: {
                    current: 1,
                    total: 10
                },
                contractList: [],
                keyword: ""
            },
            labelList: [],
            SNdisabled: false, //SN置灰
            SNLoading: false,
            formValidate: {
                hosId: this.$store.state.user_in.osId,
                assertName: "",
                assetBrandId: "",
                registration: "", //设备注册证号
                assertTypeId: "", //国家分类ID
                departmentId: "", //安装科室
                collarTime: "", //安装时间
                // hospitalId: "", //院内ID
                userId: "",
                userName: "",
                responsibleId: "", //责任人ID
                responsibleName: "",
                assetSN: "",
                assetClass: "",
                assetWarrntyDate: "", //过保日期
                labelIds: [],
                purchaseMount: "0", //原值
                mtType: null,
                lastTime: null, //上次计量时间
                cycle: null, //计量周期
                depreciationAgeLimit: 5, //折旧年限
                depreciationType: 1, //折旧类型
                speedDepreciationRate: "", //加速折旧系数
                contractId: "", //合同id
                photos: [],
                breatheType: 1,
                installSection: "", //安装地点id
                id: undefined
            },
            ruleValidate: {
                assetSN: [
                    {
                        required: true,
                        message: "序列号为必填项",
                        trigger: ""
                    }
                ],
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
            }
        };
    },
    created() {
        this.getAseetList();
        this.getbrand();
        // this.getOSTree();
        this.getContract();
        this.getLabel();
        this.newGetcountry();
    },
    mounted() {
        document.addEventListener("keydown", this.handleKeydown);
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this.handleKeydown);
    },
    methods: {
        handleKeydown(e) {
            if (
                this.ListShow &&
                this.checkListData.length > 0 &&
                this.formValidate.assertName !== ""
            ) {
                const keyCode = e.keyCode;
                // next
                if (keyCode === 40) {
                    e.preventDefault();
                    this.navigateOptions("next");
                }
                // prev
                if (keyCode === 38) {
                    e.preventDefault();
                    this.navigateOptions("prev");
                }
                // enter
                if (keyCode === 13) {
                    e.preventDefault();
                    if (this.focusIndex >= 0) {
                        this.checkList(
                            this.checkListData[this.focusIndex],
                            this.focusIndex
                        );
                        this.ListShow = false;
                    }
                }
            }
        },
        navigateOptions(direction) {
            if (direction === "next") {
                let next = this.focusIndex + 1;
                this.focusIndex =
                    this.focusIndex === this.checkListData.length - 1
                        ? 0
                        : next;
            } else if (direction === "prev") {
                let prev = this.focusIndex - 1;
                this.focusIndex =
                    this.focusIndex <= 0 ? this.checkListData.length - 1 : prev;
            }
            this.resetScrollTop();
        },
        resetScrollTop() {
            const index = this.focusIndex;
            if (!this.checkListData.length) return;
            let bottomOverflowDistance =
                this.$refs[`asset-li-${index}`][0].getBoundingClientRect()
                    .bottom -
                this.$refs["asset-ul"].getBoundingClientRect().bottom;
            let topOverflowDistance =
                this.$refs[`asset-li-${index}`][0].getBoundingClientRect().top -
                this.$refs["asset-ul"].getBoundingClientRect().top;

            if (bottomOverflowDistance > 0) {
                this.$refs["asset-ul"].scrollTop += bottomOverflowDistance;
            }
            if (topOverflowDistance < 0) {
                this.$refs["asset-ul"].scrollTop += topOverflowDistance;
            }
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
        AddNewAsset() {
            this.addDisabled = false;
            this.$refs["formValidate"].resetFields();
        },
        addName() {},
        //获取资产列表
        getAseetList() {
            this.$axios
                .post(`assets/${this.$store.state.user_in.osId}/list`, {
                    limit: 10,
                    offset: (this.asset.assetPage.current - 1) * 10,
                    params: {
                        departmentId: this.asset.departmentId,
                        keyword: this.asset.keyword,
                        accStatus: "0"
                    }
                })
                .then(res => {
                    this.asset.assetList = res.data.data;
                    this.asset.assetPage.total = res.data.recordsTotal;
                });
        },
        getAsset(id) {
            this.$axios.get(`/assets/getAssetAcceptance/${id}`).then(res => {
                this.$refs["formValidate"].resetFields();
                let temp = res.data;
                console.log(temp);
                this.ruleValidate = {};
                temp["assertName"] = res.data.assetName;
                // this.hospital.hospitalName = res.data.hostypeName;
                this.brand.brandKey = res.data.brandName;
                this.$nextTick(() => {
                    this.countryName = res.data.typeName;
                });
                this.department.departmentName = res.data.osName;
                this.userName = res.data.userName;
                this.responsibleName = res.data.responsibleName;
                this.contract.contractName = res.data.contractName;
                temp["lastTime"] = res.data.startTime;
                temp["depreciationType"] = 1;
                temp["labelIds"] = res.data.labels.map(v => v.labelId);
                temp["photos"] =
                    res.data.photos instanceof Array && res.data.photos;
                this.installSection.name = res.data.installSectionName;
                this.formValidate = temp;
                this.addDisabled = true;
                this.asset.assetShow = false;
                this.Nasset["NassetId"] = res.data.assetId;
                this.Nasset["sectionName"] = res.data.osName;
                this.Nasset["collarTime"] = res.data.collarTime;
                this.formValidate.mtType = temp.mtType;
                this.formValidate.cycle = temp.cycle;

                //显示呼吸机类
                if (
                    res.data.breatheType === 2 ||
                    res.data.breatheType === 3 ||
                    res.data.breatheType === 4
                ) {
                    this.long = 6;
                    this.formValidate.breatheType = res.data.breatheType;
                } else {
                    this.long = 12;
                    this.formValidate.breatheType = 1;
                }
            });
        },
        clickAssetTree(node) {
            if (node instanceof Array) {
                if (node.length > 0) {
                    this.asset.departmentId = node[0].id;
                    this.getAseetList();
                }
            }
        },
        //获取品牌
        getbrand() {
            this.$axios
                .post(
                    `/assertBrandcopys/${this.$store.state.user_in.osId}/list`,
                    {
                        limit: 10,
                        offset: (this.brand.brandPage.current - 1) * 10,
                        params: {
                            keyword: this.brand.brandKey
                        }
                    }
                )
                .then(res => {
                    this.brand.brandList = res.data.data;
                    this.brand.brandPage.total = res.data.recordsTotal;
                });
        },
        //点击品牌
        clickBrand(item) {
            this.brand.brandKey = item.brandName;
            this.formValidate.assetBrandId = item.brandId; //id=>brandId
            this.brand.brandShow = false;
        },
        //隐藏品牌tab
        hideTable(e) {
            let temp = e.composedPath().findIndex(el => {
                if (el.classList) {
                    return (
                        el.classList.contains("brand-Input") ||
                        el.classList.contains("band-div")
                    );
                }
            });
            if (temp === -1) {
                this.brand.brandShow = false;
            }
        },

        newGetcountry() {
            this.$axios
                .get(`/assetTypes/typeAllTree`)
                .then(res => {
                    this.countryList = this.countryTypeTreeFormat(res.data);
                })
                .finally(res => {
                    this.countryLoading = false;
                });
        },
        countryTypeTreeFormat(list, children = "lists") {
            if (list instanceof Array) {
                return list.map(v => {
                    let label = `${v.typeCode ? "[" + v.typeCode + "]" : ""}${
                        v.typeName
                    }`;
                    if (v[children] && v[children].length > 0) {
                        return {
                            ...v,
                            label,
                            lists: null,
                            children: this.countryTypeTreeFormat(v.lists)
                        };
                    } else {
                        return {
                            ...v,
                            label
                        };
                    }
                });
            } else {
                throw new Error("Form parameter expect Array!");
            }
        },
        //点击国家分类树
        clickAssertTypeTree(data, node) {
            console.log(data);
            console.log(node);
            data.state === 2 ? (this.long = 6) : (this.long = 12),
                (this.formValidate.breatheType = 1); //是否为呼吸机
            this.formValidate.mtType = data.type;
        },
        setExpand(node) {
            if (!node.isLeaf) {
                node.childNodes[0].expanded = true;
                this.setExpand(node.childNodes[0]);
            }
        },

        collar(e) {
            this.formValidate.collarTime = e;
            if (
                this.formValidate.assetWarrntyDate == "" ||
                this.formValidate.assetWarrntyDate == null
            ) {
                let temp = e.split("-");
                temp[0] = temp[0] - 0 + 1;
                temp = temp.join("-");
                this.$set(this.formValidate, "assetWarrntyDate", temp);
                this.$refs["formValidate"].validateField("assetWarrntyDate");
            }
        },
        //获取SN
        ClickgetSN() {
            console.log(123231);
            this.SNLoading = true;
            this.$axios
                .get(`assets/getSN`)
                .then(res => {
                    this.formValidate.assetSN = res.data.sn;
                    this.formValidate.id = res.data.assetId;
                    this.SNdisabled = true;
                })
                .finally(res => {
                    this.SNLoading = false;
                });
        },
        //科室点击
        clickSection(e, judge = 0) {
            if (e.length > 0) {
                if (e[0].osParentid !== "-1") {
                    if (judge) {
                        this.department.departmentName = e[0].osName;
                        this.formValidate.departmentId = e[0].id;
                        this.department.departmentPop = false;
                        this.getAssetUser(this.formValidate.departmentId);
                        // this.getUse();
                        if (
                            this.formValidate.installSection === "" ||
                            this.formValidate.installSection === null
                        ) {
                            this.installSection.name = e[0].osName;
                            this.formValidate.installSection = e[0].id;
                        }
                    } else {
                        this.installSection.name = e[0].osName;
                        this.formValidate.installSection = e[0].id;
                        this.installSection.pop = false;
                    }
                } else {
                    this.$set(e[0], "expand", !e[0].expand);
                }
            }
        },
        //通过科室获取使用人和负责人
        SectiongetUseID(sectionId) {
            this.$axios
                .get(`/users/${sectionId}/getAssetUser`)
                .then(({ data: { assetResponsible, assetUser } }) => {
                    if (assetResponsible)
                        this.formValidate.responsibleId = assetResponsible.id;
                    if (assetUser) this.formValidate.userId = assetUser.id;
                });
        },

        getAssetUser(sectionId) {
            //获得管理人和负责人
            return this.$axios
                .get(`/orgstruct/${sectionId}/getOrgstructResponsible`)
                .then(res => {
                    if (!res.data) {
                        this.formValidate.responsibleId = "";
                        this.responsibleName = "";
                        this.formValidate.userId = "";
                        this.userName = "";
                        this.validateDepartmentPersons();
                        return;
                    }
                    const {
                        responsible,
                        responsibleName,
                        user,
                        userName
                    } = res.data;
                    if (responsible && responsibleName) {
                        // this.formValidate.responsibleName=assetResponsible.name;
                        this.formValidate.responsibleId = responsible || "";
                        this.responsibleName = responsibleName || "";
                    }
                    if (user && userName) {
                        this.userName = userName || "";
                        this.formValidate.userId = user || "";
                    }
                    this.validateDepartmentPersons();
                });
        },
        validateDepartmentPersons() {
            this.$nextTick(() => {
                this.$refs["formValidate"].validateField("responsibleId");
                this.$refs["formValidate"].validateField("userId");
            });
        },

        //获取标签
        getLabel() {
            this.$axios.post(`labels/list/1`).then(res => {
                this.labelList = res.data;
            });
        },
        //获取合同
        getContract() {
            let tempId = this.formValidate.contractId;
            this.formValidate.contractId = "";
            this.$axios
                .post(`contracts/${this.$store.state.user_in.osId}/list`, {
                    limit: 10,
                    offset: (this.contract.page.current - 1) * 10,
                    params: {
                        contractType: this.contract.index,
                        contractStatus: "0",
                        keyword: this.contract.keyword
                    }
                })
                .then(({ data }) => {
                    let temp = data.data.map(e => {
                        if (e instanceof Object && e !== null) {
                            e["show"] = false;
                            return e;
                        }
                    });
                    this.contract.contractList = temp;
                    this.contract.page.total = data.recordsTotal;
                    this.$nextTick(() => {
                        this.formValidate.contractId = tempId;
                    });
                });
        },
        //点击合同
        ContractTr(node) {
            this.contract.contractShow = false;
            this.contract.contractName = node.contractName;
            if (node.id === this.formValidate.contractId) {
                this.formValidate.contractId = null;
                this.contract.contractName = "";
            } else {
                this.formValidate.contractId = node.id;
            }
        },
        //查询存在的列表
        selectList(e) {
            this.focusIndex = 0;
            this.$axios
                .post(`/assets/getOtherByAssetName`, {
                    limit: this.checkListPage.pageSize,
                    offset:
                        (this.checkListPage.current - 1) *
                        this.checkListPage.pageSize,
                    params: {
                        name: this.formValidate.assertName
                    }
                })
                .then(({ data }) => {
                    this.checkListData = data.data;
                    this.checkListPage.total = data.recordsTotal;
                    this.ListShow = true;
                });
        },
        InputselectList() {
            this.ListShow = true;
            this.checkListPage.current = 1;
            this.selectList();
        },
        //点击已添加的设备
        checkList(item = {}, i) {
            this.clickIndex = i;
            this.focusIndex = -1;
            this.$axios
                .post(`/assets/getOtherByAssetId?id=${item.id}`)
                .then(({ data }) => {
                    const {
                        assetName,
                        brandName,
                        assetBrandId,
                        assertTypeId,
                        hosTypeId,
                        assetClass,
                        breathe_type,
                        hosId,
                        depreciationAgeLimit,
                        labels
                    } = data;
                    this.formValidate.assertName = assetName;
                    this.brand.brandKey = brandName;
                    this.formValidate.assetBrandId = assetBrandId;

                    if (hosId !== this.$store.state.user_in.osId) {
                        return;
                    }

                    if (depreciationAgeLimit) {
                        this.formValidate.depreciationAgeLimit = depreciationAgeLimit;
                    }
                    if (labels.length) {
                        this.formValidate.labelIds = labels.map(v => v.labelId);
                    }
                    let node = this.findNode(
                        hosTypeId,
                        this.hospital.hospitalTree
                    );
                    if (node) {
                        this.hospital.hospitalName = node.title;
                        this.formValidate.hospitalId = node.id;
                        // this.countryName=assetName;
                        this.formValidate.assetClass = assetClass;
                        this.formValidate.breatheType = breathe_type;
                        this.getcountry().then(res => {
                            let typeNode = this.$store.state.findNode(
                                this.countryList,
                                nodeData => {
                                    return nodeData.id === assertTypeId;
                                }
                            );
                            if (typeNode) {
                                this.$nextTick(() => {
                                    this.formValidate.assertTypeId =
                                        typeNode.id;
                                    this.countryName = typeNode.typeName;
                                });
                            }
                        });
                        if (node.state === 2) {
                            this.formValidate.breatheType = 2;
                            this.long = 6;
                        } else {
                            this.formValidate.breatheType = 1;
                            this.long = 12;
                        }
                    } else {
                        this.hospital.hospitalName = "";
                        this.formValidate.hospitalId = "";
                        this.formValidate.assertTypeId = "";
                        this.countryName = "";
                        this.formValidate.breatheType = 1;
                        this.long = 12;
                    }
                    // this.hospital.hospitalName=node?'':node.
                })
                .finally(data => {
                    this.ListShow = false;
                });
        },
        //树结构中找（确保唯一的）节点
        findNode(id, data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    return data[i];
                }
                if (data[i].children && data[i].children.length > 0) {
                    let final = this.findNode(id, data[i].children);
                    if (final) {
                        return final;
                    }
                }
            }
            return null;
        },
        next(callback) {
            if (this.addDisabled) {
                if (this.assertTypeId === "") {
                    this.$Message.warning("请先选择资产");
                    return;
                }
                if (this.intercept) {
                    this.$Message.warning("数据正在提交，请稍后再点击");
                    return;
                }
                this.loading.show = true;
                this.$axios
                    .post(`/assetacceptance/save?type=2`, {
                        id: this.Nasset["NassetId"]
                    })
                    .then(res => {
                        callback();
                    })
                    .finally(() => {
                        this.intercept = false;
                        this.loading.show = true;
                    });
                return;
            }
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
                    this.$refs["formValidate"].validate((valid, b) => {
                        if (valid) {
                            let temp = res.map(v => v.data);
                            let userName;
                            let responsibleName;
                            if (this.useList instanceof Array) {
                                this.useList.forEach(v => {
                                    if (v instanceof Object && v !== null) {
                                        if (v.id === this.formValidate.userId) {
                                            userName = v.name;
                                        }
                                        if (
                                            v.id ===
                                            this.formValidate.responsibleId
                                        ) {
                                            responsibleName = v.name;
                                        }
                                    }
                                });
                            }

                            if (this.intercept) {
                                this.$Message.warning(
                                    "数据正在提交，请稍后再点击"
                                );
                                return;
                            }
                            this.loading.show = true;
                            this.$axios
                                .post(`/assetacceptance/save?type=1`, {
                                    ...this.formValidate,
                                    photos: temp,
                                    userName: userName,
                                    responsibleName: responsibleName,
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
    },
    watch: {
        "brand.brandKey"() {
            this.brand.brandPage.current = 1;
            this.getbrand();
        },
        "asset.keyword"() {
            this.asset.assetPage.current = 1;
            this.getAseetList();
        },
        "contract.keyword"() {
            this.contract.page.current = 1;
            this.getContract();
        },
        "formValidate.assertTypeId"(value) {
            if (!value) {
                this.countryName = "";
                this.countryList = [];
                return;
            }
            if (this.countryList instanceof Array) {
                let temp = this.$store.state.findNode(
                    this.countryList,
                    nodeData => {
                        return nodeData.id === value;
                    }
                );

                if (temp !== null) {
                    this.formValidate.mtType = temp.type;
                } else {
                    this.formValidate.mtType = null;
                }
            } else {
                this.formValidate.mtType = 1;
                this.TypeDisabled = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import url("./on-step");
/deep/.step1-wrap {
    .ivu-select-single .ivu-select-input {
        height: 100%;
    }
}

/deep/.acc-input-disabled {
    .ivu-input:disabled {
        background: #fff !important;
    }
}
.on-step-radio {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
}
.on-step-td {
    position: relative;
}
/deep/.on-step-search {
    .ivu-input-icon {
        font-size: 20px;
    }
}
.check-asset-list {
    position: absolute;
    top: 100%;
    opacity: 1;
    background: #fff;
    width: 100%;
    z-index: 5;
    border: 1px solid #e2e2e2;
    > ul {
        max-height: 320px;
        overflow: auto;
        li:not(.click-li) {
            &:hover {
                background: #f3f3f3;
            }
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
.assetSNClass {
    display: flex;
    .kld-btn {
        margin-left: 10px;
    }
}
</style>
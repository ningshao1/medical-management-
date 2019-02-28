<template>
    <div class="conttract">
        <div class="content" @click="boxShow1=false">
            <div class="nav-title">
                <div class="nav-line"></div>
                <ul>
                    <li style="cursor:pointer">
                        <router-link to="/index/home" style=" color: #999 ">首页</router-link>

                    </li>
                    <li style="cursor:pointer">
                        <span>></span>

                        预置工作
                    </li>
                    <li style="cursor:pointer">
                        <span>></span>
                        <router-link to="/index/contract/chiefs" style=" color: #999 ">合同管理</router-link>
                    </li>
                    <li>
                        <span>></span>
                        新增合同
                    </li>
                </ul>
            </div>
            <div class="nav-sub">
                <h2><img src='./image/add_contract.svg' style="vertical-align: middle;width:20px;margin-right:5px;" />新增合同</h2>
            </div>
            <div class="line"></div>
            <div class="main-contract">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                    <div class="contract-list">

                        <ul>
                            <li>
                                <p>合同编号：
                                    <span>*</span>
                                </p>
                                <!-- <Input type="text" placeholder="请输入合同编号" v-model="contractCode"  ></Input> -->
                                <FormItem prop="contractCode">
                                    <Input v-model="formValidate.contractCode" placeholder="请输入合同编号"></Input>
                                </FormItem>
                            </li>
                            <li>
                                <p>合同名称：
                                    <span>*</span>
                                </p>
                                <FormItem prop="name">
                                    <Input v-model="formValidate.name" placeholder="请输入合同名称 "></Input>
                                </FormItem>
                            </li>
                            <li>
                                <p>签订日期：
                                    <span>*</span>
                                </p>
                                <FormItem prop="signDate">
                                    <DatePicker :editable="false" placeholder="请选择签订日期" style="width: 100%" format="yyyy-MM-dd" @on-change="formValidate.signDate = $event" :value="formValidate.signDate"></DatePicker>
                                </FormItem>
                            </li>
                            <li>
                                <p style="">合同类型：
                                    <span>*</span>
                                </p>
                                <FormItem prop="contractType">
                                    <Select v-model="formValidate.contractType" style="width:100%;" placeholder="请选择合同类型" id="bdColor1">
                                        <Option v-for="item in cityLista" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </li>
                            <li>
                                <p>供应商名称：
                                    <span>*</span>
                                </p>
                                 <FormItem prop="version">
                                    <Input readonly type="text" placeholder="请选择供应商" style="width:80%" @click.native="showsupplier=true" v-model="formValidate.version"></Input>
                                    <Button style="width:18%" class="kld-btn" icon="plus" @click="jumpaddSupplier">新增供应商</Button>
                                 </FormItem>

                            </li>
                            <li>
                                <p>联系人：

                                </p>
                                <Input type="text" placeholder="该供应商联系人" disabled v-model="supplierContactName"></Input>
                            </li>
                            <li>
                                <p>联系方式：
                                </p>
                                <Input type="text" placeholder="该供应商联系方式" disabled v-model="supplierPhone"></Input>
                            </li>
                            <li>
                                <p>采购金额（元）：
                                </p>
                                <kld-input-number :precision="2" :min="0" v-model="purchaseAmount" placeholder="请输入采购金额" @on-blur="mount"></kld-input-number>
                            </li>
                            <!-- <li>
                                <p>厂家名称：
                                </p>
                                <Input type="text" placeholder="请输入厂家名称" v-model="manufactorName" @click.native="manufactor=true"></Input>
                            </li>
                            <li>
                                <p>厂家联系方式：
                                </p>
                                <Input type="number" placeholder="请输入厂家联系方式" disabled  v-model="manufactorPhone"> </Input>
                            </li> -->
                            <li style="width: 100%">
                                <p>添加标签：
                                    <i>（每台设备最多添加5个标签）</i>
                                </p>
                                <div class="lable-content">
                                    <input type="text" style=" cursor: pointer;" @click.stop="boxShow=true;boxShow1=true" class="labebtn" v-model="addinfo">
                                    <div class="lable-list">
                                        <div class="asset-lable" v-for="(item,index) in btnlist" :key="index" v-show='item.labelName!==""&&item.labelName!==null'>{{item.labelName}}
                                            <span><img src="./image/close.png" alt="" @click="hidebtn(index)"></span>
                                        </div>
                                    </div>
                                    <img src="./image/down.png" alt="" class="lable-down">
                                </div>
                                <div class="label-box" v-show="boxShow1" style=" display:flex;flex-wrap: wrap;">
                                    <div class="box-label" v-for="(item,index) in btninfo" @click="addbtns(index)" :key="index">{{item.labelName}}</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="stages">
                        <p>分期付款选项：
                            <span>（如合同存在分期请勾选，并填写采购金额）</span>
                        </p>
                        <div class="stages-info">
                            <Checkbox v-model="single">分期付款</Checkbox>
                            <div class="stages-mun">
                                <span>分</span>
                                <kld-input-number :precision="0" :min="1" style="width: 100px;" placeholder="分期数" :disabled='stages'  v-model="stagesnum" @on-keyup="fen"></kld-input-number>
                                <!--<input type="number"  onmousewheel="return false;">-->
                                <span>期</span>
                            </div>
                        </div>
                        <div class="details" v-show="single">

                            <p>分期详情：</p>
                            <table class="table-stripe" width="100%" border="1" style="border-collapse:collapse;">
                                <tr>
                                    <th>序号</th>
                                    <th>期数</th>
                                    <th>付款日期</th>
                                    <th>付款金额</th>
                                    <th>付款状态</th>
                                </tr>
                                <tr v-for="(item,index) in stagesNum" :key="index">
                                    <td>{{item.periods}}</td>
                                    <td>第{{item.periods}}期</td>
                                    <td>
                                        <DatePicker :editable="false" placeholder="请选择付款日期" :value="item.paymentDate" @on-change="item.paymentDate = $event"></DatePicker>
                                    </td>
                                    <td>
                                        <!--<InputNumber :max="10" :min="0" v-model="item.paymentAmount"  class="stage-money kld-input-number"></InputNumber>-->
                                        <kld-input-number :min="0" v-model="item.paymentAmount" :precision="2" @on-blur="validateStagesMoney"></kld-input-number>
                                        <!--<Input  type="number"  onmousewheel="return false;"></Input>-->
                                    </td>
                                    <td>
                                        <div @click="activ(index)" style="display:inline-block" v-model="item.paymentStatus">
                                            <Button v-if="item.paymentStatus==0">未支付</Button>
                                            <span v-else style="cursor: pointer;">
                                                <img src="./image/complete.png" alt=""> 已支付
                                            </span>
                                        </div>
                                    </td>
                                </tr>

                            </table>
                        </div>

                        <div class="contract-up">
                            <span class='bx-title'> 合同图片：</span>
                            <span style="color:#999">(拖拽图片到该区域，完成上传；或点击)</span>
                        </div>
                        
                        <CUpload :maxSize="'infinity'" :maxCount="'infinity'" :fileList="resPhoto"></CUpload>

                        <div style="font-size:14px;line-height:30px;">
                            <span style="color:#f2740c;">* </span>支持上传单张3M以内的图片</div>
                        </div>
                    <p style="font-size: 16px;color: #f2740c;padding-top: 20px;">合同所含设备</p>
                    <div class="line"></div>
                    <p style="font-size: 16px;color: #f2740c;padding-top: 20px;">设备信息</p>
                    <div class="line"></div>
                    <div class="device-name">
                        <ul v-for="(item,index) in assets" :key="index" style="margin-bottom:10px">
                            <li style="width:29%">
                                <p>设备名称：</p>
                                <!--<Input type="text" placeholder="请输入设备名称" v-model="item.assetName" @click.native="t_choose" :disabled="statyus"></Input>-->
                                <Input readonly type="text" placeholder="请输入设备名称" v-model="item.assetName" @click.native="t_choose"></Input>
                            </li>
                            <li style="width:29%">
                                <p>设备型号:</p>
                                <Input type="text" placeholder="请输入设备型号" v-model="item.assetClass" disabled></Input>
                            </li>
                            <li style="width:29%">
                                <p>设备品牌:</p>
                                <Input type="text" placeholder="请输入设备品牌" v-model="item.brandName" disabled></Input>
                            </li>
                            <li style="width:10%">
                                <p>过保日期：
                                    <span style="color:#f2740c;">* </span>
                                </p>
                                <DatePicker :editable="false" placeholder="请选择过保日期" style="width: 100%" v-model="item.assetWarrntyDate" format="yyyy-MM-dd"></DatePicker>
                            </li>
                            <li>
                                <div style="margin-top:50px"></div>
                                <a href="javascript:" @click="editinfo(index)">删除</a>
                            </li>
                        </ul>
                    </div>
                    <div class="add">
                        <p @click="addadddevice">+添加</p>
                    </div>
                    <p style="font-size: 16px;color: #f2740c;padding-top: 20px;">备件信息</p>
                    <div class="line"></div>
                    <div class="device-name">
                        <ul v-for="(item,index) in spare" :key="index" style="margin-bottom:10px">
                            <li style="width:29%">
                                <p>备件名称：</p>
                                <Input type="text" :disabled="spareAllowInput" placeholder="请输入备件名称" v-model="item.sparePartName"></Input>
                            </li>
                            <li style="width:29%">
                                <p>备件型号：<span style="color:#f2740c;">* </span></p>
                                <Input type="text" :disabled="! item.sparePartName" placeholder="请输入备件型号" v-model="item.sparePartModel"></Input>
                            </li>
                            <li style="width:29%">
                                <p>所属设备：
                                    <span style="color:#f2740c;">* </span>
                                </p>
                                
                                <Select v-model="item.assetId" :disabled="! item.sparePartName">
                                    <Option v-for="assetsItem in assets" :value="assetsItem.id" :key="assetsItem.id">{{ assetsItem.assetName }}</Option>
                                </Select>
                                <!-- </FormItem> -->
                            </li>
                            <li style="width:10%">
                                <p>设备数量
                                    <span style="color:#f2740c;">*</span>
                                </p>
                                <FormItem prop="sparenum">
                                    <InputNumber :min="1" v-model="item.sparePartNum" :disabled="! item.sparePartName"></InputNumber>
                                </FormItem>
                            </li>
                            <li>
                                <div style="margin-top:50px"></div>
                                <a href="javascript:" @click="editinfos(index)">删除</a>
                            </li>
                        </ul>

                    </div>
                    <div class="add">
                        <p @click="addspare">+添加</p>
                    </div>
                </Form>
                <div class="asset-footer" style="background:#fafafa;">
                    <div class="retrieval-btn">
                        <Button class="kld-btn-default" @click="del_info2.modal2=true">取消</Button>
                        <Button :loading="submitLoading" class="btn-active" @click="handleSubmit('formValidate')">确定</Button>
                    </div>
                </div>
            </div>
            <div style="padding-bottom:50px"></div>
            <div class="copy">
                Copyright ? 2018.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>

        <!-- 选择设备 -->
        <Modal v-model="showcontract" width="800" title="选择设备" @on-ok="oks" class="tab">
            <Row style="margin-bottom: 12px;">
                <i-col span="12">
                    <i-input v-model="assetKeyWord" placeholder="请输入关键字搜索" class="kld-input"></i-input>
                </i-col>
            </Row>
            <Table class='i-table-stripe' border :columns="column" :data="contractinfos" @on-select="check" ref="selection" @on-select-cancel="nochecks" @on-select-all="allcheck"></Table>

            <div class="page">
                <Page :total="pages" @on-change="getasset" v-show="pages>10"></Page>
            </div>
        </Modal>

        <Modal v-model="showsupplier" width="800" title="选择供应商" @on-visible-change="selectSupplierVisibleChange">
            <div class="nav-search">
                <Input icon="ios-search" placeholder="搜索供应商信息" @on-keydown.13="searchlist" v-model="keyword" v-show="limit.findIndex(e=>{return e.plPermission=='sup:query'})!=-1" @on-click="searchlist"></Input>
            </div>
            <div style="clear:both"></div>
            <Table class='i-table-stripe' border :columns="columnts" :data="supplierlist" @on-row-click="checks"></Table>
            <div slot="footer"></div>
            <div class="page">
                <Page :total="pagets" @on-change="supplierinfo" v-show="pagets>10"></Page>
            </div>

        </Modal>
        <!-- 设备名称删除弹窗 -->
        <promt :msginfo='del_info' @pro_ok="del"></promt>
        <promt :msginfo='del_info1' @pro_ok="dels"></promt>
        <promt :msginfo='del_info2' @pro_ok="ok"></promt>
        <promt :msginfo='del_info3' @pro_ok="delimg"></promt>
    </div>
</template>

<script>
import CUpload from '@common/C-Upload/C-upload';
import {uploadImg} from '@common/C-Upload/uploadImgAPI.js';
import promt from "../../common/prompt/prompt";
import kldInputNumber from '@common/kld-input-number';

export default {
    name: 'add-contract',
    data() {
        return {
            submitLoading: false,
            supplierId: "", //供应商id
            defaultList: [],
            indimg: "",
            eimg: "",
            keyword: "",
            styuss: false,
            listst: [],
            del_info2: {
                title: "提示",
                okText: "确认",
                name: "是否要退出当前新增页面",
                modal2: false
            },
            del_info3: {
                title: "提示",
                okText: "确认",
                name: "是否要删除当前图片",
                modal2: false
            },
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要是删除当前行数据",
                modal2: false
            },
            del_info1: {
                title: "提示",
                okText: "确认",
                name: "是否要是删除当前行数据",
                modal2: false
            },
            index: "",
            indexs: "",
            status: false,
            statyus: false,
            resPhoto: [],
            showsupplier: false,
            pagets: 0,
            supplierlist: [],
            limit: JSON.parse(localStorage.getItem("limit")),
            supplierinfos: JSON.parse(sessionStorage.getItem("suuplierinfo")),
            infos: [], //合同选择设备的信息
            model4: "",
            contract: [],
            cityLista: [
                {
                    value: 2,
                    label: "采购合同"
                },
                {
                    value: 3,
                    label: "维修合同"
                },
                {
                    value: 1,
                    label: "维保合同"
                },
                {
                    value: 4,
                    label: "其他"
                }
            ],
            pages: 0,
            columnts: [
                {
                    title: "供应商信息",
                    key: "supplierName"
                },
                {
                    title: "联系人",
                    key: "supplierContactName"
                },
                {
                    title: "联系方式",
                    key: "supplierPhone"
                }
            ],
            column: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "设备名称",
                    key: "assetName"
                },
                {
                    title: "设备信息",
                    key: "assetClass"
                },
                {
                    title: "品牌",
                    key: "brandName"
                },
                {
                    title: "所属科室",
                    key: "osName"
                },
                {
                    title: "过保时间",
                    key: "assetWarrntyDate"
                }
            ],
            assetlist: [],
            showcontract: false,
            contractinfos: [], //点击弹出的设备列表内容
            datas: "",
            time1: "",
            boxShow1: false,
            addinfo: "",
            btnid: [],
            btninfo: [],
            btnlist: [],
            time: "",
            back: false,

            purchaseAmount: "",
            supplierContact: "",
            supplierContactor: "",
            contractCode: "",
            boxShow: false,
            single: false,
            next_: false,
            stagesnum: 3,

            stagesNum: [
                {
                    periods: 1,
                    paymentAmount: 0,
                    paymentDate: "",
                    paymentStatus: 0
                },
                {
                    periods: 2,
                    paymentAmount: 0,
                    paymentDate: "",
                    paymentStatus: 0
                },
                {
                    periods: 3,
                    paymentAmount: 0,
                    paymentDate: "",
                    paymentStatus: 0
                }
            ],
            assets: [
                {
                    assetName: "",
                    assetClass: "",
                    assertBrand: "",
                    assetWarrntyDate: "",
                    brandName: "",
                    id:''
                }
            ],
            spare: [
                {
                    sparePartModel: "",
                    sparePartName: "",
                    sparePartNum: null,
                    assetId: ''
                }
            ],
            formValidate: {
                name: "",
                data: "",
                version: null,
                assetId: "",
                datas: "",
                signDate: '',
                contractCode: "",
                contractType: '',
            },

            model1: "",
            active: false,
            ruleValidate: {
                contractCode: [
                    {
                        required: true,
                        message: "合同编号为必填字段",
                        trigger: "blur"
                    },
                    {
                        max: 20,
                        message: '合同编号长度不能超过20'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "合同名称为必填字段",
                        trigger: "blur"
                    }
                ],
                signDate: [
                    {
                        required: true,
                        message: "签订日期为必填字段",
                        trigger: "change"
                    }
                ],
                version: {
                    required: true,
                    message: "供应商名称为必填字段",
                },
                contractType: {
                    required: true,
                    message: '合同类型为必选'
                },
                // assetId: [
                //     {
                //         required: true,
                //         message: "请选择所属设备",
                //         trigger: "change"
                //     }
                // ],
                // equipmentnum: [
                //     {
                //         message: "设备数量为必填字段",
                //         trigger: "change"
                //     }
                // ],
                sparenum: [
                    {
                        message: "设备数量为必填字段",
                        trigger: "change"
                    }
                ]
                // signdata: [
                //     {
                //         required: true,
                //         type: "date",
                //         message: "过保时间为必填字段",
                //         trigger: "change"
                //     }
                // ]
            },
            info1: JSON.parse(sessionStorage.getItem("infos")),
            info2: JSON.parse(sessionStorage.getItem("infoss")),
            info3: JSON.parse(sessionStorage.getItem("infosss")),
            info4: JSON.parse(sessionStorage.getItem("infossss")),
            supplierContactName: null,
            supplierPhone: null,
            assetKeyWord: ''
        };
    },
    watch: {
        purchaseAmount() {
            if (this.stagesNum.length === 3) {
                const totalMoney = this.purchaseAmount;
                let money = 0;
                money += Number(this.stagesNum[0].paymentAmount = (totalMoney * 0.6).toFixed(2));
                money += Number(this.stagesNum[1].paymentAmount = (totalMoney * 0.3).toFixed(2));
                this.stagesNum[2].paymentAmount = (Number(totalMoney) - money).toFixed(2);
            }
        },
        assetKeyWord() {
            this.getasset();
        }
    },
    computed: {
        //是否允许填写备件信息
        spareAllowInput() {
            return this.assets.length !== 0 && !this.assets[0].id;
        },
        stages() {
            return this.single ? false : true;
        },
        imgsrc() {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            let img = `${this.upfile_}photo/${osid}/2/upload?login-token=${
                JSON.parse(localStorage.getItem("token")).token
            }`;
            return img;
        }
    },
    created() {
        this.getlabel();
        // this.getasset();
        // this.supplierinfo();//获取供应商列表的方法
        this.getasset();
    },
    mounted() {
        if (this.supplierinfos) {
            this.supplierPhone = this.supplierinfos.supplierPhone;
            this.supplierContactName = this.supplierinfos.supplierContactName;
            this.formValidate.version = this.supplierinfos.supplierName;
        } else {
            this.supplierPhone = this.supplierContactName = this.formValidate.version = null;
        }
        this.contractCode = this.info1;
        this.formValidate.name = this.info2;
        this.formValidate.datas = this.info3;
        this.model4 = this.info4;
    },
    methods: {
        mount() {
            if (this.purchaseAmount < 0) {
                this.$Message.warning("采购金额不能为负数");
                this.purchaseAmount = "";
            }
        },
        searchlist() {
            this.supplierinfo();
        },
        selectSupplierVisibleChange(visible) {
            if (visible) {
                this.supplierinfo();
            }
        },
        supplierinfo(page = 1) {
            let line = (page - 1) * 10;
            this.axios
                .post(`/supplier/list`, {
                    limit: 10,
                    offset: line,
                    params: {
                        keyword: this.keyword,
                        type:"0",
                        osId:this.$store.state.user_in.osId
                    }
                })
                .then(res => {
                    this.supplierlist = res.data.data;
                    this.pagets = res.data.recordsTotal;
                })
                .catch(error => {
                    console.log(error);
                    this.$Message.warning("获取列表信息错误");
                });
        },
        del() {
            if (this.assets.length > 1) {
                //删除的时候也把它从infos中移除
                this.infos.splice(
                    this.infos.findIndex(e => {
                        return e.id == this.assets[this.index].assetId;
                    }),
                    1
                );
                this.assets.splice(this.index, 1);
                this.contract.splice(this.index, 1);
                return;
            } else if (this.assets.length) {
                this.assets = [
                    {
                        assetName: "",
                        assetClass: "",
                        assertBrand: "",
                        assetWarrntyDate: "",
                        brandName: ""
                    }
                ];
            }
            //当assets被删完了 把 infos 清空
            this.infos = [];
        },
        editinfo(index) {
            this.index = index;
            this.del_info.modal2 = true;
        },
        dels() {
            if (this.spare.length > 1) {
                this.spare.splice(this.indexs, 1);
            } else if (this.spare.length) {
                this.spare = [
                    {
                        sparePartModel: "",
                        sparePartName: "",
                        sparePartNum: null,
                        assetId: ""
                    }
                ];
            }
        },
        editinfos(index) {
            this.indexs = index;
            this.del_info1.modal2 = true;
        },
        checks(row) {
            this.supplierPhone = row.supplierPhone;
            this.supplierContactName = row.supplierContactName;
            this.formValidate.version = row.supplierName;
            this.showsupplier = false;
            this.supplierId = row.id;
        },

        oks() {
            let temp = [];
            let cont = [];
            let obj = {};
            let p = this.infos.reduce((cur, next) => {
                obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
                return cur;
            }, []); //设置cur默认类型为数组，并且初始值为空的数组
            this.infos = p;
            let info = this.infos;
            info && (this.assets = [...info]);
			this.infos.forEach(res => {
                temp.push({
                    assetId: res.id,
                    departmentId: res.departmentId,
                    hosId: res.hosId,
                    assetWarrntyDate:
                        res.assetWarrntyDate == ""
                            ? null
                            : new Date(res.assetWarrntyDate).getFullYear() +
                              "-" +
                              (new Date(res.assetWarrntyDate).getMonth() + 1) +
                              "-" +
                              new Date(res.assetWarrntyDate).getDate()
                });
            });
            this.infos.forEach(res => {
                cont.push({
                    value: res.id + "-" + res.assetName,
                    label: res.assetName
                });
            });

            this.assetlist = temp;
            // this.$refs.selection.selectAll(status);
            this.contract = cont;
        },
        check(item, row) {
            this.infos.push(row);
        },
        nochecks(item, row) {
            this.infos.splice(
                this.infos.findIndex(e => {
                    return e.id == row.id;
                }),
                1
            );
            //this.infos = item;
        },
        allcheck(item) {
            for (var i = 0; i < 6; i++) {
                this.listst.push(item[i]);
            }
            this.infos.forEach(e => {
                this.listst.push(e);
            });
            let obj = {};
            let p = this.listst.reduce((cur, next) => {
                obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
                return cur;
            }, []); //设置cur默认类型为数组，并且初始值为空的数组
            this.infos = p;
            //this.infos = this.listst.push(...this.infos);
            //this.infos = Array.from(new Set(this.infos));
        },
        //获取设备数据
        getasset(page = 1) {
            let line = (page - 1) * 6;
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;

            this.axios
                .post(
                    `assets/${osid}/list`,

                    {
                        limit: 6,
                        offset: line,
                        params: {
                            departmentId: osid,
                            keyword: this.assetKeyWord
                        }
                    }
                )
                .then(res => {
                    let temp = [];
                    res.data.data.map(e => {
                        e["_checked"] =
                            this.infos.findIndex(el => {
                                return el.id == e.id;
                            }) !== -1
                                ? true
                                : false;
                        e["assetWarrntyDate"] == "1970-01-01"
                            ? (e["assetWarrntyDate"] = "")
                            : e["assetWarrntyDate"];

                        temp.push(e);
                    });
                    this.contractinfos = temp;
                    this.pages = res.data.recordsTotal;
                })
                .catch(error => {
                    console.log(error);
                    this.$Message.warning("获取列表信息错误");
                });
        },
        //添加标签
        addbtn() {
            this.axios
                .post(`labels`, {
                    labelName: this.addinfo.slice(0, 5),
                    labelType: 3
                })
                .then(res => {
                    this.getlabel();
                    this.addinfo = "";
                    this.boxShow = false;
                    this.boxShow1 = true;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //获取标签列表
        getlabel() {
            this.axios
                .post(`labels/list/${3}`, {})
                .then(res => {
                    this.btninfo = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        //删除图标
        hidebtn(index) {
            // let id = this.btninfo[index].id;
            // let osid = JSON.parse(localStorage.getItem("user_in")).osId;
            // this.axios
            //     .delete(`labels/${osid}/${id}`, {})
            //     .then(res => {
            //         this.getlabel();
            //         this.btnlist.splice(index, 1);
            //         this.$Message.warning("删除数据成功");
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
            this.btnlist.splice(index, 1);
        },

        //添加图标
        addbtns(index) {
            if (this.btnlist.length > 4) {
                this.$Message.warning("最多只能添加5个标签");
                return;
            } else {
                this.btnlist.push({
                    labelName: this.btninfo[index].labelName,
                    id: this.btninfo[index].id
                });
            }

            var hash = {};
            this.btnlist = this.btnlist.reduce(function(item, next) {
                hash[next.labelName]
                    ? ""
                    : (hash[next.labelName] = true && item.push(next));
                return item;
            }, []);
        },
        activ(index) {
            if (this.stagesNum[index].paymentStatus == 0) {
                this.stagesNum[index].paymentStatus = 1;
            } else if (this.stagesNum[index].paymentStatus == 1) {
                this.stagesNum[index].paymentStatus = 0;
            }
        },

        ok() {
            this.$router.go(-1);
        },


        //获取时间1
        getStartTime(date) {
            this.time = date;
        },

        //跳转新增供应商
        jumpaddSupplier() {
            sessionStorage.setItem("infos", JSON.stringify(this.contractCode));
            sessionStorage.setItem(
                "infoss",
                JSON.stringify(this.formValidate.name)
            );
            sessionStorage.setItem(
                "infosss",
                JSON.stringify(this.formValidate.datas)
            );
            sessionStorage.setItem("infossss", JSON.stringify(this.model4));
            this.$router.push("/index/supplier/addSupplier");
            //    this.supplierinfos=JSON.parse(sessionStorage.getItem("suuplierinfo"))
        },
        //新增合同
        // insurance() {
        //     const stageList = [];
        //     this.stagesNum.forEach(res => {
        //         stageList.push({
        //             periods: res.periods,
        //             paymentAmount: res.paymentAmount,
        //             paymentStatus: res.paymentStatus,
        //             paymentDate:
        //                 res.paymentDate == ""
        //                     ? ""
        //                     : new Date(res.paymentDate).getFullYear() +
        //                       "-" +
        //                       (new Date(res.paymentDate).getMonth() + 1) +
        //                       "-" +
        //                       new Date(res.paymentDate).getDate()
        //         });
        //     });
        //     return stageList;
        // },
        //验证
        handleSubmit(name) {
            let temp2 = [];
            this.infos.forEach(res => {
                temp2.push({
                    assetId: res.id,
                    departmentId: res.departmentId,
                    hosId: res.hosId,
                    assetWarrntyDate:
                        res.assetWarrntyDate == ""
                            ? ""
                            : new Date(res.assetWarrntyDate).getFullYear() +
                              "-" +
                              (new Date(res.assetWarrntyDate).getMonth() + 1) +
                              "-" +
                              new Date(res.assetWarrntyDate).getDate()
                });
            });
            this.assetlist = temp2;
            for (let i = 0; i < this.btnlist.length; i++) {
                if (this.btnlist[i].id != null) {
                    this.btnid.push(this.btnlist[i].id);
                }
            }
            let info = Array.from(new Set(this.btnid));
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;


            let dd = true;
            for (let i = 0; i < this.assets.length; i++) {
                if (
                    this.assets[i].assetId !== "" &&
                    this.assets[i].assetId !== null
                ) {
                    if (
                        this.assets[i].assetId !== "" &&
                        this.assets[i].assetId !== null
                    ) {
                        dd = true;
                    } else {
                        dd = false;
                        break;
                    }
                } else {
                    dd = true;
                }
            }
            let names = "";
            let cc = "";
            let tct = "";
            this.assets.map(function(item) {
                let status = item.assetName ? true : false;
                tct = status;
                return tct;
            });
            this.assets.map(function(item) {
                let status = item.assetWarrntyDate ? true : false;
                dd = status;
                return dd;
            });

            this.spare.map(function(item, index) {
                let status = item.assetId != "" ? true : false;
                names = status;

                return names;
            });
            this.spare.map(function(item) {
                let status = item.sparePartNum ? true : false;
                cc = status;
                return cc;
            });

            if (this.assets.length > 0) {
                for (const {id, assetWarrntyDate} of this.assets) {
                    if (id && ! assetWarrntyDate) {
                        this.$Message.warning("过保日期为必填字段");
                        return;
                    }
                }
            }


            //验证采购金额是否等于分期总金额
            if (this.single && (! this.validateStagesDate() || ! this.validateStagesMoney())) {
                return;
            }

            //验证备件信息
            if (this.spare.length !== 0) {
                for (const spareItem of this.spare) {
                    if (spareItem.sparePartName) {
                        if (! spareItem.sparePartModel) {
                            this.$Message.warning('请输入备件型号');
                            return;
                        } else if (! spareItem.assetId) {
                            this.$Message.warning('请选择所属设备');
                            return;
                        } else if (! spareItem.sparePartNum) {
                            this.$Message.warning('设备数量为必填字段');
                            return;
                        }
                    }
                }
            }
            //判断当选择设备时，过保日期是否填写
            // this.assets.map(function(item) {
            //     // let status = item.assetWarrntyDate&& ? true : false;
            //     // dd = status;
            //     // return dd;
            //     if (item.assetId !== "" && item.assetId !== null) {
            //         if (item.assetId !== "" && item.assetId !== null) {
            //             dd = true;
            //         } else {
            //             dd = false;
            //             return false;
            //         }
            //     } else {
            //         dd = true;
            //     }
            // });

            this.$refs[name].validate(valid => {
                if (valid) {
                    //筛选备件信息
                    const spareParts = [];

                    for (const spareItem of this.spare) {
                        if (spareItem.sparePartName) {
                            spareParts.push({
                                assetId: spareItem.assetId,
                                sparePartModel: spareItem.sparePartModel,
                                sparePartName: spareItem.sparePartName,
                                sparePartNum: spareItem.sparePartNum
                            });
                        }
                    }

                    this.submitLoading = true;
                    uploadImg.call(this,this.resPhoto,2).then(
                        res=>{
                            let pics=res.map(v=>v.data);

                            return this.axios.post(`/contracts/${osid}`, {
                                contractCode: this.formValidate.contractCode,
                                contractName: this.formValidate.name.trim(),
                                signDate: this.formValidate.signDate,
                                supplierName: this.formValidate.version,
                                supplierContactor: this.supplierContactName,
                                purchaseAmount: this.purchaseAmount,
                                supplierContact: this.supplierPhone,
                                pics,
                                spareParts,
                                labelIds: info,
                                assetIds: this.assetlist,
                                periodsNum: this.single ? this.stagesnum : 0,
                                paymentInstalments: this.single ? this.stagesNum : [],
                                contractType: this.formValidate.contractType,
                                supplierId: this.supplierId,
                            })
                        },
                        error=>{
                            this.$Message.error("图片上传失败，请检查您的网络")
                        }
                    ).then(res => {
                            this.$Message.info("新增数据成功");
                            this.$router.go(-1);
                        })
                        .catch(error => {
                            console.log(error);
                            if (this.spare == null) {
                                this.spare = [
                                    {
                                        sparePartModel: "",
                                        sparePartName: "",
                                        sparePartNum: null,
                                        assetId: ""
                                    }
                                ];
                            }
                        })
                        .finally(() => this.submitLoading = false);
                }
            });
        },

        //新增设备
        addadddevice() {
            //  let aaa=this.assets.length;
            // console.log(aaa);
            // if (this.assets.length > 5) {
            //     return false;
            // }
            this.assets.push({
                assetName: "",
                assetClass: "",
                assertBrand: "",
                assetWarrntyDate: "",
                brandName: ""
            });
        },
        //新增备件
        addspare() {
            this.spare.push({
                sparePartModel: "",
                sparePartName: "",
                sparePartNum: null
            });
        },

        //输入分页数
        fen() {
            this.stagesNum = [];

            for (var i = 1; i <= this.stagesnum; i++) {
                this.stagesNum.push({
                    periods: i,
                    paymentAmount: null,
                    paymentStatus: 0,
                    paymentDate: ""
                });
            }

            if (this.stagesNum.length === 3) {
                const totalMoney = this.purchaseAmount;
                let money = 0;
                money += Number(this.stagesNum[0].paymentAmount = (totalMoney * 0.6).toFixed(2));
                money += Number(this.stagesNum[1].paymentAmount = (totalMoney * 0.3).toFixed(2));
                this.stagesNum[2].paymentAmount = (Number(totalMoney) - money).toFixed(2);
            }
        },

        up_succ(e, y) {
            this.defaultList.push(y);

            if (this.resPhoto.length > 4) {
                this.defaultList.length = 5;
                this.$Message.warning("最多可以上传五张图片");
                return;
            } else {
                this.resPhoto.push(e);
                this.$Message.success("文件上传成功");
                this.next_ = true;
            }
        },
        up_error(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        up_err(e) {
            this.$Message.warning("上传的图片已大于3M");
        },
        rm_(e, index) {
            this.del_info3.modal2 = true;
            this.indimg = index;
            this.eimg = e.response;
        },
        delimg() {
            this.axios
                .delete(`/photo/delete?url=${this.eimg}`)
                .then(res => {
                    this.next_ = false;
                    this.resPhoto.splice(this.indimg, 1);
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    cosnole.log(error);
                });
        },
        //点击设备名称弹出窗口
        t_choose() {
            console.log(1);
            this.showcontract = true;
            this.statyus = true;
            let temp = [];
            //使勾选项和设备信息项相同
            this.contractinfos.map(e => {
                e["_checked"] =
                    this.infos.findIndex(el => {
                        return el.id == e.id;
                    }) !== -1;
                temp.push(e);
            });

            this.contractinfos = temp;
        },
        //当设备选择checkbox发生变化时
        // check_change(e) {
        //     if (e.length == 0) {
        //         //this.info()
        //         this.contractinfos.forEach(e => {
        //             this.infos.splice(
        //                 this.infos.findIndex(el => {
        //                     return el.id == e.id;
        //                 }),
        //                 1
        //             );
        //         });
        //     }
        // },
        //上传格式不正确
        up_error(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        validateStagesDate() {
            // let validDate = false;
            for (const {paymentDate} of this.stagesNum) {
                if (! paymentDate) {
                    this.$Message.warning('分期付款日期为必填');
                    return false;
                }
            }

            return true;
        },
        validateStagesMoney() {
            let totalMoney = 0, validMoney = false;

            for (const stage of this.stagesNum) {
                totalMoney += Number(stage.paymentAmount);
            }

            validMoney = Number(totalMoney.toFixed(2)) === Number(this.purchaseAmount);

            if (! validMoney) {
                this.$Message.warning('分期总金额必须等于采购金额');
            }

            return validMoney;
        }
    },
    components: {
        promt,
        CUpload,
        kldInputNumber
    }
};
</script>

<style scoped lang="less">
    .stage-money{
        width: 200px;
        height: 32px !important;
        line-height: 32px !important;
    }
.nav-search {
    float: right;
    margin-bottom: 10px;
    width: 300px;
}
::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
.imgs {
    width: 120px;
}
.page {
    text-align: center;
    margin-top: 20px;
}
.datastyle {
    height: 34px;
    width: 200px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
}
.money {
    height: 34px;
    width: 200px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
}
.content {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    .nav-title {
        margin-top: 14px;
        display: flex;
        .nav-line {
            height: 16px;
            width: 4px;
            background-color: #76bdc1;
            display: inline-block;
        }

        li {
            margin-left: 6px;
            display: inline-block;
            font-size: 12px;
            color: #999999;
            position: relative;
            top: -3px;
        }
        li:last-child {
            color: #333333;
        }
        li:last-child span {
            color: #76bdc1;
        }
    }
    .nav-sub {
        h2 {
            font-weight: normal;
            color: #333333;
            font-size: 16px;
            margin-top: 1px;
            line-height: 40px;
        }
    }
    .line {
        height: 1px;
        background-color: #ccd2d7;
        margin-top: 10px;
    }
    .main-contract {
        background-color: #fafafa;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 20px;
        padding: 20px 30px;
        .contract-list {
            ul {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                li {
                    width: 49%;
                    margin-bottom: 20px;
                    p {
                        font-size: 14px;
                        margin-bottom: 13px;
                        color: #000000;
                        span {
                            color: #f2740c;
                        }
                        i {
                            font-style: normal;
                            color: #999999;
                        }
                    }
                    input {
                        height: 50px;
                        width: 100%;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        padding-left: 20px;
                    }
                    input:disabled {
                        background-color: #f5f6fa;
                    }
                }
            }
        }

        .lable-content {
            position: relative;
            cursor: pointer;
            .lable-list {
                position: absolute;
                display: flex;
                top: 8px;
                left: 10px;
                .asset-lable {
                    min-width: 80px;
                    height: 36px;
                    background-color: #76bdc1;
                    border-radius: 18px;
                    border: solid 1px #0c8399;
                    margin-right: 10px;
                    padding-left: 15px;
                    font-size: 14px;
                    line-height: 36px;
                    color: #ffffff;
                    display: inline-block;
                    span {
                        width: 30px;
                        height: 30px;
                        background-color: rgba(69, 133, 137, 0.5);
                        opacity: 0.5;
                        display: inline-block;
                        border-radius: 50%;
                        text-align: center;
                        margin-left: 6px;
                        position: relative;
                        top: 2px;
                    }
                }
            }
            .lable-down {
                position: absolute;
                right: 10px;
                top: 15px;
            }
        }
        .label-box {
            padding: 8px 0;
            //height: 110px;
            background-color: #f5f6fa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            padding-left: 10px;
            display: flex;
            flex-wrap: wrap;
            .box-label {
                width: 70px;
                height: 36px;
                background-color: #76bdc1;
                border-radius: 18px;
                border: solid 1px #0c8399;
                color: #fff;
                line-height: 36px;
                margin-right: 10px;
                text-align: center;
                cursor: pointer;
            }
        }
        .stages {
            p {
                font-size: 14px;
                color: #000000;
                span {
                    color: #999999;
                }
            }
            .stages-info {
                display: flex;
                .ivu-checkbox-wrapper {
                    margin-top: 30px;
                }
                .stages-mun {
                    margin-left: 50px;
                    span {
                        display: inline-block;
                        margin-top: 30px;
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                    input {
                        width: 100px;
                        height: 50px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        padding-left: 10px;
                        &:disabled {
                            background-color: #f5f6fa;
                        }
                    }
                }
            }
        }
        .details {
            p {
                margin-top: 20px;
                margin-bottom: 14px;
            }
            table {
                border: solid 1px rgba(2, 31, 57, 0.1);
                text-align: center;
                tr {
                    height: 50px;
                    th {
                        border-right: none;
                        border-left: none;
                    }
                    td {
                        border-right: none;
                        border-left: none;
                    }
                }
            }
        }
        .contract-up {
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .device-name {
            margin-top: 20px;
            ul {
                display: flex;
                justify-content: space-between;
                li {
                    p {
                        margin-bottom: 20px;
                    }
                    input {
                        height: 50px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px rgba(2, 31, 57, 0.2);
                        width: 100%;
                        padding-left: 20px;
                    }
                    input:disabled {
                        background-color: #f5f6fa;
                    }
                }
            }
        }
        .add {
            margin-top: 20px;
            height: 50px;
            line-height: 50px;
            background-color: #f5f6fa;
            border-radius: 3px;
            text-align: center;
            p {
                color: #22a1b9;
                cursor: pointer;
            }
        }
    }
}
.img_list {
    // display: flex;
    // flex-direction:row;

    img {
        margin: 5px;
        width: auto;
        max-width: 100px;
    }
}
</style>
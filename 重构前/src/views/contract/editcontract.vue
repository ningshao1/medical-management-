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
                        编辑合同
                    </li>
                </ul>
            </div>

            <div class="nav-sub">
                <h2>编辑合同</h2>
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
                                <Input type="text" placeholder="请输入合同编号" v-model="contractCode"></Input>
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
                                <FormItem prop="datas">
                                    <DatePicker :editable="false" placeholder="请选择签订日期" style="width: 100%" format="yyyy-MM-dd" @on-change="getStartTime" v-model="formValidate.datas"></DatePicker>
                                </FormItem>

                            </li>
                            <li>
                                <p>合同类型：
                                    <span>*</span>
                                </p>
                                <!-- <input type="text"> -->
                                <Select v-model="model4" style="width:100%" placeholder="请选择合同类型">
                                    <Option v-for="item in cityLista" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </li>
                            <li>
                                <p>供应商名称：
                                    <span>*</span>
                                </p>
                                <!-- <FormItem prop="version"> -->
                                <Input readonly type="text" placeholder="请选择供应商" style="width:80%" @click.native="showsupplier=true" v-model="formValidate.version"></Input>
                                <Button style="width:18%" class="kld-btn" @click="jumpaddSupplier">新增供应商</Button>
                                <!-- </FormItem>  -->
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
                                <!-- <kld-input-number placeholder="该供应商联系方式" ></kld-input-number> -->
                            </li>
                            <li>
                                <p>采购金额（元）：
                                </p>
                                <!--<Input type="number" placeholder="请输入采购金额" v-model="purchaseAmount" disabled onmousewheel="return false;"></Input>-->
                                <kld-input-number :precision="2" :min="0" v-model="purchaseAmount" placeholder="请输入采购金额"></kld-input-number>
                            </li>

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
                            <Checkbox v-model="single" @click.native="fenqi" disabled>分期付款</Checkbox>
                            <div class="stages-mun">
                                <span>分</span>
                                <kld-input-number disabled :precision="0" :min="0"  style="width: 100px;" placeholder="分期数" v-model="stagesnum" @on-keyup="fen"></kld-input-number>
                                <!--<input type="number" placeholder="分期数" disabled v-model="stagesnum" @keyup="fen" onmousewheel="return false;">-->
                                <span>期</span>
                            </div>

                        </div>
                        <div class="details" v-show="stagesnum">
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
                                    <td>{{index+1}}</td>
                                    <td>第{{item.periods}}期</td>
                                    <td>
                                        <DatePicker :editable="false" placeholder="请选择付款日期"  v-model="item.paymentDate" format="yyyy-MM-dd"></DatePicker>
                                    </td>
                                    <td>
                                        <!--<Input type="number" v-model="item.paymentAmount" disabled onmousewheel="return false;"></Input>-->
                                        <kld-input-number :min="0" v-model="item.paymentAmount" :precision="2" @on-blur="validateStagesMoney"></kld-input-number>
                                    </td>
                                    <td>
                                        <div style="display:inline-block" v-model="item.paymentStatus">
                                            <Button v-if="item.paymentStatus==0" @click="activ(index)">未支付</Button>
                                            <span v-else style="cursor: pointer;">
                                                <img src="./image/complete.png" alt=""> 已支付
                                            </span>
                                        </div>
                                    </td>
                                </tr>

                            </table>
                        </div>

                        <!-- <div class="contract-up">
                            <span class='bx-title'> 合同图片：</span>
                        </div> -->
                        <!-- <Upload multiple type="drag" :action="imgsrc" :on-success='up_succ' :on-error='up_error' :on-remove='rm_' :max-size=3080 :on-exceeded-size="up_err">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>拖拽图片到该区域，完成上传；或点击</p>

                            </div>{{resPhotos}}
                            <img class="imgs" v-for="(item,index) in resPhotos" :key="index" :src="upfile_ +item.attachmentPath" alt="" style="margin:0 5px;" >
                            <img class="imgs" v-for="(item,index) in resPhotos" :key="index" :src="upfile_ +item.attachmentPath" alt="" style="height:70px;margin:0 5px;">
                        </Upload> -->

                        <div class="contract-up">
                            <span class='bx-title'> 合同图片：</span>
                            <span style="color:#999">(拖拽图片到该区域，完成上传；或点击)</span>
                        </div>

                        <kld-img-upload
                                @error-file-size="$Message.warning('文件大小支持3MB以内')"
                                @error-file-type="$Message.warning('文件类型仅支持jpg, png, jpeg')"
                                :accept="['image/png', 'image/jpg', 'image/jpeg']"
                                :maxSize="1024 * 1024 * 3"
                                v-model="resPhotos"
                        ></kld-img-upload>

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
                                <!-- <Input type="date" v-model="item.assetWarrntyDate" disabled></Input> -->

                                <DatePicker :editable="false" placeholder="请选择过保日期" style="width: 100%" @on-change="item.assetWarrntyDate = $event" :value="item.assetWarrntyDate" format="yyyy-MM-dd"></DatePicker>

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
                                <p>备件型号：
                                </p>
                                <Input type="text" :disabled="spareAllowInput" placeholder="请输入备件型号" v-model="item.sparePartModel"></Input>
                            </li>
                            <li style="width:29%;position:relative">
                                <p>所属设备：
                                    <span style="color:#f2740c;">* </span>
                                </p>
                                <!-- <FormItem prop="selectspare"> -->

                                <!--<p v-show="tstre" style="position: absolute; top: 53px;left:10px;z-index:300">{{item.assetName}}</p>-->
                                <!--  Select移除了 @click.native="infots" -->
                                <Select v-model="item.assetId" :disabled="! item.sparePartName">
                                    <Option v-for="assetsItem in assets" :value="assetsItem.id" :key="assetsItem.id">{{ assetsItem.assetName }}</Option>
                                </Select>
                                <!-- </FormItem> -->
                            </li>
                            <li style="width:10%">
                                <p>设备数量
                                    <span style="color:#f2740c;">*</span>
                                </p>
                                <input type="number" :disabled="! item.sparePartName" v-model="item.sparePartNum" onmousewheel="return false;">
                                <!-- <InputNumber   v-model="item.sparePartNum"></InputNumber> -->
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
                <div class="asset-footer">
                    <div style="margin-left:20px">
                        <Checkbox v-if="ViewLimit('con:del')" v-model="singles" @on-change="changes">设为无效合同</Checkbox>
                    </div>
                    <div class="retrieval-btn">
                        <Button class="kld-btn-default" @click="del_info2.modal2=true">取消</Button>
                        <Button :loading="submitLoading" class="btn-active" @click="handleSubmit('formValidate')">保存</Button>
                    </div>
                </div>
            </div>
            <div style="padding-bottom:50px"></div>
            <div class="copy">
                Copyright ? 2018.南京恺立达医院管理有限公司 版权所有
            </div>
        </div>
        <!-- <Modal v-model="back" title="返回合同管理" @on-ok="ok" @on-cancel="cancel">
            <h1>确定要取消吗</h1>
            <p>点击确定后将返回</p>
        </Modal> -->

        <!-- 选择设备 -->
        <Modal v-model="showcontract" width="800" title="选择设备" @on-ok="oks">
            <!--@on-selection-change='check_change'  删除了此事件，认为没比要 by cjx-->
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

        <Modal v-model="showsupplier" width="800" title="选择供应商">
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
        <promt :msginfo='del_info' @pro_ok="del"></promt>
        <promt :msginfo='del_info1' @pro_ok="dels"></promt>
        <promt :msginfo='del_info2' @pro_ok="ok"></promt>
        <promt :msginfo='del_info3' @pro_ok="closet"></promt>
    </div>
</template>

<script>
import promt from "../../common/prompt/prompt";
import kldInputNumber from '@common/kld-input-number';
import kldImgUpload from '@common/kld-img-upload';
export default {
    name: 'edit-contract',
    data() {
        return {
            submitLoading: false,
            sparet: [],
            spacelist: "",
            imgindex: "",
            del_info3: {
                title: "提示",
                okText: "确认",
                name: "是否要删除当前图片",
                modal2: false
            },
            limit: JSON.parse(localStorage.getItem("limit")),
            keyword: "",
            listst: [],
            // tstre: true,
            singles: "",
            assetn: [],
            id: "",
            resPhotos: [],
            infolist: "",
            del_info2: {
                title: "提示",
                okText: "确认",
                name: "是否要退出当前编辑页面",
                modal2: false
            },
            del_info: {
                title: "提示",
                okText: "确认",
                name: "是否要是删除当前行数据",
                // name: "删除关联设备将同时删除与此设备所关联的备件，是否确认删除？",
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
            showsupplier: false,
            pagets: 0,
            supplierlist: [],
            supplierinfos: JSON.parse(sessionStorage.getItem("suuplierinfo")),
            infos: [],
            model4: "",
            contract: [],
            supplierContactName: '',
            supplierPhone: '',
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
                    title: "检定单位",
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
            contractinfos: [],
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
            stagesnum: "",

            stagesNum: [
                {
                    periods: 1,
                    paymentAmount: null,
                    paymentDate: "",
                    paymentStatus: 0
                },
                {
                    periods: 2,
                    paymentAmount: null,
                    paymentDate: "",
                    paymentStatus: 0
                },
                {
                    periods: 3,
                    paymentAmount: null,
                    paymentDate: "",
                    paymentStatus: 0
                }
            ],
            assets: [
                {
                    assetName: "",
                    assetClass: "",
                    assertBrand: "",
                    assetWarrntyDate: ""
                }
            ],
            spare: [
                {
                    sparePartModel: "",
                    sparePartName: "",
                    sparePartNum: null,
                    assetId: '',
                    assetName: ""
                }
            ],
            formValidate: {
                name: "",
                data: "",
                version: "",
                assetId: "",
                datas: "",
                signdata: ""
            },

            model1: "",
            active: false,
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "合同名称为必填字段",
                        trigger: "blur"
                    }
                ],
                datas: [
                    {
                        required: true,
                        type: "date",
                        message: "签订日期为必填字段",
                        trigger: "change"
                    }
                ],
                version: [
                    {
                        required: true,
                        message: "供应商名称为必填字段",
                        trigger: "blur"
                    }
                ],
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
            },
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
        single() {
            this.stagesnum = 3;
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
        },
        info() {
            return JSON.parse(localStorage.getItem("contractlist"));
        }
    },
    created() {
        this.getlabel();
        // this.getasset();
        this.supplierinfo();//获取供应商列表的方法
        this.getinfo().then(this.getasset);
    },
    mounted() {
        if (this.supplierinfos) {
            this.supplierPhone = this.supplierinfos.supplierPhone;
            this.supplierContactName = this.supplierinfos.supplierContactName;
            this.formValidate.version = this.supplierinfos.supplierName;
        } else {
            this.supplierPhone = this.supplierContactName = this.formValidate.version = null;
        }
    },
    methods: {
        delimg(index) {
            this.imgindex = index;
            this.del_info3.modal2 = true;
        },
        searchlist() {
            this.supplierinfo();
        },
        fenqi() {
            this.stagesnum ? this.stagesnum : (this.stagesnum = 3);
        },
        closet(index) {
            this.resPhotos.splice(this.imgindex, 1);
        },

        up_err1(e) {
            this.$Message.warning("上传的图片已大于3M");
        },
        changes() {
            if (this.singles) {
                this.$Message.warning("此合同已经设为无效合同");
            }
        },
        // infots() {
        //     this.tstre = false;
        // },
        up_err(e) {
            this.$Message.warning("上传的图片已大于3M");
        },
        getinfo() {
            let osid = JSON.parse(localStorage.getItem("user_in")).osId;

            return this.axios
                .get(`contracts/${osid}/${this.info}/`, {
                    limit: 10,
                    offset: 0,
                    params: {}
                })
                .then(res => {
                    //  this.infos = res.data.assets;
                    let lists = [];
                    res.data.assets.map(function(item) {
                        let status =
                            item.assetWarrntyDate == "1970-01-01"
                                ? ""
                                : item.assetWarrntyDate;
                        lists.push({
                            assetId: item.id,
                            assetName: item.assetName,
                            assetClass: item.assetClass,
                            assertBrand: item.assertBrand,
                            assetWarrntyDate: status,
                            brandName: item.brandName
                        });
                    });
                    if (res.data.assets.length == 0) {
                        this.assets = [
                            {
                                assetName: "",
                                assetClass: "",
                                assertBrand: "",
                                assetWarrntyDate: ""
                            }
                        ];
                    } else {
                        this.assets = lists;
                        this.infos = [...this.assets];

                        //为this.infos的每一项都添加id，id值为assetId属性的值
                        for (const infoItem of this.infos) {
                            infoItem.id = infoItem.assetId;
                        }
                    }
                    let assetselect = [];
                    res.data.assets.forEach(res => {
                        assetselect.push({
                            value: res.id + "-" + res.assetName,
                            label: res.assetName
                        });
                    });
                    this.contract = assetselect;
                    this.infolist = res.data;
                    this.contractCode = res.data.contractCode;
                    this.time = res.data.signDate;
                    this.formValidate.version = res.data.supplierName;
                    this.supplierContactor = res.data.supplierContactor;
                    this.purchaseAmount = res.data.purchaseAmount;
                    this.supplierPhone = res.data.supplierContact;
                    if (res.data.periodsNum !== 0) {
                        this.single = true;
                    }

                    if (res.data.spareParts.length == 0) {
                        this.spare = [
                            {
                                sparePartModel: "",
                                sparePartName: "",
                                sparePartNum: null,
                                assetId: null,
                                assetName: ""
                            }
                        ];
                        this.spacelist = [
                            {
                                sparePartModel: "",
                                sparePartName: "",
                                sparePartNum: null,
                                assetId: null,
                                assetName: ""
                            }
                        ];
                    } else {
                        this.spare = res.data.spareParts;
                        this.spacelist = res.data.spareParts;
                    }

                    //  this.assetlist = res.data.assetIds;
                    this.$nextTick(()=>{

                        this.stagesnum = res.data.periodsNum;
                    })
                    this.formValidate.datas = res.data.signDate;
                    this.formValidate.name = res.data.contractName;
                    this.model4 = res.data.contractType;
                    this.supplierContactName = res.data.supplierContactor;
                    this.btnlist = res.data.labels;

                    // res.data.attachments.forEach(res => {
                    //     this.resPhotos.push(res.attachmentPath);
                    // });
                    this.resPhotos = res.data.attachments.map(
                        ({photoUrl, photoSuperUrl}) => ({url: photoUrl, thumb: photoSuperUrl})
                    );

                    if (res.data.paymentInstalments.length == 0) {
                        this.stagesNum = [
                            // {
                            //     periods: 1,
                            //     paymentAmount: null,
                            //     paymentDate: "",
                            //     paymentStatus: 0
                            // },
                            // {
                            //     periods: 2,
                            //     paymentAmount: null,
                            //     paymentDate: "",
                            //     paymentStatus: 0
                            // },
                            // {
                            //     periods: 3,
                            //     paymentAmount: null,
                            //     paymentDate: "",
                            //     paymentStatus: 0
                            // }
                        ];
                    } else {
                        let listtt = [];
                        res.data.paymentInstalments.map(function(item) {
                            let status =
                                item.paymentDate == "1970-01-01"
                                    ? ""
                                    : item.paymentDate;
                            listtt.push({
                                paymentDate: status,
                                periods: item.periods,
                                paymentAmount: item.paymentAmount,
                                paymentStatus: item.paymentStatus,
                                id: item.id
                            });
                        });
                        this.stagesNum = listtt;
                    }
                    this.singles = res.data.contractStatus === 1;

                    // if (res.data.assets == 0) {
                    //     // this.assets = [
                    //     //     {
                    //     //         assetName: "",
                    //     //         assetClass: "",
                    //     //         assertBrand: "",
                    //     //         assetWarrntyDate: ""
                    //     //     }
                    //     // ];
                    // } else {

                    // this.assetlist = lists;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        supplierinfo(page = 1) {
            let line = (page - 1) * 10;
            this.axios
                .post(
                    `/supplier/list`,

                    {
                        limit: 10,
                        offset: line,
                        params: {
                            keyword: this.keyword,
                            type:"0",
                            osId:this.$store.state.user_in.osId
                        }
                    }
                )
                .then(res => {
                    this.supplierlist = res.data.data;
                    this.pagets = res.data.recordsTotal;
                })
                .catch(error => {
                    this.$Message.warning("获取列表信息错误");
                });
        },
        del() {
            //   if(this.assets[0].assetId){
            //           var ind= this.assets[this.index].assetId;
            //           this.spare [ this.spare.findIndex((res)=>{
            //        return  res.assetId=ind
            //     })  ].assetId="";
            //    this.spare [ this.spare.findIndex((res)=>{
            //        return  res.assetId=ind
            //     })  ].sparePartNum=0;
            //      this.spare [ this.spare.findIndex((res)=>{
            //        return  res.assetId=ind
            //     })  ].assetName="";
            // this.spare.splice( this.spare.findIndex((res)=>{
            //    return  res.assetId=ind
            // }) , 1);
            //  this.sparet.splice( this.sparet.findIndex((res)=>{
            //    return  res.assetId=ind
            // }) , 1);
            // }
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
                //       this.spare.splice(this.indexs, 1);
                //    this.sparet.splice(this.indexs, 1);

                //  this.spare.splice(this.index, 1);
                return;
            } else if (this.assets.length) {
                this.assets = [
                    {
                        sparePartModel: "",
                        sparePartName: "",
                        sparePartNum: null,
                        assetId: null,
                        assetName: ""
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
                this.sparet.splice(this.indexs, 1);
            } else if (this.spare.length) {
                this.spare = [
                    {
                        sparePartModel: "",
                        sparePartName: "",
                        sparePartNum: null,
                        assetId: null,
                        assetName: ""
                    }
                ];
            }
        },
        editinfos(index) {
            this.indexs = index;
            this.del_info1.modal2 = true;
        },
        checks(row) {
            this.id = row.id;
            this.supplierPhone = row.supplierPhone;
            this.supplierContactName = row.supplierContactName;
            this.formValidate.version = row.supplierName;
            this.showsupplier = false;
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
                            }) !== -1;
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
            // this.stagesNum[index].complete = true;
        },

        ok() {
            this.$router.go(-1);
        },

        //获取签订日期
        getStartTime1(data) {
            this.time1 = data;
        },

        //获取时间1
        getStartTime(date) {
            this.time = date;
        },

        //跳转新增供应商
        jumpaddSupplier() {
            this.$router.push("/index/supplier/addSupplier");
            //    this.supplierinfos=JSON.parse(sessionStorage.getItem("suuplierinfo"))
        },
        //新增合同

        //验证
        handleSubmit(name) {
            for (let i = 0; i < this.btnlist.length; i++) {
                if (this.btnlist[i].id != null) {
                    this.btnid.push(this.btnlist[i].id);
                }
            }
            let infott = Array.from(new Set(this.btnid));

            let btns = [];
            this.btnlist.forEach(res => {
                btns.push(res.labelId);
            });
            let infottt = infott.concat(btns);
            let info = [];
            for (var i = 0; i < infottt.length; i++) {
                if (typeof infottt[i] != "undefined") {
                    info.push(infottt[i]);
                }
            }

            if (this.contractCode.trim() == "") {
                this.$Message.warning("合同编号为必填字段");
                return;
            } else if (this.contractCode.length > 20) {
                this.$Message.warning("合同编号长度不能超过20");
                return;
            }
            if (this.formValidate.name.trim() == "") {
                this.$Message.warning("输入合同名称为必填字段");
                return;
            }
            if (this.formValidate.datas == "") {
                this.$Message.warning("签订日期为必填字段");
                return;
            }
            if (this.model4 == "") {
                this.$Message.warning("请选择合同类型");
                return;
            }
            if (this.formValidate.version.trim() == "") {
                this.$Message.warning("供应商名称为必填字段");
                return;
            }

            let dd = true;
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

            if (this.spare[0].assetId || this.spacelist.length > 0) {
                let cfx = this.spacelist[0].assetId;
                this.spare.map(function(item, index) {
                    if (item.assetId) {
                        let status = item.assetId[index] ? true : false;
                    } else {
                        let status = true;
                    }
                    names = status || !cfx;
                    return names;
                });
            }

            this.spare.map(function(item) {
                return cc = !! item.sparePartNum;
            });

            if (this.assets.length > 0) {
                for (const {id, assetWarrntyDate} of this.assets) {
                    if (id && ! assetWarrntyDate) {
                        this.$Message.warning("过保日期为必填字段");
                        return;
                    }
                }
            }

            let statuts = this.singles ? 1 : 0;

            let ccd = [];
            this.infos.forEach(res => {
                ccd.push({
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
            this.assetlist = ccd;
            //验证采购金额是否等于分期总金额
            if (this.single && (! this.validateStagesDate() || ! this.validateStagesMoney())) {
                return;
            }

            //验证备件信息
            if (this.spare.length !== 0) {
                for (const spareItem of this.spare) {
                    if (spareItem.sparePartName) {
                        if (! spareItem.assetId) {
                            this.$Message.warning('请选择所属设备');
                            return;
                        } else if (! spareItem.sparePartNum) {
                            this.$Message.warning('设备数量为必填字段');
                            return;
                        }
                    }
                }
            }


            this.$refs[name].validate(valid => {
                if (valid) {
                    let osid = JSON.parse(localStorage.getItem("user_in")).osId;

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

                    Promise.all(
                        this.resPhotos.map(
                            img => {
                                if (img instanceof File) {
                                    const formData = new FormData();
                                    formData.append('file', img);

                                    return this.$axios.post(`/photo/${this.$store.state.user_in.osId}/2/upload`, formData, {
                                        'content-type': 'multipart/form-data'
                                    })
                                } else {
                                    return {data: {
                                            photoUrl: img.url,
                                            photoSuperUrl: img.thumb
                                        }};
                                }
                            }
                        )
                    )
                        .then(allRes => {
                            this.axios
                                .put(`contracts/${osid}/${this.info}/`, {
                                    contractCode: this.contractCode,
                                    contractName: this.formValidate.name,
                                    signDate: this.time,
                                    supplierName: this.formValidate.version,
                                    supplierContactor: this.supplierContactName,
                                    supplierContact: this.supplierPhone,
                                    purchaseAmount: this.purchaseAmount,
                                    periodsNum: this.single ? this.stagesnum : 0,
                                    paymentInstalments: this.single ? this.stagesNum.map(v=>({
                                        ...v,
                                        paymentDate:this.$store.state.localeDate(v.paymentDate)
                                    })) : [],
                                    spareParts,
                                    contractType: this.model4,

                                    assetIds: this.assetlist.filter(({assetId}) => assetId),

                                    labelIds: info.length > 0 ? info : btns,
                                    supplierId: this.id,
                                    pics: allRes.map(({data}) => data),
                                    contractStatus: statuts
                                })
                                .then(res => {
                                    this.$Message.info("编辑数据成功");
                                    this.$router.go(-1);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        })
                        .finally(() => this.submitLoading = false);
                }
            });
        },

        //新增设备
        addadddevice() {
            this.assets.push({
                assetName: "",
                assetClass: "",
                assertBrand: "",
                assetWarrntyDate: ""
            });
        },
        //新增备件
        addspare() {
            this.spare.push({
                sparePartModel: "",
                sparePartName: "",
                sparePartNum: 0,
                assetId: [],
                assetName: ""
            });
        },

        //输入分页数
        fen() {
            this.stagesNum = [];
            // let num = this.stagesnum > 3 ? this.stagesnum : 3;
            for (var i = 1; i < this.stagesnum - 0 + 1; i++) {
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

        up_succ(e) {
            if (this.resPhotos.length > 4) {
                this.$Message.warning("最多可以上传五张图片");
                return;
            } else {
                this.resPhotos.push(e);
                this.$Message.success("文件上传成功");
                this.next_ = true;
            }
        },
        up_error(e) {
            this.$Message.warning("网络错误，或者文件格式不正确");
        },
        rm_(e, index) {
            this.axios
                .delete(`/photo/delete?url=${e.response}`)
                .then(res => {
                    this.next_ = false;
                    this.resPhotos.splice(index, 1);
                    this.$Message.success("文件删除成功");
                })
                .catch(error => {
                    this.$Message.warning("文件删除失败");
                    console.log(error);
                });
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
        //点击设备名称弹出窗口
        t_choose() {
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
        kldInputNumber,
        kldImgUpload
    }
};
</script>

<style scoped lang="less">
::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
.nav-search {
    float: right !important;
    margin-bottom: 10px !important;
    width: 300px !important;
}
.img-boxs {
    display: inline-block;
    text-align: left;
    position: relative;
    .closet {
        font-size: 30px;
        font-weight: bold;
        color: #ccc;
        position: absolute;
        top: -12px;
        right: 4px;
    }
}
.asset-footer {
    display: flex;
    justify-content: space-between;
}
.imgs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
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
// .money {
//     height: 34px;
//     width: 200px;
//     line-height: 1.5;
//     padding: 4px 7px;
//     font-size: 12px;
//     border: 1px solid #dddee1;
//     border-radius: 4px;
//     color: #495060;
//     background-image: none;
//     position: relative;
//     cursor: text;
//     transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
//         box-shadow 0.2s ease-in-out;
// }
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
                top: 8px;
                left: 10px;
                .asset-lable {
                    height: 36px;
                    min-width: 80px;
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
            padding-bottom: 10px;
            background-color: #f5f6fa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            padding-left: 10px;
            display: flex;
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
</style>
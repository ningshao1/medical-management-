<template>
    <div class="scrap-info kld-box-effect">
        <Loading v-if="! pageShow"></Loading>
        <Form label-position="top" :rules="isApply ? formRules : {}" ref="form" :model="formData">
            <div v-if="isDetails" class="divide">
                <span>报废审批意见</span>
                <!--<a v-if="approvalLevel === 4" class="print-approval" @click="printApproval" href="javascript:">打印审批意见</a>-->
            </div>
            <div class="form-title">基础信息</div>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="设备名称：" prop="assetName">
                        <i-input
                                @click.native="openDeviceModal"
                                :value="formData.assetName"
                                :icon="isApply ? 'arrow-down-b' : ''"
                                class="kld-input"
                                placeholder="请选择设备"
                                :readonly="isApply"
                                :disabled="isDetails"
                        ></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="设备型号：">
                        <i-input :value="formFakeData.assetModel" disabled class="kld-input" placeholder="系统自动填写"></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="设备品牌：">
                        <i-input :value="formFakeData.assetBrand" disabled class="kld-input" placeholder="系统自动填写"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="设备编码：">
                        <i-input :value="formFakeData.assetCode" disabled class="kld-input" placeholder="系统自动填写"></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="所属科室：">
                        <i-input :value="formData.department" disabled class="kld-input" placeholder="系统自动填写"></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="申请人：">
                        <i-input :value="isApply ? user_in.name : approvalData.proposer" disabled class="kld-input" placeholder="系统自动填写"></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col>
                    <FormItem label="保修状态：">
                        <RadioGroup :value="formFakeData.warrantyStatus" size="large">
                            <Radio label="1" disabled>保内</Radio>
                            <Radio label="2" disabled>已出保</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col>
                    <FormItem label="报废原因：">
                        <i-input :maxlength="2000" v-model="formData.scrapCause" :disabled="isDetails" :rows="4" :class="{'show-text-length': isApply}" :data-show-text-length="`${formData.scrapCause.length}/2000`" type="textarea" placeholder="请根据实际原因填写报废原因"></i-input>
                    </FormItem>
                </i-col>
            </Row>


            <template v-if="isDetails">
                <Row v-if="approvalLevel >= 2">
                    <i-col>
                        <div class="form-title">一级审批意见</div>
                        <Row>
                            <i-col span="8">
                                <p>审批结果：{{approvalData.engineerOpinion === '0' ? '同意' : '不同意'}}</p>
                            </i-col>
                            <i-col span="8">
                                <p>审批人：{{approvalData.engineerName}}</p>
                            </i-col>
                            <i-col span="8">
                                <p>审批时间：{{approvalData.engineerTime}}</p>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col>
                                <FormItem label="审批意见：">
                                    <i-input :value="approvalData.engineerOpinionDesc" disabled :rows="4" type="textarea"></i-input>
                                </FormItem>
                            </i-col>
                        </Row>
                    </i-col>
                </Row>
                <template v-if="approvalLevel >= 3">
                    <Row>
                        <i-col>
                            <div class="form-title">二级审批意见</div>
                            <Row>
                                <i-col span="8">
                                    <p>审批结果：{{approvalData.sectionChiefOpinion === '0' ? '同意' : '不同意'}}</p>
                                </i-col>
                                <i-col span="8">
                                    <p>审批人：{{approvalData.sectionChiefName}}</p>
                                </i-col>
                                <i-col span="8">
                                    <p>审批时间：{{approvalData.sectionChiefTime}}</p>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col>
                                    <FormItem label="审批意见：">
                                        <i-input :value="approvalData.sectionChiefOpinionDesc" disabled :rows="4" type="textarea"></i-input>
                                    </FormItem>
                                </i-col>
                            </Row>
                        </i-col>
                    </Row>
                    <div v-if="isApprovalUnReject" class="approval-level-3">
                        <template v-if="approvalLevel === 3">
                            <template v-if="isLeader">
                                <div class="divide leader-approval-divide">院领导审批意见</div>
                                <kld-upload :fileList="approvalImgs" :maxCount="5" :second="uploadConfig" :accept="['jpg', 'jpeg', 'png']"></kld-upload>
                            </template>
                            <!--<p class="kld-success">图片格式支持jpg、png、gif， 图片大小在3MB以内</p>-->
                        </template>
                        <template v-else-if="approvalLevel === 4">
                            <div class="divide leader-approval-divide">院领导审批意见</div>
                            <kld-image-view :img-url-list="approvalImgUrls"></kld-image-view>
                        </template>
                    </div>
                </template>
            </template>
        </Form>
        <div class="kld-form-footer">
            <!--申请报废时的提交按钮-->
            <Button :loading="submitLoading" v-if="isApply" @click="applySubmit" class="kld-btn">提交</Button>
            <template v-else-if="isApprovalUnReject">
                <Button v-if="isEngineer && approvalLevel === 1 || isChief && approvalLevel === 2" @click="approvalModalOpen" class="kld-btn">{{approvalLevel === 1 ? '一级审批' : '二级审批'}}</Button>
                <!--领导审批的提交按钮-->
                <Button :loading="submitLoading" v-else-if="isLeader && approvalLevel === 3" @click="approvalLevel3" class="kld-btn">提交</Button>
            </template>
            <Button @click="goBack" class="kld-btn-default">取消</Button>
        </div>

        <!--申请报废页面 选择报废设备的modal框-->
        <!--move-up-modal-->
        <Modal v-if="isApply" v-model="deviceModalShow" @on-visible-change="deviceModalChange" title="选择产品" :width="1088" class-name="vertical-center-modal">
            <div class="device-modal">
                <div class="device-modal-tree">
                    <!--<Tree :data="sectionTree" @on-select-change="treeSelectChange"></Tree>-->
                    <kld-search-tree
                            placeholder="请输入科室名称"
                    >
                        <kld-tree
                                slot="tree"
                                :data="sectionTree"
                                title-key="osName"
                                children-key="lists"
                                first-expanded
                                highlight-current
                                @current-change="treeSelectChange"
                        ></kld-tree>
                    </kld-search-tree>
                </div>
                <div class="device-modal-list">
                    <i-input v-model="deviceSearchData.keyWord" class="kld-input" placeholder="请输入关键字" icon="ios-search-strong"></i-input>
                    <div style="position:relative;">
                        <Table @on-row-click="deviceRowClick" class="device-table i-table-stripe" :columns="deviceColumns" :data="deviceList"></Table>
                        <div class="device-page">
                            <kld-page :total="pageData.total" :current.sync="pageData.current" :page-size="pageData.pageSize" @on-change="getDeviceList"></kld-page>
                        </div>
                        <Loading v-if="listLoading"></Loading>
                    </div>
                </div>
            </div>
            <div slot="footer"></div>
        </Modal>

        <!--一二级审批的modal框-->
        <Modal
            v-else
            v-model="approvalModalShow"
            :title="approvalLevel === 1 ? '一级审批意见' : '二级审批意见'"
            :width="700"
            @on-visible-change="approvalModalChange"
            class-name="vertical-center-modal"
        >
            <Form label-position="top" ref="approval-modal-form" :model="approvalModalData">
                <Row>
                    <i-col>
                        <FormItem label="审批结果：" prop="allow" :rules="{required: true, message: '审批结果为必选'}">
                            <RadioGroup v-model="approvalModalData.allow" size="large">
                                <Radio label="0">同意</Radio>
                                <Radio label="1">不同意</Radio>
                            </RadioGroup>
                        </FormItem>
                    </i-col>
                </Row>
                <Row>
                    <i-col>
                        <FormItem label="审批意见：">
                            <i-input :maxlength="2000" class="show-text-length" :data-show-text-length="`${approvalModalData.opinion.length}/2000`" v-model="approvalModalData.opinion" type="textarea" :rows="4" placeholder="请填写审批意见"></i-input>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
            <div slot="footer">
                <Button @click="approvalModalCancel" class="kld-btn-default">取消</Button>
                <Button :loading="submitLoading" @click="approvalModalSubmit" class="kld-btn">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<style lang="less" scoped>
    .scrap-info{
        padding: 0 30px 30px 30px;
        position: relative;
    }
    .form-title{
        font-size: 16px;
        color: #f2740c;
        padding: 20px 0;
        border-bottom: 1px solid #e2e2e2;
    }
    .ivu-row{
        margin-top: 26px;
        &:first-of-type{
            margin-top: 0;
        }
    }

    .divide{
        font-size: 16px;
        padding: 20px 30px;
        margin: 0 -30px;
        background-color: #eaeaea;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666666;
    }


    .print-approval{
        font-weight: normal;
        font-size: 14px;
    }
    .approval-level-3{
        .divide{
            margin-top: 26px;
            margin-bottom: 26px;
        }
    }

    .kld-form-footer{
        .kld-btn{
            margin-left: 20px;
        }
    }

    .device-modal {
        display: flex;

        .device-modal-tree {
            border-radius: 4px;
            border: 1px solid rgba(2, 31, 57, 0.1);
            margin-right: 20px;
            width: 300px;
            height: 638px;
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
</style>

<script>
    import kldPage from "@common/page/page.vue";
    import kldConfirm from '@common/kld-confirm';
    import testLimit from '@common/test-limit';
    import kldUpload from "@common/C-UploadFile/CUploadFile.vue";
    import picImg from '@common/C-UploadFile/image/pict.png';
    import kldImageView from '@common/imageView/ImageView.vue';
    import KldSearchTree from '@common/kld-search-tree';
    import KldTree from '@common/kld-tree';
    import {debounce} from '@/utils';
    import emptyToNull from '@common/empty-to-null';
    export default {
        name: "scrap-info",
        components: {kldPage, kldUpload, kldImageView, KldSearchTree, KldTree},
        data() {
            return {
                submitLoading: false,
                pageShow: true,
                formData: {
                    assetId: '',
                    warrantyPeriod: '',
                    scrapCause: '',
                    departmentId: '',
                    department: '',
                    assetName: ''
                },
                formFakeData: {
                    assetCode: '',
                    assetModel: '',
                    assetBrand: '',
                    warrantyStatus: '',
                },
                formRules: {
                    assetName: {
                        required: true,
                        message: '设备名称为必选'
                    }
                },

                isApply: this.$route.name === 'scrap-apply',
                isDetails: this.$route.name === 'scrap-details',

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
                    keyWord: ""
                },

                approvalData: {},

                approvalLevel: 0,
                isApprovalUnReject: false,
                isEngineer: testLimit('ds:edit'),
                isChief: testLimit('ds:undo'),
                isLeader: testLimit('ds:agree'),

                approvalModalShow: false,
                approvalModalData: {
                    scrapId: this.$route.query.id,
                    assetId: '',
                    department: '',
                    allow: '',
                    opinion: ''
                },


                uploadConfig: {
                    show: false,
                    title: '审批文件',
                    icon: [picImg]
                },
                approvalImgs: [],
                approvalImgUrls: [],
                listLoading:false
            };
        },
        watch: {
            deviceSearchData: {
                deep: true,
                handler: debounce(function () {
                    this.pageData.current = 1;
                    this.getDeviceList();
                }, 200)
            }
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            },
            scrapId() {
                return this.$route.query.id;
            }
        },
        created() {
            if (this.isApply) {
                this.getDeviceList();
                this.getSectionTree();
            } else {
                this.getDetails();
            }
        },
        methods: {
            //获取资产列表
            getDeviceList() {
                const data = {
                    limit: this.pageData.pageSize,
                    offset: (this.pageData.current - 1) * 10,
                    params: emptyToNull(this.deviceSearchData)
                };
                this.listLoading = true;
                return this.$axios
                    .post('/scrap/assetList', data)
                    .then(({ data: { data, recordsTotal } }) => {
                        this.deviceList = data;
                        this.pageData.total = recordsTotal;
                    }).finally(()=>{
                        this.listLoading=false;
                    });
            },
            //获取科室树
            getSectionTree() {
                return this.$axios
                    .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                    .then(({ data }) => {
                        this.sectionTree = [data];
                    });
            },

            //科室树被选择
            treeSelectChange(data, node) {
                if (node) {
                    this.deviceSearchData.departmentId = node.key;
                } else {
                    this.deviceSearchData.departmentId = "";
                }
            },





            //详情页面 获取详情
            getDetails() {
                this.pageShow = false;
                return this.$axios.get(`/scrap/${this.scrapId}`)
                    .then(({data}) => {
                        this.formData =
                        this.formFakeData =
                        this.approvalData = data;

                        //判断审核进度 1为需要一级审核 2为需要二级审核 3为需要领导审核 4为已经全部审批过
                        if (data.deanOpinion === 1 || data.deanOpinions && data.deanOpinions.length > 0) {
                            this.approvalLevel = 4;
                            this.approvalImgUrls = data.deanOpinions;
                        } else if (data.sectionChiefTime) {
                            this.approvalLevel = 3;
                        } else if (data.engineerTime) {
                            this.approvalLevel = 2;
                        } else {
                            this.approvalLevel = 1;
                        }

                        //审批需要添加 资产ID，科室名称
                        this.approvalModalData.assetId = data.assetId;
                        this.approvalModalData.department = data.department;

                        this.isApprovalUnReject = data.scrapStatus !== '4';
                    })
                    .finally(() => this.pageShow = true);
            },

            //打开选择资产的modal框
            openDeviceModal() {
                this.deviceModalShow = true;
            },
            //当资产modal的显示发生变化
            deviceModalChange(show) {
                if (! show) {
                    this.$refs.form.validateField('assetName');
                }
            },
            //当某一条资产被点击时
            deviceRowClick(row) {
                const formData = this.formData,
                    formFakeData = this.formFakeData;

                formData.department = row.osName;
                formData.departmentId = row.departmentId;
                formData.assetName = row.assetName;
                formData.assetId = row.assetId;
                formData.warrantyPeriod = row.collarTime;

                formFakeData.assetCode = row.assetCode;
                formFakeData.assetModel = row.assetClass;
                formFakeData.assetBrand = row.brandName;
                formFakeData.warrantyStatus = row.warrantyStatus;
                this.deviceModalShow = false;
            },

            //申请报废提交按钮
            applySubmit() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        this.$axios.post('/scrap/save', this.formData)
                            .then(({data: status}) => {
                                switch (status) {
                                    case '200':
                                        this.$Message.success('申请成功');
                                        this.$router.go(-1);
                                        break;
                                    case '600':
                                        this.$Message.warning('重复申请');
                                        break;
                                    case '400':
                                        this.$Message.warning('申请失败');
                                        break;
                                    default :
                                    // case '404':
                                        this.$Message.warning('申请异常');
                                }
                            })
                            .finally(() => this.submitLoading = false);
                    }
                });
            },

            //打开审批的modal
            approvalModalOpen() {
                 this.approvalModalShow = true;
            },
            //一级/二级审批提交
            approvalModalSubmit() {
                this.$refs['approval-modal-form'].validate(valid => {
                    if (valid) {
                        const approvalModalData = this.approvalModalData,
                            config = {
                                url: '',
                                method: 'PUT',
                                data: {
                                    scrapId: approvalModalData.scrapId,
                                    assetId: approvalModalData.assetId,
                                    department: approvalModalData.department
                                }
                            };

                        if (this.approvalLevel === 1 && this.isEngineer) {
                            config.url = '/scrap/update/g';
                            config.data.engineerOpinion = approvalModalData.allow;
                            config.data.engineerOpinionDesc = approvalModalData.opinion;
                        } else if (this.approvalLevel === 2 && this.isChief) {
                            config.url = '/scrap/update/k';
                            config.data.sectionChiefOpinion = approvalModalData.allow;
                            config.data.sectionChiefOpinionDesc = approvalModalData.opinion;
                        }


                        this.submitLoading = true;
                        this.$axios(config)
                            .then(({data: status}) => {
                                switch (status) {
                                    case '200':
                                        this.$Message.success('审批成功');
                                        this.approvalModalShow = false;
                                        this.getDetails();
                                        break;
                                    default :
                                    // case '400':
                                        this.$Message.warning('审批失败');
                                }
                            })
                            .finally(() => this.submitLoading = false);
                    } else {
                        this.$Message.warning('请选择审批结果');
                    }
                });
            },
            //一级/二级审批modal取消
            approvalModalCancel() {
                this.approvalModalShow = false;
                this.$refs['approval-modal-form'].resetFields();
            },

            //一级/二级审批modal显示变化时
            approvalModalChange(show) {
                if (! show) {
                    this.approvalModalData.allow = '';
                    this.approvalModalData.opinion = '';
                }
            },



            //三级审批
            approvalLevel3() {
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                };

                this.submitLoading = true;
                return Promise.all(
                    this.approvalImgs.map(
                        img => {
                            const formData = new FormData();
                            formData.append('file', img);
                            return this.$axios.post(`/photo/${this.user_in.osId}/9/upload`, formData, config);
                        }
                    )
                )
                    .then(
                        allRes => {
                            return this.$axios.put('/scrap/update/y', {
                                scrapId: this.scrapId,
                                deanOpinions: allRes.map(res => res.data)
                            });
                        }
                    )
                    .then(
                        ({data: status}) => {
                            switch (status) {
                                case '200':
                                    this.$Message.success('审批成功');
                                    this.getDetails();
                                    break;
                                default :
                                // case '400':
                                    this.$Message.warning('审批失败');
                            }
                        }
                    )
                    .finally(() => this.submitLoading = false);
            },


            //打印审批意见
            printApproval() {

            },

            //返回时
            goBack() {
                if (this.isApply || this.approvalLevel === 3 && this.isLeader) {
                    kldConfirm({
                        title: '提示',
                        content: '返回后所有已填数据不会被保存，确定返回吗',
                        ok: () => {
                            this.$router.go(-1);
                        }
                    });
                } else {
                    this.$router.go(-1);
                }
            }
        }
    }
</script>
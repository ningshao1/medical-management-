<template>
    <div class="create-singer">
        <Form ref="create-singer-form"
              :model='formModel'
              :rules="formRules">
            <div class="basic-info-wrap">
                <kld-type title="基础信息"></kld-type>
                <i-row type="flex"
                       justify="space-between">
                    <i-col v-if="!isReopen"
                           :span='7'
                           class="asset-name-item-wrap">
                        <span class='view-details'
                              @click="viewDetails"
                              v-show="formModel.assertName">查看设备详情</span>
                        <form-item label="设备名称："
                                   prop="assetId"
                                   class="asset-name-item">
                            <i-input class="kld-input"
                                     v-model="formModel.assertName"
                                     readonly
                                     placeholder="请选择设备名称"
                                     @click.native="doSelectAsset"></i-input>
                        </form-item>
                        <i-button class='kld-btn view-asset-btn'
                                  @click='doSelectAsset'>选择设备</i-button>
                    </i-col>
                    <i-col v-else
                           :span='7'
                           class="asset-name-item-wrap">
                        <span class='view-details'
                              @click="viewDetails"
                              v-show="formModel.assertName">查看设备详情</span>
                        <form-item label="设备名称："
                                   prop="assetId">
                            <i-input class="kld-input"
                                     v-model="formModel.assertName"
                                     readonly
                                     disabled
                                     placeholder="请选择设备名称"></i-input>
                        </form-item>
                    </i-col>
                    <i-col :span='7'>
                        <form-item label="设备型号：">
                            <i-input class="kld-input"
                                     v-model="otherInfo.assetClass"
                                     disabled
                                     placeholder="设备型号"></i-input>
                        </form-item>
                    </i-col>
                    <i-col :span='7'>
                        <form-item label="设备编码：">
                            <i-input class="kld-input"
                                     v-model="otherInfo.assetCode"
                                     disabled
                                     placeholder="设备编码"></i-input>
                        </form-item>
                    </i-col>
                </i-row>
                <i-row type="flex"
                       justify="space-between"
                       style="margin-top:20px;">
                    <i-col :span='7'>
                        <form-item label="设备类别：">
                            <i-input class="kld-input"
                                     v-model="otherInfo.assertTypeName"
                                     disabled
                                     placeholder="设备类别"></i-input>
                        </form-item>
                    </i-col>
                    <i-col :span='7'>
                        <form-item label="报修人：">
                            <poptip-show-info :info-id="otherInfo.createId"
                                              width="100%">
                                <i-input class="kld-input"
                                         v-model="formModel.createName"
                                         disabled
                                         placeholder="报修人"></i-input>
                            </poptip-show-info>

                        </form-item>
                    </i-col>
                    <i-col :span='7'>
                        <form-item label="保修状态：">
                            <i-input class="kld-input"
                                     v-model="otherInfo.warrantyStatus"
                                     disabled
                                     placeholder="保修状态"></i-input>
                        </form-item>
                    </i-col>
                </i-row>
            </div>
            <div class='warranty-info-wrap'>
                <kld-type title="报修信息"></kld-type>
                <i-row class-name="warranty-infos">
                    <i-col :span="13">
                        <form-item label="错误代码：">
                            <i-input class="kld-input"
                                     :maxlength="100"
                                     v-model="formModel.errCode"
                                     placeholder=""></i-input>
                        </form-item>
                    </i-col>
                    <i-col :span="13">
                        <span style="position:absolute;top:8px;left:66px;color:rgb(153, 153, 153);">
                            （最多添加5个标签）
                        </span>
                        <form-item label="报单标签：">
                            <i-select class="kld-select"
                                      v-model="formModel.labelIds"
                                      multiple
                                      placeholder=""
                                      @on-change="countLimit">
                                <i-option v-for="v of labelList"
                                          :key="v.id"
                                          :value="v.id">{{v.labelName}}</i-option>
                            </i-select>
                        </form-item>
                    </i-col>
                    <i-col :span="24">
                        <form-item label="故障描述："
                                   prop="errContent">
                            <i-input type="textarea"
                                     v-model="formModel.errContent"
                                     ::='500'
                                     :autosize="{minRows:4}"
                                     placeholder=""></i-input>
                        </form-item>
                    </i-col>
                    <i-col :span="24">
                        <span style="position:absolute;top:8px;left:66px;color:rgb(153, 153, 153);">
                            (点击或拖拽图片到该区域，即可完成上传。)
                        </span>
                        <form-item label="故障图片：">
                            <c-upload :fileList="formModel.photos"
                                      :imgURLs="otherInfo.imgURLs"></c-upload>
                        </form-item>
                        <div style="font-size:14px;">
                            支持上传最多5张图片或单个图片最大3M
                        </div>
                    </i-col>
                </i-row>

            </div>
        </Form>
        <div class='button-bar'>
            <template v-if="!isReopen">

                <i-button class="kld-btn-default"
                          @click="goBack">取消</i-button>
                <i-button class='kld-btn'
                          @click="checkSubmit"
                          :loading="loading">提交</i-button>
            </template>
            <template v-else>
                <i-button class="kld-btn-default"
                          @click="reopenGoBack">取消</i-button>
                <i-button class='kld-btn'
                          @click="checkReSubmit"
                          :loading="loading">重新打开</i-button>
            </template>
        </div>
        <Modal v-model="isSelectAsset"
               title='选择报修设备'
               @on-visible-change='visibleChange'
               :mask-closable='false'
               class-name='create-singer-assets-wrap'
               :styles='{top:"-38px"}'
               width="900">
            <i-row type='flex'
                   class-name="madal-content-wrap"
                   :gutter="10">
                <i-col :span="6">
                    <kld-side-tree :data='departmentTree'
                                   :props="{label:'osName'}"
                                   v-model="departmentId"
                                   first-expand
                                   show-input
                                   placeholder="科室搜索"
                                   @current-change="changeDepartment"></kld-side-tree>
                </i-col>
                <i-col :span="18">
                    <i-input class="kld-input"
                             v-model="inputKeyworld"
                             @on-change="keywordChange"
                             @on-focus='keywordFocus'
                             @on-blur="keywordBlur"
                             placeholder="请输入关键字"></i-input>
                    <div class='table-wrap'>
                        <table class="table-item">
                            <thead>
                                <tr>
                                    <th v-for="(column,index) of table.columns"
                                        :style="{width:column.width}"
                                        :key='index'>
                                        <div>
                                            {{column.label}}
                                        </div>
                                    </th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="(row,i) of table.data"
                                    @click.stop="selectAsset(row)"
                                    :class='{"current-asset":row.id===formModel.assetId}'
                                    :key='i'>
                                    <td v-for="(column,index) of table.columns"
                                        :key='index'>
                                        <div v-ellipsis-tooltip="row[column.key]" :style='{width:"100%",height:"100%","text-align":column.align,"line-height":"43px"}'
                                             >
                                            {{row[column.key]}}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                        <div class="no-data-view"
                             v-if="!table.data.length&&!table.loading">
                            暂无数据
                        </div>
                        <kld-page :current='page.current'
                                  :page-size="page.size"
                                  :total="page.total"
                                  @on-change="loadAssetTable"
                                  style="margin-top:10px;"></kld-page>
                        <kld-loading v-if="table.loading"></kld-loading>
                    </div>
                </i-col>
            </i-row>
            <div slot="footer"
                 class="modal-footer-wrap">
                <i-button @click="isSelectAsset=false"
                          class="kld-btn-default">取消</i-button>
                <i-button @click="checkSelect"
                          class="kld-btn" >确认</i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
import kldType from "@common/kld-type";
import cUpload from "@common/C-Upload/C-upload";
import { uploadImg } from "@common/C-Upload/uploadImgAPI";
import kldConfirm from "@common/kld-confirm/index";
import poptipShowInfo from "@common/poptip-show-info";
import kldSideTree from "@common/kld-side-tree";
import kldPage from "@common/page/index";
import kldLoading from "@common/loading/loading";
export default {
    name: "create-singer",
    components: {
        kldType,
        cUpload,
        kldSideTree,
        poptipShowInfo,
        kldPage,
        kldLoading
    },
    data() {
        return {
            loading: false,
            isSelectAsset: false,
            formModel: {
                assetId: "",
                assertName: "",
                createName: this.$store.state.user_in.name,
                labelIds: [],
                orgName: "",
                orgid: "",
                repair: null,
                inFaustEventsID: null,
                errCode: "",
                errContent: "",
                photos: []
            },
            otherInfo: {
                assetClass: "",
                assertTypeName: "",
                warrantyStatus: "",
                createId: this.$store.state.user_in.id,
                imgURLs: []
            },
            formRules: {
                assetId: [
                    {
                        required: true,
                        message: "该项为必填项",
                        trigger: "change"
                    }
                ],
                errContent: [{ required: true, message: "该项为必填项！" }]
            },
            page: {
                total: 0,
                current: 1,
                size: 10
            },
            table: {
                columns: [
                    {
                        key: "assetName",
                        label: "设备名称",
                        align: "center"
                    },
                    {
                        key: "assetCode",
                        label: "设备编码",
                        align: "center"
                    },
                    {
                        key: "assetClass",
                        label: "设备型号",
                        align: "center"
                    },
                    {
                        key: "brandName",
                        label: "设备品牌",
                        align: "center"
                    }
                ],
                loading: false,
                data: [],
                currentAsset: null
            },
            responses: [
                "该设备已报修，正在等待工程师接单！",
                "该设备已报修，工程师正在紧急维修中！",
                "该设备维修已完成，等待报修人验收！",
                undefined,
                "该设备已报修，工程师正在紧急维修中！",
                undefined,
                "该资产所在科室没有关联工程师,请先关联工程师后在进行操作！",
                "只能在自己所关联的科室新增报单！"
            ],

            departmentTree: [],
            departmentId: this.$store.state.user_in.osId,
            labelList: [],
            inputKeyworld: "",
            timer: null,
            isInputKeywordSearch: false
        };
    },
    computed: {
        osId() {
            return this.$store.state.user_in.osId;
        },
        keyword() {
            return this.inputKeyworld || undefined;
        },
        //是否是重开
        isReopen() {
            return !!this.$route.params.id;
        },
        reopenId() {
            return this.$route.params.id;
        }
    },
    created() {
        this.loadDepartment();
        this.loadLabels();
        this.loadReopenData();
    },
    methods: {
        countLimit(data) {
            if (data.length > 5) {
                this.$Message.warning("最多添加5个标签！");
                this.formModel.labelIds = data.slice(0, 5);
            }
        },
        async loadDepartment() {
            try {
                const { data } = await this.$axios.get(
                    `/orgstruct/findAllTree/${this.osId}`
                );
                this.departmentTree = [data];
            } finally {
            }
        },
        async loadReopenData() {
            if (!this.isReopen) {
                return;
            }
            const { data } = await this.$axios.get(
                `/faultReport/${this.reopenId}`
            );
            const { asset } = data;
            // this.currentAsset = assetInfo;
            this.formModel.assetId = asset.id;
            this.formModel.assertName = asset.assetName;
            this.formModel.orgName = asset.osName;
            this.formModel.orgid = asset.departmentId;
            this.otherInfo.assetClass = asset.assetClass;
            this.otherInfo.assertTypeName = asset.assertTypeName;

            this.otherInfo.warrantyStatus = this.checkWarranty(
                asset.assetWarrntyDate
            );
            this.otherInfo.assetCode = asset.assetCode;

            this.formModel.photos = data.photos || [];
            this.otherInfo.imgURLs = data.photos
                ? data.photos.map(v => this.upfile_ + v.photoUrl)
                : [];
            this.formModel.labelIds = data.labels
                ? data.labels.map(({ id, labelName }) => id)
                : [];
            this.formModel.errCode = data.errCode;
            this.formModel.errContent = data.errContent;
        },
        checkSubmit() {
            kldConfirm({
                title: "新增报单",
                content: "确认新增报单？",
                okText: "确认",
                cancelText: "取消",
                ok: () => {
                    console.log(this);
                    this.$refs["create-singer-form"].validate(valid => {
                        if (!valid) {
                            return this.$Message.warning(
                                "请 修改错误/填写必要 信息后提交！"
                            );
                        }
                        this.doSubmit();
                    });
                }
            });
        },
        checkReSubmit() {
            kldConfirm({
                title: "重新打开报单",
                content: "确认重新打开此报单？",
                okText: "确认",
                cancelText: "取消",
                ok: () => {
                    console.log(this);
                    this.$refs["create-singer-form"].validate(valid => {
                        if (!valid) {
                            return this.$Message.warning(
                                "请 修改错误/填写必要 信息后提交！"
                            );
                        }
                        this.doSubmit();
                    });
                }
            });
        },
        goBack() {
            kldConfirm({
                title: "取消报单",
                content: "离开本页面后，所有信息将不会保存，确认取消新增报单？",
                okText: "确认",
                cancelText: "取消",
                ok: () => {
                    this.$router.go(-1);
                }
            });
        },
        reopenGoBack() {
            kldConfirm({
                title: "取消重新打开报单",
                content:
                    "离开本页面后，所有信息将不会保存，确认取消重新打开此报单？",
                okText: "确认",
                cancelText: "取消",
                ok: () => {
                    this.$router.go(-1);
                }
            });
        },
        doSubmit(isReopen = this.isReopen) {
            this.loading = true;
            uploadImg
                .call(this, this.formModel.photos, 1)
                .then(res => {
                    let photos = isReopen
                        ? [
                              ...res.map(v => v.data),
                              ...this.formModel.photos.filter(v => !v.type)
                          ]
                        : res.map(v => v.data);

                    let requestBody = {
                        id: isReopen ? this.reopenId : undefined,
                        ...this.formModel,
                        photos
                    };
                    return this.$axios.post(
                        `/faultReport/${this.osId}`,
                        requestBody
                    );
                })
                .then(res => {
                    !isReopen
                        ? this.$Message.success("报单提交成功！")
                        : this.$Message.success("重新打开报单成功！");
                    this.$router.go(-1);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        doSelectAsset() {
            this.isSelectAsset = true;
        },
        visibleChange(flag) {},
        checkSelect() {
            this.isSelectAsset = false;
        },
        changeDepartment(data, node) {
            if (this.isInputKeywordSearch) {
                return;
            }
            this.inputKeyworld = "";
            this.loadAssetTable();
        },
        async loadAssetTable(
            page = 1,
            departmentId = this.departmentId,
            keyword = this.keyword
        ) {
            this.page.current = page;
            this.table.loading = true;
            try {
                let requestBody = {
                    limit: this.page.size,
                    offset: (this.page.current - 1) * this.page.size,
                    params: {
                        departmentId,
                        keyword
                    }
                };
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(
                    `assets/${this.osId}/list`,
                    requestBody
                );
                this.table.data = data || [];
                this.page.total = recordsTotal;
            } finally {
                this.table.loading = false;
            }
        },
        async loadLabels() {
            const { data } = await this.$axios.post(`/labels/list/${2}`);
            this.labelList = data || [];
        },
        keywordChange(e) {
            this.departmentId = this.osId;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.loadAssetTable();
            }, 450);
        },
        keywordFocus() {
            this.isInputKeywordSearch = true;
        },
        keywordBlur() {
            this.isInputKeywordSearch = false;
        },
        async selectAsset(assetInfo) {
            const { data } = await this.$axios.get(
                `/faultReport/findAssetReport?id=${assetInfo.id}`
            );
            if (this.responses[data]) {
                return this.$Message.warning(this.responses[data]);
            }

            this.currentAsset = assetInfo;
            this.formModel.assetId = assetInfo.id;
            this.formModel.assertName = assetInfo.assetName;
            this.formModel.orgName = assetInfo.osName;
            this.formModel.orgid = assetInfo.departmentId;
            this.otherInfo.assetClass = assetInfo.assetClass;
            this.otherInfo.assertTypeName = assetInfo.typeName;

            this.otherInfo.warrantyStatus = this.checkWarranty(
                assetInfo.assetWarrntyDate
            );
            this.otherInfo.assetCode = assetInfo.assetCode;

            this.isSelectAsset = false;
        },
        checkWarranty(WarrantyDate) {
            let index;
            let date = new Date();
            if (WarrantyDate) {
                index = date - new Date(WarrantyDate + " 23:59:59") > 0 ? 2 : 1;
            } else {
                index = 0;
            }
            return ["未设置过保日期", "在保", "过保"][index];
        },
        viewDetails() {
            if (!this.checkLimit("ass:query")) {
                this.$Message.warning("您没有权限查看设备详情！");
                return;
            }

            if (this.formModel.assetId) {
                this.$router.push({
                    name: "asset-details",
                    params: { id: this.formModel.assetId }
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.create-singer {
    width: 100%;
    height: 100%;
    padding: 15px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    background-color: #fafafa;
    border-radius: 3px;
    .basic-info-wrap {
        .asset-name-item-wrap {
            position: relative;
            .view-details {
                color: #5ba4c8;
                position: absolute;
                z-index: 20;
                top: 9px;
                right: 1px;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                    color: darken(#5ba4c8, 6.5%);
                }
            }
            .asset-name-item {
                width: calc(~"100% - 103px");
            }
            .view-asset-btn {
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
    }
    .warranty-info-wrap {
        .warranty-infos {
            .ivu-col {
                position: relative;
                margin-bottom: 15px;
            }
        }
    }
    .button-bar {
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .ivu-btn {
            margin-right: 15px;
        }
    }
    /deep/.ivu-form-item-label {
        font-size: 14px;
    }
}
/deep/.create-singer-assets-wrap {
    .madal-content-wrap {
        height: 600px;
        position: relative;
        .table-wrap {
            width: 100%;
            padding: 15px 20px;
            position: relative;
            .table-item {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
                td,
                th {
                    border-bottom: 1px solid #dddee1;
                    height: 43px;
                }
                th {
                    font-size: 14px;
                }
                td {
                    cursor: pointer;
                    transition: 0.3s ease-in-out;
                }
                tr:hover {
                    td {
                        background-color: rgba(84, 183, 248, 0.3);
                    }
                }
                tr.current-asset {
                    td {
                        background-color: rgb(20, 156, 248);
                        color: white;
                    }
                }
            }
            .no-data-view {
                width: 100%;
                height: 43px;
                text-align: center;
                line-height: 43px;
                border-bottom: 1px solid #dddee1;
            }
        }
    }
}
</style>


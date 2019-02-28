<template>
    <div class="borrow-apply-approval kld-box-effect">
        <Loading v-if="formLoading"></Loading>
        <Form :model="formData" :rules="formRules/*isApply ? formRules : {}*/" ref="apply-form" label-position="top">
            <kld-title>申请信息</kld-title>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="申请人：">
                        <poptip-show-info :info-id="detailsData.createId" width="100%">
                            <i-input :value="detailsData.createName" class="kld-input" disabled></i-input>
                        </poptip-show-info>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="申请科室：">
                        <i-input :value="detailsData.osName" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="申请借用设备：">
                        <i-input :value="detailsData.assetName" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
            </Row>
            <Row :gutter="20">
                <i-col span="8">
                    <FormItem label="借用数量：">
                        <i-input :value="detailsData.assetNumber" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="预计借用时长：">
                        <i-input :value="detailsData.hours" class="kld-input" disabled></i-input>
                    </FormItem>
                </i-col>
                <i-col span="8">
                    <FormItem label="费用类型：">
                        <RadioGroup :value="detailsData.money" size="large">
                            <Radio label="0" disabled>无偿</Radio>
                            <Radio label="1" disabled>有偿</Radio>
                        </RadioGroup>
                    </FormItem>
                </i-col>
            </Row>
            <FormItem label="备注：">
                <i-input :value="detailsData.borrowNote" type="textarea" :rows="4" disabled></i-input>
            </FormItem>

            <template v-if="! isApply || approvalLimit">
                <kld-title>审批信息</kld-title>
                <FormItem label="审批意见：" prop="ratifyIdea">
                    <RadioGroup v-if="isApply" v-model="formData.ratifyIdea" size="large">
                        <Radio :label="1">同意</Radio>
                        <Radio :label="2">拒绝</Radio>
                    </RadioGroup>
                    <RadioGroup v-else size="large" :value="formData.ratifyIdea">
                        <Radio v-if="formData.ratifyIdea === 1" disabled :label="formData.ratifyIdea">同意</Radio>
                        <Radio v-else-if="formData.ratifyIdea === 2" disabled :label="formData.ratifyIdea">拒绝</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-show="formData.ratifyIdea === 1" label="调剂设备：" prop="assetIds">
                    <div class="c-table">
                        <Table :columns="selectedTableColumns" :data="selectedTableData"></Table>
                        <div v-if="isApply" class="add-btn-wrap">
                            <add-btn @click="addAsset">新增设备</add-btn>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="备注：" prop="ratifynote">
                    <i-input :disabled="! isApply" v-model.trim="formData.ratifynote" :placeholder="isApply ? '请填写' : ''" :rows="4" type="textarea"></i-input>
                </FormItem>
            </template>
        </Form>

        <div class="kld-form-footer">
            <Button v-if="approvalLimit && isApply" :loading="submitLoading" @click="formSubmit" class="kld-btn">提交审批</Button>
            <Button @click="goBack" class="kld-btn-default">返回</Button>
        </div>

        <template v-if="isApply && approvalLimit">
            <Modal v-model="confirmModalShow" title="申请审批" :width="460" class-name="vertical-center-modal">
                <div class="confirm-modal">
                    <img style="margin-bottom: 30px;" src="@/img/warning.png" alt="">
                    <p class="kld-error">申请科室对借用设备存在业务必要性，请谨慎拒绝。</p>
                </div>
                <div class="confirm-modal-footer" slot="footer">
                    <Button @click="confirmModalShow = false" class="kld-btn-default btn-default">取消</Button>
                    <Button @click="formSubmit(true)" class="kld-btn-error">拒绝</Button>
                </div>
            </Modal>

            <Modal v-model="assetModalShow" title="闲置设备" :width="1250">
                <div class="add-asset-modal">
                    <div class="asset-search kld-box-effect">
                        <Form :model="assetSearchData" ref="asset-search-form">
                            <Row type="flex" :gutter="20" justify="space-between">
                                <i-col>
                                    <Row type="flex" :gutter="20">
                                        <i-col>
                                            <FormItem prop="keyword">
                                                <i-input v-model="assetSearchData.keyword" class="kld-input" placeholder="设备编码/设备名称/品牌"></i-input>
                                            </FormItem>
                                        </i-col>
                                        <i-col>
                                            <FormItem prop="charge">
                                                <Select v-model="assetSearchData.charge" class="kld-select" placeholder="费用类型">
                                                    <Option :value="1">无偿</Option>
                                                    <Option :value="2">有偿</Option>
                                                </Select>
                                            </FormItem>
                                        </i-col>
                                    </Row>
                                </i-col>
                                <i-col>
                                    <div>
                                        <Button @click="resetSearchData" class="kld-btn-default">重置</Button>
                                    </div>
                                </i-col>
                            </Row>
                        </Form>
                    </div>

                    <div class="c-table">
                        <Loading v-show="assetModalLoading"></Loading>
                        <Table :columns="assetModalTableColumns" :data="assetModalTableData" ref="idle-asset-table"></Table>
                        <div class="c-table-page">
                            <kld-page @on-change="getIdleAssets" :current.sync="assetModalPageData.current" :total="assetModalPageData.total" :page-size="assetModalPageData.pageSize"></kld-page>
                        </div>
                    </div>
                </div>
                <template slot="footer">
                    <Button @click="assetModalShow = false" class="kld-btn-default">取消</Button>
                    <Button @click="assetModalConfirm" class="kld-btn">确认</Button>
                </template>
            </Modal>
        </template>
    </div>
</template>

<style lang="less" scoped>
.btn-default {
    background-color: #dedede;
    border-color: #dedede;
    color: #666;
}
.borrow-apply-approval {
    position: relative;
    padding: 0 30px 30px 30px;

    .ivu-form-item {
        margin-top: 26px;
    }
    .kld-form-footer {
        .kld-btn {
            margin-left: 20px;
        }
    }

    .add-btn-wrap {
        padding: 10px 20px;
        .add-btn {
            background-color: #f5f6fa;
        }
    }
}

.c-table {
    position: relative;
    background-color: #fff;
}

.add-asset-modal {
    .kld-box-effect {
        box-shadow: none;
    }
    .asset-search {
        margin-bottom: 14px;
        .kld-input,
        .kld-select {
            width: 330px;
        }
    }
}
.confirm-modal-footer {
    text-align: center;
    .ivu-btn {
        width: 120px;
    }
}
.confirm-modal {
    text-align: center;
}
</style>

<script>
    import kldTitle from "../common/kld-title";
    import kldPage from "@common/page/page";
    import addBtn from "@inspection-common/add-btn";
    import renderEllipsis from "../common/render-ellipsis";
    import kldConfirm from "@common/kld-confirm";
    import testLimit from "@common/test-limit";
    import poptipShowInfo from '@common/poptip-show-info';


    export default {
    name: "borrow-apply-approval",
    components: { kldTitle, kldPage, addBtn , poptipShowInfo},
    data() {
        return {
            submitLoading: false,

            approvalLimit: testLimit("borrow:ratify"),
            isApply: false,

            selectedTableData: [],
            selectedTableCacheData: [],
            tableColumnsBase: [
                {
                    title: "费用类型",
                    render(h, { row: { charge } }) {
                        switch (charge) {
                            case null:
                                return h("p", "未设置");
                            case "0":
                                return h("p", { class: "kld-success" }, "无偿");
                            default:
                                return h(
                                    "p",
                                    { class: "kld-error" },
                                    `￥${charge}`
                                );
                        }
                    }
                },
                {
                    title: "资产编码",
                    render: (h, { row: { assetCode } }) =>
                        renderEllipsis(h, assetCode, 'text-uppercase')
                },
                {
                    title: "资产名称",
                    render: (h, { row: { assetName } }) =>
                        renderEllipsis(h, assetName)
                },
                {
                    title: "品牌",
                    render: (h, { row: { brandName } }) =>
                        renderEllipsis(h, brandName)
                },
                {
                    title: "型号",
                    render: (h, { row: { assetClass } }) =>
                        renderEllipsis(h, assetClass)
                },
                {
                    title: "设备分类",
                    render: (h, { row: { typeName } }) =>
                        renderEllipsis(h, typeName)
                },
                {
                    title: "所属科室",
                    render: (h, { row: { osName } }) =>
                        renderEllipsis(h, osName)
                }
            ],
            selectedTableColumns: [
                {
                    title: "操作",
                    render: (h, { index }) => {
                        return h(
                            "a",
                            {
                                attrs: {
                                    href: "javascript:"
                                },
                                on: {
                                    click: () => {
                                        kldConfirm({
                                            content: "确认移除此设备信息",
                                            ok: () => {
                                                this.selectedTableData.splice(
                                                    index,
                                                    1
                                                );
                                            }
                                        });
                                    }
                                }
                            },
                            "移除"
                        );
                    }
                }
            ],

            detailsData: {},
            formRules: {
                ratifyIdea: {
                    required: true,
                    message: "审批意见为必选"
                },
                assetIds: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (
                            this.formData.ratifyIdea === 1 &&
                            value.length === 0
                        ) {
                            callback(new Error("请选择调剂设备"));
                        } else {
                            callback();
                        }
                    }
                }
            },
            formData: {
                id: "",
                ratifyid: "",
                ratifyName: "",
                ratifyIdea: "",
                ratifynote: "",
                assetIds: []
            },
            formLoading: false,

            assetModalLoading: false,
            assetModalShow: false,
            assetSearchData: {
                returnType: "1",
                keyword: "",
                charge: ""
            },
            assetModalTableData: [],
            assetModalTableColumns: [
                { type: "selection", width: 60, align: "center" }
            ],

            assetModalPageData: {
                current: 1,
                pageSize: 10,
                total: 0
            },

            confirmModalShow: false
        };
    },
    computed: {
        routeId() {
            return this.$route.query.id;
        },

        user_in() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.getDetails().then(data => {
            if (data.ratifyType === 0) {
                this.isApply = true;

                if (this.approvalLimit) {
                    this.selectedTableColumns = this.tableColumnsBase.concat(
                        this.selectedTableColumns
                    );
                    this.assetModalTableColumns = this.assetModalTableColumns.concat(
                        this.tableColumnsBase
                    );

                    this.formData.id = this.routeId;
                    this.formData.ratifyid = this.user_in.id;
                    this.formData.ratifyName = this.user_in.name;

                    //初始化闲置设备选择框的事件
                    this.$nextTick(this.assetSelectInit);

                    //同时监听闲置设备选择框的显隐和其中的搜索参数的变化
                    this.$watch(
                        () => {
                            let result = this.assetModalShow;

                            if (result) {
                                for (const key of Object.keys(
                                    this.assetSearchData
                                )) {
                                    result += this.assetSearchData[key];
                                }
                            }

                            return result;
                        },
                        newVal => {
                            //当值不为false时 刷新限制设备列表的显示
                            if (newVal) {
                                this.selectedTableCacheData = [];
                                this.assetModalPageData.current = 1;
                                this.getIdleAssets();
                            }
                        }
                    );
                }
            } else {
                //当审批结果为同意时才显示借出的设备列表
                if (data.ratifyIdea === 1) {
                    for (const asset of data.assets) {
                        asset.typeName = asset.atName;
                    }

                    this.selectedTableData = data.assets;
                }

                this.formData.ratifyIdea = data.ratifyIdea;
                this.formData.ratifynote = data.ratifyNote;

                this.selectedTableColumns = this.tableColumnsBase;
            }
        });
    },

    watch: {
        selectedTableData(data) {
            this.formData.assetIds = data.map(({ assetId }) => assetId);
            this.$refs["apply-form"].validateField("assetIds");
        }
    },

    methods: {
        //获取详情数据
        getDetails() {
            this.formLoading = true;
            return this.$axios
                .get(`/assetBorrow/getBorrowApply/${this.routeId}`)
                .then(({ data }) => {
                    //如果用户的所属科室和借用审批的科室相同则不允许审批
                    // data.osId === this.user_in.groupId &&
                    //     (this.approvalLimit = false);

                    //因为money不是0.0 则为有偿设备 所以给money一个固定值
                    data.money !== "0" && (data.money = "1");

                    this.detailsData = data;

                    return data;
                })
                .finally(() => {
                    this.formLoading = false;
                });
        },

        //获取闲置设备列表
        getIdleAssets() {
            this.assetModalLoading = true;
            return this.$axios
                .post("/assetBorrow/listAsset", {
                    offset:
                        (this.assetModalPageData.current - 1) *
                        this.assetModalPageData.pageSize,
                    limit: this.assetModalPageData.pageSize,
                    params: this.assetSearchData
                })
                .then(({ data: { data, recordsTotal } }) => {
                    const selectCacheData = this.selectedTableCacheData;

                    for (const asset of data) {
                        if (
                            selectCacheData.some(
                                ({ assetId }) => asset.assetId === assetId
                            )
                        ) {
                            asset._checked = true;
                        }
                    }

                    this.assetModalTableData = data;
                    this.assetModalPageData.total = recordsTotal;
                })
                .finally(() => {
                    this.assetModalLoading = false;
                });
        },

        //点击新增设备按钮 打开闲置设备modal
        addAsset() {
            this.resetSearchData();
            this.assetModalShow = true;

            this.$nextTick(
                () =>
                    (this.selectedTableCacheData = JSON.parse(
                        JSON.stringify(this.selectedTableData)
                    ))
            );
        },



        //提交审批
        formSubmit(pass = false) {

            this.$refs["apply-form"].validate(valid => {
                if (valid) {
                    const submit = () => {
                        this.submitLoading = true;
                        this.confirmModalShow = false;

                        return this.$axios
                            .post("/assetBorrow/ratifyborrowApply", {
                                ...this.formData,
                                ...(this.formData.ratifyIdea === 2
                                    ? { assetIds: [] }
                                    : {})
                            })
                            .then(() => {
                                this.$Message.success("审批成功");
                                this.goBack();
                            })
                            .finally(() => this.submitLoading = false);
                    };

                    if (pass === true) {
                        submit();
                    } else if (this.formData.ratifyIdea !== 2) {
                        kldConfirm({
                            content: '确认提交审批',
                            ok: submit
                        });
                    } else {
                        this.confirmModalShow = true;
                    }
                }
            });
        },

        //返回上一页
        goBack() {
            this.$router.go(-1);
        },

        //选择闲置设备的确定按钮
        assetModalConfirm() {
            this.selectedTableData = JSON.parse(
                JSON.stringify(this.selectedTableCacheData)
            );
            this.assetModalShow = false;
        },

        //闲置设备选择器的各种事件的初始化
        assetSelectInit() {
            const $table = this.$refs["idle-asset-table"];

            let isSelectCancel = false;

            //当table的行被带点击时使此行checked
            $table.$on("on-row-click", (row, index) => {
                $table.toggleSelect(index);
            });

            //每一行被checked时push进缓存数组
            $table.$on("on-select", (selection, row) => {
                this.selectedTableCacheData.push(row);
            });

            //每一行被取消checked时从缓存数组移除
            $table.$on("on-select-cancel", (selection, row) => {
                const index = this.selectedTableCacheData.findIndex(
                    ({ assetId }) => assetId === row.assetId
                );

                index !== -1 && this.selectedTableCacheData.splice(index, 1);

                isSelectCancel = true;
            });

            //全选时先判断每一条数据是否已经加入缓存数组，如果没有加入则push进缓存数组
            $table.$on("on-select-all", selection => {
                for (const asset of selection) {
                    if (
                        !this.selectedTableCacheData.some(
                            ({ assetId }) => assetId === asset.assetId
                        )
                    ) {
                        this.selectedTableCacheData.push(asset);
                    }
                }
            });

            //取消全选时将数据
            $table.$on("on-selection-change", selection => {
                //table没有取消全选的事件只能自己判断
                if (selection.length === 0 && !isSelectCancel) {
                    for (const asset of this.assetModalTableData) {
                        const index = this.selectedTableCacheData.findIndex(
                            ({ assetId }) => asset.assetId === assetId
                        );
                        if (index !== -1) {
                            this.selectedTableCacheData.splice(index, 1);
                        }
                    }
                } else {
                    isSelectCancel = false;
                }
            });
        },

        //重置闲置设备列表的搜索
        resetSearchData() {
            this.$refs["asset-search-form"].resetFields();
        }
        //
        // validateIdea() {
        //     this.$refs['apply-form'].validateField('ratifyIdea');
        // }
    }
};
</script>
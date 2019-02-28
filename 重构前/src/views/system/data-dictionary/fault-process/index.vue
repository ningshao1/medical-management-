<template>
    <div class="type-right-wrap">
        <i-input icon="ios-search"
                 class='search-input'
                 placeholder="请输入处理方案关键字"
                 v-model="keyWord"
                 clearable></i-input>
        <div class='type-title'>
            <h3>
                故障处理方案
            </h3>
            <i-button shape="circle"
                      icon='plus'
                      class='kld-btn add-btn'
                      @click="modifyShow"
                      :loading='modifyLoading'
                      v-if="checkLimit('fault:process:add')">新增处理方案</i-button>
        </div>
        <div class="type-list">
            <Loading v-if="tableLoading"></Loading>
            <Table :data="tableData"
                   :columns="tableColumns"
                   class="i-table-stripe"
                   border></Table>
            <div class="table-page">
                <kld-page :current.sync="pageData.currentPage"
                          :total="pageData.total"
                          :page-size="pageData.size"
                          @on-change="getOrigin"></kld-page>
            </div>
        </div>
        <Modal v-model="show.isShow"
               :title="show.isEdit ? '修改处理方案' : '新增处理方案'"
               class='type-modal'
               @on-visible-change="modalVisibleChange">
            <Form ref="sigin-type"
                  :model="siginFrom"
                  :rules='siginRuler'>
                <div class="type-modal-content">
                    <form-item label="处理方案"
                               prop='faultProcess'>
                        <i-input type="textarea"
                                 ref="faultProcess-input"
                                 :rows="4"
                                 :maxlength='200'
                                 clearable
                                 v-model="siginFrom.faultProcess"></i-input>
                    </form-item>
                </div>
            </Form>
            <div slot='footer'>
                <i-button class='kld-btn-default'
                          @click='show.isShow=false'>取消</i-button>
                <i-button class='kld-btn'
                          @click="modifyType"
                          :disabled="show.isEdit && currentValue === siginFrom.faultProcess"
                          :loading='modifyLoading'>确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import kldPage from "@common/page/page.vue";
import kldConfirm from "@common/kld-confirm";
import renderEllipsis from "@common/render-ellipsis";
export default {
    name: "fault-process",
    data() {
        return {
            keyWord: "",
            modifyLoading: false,
            pageData: {
                currentPage: 1,
                size: 10,
                total: 0
            },
            currentValue: "",
            show: {
                showType: "",
                isEdit: false,
                isShow: false
            },
            timer: null,
            modifyKey: "",
            siginFrom: {
                faultProcess: "",
                faultProcessId: ""
            },
            siginRuler: {
                faultProcess: { required: true, message: "请填写处理方案！" }
            },

            tableLoading: false,
            tableData: [],
            tableColumns: [
                {
                    title: "序号",
                    width: 70,
                    render: (h, { index }) => {
                        const {
                            pageData: { currentPage, size }
                        } = this;
                        return h("span", index + 1 + size * (currentPage - 1));
                    }
                },
                {
                    title: "处理方案",
                    render: (h, { row: { faultProcess } }) =>
                        renderEllipsis(h, faultProcess)
                },
                {
                    title: "创建人",
                    width: 200,
                    render: (h, { row: { operateName } }) =>
                        renderEllipsis(h, operateName)
                },
                {
                    title: "操作",
                    width: 100,
                    render: (
                        h,
                        { row: { faultProcessId: id, faultProcess } }
                    ) => {
                        return h("div", [
                            this.checkLimit("fault:process:edit")
                                ? h(
                                      "a",
                                      {
                                          attrs: {
                                              href: "javascript:",
                                              class: "table-control-a"
                                          },
                                          style: { marginRight: "10px" },
                                          on: {
                                              click: () => {
                                                  this.show.isEdit = true;
                                                  this.show.isShow = true;
                                                  this.siginFrom.faultProcessId = id;
                                                  this.siginFrom.faultProcess = this.currentValue = faultProcess;
                                                  this.inputFocus();
                                              }
                                          }
                                      },
                                      "修改"
                                  )
                                : "",
                            this.checkLimit("fault:process:del")
                                ? h(
                                      "a",
                                      {
                                          attrs: {
                                              href: "javascript:",
                                              class: "table-control-a"
                                          },
                                          on: {
                                              click: () => {
                                                  kldConfirm({
                                                      content:
                                                          "确认删除此处理方案？",
                                                      ok: async () => {
                                                          await this.$axios.delete(
                                                              `fault/delProcess/${id}`
                                                          );
                                                          this.$Message.success(
                                                              "删除成功"
                                                          );
                                                          this.getOrigin();
                                                      }
                                                  });
                                              }
                                          }
                                      },
                                      "删除"
                                  )
                                : ""
                        ]);
                    }
                }
            ]
        };
    },
    computed: {
        osId() {
            return this.$store.state.user_in.osId;
        }
    },
    watch: {
        keyWord() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.getOrigin();
            }, 200);
        }
    },
    components: {
        kldPage
    },
    created() {
        this.getOrigin();
    },
    methods: {
        async getOrigin() {
            //获得初始数据
            const { pageData } = this,
                { currentPage, size } = pageData;

            this.tableLoading = true;
            try {
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post("fault/listFaultProcess", {
                    limit: size,
                    offset: (currentPage - 1) * size,
                    params: {
                        hosptialId: this.osId,
                        faultProcess: this.keyWord
                    }
                });
                console.log(data);
                if (data.length === 0 && currentPage !== 1) {
                    this.pageData.currentPage = 1;
                    this.getOrigin();
                    return;
                }
                this.tableData = data;
                pageData.total = recordsTotal;
            } finally {
                this.tableLoading = false;
            }
        },
        modifyShow() {
            this.show.showType = "新增处理方案";
            this.show.isShow = true;
            this.inputFocus();
        },
        inputFocus() {
            this.$nextTick(() => {
                this.$refs["faultProcess-input"].focus();
            });
        },
        modalVisibleChange(visible) {
            if (!visible) {
                this.$refs["sigin-type"].resetFields();
                this.show.isEdit = false;
            }
        },
        modifyType() {
            this.$refs["sigin-type"].validate(async valida => {
                if (valida) {
                    const {
                            show: { isEdit }
                        } = this,
                        requestConfig = {
                            data: {
                                ...this.siginFrom,
                                faultProcess: this.siginFrom.faultProcess.trimEnd()
                            }
                        };

                    let successMessage = "";
                    if (isEdit) {
                        requestConfig.url = "/fault/updateFaultProcess";
                        requestConfig.method = "PUT";
                        successMessage = "修改成功";
                    } else {
                        requestConfig.url = "/fault/addFaultProcess";
                        requestConfig.method = "POST";
                        successMessage = "新增成功";
                        delete requestConfig.data.faultProcessId;
                    }

                    this.modifyLoading = true;
                    try {
                        await this.$axios(requestConfig);
                        this.$Message.success(successMessage);
                        this.pageData.current = 1;
                        this.getOrigin();
                        this.show.isShow = false;
                    } finally {
                        this.modifyLoading = false;
                    }
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../common.less");
.type-list {
    padding: 10px;
    position: relative;
}
.table-page {
    padding-top: 10px;
}

.i-table-stripe {
    border-left: 1px solid #dddee1;
    border-top: 1px solid #dddee1;
    border-bottom: 0;
    .ivu-table {
        background-color: transparent;
    }
    tbody {
        tr:nth-child(2n) {
            td {
                background-color: #fafafa !important;
            }
        }
        tr:nth-child(2n + 1) {
            td {
                background-color: #f8f8f9 !important;
            }
        }
    }
    /deep/.table-control-a {
        color: rgb(91, 164, 200);
        font-size: 12px;
    }
}
</style>



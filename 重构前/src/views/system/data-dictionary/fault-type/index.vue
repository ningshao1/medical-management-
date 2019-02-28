<template>
    <div class="type-right-wrap faultType-right-wrap">
        <i-input icon="ios-search" class='search-input' placeholder="请输入故障类型关键字" v-model="keyWord" clearable></i-input>
        <div class='type-title'>
            <h3>
                故障类型
            </h3>
            <i-button shape="circle" icon='plus' class='kld-btn add-btn' @click="modifyShow('add')" :loading='modifyLoading' v-if="checkLimit('fault:type:add')">新增故障类型</i-button>
        </div>
        <div class="type-list">
            <Table border no-data-text='暂无故障类型' class="faultType-table i-table-stripe" height="520px" :loading='tableLoading' :columns="columns" :data='tableList'></Table>
            <kld-page :total='pageData.total' :pageSize='pageData.size' :current='pageData.currentPage' @on-change='searchList' style="margin-top:5px;"></kld-page>
        </div>
        <Modal v-model="show.isShow" :title="show.showType" class='type-modal' @on-visible-change='modifyModalChange'>
            <Form ref="sigin-type" :model="siginFrom" :rules='siginRuler'>
                <div class="type-modal-content">
                    <form-item label="故障类型" prop='modifyKey'>
                        <i-input type='textarea' ref="faultType-input" :autosize='{minRows:4}' :maxlength='200' clearable v-model="siginFrom.modifyKey"></i-input>
                    </form-item>
                </div>
            </Form>
            <div slot='footer'>
                <i-button class='kld-btn-default' @click='show.isShow=false'>取消</i-button>
                <i-button class='kld-btn' @click="modifyType" :disabled="query === 'edit' && currentValue === siginFrom.modifyKey" :loading='modifyLoading'>确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import kldPage from "@common/page/page.vue";
import kldConfirm from "@common/kld-confirm";
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
            show: {
                showType: "",
                isShow: false
            },
            timer: null,
            modifyKey: "",
            modifyId: "",
            siginFrom: {
                modifyKey: ""
            },
            siginRuler: {
                modifyKey: { required: true, message: "请填写故障类型！" }
            },
            currentValue: "",
            query: "",

            columns: [
                {
                    title: "序号",
                    key: "index",
                    width: 70,
                    align: "center"
                },
                {
                    title: "类型名称",
                    key: "faultType"
                },
                {
                    title: "创建人",
                    key: "operateName",
                    width: 200,
                    align: "center"
                },
                {
                    title: "操作",
                    key: "query",
                    width: 200,
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                                class: {
                                    "table-query-wrap": true
                                }
                            },
                            [
                                this.checkLimit("fault:type:edit")
                                    ? h(
                                          "span",
                                          {
                                              class: {
                                                  "table-edit-wrap": true
                                              },
                                              on: {
                                                  click: () => {
                                                      this.modifyShow(
                                                          "edit",
                                                          "修改故障类型",
                                                          params.row.faultTypeId
                                                      );
                                                      this.siginFrom.modifyKey = this.currentValue =
                                                          params.row.faultType;
                                                  }
                                              }
                                          },
                                          "修改"
                                      )
                                    : "",
                                this.checkLimit("fault:type:del")
                                    ? h(
                                          "span",
                                          {
                                              class: {
                                                  "table-delete-wrap": true
                                              },
                                              on: {
                                                  click: () => {
                                                      this.deleteShow(
                                                          params.row
                                                      );
                                                  }
                                              }
                                          },
                                          "删除"
                                      )
                                    : ""
                            ]
                        );
                    }
                }
            ],
            tableList: [],
            tableLoading: false
        };
    },
    watch: {
        keyWord(newKey) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.searchList();
            }, 200);
        }
    },
    components: {
        kldPage
    },
    created() {
        this.getOrigin();
    },
    computed: {
        userInfo() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        getOrigin() {
            //获得初始数据
            this.searchList();
        },
        modifyShow(query, showType = "新增故障类型", modifyId = "") {
            this.modifyId = modifyId;
            this.query = query;
            this.show.showType = showType;
            this.show.isShow = true;
            this.inputFocus();
        },
        inputFocus() {
            this.$nextTick(() => {
                this.$refs["faultType-input"].focus();
            });
        },
        modifyType() {
            this.$refs["sigin-type"].validate(valida => {
                if (valida) {
                    // resetFields
                    this.modifyLoading = true;
                    this.tableLoading = true;
                    if (this.query === "add") {
                        this.addType();
                    }
                    if (this.query === "edit") {
                        this.editType();
                    }
                    // setTimeout(() => {
                    //     this.modifyLoading = false;
                    //     this.show.isShow=false;
                    //     this.$refs['sigin-type'].resetFields();
                    // }, 1000);
                }
            });
        },

        addType() {
            this.$axios
                .post(`fault/addFaultType`, {
                    faultType: this.siginFrom.modifyKey.trimEnd()
                })
                .then(res => {
                    this.show.isShow = false;
                    this.$Message.success("该故障类型已添加成功");
                    this.searchList(this.pageData.currentPage);
                })
                .finally(res => {
                    this.modifyLoading = false;
                    this.tableLoading = false;
                });
                debugger
        },
        editType() {
            this.$axios
                .put(`fault/updateFaultType`, {
                    faultType: this.siginFrom.modifyKey.trimEnd(),
                    faultTypeId: this.modifyId
                })
                .then(res => {
                    this.$Message.success("该故障类型已修改");
                    this.show.isShow = false;
                    this.searchList(this.pageData.currentPage);
                })
                .finally(res => {
                    this.modifyLoading = false;
                    this.tableLoading = false;
                });
        },
        modifyModalChange(isShow) {
            if (!isShow) {
                this.$refs["sigin-type"].resetFields();
            }
        },
        searchList(page = 1) {
            this.pageData.currentPage = page;
            this.tableLoading = true;
            this.$axios
                .post(`fault/listFaultType`, {
                    limit: this.pageData.size,
                    offset:
                        this.pageData.size * (this.pageData.currentPage - 1),
                    params: {
                        faultType: this.keyWord,
                        hosptialId: this.userInfo.osId
                    }
                })
                .then(res => {
                    if (
                        res.data.data.length === 0 &&
                        this.pageData.currentPage !== 1
                    ) {
                        this.searchList();
                        return;
                    }
                    this.pageData.total = res.data.recordsTotal;
                    this.tableList = res.data.data.map((v, i) => {
                        return {
                            ...v,
                            index: (this.pageData.currentPage - 1) * 10 + i + 1
                        };
                    });
                })
                .finally(res => {
                    this.tableLoading = false;
                });
        },

        deleteShow(row) {
            kldConfirm({
                title: "提示",
                content: "是否删除",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    this.deleteType(row);
                },
                cancel: () => {
                    //取消按钮同上
                    console.log("cancel");
                }
            });
        },
        deleteType(row) {
            this.deleteLoading = true;
            this.$axios
                .delete(`fault/delType/${row.faultTypeId}`)
                .then(res => {
                    this.$Message.success("该故障类型已成功删除！");
                })
                .finally(res => {
                    this.deleteLoading = false;
                    this.searchList(this.pageData.currentPage);
                });
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../common.less");
.faultType-right-wrap {
    /deep/.faultType-table {
        // border:1px solid #dddee1;
        border-left: 1px solid #dddee1;
        border-top: 1px solid #dddee1;
        // border-bottom: 0;
        .table-edit-wrap {
            color: #5ba4c8;
            margin-right: 5px;
        }
        .table-delete-wrap {
            color: #5ba4c8;
            margin-left: 5px;
        }
        .ivu-table-body {
            > table {
                width: 100% !important;
            }
        }
    }
}
</style>






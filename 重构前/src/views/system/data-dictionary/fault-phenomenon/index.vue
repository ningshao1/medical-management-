<template>
    <div class="type-right-wrap">
        <i-input icon="ios-search" class='search-input' placeholder="请输入故障现象关键字" v-model="keyWord" clearable></i-input>
        <div class='type-title'>
            <h3>
                故障现象
            </h3>
            <i-button shape="circle" icon='plus' class='kld-btn add-btn' @click="modifyShow" :loading='modifyLoading' v-if='checkLimit("fault:phenomenon:add")'>新增故障现象</i-button>
        </div>
        <div class='type-list'>
            <Loading v-if="loading"></Loading>
            <Table class="i-table-stripe phenomenon-table" border :columns="columns7" :data="phenomenonData"></Table>
        </div>
        <div style="padding:0px 0;text-align:center;">
            <page :total='page.total' :current.sync='page.current' :page-size='page.pageSize' @on-change='getOrigin'></page>
        </div>

        <Modal v-model="show.isShow" :title="show.showType" class='type-modal' @on-visible-change='onVisibleChange'>
            <Form ref="sigin-type" :model="siginFrom" :rules='siginRuler'>
                <div class="type-modal-content">
                    <form-item label="故障现象" prop='modifyKey'>
                        <i-input :maxlength='200' ref="modifyKey-input" clearable v-model="siginFrom.modifyKey" type="textarea" :rows="4"></i-input>
                    </form-item>
                </div>
            </Form>
            <div slot='footer'>
                <i-button class='kld-btn-default' @click='show.isShow=false'>取消</i-button>
                <i-button class='kld-btn' @click="modifyType" :disabled="judgeType === 0 && currentValue === siginFrom.modifyKey" :loading='modifyLoading'>确定</i-button>
            </div>

        </Modal>
    </div>
</template>
<script>
import kldPage from "@common/page/page.vue";
import kldConfirm from "@common/kld-confirm";
export default {
    name: "fault-phenomenon",
    data() {
        return {
            loading: false,
            keyWord: "",
            modifyLoading: false,
            show: {
                showType: "",
                isShow: false
            },
            timer: null,
            modifyKey: "",
            siginFrom: {
                modifyKey: ""
            },
            siginRuler: {
                modifyKey: { required: true, message: "请填写故障现象！" }
            },
            currentValue: "",
            columns7: [
                {
                    width: 100,
                    title: "序号",
                    key: "order",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                style: {
                                    color: params.row.flag ? "#5ba4c8" : ""
                                }
                            },
                            String(
                                params.index + 1 + (this.page.current - 1) * 10
                            ).padStart(2, "0")
                        );
                    }
                },
                {
                    title: "故障现象",
                    key: "faultPhenomenon",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    class: "textEllipsis",
                                    title: params.row.faultPhenomenon
                                }
                            },
                            params.row.faultPhenomenon
                        );
                    }
                },
                {
                    title: "创建人",
                    key: "operateName"
                },
                {
                    width: 150,
                    title: "操作",
                    key: "operation",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {}
                            },
                            [
                                this.checkLimit("fault:phenomenon:edit")
                                    ? h(
                                          "span",
                                          {
                                              props: {
                                                  type: "primary",
                                                  size: "small"
                                              },
                                              style: {
                                                  marginRight: "5px",
                                                  fontSize: "14px",
                                                  color: "#5ba4c8",
                                                  cursor: "pointer"
                                              },
                                              on: {
                                                  click: () => {
                                                      this.changeButtonClick(
                                                          params.row
                                                      );
                                                  }
                                              },
                                              class: {
                                                  activeTableButton: true
                                              }
                                          },
                                          "修改"
                                      )
                                    : "",
                                this.checkLimit("fault:phenomenon:del")
                                    ? h(
                                          "span",
                                          {
                                              props: {
                                                  type: "primary",
                                                  size: "small"
                                              },
                                              style: {
                                                  marginRight: "5px",
                                                  fontSize: "14px",
                                                  color: "#5ba4c8",
                                                  cursor: "pointer"
                                              },
                                              on: {
                                                  click: () => {
                                                      this.deleteShow(
                                                          params.row
                                                      );
                                                  }
                                              },
                                              class: {
                                                  activeTableButton: true
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
            page: {
                pageSize: 10,
                total: 10,
                current: 1
            },
            phenomenonData: [],
            judgeType: 1,
            currentRow: {}
        };
    },
    watch: {
        keyWord(newKey) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.page.current = 1;
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
    computed: {
        singleCom() {
            return this.$refs["sigin-type"];
        }
    },
    methods: {
        //获得初始数据
        getOrigin() {
            this.loading = true;
            this.$axios
                .post(`fault/listFaultPhenomenon`, {
                    limit: this.page.pageSize,
                    offset: (this.page.current - 1) * this.page.pageSize,
                    params: {
                        faultPhenomenon: this.keyWord,
                        hosptialId: this.$store.state.user_in.osId
                    }
                })
                .then(({ data }) => {
                    if (data.data.length === 0 && this.page.current !== 1) {
                        this.page.current = 1;
                        this.getOrigin();
                        return;
                    }
                    this.phenomenonData = data.data;
                    this.page.total = data.recordsTotal;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onVisibleChange(status) {
            if (!status) {
                this.singleCom.resetFields();
            }
        },
        getList() {},
        modifyShow() {
            this.show.showType = "新增故障现象";
            this.show.isShow = true;
            this.judgeType = 1; //代表新增
            this.inputFocus();
        },
        inputFocus(){
            this.$nextTick(()=>{
                this.$refs['modifyKey-input'].focus();
            })
        },
        modifyType() {
            this.$refs["sigin-type"].validate(valida => {
                if (valida) {
                    debugger;
                    if (this.judgeType) {
                        this.postData();
                    } else {
                        this.changeType();
                    }
                }
            });
        },
        postData() {
            this.modifyLoading = true;
            this.$axios
                .post(`fault/addFaultPhenomenon`, {
                    faultPhenomenon: this.siginFrom.modifyKey.trimEnd()
                })
                .then(() => {
                    this.$Message.success("提交成功");
                    this.show.isShow = false;
                    this.page.current = 1;
                    this.getOrigin();
                })
                .finally(() => {
                    this.modifyLoading = false;
                });
        },
        deleteShow(row) {
            kldConfirm({
                title: "提示",
                content: "是否删除",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "删除", //确认取消文本  默认:取消
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
            console.log(row);
            this.$axios
                .delete(`fault/delPhenomenon/${row.faultPhenomenonId}`)
                .then(() => {
                    this.$Message.success(`删除成功`);
                    this.getOrigin();
                });
        },
        changeButtonClick(row) {
            this.show.showType = "修改故障现象";
            this.show.isShow = true;
            this.siginFrom.modifyKey = this.currentValue = row.faultPhenomenon;
            this.currentRow = row;
            this.judgeType = 0; //代表修改
            this.inputFocus();
        },
        changeType(row) {
            this.$axios
                .put(`fault/updateFaultPhenomenon`, {
                    faultPhenomenonId: this.currentRow.faultPhenomenonId,
                    faultPhenomenon: this.siginFrom.modifyKey.trimEnd()
                })
                .then(({ data }) => {
                    this.show.isShow = false;
                    this.$Message.success("修改成功");
                    this.currentRow.faultPhenomenon = this.siginFrom.modifyKey;
                });
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../common.less");
.type-list {
    padding: 15px;
    padding-bottom: 8px !important;
}
.activeTableButton {
    &:active {
        opacity: 0.6;
    }
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
}
</style>



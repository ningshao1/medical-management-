<template>
    <div class="contract-modal">
        <i-input v-model="name"
                 class="kld-input"
                 placeholder='请选择合同'
                 disabled></i-input>
        <i-button @click="contractShow=true"
                  class="kld-btn"
                  v-bind="$attrs">选择合同</i-button>
        <Modal title="选择合同"
               v-model="contractShow"
               class-name="vertical-center-modal one-step-modal contract-Modal"
               :styles='{width:"800px"}'>
            <div class="one-step-modal-content">
                <div class='one-step-tree'>
                    <div>
                        <ul class="typeList">
                            <li v-for='(item,i) in contractType'
                                :key='i'
                                :class="index===i?'click-li':''"
                                @click="index=i;page.current=1;getContract()">
                                <p>{{item}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class='one-step-table'>
                    <div>
                        <Input class="kld-input on-step-search"
                               placeholder="请输入关键词"
                               v-model="keyword"
                               icon='ios-search-strong'></Input>

                    </div>
                    <div class="one-asset modal-div">
                        <RadioGroup v-model="Id"
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
                                <tr v-for='(item,i) in contractList'
                                    :key='i'
                                    @click="clickRow(item)">
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
                            <kld-page :total='page.total'
                                      :current.sync='page.current'
                                      @on-change='getContract'></kld-Page>
                        </div>
                    </div>
                </div>
            </div>
            <div slot='footer'>
                <i-button type='text'
                          @click="cancel">取消</i-button>
                <i-button class="kld-btn"
                          @click="ensure">确定</i-button>
            </div>
        </Modal>
    </div>
</template>
<script>
import page from "@common/page/page";
export default {
    name: "kld-contract",
    props: ["value"],
    data() {
        return {
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
                total: 10,
                size: 10
            },
            contractList: [],
            keyword: "",
            Id: null,
            clickName: null
        };
    },
    watch: {
        keyword() {
            this.page.current = 1;
            this.getContract();
        }
    },
    computed: {
        name: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        }
    },
    components: {
        [page.name]: page
    },
    created() {
        this.getContract();
    },
    methods: {
        //获取合同
        getContract() {
            this.$axios
                .post(`contracts/${this.$store.state.user_in.osId}/list`, {
                    limit: this.page.size,
                    offset: (this.page.current - 1) * this.page.size,
                    params: {
                        contractType: this.index,
                        contractStatus: "0",
                        keyword: this.keyword
                    }
                })
                .then(({ data: { data, recordsTotal } }) => {
                    console.log(recordsTotal);
                    this.contractList = data;
                    this.page.total = recordsTotal;
                });
        },
        cancel() {
            this.contractShow = false;
        },
        ensure() {
            this.contractShow = false;
            this.name = this.clickName;
            this.$emit("click-row", this.Id);
        },
        clickRow({ id, contractName }) {
            this.clickName = contractName;
            this.Id = id;
        }
    }
};
</script>

<style lang="less" scoped>
.focus-li {
    background: #f3f3f3;
}
.click-li {
    color: #fff;
    background: rgba(45, 140, 240, 0.9);
}
.contract-modal {
    display: flex;
    > .kld-btn {
        margin-left: 8px;
    }
}
.one-asset {
    .one-asset-table {
        border: none;
        width: 100%;
        > tr {
            text-align: center;
            border-bottom: 1px solid #e2e2e2;
            cursor: pointer;
            > th {
                width: 25%;
                padding: 8px;
                font-size: 13px;
                color: #666;
                font-weight: 600;
                border: none;
            }

            > td {
                font-size: 13px;
                color: #666;
                font-size: 13px;
                padding: 6px;
                border: none;
            }
            > td:nth-of-type(4) {
                font-size: 13px;
                cursor: pointer;
            }
        }
    }
    .acceptance-tree-page {
        text-align: center;
        padding-top: 12px;
        background: #fafafa;
        margin-bottom: 10px;
    }
}
.one-step-modal-content {
    display: flex;
    min-height: 500px;
    .one-step-tree {
        flex: 1;
        margin-right: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        background: #fff;
        padding: 10px;
        padding-left: 0;
        padding-top: 0;
    }
    .asset-tree {
        padding-left: 8px;
        padding-top: 8px;
    }
    .one-step-table {
        background: #fafafa;
        flex: 3;
        padding: 10px;
        .kld-input {
            margin-bottom: 10px;
        }
    }
}
/deep/.contract-Modal {
    .ivu-modal-body {
        padding: 0;
    }
    .one-step-tree {
        background: #fafafa;
        margin-right: 0;
    }
    .typeList {
        > li {
            font-size: 14px;
            padding: 18px 12px;
            background-color: #f5f6fa;
            border-bottom: 1px solid #dce0e6;
            cursor: pointer;
            background: transparent;
            background: #fafafa;
        }
        .click-li {
            border-left: 3px solid #01b0c7;
            background: #fafafa;
            p {
                color: #01b0c7;
            }
        }
    }
}
</style>

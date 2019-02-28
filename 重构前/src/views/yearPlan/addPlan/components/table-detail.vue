<template>
    <div>
        <div class='table-detail'>
            <table class='table-stripe'
                   border="1"
                   style="border-collapse: collapse;">
                <tr style="height:38px;background:#f4f4f4;">
                    <th style="width:15%">序号</th>
                    <th style="width:15%">设备名称
                        <span style="color:#f2740c">*</span>
                    </th>
                    <th style="width:8%">申请数量

                    </th>
                    <th style="width:25%">审批数量
                        <span style="color:#f2740c">*</span>
                    </th>
                    <th style="width:10%">预算单价</th>
                    <th style="width:15%">意向品牌（多选）</th>
                    <th style="width:12%">备注</th>

                </tr>
                <tr v-for="(item,index) in tableData"
                    :key="index">
                    <td>
                        <Checkbox v-show="ViewLimit('ann:edit:record')&&currentStep===1"
                                  v-model="item.openType"
                                  :disabled="!ViewLimit('ann:edit:record')"
                                  @on-change='getcheckbox($event,item)'>
                        </Checkbox>{{(page.current-1)*10+index+1}}
                        <span v-show="item.openType"
                              style="color:#01b0c7">（已通过）
                        </span>
                    </td>
                    <td>{{item.ap_name}}</td>
                    <td>{{item.ap_number}}</td>
                    <td>
                        <Input type="text"
                               style="width:200px;height:40px;"
                               v-model="item.openNumber"
                               :disabled="!item.openType"></Input>
                    </td>
                    <td>{{item.ap_money}}元</td>
                    <td>{{item.ap_brand}}</td>
                    <td>{{item.ap_note}}</td>

                </tr>

            </table>
        </div>
        <kld-page :current.sync="page.current"
                  @on-change="getList"
                  :pageSize="page.size"
                  :total="page.total">
        </kld-Page>
    </div>
</template>
<script>
import page from "@common/page/page";
export default {
    name: "table-detail",
    props: {
        data: {
            type: Array,
            required: true
        },
        total: {
            type: Number
        },
        currentStep: {
            type: Number
        }
    },
    data() {
        return {
            tableData: this.data,
            checkInfo: [], //已选的数组
            page: {
                current: 1,
                total: this.total,
                size: 10
            }
        };
    },
    components: {
        [page.name]: page
    },
    methods: {
        getList() {
            this.$axios
                .post(`annualplan/getAnnualplan/${this.$route.params.id}`, {
                    limit: this.page.size,
                    offset: (this.page.current - 1) * this.page.size,
                    params: {}
                })
                .then(({ data }) => {
                    this.tableData = data.annualplanPurchases;
                    data.annualplanPurchases.map(v => {
                        const obj = this.checkInfo.find(
                            node => node.id === v.id
                        );
                        if (obj) {
                            this.$set(v, "openType", obj.openType);
                            this.$set(v, "openNumber", obj.openNumber);
                        }
                    });
                    this.page.total = data.count;
                });
        },
        getcheckbox(check, item) {
            if (check) {
                const Indexs = this.checkInfo.findIndex(v => {
                    return v.id === item.id;
                });
                if (Indexs < 0) {
                    this.checkInfo.push(item);
                }
            } else {
                const Indexs = this.checkInfo.findIndex(v => {
                    return v.id === item.id;
                });
                if (Indexs >= 0) {
                    this.$set(item, "openNumber", 0);
                    this.checkInfo.splice(Indexs, 1);
                }
            }
            this.$emit("checkbox", this.checkInfo);
        }
    }
};
</script>
<style lang="less" scoped>
.table-detail {
    margin-bottom: 10px;
}
table {
    width: 100%;
    text-align: center;
    border: none;
    tr {
        border-bottom: solid 1px rgba(2, 31, 57, 0.1);
        td {
            padding: 10px 0;

            input {
                color: #666666;
                font-size: 14px;
                width: 70%;
                line-height: 38px;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.2);
                padding-left: 10px;
                outline: none;
            }
            input:focus {
                box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.1);
            }
            > span {
                color: #5ba4c8;
                padding: 0 3px;
            }
        }
    }
}
</style>

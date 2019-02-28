<template>
    <div class="parts-table-wrap">
        <simple-table :columns="columns"
                      :data="tableData"
                      :stripe='false'
                      :hoverHeightLight='false'
                      :heights="{
                          td:'50px',
                          th:'50px'
                      }"
                      class="parts-table">
            <div class='custom-row'
                 slot="index"
                 slot-scope="{index,row,column}">
                {{(index+1+"").padStart(2,"0")}}
            </div>
            <div class='custom-row'
                 slot="partsName"
                 slot-scope="{index,row,column}">
                <i-input v-model="row[column.key]"
                         placeholder="请填写配件名称"></i-input>

            </div>
            <div class='custom-row'
                 slot="supplierId"
                 slot-scope="{index,row,column}">
                <supplier-select v-model="row[column.key]"></supplier-select>
            </div>
            <div class='custom-row'
                 slot="partsMoney"
                 slot-scope="{index,row,column}">
                <InputNumber :min='0'
                             :max='100000000'
                             style="width:100%;"
                             v-model="row[column.key]"
                             :formatter="moneyFormatter"
                             :parser="moneyParse"></InputNumber>
            </div>
            <div class='custom-row'
                 slot="partsNum"
                 slot-scope="{index,row,column}">
                <InputNumber :min="1"
                             :max='100000000'
                             style="width:100%;"
                             :parser="partsNumParse"
                             v-model="row[column.key]"></InputNumber>
            </div>
            <div class='custom-row'
                 slot="config"
                 slot-scope="{index,row,column}">
                <i-button v-if="tableData.length>1"
                          type="error"
                          @click='deletePart(index)'>
                    移除
                </i-button>
            </div>
        </simple-table>
        <div class='add-part'>
            <Button type="success"
                    size="large"
                    @click="addPart"
                    long>添加零配件</Button>
        </div>

    </div>
</template>

<script>
import simpleTable from "@common/simple-table";
const SupplierSelect = () => import("../../../components/supplier-select");
class Part {
    constructor() {
        this.partsName = "";
        this.supplierId = "";
        this.partsMoney = 0;
        this.partsNum = 1;
    }
}
export default {
    name: "parts-table",
    components: { simpleTable, SupplierSelect },
    data() {
        return {
            num: 1,
            columns: [
                {
                    key: "index",
                    label: "序号",
                    width: "50px"
                },
                {
                    key: "partsName",
                    label: "配件名称"
                },
                {
                    key: "supplierId",
                    label: "供应商"
                },
                {
                    key: "partsMoney",
                    label: "单价（元）"
                },
                {
                    key: "partsNum",
                    label: "数量"
                },
                {
                    key: "config",
                    label: "操作",
                    width: "100px"
                }
            ]
        };
    },
    props: {
        list: {
            default: []
        }
    },
    computed: {
        tableData: {
            get() {
                return this.list;
            },
            set(val) {
                let i = val.length;
                this.$emit("update:list", val);
            }
        }
    },
    methods: {
        addPart() {
            if (
                !this.tableData.every(
                    v => v.partsName && v.supplierId && v.partsNum
                )
            ) {
                return this.$Message.warning(
                    "请 填写完整 或 移除 不完整零配件信息再添加！"
                );
            }
            this.tableData.push(new Part());
        },
        moneyFormatter(value) {
            let formatter=`￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return formatter;
        },
        moneyParse(value) {
            let newValue=value.replace(/￥\s?|(,*)/g, "");
            return (+(+newValue.replace(/[^\d.]/g,"")).toFixed(2))+'';
        },
        partsNumParse(value){
            return value.replace(/\D/g,"");
        },
        deletePart(index) {
            this.tableData.splice(index, 1);
        }
    }
};
</script>

<style lang="less" scoped>
.parts-table-wrap {
    .parts-table {
        padding: 0;
        .custom-row {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
    .add-part {
        width: 100%;
        border-bottom: 1px solid #dddee1;
        padding: 7px 24px;
    }
}
</style>


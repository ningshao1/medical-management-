<template>
    <el-dialog title="采购计划"
               :visible.sync="dialogShow"
               v-bind='$attrs'
               v-on='$listeners'
               custom-class="relevance-dialog">
        <div class="relevance-body">
            <kld-card title='采购类型'
                      noHeadIcon
                      class="bb-1">
                {{typeName}}
            </kld-card>
            <kld-card title='基础信息'
                      noHeadIcon
                      class="bb-1">

                <el-form label-width="100px"
                         class="relevance-form"
                         :inline="true">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="申请科室：">
                                <div class="baisc-info">{{osName}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间：">
                                <div class="baisc-info"> {{time}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="科室电话：">
                                <div class="baisc-info"> {{osPhone}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </kld-card>

            <kld-card title='设备采购信息'
                      noHeadIcon
                      class="bb-1">
                <el-radio-group v-model="relevanceId"
                                class="relcvance-radio-group">
                    <el-table :data="annualplanPurchases"
                              @row-click='rowClick'
                              :row-style='{cursor: "pointer"}'>
                        <el-table-column label="序号">
                            <template slot-scope="{$index,row:{id,type,relevanceNumber,openNumber}}">
                                <!-- 当type!=2或者年度计划关联资产数已达上限 禁用 -->
                                <el-radio :label='id'
                                         @click.native.prevent.stop='rowClick({ id, type, relevanceNumber, openNumber })'
                                          :disabled="type!=2||relevanceNumber>=openNumber">
                                    {{(page.current-1)*page.size+ $index+1}}

                                </el-radio>
                            </template>
                        </el-table-column>

                        <el-table-column prop="ap_name"
                                         label="设备名称">
                        </el-table-column>
                        <el-table-column prop="ap_number"
                                         label="数量"
                                         width="80">
                        </el-table-column>
                        <el-table-column prop="ap_money"
                                         label="预算单价">
                        </el-table-column>
                        <el-table-column prop="ap_brand"
                                         label="意向品牌（多选）">
                        </el-table-column>
                        <el-table-column prop="ap_note"
                                         label="备注">
                        </el-table-column>

                    </el-table>
                </el-radio-group>
                <el-pagination style="text-align:center"
                               :current-page.sync="page.current"
                               :total="page.total"
                               :page-size="page.size"
                               @current-change="getList"
                               layout="prev, pager, next">

                </el-pagination>
            </kld-card>

        </div>
        <slot name='footer'
              slot="footer">
            <div>
                <el-button type="default"
                           @click="dialogShow=false;">
                    取消
                </el-button>
                <el-button @click='confirm'>确定</el-button>
            </div>
        </slot>
    </el-dialog>

</template>

<script>
import dialog from "@/element-ui/Dialog";
import kldCard from "@c/KldCard";
import listMixin from "@/mixins/List";
const type = {
    "0": "10万元以下",
    "1": "10~50万元",
    "2": "50万元以上"
};
export default {
    name: "chooseRelevance",
    mixins: [listMixin],
    props: {
        currentId: {
            type: String
        },
        visible: {
            type: Boolean,
            default: false
        },
        apId: {
            type: String
        }
    },
    data() {
        return {
            page: {
                current: 1,
                total: 3,
                size: 3
            },
            typeName: "",
            time: "",
            osName: "",
            osPhone: "",
            annualplanPurchases: [],
            relevanceId: ""
        };
    },
    components: {
        [dialog.name]: dialog,
        [kldCard.name]: kldCard
    },
    computed: {
        url() {
            return `/annualplan/getAnnualplan/${this.currentId}`;
        },
        dialogShow: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            }
        }
    },
    watch: {
        currentId() {
            this.page.current = 1;
            this.getList();
        },
        visible() {
            this.relevanceId = this.apId;
        }
    },
    created() {},
    methods: {
        getList() {
            const { page } = this;
            this.$axios
                .post(this.url, {
                    offset: page.size * (page.current - 1),
                    limit: page.size,
                    params: {}
                })
                .then(
                    ({
                        data: {
                            ar_type,
                            osName,
                            ar_time,
                            osPhone,
                            annualplanPurchases,
                            count
                        }
                    }) => {
                        this.typeName = type[String(ar_type)];
                        this.time = ar_time;
                        this.osName = osName;
                        this.osPhone = osPhone;
                        this.annualplanPurchases = annualplanPurchases;
                        this.page.total = count;
                    }
                );
        },
        rowClick({ id, type, relevanceNumber, openNumber }) {
            debugger;
            if (type != 2) {
                this.$message.warning("该采购条例没有被同意,无法关联！");
                return;
            }
            if (relevanceNumber >= openNumber) {
                this.$message.warning(
                    "该年度计划关联资产数已达上限，无法选择关联！"
                );
                return;
            }
            if (this.relevanceId === id) this.relevanceId = "";
            else this.relevanceId = id;
        },
        confirm() {
            this.dialogShow = false;
            this.$emit("ok", this.relevanceId, this.currentId);
        }
    }
};
</script>

<style scoped lang="less">
@bg: #f1f3f4;
/deep/.relevance-dialog {
    .el-dialog__body {
        background: @bg!important;
    }
}
/deep/.relcvance-radio-group {
    width: 100%;
}
.relevance-body {
    background: @bg;
}
/deep/.relevance-form {
    .el-form-item {
        margin-bottom: 0;
    }
}
.baisc-info {
    font-size: 14px;
}
.bb-1 {
    border-bottom: 3px solid @bg;
}
</style>

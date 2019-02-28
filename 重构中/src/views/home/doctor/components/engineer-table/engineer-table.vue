<template>
    <div class="progress enginerr-table">
        <kld-card>
            <div slot='header'
                 class="progress-head">
                <span>审批中心 </span>
                <arrow-page :current.sync="pageData.current"
                            :total="pageData.total"
                            :page-size="pageData.pageSize"
                            @on-page-change='getApprovalData'>
                </arrow-page>

            </div>
            <el-scrollbar :native='false'
                          class="enginerr-table-hidden">
                <el-table :data="tableData"
                          class="progress-table">
                    <el-table-column label="申请类型">
                        <template slot-scope="scope">
                            {{getName(scope.row.type)}}
                        </template>

                    </el-table-column>
                    <el-table-column prop="note"
                                     label="设备名称">
                    </el-table-column>
                    <el-table-column prop="name"
                                     label="申请人">
                    </el-table-column>
                    <el-table-column prop="osName"
                                     label="所在科室">
                    </el-table-column>
                    <el-table-column prop="time"
                                     label="申请时间">
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <div style="text-align:center">
                                <el-button size="mini">
                                    进入审批
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
        </kld-card>
    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import page from "../../../common/page/arrow-page";
import sroll from "element-ui/lib/scrollbar";
export default {
    name: "engineerTable",
    data() {
        return {
            pageData: {
                current: 1,
                total: 10,
                pageSize: 3
            },
            tableLoading: false,
            tableData: []
        };
    },
    components: {
        [kldCard.name]: kldCard,
        [page.name]: page,
        [sroll.name]: sroll
    },
    created() {
        this.getApprovalData();
    },
    methods: {
        getName(type) {
            let typeText = "";
            switch (type) {
                case 1:
                    typeText = "维修转交申请";
                    break;
                case 2:
                    typeText = "年度计划申请";
                    break;
                case 3:
                    typeText = "报废申请";
                    break;
                case 4:
                    typeText = "申请";
            }
            return typeText;
        },
        getApprovalData() {
            this.tableLoading = true;
            return this.$axios
                .post("/statistical/listApprove", {
                    limit: this.pageData.pageSize,
                    offset:
                        (this.pageData.current - 1) * this.pageData.pageSize,
                    params: {}
                })
                .then(({ data: { data, recordsTotal } }) => {
                    this.pageData.total = recordsTotal;
                    this.tableData = data;
                })
                .finally(() => (this.tableLoading = false));
        }
    }
};
</script>

<style scoped lang="less">
.progress {
    margin-top: 20px;
    height: 324px;
    background: #fff;
    overflow: hidden;
    .progress-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        > span {
            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            padding-left: 5px;
            border-left: 2px solid #4b74e0;
        }
    }
    /deep/.progress-table {
        .el-table__header {
            border: none;
        }
        th {
            background: transparent;
            .cell {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
                font-weight: 600;
            }
        }
        td {
            height: 72px;
        }
        &::before {
            height: 0;
        }
    }
    /deep/ .enginerr-table-hidden {
        height: 253px;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
}
</style>

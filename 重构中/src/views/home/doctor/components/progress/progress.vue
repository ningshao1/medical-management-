<template>
    <div class="progress">
        <kld-card>
            <div slot='header'
                 class="progress-head">
                <span>维修进度</span>
                <arrow-page :current.sync="pageData.current"
                            :total="pageData.total"
                            :page-size="pageData.pageSize"
                            @on-page-change='getData'>
                </arrow-page>

            </div>
            <div>
                <el-table :data="tableData"
                          style="width: 100%"
                          class="progress-table">
                    <el-table-column prop="assetName"
                                     label="设备名称"
                                     min-width="25%">
                    </el-table-column>
                    <el-table-column prop="userName"
                                     label="工程师"
                                     min-width="20%">
                    </el-table-column>
                    <el-table-column prop="phone"
                                     label="联系方式"
                                     min-width="20%">
                    </el-table-column>
                    <el-table-column label="维修进度"
                                     min-width="55%">
                        <template slot-scope="scope">
                            <progress-bar :data='barData'
                                          :current='scope.row.RepairType'>
                            </progress-bar>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </kld-card>
    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import page from "../../../common/page/arrow-page";
import bar from "./bar";
export default {
    name: "kld-doctor-progress",
    data() {
        return {
            pageData: {
                current: 1,
                total: 10,
                pageSize: 3
            },
            loading: false,
            tableData: [],
            barData: [
                {
                    name: "已报单",
                    type: 0
                },
                {
                    name: "维修中",
                    type: 1
                },
                {
                    name: "待验收",
                    type: 2
                },
                {
                    name: "已完成",
                    type: 3
                }
            ]
        };
    },
    components: {
        [kldCard.name]: kldCard,
        [page.name]: page,
        [bar.name]: bar
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.loading = true;
            return this.$axios
                .post("/statistical/reportList", {
                    offset:
                        (this.pageData.current - 1) * this.pageData.pageSize,
                    limit: this.pageData.pageSize,
                    params: {}
                })
                .then(({ data: { data, recordsTotal } }) => {
                    this.tableData = data;
                    this.pageData.total = recordsTotal;
                })
                .finally(() => (this.loading = false));
        }
    }
};
</script>

<style scoped lang="less">
.progress {
    margin-top: 20px;
    height: 324px;
    background: #fff;
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
}
</style>

<template>
    <kld-card noheader>

        <div class="relevance">
            <div class="tree">
                <el-input placeholder="请输入科室名"
                          v-model="osNameKey"
                          class="exist-input"></el-input>
                <kld-tree v-model="search.osid"
                          :data='departmentTree'
                          first-expand
                          :props='{label:"osName"}'
                          ref='relevance-tree'></kld-tree>
            </div>
            <div class="content">
                <div class="table">
                    <el-table :data="data">
                        <el-table-column prop="ar_time"
                                         label="申请时间">
                        </el-table-column>
                        <el-table-column prop="ar_type"
                                         label="采购类型">
                            <template slot-scope="{row}">
                                {{row.ar_type|typeName}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="uName"
                                         label="申请人">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="{row}">
                                <a href="javascript:;"
                                   @click="chooseHandler(row)">{{row.id===currentId?"已关联":"选择关联"}}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-pagination style="text-align:center"
                               :current-page.sync="page.current"
                               :total="page.total"
                               :page-size="page.size"
                               @current-change="getList"
                               layout="prev, pager, next">

                </el-pagination>
            </div>
        </div>
        <choose-relevance :visible.sync='visible'
                          :currentId='clickCurrentId'
                          :apId='apId'
                          @ok='ok'>
        </choose-relevance>
    </kld-card>
</template>

<script>
import tree from "@c/KldTree";
import kldCard from "@c/KldCard";
import listMixin from "@/mixins/List/index";
import dialog from "./compoents/choose-relevance";
import { confirm } from "@el";
// console.log(dialog.name)
const type = {
    "0": "10万元以下",
    "1": "10~50万元",
    "2": "50万元以上"
};
export default {
    mixins: [listMixin],
    data() {
        return {
            departmentTree: [],
            osNameKey: null,
            search: {
                plan: 2,
                osid: ""
            },
            clickCurrentId: null,
            visible: false,
            apId: "",
            currentId: ""
        };
    },
    components: {
        [tree.name]: tree,
        [kldCard.name]: kldCard,
        [dialog.name]: dialog
    },
    computed: {
        url() {
            return "/annualplan/annualplanList";
        }
    },
    watch: {
        osNameKey(val) {
            this.$refs["relevance-tree"].filter(val);
        }
    },
    created() {
        this.loadDepartmentTree();
        this.getList();
    },
    filters: {
        typeName(value) {
            return type[String(value)];
        }
    },
    methods: {
        async loadDepartmentTree() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.departmentTree = [data];
        },
        chooseHandler({ id }) {
            this.clickCurrentId = id;
            this.visible = true;
        },
        ok(apId, currentId) {
            this.apId = apId;
            if (apId) this.currentId = currentId;
            else this.currentId = "";
        },
        jumpOver() {
            confirm({
                title: "提示",
                content: "确认跳过？",
                okText: "确定",
                cancelText: "取消",
                ok: () => {
                    this.$axios
                        .post(`/assetacceptance/skip/${this.$route.query.id}`)
                        .then(res => {
                            this.$message.success("已跳过采购计划关联！");
                            this.$router.go(-1);
                        });
                }
            });
        },
        next(callback) {
            if (!this.apId) {
                this.$message.warning(
                    "您没有关联采购计划，如需跳过请点击跳过按钮！"
                );
                return;
            }
            confirm({
                title: "提示",
                content: "确认保存采购计划关联",
                okText: "确定",
                cancelText: "取消",
                ok: () => {
                    this.$axios
                        .post(`/assetacceptance/saveAnnualPlan`, {
                            assetId: this.$route.query.id,
                            apId: this.apId
                        })
                        .then(res => {
                            this.$message.success("采购计划关联成功！");
                            callback && callback();
                            this.$router.replace({
                                name: this.$route.name,
                                query: {
                                    ...this.$route.query,
                                    step: 3
                                }
                            });
                        });
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
.relevance {
    display: flex;
    .tree {
        margin-right: 20px;
        width: 300px;
        max-height: 500px;
    }
    .content {
        flex: 1;
        min-width: 0;
        > .table {
            min-height: 480px;
        }
    }
}
</style>

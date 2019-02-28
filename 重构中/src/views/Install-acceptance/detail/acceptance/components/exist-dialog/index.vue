<template>

    <el-dialog v-bind='$attrs'
               v-on='$listeners'
               :modal-append-to-body='false'
               title='选择资产'>
        <div class="check-asset">
            <div class="tree">
                <el-input placeholder="请输入科室名"
                          v-model="osNameKey"
                          class="exist-input"></el-input>
                <div class="tree-ref">
                    <kld-tree v-model="search.departmentId"
                              :data='departmentTree'
                              first-expand
                              :props='{label:"osName"}'
                              ref='exist-tree'></kld-tree>
                </div>
            </div>
            <div class="tableList">
                <el-input placeholder="请输入关键词"
                          v-model="search.keyword"
                          class="exist-input"></el-input>
                <el-table :data="data"
                          v-on='$listeners'
                          :cell-style='{cursor: "pointer"}'>
                    <el-table-column v-for="col in columns"
                                     :prop="col.key"
                                     :key="col.key"
                                     :label="col.label">
                    </el-table-column>
                </el-table>
                <el-pagination style="text-align:center"
                               :current-page.sync="page.current"
                               :total="page.total"
                               :page-size="page.size"
                               @current-change="getList"
                               layout="prev, pager, next">

                </el-pagination>
            </div>
        </div>
    </el-dialog>

</template>

<script>
import tree from "@c/KldTree";
import mixin from "@/mixins/List";
export default {
    mixins: [mixin],
    name: "existDialog",
    props: {
        disabled: {
            type: Boolean
        }
    },
    data() {
        return {
            osNameKey: null,
            departmentTree: [],
            search: {
                keyword: null,
                departmentId: this.$store.state.userInfo.osId,
                accStatus: "0"
            },
            columns: [
                {
                    key: "assetCode",
                    label: "资产编码"
                },
                {
                    key: "assetName",
                    label: "资产名称"
                },
                {
                    key: "assetClass",
                    label: "型号"
                },
                {
                    key: "brandName",
                    label: "品牌名称"
                }
            ]
        };
    },
    components: {
        [tree.name]: tree
    },
    computed: {
        url() {
            return `assets/${this.$store.state.userInfo.osId}/list`;
        }
    },
    watch: {
        osNameKey(val) {
            this.$refs["exist-tree"].filter(val);
        }
    },
    created() {
        this.getList();
        this.loadDepartmentTree();
    },
    methods: {
        async loadDepartmentTree() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.departmentTree = [data];
        }
    }
};
</script>

<style scoped lang="less">
.check-asset {
    display: flex;
    .tree {
        width: 30%;
        max-width: 300px;
        margin-right: 20px;
        .tree-ref {
            max-height: 640px;
            overflow-y: auto;
        }
    }
    .tableList {
        flex: 1;
        min-width: 0;
    }
}
.exist-input {
    margin-bottom: 5px;
}
</style>

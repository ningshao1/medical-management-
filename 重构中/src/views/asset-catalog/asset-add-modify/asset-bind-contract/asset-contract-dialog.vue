<template>
    <el-dialog
        width='800px'
        title="选择合同"
        append-to-body
        :modal-append-to-body='false'
        :visible.sync="show"
        custom-class='asset-contract-dialog-wrap'
        @open="open"
    >

        <div class="contract-dialog-container">

            <div class="contract-dialog-search">
                <el-input
                    class="contract-dialog-search-input mb-5"
                    placeholder="请输入关键字搜索"
                    v-model.trim="keyword"
                    clearable
                    @input="keywordChange"
                ></el-input>
            </div>

            <div class="contract-dialog-content">

                <div class="contract-aside-wrap">
                    <el-menu
                        class="full-height kld-menu"
                        :default-active='defaultMenuItem+""'
                    >
                        <el-menu-item
                            v-for="{key,title} in menuItems"
                            :index="key+''"
                            :key='key'
                            @click="clickHandle(key)"
                        >{{title}}</el-menu-item>
                    </el-menu>
                </div>

                <div class="contract-table-wrap">
                    <el-radio-group
                        class="full-width"
                        v-model="current.id"
                    >
                        <!-- 列表 -->
                        <el-table
                            :data='contractData'
                            @row-click="rowClick"
                            :row-class-name="'contract-table-row'"
                            v-load="loading"
                        >
                            <el-table-column
                                property='id'
                                label="#"
                                width="50px"
                            >
                                <template slot-scope="{row,column}">
                                    <el-radio
                                        style="width:0;height:0;"
                                        :label="row[column.property]"
                                    >{{""}}</el-radio>
                                </template>

                            </el-table-column>
                            <el-table-column
                                property="contractName"
                                label="合同名称"
                            ></el-table-column>

                            <el-table-column
                                property="supplierName"
                                label="供应商名称"
                            ></el-table-column>
                            <el-table-column
                                property="signDate"
                                label="签订日期"
                            ></el-table-column>
                        </el-table>
                    </el-radio-group>
                    <!-- 分页器 -->
                    <el-pagination
                        class="flex justify-content-center mt-10"
                        :page-size="page.pageSize"
                        small
                        :current-page="page.currentPage"
                        @current-change="pageChange"
                        :total="page.total"
                        layout="prev, pager, next"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                type="default"
                @click="show = false"
            >取 消</el-button>
            <el-button
                type="primary"
                @click="querySelect"
            >确 定</el-button>
        </span>

    </el-dialog>
</template>
<script>
import {Common} from '@/mixins'
export default {
    name: "asset-contract-dialog",
    mixins: [Common],
    components: {},
    props: {
        visible: {
            default: false
        },
        value: {
            default: null
        },
        querySelected: Function
    },
    data() {
        return {
            defaultMenuItem: 0,
            currentMenuItem: 0,
            loading:false,
            current: {},
            keyword: "",
            menuItems: [
                {
                    key: 0,
                    title: "全部合同"
                },
                {
                    key: 1,
                    title: "维保合同"
                },
                {
                    key: 2,
                    title: "采购合同"
                },
                {
                    key: 3,
                    title: "维修合同"
                },
                {
                    key: 4,
                    title: "其他"
                }
            ],
            contractData: [],
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            }
        };
    },
    computed: {
        show: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            }
        }
    },
    created() {
        this.remoteContracts(this.currentMenuItem);
    },
    methods: {
        open() {
            this.current = this.value;
        },
        close() {},
        keywordChange(e) {
            this.pageChange();
        },
        clickHandle(key) {
            if (key === this.currentMenuItem) {
                return;
            }
            this.currentMenuItem = key;
            this.pageChange();
        },
        rowClick(row) {
            if (row.id === this.current.id) {
                this.current = {};
                return;
            }
            this.current = row;
        },
        querySelect() {
            const { id, contractName } = this.current;
            this.querySelected({
                id,
                contractName
            });
            this.show = false;
        },
        async remoteContracts() {
            this.loading=true;
            const { pageSize, currentPage } = this.page;
            const request = {
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                params: {
                    contractStatus: 0,
                    contractType: this.currentMenuItem,
                    keyword: this.keyword
                }
            };
            try{

                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(`contracts/${this.osId}/list`, request);
                this.contractData = data;
                this.page.total = recordsTotal;
            }finally{
                this.loading=false;
            }
        },

        pageChange(page = 1) {       
            this.page.currentPage = page;
            this.remoteContracts();
        }
    }
};
</script>
<style lang="scss" >
.asset-contract-dialog-wrap {
    .el-dialog__body{
        padding: 5px 5px 0;
        .contract-dialog-container {
            .contract-dialog-search {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                .contract-dialog-search-input {
                    width: 50%;
                }
            }
            .contract-dialog-content {
                width: 100%;
                display: flex;
                $left: 20%;
                min-height: 500px;
                > .contract-aside-wrap {
                    width: $left;
                }
                > .contract-table-wrap {
                    width: 100% - $left;
                    .contract-table-row {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
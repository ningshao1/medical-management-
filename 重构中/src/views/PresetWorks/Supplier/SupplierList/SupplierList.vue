<template>
    <div class="supplier-list" v-load="loading">
        <kld-card noheader>
            <table-wrap
                    search-expanded
                    :search.sync="search.keyword"
                    :number-matched="page.size"
                    @search-advanced="mergeSearch"
                    @fresh="getList"
            >
                <router-link slot="header" :to="{name: 'supplier-add'}">
                    <el-button size="mini">新增</el-button>
                </router-link>
                <el-form :model="searchAdvanced" slot="search-advanced" label-width="100px" label-position="left">
                    <el-form-item label="供应商分类：" prop="type">
                        <radio-buttons v-model="searchAdvanced.type" :items="supplierTypes"></radio-buttons>
                    </el-form-item>
                </el-form>
                <el-table :data="data" size="large" @row-click="rowClick">
                    <el-table-column type="index" label="序号" :index="startIndex"></el-table-column>
                    <el-table-column :label="supplierNameTitle">
                        <template slot-scope="{row: {supplierName: name, labels}}">
                            <text-ellipsis class="text-primary">{{name}}</text-ellipsis>
                            <text-ellipsis :title="getLabelsTitle(labels)">
                                <kld-tag v-for="{labelId: id, labelName: name} in labels" :key="id" size="small">
                                    {{name}}
                                </kld-tag>
                            </text-ellipsis>
                        </template>
                    </el-table-column>
                    <el-table-column label="联系人" >
                        <text-ellipsis slot-scope="{row: {supplierContactName: name}}">{{name}}</text-ellipsis>
                    </el-table-column>
                    <el-table-column label="联系方式">
                        <text-ellipsis slot-scope="{row: {supplierPhone: phone}}">{{phone}}</text-ellipsis>
                    </el-table-column>
                    <el-table-column label="医疗器械经营许可证到期时间" prop="licenseDate" width="220px">
                        <transform-empty slot-scope="{row: {licenseDate: date}}">{{date}}</transform-empty>
                    </el-table-column>
                    <el-table-column label="所在地" prop="province" >
                        <transform-empty slot-scope="{row: {province: area}}">{{area}}</transform-empty>
                    </el-table-column>
                    <el-table-column label="操作" width="100px">
                        <p slot-scope="{row: {id}}" @click.stop>
                            <router-link :to="{name: 'supplier-edit', query: {id}}">修改</router-link>
                            <span class="text-secondary px-4">|</span>
                            <a @click="deleteSupplier(id)" href="javascript:">删除</a>
                        </p>
                    </el-table-column>
                </el-table>
                <el-pagination
                        class="mt-10 text-right"
                        :current-page.sync="page.current"
                        :total="page.total"
                        :page-size="page.size"
                        @current-change="getList"
                ></el-pagination>
            </table-wrap>
        </kld-card>
        <set-columns-visible></set-columns-visible>
    </div>
</template>

<script>
    import {List} from '@/mixins';
    import {TableWrap, KldCard, RadioButtons, TextEllipsis, KldTag, SetColumnsVisible, TransformEmpty} from '@/components';
    export default {
        extends: List,
        name: "supplier-list",
        components: {
            TableWrap,
            KldCard,
            RadioButtons,
            TextEllipsis,
            KldTag,
            SetColumnsVisible,
            TransformEmpty
        },
        data() {
            return {
                search: {
                    keyword: '',
                    osId: this.$store.state.userInfo.osId
                },
                searchAdvanced: {
                    type: null,
                }
            };
        },
        computed: {
            supplierTypes() {
                return [
                    {label: '全部', value: null},
                    {label: '设备供应商', value: '0'},
                    {label: '保养供应商', value: '1'},
                    {label: '计量机构', value: '2'},
                ];
            },
            url() {
                return `/supplier/list`;
            },
            startIndex() {
                const {page: {current, size}} = this;
                return (current - 1) * size + 1;
            },
            supplierNameTitle() {
                return this.searchInEffect.type === '2' ? '检定单位' : '供应商名称';
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getLabelsTitle(labels) {
                return labels
                    .map(
                        ({labelName: name}) => name
                    )
                    .join('，');
            },
            deleteSupplier(id) {
                this.$confirm({
                    content: `是否删除此供应商？`,
                    ok: async () => {
                        await this.$axios.delete(`/supplier/${id}`);
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.getList();
                    }
                });
            },
            rowClick({id}) {
                this.$router.push({
                    name: 'supplier-detail',
                    query: {id}
                });
            }
        }
    }
</script>
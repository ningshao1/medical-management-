<template>
    <div class="inspection-template-list">
        <div class="position-to-title">
            <div class="search">
                <i-input v-model.trim="searchData.keyword" @on-click="startSearch" @on-keydown.enter="startSearch" placeholder="请输入关键字搜索" icon="ios-search-strong" class="kld-input"></i-input>
                <Button v-if="addLimit" @click="addTemplate" class="kld-btn" icon="plus">新增巡检模板</Button>
            </div>
        </div>
        <div class="inspection-template-table-wrap kld-box-effect relative">
            <Loading v-if="isLoading"></Loading>
            <table class="inspection-template-table table-stripe">
                <colgroup>
                    <col width="100px">
                    <col>
                    <col width="20%">
                    <col width="20%">
                    <col width="100px">
                </colgroup>
                <thead>
                <tr>
                    <th>序号</th>
                    <th>巡检模板名称</th>
                    <th>制定时间</th>
                    <th>制定人</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="temList.length > 0">
                    <tr v-for="(template, index) in temList" :key="'temList'+index" @click="checkTemDetails(template)">
                        <td>{{(index + 1) * pageData.current}}</td>
                        <td class="textEllipsis" :title="template.mName">{{template.mName}}</td>
                        <td>{{template.createTime | spliceDate}}</td>
                        <td class="textEllipsis" :title="template.customName">
                            <poptip-show-info :info-id="template.customId">{{template.customName}}</poptip-show-info>
                        </td>
                        <td class="table-control">
                            <a v-if="editLimit" @click.stop="eidtTemplate(template.id)" href="javascript:">编辑</a>
                            <!--|-->
                            <!--<a href="javascript:">删除</a>-->
                        </td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="5">
                        <p class="text-center">暂无数据</p>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="table-page">
                <kld-page
                    :current.sync="pageData.current"
                    :total="pageData.total"
                    :page-size="pageData.pageSize"
                    @on-change="pageChange"
                ></kld-page>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .inspection-template-list {
        font-size: 14px;
        .search{
            display: flex;
            .kld-input{
                margin-right: 20px;
                width: 280px;
            }
        }
        .inspection-template-table-wrap{
            padding: 0 30px;
        }
        .inspection-template-table{
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            tr{
                border-bottom: 1px solid @border-color;
            }
            tbody{
                tr{
                    cursor: pointer;
                    transition: .2s;
                    &:hover{
                        background-color: lighten(#fafafa, 1);
                    }
                }
            }
            td,th{
                text-align: left;
                padding: 20px 10px;
                &:last-of-type{
                    text-align: center;
                }
            }
            .table-control{
                color: @btn-color;
            }
        }
        .table-control{
            text-align: center;
            a{
                color: inherit;
            }
        }
        .table-page{
            padding: 30px 0;
            text-align: center;
        }
    }
</style>

<script>
    import kldPage from '@common/page/page.vue';
    import testLimit from '@common/test-limit';
    import poptipShowInfo from '@common/poptip-show-info';

    export default {
        name: "inspection-template-list",
        components: {
            kldPage, poptipShowInfo
        },
        data() {
            return {
                addLimit: testLimit('pm:inspection:model:add'),
                editLimit: testLimit('pm:inspection:model:edit'),
                detailsLimit: testLimit('pm:inspection:model:query'),

                isLoading:true,
                temList: [],
                templateKeyWord: '',
                searchData: {
                    keyword: ''
                },
                pageData: {
                    current: 1,
                    pageSize: 10,
                    total: 0
                }
            };
        },
        filters: {
            spliceDate(dateString) {
                return dateString.replace(/(.+)\s+.+/, '$1');
            }
        },
        created() {
            this.getTemList();
            for (let i = 3; i--;) {

            }
        },
        watch: {
            searchData: {
                deep: true,
                handler() {
                    this.pageData.current = 1;
                    this.getTemList();
                }
            }
        },
        computed: {
            user_in() {
                return this.$store.state.user_in;
            }
        },
        methods: {
            getTemList() {
                const data = {
                    offset: (this.pageData.current - 1) * 10,
                    limit: this.pageData.pageSize,
                    params: this.searchData,
                };
                return this.$axios.post(`/inspectionModel/${this.user_in.osId}/list`, data)
                    .then(
                        ({data}) => {
                            this.isLoading=false;
                            this.pageData.total = data.recordsTotal;
                            this.temList = data.data;
                        }
                    ).catch(error=>{
                        this.isLoading=false;
                    });
            },


            //分页变化时
            pageChange() {
                this.isLoading=true;
                this.getTemList();
            },

            //点击搜索时
            startSearch() {
                this.pageData.current = 1;
                this.getTemList();
            },

            //跳转到编辑
            eidtTemplate(id) {
                this.$router.push({
                    name: 'inspection-template-edit',
                    query: {id}
                });
            },
            //跳转到新增
            addTemplate() {
                this.$router.push({
                    name: 'inspection-template-add'
                });
            },

            //跳转到详情
            checkTemDetails(template) {
                if (this.detailsLimit) {
                    this.$router.push({
                        name: 'inspection-template-details',
                        query: {id:template.id}
                    });
                }
            }
        }
    }
</script>
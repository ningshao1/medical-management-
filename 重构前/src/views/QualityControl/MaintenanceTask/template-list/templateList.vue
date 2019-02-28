<template>
    <div class="Maintenance-template-list">
        <div class='addTemplateBtn' v-if="ViewLimit('pm:maintain:model:add')">
            <Button @click='jump(1)' class="kld-btn" icon="plus">添加一级模板</Button>
            <Button @click='jump(2)' class="kld-btn" icon="plus">添加二级模板</Button>
        </div>
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <Input v-model.trim="keyword" placeholder="请输入模板名称/制定人" style="width:300px;margin-right:20px;"></Input>
                    </i-col>
                    <i-col>
                        <Button class="kld-btn" icon="android-search" @click="getTplList">检索</Button>
                    </i-col>
                </Row>
            </div>
        </div>
        <div class="Maintenance-template-table-wrap kld-box-effect relative">
            <Loading v-if="isLoading"></Loading>
            <table class="Maintenance-template-table table-stripe" style="table-layout:fixed;">
                <thead>
                    <tr>
                        <th class="textEllipsis" style="width:10%">序号</th>
                        <th class="textEllipsis" style="width:40%;">保养模板名称</th>
                        <th style="width:10%">保养等级</th>
                        <th style="width:10%">制定时间</th>
                        <th style="width:10%">制定人</th>
                        <th style="width:10%">操作</th>
                    </tr>
                </thead>
                <tbody>
                <template v-if="tplList.length > 0">
                    <tr v-for="(item,i) in tplList" :key='i' @click="skip(item.mMaintenanceLevel,item.id)">
                        <td>
                            {{(page.currentPage-1)*10+1+i
                            <10?`0${(page.currentPage-1)*10+1+i}`:(page.currentPage-1)*10+1+i}} </td>
                        <td class="textEllipsis" style="font-size: 14px;" :title="item.mName">{{item.mName}}</td>

                        <td class="textEllipsis">{{item.mMaintenanceLevel==1?'一级保养':'二级保养'}}</td>
                        <td>{{item.createTime}}</td>
                        <td>
                            <poptip-show-info :info-id="item.customId">{{item.customName}}</poptip-show-info>
                        </td>
                        <td style="color: #7ca7d2;" @click.stop='edit(item.mMaintenanceLevel,item.id)'>编辑</td>
                    </tr>
                </template>
                <tr v-else>
                    <td colspan="24" style="text-align:center">暂无信息</td>
                </tr>
                </tbody>
            </table>
            <div class="table-page">
                <kld-page :current.sync="page.currentPage" :total="page.total" :page-size="10" @on-change='changePage'></kld-page>
            </div>
        </div>
    </div>
</template>
<script>
import kldPage from "../../../../common/page/page.vue";
import poptipShowInfo from "@common/poptip-show-info";

export default {
    components: {
        kldPage,
        poptipShowInfo
    },
    data() {
        return {
            tplList: [], //模板列表数据
            isLoading: true,
            //分页器数据
            page: {
                total: 10, //总数
                currentPage: 1 //当前页码
            },
            keyword: "" //搜索关键字
        };
    },

    created() {
        this.getTplList();
    },

    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        //获取模板列表
        getTplList() {
            this.isLoading = true;
            this.$axios
                .post(`/maintenanceModel/${this.user_in.osId}/list`, {
                    limit: 10,
                    offset: (this.page.currentPage - 1) * 10,
                    params: {
                        keyword: this.keyword
                    }
                })
                .then(({ data }) => {
                    console.log(data);
                    this.isLoading = false;
                    this.tplList = data.data;
                    this.page.total = data.recordsTotal;
                })
                .catch(e => {
                    this.isLoading = false;
                    if (e.code == "403") {
                        this.$Message.warning("对不起，您没权限获取模板列表");
                    }
                });
        },
        //page 点击事件
        changePage(e) {
            this.tplList = [];
            this.page.currentPage = e;
        },
        //跳转
        jump(number) {
            if (number == 2) {
                this.$router.push({ name: "addTwoTemplate" });
            } else if (number == 1) {
                if(this.tplList[0]&&this.tplList[0].mMaintenanceLevel===1){
                    this.$Message.warning('对不起，一级模板只能存在一个')
                    return
                }
                this.$router.push({ name: "addOneTemplate" });
            }
        },
        //查看详情
        skip(level, id) {
            if (this.ViewLimit("pm:maintain:model:query")) {
                if (level == 2) {
                    this.$router.push({
                        name: "TwoTemplateDetails",
                        query: { id }
                    });
                } else if (level == 1) {
                    this.$router.push({
                        name: "OneTemplateDetails",
                        query: { id }
                    });
                }
            } else {
                this.$Message.warning("您没有权限查看详情");
            }
        },
        //编辑
        edit(level, id) {
            if (this.ViewLimit("pm:maintain:model:edit")) {
                if (level == 2) {
                    this.$router.push({
                        name: "configTwoTemplate",
                        query: { id }
                    });
                } else if (level == 1) {
                    this.$router.push({
                        name: "configOneTemplate",
                        query: { id }
                    });
                }
            } else {
                this.$Message.warning("您没有编辑权限");
            }
        }
    },
    watch: {
        "page.currentPage": {
            handler(e) {
                this.getTplList();
            }
        },
        keyword() {
            this.getTplList();
        }
    }
};
</script>
<style lang="less" scoped>
.addTemplateBtn {
    position: absolute;
    right: 0;
    top: -62px;
    span {
        cursor: pointer;
        padding: 12px 8px;
        line-height: 40px;
        color: rgb(255, 255, 255);
        background-color: rgb(34, 161, 185);
        font-size: 12px;
        text-align: center;
        border-radius: 3px;
    }
    span:nth-of-type(1) {
        margin-right: 8px;
    }
}
.Maintenance-template-list {
    position: relative;
    font-size: 14px;
    .search {
        display: flex;
        .kld-input {
            margin-right: 20px;
            width: 280px;
        }
    }
    .Maintenance-template-table-wrap {
        padding: 0 30px;
    }
    .Maintenance-template-table {
        width: 100%;
        border-collapse: collapse;
        colgroup {
            // col:last-of-type {
            //     width: 100px;
            // }
        }
        tr {
            font-size: 14px;
            color: #666666;
            border-bottom: 1px solid #e2e2e2;
            font-size: 13px;
            cursor: pointer;
            th {
                width: 15%;
            }
            td:nth-last-of-type(1) {
                cursor: pointer;
            }
        }
        td,
        th {
            text-align: left;
            padding: 15px 10px;
        }
    }
    .table-page {
        padding: 30px 0;
        text-align: center;
    }
}
</style>
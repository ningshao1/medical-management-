<template>
    <div class="Maintenance-template-list">
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <Poptip :width="280" class="section-tree" trigger="click" placement="bottom" v-show="PopShow">
                            <i-input icon="arrow-down-b" v-model="section_.name" class="kld-input" placeholder="选择科室"></i-input>
                            <div slot="content">
                                <Tree :data="sectionList" @on-select-change="selectSection"></Tree>
                            </div>
                        </Poptip>
                    </i-col>
                    <i-col>
                        <DatePicker :editable="false" @on-change='getDate' :value='Date_' type="month" placeholder="选择月份" style="width: 300px"></DatePicker>
                    </i-col>
                    <i-col>
                        <Button class="kld-btn" icon="android-search" @click="getList">检索</Button>
                    </i-col>
                </Row>
            </div>
        </div>
        <div class="Maintenance-template-table-wrap kld-box-effect">
            <Loading v-if="isLoading"></Loading>
            <div>
                <table class="Maintenance-template-table table-stripe">
                    <colgroup>
                        <col>
                        <col>
                        <col>
                        <col>
                        <col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="textEllipsis">序号</th>

                            <th>科室名称</th>
                            <th style="width:15%">上月执行次数</th>
                            <th style="width:15%">上月不执行次数</th>
                            <th>今年累计执行次数</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item,i) in OneLevelList" :key='i' @click='jump(item.departmentId)'>
                            <td>{{(page.currentPage-1)*10+1+i}}</td>
                            <td>{{item.departmentName}}</td>
                            <td>{{item.lastCount}}</td>
                            <td>{{item.lastNoCount}}</td>
                            <td>{{item.yearCount}}</td>
                        </tr>
                        <tr v-if='OneLevelList.length<=0'>
                            <td colspan="5">暂无信息</td>
                        </tr>
                    </tbody>

                </table>
                <div class="table-page">
                    <kld-page :current="page.currentPage" :total="page.recordsTotal" :page-size="10" @on-change='clickPage'></kld-page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import transformTreeData from "@common/transformSectionTreeData";
import kldPage from "../../../../../common/page/page.vue";
export default {
    components: {
        kldPage
    },
    data() {
        return {
            isLoading: true,
            OneLevelList: [], //保养列表数据
            sectionList: [], //科室信息
            page: {
                recordsTotal: 10,
                currentPage: 1
            },
            section_: {
                name: null,
                Id: null
            },
            Date_: null,
            PopShow: false
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        //获取保养任务列表
        getList() {
            this.isLoading = true;
            this.$axios
                .post("/pmMaintenance/getOneLog", {
                    limit: 10,
                    offset: (this.page.currentPage - 1) * 10,
                    params: {
                        month: this.Date_,
                        departmentId: this.section_.Id
                    }
                })
                .then(res => {
                    this.isLoading = false;
                    this.OneLevelList = res.data.data;
                    this.page.recordsTotal = res.data.recordsTotal;
                })
                .catch(error => {
                    this.isLoading = false;
                });
        },

        //获取科室
        getSection() {
            return this.$axios
                .get(`orgstruct/findAllTree/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.sectionList = transformTreeData(data);
                });
        },
        //选择科室
        selectSection([node]) {
            if (node.children) {
                this.$Message.warning("请精确到每个科室");
                return;
            }
            this.section_.name = node.osName;
            this.section_.Id = node.id;
            this.PopShow = false;
        },
        //日期选择
        getDate(e) {
            this.Date_ = e;
            this.page.currentPage = 1;
            this.getList();
        },
        //page触发
        clickPage(e) {
            this.isLoading = true;
            this.page.currentPage = e;
            this.getList();
        },
        //跳转页面
        jump(id) {
            if (this.ViewLimit("pm:one:task:query")) {
                this.$router.push({
                    name: "OneMaintenance",
                    query: {
                        id: id
                    }
                });
            } else {
                this.$Message.warning("您没有权限查看详情");
            }
        }
    },
    created() {
        this.getList();
        this.getSection();
    },
    watch: {
        "section_.name"(val) {
            if (val === "") {
                this.section_.Id = null;
            }
        },
        "section_.Id": function(val) {
            this.page.currentPage = 1;
            this.getList();
        }
    }
};
</script>
<style lang="less" scoped>
//  @import "../../inspectionTasks/common/varible";
.Maintenance-template-list {
    font-size: 14px;
    .search {
        display: flex;
        .kld-input {
            // margin-right: 20px;
            width: 280px;
        }
    }
    .Maintenance-template-table-wrap {
        position: relative;
        padding: 0 30px;
    }
    .Maintenance-template-table {
        width: 100%;
        border-collapse: collapse;
        colgroup {
            col:last-of-type {
                width: 100px;
            }
        }
        tr {
            border-bottom: 1px solid #e2e2e2;
            font-size: 13px;
            cursor: pointer;
            th {
                width: 15%;
            }
        }
        td,
        th {
            text-align: left;
            padding: 15px 10px;
            &:last-of-type {
                text-align: center;
            }
        }
    }
    .table-page {
        padding: 30px 0;
        text-align: center;
    }
}

.inspection-task-list {
    .search {
        display: flex;
        margin-bottom: 15px;
        .kld-input,
        .kld-select {
            width: 300px;
        }
    }
    .task-list {
        padding: 0;
        .task-page {
            text-align: center;
            padding: 30px 0;
        }
    }
}
</style>

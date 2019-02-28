<template>
    <div class="Maintenance-template-list">
        <div style="margin-bottom:15px;">
            <div class="search kld-box-effect">
                <Row type="flex" :gutter="10">
                    <i-col>
                        <Input placeholder="设备名称" style="width:300px;margin-right:20px;" v-model.trim="assetName" />
                    </i-col>
                    <i-col>
                        <Input placeholder="设备型号" style="width:300px;margin-right:20px;" v-model.trim="assetClass" />
                    </i-col>
                    <i-col>
                        <Button class="kld-btn">检索</Button>
                    </i-col>
                </Row>
            </div>
        </div>
        <div class="Maintenance-template-table-wrap kld-box-effect">
            <table class="Maintenance-template-table table-stripe" style="table-layout:fixed;">
                <colgroup>
                    <col>
                    <col>
                    <col>
                    <col>
                </colgroup>
                <thead>
                    <tr>
                        <th class="textEllipsis" style="width:30%">设备名称</th>
                        <th class="textEllipsis" style="width:30%;">设备信息</th>
                        <th style="width:30%">设备分类</th>
                        <th style="width:10%">执行结果</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='(item,i) in list_' :key='i'>
                        <td class="textEllipsis" style="color: #0c8399;font-size: 14px;">{{item.assetName}}</td>
                        <td style="font-size:12px;">
                            <div>
                                <span>型号：</span>
                                <span>{{item.assetClass}}</span>
                            </div>
                            <div>
                                <span>品牌：</span>
                                <span>{{item.brandName}}</span>
                            </div>
                        </td>
                        <td class="textEllipsis">{{item.typeName}}</td>
                        <td style="color: #7ca7d2;">{{item.type==1?"完成":''}}</td>
                    </tr>
                    <tr v-if="list_.length<=0" style="text-align:center">
                        <td colspan="25">暂无信息</td>
                    </tr>
                </tbody>
            </table>
            <div class="table-page">
                <kld-page @on-change='getList' :total="page.total" :page-size="10" :current.sync='page.Current'></kld-page>
            </div>
        </div>
    </div>
</template>


<script>
import kldPage from "../../../../common/page/page.vue";
export default {
    components: {
        kldPage
    },

    data() {
        return {
            id_: this.$route.query.id, //传参科室Id
            page: {
                Current: 1,
                total: 10
            },
            list_: [],
            assetName: null, //资产名称
            assetClass: null //资产型号
        };
    },
    created() {
        this.getList();
    },
    methods: {
        //获取列表
        getList() {
            this.$axios
                .post(`/pmMaintenance/getOneLogAndAsset`, {
                    limit: 10,
                    offset: (this.page.Current - 1) * 10,
                    params: {
                        assetName: this.assetName,
                        departmentId: this.id_,
                        assetClass: this.assetClass
                    }
                })
                .then(res => {
                    this.list_ = res.data.data;
                    this.page.total = res.data.recordsTotal;
                });
        }
    },
    watch: {
        assetName() {
            this.page.Current = 1;
            this.getList();
        },
        assetClass() {
            this.page.Current = 1;
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
            col:last-of-type {
                width: 100px;
            }
        }
        tr {
            font-size: 14px;
            color: #666666;
            border-bottom: 1px solid #e2e2e2;
            font-size: 13px;
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
</style>
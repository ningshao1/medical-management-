<template>
    <div class="no-asset">
        <Loading v-if="loading"></Loading>
        <div>
            <table class='no-asset-table table-stripe'
                   style="table-layout:fixed;border-collapse:collapse"
                   border="1">
                <tr>
                    <th>资产编码</th>
                    <th>资产名称</th>
                    <th>品牌</th>
                    <th>安装科室</th>
                    <th>安装时间</th>
                    <th>标书</th>
                    <th>验收报告</th>
                </tr>
                <tr v-for="(item,i) in NoAsset"
                    :key='i'
                    @click='clickJump(item)'>
                    <td class="text-uppercase">{{item.assetCode}}</td>
                    <td class="textEllipsis">{{item.assetName}} </td>
                    <td class="textEllipsis">{{item.brandName}}</td>
                    <td class="textEllipsis">{{item.osName}}</td>
                    <td>{{item.collarTime}}</td>
                    <td>{{item.tbtype===1?"有标书":"无标书"}}</td>
                    <td>{{item.actype===1?"有验收报告":"无验收报告"}}</td>
                </tr>

            </table>
            <div v-if="NoAsset.length===0"
                 class="no-data">
                暂无数据
            </div>

            <div class='no-page'>
                <KldPage :total='page.total'
                         :current.sync='page.current'
                         @on-change='changePage'></KldPage>
            </div>
        </div>
    </div>
</template>
<script>
import KldPage from "@common/page/page.vue";
export default {
    props: {
        search: {
            default() {
                return {
                    departmentId: null,
                    brandId: null,
                    keyword: null,
                    startTime: null,
                    endTime: null
                };
            }
        }
    },
    data() {
        return {
            loading: false,
            NoAsset: [],
            page: {
                total: 10,
                current: 1
            }
        };
    },
    components: {
        KldPage
    },
    methods: {
        getList() {
            this.loading = true;
            this.$axios
                .post(`/assetacceptance/list`, {
                    limit: 10,
                    offset: (this.page.current - 1) * 10,
                    params: {
                        ...this.search,
                        type: "0",
                        brandId:
                            this.search.brandId === "all"
                                ? null
                                : this.search.brandId
                    }
                })
                .then(res => {
                    this.page.total = res.data.recordsTotal;
                    this.NoAsset = res.data.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changePage() {
            this.getList();
        },
        clickJump(item) {
            if (item instanceof Object && item !== null) {
                if (item.type < 2) {
                    this.$router.push({
                        name: "AddAccessptance",
                        query: {
                            step: item.type + 2,
                            collarTime: item.collarTime,
                            osName: item.osName,
                            id: item.id
                        }
                    });
                }
            }
        }
    },
    watch: {
        search: {
            handler() {
                this.page.current = 1;
                this.getList();
            },
            immediate: true,
            deep: true
        }
    }
};
</script>
<style lang="less" scoped>
@import url("../asset");
</style>



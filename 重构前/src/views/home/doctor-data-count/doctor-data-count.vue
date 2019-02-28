<template>
    <div class="doctor-data-count kld-box-effect">
        <p class="head">数据概览</p>
        <ul class="amount-wrap">
            <li>
                <router-link class="active-opacity"
                             :to="declarationLimit ? {name: 'singer-center-home',params: {repairType: '2'}} : {}">
                    <show-amount title="待处理报单"
                                 color="#78bbc0"
                                 unit="单"
                                 :amount="amountData.acceptanceCount"></show-amount>
                </router-link>
            </li>
            <li>
                <router-link class="active-opacity"
                             :to="pmOneLimit ? {name: 'MaintenanceTask_'} : {}">
                    <show-amount title="本月日常保养次数"
                                 color="#459ca2"
                                 unit="次"
                                 :amount="amountData.oneLogCount"></show-amount>
                </router-link>
            </li>
            <li>
                <router-link class="active-opacity"
                             :to="declarationLimit ? {name: 'singer-center-home', params: {frStatus:'1'}} : {}">
                    <show-amount title="在修设备"
                                 color="#e59b32"
                                 unit="台"
                                 :amount="amountData.assetReportCount"></show-amount>
                </router-link>
            </li>
            <li>
                <router-link class="active-opacity"
                             :to="assetLimit ? {name: 'asset'} : {}">
                    <show-amount title="科室设备数"
                                 color="#2a81b9"
                                 unit="台"
                                 :amount="amountData.assetCount"></show-amount>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<style lang="less" scoped>
@border-style: 1px solid #d0d0d0;

.active-opacity {
    transition: opacity 0.3s;
    display: block;
    &:active {
        opacity: 0.6;
    }
}

.doctor-data-count {
    padding: 20px 0;
    .head {
        font-size: 16px;
        padding: 0 20px 24px 20px;
    }
    .amount-wrap {
        display: flex;
        > li {
            flex-grow: 1;
            padding-left: 20px;
            border-right: @border-style;
            &:last-of-type {
                border-right: none;
            }
        }
    }
}
</style>

<script>
import testLimit from "@common/test-limit";
import showAmount from "../components/show-amount";
export default {
    name: "doctor-data-count",
    components: { showAmount },
    data() {
        return {
            declarationLimit: testLimit("fr:list"),
            pmOneLimit: testLimit("pm:one:task"),
            assetLimit: testLimit("ass:list"),

            amountData: {
                acceptanceCount: 0,
                oneLogCount: 0,
                assetReportCount: 0,
                assetCount: 0
            }
        };
    },
    created() {
        this.getAmountData();
    },
    methods: {
        getAmountData() {
            return this.$axios
                .get("/statistical/overviewCount")
                .then(({ data }) => {
                    this.amountData = data;
                });
        }
    }
};
</script>
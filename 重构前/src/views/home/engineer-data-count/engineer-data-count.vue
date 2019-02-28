<template>
    <Row class="engineer-data-count"
         :gutter="20">
        <i-col span="8">
            <router-link class="active-opacity"
                         :to="declarationLimit ? {name: 'singer-center-home',params: {repairType: '2'}} : {}">
                <amount-card title="待处理报单"
                             unit="单"
                             color="#78bbc0"
                             :amount="faultReportCount"></amount-card>
            </router-link>
        </i-col>
        <i-col span="8">
            <router-link class="active-opacity"
                         :to="{}">
                <amount-card title="待处理审批"
                             unit="单"
                             color="#5aa0d5"
                             :amount="approveCount"></amount-card>
            </router-link>
        </i-col>
        <i-col span="8">
            <router-link class="active-opacity"
                         :to="{name: 'QS-home'}">
                <amount-card title="本月质控任务"
                             unit="台"
                             color="#459ca2"
                             :amount="taskCount"></amount-card>
            </router-link>
        </i-col>
    </Row>
</template>

<style lang="less" scoped>
.engineer-data-count {
}

.active-opacity {
    transition: opacity 0.3s;
    display: block;
    &:active {
        opacity: 0.6;
    }
}
</style>

<script>
import amountCard from "../components/amount-card";
import testLimit from "@common/test-limit";

export default {
    name: "engineer-data-count",
    components: { amountCard },
    data() {
        return {
            declarationLimit: testLimit("fr:list"),
            faultReportCount: 0,
            approveCount: 0,
            taskCount: 0
        };
    },
    created() {
        this.getCountData();
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    methods: {
        getCountData() {
            return this.$axios
                .get(`/statistical/engineerCount/${this.user_in.osId}`)
                .then(({ data }) => {
                    this.faultReportCount = data.faultReportCount;
                    this.approveCount = data.approveCount;
                    this.taskCount = data.taskCount;
                });
        }
    }
};
</script>
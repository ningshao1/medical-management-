<template>
    <div id="equipment-overview-wrap">
        <div class="pies-overview">
            <div class="pie-grid">
                <single-wrap :title="'物联设备总计'">

                    <pie-echart :type="3"
                                :chartColors='["#c06c84","#35477D","#f67280"]'></pie-echart>
                </single-wrap>
            </div>
            <div class="pie-grid">
                <single-wrap :title="'生命支持类设备'">
                    <pie-echart :type="1"
                                :chartColors='["#0D627A","#0C907D","#CCE490"]'></pie-echart>
                </single-wrap>

            </div>
            <div class="pie-grid">
                <single-wrap :title="'大型医疗设备'">
                    <pie-echart :type="2"
                                :chartColors='["#5C7893","#535962","#84A1BE"]'></pie-echart>
                </single-wrap>
            </div>

        </div>
        <div class="other-overview">
            <div :class="{'count-grid':true,'long-grid':moreCategory}">
                <single-wrap :title="'大型设备使用次数统计'">
                    <bar-echart @get-category-count='getCategoryCount'></bar-echart>
                </single-wrap>
            </div>
            <div :class="{'life-grid':true,'long-grid':moreCategory}">
                <single-wrap :title="'生命支持类设备使用率月统计（各院区统计）'">
                    <line-chart-frame></line-chart-frame>
                </single-wrap>
            </div>
        </div>

    </div>
</template>


<script>
import singleWrap from "./components/single-wrap.vue";
import pieEchart from "./components/pie-chart.vue";
import barEchart from "./components/bar-chart.vue";
import lineChartFrame from "./components/line-chart-frame.vue";
export default {
    name: "equipment-overview",
    components: { pieEchart, barEchart, singleWrap, lineChartFrame },
    data() {
        return {
            loading: false,
            moreCategory: false,
            threshold: 10
        };
    },
    created() {
        // this.getCumulativeStatistics();
    },
    methods: {
        async getCumulativeStatistics() {
            this.loading = true;
            try {
                const { data } = await this.$axios.get(
                    `internetThings/getCumulativeStatistics`
                );
            } finally {
                this.loading = false;
            }
        },
        getCategoryCount(categoryCount) {
            this.moreCategory = categoryCount > this.threshold;
        }
    }
};
</script>
<style lang="less" scoped>
#equipment-overview-wrap {
    @cell: 1%;
    @single: (100% - @cell*2)/3;
    .overview(@height) {
        width: 100%;
        height: @height;
        display: flex;
        justify-content: space-between;
    }
    .grid(@width) {
        width: @width;
        height: 100%;
        border: 1px solid #c8ced3;
        background-color: #fafafa;
        border-radius: 3px;
    }
    .pies-overview {
        .overview(260px);
        .pie-grid {
            .grid(@single);
        }
    }
    .other-overview {
        .overview(auto);
        margin-top: 15px;
        flex-wrap: wrap;
        .count-grid {
            .grid(@single);
            height: 350px;
        }
        .life-grid {
            .grid(100% - @cell - @single);
            height: 350px;
        }
        .long-grid {
            width: 100%;
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>


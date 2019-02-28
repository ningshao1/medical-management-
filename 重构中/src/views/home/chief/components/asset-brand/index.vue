<template>
    <div class="brand">
        <kld-card title='设备品牌维修率占比 TOP10'
                  noHeadIcon>
            <div class="kld-brand">
                <kld-echarts auto-resize
                             :option='barOption'>
                </kld-echarts>
            </div>
        </kld-card>

    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import kldecharts from "@c/kld-echarts";
import barOption from "../bar-option";
import { deepClone } from "@/utils/index";
export default {
    name: "kldBrandBar",
    data() {
        return {
            brandNames: [],
            brandCounts: []
        };
    },
    created() {
        this.brand();
    },
    computed: {
        barOption() {
            const option = deepClone(barOption);
            option.xAxis[0].data = this.brandNames;
            option.series[0].data = this.brandCounts;
            return option;
        }
    },
    methods: {
        //获取品牌
        brand() {
            this.$axios
                .get(`/statistical/brankFalutPercent`)
                .then(({ data }) => {
                    const brandNames = [],
                        brandCounts = [];
                    data.map(({ brandName, brandCount }) => {
                        brandCounts.push(brandCount - 0);
                        brandNames.push(brandName);
                    });
                    this.brandNames = brandNames;
                    this.brandCounts = brandCounts;
                });
        }
    },
    components: {
        [kldecharts.name]: kldecharts,
        [kldCard.name]: kldCard
    }
};
</script>

<style scoped lang="less">
.brand {
    margin-top: 20px;
}
.kld-brand {
    height: 226px;
}
</style>

<template>
    <div class="life-support">
        <kld-card title='急救生命支持类保障数据'>
            <div class="life">
                <kld-echarts auto-resize
                             :option='lifeOpt'>
                </kld-echarts>
            </div>
        </kld-card>

    </div>
</template>
<script>
import kldCard from "@c/KldCard";
import kldecharts from "@c/kld-echarts";
import barOption from "../bar-option";
import { deepClone } from "@u";

export default {
    name: "kld-life-support",
    data() {
        return {
            atName: [],
            umAssetCount: [],
            upAssetCount: []
        };
    },
    created() {
        this.getLife();
    },
    methods: {
        getLife() {
            this.$axios.get(`/statistical/assetLifeCount`).then(({ data }) => {
                if (data instanceof Array) {
                    data = data.sort((a, b) => {
                        return b.assetCount - a.assetCount;
                    });
                    const atName = [],
                        umAssetCount = [],
                        upAssetCount = [];
                    data.map(v => {
                        if (v.atName !== undefined && v.atName !== null) {
                            atName.push(v.atName);
                            umAssetCount.push(v.umAssetCount);
                            upAssetCount.push(v.upAssetCount);
                        }
                    });
                    this.atName = atName;
                    this.umAssetCount = umAssetCount;
                    this.upAssetCount = upAssetCount;
                }
            });
        }
    },
    components: {
        [kldCard.name]: kldCard,
        [kldecharts.name]: kldecharts
    },
    computed: {
        lifeOpt() {
            return {
                color: ["#8fcafe", "#4f70ca"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                legend: {
                    right: 0
                },
                grid: {
                    left: "3%",
                    right: "2%",
                    bottom: "20%",
                    top: "15%"
                },
                xAxis: [
                    {
                        type: "category",
                        axisTick: { show: false },
                        data: this.atName
                    }
                ],
                yAxis: [
                    {
                        type: "value"
                    }
                ],
                series: [
                    {
                        name: "待用",
                        type: "bar",
                        barMaxWidth: 40,
                        data: this.umAssetCount
                    },
                    {
                        name: "备用",
                        type: "bar",
                        barMaxWidth: 40,
                        data: this.upAssetCount
                    }
                ]
            };
        }
    }
};
</script>

<style scoped lang="less">
.life-support {
    margin-top: 20px;
}
.life {
    height: 246px;
}
</style>

<template>
    <div class="brand">
        <kld-card title='大型设备分布TOP10'
                  noHeadIcon>
            <div class="kld-brand">
                <!-- <div class='operation'>
                    <el-radio>10万以上</el-radio>
                    <el-radio class="asset-radio">50万以上</el-radio>
                    <div class="filter-input">
                        <kld-input-number class="asset-input-number"></kld-input-number>-
                        <kld-input-number class="asset-input-number"></kld-input-number>万元
                    </div>
                </div> -->
                <kld-echarts auto-resize
                             :option='assetOption'>
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
import kldInputNumber from "@c/kld-input-number";
export default {
    name: "kldAssetBar",
    data() {
        return {
            osName: [],
            assetCount: []
        };
    },
    created() {
        this.getEquipment();
    },
    methods: {
        getEquipment() {
            this.$axios
                .get(`/statistical/assetDistribute`, {
                    params: {
                        minValue: null,
                        maxValue: null
                    }
                })
                .then(({ data }) => {
                    if (data instanceof Array) {
                        const osName = [],
                            assetCount = [];
                        data.map(v => {
                            if (typeof v === "object" && v !== null) {
                                osName.push(v.os_Name);
                                assetCount.push(v.assetCount - 0);
                            }
                        });
                        this.osName = osName;
                        this.assetCount = assetCount;
                    }
                });
        }
    },
    components: {
        [kldecharts.name]: kldecharts,
        [kldCard.name]: kldCard,
        [kldInputNumber.name]: kldInputNumber
    },
    computed: {
        assetOption() {
            var assetOption = deepClone(barOption);
            assetOption.color = "rgba(75, 116, 224, 0.9)";
            assetOption.yAxis[0].name = "设备（台）";
            assetOption.xAxis[0].data = this.osName;
            assetOption.series[0].data = this.assetCount;
            return assetOption;
        }
    }
};
</script>

<style scoped lang="less">
.brand {
    margin-top: 20px;
}
.kld-brand {
    height: 226px;
    position: relative;
}
.operation {
    width: 385px;
    position: absolute;
    display: flex;
    top: -38px;
    justify-content: space-around;
    align-items: center;
    right: 12%;
    .filter-input {
        width: 150px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    /deep/.asset-input-number {
        width: 45px;
        input {
            height: 25px;
            padding: 0 5px;
        }
    }
    .asset-radio {
        margin-left: 0;
    }
}
</style>

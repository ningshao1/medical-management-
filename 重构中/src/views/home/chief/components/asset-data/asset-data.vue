<template>
    <div class="asset-data">
        <div class="asset-title">
            资产数据
        </div>
        <div class="asset-cotent">
            <div class="asset-block">
                <p class="block-title">在用设备(台)</p>
                <number-animate :end='assetData.inUseCount'
                                :styles='{
                    color: "#0DB29C"
                }'></number-animate>
            </div>
            <div class="asset-block">
                <p class="block-title">闲置设备(台)</p>
                <number-animate :end='assetData.idleCount'
                                :styles='{
                    color: " #0b7fcc"
                }'></number-animate>
            </div>
            <div class="asset-block">
                <p class="block-title">备用设备(台)</p>
                <number-animate :end='assetData.standbyCount'
                                :styles='{
                    color: "#2bbcec"
                }'></number-animate>
            </div>
            <div class="asset-block">
                <p class="block-title">已报废设备(台)</p>
                <number-animate :end='assetData.scrapCount'
                                :styles='{
                    color: "#99a6af"
                }'></number-animate>
            </div>
        </div>
    </div>
</template>

<script>
import numberAnimate from "@/components/kld-number-animate";
export default {
    name: "asset-data",
    data() {
        return {
            assetData: {
                inUseCount: 0,
                idleCount: 0,
                standbyCount: 0,
                scrapCount: 0
            }
        };
    },
    created() {
        this.getAsset();
    },
    methods: {
        //资产数据
        getAsset() {
            this.$axios.get(`/statistical/assetDataCount`).then(({ data }) => {
                this.assetData = data;
            });
        }
    },
    components: {
        [numberAnimate.name]: numberAnimate
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/var.scss";
$home-bg: #fff;
.asset-data {
    background: $home-bg;
    margin-top: 20px;
    padding: 15px;
    height: 114px;
    overflow: hidden;
}
.asset-title {
    padding-left: 10px;
    color: #020e0f;
    font-size: 16px;
    border-left: 2px solid $color-primary;
}
.asset-cotent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .asset-block {
        width: 25%;
        text-align: center;
        font-size: 30px;
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        .block-title {
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            margin: 0;
            margin-bottom: 8px;
        }
    }
    .asset-block:nth-last-of-type(1) {
        border: none;
    }
}
</style>

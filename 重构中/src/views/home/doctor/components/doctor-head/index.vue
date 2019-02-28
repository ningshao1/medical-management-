<template>
    <div class="doctor-head">
        <el-col :span="6">
            <div class="item">
                <number-animate :end='acceptanceCount'
                                :styles="{color: '#77caa6'}">
                </number-animate>
                <div class="title">待处理报单（单）</div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="item">
                <number-animate :end='oneLogCount'
                                :styles="{color: '#359fab'}">
                </number-animate>
                <div class="title">本月日常保养次数（次）</div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="item">
                <number-animate :end='assetReportCount'
                                :styles="{color: '#f69f1e'}">
                </number-animate>
                <div class="title">在修设备（台）</div>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="item">
                <number-animate :end='assetCount'
                                :styles="{color: '#6482ae'}">
                </number-animate>
                <div class="title">科室设备数（台）</div>
            </div>
        </el-col>
    </div>
</template>

<script>
import numberAnimate from "@/components/kld-number-animate";
export default {
    name: "doctor-head",
    data() {
        return {
            acceptanceCount: 0,
            assetCount: 0,
            assetReportCount: 27,
            oneLogCount: 0
        };
    },
    components: {
        [numberAnimate.name]: numberAnimate
    },
    created() {
        this.getAmountData();
    },
    methods: {
        getAmountData() {
            return this.$axios
                .get("/statistical/overviewCount")
                .then(
                    ({
                        data: {
                            acceptanceCount,
                            assetCount,
                            assetReportCount,
                            oneLogCount
                        }
                    }) => {
                        this.acceptanceCount = acceptanceCount;
                        this.assetCount = assetCount;
                        this.assetReportCount = assetReportCount;
                        this.oneLogCount = oneLogCount;
                    }
                );
        }
    }
};
</script>

<style scoped lang="less">
.doctor-head {
    background: #fff;
    padding-bottom: 20px;
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 113px;
    .item {
        font-size: 40px;
        text-align: center;
        height: 124px;
        width: 100%;
        display: inline-block;
        text-align: center;
        height: auto;
        .title {
            font-size: 14px;
            margin-top: 12px;
            color: rgba(0, 0, 0, 0.65);
            font-weight: 600;
        }
    }
}
</style>

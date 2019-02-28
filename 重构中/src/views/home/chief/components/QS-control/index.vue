<template>
    <div class="qs-control">
        <kld-card title='质量控制'>
            <el-row :gutter="20">
                <el-col :span="8">
                    <kld-badness></kld-badness>
                </el-col>
                <el-col :span="8">
                    <kld-everydata></kld-everydata>
                </el-col>
                <el-col :span="8">
                    <kld-metering></kld-metering>
                </el-col>
            </el-row>
        </kld-card>

    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import badness from "./badness";
import everyday from "./everyday";
import metering from "./metering";
export default {
    name: "qsControl",
    data() {
        return {};
    },
    created() {},
    methods: {},
    components: {
        [kldCard.name]: kldCard,
        [badness.name]: badness,
        [everyday.name]: everyday,
        [metering.name]: metering
    }
};
</script>

<style scoped lang="less">
.qs-control {
    margin-top: 20px;
}
</style>

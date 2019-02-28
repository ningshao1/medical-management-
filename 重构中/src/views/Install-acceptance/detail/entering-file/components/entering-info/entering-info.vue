<template>
    <kld-card title='安装信息项'
              noHeadIcon>
        <el-row :gutter='20'>
            <el-col :span="6">
                <el-input disabled
                          v-model="osName">
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-date-picker :editable='false'
                                clearable
                                value-format="yyyy-MM-dd"
                                v-model="collarTime"
                                placeholder='请选择安装时间'
                                disabled="">
                </el-date-picker>
            </el-col>
        </el-row>
    </kld-card>
</template>

<script>
import kldCard from "@c/KldCard";
export default {
    name: "entering-info",
    data() {
        return {
            osName: this.$route.query.name,
            collarTime: this.$route.query.date
        };
    },
    components: {
        [kldCard.name]: kldCard
    },
    created() {},
    methods: {}
};
</script>

<style scoped lang="less">
</style>

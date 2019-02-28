<template>
    <div class="depreciation-info-wrap">
        <kld-card title="折旧信息"
                  no-head-icon>
            <el-row :gutter="20">
                <el-col :span="12"
                        :lg="6">
                    <el-form-item label="折旧方式"
                                  prop="depreciationType">
                        <el-select v-model="cardItems.depreciationType"
                                   :disabled='!isAdd'>
                            <el-option v-for="(v,i) of depreciationTypes"
                                       :key='v.value'
                                       :value='v.value'
                                       :label="v.label"></el-option>
                        </el-select>

                    </el-form-item>
                </el-col>
                <el-col :span="12"
                        :lg="6">
                    <el-form-item label="折旧年限"
                                  prop="depreciationAgeLimit">
                        <el-select v-model="cardItems.depreciationAgeLimit"
                                   :disabled='!isAdd'>
                            <el-option v-for="(v,i) of depreciationAgeLimits"
                                       :key='v.value'
                                       :value='v.value'
                                       :label="v.label"></el-option>
                        </el-select>

                    </el-form-item>
                </el-col>
                <el-col :span="12"
                        :lg="6">
                    <el-form-item label="加速折旧系数"
                                  prop="speedDepreciationRate">
                        <el-input v-model="cardItems.speedDepreciationRate"
                                  placeholder="请填写加速折旧系数"
                                  :disabled='!isAdd'></el-input>

                    </el-form-item>
                </el-col>
            </el-row>
        </kld-card>

    </div>
</template>
<script>
import mixin from "../mixin.js";

export default {
    name: "depreciation-info",
    components: {},
    mixins: [mixin],
    data() {
        return {
            depreciationTypes: [
                {
                    value: 0,
                    label: "平均年限法"
                }
            ],
            depreciationAgeLimits: [
                {
                    value: 5,
                    label: "5年"
                },
                {
                    value: 6,
                    label: "6年"
                },
                {
                    value: 8,
                    label: "8年"
                }
            ]
        };
    },
    computed: {},
    created() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.depreciation-info-wrap {
}
</style>
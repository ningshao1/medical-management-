<template>
    <div class="mesurement-info-wrap">
        <kld-card title="计量信息"
                  no-head-icon>
            <el-row :gutter="20">
                <el-col :span="12"
                        :lg="6">
                    <el-form-item label="计量类型"
                                  prop="depreciationType">
                        <el-select v-model="cardItems.mtType"
                                   disabled>
                            <el-option v-for="(v,i) of mtTypes"
                                       :key='v.value'
                                       :value='v.value'
                                       :label="v.label"></el-option>
                        </el-select>

                    </el-form-item>
                </el-col>
                <el-col :span="12"
                        :lg="6">
                    <el-form-item label="上次计量时间"
                                  prop="lastTime">
                        <el-date-picker :editable='false'
                                        clearable
                                        value-format="yyyy-MM-dd"
                                        v-model="cardItems.lastTime"
                                        placeholder='请选择上次计量时间'
                                        :disabled='checkMTLimit'></el-date-picker>

                    </el-form-item>
                </el-col>
                <el-col :span="12"
                        :lg="6">
                    <el-form-item label="计量周期"
                                  prop="cycle">
                        <el-input v-model="cardItems.cycle"
                                  placeholder="请填写计量周期"
                                  :disabled='checkMTLimit'></el-input>

                    </el-form-item>
                </el-col>
            </el-row>
        </kld-card>
    </div>
</template>
<script>
import mixin from "../mixin.js";

export default {
    name: "mesurement-info",
    mixins: [mixin],
    components: {},
    data() {
        return {
            mtTypes: [
                {
                    value: 0,
                    label: "强检"
                },
                {
                    value: 1,
                    label: "非强检"
                }
            ]
        };
    },
    computed: {
        checkMTLimit(){
            return this.isAdd
                ? this.checkLimit("ass:measurement:add")
                : this.checkLimit("ass:measurement:edit");
        }
    },
    created() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.mesurement-info-wrap {
}
</style>
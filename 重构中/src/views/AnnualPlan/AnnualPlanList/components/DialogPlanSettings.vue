<template>
    <div class="inline-block">
        <div class="activator" @click="open">
            <slot></slot>
        </div>
        <el-dialog
                title="计划设置"
                width="480px"
                :visible.sync="visible"
                @closed="closedHandler"
        >
            <el-radio-group v-model="type" class="full-width">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-radio :label="3">公示，暂不投票</el-radio>
                    </el-col>
                    <el-col :span="12">
                        <el-radio :label="4">公示，开始投票</el-radio>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="mt-20">
                    <el-col :span="12">
                        <el-radio :label="2">不公示</el-radio>
                    </el-col>
                </el-row>
            </el-radio-group>
            <template slot="footer">
                <el-button type="default" size="mini" @click="close">取消</el-button>
                <el-button size="mini" @click="confirm" :loading="submitLoading">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'dialog-plan-settings',
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                visible: false,
                submitLoading: false,
                type: null,
            };
        },
        methods: {
            open() {
                this.visible = true;
            },
            close() {
                this.visible = false;
            },
            closedHandler() {
                this.type = null;
            },
            async confirm() {
                if (this.data.length === 0) {
                    this.$message.warning({
                        type: 'warning',
                        message: '请选择年度计划'
                    });
                } else if (!this.type) {
                    this.$message.warning({
                        type: 'warning',
                        message: '请选择年度计划状态'
                    });
                } else {
                    this.submitLoading = true;
                    try {
                        await this.$axios.put('/annualPlanTmp/updateAnnualPlanType', {
                            approveType: this.type,
                            ids: this.data.map(({ apId }) => apId)
                        });
                        this.$emit('success');
                        this.$message.warning({
                            type: 'success',
                            message: '设置成功'
                        });
                        this.close();
                    } finally {
                        this.submitLoading = false;
                    }
                }
            }
        }
    }
</script>
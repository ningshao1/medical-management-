<template>
    <Form v-if="limit || finallyResolveData.voteType !== 0" style="margin-top: 20px;">
        <FormItem style="width: 250px;">
            <span class="form-label" slot="label">结论性表决意见：</span>
            <template v-if="isDetails || ! limit">
                <span v-if="finallyResolveData.voteType === 1" style="/*color: #2a81b9;*/">通过</span>
                <span v-else-if="finallyResolveData.voteType === 2" style="/*color: #ed4014*/">未通过</span>
            </template>
            <RadioGroup v-else v-model="finallyResolveData.voteType">
                <Radio :label="1">通过</Radio>
                <Radio :label="2">未通过</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem style="margin-top: 20px">
            <span class="form-label" slot="label">结论性表决备注：</span>
            <i-input :disabled="isDetails || ! limit" :rows="4" v-model="finallyResolveData.vote" type="textarea"></i-input>
        </FormItem>
        <Button v-if="limit && ! isDetails" @click="finallyResolve" :disabled="! finallyResolveData.voteType" style="height: 32px; margin-top: 20px;" class="kld-btn">提交</Button>
    </Form>
</template>

<script>
    import kldConfirm from '@common/kld-confirm';
    import testLimit from '@common/test-limit';
    export default {
        name: "finally-resolve",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                finallyResolveData: {
                    id: this.$route.query.id,
                    voteType: '',
                    vote: '',
                },

                limit: testLimit('annual:statistical')
            }
        },
        watch: {
            data: {
                handler(data) {
                    if (data) {
                        const {voteType, vote} = data;
                        this.finallyResolveData.voteType = voteType;
                        this.finallyResolveData.vote = vote;
                    }
                },
                immediate: true
            }
        },
        computed: {
            isDetails() {
                if (this.data) {
                    const {approveType, hospitalType} = this.data;
                    return ! (approveType >= 4 && hospitalType === 0);
                } else {
                    return true;
                }
            }
        },
        methods: {
            finallyResolve() {
                kldConfirm({
                    content: '确认提交决定性表决意见？',
                    ok: async () => {
                        await this.$axios.put('/annualPlanTmp/updateAnnualPlanUnifiedResult', this.finallyResolveData);
                        this.$Message.success('结论性表决成功');
                        this.$router.go(-1);
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    span{
        font-size: 14px;
    }
    .form-label{
        color: #f2740c;
        font-size: 14px;
    }
</style>
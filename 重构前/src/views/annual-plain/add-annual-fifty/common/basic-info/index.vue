<template>
    <div class="fity-basic-info">
        <div class="purchase-type single-type">
            <kld-type title="采购类型"></kld-type>
            <div>
                <Radio :value='true'>{{applyType}}</Radio>
            </div>
        </div>
        <basic-info :officeData="officeData">
            <div class="basics-block" slot="time" v-if="false">
                <span>申请时间</span>
                <i-input disabled class="kld-input" :value='applyTime?applyTime.slice(0,11):""' ></i-input>
            </div>
        </basic-info>
    </div>
</template>

<script>
import kldType from "@common/kld-type";
import basicInfo from "../../../add-annual/common/basics/index";
export default {
    name: "fifty-basic-info",
    components: { kldType, basicInfo },
    props: {
        data: {
            type: Object
        }
    },
    computed: {
        applyTime() {
            if (this.data) {
                return this.data.applyTime;
            }
        },
        officeData() {
            if (this.data) {
                return {
                    applicantName: this.data.applicantName,
                    sectionName: this.data.sectionName,
                    sectionPhone: this.data.sectionPhone
                };
            }
        },
        applyType() {
            const type = this.data && this.data.apPlanType || Number(this.$route.query.type);
            return type === 2 ? '50-200（不含200）万元' : '200（含200）万元以上'
        }
    }
};
</script>
<style lang="less" scoped>
.fity-basic-info {
    width: 100%;
    .single-type {
        width: 100%;
    }
}
</style>


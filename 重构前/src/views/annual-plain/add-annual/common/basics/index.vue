<template>
    <div>
        <kld-type title='基础信息' class="step-type"></kld-type>
        <div class="basics">
            <div class="basics-block">
                <span>申请科室</span>
                <i-input disabled class="kld-input" v-model="officeInfo.sectionName"></i-input>
            </div>
            <div class="basics-block">
                <span>申请人</span>
                <i-input disabled class="kld-input" v-model="officeInfo.applicantName"></i-input>
            </div>
            <div class="basics-block">
                <span>科室电话</span>
                <i-input disabled class="kld-input" v-model="officeInfo.sectionPhone"></i-input>
            </div>
            <slot name="time"></slot>
        </div>
    </div>
</template>
<script>
import typeName from "@common/kld-type/kld-type";
//<Button v-else class="kld-btn-default ivu-btn ivu-btn" @click="$router.go(-1)">返回</Button>
export default {
    props: {
        officeData: {
            type: Object,
            default() {
                return {
                    applicantName: this.$store.state.user_in.name,
                    sectionName: this.$store.state.user_in.osName,
                    sectionPhone: this.$store.state.user_in.osPhone
                };
            }
        }
    },
    data() {
        return {
            officeInfo: {}
        };
    },
    components: {
        [typeName.name]: typeName
    },
    watch: {
        officeData: {
            handler(value) {
                if (Object.keys(value).length === 0) {
                    this.officeInfo = {
                        applicantName: this.$store.state.user_in.name,
                        sectionName: this.$store.state.user_in.osName,
                        sectionPhone: this.$store.state.user_in.osPhone
                    };
                } else {
                    this.officeInfo = value;
                }
            },
            immediate: true
        }
    }
};
</script>
<style lang="less" scoped>
.basics {
    display: flex;
    flex-wrap: wrap;
   /deep/ .basics-block {
        width: 30%;
        margin-right: 3%;
        > span {
            color: #000000;
            font-size: 14px;
            margin: 6px 0;
            display: inline-block;
        }
        .ivu-input{
            font-size: 14px;
        }
    }
}
</style>

<template>
    <component :is='isChief'></component>
</template>
<script>
const chief = () => import("./chief");
const doctor = () => import("./doctor"); //除科长以外角色使用
export default {
    data() {
        return {};
    },
    components: {
        chiefHome: chief,
        doctorHome: doctor
    },
    computed: {
        isChief() {
            if (this.$store.state.userInfo.roles[0].srName === "CHIEF")
                return "chiefHome";
            else return "doctorHome";
        }
    },
    created() {},
    methods: {}
};
</script>

<style scoped lang="less">
</style>

<template>
    <div class="emergency-list">
        <doctor-page v-if="isDoctor"></doctor-page>
        <chief-page v-else></chief-page>
    </div>
</template>

<script>
    const ChiefPage = () => import('./chief-page'),
        DoctorPage = () => import('./doctor-page');
    export default {
        name: "emergency-list",
        components: {
            ChiefPage,
            DoctorPage
        },
        computed: {
            isDoctor() {
                return this.$store.state.user_in.roles.some(
                    ({srName}) => srName === 'DOCTOR'
                )
            }
        }
    }
</script>
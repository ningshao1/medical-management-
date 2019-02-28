<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    watch: {
        $route: {
            handler(value) {
                if (value.name === "home") {
                    if (this.$store.state.user_in.roles[0].srName === "CHIEF") {
                        this.$router.push({ name: "Chief-Home" });
                    } else {
                        this.$router.push({ name: "Engineer-Doctor-Home" });
                    }
                }
            },
            immediate: true
        }
    }
};
</script>

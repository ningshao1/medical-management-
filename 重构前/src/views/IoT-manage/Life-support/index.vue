<template>
    <div>
        <keep-alive :include="cache">
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cache: ["life-all"]
        };
    },
    watch: {
        $route(to, from) {
            if (to.name === "department-detail") {
                this.cache = ["life-all", "dep-detail"];
            } else if (
                to.name === "asset-detail" &&
                from.name === "department-detail"
            ) {
                this.cache = ["life-all", "dep-detail"];
            } else {
                this.cache = ["life-all"];
            }
        }
    }
};
</script>

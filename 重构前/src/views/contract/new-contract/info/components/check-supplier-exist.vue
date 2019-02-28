<template>
    <span v-if="! exist" class="check-supplier-exist kld-error">此供应商已被删除</span>
</template>

<script>
    export default {
        name: "check-supplier-exist",
        props: {
            supplierId: [String, Number]
        },

        data() {
            return {
                exist: true
            };
        },

        watch: {
            supplierId: {
                immediate: true,
                async handler(id) {
                    if (id) {
                        try {
                            const {data} = await this.$axios.get(`/supplier/${id}`);
                            this.exist = Boolean(data);
                        } catch (e) {
                            this.exist = false;
                            console.error(e);
                        }
                    } else {
                        this.exist = true;
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .check-supplier-exist{
        position: absolute;
        right: 20px;
        bottom: 0;
        line-height: 44px;
    }
</style>
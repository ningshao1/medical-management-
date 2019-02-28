<template>
    <div>
        <p>{{current / total * 100 + '%'}}</p>
        <Button @click="click" :icon="icon" class="kld-btn"><slot></slot></Button>
    </div>
</template>

<style lang="less" scoped>
    .download-button {

    }
</style>

<script>
    export default {
        name: "download-button",
        props: {
            axiosConfig: Object,
            icon: String,
            // progress: Number
        },
        data() {
            return {
                current: 0,
                total: 0
            };
        },
        watch: {
            axiosConfig(config) {
                this.download(config);
            }
        },
        methods: {
            download(config) {
                return this.$axios({
                    ...config,
                    url: 'http://localhost:2333',
                    onDownloadProgress: ({lengthComputable, total, loaded}) => {
                        console.log(event);
                        if (lengthComputable) {
                            this.current = loaded;
                            this.total = total;
                        }
                    }
                })
            },
            click(event) {
                this.$emit('click', event);
            }
        }
    }
</script>
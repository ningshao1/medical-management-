<template>
    <img class="img-zoom" :src="src" alt="" title="点击放大">
</template>

<style lang="less" scoped>
    .img-zoom {
        cursor: pointer;
    }
</style>

<script>
    import Viewer from '../viewerjs';

    export default {
        name: "img-zoom",
        props: {
            src: {
                type: [String]
            }
        },
        mounted() {
            const viewer = new Viewer(this.$el, {
                toolbar: {
                    zoomIn: true,
                    zoomOut: true,
                    oneToOne: true,
                    reset: true,
                    rotateLeft: true,
                    rotateRight: true,
                    flipHorizontal: true,
                    flipVertical: true
                },
                title: false,
                navbar: false,
                keyboard: false,
            });

            this.$on('hook:beforeDestroy', () => {
                viewer.destroy();
            });
        }
    }
</script>
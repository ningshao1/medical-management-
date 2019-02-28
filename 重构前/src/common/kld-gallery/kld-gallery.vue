<template>
    <div class="kld-gallery" ref="kld-gallery">
        <!--<a v-for="url in imgUrls" :href="url">-->
            <!--<img :src="url" alt="">-->
        <!--</a>-->
    </div>
</template>

<style lang="less" scoped>
    .kld-gallery{
        width: 0;
        height: 0;
        position: absolute;
        display: none;
    }
</style>

<script>
    import './lightgallery/js/lightgallery';
    import './lightgallery/js/lg-thumbnail.min';
    import './lightgallery/css/lightgallery.min.css';
    export default {
        name: "kld-gallery",
        props: {
            value: {                //v-model双向绑定  控制画廊的显隐
                type: Boolean,
                default: false
            },
            imgUrls: {              //画廊的图片url地址 类型为数组
                type: Array,
                default() {
                    return [];
                }
            }
        },
        mounted() {
            this.value && this.openGallery();
            this.$refs['kld-gallery'].addEventListener('onBeforeClose', () => {
                this.$emit('input', false);
            });
        },
        watch: {
            value(value) {
                if (value) {
                    this.openGallery();
                }
            }
        },
        methods: {
            openGallery() {
                lightGallery(this.$refs['kld-gallery'], {
                    closable: false,
                    download: false,
                    loop: false,
                    dynamic: true,
                    dynamicEl: this.imgUrls.map(url => ({src: url, thumb: url})),
                });
            }
        }
    }
</script>
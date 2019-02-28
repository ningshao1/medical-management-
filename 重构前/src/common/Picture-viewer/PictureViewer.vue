<template>
    <div>
        <div v-if="show == true" class="fix-img" @click="hideImage"></div>
        <div v-show="show == true" class="big-img">
            <div style="height:700px;min-width: 500px;">
                <div class="show-img">
                    <img :src="urlSrc">
                </div>
            </div>
            <div class="img-list">
                <img v-for="(url, index) in urlArr" ref="img" :src="url" @mouseenter="showBigImage(index)" :key='index'>
            </div>
            <a class="fa-close" @click="hideImage">x</a>
        </div>
    </div>
</template>

<script>
export default {
    name: "vue-look-images",
    props: {
        urlArr: {
            type: Array,
            default: function() {
                return [];
            }
        },
        showOne: {
            type: Boolean,
            default: false
        },
        alignRow: {
            type: Boolean,
            default: true
        },
        imgSize: {
            type: Array,
            default: function() {
                return [30, 30];
            }
        },
        defaultColor: {
            type: String,
            default: "#15A6BB"
        }
    },
    data() {
        return {
            showImgIndex: "",
            urlSrc: "",
            show: ""
        };
    },
    methods: {
        showImage(index) {
            this.urlSrc = this.urlArr[index];
            this.show = true;
            this.$nextTick(function() {
                document.body.style.overflowY = "hidden";
                document.body.style.height = "100%";
                this.showBigImage(index);
            });
        },
        showBigImage(index) {
            this.urlSrc = this.urlArr[index];
            this.$refs.img.forEach((d, i) => {
                d.style.borderColor = "transparent";
            });
            this.$refs.img[index].style.borderColor = this.defaultColor;
        },
        hideImage() {
            this.show = false;
            this.$nextTick(function() {
                document.body.style.overflowY = "visible";
                document.body.style.height = "auto";
            });
        }
    }
};
</script>

<style lang="less" scoped>
.small-img {
    margin: 3px;
    cursor: pointer;
    display: block;
    background-color: #f0f0f0;
}
.img-i-b {
    display: inline-block;
}
.more-img {
    & + .more-img {
        display: none;
    }
}
.fix-img {
    z-index: 10000;
    position: fixed;
    background-color: #000;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    opacity: 0.6;
}
.big-img {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    display: block;
    margin: 0 auto;
    z-index: 11000;
    .show-img {
        max-height: 700px;
        border: 1px solid #ddd;
        margin-bottom: 6px;
        overflow: hidden;
        text-align: center;
        img {
            width: 100%;
            max-width: 600px;
            height: auto;
            margin: 0 auto;
        }
    }
    .fa-close {
        position: absolute;
        right: -18px;
        top: -18px;
        width: 26px;
        height: 26px;
        line-height: 22px;
        text-align: center;
        border: 2px solid #fff;
        background-color: #666;
        border-radius: 20px;
        color: #fff;
        cursor: pointer;
        box-shadow: -2px 1px 2px rgba(0, 0, 0, 0.4);
        &:hover {
            background-color: #e24747;
        }
    }
    .img-list {
        display: flex;
        flex-wrap: wrap;
        img {
            width: 50px;
            height: 50px;
            border: 2px solid transparent;
            padding: 2px;
            cursor: pointer;
        }
    }
}
</style>
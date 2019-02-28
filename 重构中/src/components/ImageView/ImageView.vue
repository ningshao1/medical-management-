<template>
    <div :class="{
            'image-view-wrap':true,
            'image-view-wrap-bordered':bordered
        }">
        <template
            class="image-view-loading"
            v-if="loading"
        >

        </template>
        <!-- <div v-if="viewLabel">
            <slot>

                {{label}}
            </slot>
        </div> -->
        <div
            class="image-view-carrier"
            v-else-if="imageList&&imageList.length"
        >
            <div
                v-for="(url,i) in imageList"
                :key="i"
                class="single-carrier"
            >
                <img
                    :src="baseUrl+url[HDKey]"
                    alt=""
                    class="thumbnail"
                >
                <div class="img-mask fade-in-out">
                    <div
                        class="config-icon-wrap"
                        @click="viewImage(url,i)"
                    >
                        <i
                            class="kld-icon-eye config-icon"
                            title="点击查看大图"
                        ></i>
                    </div>
                </div>
            </div>

            <kld-photo-view
                :src='viewImageUrl'
                :visible.sync="showHD"
            ></kld-photo-view>
        </div>

        <div
            class="no-image-page"
            v-else
        >
            <slot name="no-image">
                <div class="no-image-text">

                    {{noImageText}}
                </div>

            </slot>
        </div>

    </div>
</template>
<script>
import KldPhotoView from "../kld-photo-view/index.js";
import baseUrl from "@/utils/Address";
export default {
    name: "image-view",
    components: { KldPhotoView },
    props: {
        imageList: {
            default() {
                return [];
            }
        },
        label:{
            default:''
        },
        baseUrl: {
            default: baseUrl
        },
        //高清图key
        HDKey: {
            default: "photoUrl"
        },
        bordered: {
            default: true
        },
        //缩略图key
        ThumbnailKey: {
            default: "photoSuperUrl"
        },
        noImageText: {
            default: "暂无图片"
        },
        loading: {
            default: false
        }
    },
    data() {
        return {
            currentIndex: 0,
            showHD: false
        };
    },
    computed: {
        viewImageUrl() {
            if (!this.imageList.length) {
                return "";
            }
            return this.baseUrl + this.imageList[this.currentIndex][this.HDKey];
        },
        viewLabel(){
            return this.$slots.default||this.label;
        }
    },
    created() {},
    methods: {
        viewImage(url, i) {
            this.currentIndex = i;
            this.$nextTick(() => {
                this.showHD = true;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.image-view-wrap {
    $min-height: 102px;
    width: 100%;
    padding: 5px 15px;
    min-height: $min-height;

    &.image-view-wrap-bordered {
        border: 1px solid #dddee1;
        border-radius: 3px;
        margin-top: 5px;
        margin-bottom: 10px;
        background: #f2f2f2;
    }
    .image-view-carrier {
        width: 100%;
        height: 100%;
        $img-length: 70px;
        user-select: none;
        .single-carrier {
            display: inline-block;
            width: $img-length;
            height: $img-length;
            border-radius: 5px;
            overflow: hidden;
            margin: 10px 10px 10px 0;
            position: relative;
            $transition: all 0.15s ease-in-out;
            cursor: pointer;
            .thumbnail {
                height: 100%;
                width: 100%;
                filter: blur(0);
                transition: $transition;
            }

            .img-mask {
                position: absolute;
                width: 100%;
                height: 100%;

                background-color: rgba(0, 0, 0, 0.2);

                transition: $transition;
                top: 0;
                .config-icon-wrap {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .config-icon {
                        color: #fffefe;
                        font-size: 27px;
                    }
                }
            }
            .fade-in-out {
                opacity: 0;
            }
            .fly-in-out {
                transform: translate(0, -100%);
            }
            &:hover {
                .fade-in-out {
                    opacity: 1;
                }
                .fly-in-out {
                    transform: translate(0, 0);
                }
                .thumbnail {
                    filter: blur(1px);
                }
            }
        }
    }
    .no-image-page {
        width: 100%;
        .no-image-text {
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: $min-height;
        }
    }
}
</style>
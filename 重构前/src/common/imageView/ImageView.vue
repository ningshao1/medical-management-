<template>
    <div class="preview-wrap">

        <div class="showImgs" :style="showStyle">
            <!-- <div class="task-head">
            <div class="task-title">
                <div class="vertical"></div>
                <p>设备图片</p>
            </div>
        </div> -->
            <div class="imgs-wrap" v-if="imgUrlList&&imgUrlList.length">
                <div v-for="(v,i) of imgUrlList" :key="'photos'+i" class="single-img">
                    <img :src="v.photoSuperUrl?upfile_+v.photoSuperUrl:v" style="border-radius:4px;">
                    <div class="img-view" @click.stop="handleView(i)">
                        <Icon type="ios-eye-outline" class="imgView"></Icon>
                    </div>
                </div>
            </div>
            <div class="no-img" v-else>
                暂无图片
            </div>
        </div>

        <Modal class="preview-modal-wrap" width="auto" title="查看图片" v-model="visible" :transfer="transfer" class-name="vertical-center-modal">
            <div class="upload-view">
                <!--<img :src="viewImgUrl" >-->
                <img-zoom :src="viewImgUrl"></img-zoom>
            </div>
            <!-- <div class="toggle" :style="toggleWrap"> -->
            <Icon type="chevron-left" @click.native="toggle(-1)" :style="toggleStyleLeft"></Icon>
            <Icon type="chevron-right" @click.native="toggle(1)" :style="toggleStyleRight"></Icon>
            <!-- </div> -->
            <span :style="order">{{Math.abs(urlIndex)+1}}/{{imgUrlList?imgUrlList.length:0}}</span>
            <div slot="footer">
                <Button type="primary" size="large" @click="visible=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import ImgZoom from "@common/img-zoom";
const toggleStyle = {
    color: "rgb(255, 255, 255)",
    "border-radius": "50%",
    "background-color": "rgba(0,0,0,0.4)",
    width: "50px",
    height: "50px",
    "line-height": "50px",
    "text-align": "center",
    "font-size": "20px",
    cursor: "pointer",
    position: "absolute",
    top: "0",
    bottom: "0",
    margin: "auto"
};
export default {
    components: { ImgZoom },
    data() {
        return {
            visible: false,
            viewUrl: "",
            urlIndex: 0,

            //模态窗样式
            order: {
                position: "absolute",
                bottom: "60px",
                left: "0",
                display: "inline-block",
                width: "100%",
                "text-align": "center",
                "font-size": "16px"
            },
            content: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "600px",
                "padding-bottom": "20px"
            },
            // toggleWrap: {
            //     position: "absolute",
            //     top: "37px",
            //     left: "0px",
            //     bottom: "61px",
            //     width: "100%",
            //     padding: "0 21px",
            //     display: "flex",
            //     "align-items": "center",
            //     "justify-content": "space-between"
            // },
            toggleStyleLeft: {
                ...toggleStyle,
                left: "20px"
            },
            toggleStyleRight: {
                ...toggleStyle,
                right: "20px"
            }
        };
    },
    props: {
        imgUrlList: {
            type: Array,
            default() {
                return [];
            }
        },
        showStyle: {
            type: [Object, String],
            default() {
                return {};
            }
        },
        transfer: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        handleView(i) {
            this.visible = true;
            this.urlIndex = i;
        },
        toggle(flag) {
            this.urlIndex = (this.urlIndex + flag) % this.imgUrlList.length;
        }
    },
    computed: {
        viewImgUrl() {
            return this.imgUrlList && this.imgUrlList.length
                ? this.imgUrlList[Math.abs(this.urlIndex)].photoUrl
                    ? this.upfile_ +
                      this.imgUrlList[Math.abs(this.urlIndex)].photoUrl
                    : this.imgUrlList[Math.abs(this.urlIndex)]
                : "";
        }
    }
};
</script>

<style lang="less">
.preview-wrap {
    .showImgs {
        width: 100%;
        min-height: 100px;
        border-radius: 3px;
        margin-top: 5px;
        padding: 10px;
        margin-bottom: 10px;
        background: rgb(242, 242, 242);
        .imgs-wrap {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            .single-img {
                width: 70px;
                height: 70px;
                margin: 5px 5px 5px 0;
                border-radius: 4px;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                }
                &:hover {
                    .img-view {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .img-view {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: none;
                    font-size: 40px;
                    color: #fafafa;
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, 0.3);
                }
            }
        }
        .no-img {
            width: 100%;
            height: 100px;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.preview-modal-wrap {
    .ivu-modal-mask,
    .ivu-modal-wrap {
        z-index: 1002;
    }
}
.upload-view {
    width: 70vh;
    height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>

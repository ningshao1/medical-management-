<template>
    <div class="c-upload-wrap">
        <Upload  action="hello" multiple type="drag" :before-upload="handleBeforeUpload">
            <div class="upload-show">
                <div v-for="(v,i) of imgURLs" :key="i" class="imgShow">
                    <img :src="v" alt="">
                    <div class="deletefile" @click.stop="handleView(i)">
                        <Icon type="ios-eye-outline" class="imgView"></Icon>
                        <Icon type="android-delete" @click.native.stop="deletefile(i)" class="remove"></Icon>
                    </div>

                </div>
                <div class="imgShow" v-if="previewType==='square'">
                    <Icon type="ios-upload-outline" class="upload-icon"></Icon>
                </div>

                <div class="preview" v-show="imgURLs.length===0" v-if="previewType==='textStyle'">
                    拖拽图片到该区域，完成上传；或点击
                    <span>上传图片</span>
                </div>

            </div>

        </Upload>

        <Modal title="查看图片" v-model="visible" width="auto" class-name="vertical-center-modal">
            <div class="upload-view">
                <!--<img :src="imgURLs[Math.abs(urlIndex)]" style="max-width: 100%">-->
                <ImgZoom :src="imgURLs[Math.abs(urlIndex)]"></ImgZoom>
            </div>
            <!-- <div class="toggle" :style="toggleWrap"> -->
            <Icon type="chevron-left" @click.native="toggle(-1)" :style="toggleStyleLeft"></Icon>
            <Icon type="chevron-right" @click.native="toggle(1)" :style="toggleStyleRight"></Icon>
            <!-- </div> -->
            <span :style="order">{{Math.abs(urlIndex)+1}}/{{imgURLs.length}}</span>
            <div slot="footer">
                <Button type="primary" size="large" @click="visible=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Confirm from "@common/kld-confirm";
import ImgZoom from '@common/img-zoom';
const toggleStyle={
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
    margin: "auto",
}
export default {
    name: "kld-upImg",
    components: {ImgZoom},
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
            //预览图片样式
            content: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "600px"
            },
            //切换样式
            toggleWrap: {
                position: "absolute",
                top: "37px",
                left: "0px",
                bottom: "61px",
                width: "100%",
                padding: "0 21px",
                display: "flex",
                "align-items": "center",
                "justify-content": "space-between"
            },
            toggleStyleLeft: {
               ...toggleStyle,
                left: "20px",
            },
            toggleStyleRight: {
               ...toggleStyle,
                right: "20px",
            }
        };
    },
    props: {
        //上传图片文件
        fileList: {
            type: Array,
            default() {
                return [];
            }
        },
        //上传图片url
        imgURLs: {
            type: Array,
            default() {
                return [];
            }
        },
        //文件大小限制
        maxSize: {
            //单位kb
            type: [String, Number],
            default: 1024 * 3
        },
        //文件类型限制
        accept: {
            type: Array,
            default() {
                return ["image/jpeg", "image/jpg", "image/png"];
            }
        },
        //文件数量限制
        maxCount: {
            type: [String, Number],
            default: 5
        },
        //
        previewType: {
            type: String,
            default: "square"
        }
    },
    watch: {
        imgURLs(data) {
        }
    },
    // created(){
    //     if(this.fileList.length>0&&this.fileList[0].photoUrl){
    //         this.imgURLs=this.fileList.map(v=>v.photoUrl);
    //     }
    // },
    methods: {
        // handleView(i){
        //     this.visible=true;
        //     this.viewUrl=this.imgURLs[i];
        // },
        handleView(i) {
            this.visible = true;
            this.urlIndex = i;
        },
        toggle(flag) {
            this.urlIndex = (this.urlIndex + flag) % this.imgURLs.length;
        },
        handleBeforeUpload(file) {
            if (
                this.maxSize !== "infinity" &&
                file.size > this.maxSize * 1024
            ) {
                this.$Message.warning(
                    `可上传图片最大为${this.maxSize / 1024}M`
                );
                this.$emit("on-exceeded-size", file);
            } else if (!this.accept.includes(file.type)) {
                this.$Message.warning(`上传图片类型错误`);
                this.$emit("on-format-error", file);
            } else if (
                this.maxCount !== "infinity" &&
                this.fileList.length === this.maxCount
            ) {
                this.$Message.warning(`最多可上传图片数量为${this.maxCount}张`);
            } else {
                this.fileList.push(file),
                    this.imgURLs.push(window.URL.createObjectURL(file));
            }
            return false;
        },
        typeError() {},
        deletefile(index) {
            //
            Confirm({
                title: "提示",
                content: "是否删除该图片",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok: () => {
                    //当点击了确认按钮时
                    this.fileList.splice(index, 1);
                    this.imgURLs.splice(index, 1);
                },
                cancel: () => {
                    //取消按钮同上
                }
            });
        }
    }
};
</script>


<style lang="less">
.c-upload-wrap {
    width: 100%;
    display: inline-block;
    .upload-show {
        min-height: 100px;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        padding: 0 20px;
        .imgShow {
            width: 70px;
            height: 70px;
            position: relative;
            margin-right: 10px;
            border-radius: 4px;
            &:last-child {
                border: 1px dashed #dddee1;
            }
            .upload-icon {
                font-size: 30px;
                line-height: 70px;
                color: #aaa;
            }
            > img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
            > .deletefile {
                display: none;
                position: absolute;
                height: 100%;
                width: 100%;
                border-radius: 4px;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.3);
                font-size: 40px;
                line-height: 50px;
            }
            &:hover {
                .deletefile {
                    display: flex;
                    align-items: center;
                    .imgView {
                        flex-grow: 1;
                        color: #fafafa;
                    }
                    .remove {
                        flex-grow: 1;
                        color: #fafafa;
                    }
                }
            }
        }
        .preview {
            width: 100%;
            text-align: center;
            font-size: 16px;
            color: #666666;
            > span {
                display: inline-block;
                height: 45px;
                width: 120px;
                border-radius: 45px/2;
                background-color: bisque;
                line-height: 45px;
            }
        }
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

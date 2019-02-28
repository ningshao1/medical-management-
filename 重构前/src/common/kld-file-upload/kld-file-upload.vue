<template>
    <Upload type="drag" action="#" multiple :before-upload="beforeUpload" :accept="acceptString">
        <div class="kld-file-upload" ref="kld-file-upload">
            <div v-for="(file, index) in files" :key="file.url" class="file-wrap">
                <div class="file-thumb">
                    <img :src="getFullUrl(file.thumb)" alt="">
                    <div @click.stop class="file-thumb-mask">
                        <Icon v-if="downloadable" class="icon" @click.native="downloadFile(file.url, file.filename)" type="android-download" title="点击下载文件" size="24"></Icon>
                        <Icon v-if="isImage(file.data)" class="icon" @click.native="showImg(file.url)" type="eye" size="24" title="点击查看图片"></Icon>
                        <Icon v-if="editable" class="icon" @click.native="removeFile(index,file)" type="trash-a" size="24" title="点击删除文件"></Icon>
                    </div>
                </div>
                <p :title="file.filename" class="textEllipsis">{{file.filename}}</p>
            </div>
            <template v-if="editable">
                <div v-if="value.length === 0" class="first-tip">
                    <div class="first-tip-center">
                        <div>
                            <span>支持多选，拖拽上传</span>
                            <Button>点击上传</Button>
                        </div>
                        <p v-if="accept && accept.length > 0">支持格式：<span class="kld-error">{{accept.join('，')}}</span></p>
                        <p v-if="maxSize !== undefined">文件大小限制：<span class="kld-warning">{{maxSizeString}}</span></p>
                    </div>
                </div>
                <div v-else class="add-file">
                    <Icon type="android-add" size="20"></Icon>
                </div>
            </template>
            <div v-else-if="value.length === 0" class="first-tip">
                <p style="line-height: 60px;">暂无文件</p>
            </div>
        </div>
        <Modal v-model="imgViewModal.show" title="查看图片" width="auto" class-name="vertical-center-modal">
            <div class="img-view">
                <img-zoom :src="imgViewModal.imgUrl"></img-zoom>
            </div>
        </Modal>
    </Upload>
</template>

<style lang="less" scoped>
@kld-green: kld;
.kld-file-upload {
    width: 100%;
    transition: border;
    padding: 20px;
    display: flex;
    flex-flow: wrap;
    > * {
        flex-shrink: 0;
        margin: 8px;
    }

    .add-file,
    .file-thumb,
    .file-thumb > img,
    .file-thumb-mask {
        width: 80px;
        height: 80px;
    }
    .add-file {
        border-radius: 4px;
        border: 1px dashed #dddee1;
        line-height: 80px;
        text-align: center;
        &:active,
        &:hover {
            border-color: #2d8cf0;
        }
    }
    .file-wrap {
        width: 80px;
        &:hover {
            .file-thumb-mask {
                display: flex;
                > .icon {
                    flex: 1;
                }
            }
        }
        .file-thumb {
            border-radius: 4px;
            position: relative;
            overflow: hidden;
        }
        .file-thumb-mask {
            display: none;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.6);
            justify-content: center;
            align-items: center;
            color: #fff;
            .icon {
                /*margin-left: 10px;*/
                &:first-of-type {
                    margin-left: 0;
                }
            }
        }
    }

    .first-tip {
        width: 100%;
        /*height: 100px*/
        display: flex;
        justify-content: center;
        > .first-tip-center {
            text-align: left;
        }
    }
}
.img-view {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 76vh;
    height: 70vh;
    > img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>

<script>
    import word from "@common/C-UploadFile/image/word.png";
    import excel from "@common/C-UploadFile/image/excel.png";
    import txt from "@common/C-UploadFile/image/txt.png";
    import remoteAddress from "@common/Address";
    import kldConfirm from "@common/kld-confirm";
    import ImgZoom from "@common/img-zoom";

    const stopBuble = event => event.stopPropagation();

const downloadFile = (url, filename) => {
    const link = document.createElement("a");
    link.setAttribute("download", filename || "");
    link.setAttribute("href", url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default {
    name: "kld-file-upload",
    components: { ImgZoom },
    props: {
        value: {
            //支持v-model双向绑定
            type: Array,
            default() {
                return [];
            }
        },

        accept: {
            //支持的文件类型 不传则不限制
            type: Array
            // default() {
            //     return [];
            // }
        },
        editable: {
            //是否可编辑
            type: Boolean,
            default: true
        },
        maxSize: {
            //限制文件大小 不传则不限制 单位字节
            type: Number
        },
        downloadable: {
            //是否可下载
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            files: [],
            imgViewModal: {
                show: false,
                imgUrl: ""
            }
        };
    },
    beforeDestroy() {
        this.revokeObjectURL();
    },
    watch: {
        value: {
            deep: true,
            handler(value) {
                this.revokeObjectURL();
                this.files = value.map(file => {
                    const url = URL.createObjectURL(file);
                    return {
                        url,
                        filename: file.name,
                        data: file,
                        thumb: this.getFileThumb(file.name) || url
                    };
                });
            }
        },
        editable: {
            immediate: true,
            handler(value) {
                this.$nextTick(() => {
                    const method = value ? "removeEventListener" : "addEventListener";
                    this.$refs["kld-file-upload"][method]("click", stopBuble);
                    this.$refs["kld-file-upload"][method]("dragover", stopBuble);
                });
            }
        }
    },
    computed: {
        // firstTipThumbs() {
        //     const wordExtnames = ['.doc', 'docx', '.wps'],
        //         excelExtnames = ['.xls', '.xlsx'],
        //         txtExtnames = ['.txt'];
        // },

        maxSizeString() {
            const { maxSize } = this;
            return `${maxSize / 1024 / 1024}MB`;
        },

        acceptString() {
            const { accept } = this;
            if (accept) {
                return accept.join(",");
            }
        },

        validateFileTypeRegExp() {
            if (this.accept) {
                return new RegExp(`\\.(?:${this.accept.map(extname => extname.replace(/^\./, '')).join('|')})$`, 'i');
            } else {
                return /./;
            }
        }
    },

    methods: {
        beforeUpload(file) {
            if (
                this.validateFileSize(file.size) &&
                this.validateFileType(file.name)
            ) {
                this.value.push(file);
                this.$emit("input", this.value);
            }
            return false;
        },
        removeFile(index, file) {
            kldConfirm({
                title: "提示",
                content: "是否删除文件？",
                ok: () => {
                    this.value.splice(index, 1);
                    this.$emit("input", this.value);
                    this.$emit("removeFile", file);
                }
            });
        },
        getFileThumb(filename) {
            switch (this.getExtname(filename)) {
                case ".xls":
                case ".xlsx":
                    return excel;
                case ".doc":
                case ".docx":
                case ".wps":
                    return word;
                case ".txt":
                    return txt;
            }
        },
        getExtname(filename) {
            //todo
            return filename.match(/.*(\..*?)$/)[1];
        },
        getFullUrl(url) {
            return new URL(url, remoteAddress).href;
        },
        showImg(url) {
            this.imgViewModal.imgUrl = url;
            this.imgViewModal.show = true;
        },
        downloadFile,
        isImage(file) {
            return /\.(?:png|jpg|jpeg|gif)$/.test(file.name);
        },
        validateFileType(filename) {
            const extname = this.getExtname(filename);
            if (extname) {
                if (this.accept) {
                    const result = this.validateFileTypeRegExp.test(extname);
                    if (!result) {
                        this.$Message.warning(`不支持${extname}文件类型`);
                    }
                    return result;
                } else {
                    return true;
                }
            } else {
                this.$Message.warning(`无法识别 ${filename}`);
                return false;
            }
        },
        validateFileSize(fileSize) {
            const { maxSize } = this;
            if (maxSize) {
                if (fileSize > maxSize) {
                    this.$Message.warning(
                        `文件大小不能超过${this.maxSizeString}`
                    );
                    return false;
                }
            }
            return true;
        },
        revokeObjectURL() {
            this.files.map(({ url }) => {
                URL.revokeObjectURL(url);
            });
        }
    }
};
</script>
<template>
    <div class="kld-upload">
        <input type="file"
               ref="file"
               @change='uploadHandler'
               v-bind="$attrs"
               :accept='lowerAccept'
               class="file">
        <div class="file-block"
             v-if="upFileData.length<=0&&!detail">
            <div class="no-file">
                <svg class="icon"
                     aria-hidden="true">
                    <use xlink:href="#kld-icon-wenjianshangchuan"></use>
                </svg>

                <div class="virtual-btn">
                    <el-button @click="upFile"
                               :disabled="false">上传文件</el-button>
                </div>
                <div class="title-info"
                     v-if="extendTitleShow">
                    支持扩展名：{{accept.join(' ')}}
                </div>
            </div>
        </div>
        <div class="file-list"
             v-else>
            <div class="ul">
                <div v-if="upFileData.length<=0&&detail"
                     class="file-list-title">暂无数据</div>
                <ul>
                    <li v-for='(item,i) in upFileData'
                        :key='i'>
                        <div style="width:100%"
                             class="file-list-item">
                            <img :src="showIcon(item.name)"
                                 alt="">
                            <div :title="item.name"
                                 class="file-name"
                                 :class="{ishover:isImg(item.name)}"
                                 @click="showImghandler(item)">
                                <div class="ellipsis name">{{item.name | fileName("name")}}</div>
                                <span>.{{item.name | fileName()}}</span>
                            </div>
                            <div class="upload-icon">
                                <i class="el-icon-download del-file"
                                   v-if="download"
                                   @click="downloadFile(item.name,item)">
                                </i>
                                <i class="el-icon-view del-file"
                                   v-if='isImg(item.name)'
                                   @click="showImghandler(item)"></i>
                                <i class="el-icon-circle-close-outline del-file"
                                   @click='removeFile(i)'
                                   v-if="!detail"></i>
                            </div>
                        </div>

                    </li>
                </ul>
            </div>
            <div class="continue-upload"
                 v-if="!detail">
                <el-button @click="upFile"
                           size='mini'
                           type="second"> 继续上传</el-button>
                <!-- <div class="simulation-button"
                     @click="upFile"
                     v-if="!detail">继续上传</div> -->
            </div>
        </div>
        <kld-photo-view :visible.sync="dialog.dialogVisible"
                        :src="dialog.imgUrl">
        </kld-photo-view>
    </div>
</template>
<style scoped lang="scss">
@import "@/styles/var.scss";
@mixin center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.kld-upload {
    min-height: 150px;
    position: relative;
    .file {
        display: none;
    }
    .virtual-btn {
        position: relative;
    }
    .file-block {
        background-color: rgba(0, 0, 0, 0.03);
        border: solid 1px rgba(0, 0, 0, 0.12);
        width: 100%;
        height: 150px;
        .no-file {
            @include center;
            text-align: center;
            > svg {
                margin-bottom: 10px;
                height: 35px;
                width: 35px;
            }
        }
    }

    .file-list {
        width: 100%;
        max-width: 700px;
        height: 100%;
        background: #fff;
        .file-list-title {
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        ul {
            margin: 0;
            padding: 0;
            max-height: 300px;
            overflow-y: auto;
        }
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 9px 0;
            padding: 3px 0;
            cursor: pointer;
            &:hover {
                background: rgba(0, 0, 0, 0.03);
                .upload-icon {
                    display: block;
                }
            }
            .file-list-item {
                padding-left: 30px;
                padding-right: 80px;
                position: relative;
            }
            img {
                width: 20px;
                height: 20px;
                margin-right: 15px;
                position: absolute;
                left: 0;
            }
            .file-name {
                font-size: 13px;
                color: rgba(0, 0, 0, 0.65);
                width: 100%;
                > .name {
                    max-width: calc(100% - 100px);
                    display: inline-block;
                    vertical-align: middle;
                }
                // &:hover {
                //     color: $color-primary;
                // }
            }
            .upload-icon {
                display: none;
                position: absolute;
                right: 0;
                top: 0;
                width: 80px;
                .del-file {
                    cursor: pointer;
                    margin: 0 3px;
                    font-size: 16px;
                    &:active {
                        opacity: 0.6;
                    }
                }
            }
        }
    }
}
.title-info {
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.45);
}
.ishover {
    &:hover {
        span,
        div {
            color: #4b74e0;
        }
    }
}
</style>

<script>
import { confirm } from "@el";
import photoView from "../kld-photo-view/index";
function simulateClick($el) {
    const file = $el;
    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true
    });
    file.dispatchEvent(event);
}

export default {
    name: "kld-upload",
    props: {
        accept: {
            type: Array,
            default() {
                return [
                    ".xls",
                    ".xlsx",
                    ".txt",
                    ".png",
                    ".jpg",
                    ".jpeg",
                    ".wps",
                    ".doc",
                    ".docx"
                ];
            }
        },
        limit: {
            //上传数量
            type: Number,
            default: Infinity //默认无限制
        },
        detail: {
            type: Boolean,
            default: false
        },
        maxSize: {
            type: Number, //字节
            default: Infinity
        },
        value: {
            type: Array,
            default() {
                return [];
            }
        },
        extendTitleShow: {
            type: Boolean,
            default: false
        },
        download: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            imgType: ["png", "jpg", "jpeg"],
            dialog: {
                dialogVisible: false,
                imgUrl: ""
            }
        };
    },
    created() {},
    computed: {
        upFileData: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit("input", value);
            }
        },
        lowerAccept() {
            return this.accept.map(type => {
                if (typeof type === "string") return type.toLowerCase();
                else throw new Error("accept 数组内部的值需要时字符串");
            });
        }
    },
    filters: {
        fileName(value, type) {
            if (!value) return;
            if (type === "name") {
                var fileName = value.split(".");
                fileName.pop();
                return fileName.join("");
            } else {
                return value.split(".").reverse()[0];
            }
        }
    },
    methods: {
        upFile() {
            simulateClick(this.$refs.file);
        },
        uploadHandler({ target: { files }, value }) {
            // value = ""; //解决选择同一文件不触发文件
            const arryFiles = Array.from(files),
                ErrorTypeFile = [],
                successFile = [];
            if (this.limit < arryFiles.length + this.upFileData.length) {
                this.$emit("on-exceed", [...arryFiles, ...this.upFileData]); //超过最大上传数量触发返回所有文件
                this.$message.warning("你上传的文件大于最大数量,请重新上传");
                return;
            }
            for (var key in arryFiles) {
                const file = arryFiles[key];
                if (/.+(\.\w+$)/g.test(file.name)) {
                    if (!this.FileSizeCompare(file.size)) {
                        //传入文件小与最大值
                        this.$message.warning(
                            `文件${file.name}的大小超过最大值，请修改后上传`
                        );
                        this.$refs.file.value = null;
                        return;
                    }
                    if (!this.lowerAccept.includes(RegExp.$1)) {
                        this.$message.warning(
                            `${file.name}的文件类型不予许上传`
                        );
                        this.$refs.file.value = null;
                        return;
                    } else {
                        successFile.push(file);
                    }
                }
            }
            this.upFileData = [...this.upFileData, ...successFile];
            this.$refs.file.value = null;
        },
        removeFile(index) {
            confirm({
                title: "删除文件",
                content: "确定删除该文件？",
                okText: "确定",
                cancelText: "取消",
                ok: () => {
                    const files = [...this.upFileData];
                    files.splice(index, 1);
                    this.upFileData = files;
                }
            });
        },
        showImghandler(file) {
            if (!this.isImg(file.name)) {
                return;
            }
            this.dialog.dialogVisible = true;
            this.dialog.imgUrl = URL.createObjectURL(file);
        },
        showIcon(name) {
            if (this.isImg(name)) return require("./img/图片@2x.png");
            else return require("./img/文档@2x.png");
        },
        isImg(name) {
            if (typeof name === "string")
                return this.imgType.includes(name.split(".").reverse()[0]);
            else return false;
        },
        FileSizeCompare(size) {
            return size <= this.maxSize;
        },
        downloadFile(fileName, content) {
            var aTag = document.createElement("a");
            var blob = new Blob([content]);
            aTag.download = fileName;
            aTag.href = URL.createObjectURL(blob);
            aTag.click();
            URL.revokeObjectURL(blob);
            aTag.remove();
        }
    },
    components: {
        [photoView.name]: photoView
    }
};
</script>


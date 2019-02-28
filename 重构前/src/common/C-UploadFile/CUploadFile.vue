<template>
    <div class="c-uploadFile-wrap">
        <Upload class="upload-body" multiple type="drag" action="url" :before-upload="beforeUpload" :accept='acceptString'>
            <div class="file-view" v-show="fileList.length">
                <div class="file-view-wrap" v-for="(v,i) of imgURLs" :key="'imgURLs'+i">
                    <img :src="v.url" alt="">
                    <p class="textEllipsis">{{v.fileName}}</p>
                    <div class="trash-image" v-if='v.fileName.endsWith("jpg") ||v.fileName.endsWith("png")||v.fileName.endsWith("gif")'>
                        <Icon class="show-icon" type="ios-eye-outline" @click.native.stop="showImg(v.url)"></Icon>
                        <Icon class="show-icon" type="trash-b" :title="v.fileName" @click.native.stop="trashImage(i,v.fileName)"></Icon>
                    </div>
                    <Icon v-else class="trash-image" type="trash-b" :title="v.fileName" @click.native.stop="trashImage(i,v.fileName)"></Icon>
                </div>
                <div class="file-view-wrap add-file">
                    <Icon type="ios-plus-empty" class="icon-add"></Icon>
                    <p class="textEllipsis">&nbsp;</p>
                </div>
            </div>
            <div class="preview" v-show="!fileList.length" :style="second.show===false?'padding: 28px 0;height: 150px;background:#fff':''">
                <div class="first" v-if='second.show'>
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>从电脑上选择要上传的文档，按住Ctrl可以上传多份文件</p>
                </div>
                <div class="second" v-else>
                    <p>请上传{{second.title}}；或点击
                        <Button shape="circle" class='up-btn'>上传文件</Button>
                    </p>
                    <div>
                        支持格式：<img v-for='(item,i) in second.icon' :src="item" alt="" :key='i+(+new Date())'>
                        <span class="format">({{accept.join("，")}})</span>
                    </div>
                </div>
            </div>
        </Upload>

        <!-- 查看图片显示窗口 -->
        <Modal title="查看图片" v-model="visible" width="800px">
            <div :style="content">
                <img :src="BigUrl" style="max-width: 100%;max-height:700px">
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="visible=false">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import kidConfirm from "../kld-confirm/index.js";
export default {
    name: "kld-upfile",
    data() {
        return {
            //文件对应图标
            fileImage: {
                ".doc": require("./image/word.png"),
                ".docx": require("./image/word.png"),
                ".xls": require("./image/excel.png"),
                ".xlsx": require("./image/excel.png"),
                ".wps": require("./image/word.png"),
                ".txt": require("./image/txt.png")
            },
            visible: false,
            BigUrl: "",
            //预览图片样式
            content: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "600px"
            },
            acceptString: ""
        };
    },
    props: {
        //控制显示second
        second: {
            type: Object,
            default() {
                return {
                    show: true,
                    title: "",
                    icon: []
                };
            }
        },
        //上传文档文件
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
            type: [String, Number], //'infinity'表示无限制
            default: 1024 * 3
        },
        //文件类型限制
        accept: {
            type: Array,
            default() {
                return ["doc", "docx", "xls", "xlsx"];
            }
        },
        //文件数量限制
        maxCount: {
            type: [String, Number], //'infinity'表示无限制
            default: 5
        }
    },
    created() {
        if (this.accept instanceof Array) {
            if (this.accept.length > 0) {
                let temp = [];
                this.accept.forEach(el => {
                    switch (el) {
                        case "xls":
                            temp.push("application/vnd.ms-excel");
                            break;
                        case "xlsx":
                            temp.push(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            );
                            break;
                        case "wps":
                            temp.push(".wps");
                            break;
                        case "doc":
                            temp.push("application/msword");
                            break;
                        case "docx":
                            temp.push(
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            );
                            break;
                        case "txt":
                            temp.push("text/plain");
                            break;
                        case "jpg":
                        case "jpeg":
                            temp.push("image/jpeg");
                            break;
                        case "png":
                            temp.push("image/png");
                            break;
                    }
                });
                this.acceptString = temp.join(",");
            }
        }
    },
    methods: {
        beforeUpload(file) {
            let reg = new RegExp(
                "." + this.accept.reduce((p, c) => `${p}$|\.${c}`) + "$",
                "g"
            );
            if (!reg.test(file.name.toLowerCase())) {
                this.$Message.warning(`上传文件类型错误`);
                this.$emit("on-format-error", file);
            } else if (
                this.maxSize !== "infinity" &&
                file.size > this.maxSize * 1024
            ) {
                this.$Message.warning(
                    `可上传文件最大为${this.maxSize / 1024}M`
                );
                this.$emit("on-exceeded-size", file);
            } else if (
                this.maxCount !== "infinity" &&
                this.fileList.length === this.maxCount
            ) {
                this.$Message.warning(`最多可上传文件数量为${this.maxCount}份`);
            } else {
                let match = file.name.toLowerCase().match(reg)[0];
                this.fileList.push(file);
                if (
                    file.name.toLowerCase().endsWith("jpg") ||
                    file.name.toLowerCase().endsWith("png") ||
                    file.name.toLowerCase().endsWith("gif")
                ) {
                    this.imgURLs.push({
                        url: window.URL.createObjectURL(file),
                        fileName: file.name.toLowerCase()
                    });
                    return;
                }
                this.imgURLs.push({
                    url: this.fileImage[match],
                    fileName: file.name.toLowerCase()
                });
            }

            return false;
        },
        //删除文件
        trashImage(index, fileName) {
            kidConfirm({
                title: "提示",
                content: `是否删除文件"${fileName}"`,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.fileList.splice(index, 1);
                    this.imgURLs.splice(index, 1);
                },
                cancel() {
                    //取消按钮同上
                }
            });
        },
        //显示图片方法
        showImg(url) {
            this.visible = true;
            this.BigUrl = url;
        }
    }
};
</script>

<style lang="less">
@import url("./base.less");
</style>

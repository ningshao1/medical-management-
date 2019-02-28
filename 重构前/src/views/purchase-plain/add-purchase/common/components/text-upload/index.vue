<template>
    <div class="text-upload">
        <slot>
            <p class="text-title">
                {{options.title}}
            </p>
            <div class="text-info">
                <Input :maxlength="1000"
                       :disabled='Detail'
                       v-model="textInfo"
                       type="textarea"
                       class="text-input"
                       :rows="options.rows?options.rows:5"
                       :placeholder="options.placeholder"></Input>
                <div class="info-right">
                    <a v-if="exportWord"
                       @click="exportWordHandler">导出word文档</a>
                    <span>最后修改人：{{lastChange}}</span>
                </div>
            </div>
        </slot>
        <div class="upload">
            <div style="margin-bottom:6px;padding-left:17px;"
                 v-if="must"><span class="must"></span>招标文件</div>
            <kld-file-upload @removeFile='removeFile'
                             :editable='!Detail'
                             v-model="file"
                             :accept='uploadOption.accept'
                             downloadable
                             :maxSize='uploadOption.maxSize'></kld-file-upload>
        </div>
    </div>
</template>
<script>
import upload from "@common/kld-file-upload";
import { word } from "../../method/exportWord";

const imgType = ["png", "jpg", "jpeg"];
const fileType = ["doc", "docx", "xls", "xlsx", "wps"];
export default {
    name: "text-upload",
    props: {
        Type: {
            type: Number,
            default() {
                return 8;
            }
        },
        Detail: {
            type: Boolean, //详情
            default() {
                return false;
            }
        },
        options: {
            //配置信息
            default() {
                return {
                    title: "论证申请：",
                    placeholder:
                        "采购单位为了满足临床使用需要，【设备名称】需具备如下功能要求：",
                    rows: 6,
                    fileName: "论证设备详情"
                };
            }
        },
        uploadOption: {
            //配置上传信息
            default() {
                return {
                    accept: [".doc", ".xls", ".xlsx", ".wps", ".png"],
                    maxSize: 3072 * 1024
                };
            }
        },
        DetailInfo: {
            default() {
                return {
                    modifyUserName: "1231"
                };
            }
        },
        //是否允许下载
        exportWord: {
            default() {
                return true;
            }
        },
        textareaData: {
            type: String
        },
        UpLoadDateURL: {
            //规定 数组两个值 第一个是文件地址 第二个图片地址 没有就穿空字符串
            require: true,
            type: Array
        },
        //上传文件回显的地址
        DetailfileURL: {
            type: Array
        },
        FileType: {
            type: Number
        }
    },
    data() {
        return {
            file: [], //显示出来的文件
            removeFiles: [], //删除的文件
            addFile: [] //新加的文件
        };
    },
    computed: {
        textInfo: {
            get() {
                return this.textareaData;
            },
            set(val) {
                this.$emit("update:textareaData", val);
            }
        },
        lastChange() {
            if (!this.DetailInfo) return;
            if (this.DetailInfo.procurementState >= this.Type) {
                if (this.Type === 5) {
                    return this.DetailInfo.demonstrationApproveUserName;
                } else if (this.Type === 8) {
                    return this.DetailInfo.parameterApproveUserName;
                } else {
                    return "无";
                }
            } else {
                if (this.Type === 5) {
                    return this.DetailInfo.demonstrationApplyUserId === null
                        ? "无"
                        : this.DetailInfo.modifyUserName || "无";
                } else if (this.Type === 8) {
                    return this.DetailInfo.parameterApplyUserId === null
                        ? "无"
                        : this.DetailInfo.modifyUserName || "无";
                }
            }
        },
        must() {
            return this.$slots.default ? true : false;
        }
    },
    components: {
        [upload.name]: upload
    },
    watch: {
        DetailfileURL: {
            handler() {
                this.URLConvertFile();
            },
            immediate: true
        }
    },
    methods: {
        async uploadFile() {
            if (
                this.DetailInfo.procurementState >= 8 &&
                this.file.length <= 0
            ) {
                this.$Message.warning("文件上传为必填项");
                return Promise.reject();
            }
            if (
                !this.$slots.default &&
                this.file.length === 0 &&
                (this.textInfo === "" || this.textInfo === null)
            ) {
                this.$Message.warning(
                    "文本输入或文件上传，必须选择一项完成填写"
                );
                return Promise.reject();
            }
            await this.postRemoveFile();
            await this.addFiles();
            // return this.postRemoveFile()
            //     .then(() => {
            //         return this.addFiles();
            //     })
            //     .catch(() => {
            //         return this.addFiles();
            //     });
        },
        addFiles() {
            this.addFile = [];
            let FileDate = [],
                fileData_ = new FormData(),
                ImgData = [],
                config = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                };

            this.file.map(v => {
                if (!v.type.includes("-kld-")) {
                    this.addFile.push(v);
                    fileData_.append("file", v);
                }
            });
            FileDate = [
                this.$axios.post(this.UpLoadDateURL[0], fileData_, config)
            ];
            return Promise.all(FileDate).then(
                data => {
                    return data;
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        URLConvertFile() {
            if (this.DetailfileURL.length <= 0) return;
            const fileURL = this.DetailfileURL.filter(v => v.flag !== 2);

            const data = [];
            fileURL.map(v => {
                const url = v.path || v.photoUrl;
                this.$axios
                    .get(url, {
                        responseType: "blob"
                    })
                    .then(({ data }) => {
                        const name = v.name
                            ? v.name
                            : v.photoUrl.split("/").pop();

                        const files = new File([data], name, {
                            type: v.type + "-kld-" + v.id
                        });

                        this.file.push(files);
                    });
            });
        },
        exportWordHandler() {
            const fileName = this.options.fileName || "";
            if (!this.textInfo) {
                this.$Message.warning("暂无文件下载");
                return;
            }
            word(fileName, this.textInfo);
        },
        removeFile(file) {
            if (file.data["type"].includes("-kld-")) {
                this.removeFiles.push(file.data);
            }
        },
        postRemoveFile() {
            if (!this.removeFiles.length) return Promise.resolve();
            const fileIds = this.removeFiles.map(v => {
                return v.type.split("-kld-")[1] - 0;
            });
            return this.$axios
                .post(`/purchase/deleteFile`, {
                    ids: fileIds
                })
                .then(() => {});
        }
    },
    created() {}
};
</script>
<style lang="less" scoped>
.text-upload {
    padding: 10px;
    .text-title {
        font-size: 14px;
        padding: 8px 0;
    }
    /deep/.text-input {
        textarea {
            font-size: 12px;
        }
    }
    .text-info {
        display: flex;
        position: relative;
        > .info-right {
            width: 240px;

            > a {
                font-size: 12px;
                position: absolute;
                right: 82px;
                top: 5px;
            }
            span {
                font-size: 12px;
                position: absolute;
                right: 60px;
                bottom: 5px;
            }
        }
    }
    .upload {
        margin-top: 30px;
    }
    .time {
        margin: auto;
        padding: 0 40px;
        display: flex;
        > div:nth-of-type(2) {
            margin-left: 40px;
        }
    }
}
.must {
    &::before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
    }
}
</style>

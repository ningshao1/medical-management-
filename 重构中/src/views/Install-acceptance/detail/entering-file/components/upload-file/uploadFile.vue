<template>
    <div>
        <kld-card title='相关文件项'
                  noHeadIcon>
            <div class="tabs">
                <div class="tabs-item"
                     :class="{active:activeID===item.id}"
                     v-for="item in tabsColumn"
                     :key='item.id'
                     @click="activeID=item.id">
                    <i class="el-icon-document"></i>
                    <p>{{item.title}}<span class="title"
                              v-if="item.required">（必填项）</span>
                    </p>
                </div>
            </div>
            <kld-upload extendTitleShow
                        v-model="fileData[activeID]['fileData']"
                        :accept='fileData[activeID]["fileType"]'
                        multiple></kld-upload>
            <el-checkbox v-model="trainWordType"
                         class="file-upload"
                         v-if="activeID==='6'">是否已经培训</el-checkbox>
        </kld-card>

    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import uploadFile from "@c/kld-upload";
const uploadConfig = {
    headers: {
        "content-type": "multipart/form-data"
    }
};
export default {
    name: "install-upload-file",
    data() {
        return {
            tabsColumn: [
                {
                    title: "设备采购论证纪要",
                    id: "1"
                },
                {
                    title: "标书文件",
                    id: "2"
                },
                {
                    title: "设备安装要求文件",
                    id: "3"
                },
                {
                    title: "设备确认文件",
                    id: "4"
                },
                {
                    title: "使用培训",
                    id: "6"
                },
                {
                    title: "操作规程",
                    id: "7"
                },
                {
                    title: "安装验收报告文件",
                    id: "5",
                    required: true
                }
            ],
            fileData: {
                "1": {
                    fileData: [],
                    fileType: [".doc", ".docx", ".txt", ".xls", ".xlsx", ".wps"]
                },
                "2": {
                    fileData: [],
                    fileType: [
                        ".doc",
                        ".docx",
                        ".jpg",
                        ".png",
                        ".jpeg",
                        ".xls",
                        ".xlsx",
                        ".wps"
                    ]
                },
                "3": {
                    fileData: [],
                    fileType: [".doc", ".docx", ".txt", ".xls", ".xlsx", ".wps"]
                },
                "4": {
                    fileData: [],
                    fileType: [
                        ".doc",
                        ".docx",
                        ".jpg",
                        ".png",
                        ".jpeg",
                        ".xls",
                        ".xlsx",
                        ".wps"
                    ]
                },
                "5": {
                    fileData: [],
                    fileType: [
                        ".doc",
                        ".docx",
                        ".jpg",
                        ".png",
                        ".jpeg",
                        ".xls",
                        ".xlsx",
                        ".wps"
                    ]
                },
                "6": {
                    fileData: [],
                    fileType: [
                        ".doc",
                        ".docx",
                        ".jpg",
                        ".png",
                        ".jpeg",
                        ".xls",
                        ".xlsx",
                        ".wps"
                    ]
                },
                "7": {
                    fileData: [],
                    fileType: [
                        ".doc",
                        ".docx",
                        ".jpg",
                        ".png",
                        ".jpeg",
                        ".xls",
                        ".xlsx",
                        ".wps"
                    ]
                }
            },
            activeID: "1",
            trainWordType: false
        };
    },
    components: { [kldCard.name]: kldCard, [uploadFile.name]: uploadFile },
    computed: {
        osId() {
            return this.$store.state.userInfo.osId;
        }
    },
    created() {},
    methods: {
        next(callback) {
            if (!this.fileData["5"]["fileData"].length) {
                this.$message.warning("安装验收报告必须上传");
                return;
            }
            const promiseFile = this.chooseFile();
            debugger;
            this.postFile(promiseFile, callback);
        },
        url(key, formData) {
            var urlAxios = null;
            switch (key) {
                case "2":
                    urlAxios = this.configAxios("12", formData);
                    break;
                case "6":
                    urlAxios = this.configAxios("14", formData);
                    break;
                case "5":
                    urlAxios = this.configAxios("11", formData);
                    break;
                case "4":
                    urlAxios = this.configAxios("19", formData);
                    break;
                case "7":
                    urlAxios = this.configAxios("20", formData);
                    break;
            }
            return urlAxios;
        },
        configAxios(index, formData) {
            return this.$axios.post(
                `/photo/${this.osId}/${index}/upload`,
                formData,
                uploadConfig
            );
        },
        chooseFile() {
            const imgFiles = {
                    "2": [],
                    "4": [],
                    "5": [],
                    "6": [],
                    "7": []
                },
                files = [];
            for (const key in this.fileData) {
                this.fileData[key]["fileData"].map(file => {
                    const formData = new FormData();
                    formData.append("file", file);
                    if (/image/.test(file.type)) {
                        const url = this.url(key, formData);
                        if (url) imgFiles[key].push(url);
                    } else {
                        files.push(
                            this.$axios.post(
                                `/fileUplod/${this.osId}/upload/${
                                    this.$route.query.id
                                }?type=${key}`,
                                formData,
                                uploadConfig
                            )
                        );
                    }
                });
            }
            const promiseFile = [];
            for (const key in imgFiles) {
                promiseFile.push(Promise.all(imgFiles[key]));
            }
            promiseFile.push(Promise.all(files));
            return promiseFile;
        },
        postFile(promiseFile, callback) {
            Promise.all(promiseFile).then(
                ([
                    bidingPhotosRes,
                    confirmPhotoRes,
                    acceptPhotosRes,
                    trainPhotosRes,
                    handlePhotosRes
                ]) =>
                    this.$axios
                        .post("/assetacceptance/savefile", {
                            assetId: this.$route.query.id,
                            assetAcceptPhoto: acceptPhotosRes.map(
                                res => res.data
                            ),
                            tenderBookPhoto: bidingPhotosRes.map(
                                res => res.data
                            ),
                            trainWordPhoto: trainPhotosRes.map(res => res.data),
                            trainWordType: this.trainWordType === true ? 1 : 0,
                            confirmPhoto: confirmPhotoRes.map(res => res.data),
                            handlePhoto: handlePhotosRes.map(res => res.data)
                        })
                        .then(() => {
                            this.$message.success("添加成功");
                            callback && callback();
                            this.$router.replace({
                                name: this.$route.name,
                                query: {
                                    ...this.$route.query,
                                    step: "2"
                                }
                            });
                        })
            );
        }
    }
};
</script>

<style scoped lang="less">
.tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .tabs-item {
        text-align: center;
        border: solid 1px rgba(0, 0, 0, 0.18);
        height: 120px;
        width: 20%;
        margin: 0 10px;
        cursor: pointer;
        // max-width: 259px;
        > i {
            font-size: 40px;
            margin-bottom: 20px;
            color: rgba(116, 128, 138, 0.3);
            margin-top: 20px;
        }
        &.active {
            border: solid 1px #6b8ee9;
            background: rgba(75, 116, 224, 0.1);
            > i {
                color: #6b8ee9;
            }
        }
        &:nth-of-type(1) {
            margin-left: 0;
        }
        &:nth-last-of-type(1) {
            margin-right: 0;
        }
        > p {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            > span {
                color: #f45428;
            }
        }
    }
}
.file-upload {
    margin-top: 15px;
}
</style>

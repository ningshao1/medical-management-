<template>
    <div class="accept-records kld-box-effect">
        <kld-title>资产验收文档</kld-title>
        <ul class="doc-type">
            <li>
                <div class="title">设备采购论证会议纪要：</div>
                <ul v-if="summaryFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in summaryFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
            <li>
                <div class="title">标书：</div>
                <ul v-if="tenderFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in tenderFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
            <li>
                <div class="title">设备安装要求：</div>
                <ul v-if="installFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in installFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
            <li>
                <div class="title">设备确认文件：</div>
                <ul v-if="confirmFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in confirmFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
            <li>
                <div class="title">培训文档：</div>
                <ul v-if="trainFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in trainFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
            <li>
                <div class="title">操作规程：</div>
                <ul v-if="handleFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in handleFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
            <li>
                <div class="title">安装验收报告：</div>
                <ul v-if="acceptFiles.length > 0" class="doc-list">
                    <li @click="download(file)" v-for="(file, index) in acceptFiles" :key="index">
                        <span>{{index + 1}}、</span>
                        <img class="file-type-img" :src="file.img">
                        <span class="filename">{{file.fileName}}</span>
                    </li>
                </ul>
                <p v-else>暂无文件</p>
            </li>
        </ul>
    </div>
</template>

<style lang="less" scoped>
.accept-records {
    border-top: 0;
    /*padding-top: 0;*/
    font-size: 14px;
}

.title {
    font-size: 16px;
    margin-bottom: 10px;
}
.doc-type {
    > li {
        padding: 24px 0;
        border-bottom: 1px solid #dedede;
        &:last-of-type {
            border-bottom: 0;
        }
    }
}
.doc-list {
    > li {
        line-height: 32px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .file-type-img {
            width: 18px;
            height: 18px;
            margin: 0 10px;
        }
        &:hover,
        &:active {
            background-color: #f2f2f2;
            .filename {
                color: #2195ec;
            }
        }
    }
}
</style>

<script>
import kldTitle from "./kld-title";
import wordImg from "@common/C-UploadFile/image/word.png";
import excelImg from "@common/C-UploadFile/image/excel.png";
import picImg from "@common/C-UploadFile/image/pict.png";
import txtImg from "./image/txt.png";
import serverAddress from "@common/Address";
const openDownload = (url, filename = "") => {
    const downloadLink = document.createElement("a"),
        event = document.createEvent("MouseEvents");
    event.initMouseEvent(
        "click",
        false,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        true,
        true,
        true,
        true,
        0,
        null
    );
    downloadLink.style.position = "absolute";
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.dispatchEvent(event);
    document.body.removeChild(downloadLink);
};
export default {
    name: "accept-records",
    components: { kldTitle },
    data() {
        return {
            wordImg,
            excelImg,
            picImg,
            txtImg,
            summaryFiles: [],
            tenderFiles: [],
            installFiles: [],
            confirmFiles: [],
            acceptFiles: [],
            handleFiles: [],
            trainFiles: []
        };
    },
    props: {
        loaded: Function
    },
    created() {
        this.getRecords().then(
            () => typeof this.loaded === "function" && this.loaded(),
            () => typeof this.loaded === "function" && this.loaded(false)
        );
    },
    computed: {
        assetId() {
            return this.$route.params.id;
        }
    },
    methods: {
        getRecords() {
            return this.$axios
                .get(`/assets/getFiles/${this.assetId}`)
                .then(({ data: { files, photos } }) => {
                    const summaryFiles = [],
                        tenderFiles = [],
                        installFiles = [],
                        confirmFiles = [],
                        acceptFiles = [],
                        handleFiles = [],
                        trainFiles = [];

                    // const data = files.concat(
                    //     photos.map(
                    //         ({photoUrl, type}) => ({
                    //             fileName: photoUrl.match(/\/(.*?)$/)[1],
                    //             url: photoUrl,
                    //             type
                    //         })
                    //     )
                    // );

                    for (const photo of photos) {
                        photo.fileName = photo.photoUrl.match(/.*\/(.*?)$/)[1];

                        photo.url = photo.photoUrl;

                        photo.img = this.picImg;

                        if (photo.type === 11) {
                            acceptFiles.push(photo);
                        } else if (photo.type === 12) {
                            tenderFiles.push(photo);
                        } else if (photo.type === 19) {
                            confirmFiles.push(photo);
                        } else if (photo.type === 20) {
                            handleFiles.push(photo);
                        } else if (photo.type === 14) {
                            trainFiles.push(photo);
                        }
                    }

                    for (const file of files) {
                        let img = "";

                        switch (file.fileName.match(/(\..*?)$/)[1]) {
                            case ".docx":
                            case ".doc":
                            case ".wps":
                                img = this.wordImg;
                                break;
                            case ".xlsx":
                            case ".xls":
                                img = this.excelImg;
                                break;
                            default:
                                img = this.txtImg;
                        }

                        file.img = img;

                        switch (file.type) {
                            case 1:
                                summaryFiles.push(file);
                                break;
                            case 2:
                                tenderFiles.push(file);
                                break;
                            case 3:
                                installFiles.push(file);
                                break;
                            case 4:
                                confirmFiles.push(file);
                                break;
                            case 5:
                                acceptFiles.push(file);
                                break;
                            case 6:
                                trainFiles.push(file);
                                break;
                            case 7:
                                handleFiles.push(file);
                                break;
                        }
                    }

                    this.summaryFiles = summaryFiles;
                    this.tenderFiles = tenderFiles;
                    this.installFiles = installFiles;
                    this.confirmFiles = confirmFiles;
                    this.acceptFiles = acceptFiles;
                    this.trainFiles = trainFiles;
                    this.handleFiles = handleFiles;
                });
        },
        download(file) {
            openDownload(serverAddress + file.url, file.fileName);
        }
    }
};
</script>
<template>
    <div class="doc-download kld-box-effect">
        <div class="doc-download-title">
            <kld-learn-more title="常用文档下载" target="form-manage">
                <template slot="title"></template>
            </kld-learn-more>
        </div>
        <ul class="doc-list" v-if="docFileList.length">
            <li v-for="file in docFileList" class="doc-item">
                <a href="javascript:" @click="downDocFile(file.url)" class="doc-download-btn" download>
                    <div :class="file.icon" class="doc-icon"></div>
                </a>
                <p class="doc-filename">{{file.filename}}</p>
            </li>
        </ul>
        <div v-else class="no-data">
            暂无数据
        </div>
    </div>
</template>

<style lang="less" scoped>
@border-color: #dcdcdc;
@border-active-color: #22a1b9;
@border-style: 1px solid @border-color;
@border-active-style: 1px solid @border-active-color;
.excel {
    background-image: url("~@/static/excel.png");
}
.pdf {
    background-image: url("~@/static/pdf.png");
}
.word {
    background-image: url("~@/static/word.png");
}

.doc-download {
    padding: 0;
    display: inline-block;
    width: 100%;
    min-height: 200px;
}

.doc-download-title {
    padding: 14px 20px;
    border-bottom: @border-style;
}

.doc-item {
    display: inline-block;
    vertical-align: top;
    margin: 20px;
    font-size: 14px;
    width: 120px;
    .doc-download-btn {
        height: 145px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border: @border-style;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s;
        border-radius: 4px;
        &::after {
            width: 100%;
            line-height: 30px;
            display: block;
            position: absolute;
            left: 0;
            bottom: 0;
            color: #fff;
            content: "下载";
            transition: transform 0.2s, box-shadow 0.2s;
            background-color: rgba(2, 31, 57, 0.45);
            transform: translate3d(0, 100%, 0);
            text-align: center;
        }
        &:hover {
            border-color: @border-active-color;
            &::after {
                transform: translate3d(0, 0, 0);
            }
        }
        .doc-icon {
            width: 65px;
            height: 65px;
            background-size: cover;
        }
    }
    .doc-filename {
        text-align: center;
        line-height: 18px;
        padding-top: 10px;
    }
}
.no-data {
    height: 100%;
    text-align: center;
    line-height: 200px;
    font-size: 16px;
}
</style>

<script>
import kldLearnMore from "@common/kld-learn-more/index";
export default {
    name: "doc-download",
    components: { kldLearnMore },
    data() {
        return {
            docFileList: []
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.getDocFileList();
    },
    methods: {
        getDocFileList() {
            return this.$axios
                .post("/fileUplod/filelist", {
                    limit: 8,
                    offset: 0,
                    params: {
                        osid: this.user_in.osId
                    }
                })
                .then(({ data: { data } }) => {
                    const docFileList = [];
                    for (const { fileName: filename, id , type } of data) {
                        if (type === 1) {
                            const extname = filename.match(/\..+$/)[0],
                                url = `/fileUplod/${id}`;

                            let icon = "";

                            switch (extname) {
                                case ".xls":
                                case ".xlsx":
                                    icon = "excel";
                                    break;
                                case ".pdf":
                                    icon = "pdf";
                                    break;
                                default:
                                    // case '.doc':
                                    // case '.docx':
                                    // case '.word':
                                    icon = "word";
                            }

                            docFileList.push({ filename, url, icon });
                        }
                    }

                    this.docFileList = docFileList;
                });
        },
        downDocFile(url) {
            this.$axios
                .get(url)
                .then(() => this.$Message.success("开始下载"));
        }
    }
};
</script>